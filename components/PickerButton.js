import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity
} from "react-native";

class PickerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      prev: -1
    };
  }

  componentDidMount = () => {
    let selectedButtons = [];
    for (let i = 0; i < this.props.data.length; i++) {
      selectedButtons.push(false);
    }
    this.setState({ selected: selectedButtons });
  };
  render() {
    return (
      <View style={styles.mainContainer}>
        {this.props.data.map((d, index) => (
          <TouchableOpacity
            key={d + index}
            onPress={() => {
              let selectedButtons = this.state.selected;
              selectedButtons[index] = true;
              if (this.state.prev !== -1) {
                selectedButtons[this.state.prev] = false;
              }
              this.setState({ selected: selectedButtons, prev: index });
              this.props.onSelection(d);
            }}
            style={{
              borderWidth: 1,
              borderColor: this.state.selected[index]
                ? this.props.selectedColor
                : "black",
              borderRadius: 5,
              margin: 5,
              padding: 10,
              backgroundColor: this.state.selected[index]
                ? this.props.selectedColor
                : "transparent"
            }}
            underlayColor="transparent"
          >
            <Text
              style={{
                color: this.state.selected[index]
                  ? this.props.selectedTextColor
                  : "black"
              }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default PickerButton;
