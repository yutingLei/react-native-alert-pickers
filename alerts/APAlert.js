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
    this.setState({ ...APAlertConfig, mode: "alert" }, () =>
      this.content.show()
    );
  };

  actionSheet = APAlertConfig => {
    this.setState({ ...APAlertConfig, mode: "action-sheet" }, () =>
      this.content.show()
    );
  };

  show = SimpleAlertConfig => {
    this.setState({ ...SimpleAlertConfig }, () => this.content.show());
  };

  render() {
    let { state } = this;
    if (state && state.mode && state.mode !== "alert") {
      return <APActionContent {...this.state} ref={r => (this.content = r)} />;
    } else {
      return <APAlertContent {...this.state} ref={r => (this.content = r)} />;
    }
  }
}

/**
 * Alert
 */
class APAlertContent extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    alertButtons: PropTypes.arrayOf(PropTypes.object),
    cancelIndex: PropTypes.number,
    onPress: PropTypes.func
  };

  static defaultProps = {
    mode: "alert",
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
      <APContainer ref={r => (this.modal = r)} mode="alert" content={content} />
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
      <View ref="container" style={containerStyle}>
        {this._renderTitle()}
        {this._renderMessage()}
        {this._renderButtons()}
      </View>
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
      color: "black",
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
  _renderButtons = mode => {
    let { alertButtons, cancelIndex } = this.props;

    /// remove cancel from buttons
    let cancelButton = alertButtons[cancelIndex];
    alertButtons.splice(cancelIndex, 1);
    alertButtons.push({ font: { color: "red" }, ...cancelButton });

    ///  button config
    let buttonConfig = {
      style: {
        height: 45,
        borderRadius: 0,
        borderTopWidth: 0.5,
        borderColor: APColor.Gray
      }
    };

    /// buttons
    return (
      <View style={{ height: alertButtons.length * 45 }}>
        {alertButtons.map(button => (
          <APButton
            {...{
              ...button,
              ...buttonConfig
            }}
            key={button.title}
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
        this.titleHeight = h;
        this.refs.title.setNativeProps({
          height: this.titleHeight
        });
        break;
      case "message":
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
        break;
    }
  };
}

class APActionContent extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    alertButtons: PropTypes.arrayOf(PropTypes.object),
    cancelIndex: PropTypes.number,
    onPress: PropTypes.func
  };

  static defaultProps = {
    mode: "action-sheet",
    alertButtons: [{ title: "取消", font: { color: "red" } }],
    cancelIndex: 0
  };

  state = {
    translateY: new Animated.Value(height)
  };

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start();
  };

  dismiss = val => {
    this.modal.dismiss(() => {
      let { onPress } = this.props;
      onPress && onPress(val);
    });

    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: APTime.Default
    }).start();
  };

  render() {
    return (
      <APContainer
        ref={r => (this.modal = r)}
        mode="action-sheet"
        content={this._renderAlertContent()}
      />
    );
  }

  _renderAlertContent = () => {
    let { translateY } = this.state;
    let { title, message, alertButtons, cancelIndex } = this.props;
    let h = alertButtons.length * 45 + 60;
    if (title) {
      h += 30;
    }
    if (message) {
      h += 20;
    }

    let containerStyle = {
      width: "100%",
      height: h,
      padding: ios ? 20 : 0,
      overflow: "hidden",
      borderRadius: ios ? 8 : 0,
      justifyContent: "space-between",
      transform: [{ translateY }]
    };

    let textContainerStyle = {
      paddingLeft: 15,
      paddingRight: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white"
    };

    let cancelButton = alertButtons[cancelIndex];
    let seperator = <View style={{ height: 15 }} />;
    let cancel = (
      <APButton
        {...{ font: { color: "red" }, ...cancelButton, style: { height: 45 } }}
        onPress={this.dismiss}
      />
    );

    return (
      <Animated.View style={containerStyle}>
        <View style={{ overflow: "hidden", borderRadius: 8 }}>
          {this._renderTitle(textContainerStyle)}
          {this._renderMessage(textContainerStyle)}
          {this._renderButtons()}
        </View>
        {seperator}
        {cancel}
      </Animated.View>
    );
  };

  /**
   * Render title
   */
  _renderTitle = containerStyle => {
    let { title } = this.props;
    if (!title) {
      return null;
    }

    let titleStyle = {
      color: "gray",
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <View style={{ height: 30, ...containerStyle }}>
        <Text style={titleStyle}>{title}</Text>
      </View>
    );
  };

  /**
   * Render message
   */
  _renderMessage = containerStyle => {
    let { message } = this.props;
    if (!message) {
      return null;
    }

    let messageFont = {
      color: APColor.Gray,
      fontSize: 12,
      textAlign: "center"
    };

    return (
      <View style={{ ...containerStyle, height: 25 }}>
        <Text style={messageFont}>{message}</Text>
      </View>
    );
  };

  /**
   * Render alert's buttons
   */
  _renderButtons = () => {
    let { alertButtons, cancelIndex } = this.props;

    /// remove cancel from buttons
    alertButtons.splice(cancelIndex, 1);

    ///  button config
    let buttonConfig = {
      style: {
        height: 45,
        borderRadius: 0,
        borderTopWidth: 0.5,
        borderColor: APColor.Gray
      }
    };

    /// buttons
    return (
      <View style={{ height: alertButtons.length * 45 }}>
        {alertButtons.map(button => (
          <APButton
            {...{
              ...button,
              ...buttonConfig
            }}
            key={button.title}
            onPress={this.dismiss}
          />
        ))}
      </View>
    );
  };
}
