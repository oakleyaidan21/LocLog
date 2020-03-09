import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import LocationItem from "./components/LocationItem";
import { Header, Icon } from "react-native-elements";
class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      loading: true,
      addingLocation: false
    };
  }

  oneTimeLocation = async () => {
    this.setState({ addingLocation: true });
    await Location.getCurrentPositionAsync({}).then(async loc => {
      let newLocations = this.state.locations;
      newLocations.unshift(loc);
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
    let { notificationStatus } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS
    );
    Location.startLocationUpdatesAsync("fetchLoc", {
      accuracy: Location.Accuracy.Low,
      timeInterval: 300000,
      distanceInterval: 5,
      pausesUpdatesAutomatically: true
    });

    //get localstorage
    try {
      let value = await AsyncStorage.getItem("locations");
      if (value !== null) {
        this.setState({ locations: JSON.parse(value).reverse() });
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log("error getting storage in mainview", error);
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          leftComponent={{ icon: "settings", color: "#fff" }}
          centerComponent={{ text: "LOCATIONS", style: { color: "#fff" } }}
          rightComponent={{
            icon: "file-upload",
            color: "#fff"
          }}
        />
        {this.state.loading ? (
          <ActivityIndicator />
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
            keyExtractor={item => item.timestamp}
          />
        )}
        {this.state.locations.length > 0 && (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => {
              this.oneTimeLocation();
            }}
            disabled={this.state.addingLocation}
          >
            {this.state.addingLocation ? (
              <ActivityIndicator color={"black"} />
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
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default MainView;
