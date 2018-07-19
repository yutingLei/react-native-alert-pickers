import React from "react";
import { View, Image, TextInput, Platform } from "react-native";
import PropTypes from "prop-types";
import { APColor } from "../utils";

const ios = Platform.OS === "ios";
let defaultFont = {
  color: "black",
  fontSize: 15
};

export default class APTextField extends React.Component {
  /**
   * font: 标题的相关风格
   * style: 按钮风格
   */
  static propsType = {
    font: PropTypes.object,
    config: PropTypes.object,
    regular: PropTypes.string,
    leftImage: PropTypes.any,
    rightImage: PropTypes.any,
    borderStyle: PropTypes.object,
    onFunctions: PropTypes.object
  };

  static defaultProps = {
    config: {
      allowFontScaling: false,
      autoCapitalize: "none",
      autoCorrect: false,
      clearButtonMode: "while-editing",
      returnKeyType: "done",
      selectionColor: ios ? APColor.DeepBlue : APColor.NativeAndroid
    }
  };

  render() {
    let {
      font,
      config,
      leftImage,
      rightImage,
      borderStyle,
      onFunctions
    } = this.props;
    font = { ...defaultFont, ...font };

    let imageStyle =
      leftImage || rightImage
        ? {
            width: 20,
            height: 20,
            resizeMode: "cover"
          }
        : null;

    let left = leftImage ? (
      <Image
        style={{ ...imageStyle, ...leftImage.style }}
        source={leftImage.source}
      />
    ) : null;

    let right = rightImage ? (
      <Image
        style={{ ...imageStyle, ...rightImage.style }}
        source={rightImage.source}
      />
    ) : null;

    let textField = (
      <TextInput
        style={{ ...font, flex: 1, height: 35, paddingLeft: 5 }}
        {...config}
        {...onFunctions}
      />
    );

    let containerStyle = {
      width: "100%",
      height: 45,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10
    };

    let contentStyle = {
      paddingLeft: 5,
      paddingRight: 5,
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: "white"
    };

    contentStyle = {
      ...Platform.select({
        ios: {
          ...contentStyle,
          borderWidth: 1,
          borderColor: APColor.Gray,
          borderRadius: 5,
          ...borderStyle
        },
        android: {
          ...contentStyle,
          ...borderStyle
        }
      })
    };

    return (
      <View style={containerStyle}>
        <View style={contentStyle}>
          {left}
          {textField}
          {right}
        </View>
      </View>
    );
  }
}
