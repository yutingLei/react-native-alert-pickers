import React, { Component } from "react";
import {
  Modal,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./CancelButton";

const height = Dimensions.get("window").height;

export default class ContainerView extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.node.isRequired,
    cancel: PropTypes.node,
    contentHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    onDismissed: PropTypes.func
  };

  state = {
    opacity: new Animated.Value(0),
    offsetY: new Animated.Value(height)
  };

  componentWillReceiveProps(newProps) {
    this._animated(newProps.visible);
  }

  _animated = animate => {
    if (animate) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300
      }).start();
      Animated.timing(this.state.offsetY, {
        toValue: 0,
        duration: 300
      }).start();
    }
  };

  _dismiss = () => {
    Animated.timing(this.state.offsetY, {
      toValue: height,
      duration: 300
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 350
    }).start(() => {
      this.props.onDismissed && this.props.onDismissed();
    });
  };

  render() {
    let { visible, content, cancel, contentHeight } = this.props;
    let { opacity, offsetY } = this.state;
    if (!visible) {
      return <View />;
    }
    return (
      <Modal visible={visible} transparent animationType="none">
        <Animated.View style={[styles.background, { opacity }]}>
          <View style={{ flex: 1 }} />

          <Animated.View
            style={[
              styles.container,
              { height: contentHeight, transform: [{ translateY: offsetY }] }
            ]}
          >
            {content}
            {cancel}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  container: {
    paddingBottom: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.0)"
  }
});
