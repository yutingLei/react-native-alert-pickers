// system
import React from "react";
import PropTypes from "prop-types";
import { Image, Text, TouchableOpacity } from "react-native";
import { APColor } from "../utils";

/**
 * 相册目录Cell
 */
export default class APAlbumRowCell extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    onPress: PropTypes.func
  };

  render() {
    let { id, title, count, onPress } = this.props;

    let containerStyle = {
      width: "100%",
      height: 65,
      padding: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderColor: APColor.Gray
    };

    let titleText = (
      <Text
        style={{ color: APColor.DeepBlue, fontSize: 17, fontWeight: "bold" }}
      >
        {title}
      </Text>
    );

    let countText = (
      <Text style={{ fontSize: 15, color: APColor.Gray }}>{` (${count})`}</Text>
    );

    let arraw = (
      <Image
        style={{ width: 15, height: 15, resizeMode: "contain" }}
        source={require("../source/arrow.png")}
      />
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={1}
        onPress={() => onPress && onPress(id)}
      >
        <Text>
          {titleText}
          {countText}
        </Text>
        {arraw}
      </TouchableOpacity>
    );
  }
}
