import React, { PureComponent } from "react";
import {
  View,
  Text,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ModalContainer from "./views/ModalContainer";
import CancelButton from "./views/CancelButton";
const { height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default class SimpleAlert extends PureComponent {
  static propTypes = {
    alertType: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    buttonsOption: PropTypes.arrayOf([PropTypes.object]),
    cancelIndex: PropTypes.number,
    cancelable: PropTypes.bool,
    onSelected: PropTypes.func
  };
  static defaultProps = {
    alertType: "alert",
    buttonsOption: [{ title: "Cancel", style: { color: "blue" } }],
    cancelIndex: 0
  };

  state = {
    opacity: new Animated.Value(0),
    translate: new Animated.Value(height)
  };

  _renderAlertContents = () => {
    let { opacity } = this.state;
    let contentStyle = {
      flex: 1,
      opacity,
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white"
    };

    return (
      <View style={contentStyle}>
        {this._renderTitleComponent()}
        {this._renderMessageComponent()}
      </View>
    );
  };

  _renderTitleComponent = () => {
    let { title, alertType } = this.props;
    let titleStyle = {
      color: alertType === "alert" ? "black" : "darkgray",
      fontSize: alertType === "alert" ? 17 : 14,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <Text style={titleStyle} numberOfLines={2}>
        {title}
      </Text>
    );
  };

  _renderMessageComponent = () => {
    let { message, alertType } = this.props;
    let messageStyle = {
      paddingTop: 10,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 10,
      color: alertType === "alert" ? "black" : "gray",
      fontSize: alertType === "alert" ? 14 : 11,
      textAlign: "center"
    };
    return <Text style={messageStyle}>{message}</Text>;
  };

  render() {
    let { alertType } = this.props;
    return (
      <ModalContainer
        ref={r => (this.modal = r)}
        content={alertType === "alert" ? null : null}
      />
    );
  }
}
