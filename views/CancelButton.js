import React, { PureComponent } from "react";
import { Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

export default class CancelButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    title: "Done"
  };

  render() {
    let { onPress, title } = this.props;

    return (
      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white"
        }}
        activeOpacity={0.75}
        onPress={() => onPress && onPress()}
      >
        <Text
          style={{ fontWeight: "bold", color: "deepskyblue", fontSize: 17 }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}
