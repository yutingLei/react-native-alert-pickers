// system
import React, { PureComponent } from "react";
import {
  View,
  Text,
  Animated,
  Platform,
  TextInput,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
// custom
import { APTime, APColor } from "../utils";
import APContainer from "../views/APContainer";
import APButton from "../views/APButton";
// const
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const margins = {
  marginTop: 10,
  marginLeft: 15,
  marginRight: 15
};

export default class APAlert extends PureComponent {
  alert = APAlertConfig => {
    this.setState({ ...APAlertConfig, alertType: "alert" }, () =>
      this.content.show()
    );
  };

  actionSheet = APAlertConfig => {
    this.setState({ ...APAlertConfig, alertType: "action-sheet" }, () =>
      this.content.show()
    );
  };

  show = SimpleAlertConfig => {
    this.setState({ ...SimpleAlertConfig }, () => this.content.show());
  };

  render() {
    return <APAlertContent {...this.state} ref={r => (this.content = r)} />;
  }
}

/**
 * Alert
 */
class APAlertContent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    alertButtons: PropTypes.arrayOf(PropTypes.object),
    cancelIndex: PropTypes.number,
    onPress: PropTypes.func
  };

  static defaultProps = {
    alertButtons: [{ title: "取消" }],
    cancelIndex: 0
  };

  show = () => {
    this.modal.show();
  };

  dismiss = val => {
    this.modal.dismiss(() => {
      let { onPress } = this.props;
      onPress && onPress(val);
    });
  };

  render() {
    let content = this._renderAlertContent();

    return (
      <APContainer
        ref={r => (this.modal = r)}
        modalType="alert"
        content={content}
      />
    );
  }

  _renderAlertContent = () => {
    let containerStyle = {
      width: "70%",
      overflow: "hidden",
      alignSelf: "center",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white"
    };

    return (
      <Animated.View ref="container" style={containerStyle}>
        {this._renderTitle()}
        {this._renderMessage()}
        {this._renderButtons()}
      </Animated.View>
    );
  };

  /**
   * Render title
   */
  _renderTitle = () => {
    let { title } = this.props;
    if (!title) {
      return null;
    }

    let titleStyle = {
      color: "black",
      fontSize: 17,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <View ref="title" style={{ ...margins }}>
        <Text
          style={titleStyle}
          numberOfLines={2}
          onLayout={event => this._layout("title", event)}
        >
          {title}
        </Text>
      </View>
    );
  };

  /**
   * Render message
   */
  _renderMessage = () => {
    let { message } = this.props;
    if (!message) {
      return null;
    }

    let messageContainer = {
      ...margins,
      overflow: "hidden"
    };

    let messageFont = {
      fontSize: 14,
      textAlign: "center"
    };

    return (
      <View ref="message" style={messageContainer}>
        <TextInput
          style={messageFont}
          value={message}
          editable={false}
          multiline={true}
          dataDetectorTypes="all"
          onLayout={event => this._layout("message", event)}
          underlineColorAndroid={APColor.Clear}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  /**
   * Render alert's buttons
   */
  _renderButtons = () => {
    let { alertButtons, cancelIndex } = this.props;

    /// cancel
    let cancel = alertButtons[cancelIndex];
    alertButtons.splice(cancelIndex, 1);
    alertButtons.push({ font: { color: "red" }, ...cancel });

    /// buttons
    return (
      <View style={{ height: alertButtons.length * 45 }}>
        {alertButtons.map(button => (
          <APButton
            key={button.title}
            {...{
              ...button,
              style: {
                height: 45,
                borderRadius: 0,
                borderTopWidth: 0.5,
                borderColor: APColor.Gray
              }
            }}
            onPress={this.dismiss}
          />
        ))}
      </View>
    );
  };

  /**
   * Layout for title/message/buttons
   */
  _layout = (type, event) => {
    let {
      nativeEvent: { layout }
    } = event;
    let h = layout.height;

    switch (type) {
      case "title":
        console.log("Layout - title " + h);
        this.titleHeight = h;
        this.refs.title.setNativeProps({
          height: this.titleHeight
        });
        break;
      case "message":
        console.log("Layout - message " + h);
        let { alertButtons } = this.props;
        let messageMaxH =
          height * 0.9 - this.titleHeight - alertButtons.length * 45;
        this.refs.message.setNativeProps({
          style: {
            height: Math.min(messageMaxH, h + 10)
          }
        });
        break;
      default:
        console.log("Layout - container ...");
        break;
    }
  };
}
