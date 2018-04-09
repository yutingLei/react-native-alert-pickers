import React, { Component } from "react";
import { Modal, Animated } from "react-native";

export default class ModalContainer extends Component {
  state = {
    visible: false,
    opacity: new Animated.Value(0)
  };

  show = () => {
    this.setState({ visible: true });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300
    }).start();
  };

  dismiss = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300
    }).start(() => this.setState({ visible: false }));
  };

  render() {
    let { modalType } = this.props;
    let { visible, opacity } = this.state;
    let containerStyle = {
      flex: 1,
      opacity,
      justifyContent: modalType === "alert" ? "center" : "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
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
