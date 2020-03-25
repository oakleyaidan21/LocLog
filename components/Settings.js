import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput
} from "react-native";
import PickerButton from "./PickerButton";
import { CheckBox } from "react-native-elements";
import NumberPicker from "./NumberPicker";

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
        <NumberPicker
          min={1}
          max={720}
          title={"time"}
          onSelect={selection => {
            this.setState({ selectedTime: selection.toString() });
          }}
        />
        <Text>Tracking Distance Interval (in km):</Text>
        <NumberPicker
          min={1}
          max={100}
          title={"distance"}
          onSelect={selection => {
            this.setState({ selectedDistance: selection.toString() });
          }}
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
                  this.state.selectedTime === "0" ||
                  this.state.selectedDistance === "0"
                    ? "grey"
                    : "#2089dc",
                borderColor:
                  this.state.selectedTime === "0" ||
                  this.state.selectedDistance === "0"
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
