import React, { PureComponent } from "react";
import {
  View,
  Text,
  Alert,
  Slider,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ActionSheet from "./views/ActionSheetView";
import CancelButton from "./views/CancelButton";

export default class SimpleAlert extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.object),
    cancelIndex: PropTypes.number,
    alertType: PropTypes.string,
    onTouched: PropTypes.func
  };

  static defaultProps = {
    buttons: [{ title: "Done", color: "deepskyblue" }],
    cancelIndex: 0,
    alertType: "alert" // otherwise: actionSheet
  };

  state = {
    visible: false
  };

  _show = () => {
    this.setState({ visible: true });
    if (this.props.alertType !== "alert") {
      this.ref._show();
    }
  };

  _contentHeight = () => {
    let { title, message, buttons } = this.props;
    this.titleHeight = title || message ? 50 : 0;
    return this.titleHeight + buttons.length * 51 + 30;
  };

  _renderTitleMessage = () => {
    let { title, message, alertType } = this.props;
    let titleComp, messageComp;

    if (title) {
      titleComp = (
        <Text
          style={{
            fontSize: 13,
            color: "rgb(160, 160, 160)",
            textAlign: "center",
            fontWeight: "bold"
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      );
    }

    if (message) {
      messageComp = (
        <Text
          style={{
            fontSize: 11,
            color: "rgb(180,180,180)",
            textAlign: "center"
          }}
          numberOfLines={1}
        >
          {message}
        </Text>
      );
    }
    let height = title || message ? 50 : 0;
    return (
      <View
        style={{ height: this.titleHeight, justifyContent: "space-around" }}
      >
        {titleComp}
        {messageComp}
      </View>
    );
  };

  _renderButtons = () => {
    let { buttons, cancelIndex } = this.props;
    cancelIndex = Math.min(buttons.length - 1, cancelIndex);

    return buttons.map(element => {
      if (element.title !== buttons[cancelIndex].title) {
        return (
          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgb(250, 250, 250)"
            }}
            onPress={() => this._onPress(element.title)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: element.color || "blue",
                fontSize: 17
              }}
            >
              {element.title}
            </Text>
          </TouchableOpacity>
        );
      }
    });
  };

  _renderContent = () => {
    let height = (this.props.buttons.length - 1) * 51 + this.titleHeight;
    return (
      <View style={[styles.content, { height }]}>
        {this._renderTitleMessage()}
        {this._renderButtons()}
      </View>
    );
  };

  _renderCancel = () => {
    let { buttons, cancelIndex } = this.props;
    cancelIndex = Math.min(buttons.length - 1, cancelIndex);

    let cancelTitle = buttons[cancelIndex].title || "Done";

    return (
      <CancelButton
        title={cancelTitle}
        onPress={() => this._onPress(cancelTitle)}
      />
    );
  };

  _onPress = title => {
    this.title = title;
    this.ref._dismiss && this.ref._dismiss();
  };

  render() {
    let {
      title,
      message,
      buttons,
      cancel,
      cancelIndex,
      alertType,
      onTouched
    } = this.props;
    if (alertType.toLowerCase() === "alert") {
      if (this.state.visible) {
        let newButtons = [];
        buttons.map(element => {
          newButtons.push({
            text: element.title,
            style: element.style,
            onPress: () => onTouched(element.title)
          });
        });
        Alert.alert(title, message, newButtons, { cancelable: true });
      }
      return null;
    } else {
      return (
        <ActionSheet
          ref={r => (this.ref = r)}
          content={this._renderContent()}
          contentHeight={this._contentHeight()}
          cancel={this._renderCancel()}
          onDismissed={() => onTouched && onTouched(this.title)}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "space-between",
    backgroundColor: "rgb(245, 245, 245)"
  }
});
