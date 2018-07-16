import React from "react";
import { Text, Image, TouchableOpacity, Platform } from "react-native";
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
   * image: 图片
   */
  static propsType = {
    font: PropTypes.object,
    title: PropTypes.string,
    style: PropTypes.object,
    enable: PropTypes.bool,
    disabledColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    onPress: PropTypes.func,
    leftImage: PropTypes.any,
    rightImage: PropTypes.any
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
      leftImage,
      rightImage,
      disabledColor,
      activeOpacity
    } = this.props;
    font = { ...defaultFont, ...font };
    style = { ...defaultStyle, ...style };
    font.color = enable ? font.color : disabledColor;

    let titleText = title ? <Text style={font}>{title}</Text> : null;

    let imageStyle =
      leftImage || rightImage
        ? {
            top: 15,
            width: 20,
            height: 20,
            position: "absolute",
            resizeMode: "contain"
          }
        : null;

    let left = leftImage ? (
      <Image
        style={{ left: 10, ...imageStyle, ...leftImage.style }}
        source={leftImage.source}
      />
    ) : null;

    let right = rightImage ? (
      <Image
        style={{ right: 10, ...imageStyle, ...rightImage.style }}
        source={rightImage.source}
      />
    ) : null;

    return (
      <TouchableOpacity
        style={style}
        disabled={!enable}
        activeOpacity={activeOpacity}
        onPress={() => onPress && onPress(title)}
      >
        {titleText}
        {left}
        {right}
      </TouchableOpacity>
    );
  }
}
