import React, { PureComponent } from "react";
import {
  View,
  Text,
  Slider,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

const CancelButton = require("./views/CancelButton");
const height = Dimensions.get("window").height;

export default class SimpleAlert extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    buttonTitles: PropTypes.arrayOf(PropTypes.string),
    cancelButtonIndex: PropTypes.number,
    alertType: PropTypes.string,
    onButtonTouched: PropTypes.func
  };

  static defaultProps = {
    cancelButtonIndex: 0,
    alertType: "alert" // otherwise: actionSheet
  };

  state = {
    opacity: new Animated.Value(0),
    offsetY: new Animated.Value(height)
  };

  render() {
    let { title, message, alertType, buttonTitles, visible } = this.props;
    let { opacity, offsetY } = this.state;

    return (
      <Modal visible={this.props.visible} transparent animationType="none">
        <Animated.View style={[styles.background, { opacity }]}>
          <View style={{ flex: 1 }} />

          <Animated.View
            style={[styles.container, { transform: [{ translateY: offsetY }] }]}
          >
            {this._createContents()}
            <CancelButton title="Done" onPress={this._dismissModal} />
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
    height: "75%",
    paddingBottom: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.0)"
  },
  content: {
    flex: 0.95,
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    backgroundColor: "rgb(250, 250, 250)"
  },
  title: {
    fontSize: 15,
    textAlign: "center"
  }
});
