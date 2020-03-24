import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

var data = [];

class NumberPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    for (let i = this.props.min; i <= this.props.max; i++) {
      data.push({ id: i, num: i });
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          style={{ flex: 1 }}
          data={data}
          horizontal={true}
          keyExtractor={item => item.id.toString() + this.props.title}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 2,
                height: 60,
                backgroundColor: "black",
                margin: 10
              }}
            />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.number}
              onPress={() => {
                this.props.onSelect(item.num);
              }}
            >
              <Text
                style={[
                  styles.numberText,
                  item.num === this.props.max ? { borderRightWidth: 0 } : {}
                ]}
              >
                {item.num}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 60,
    width: "90%",
    margin: 5
  },
  number: {
    justifyContent: "center",
    alignItems: "center"
  },
  numberText: {
    fontSize: 30
  }
});

export default NumberPicker;
