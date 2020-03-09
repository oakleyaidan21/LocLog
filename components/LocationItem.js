import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";

class LocationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: ""
    };
  }

  componentDidMount = () => {
    let date = new Date(this.props.data.timestamp);
    this.setState({
      time:
        (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        " " +
        (date.getHours() >= 12 ? "PM" : "AM"),
      date:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.mainContainer}>
          <View style={styles.date}>
            <Text>{this.props.index}</Text>
            <Text>{this.state.time}</Text>
            <Text style={{ fontSize: 40, fontWeight: "bold" }}>
              {this.state.date}
            </Text>
          </View>
          <View style={styles.location}>
            <Text>{this.props.data.coords.latitude}</Text>
            <Text>{this.props.data.coords.longitude}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "95%",
    borderColor: "black",
    borderWidth: 5,
    height: 100,
    margin: 5,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  date: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  location: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LocationItem;
