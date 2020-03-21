import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PickerButton from "./PickerButton";
import { CheckBox } from "react-native-elements";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: "0",
      selectedDistance: "0",
      checked: true
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
        <CheckBox
          title="Send notifications?"
          checked={this.state.checked}
          onPress={() => this.setState({ checked: !this.state.checked })}
        />
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              {
                backgroundColor:
                  this.state.selectedTime === 0 ||
                  this.state.selectedDistance === 0
                    ? "grey"
                    : "#2089dc",
                borderColor:
                  this.state.selectedTime === 0 ||
                  this.state.selectedDistance === 0
                    ? "grey"
                    : "#2089dc"
              }
            ]}
            onPress={() => {
              //deal with local storage settings
              this.props.changeSettings(
                this.state.selectedTime,
                this.state.selectedDistance,
                this.state.checked
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
