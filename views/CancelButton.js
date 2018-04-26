import React, { PureComponent } from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import PropTypes from "prop-types";
const ios = Platform.OS === "ios";

export default class CancelButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    titleColor: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    titleColor: "deepskyblue",
    disabled: false,
    title: "Done"
  };

  render() {
    let { onPress, title, disabled, titleColor } = this.props;

    return (
      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: ios ? 10 : 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white"
        }}
        disabled={disabled}
        activeOpacity={0.75}
        onPress={() => onPress && onPress()}
      >
        <Text style={{ fontWeight: "bold", color: titleColor, fontSize: 17 }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}
