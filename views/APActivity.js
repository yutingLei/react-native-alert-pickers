/**
 * 加载动画组件
 */
import React from "react";
import PropTypes from "prop-types";
import { View, Text, ActivityIndicator } from "react-native";
import { APColor } from "../utils";
// const
const defaultFont = {
  fontSize: 15,
  color: APColor.Gray,
  textAlign: "center"
};

export default class APActivity extends React.Component {
  /**
   * @prop size: Android可以通多传入number设置大小，iOS取值为('small', 'large')
   * @prop color: 设置颜色
   * @prop enable: 是否动画
   * @prop message: 加载提示信息
   * @prop messageFont: 提示信息配置
   */
  static propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    enable: PropTypes.bool,
    message: PropTypes.string,
    messageFont: PropTypes.object
  };

  static defaultProps = {
    color: APColor.Gray
  };

  render() {
    let { size, color, enable, message, messageFont } = this.props;

    let activity = (
      <ActivityIndicator
        size={size}
        color={color}
        animating={enable}
        hidesWhenStopped={true}
      />
    );

    let messageText = message ? (
      <Text style={{ ...defaultFont, ...messageFont }}>{message}</Text>
    ) : null;

    return (
      <View>
        {activity}
        {messageText}
      </View>
    );
  }
}
