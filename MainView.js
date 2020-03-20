import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  View,
  StatusBar
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
        await AsyncStorage.setItem("timeInterval", "360");
        await AsyncStorage.setItem("distanceInterval", "5");
        timeInt = 360;
        distInt = 5;
      }
    } catch (error) {
      console.log("error getting storage in mainview", error);
    }
    this.setState({ loading: false });
    Location.startLocationUpdatesAsync("fetchLoc", {
      accuracy: Location.Accuracy.Low,
      timeInterval: parseInt(timeInt) * 60000, //7 hours in milliseconds
      distanceInterval: Platform.OS === "ios" ? parseInt(distInt) * 1000 : 0, //in km
      pausesUpdatesAutomatically: true
    });
  };
  render() {
    console.log(this.state.timeInterval, this.state.distanceInterval);
    return (
      <SafeAreaView style={styles.mainContainer}>
        {Platform.OS === "ios" ? (
          <StatusBar
            backgroundColor="blue"
            barStyle="dark-content"
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
              changeSettings={async (time, distance) => {
                try {
                  await AsyncStorage.setItem("timeInterval", time);
                  await AsyncStorage.setItem("distanceInterval", distance);
                } catch (error) {
                  console.log("error setting new settings", error);
                }
              }}
            />
          </ModalContent>
        </Modal>

        <Header
          leftComponent={
            <Icon
              name="settings"
              color="#fff"
              onPress={() => {
                this.setState({ showSettingsModal: true });
              }}
            />
          }
          centerComponent={{ text: "LOCATIONS", style: { color: "#fff" } }}
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
                  await MailComposer.composeAsync({
                    subject: "Location Data from LocLog",
                    body: csv
                  });
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
            <ActivityIndicator />
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
              keyExtractor={item =>
                item.timestamp + item.coords.latitude + item.coords.longitude
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
              <ActivityIndicator color={"black"} size="large" />
            ) : (
              <Icon name="add" size={40} />
            )}
          </TouchableOpacity>
        )}
      </SafeAreaView>
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
