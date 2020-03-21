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
      time: "",
      height: 100
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
      <TouchableOpacity
        onPress={() => {
          this.setState({ height: this.state.height === 100 ? 200 : 100 });
        }}
      >
        <View style={[styles.mainContainer, { height: this.state.height }]}>
          <View style={styles.date}>
            {/* <Text>{this.props.index}</Text> */}
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>
              {this.state.date}
            </Text>
            {this.state.height === 100 ? (
              <></>
            ) : (
              <Text style={{ fontSize: 25 }}>{this.state.time}</Text>
            )}
          </View>
          <View style={styles.location}>
            {this.state.height === 100 ? (
              <View>
                <Text style={styles.collapsedData}>
                  ({Math.round(this.props.data.coords.latitude * 100) / 100},
                  {Math.round(this.props.data.coords.longitude * 100) / 100})
                </Text>
              </View>
            ) : (
              <View>
                <Text>Latitude: {this.props.data.coords.latitude}</Text>
                <Text>Longitude: {this.props.data.coords.longitude}</Text>
                <Text>
                  Altitude:{" "}
                  {Math.round(this.props.data.coords.altitude * 10000000) /
                    10000000}
                </Text>
                <Text>
                  Heading:{" "}
                  {Math.round(this.props.data.coords.heading * 10000000) /
                    10000000}
                </Text>
                <Text>Speed: {Math.round(this.props.data.coords.speed)}</Text>
              </View>
            )}
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
    margin: 5,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
    padding: 5
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
  },
  collapsedData: {
    fontSize: 25
  }
});

export default LocationItem;
