// system
import React from "react";
import PropTypes from "prop-types";
import { View, Text, Image, TouchableOpacity } from "react-native";
// custom
import { APColor } from "../utils";
import * as Source from "../source";

/**
 * 地理位置
 */
export default class APContactCell extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    code: PropTypes.string,
    name: PropTypes.string,
    dial_code: PropTypes.string,
    onPress: PropTypes.func
  };

  render() {
    let { mode, code, name, dial_code, onPress } = this.props;

    let containerStyle = {
      height: 50,
      alignItems: "center",
      flexDirection: "row"
    };

    let flagStyle = {
      width: 70,
      height: 35,
      resizeMode: "contain"
    };

    let contentStyle = {
      flex: 1,
      height: 50,
      paddingLeft: 10,
      justifyContent: "center",
      borderBottomWidth: 0.5,
      borderBottomColor: APColor.Gray
    };

    let flag = <Image style={flagStyle} source={Source.flags[code]} />;

    let codeAndName = (
      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
        {`${name}(${code})`}
      </Text>
    );

    let extNode =
      mode === "phoneCode" ? (
        <Text style={{ fontSize: 11, color: "grey" }}>{dial_code}</Text>
      ) : null;

    let content = (
      <View style={contentStyle}>
        {codeAndName}
        {extNode}
      </View>
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => onPress && onPress({ code, name, dial_code })}
      >
        {flag}
        {content}
      </TouchableOpacity>
    );
  }
}
