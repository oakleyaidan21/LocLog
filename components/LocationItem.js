import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";

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
      time: date.getHours() + ":" + date.getMinutes(),
      date:
        date.getMonth() +
        1 +
        "/" +
        (date.getDay() + 1) +
        "/" +
        date.getFullYear()
    });
  };

  render() {
    // console.log(this.props.data);
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(this.props);
        }}
      >
        <View style={styles.mainContainer}>
          {/* <Text>Logged at {this.props.data.timestamp}</Text>
        <Text>Lat: {JSON.stringify(this.props.data.coords)}</Text> */}
          <View style={styles.date}>
            <Text>{this.props.index}</Text>
            <Text style={{ fontSize: 40, fontWeight: "bold" }}>
              {this.state.date}
            </Text>
          </View>
          <View style={styles.location}>
            <Text>{this.props.data.coords.latitude}</Text>
            <Text>{this.props.data.coords.longitude}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
