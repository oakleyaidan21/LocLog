import React from "react";
import MainView from "./MainView";
import { AsyncStorage } from "react-native";
import { Notifications } from "expo";
import * as TaskManager from "expo-task-manager";
export default function App() {
  return <MainView />;
}

const getData = async () => {
  try {
    let value = await AsyncStorage.getItem("locations");
    if (value !== null) {
      return value;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error fetching locations", error);
  }
};

TaskManager.defineTask("fetchLoc", async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    //get locations from local storage, convert to json, push latest locations,
    //convert back to string and reset local storage
    let pastLocations = await getData();
    //first time
    if (pastLocations === false) {
      try {
        await AsyncStorage.setItem("locations", JSON.stringify(locations));
      } catch (error) {
        console.log("error in first time setting", error);
      }
    } else {
      //adding to storage
      let newLocations = JSON.parse(pastLocations);
      for (var i = 0; i < locations.length; i++) {
        newLocations.push(locations[i]);
      }
      try {
        AsyncStorage.setItem("locations", JSON.stringify(newLocations));
      } catch (error) {
        console.log("error in adding new locations", error);
      }
    }
    //send local notification saying data was recorded
    await Notifications.createChannelAndroidAsync("locationRecorded", {
      name: "Location Recorded",
      sound: true
    });
    let noti = {
      title: "Location Recorded",
      body: "Your location was just recorded in the background by LogLoc.",
      android: {
        color: "orange",
        channelId: "locationRecorded",
        icon: "./assets/icon.png"
      }
    };
    await Notifications.presentLocalNotificationAsync(noti);
  }
});
