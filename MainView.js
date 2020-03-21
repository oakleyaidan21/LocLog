import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  View,
  StatusBar,
  Image
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import LocationItem from "./components/LocationItem";
import Settings from "./components/Settings";
import { Header, Icon } from "react-native-elements";
import Modal, {
  ModalContent,
  ModalTitle,
  SlideAnimation
} from "react-native-modals";
import * as MailComposer from "expo-mail-composer";

import BackgroundTimer from "react-native-background-timer";
import { Notifications } from "expo";

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      loading: true,
      addingLocation: false,
      permissionGiven: false,
      showSettingsModal: false,
      distanceInterval: 0,
      timeInterval: 0
    };
  }

  setTimer = async (minutes, checked) => {
    BackgroundTimer.runBackgroundTimer(async () => {
      //get locations
      await Location.getCurrentPositionAsync({}).then(async loc => {
        let newLocations = this.state.locations;
        newLocations.push(loc);
        console.log("getting location!");
        //add to asyncStorage
        try {
          await AsyncStorage.setItem("locations", JSON.stringify(newLocations));
        } catch (error) {
          console.log("error adding one time location", error);
        }
        //send notification
        let noti = {
          title: "Location Recorded",
          body: "Your location was just recorded in the background by LogLoc.",
          android: {
            color: "orange",
            channelId: "locationRecorded",
            icon: "./assets/icon.png"
          }
        };
        if (checked) {
          await Notifications.presentLocalNotificationAsync(noti);
        }

        //add to state
        this.setState({ locations: newLocations });
      });
    }, minutes * 60000); //60 minutes will be the default
  };

  onFirstOpen = async () => {
    //setup background timer
    this.setTimer(60, true);
    this.oneTimeLocation();
    alert(
      "Your location will be marked down every 60 minutes. You can change this using the settings modal in the top left."
    );
  };

  convertToCSV = () => {
    var json = this.state.locations;
    var fields = Object.keys(json[0].coords);
    fields.push("timestamp(unix)");
    let csv = "";
    for (let i = 0; i < json.length; i++) {
      let row = "";
      for (let j = 0; j < Object.keys(json[i].coords).length; j++) {
        row += json[i].coords[Object.keys(json[i].coords)[j]].toString() + ",";
      }
      csv += row + json[i].timestamp.toString() + "\n";
    }
    fields = fields.join(",");
    return fields + "\n" + csv;
  };

  oneTimeLocation = async () => {
    this.setState({ addingLocation: true });
    await Location.getCurrentPositionAsync({}).then(async loc => {
      let newLocations = this.state.locations;
      newLocations.push(loc);
      //add to asyncStorage
      try {
        await AsyncStorage.setItem("locations", JSON.stringify(newLocations));
      } catch (error) {
        console.log("error adding one time location", error);
      }
      //add to state
      this.setState({ locations: newLocations, addingLocation: false });
    });
  };

  componentDidMount = async () => {
    //ask permissions
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      this.setState({ permissionGiven: true });
    }
    let { notificationStatus } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS
    );

    let timeInt = 0;
    let distInt = 0;

    //get locations and settings from local storage
    try {
      let locations = await AsyncStorage.getItem("locations");
      if (locations !== null) {
        this.setState({
          locations: JSON.parse(locations).sort(function(a, b) {
            return b.timestamp - a.timestamp;
          })
        });
      } else {
        //setup first timer
        this.onFirstOpen();
      }
      timeInt = await AsyncStorage.getItem("timeInterval");
      distInt = await AsyncStorage.getItem("distanceInterval");
      if (timeInt !== null) {
        this.setState({
          timeInterval: parseInt(timeInt),
          distanceInterval: parseInt(distInt)
        });
      } else {
        //first time setup for settings
        await AsyncStorage.setItem("timeInterval", "60");
        await AsyncStorage.setItem("distanceInterval", "5");
        timeInt = 360;
        distInt = 5;
      }
    } catch (error) {
      console.log("error getting storage in mainview", error);
    }
    this.setState({ loading: false });
  };

  render() {
    console.log(this.state.timeInterval, this.state.distanceInterval);
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === "ios" ? (
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
            translucent
          />
        ) : (
          <></>
        )}
        <Modal
          modalTitle={<ModalTitle title="Settings" />}
          visible={this.state.showSettingsModal}
          onTouchOutside={() => {
            this.setState({ showSettingsModal: false });
          }}
          modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        >
          <ModalContent>
            <Settings
              hide={() => {
                this.setState({ showSettingsModal: false });
              }}
              changeSettings={async (time, distance, checked) => {
                //stop background timer
                BackgroundTimer.stopBackgroundTimer();
                //start new one with new timer
                this.setTimer(time, checked);
                try {
                  await AsyncStorage.setItem("timeInterval", time);
                  await AsyncStorage.setItem("distanceInterval", distance);
                } catch (error) {
                  console.log("error setting new settings", error);
                }
                this.setState({
                  timeInterval: time,
                  distanceInterval: distance
                });
              }}
            />
          </ModalContent>
        </Modal>

        <Header
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                this.setState({ showSettingsModal: true });
              }}
            >
              <Icon name="settings" color="#fff" />
            </TouchableOpacity>
          }
          centerComponent={
            <Image
              style={{ width: 40, height: 40 }}
              source={require("./assets/logo.png")}
            />
          }
          rightComponent={
            <TouchableOpacity
              onPress={async () => {
                if (this.state.locations.length === 0) {
                  alert(
                    "No locations to export yet! Try clearing the app in the dock and reloading"
                  );
                } else {
                  //convert state to CSV
                  let csv = this.convertToCSV();
                  // send in an email
                  try {
                    await MailComposer.composeAsync({
                      subject: "Location Data from LogLoc",
                      body: csv
                    });
                  } catch (error) {
                    console.log("error sending email", error);
                    alert(
                      "you must set up your mail application in order to use this feature"
                    );
                  }
                }
              }}
            >
              <Icon name="file-upload" color="#fff" />
            </TouchableOpacity>
          }
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {this.state.loading ? (
            <ActivityIndicator size="large" color="#2089dc" />
          ) : this.state.permissionGiven === false ? (
            <Text style={{ textAlign: "center" }}>
              Location Permissions not given. In order to use this app, you must
              give this app location permissions all the time to utilize it.
            </Text>
          ) : this.state.locations.length === 0 ? (
            <Text style={{ textAlign: "center", alignSelf: "center" }}>
              No locations yet. Refresh the app and they'll appear
            </Text>
          ) : (
            <FlatList
              data={this.state.locations}
              renderItem={({ item, index }) => (
                <LocationItem data={item} index={index} />
              )}
              style={{
                flex: 1,
                width: "100%"
              }}
              keyExtractor={(item, index) =>
                (
                  item.timestamp +
                  item.coords.latitude +
                  item.coords.longitude +
                  index
                ).toString()
              }
            />
          )}
        </View>
        {this.state.locations.length > 0 && (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => {
              this.oneTimeLocation();
            }}
            disabled={this.state.addingLocation}
          >
            {this.state.addingLocation ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Icon name="add" size={40} color="white" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2089dc",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default MainView;
