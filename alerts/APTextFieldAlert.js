import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  TextInput,
  Dimensions,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
// custom
import APButton from "../views/APButton";
import APContainer from "../views/APContainer";
import APTextField from "../views/APTextField";
import { APTime, APColor } from "../utils";
// const
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const margins = {
  marginTop: 10,
  marginLeft: 15,
  marginRight: 15
};

export default class APTextFieldAlert extends React.Component {
  show = APTextFieldConfig => {
    this.setState({ ...APTextFieldConfig }, () => this.content.show());
  };

  dismiss = callback => {
    this.content.dismiss(callback);
  };

  startAnimating = () => {
    this.content.startAnimating();
  };

  stopAnimating = () => {
    this.content.stopAnimating();
  };

  render() {
    return (
      <APTextFieldAlertContent {...this.state} ref={r => (this.content = r)} />
    );
  }
}

class APTextFieldAlertContent extends React.Component {
  static propTypes = {
    icon: PropTypes.object,
    title: PropTypes.string,
    message: PropTypes.string,
    textFields: PropTypes.arrayOf(PropTypes.object),
    alertButtons: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    alertButtons: [{ title: "取消", font: { color: APColor.DeepBlue } }]
  };

  state = {
    animating: false,
    translateY: new Animated.Value(height)
  };

  _keyboardShow = () => {
    let offsetY = height - this.textFieldsMaxY - this.containerY - 255;
    if (offsetY < 0) {
      Animated.timing(this.state.translateY, {
        toValue: offsetY,
        duration: APTime.Default
      }).start();
    }
  };

  _keyboardHide = () => {
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start();
  };

  show = () => {
    this.modal.show();

    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start();
  };

  dismiss = callback => {
    this.modal.dismiss(() => callback && callback(this.values));

    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: APTime.Default
    }).start();
  };

  startAnimating = () => {
    this.setState({ animating: true });
  };

  stopAnimating = () => {
    this.setState({ animating: false });
  };

  render() {
    return (
      <APContainer
        ref={r => (this.modal = r)}
        content={this._renderContents()}
      />
    );
  }

  _renderContents = () => {
    let { translateY } = this.state;

    let containerStyle = {
      width: "70%",
      overflow: "hidden",
      alignSelf: "center",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white",
      transform: [{ translateY }]
    };

    return (
      <Animated.View
        ref="container"
        style={containerStyle}
        onLayout={event => this._layout("container", event)}
      >
        {this._renderIcon()}
        {this._renderTitle()}
        {this._renderMessage()}
        {this._renderTextFields()}
        {this._renderButtons()}
        {this._renderActivity()}
      </Animated.View>
    );
  };

  /**
   * Render icon
   */
  _renderIcon = () => {
    let { icon } = this.props;
    if (!icon) {
      return null;
    }

    return (
      <View
        style={{
          width: "100%",
          height: 70,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          {...{ style: { width: 60, height: 60, borderRadius: 30 }, ...icon }}
        />
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
   * Render text fields
   */
  _renderTextFields = () => {
    let { textFields } = this.props;
    if (!textFields) {
      return null;
    }

    /// buttons
    return (
      <View
        style={{ height: textFields.length * 45 }}
        onLayout={event => this._layout("text-fields", event)}
      >
        {textFields.map(textField => (
          <APTextField
            {...textField}
            onFunctions={{
              onFocus: this._keyboardShow,
              onBlur: this._keyboardHide,
              onChangeText: text => this._onChange(textField.key, text),
              onSubmitEditing: text => this._onSubmit(textField.key, text)
            }}
          />
        ))}
      </View>
    );
  };

  /**
   * Render alert's buttons
   */
  _renderButtons = () => {
    let { alertButtons } = this.props;

    ///  button config
    let buttonConfig = {
      font: {
        color: APColor.DeepBlue
      },
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
            key={button.title}
            {...{
              ...buttonConfig,
              ...button
            }}
            onPress={button.onPress}
          />
        ))}
      </View>
    );
  };

  /**
   * Render Activity Indicator
   */
  _renderActivity = () => {
    let animating = this.state.animating;
    if (!animating) {
      return null;
    }

    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white"
        }}
      >
        <ActivityIndicator size="large" />
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
      case "text-fields":
        {
          console.log("TextField: ", JSON.stringify(event.nativeEvent));
          this.textFieldsMaxY = layout.y + h;
        }
        break;
      case "container":
        {
          console.log("Container: ", JSON.stringify(event.nativeEvent));
          this.containerY = layout.y;
        }
        break;
      default:
        break;
    }
  };

  _onChange = (key, value) => {
    if (!this.values) {
      this.values = {};
    }
    Object.assign(this.values, { [key]: value });
  };

  _onSubmit = (key, value) => {
    if (!this.values) {
      this.values = {};
    }
    Object.assign(this.values, { [key]: value });
  };
}
