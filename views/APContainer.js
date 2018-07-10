/**
 * Modal容器，可以对Opacity动画
 */
import React, { Component } from "react";
import { Modal, Animated } from "react-native";
import PropTypes from "prop-types";
import { APTime } from "../utils";

export default class APContainer extends Component {
  /**
   * mode: Modal模式，alert或action-sheet
   * content: 容器组件等
   * backgroundColor: 背景色
   */
  static propTypes = {
    mode: PropTypes.string,
    content: PropTypes.any,
    backgroundColor: PropTypes.string
  };

  static defaultProps = {
    mode: "alert",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  };

  state = {
    visible: false,
    opacity: new Animated.Value(0)
  };

  /**
   * 显示，使opacity(0 -> 1)
   * callback: 动画完成后的回调
   */
  show = callback => {
    this.setState({ visible: true });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: APTime.Default
    }).start(() => callback && callback());
  };

  /**
   * 消失，使opacity(1 -> 0)
   * 在Animated.end后，设置visible = false
   * callback: 动画完成后的回调
   */
  dismiss = callback => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: APTime.Default
    }).start(() => {
      this.setState({ visible: false }, () => callback && callback());
    });
  };

  render() {
    let { mode, backgroundColor } = this.props;
    let { visible, opacity } = this.state;
    let containerStyle = {
      flex: 1,
      opacity,
      justifyContent: mode === "alert" ? "center" : "flex-end",
      backgroundColor
    };

    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={() => this.dismiss()}
      >
        <Animated.View style={containerStyle}>
          {this.props.content}
        </Animated.View>
      </Modal>
    );
  }
}
