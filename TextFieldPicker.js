import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  Keyboard,
  TextInput,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import ModalContainer from "./views/ModalContainer";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default class TextFieldPicker extends React.Component {
  state = {
    title: undefined,
    message: undefined,
    textFieldsOption: undefined,
    submitTitle: "确定",
    onSubmitEditing: undefined
  };

  show = TextFieldConfig => {
    if (TextFieldConfig) {
      let {
        title,
        message,
        textFieldsOption,
        submitTitle,
        onSubmitEditing
      } = TextFieldConfig;
      this.setState(
        {
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
      title,
      message,
      textFieldsOption,
      submitTitle,
      onSubmitEditing
    } = this.state;
    return (
      <TextFieldPickerContent
        ref={r => (this.content = r)}
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

  dismiss = values => {
    this.modal.dismiss();
    setTimeout(() => {
      this.props.onSubmitEditing && this.props.onSubmitEditing(values);
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

    return (
      <Animated.View ref="content" style={contentStyle}>
        {this._renderTitleComponent()}
        {this._renderMessageComponent()}
        {this._renderTextFields()}
      </Animated.View>
    );
  };

  _renderTitleComponent = () => {
    let { title } = this.props;
    if (!title) {
      return null;
    }

    let titleStyle = {
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      fontSize: 17,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <Text
        ref="title"
        style={titleStyle}
        numberOfLines={1}
        onLayout={this._layoutTitle}
      >
        {title}
      </Text>
    );
  };

  _layoutTitle = event => {
    let {
      nativeEvent: { layout }
    } = event;
    this.titleHeight = layout.height;
  };

  _renderMessageComponent = () => {
    let { message, alertType } = this.props;
    if (!message) {
      return null;
    }

    let containerStyle = {
      paddingTop: ios ? 10 : 0,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: ios ? 10 : 0,
      overflow: "hidden"
    };

    let messageStyle = {
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

    if (this.textFieldsHeight) {
      this.refs.content.setNativeProps({
        style: {
          height:
            this.titleHeight +
            this.messageHeight +
            (ios ? 20 : 0) +
            this.textFieldsHeight
        }
      });
    }
  };

  _renderTextFields = () => {
    let { textFieldsOption } = this.props;
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
      <View ref="textFields" onLayout={this._layoutTextFields}>
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

    if (this.messageHeight) {
      this.refs.content.setNativeProps({
        style: {
          height:
            this.titleHeight +
            this.messageHeight +
            (ios ? 20 : 0) +
            this.textFieldsHeight
        }
      });
    }
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

    return (
      <View style={cancelContainerStyle}>
        <CancelButton
          title={this.props.submitTitle}
          onPress={() => this.dismiss(this.values)}
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
    if (!this.values) {
      this.values = {};
    }
    this.values[key] = value;
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
      margin: 10,
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
