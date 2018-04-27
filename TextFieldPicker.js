import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  Keyboard,
  TextInput,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import ModalContainer from "./views/ModalContainer";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default class TextFieldPicker extends React.Component {
  state = {
    icon: undefined,
    title: undefined,
    message: undefined,
    textFieldsOption: undefined,
    submitTitle: "确定",
    onSubmitEditing: undefined
  };

  show = TextFieldConfig => {
    if (TextFieldConfig) {
      let {
        icon,
        title,
        message,
        textFieldsOption,
        submitTitle,
        onSubmitEditing
      } = TextFieldConfig;
      this.setState(
        {
          icon,
          title,
          message,
          textFieldsOption,
          submitTitle: submitTitle !== undefined ? submitTitle : "确定",
          onSubmitEditing
        },
        () => this.content.show()
      );
    } else {
      this.content.show();
    }
  };

  render() {
    let {
      icon,
      title,
      message,
      textFieldsOption,
      submitTitle,
      onSubmitEditing
    } = this.state;
    return (
      <TextFieldPickerContent
        ref={r => (this.content = r)}
        icon={icon}
        title={title}
        message={message}
        submitTitle={submitTitle}
        textFieldsOption={textFieldsOption}
        onSubmitEditing={onSubmitEditing}
      />
    );
  }
}

class TextFieldPickerContent extends React.Component {
  static propTypes = {
    icon: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    textFieldsOption: PropTypes.arrayOf(PropTypes.object),
    submitTitle: PropTypes.string,
    onSubmitEditing: PropTypes.func
  };

  static defaultProps = {
    submitTitle: "确定"
  };

  state = {
    values: undefined,
    marginBottom: new Animated.Value(0)
  };

