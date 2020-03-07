import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import LocationItem from "./components/LocationItem";
import { Header } from "react-native-elements";
class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      loading: true
    };
  }

  static getLocations = async () => {};

  componentDidMount = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    Location.startLocationUpdatesAsync("fetchLoc", {
      accuracy: Location.Accuracy.Balanced
    });

    //get localstorage
    try {
      let value = await AsyncStorage.getItem("locations");
      if (value !== null) {
        this.setState({ locations: JSON.parse(value) });
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
    // alignItems: "center",
    // justifyContent: "center"
  }
});

export default MainView;
