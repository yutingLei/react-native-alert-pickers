// system
import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { APColor } from "../utils";

/**
 * 联系人
 */
export default class APContactCell extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    onPress: PropTypes.func
  };

  render() {
    let { name, phoneNumber, onPress } = this.props;

    let containerStyle = {
      height: 50,
      padding: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderColor: APColor.Gray
    };

    let nameText = (
      <Text style={{ fontSize: 15, fontWeight: "bold" }}>{name}</Text>
    );
    let numbersText = (
      <Text style={{ fontSize: 15, color: APColor.Gray }}>{phoneNumber}</Text>
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => onPress && onPress({ name, phoneNumber })}
      >
        {nameText}
        {numbersText}
      </TouchableOpacity>
    );
  }
}