  componentDidMount() {
    if (ios) {
      this.keyboardShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardShow
      );
      this.keyboardHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardHide
      );
    }
  }

  componentWillUnmount() {
    if (ios) {
      this.keyboardShowListener.remove();
      this.keyboardHideListener.remove();
    }
  }

  _keyboardShow = event => {
    let start = ios ? event.startCoordinates.screenY : 0;
    let end = event.endCoordinates.screenY;

    Animated.timing(this.state.marginBottom, {
      toValue: Math.abs(start - end),
      duration: 250
    }).start();
  };

  _keyboardHide = event => {
    Animated.timing(this.state.marginBottom, {
      toValue: 0,
      duration: 250
    }).start();
  };

  show = () => {
    this.contentHeight = 0;
    this.modal.show();
  };

  dismiss = opt => {
    this.modal.dismiss();
    setTimeout(() => {
      if (opt === "submit") {
        let { values } = this.state;
        let { onSubmitEditing } = this.props;
        onSubmitEditing && onSubmitEditing(values);
        this.state.values = undefined;
      }
    }, 350);
  };

  _renderAlertContents = () => {
    let contentStyle = {
      width: "70%",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white",
      overflow: "hidden",
      alignSelf: "center"
    };

    let { icon, title, message } = this.props;
    let extHeight = 0;
    if (icon) {
      extHeight += 5;
    }
    if (title) {
      extHeight += 40;
    }
    if (message) {
      extHeight += 10;
    }
    this.extHeight = extHeight === 0 ? 30 : extHeight;
    this.contentMargin = icon || title || message ? 0 : 30;

    return (
      <Animated.View ref="content" style={contentStyle}>
        {this._renderCancel()}
        {this._renderIconComponent()}
        {this._renderTitleComponent()}
        {this._renderMessageComponent()}
        {this._renderTextFields()}
      </Animated.View>
    );
  };

  _renderCancel = () => {
    let cancelContainerStyle = {
      top: 5,
      right: 5,
      width: 20,
      height: 20,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "gray",
      position: "absolute",
      alignItems: "center",
      justifyContent: "center"
    };

    let cancelStyle = {
      width: 10,
      height: 10,
      resizeMode: "contain"
    };

    return (
      <TouchableOpacity
        style={cancelContainerStyle}
        activeOpacity={0.5}
        onPress={this.dismiss}
      >
        <Image style={cancelStyle} source={require("./source/clear.png")} />
      </TouchableOpacity>
    );
  };

  _renderIconComponent = () => {
    let { icon } = this.props;
    if (!icon) {
      return null;
    }

    let iconStyle = {
      width: 120,
      height: 120,
      marginBottom: 5,
      borderRadius: 60,
      alignSelf: "center",
      resizeMode: "cover"
    };

    return (
      <Image
        style={iconStyle}
        source={icon}
        onLayout={event => {
          this.iconHeight = event.nativeEvent.layout.height;
          this._setContentHeight(
            this.messageHeight,
            this.textFieldsHeight,
            this.iconHeight
          );
        }}
      />
    );
  };

  _renderTitleComponent = () => {
    let { icon, title } = this.props;
    if (!title) {
      return null;
    }

    let titleStyle = {
      paddingTop: 10,
      height: 40,
      paddingLeft: icon ? 10 : 25,
      paddingRight: icon ? 10 : 25,
      fontSize: 17,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <Text
        ref="title"
        style={[titleStyle, { textAlignVertical: "bottom" }]}
        numberOfLines={1}
      >
        {title}
      </Text>
    );
  };

  _renderMessageComponent = () => {
    let { icon, title, message, alertType } = this.props;
    if (!message) {
      return null;
    }

    let containerStyle = {
      marginBottom: 10,
      paddingLeft: icon || title ? 15 : 25,
      paddingRight: icon || title ? 15 : 25,
      overflow: "hidden"
    };

    let messageStyle = {
      color: "grey",
      fontSize: 14,
      textAlign: "center"
    };
    return (
      <View ref="messageContainer" style={containerStyle}>
        <TextInput
          style={messageStyle}
          value={message}
          editable={false}
          multiline
          numberOfLines={4}
          onLayout={this._layoutMessage.bind(this)}
          underlineColorAndroid="rgba(0, 0, 0, 0)"
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  _layoutMessage = event => {
    let {
      nativeEvent: { layout }
    } = event;
    this.messageHeight = layout.height;

    this._setContentHeight(
      this.textFieldsHeight,
      this.iconHeight,
      this.messageHeight
    );
  };

  _renderTextFields = () => {
    let { icon, title, message, textFieldsOption } = this.props;
    if (!textFieldsOption) {
      return null;
    }

    if (textFieldsOption.length > 3) {
      let textStyle = {
        fontSize: 17,
        color: "red",
        textAlign: "center"
      };
      return <Text style={textStyle}>提示：最多支持3个输入框</Text>;
    }

    return (
      <View
        ref="textFields"
        style={{ marginTop: this.contentMargin }}
        onLayout={this._layoutTextFields}
      >
        {textFieldsOption.map(option => (
          <TextField
            key={option.key}
            option={option}
            onChangeText={this._changeText}
            onSubmitEditing={this._submitEditing}
          />
        ))}
      </View>
    );
  };

  _layoutTextFields = event => {
    let {
      nativeEvent: { layout }
    } = event;
    this.textFieldsHeight = layout.height;
    this._setContentHeight(
      this.iconHeight,
      this.messageHeight,
      this.textFieldsHeight
    );
  };

  _setContentHeight = (h1 = 0, h2 = 0, h3 = 0) => {
    this.refs.content.setNativeProps({
      style: {
        height: this.extHeight + h1 + h2 + h3
      }
    });
  };

  _renderCancelButton = () => {
    let cancelContainerStyle = {
      height: 60,
      width: "70%",
      alignSelf: "center",
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0)"
    };
    let cancelButtonStyle = {
      borderRadius: 8
    };

    let disabled = !!!this.state.values;
    let titleColor = disabled ? "gray" : "deepskyblue";

    return (
      <View style={cancelContainerStyle}>
        <CancelButton
          title={this.props.submitTitle}
          disabled={disabled}
          titleColor={titleColor}
          onPress={() => this.dismiss("submit")}
        />
      </View>
    );
  };

  render() {
    let { marginBottom } = this.state;
    let content = (
      <Animated.View style={{ marginBottom }}>
        {this._renderAlertContents()}
        {this._renderCancelButton()}
      </Animated.View>
    );

    return (
      <ModalContainer
        ref={r => (this.modal = r)}
        modalType="alert"
        content={content}
      />
    );
  }

  _changeText = (key, value) => {
    let values = this.state.values;
    if (!values) {
      values = {};
    }
    values[key] = value;
    this.setState({ values });
  };

  _submitEditing = (key, value) => {};
}

class TextField extends React.Component {
  state = {
    underlineColorAndroid: "gray"
  };

  render() {
    let { leftImage } = this.props.option;
    let { underlineColorAndroid, defaultValue } = this.state;

    let containerStyle = {
      height: 45,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center"
    };

    if (ios) {
      containerStyle.borderRadius = 6;
      containerStyle.borderWidth = 0.5;
      containerStyle.borderColor = "rgb(220, 220, 220)";
    }

    let leftNode;
    if (leftImage) {
      let imageStyle = {
        width: 20,
        height: 20,
        margin: 5,
        resizeMode: "contain"
      };

      if (leftImage) {
        leftNode = <Image style={imageStyle} source={leftImage} />;
      }
    }

    return (
      <View style={containerStyle}>
        {leftNode}
        <TextInput
          {...this.props.option}
          style={[
            { height: "100%", paddingLeft: 5, flex: 1 },
            this.props.option.style
          ]}
          onFocus={this._focus}
          onChangeText={this._changeText}
          onSubmitEditing={this._submitEditing}
          underlineColorAndroid={underlineColorAndroid}
        />
      </View>
    );
  }

  _focus = () => {
    if (!ios) {
      this.setState({ underlineColorAndroid: "rgb(80, 120, 80)" });
    }
  };

  _changeText = text => {
    this.props.onChangeText(this.props.option.key, text);
  };

  _submitEditing = text => {
    this.props.onSubmitEditing(this.props.option.key, text);
  };
}
