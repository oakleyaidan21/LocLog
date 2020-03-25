import React, { Component } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { Icon } from "react-native-elements";

class NumberPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedIndex: -1
    };
  }

  setData = () => {
    let tempData = [];
    for (let i = this.props.min; i <= this.props.max; i++) {
      tempData.push({ id: i, num: i, selected: false });
    }
    this.setState({ data: tempData });
  };

  componentDidMount = () => {
    this.setData();
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Icon name="chevron-left" />
        <FlatList
          style={{ width: "90%" }}
          data={this.state.data}
          horizontal={true}
          keyExtractor={item => item.id.toString() + this.props.title}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.spacer} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.number}
              onPress={() => {
                this.props.onSelect(item.num);
                this.setState({ selectedIndex: item.num });
              }}
            >
              <Text
                style={[
                  styles.numberText,
                  item.num === this.props.max ? { borderRightWidth: 0 } : {},
                  item.num === this.state.selectedIndex
                    ? { color: this.props.selectionColor, fontWeight: "bold" }
                    : {}
                ]}
              >
                {item.num}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Icon name="chevron-right" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 60,
    width: "90%",
    margin: 5,
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center"
  },
  number: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  spacer: {
    width: 2,
    backgroundColor: "black",
    margin: 10
  },
  numberText: {
    fontSize: 30
  }
});

export default NumberPicker;
