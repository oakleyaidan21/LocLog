import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PickerButton from "./PickerButton";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: "0",
      selectedDistance: "0"
    };
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text>Tracking Time Interval (in minutes):</Text>
        <PickerButton
          data={["60", "120", "240", "360", "720", "1440"]}
          onSelection={selected => {
            this.setState({ selectedTime: selected });
          }}
          selectedColor="#2089dc"
          selectedTextColor="white"
        />
        <Text>Tracking Distance Interval (in km):</Text>
        <PickerButton
          data={["1", "5", "10", "50", "100"]}
          onSelection={selected => {
            this.setState({ selectedDistance: selected });
          }}
          selectedColor="#2089dc"
          selectedTextColor="white"
        />
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: "#2089dc", borderColor: "#2089dc" }
            ]}
            onPress={() => {
              //deal with local storage settings
              this.props.changeSettings(
                this.state.selectedTime,
                this.state.selectedDistance
              );
              this.props.hide();
            }}
            disabled={
              this.state.selectedTime === "0" ||
              this.state.selectedDistance === "0"
            }
          >
            <Text style={{ color: "white" }}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => {
              //do nothing, cancel
              this.props.hide();
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomButtonContainer: {
    flexDirection: "row"
  },
  bottomButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    margin: 5
  }
});

export default Settings;
