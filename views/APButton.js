import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import PropTypes from "prop-types";
import { APColor } from "../utils";

const ios = Platform.OS === "ios";
let defaultFont = {
  color: "black",
  fontSize: 17,
  textAlign: "center"
};
let defaultStyle = {
  height: 50,
  borderRadius: ios ? 10 : 0,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white"
};

export default class APButton extends React.Component {
  /**
   * font: 标题的相关风格
   * title: 标题
   * style: 按钮风格
   * enable: 是否可点击
   * disabledColor: 失能状态下标题颜色
   * activeOpacity: 点击按钮透明度
   * onPress: 点击回调，参数为标题
   */
  static propsType = {
    font: PropTypes.object,
    title: PropTypes.string,
    style: PropTypes.object,
    enable: PropTypes.bool,
    disabledColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    onPress: PropTypes.func
  };

  static defaultProps = {
    enable: true,
    disabledColor: APColor.Gray,
    activeOpacity: 0.8
  };

  render() {
    let {
      font,
      title,
      style,
      enable,
      onPress,
      disabledColor,
      activeOpacity
    } = this.props;
    font = { ...defaultFont, ...font };
    style = { ...defaultStyle, ...style };
    font.color = enable ? font.color : disabledColor;

    return (
      <TouchableOpacity
        style={style}
        disabled={!enable}
        activeOpacity={activeOpacity}
        onPress={() => onPress && onPress(title)}
      >
        <Text style={font}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
