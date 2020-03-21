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
