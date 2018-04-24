/**
 *
 * @UISearchBar
 * 搜索框
 */
import React, { Component } from "react";
import {
  View,
  TextInput,
  Dimensions,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Keyboard,
  Platform
} from "react-native";
import PropTypes from "prop-types";

const ios = Platform.OS === "ios";
const CLEAR_COLOR = "rgba(0, 0, 0, 0)";
const AnimatedTouchalbe = Animated.createAnimatedComponent(TouchableOpacity);

export default class SearchBar extends React.Component {
  static propTypes = {
    // Content
    barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    tintColor: PropTypes.string,
    backgroundColor: PropTypes.string,

    // TextInput
    textInputProps: PropTypes.object,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,

    // Cancel
    cancelTitle: PropTypes.string,
    cancelTitleColor: PropTypes.string,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    width: "100%",
    tintColor: "rgb(220, 220, 220)",
    backgroundColor: "white",

    autoDisableKeyboard: true,

    cancelTitle: "取消",
    cancelTitleColor: "black"
  };

  constructor(props) {
    super(props);
    this.textValueState = "non-fill"; // other: 'changed', 'filled', 'submitted'
    this.state = {
      onFocus: false,
      textValue: undefined,
      cancelTitleWidth: new Animated.Value(0)
    };
  }

  _renderTextInput = () => {
    let { tintColor } = this.props;

    let containerStyle = {
      flex: 1,
      height: ios ? 30 : 40,

      marginLeft: 10,
      marginRight: this.state.onFocus ? 0 : 10,
      borderRadius: ios ? 5 : 0,
      backgroundColor: tintColor
    };

    let { textInputProps } = this.props;
    let inputProps = {
      autoCapitalize: "none",
      autoCorrect: false,
      placeholder: "搜索",
      blurOnSubmit: true,
      clearButtonMode: "while-editing",
      placeholderTextColor: "grey",
      selectionColor: "grey",
      ...textInputProps
    };
    let { defaultValue, value } = textInputProps || {};
    if (this.textValueState === "non-fill" && (defaultValue || value)) {
      this.textValueState = "filled";
      this.state.textValue = defaultValue || value;
    }

    let { textValue, onFocus } = this.state;
    let inputStyle = {
      flex: 1,
      textAlign: textValue || onFocus ? "left" : "center"
    };

    return (
      <View style={containerStyle}>
        <TextInput
          {...inputProps}
          style={inputStyle}
          onBlur={this._blur}
          onFocus={this._focus}
          multiline={false}
          value={textValue}
          returnKeyType="search"
          returnKeyLabel="搜索"
          selectionColor="grey"
          onChangeText={this._changeText}
          onSubmitEditing={this._submitEditing}
          underlineColorAndroid={CLEAR_COLOR}
        />
        {this._renderClearButton(inputProps.clearButtonMode, textValue)}
      </View>
    );
  };

  _renderClearButton = (clearButtonMode, textValue) => {
    let showClearButton = textValue && this.state.onFocus;
    if (clearButtonMode === "while-editing" && showClearButton) {
      let buttonStyle = {
        top: ios ? 7 : 12,
        right: 10,
        width: 16,
        height: 16,
        borderRadius: 8,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "grey"
      };

      let imageStyle = {
        width: 10,
        height: 10,
        tintColor: "white",
        resizeMode: "contain"
      };
      return (
        <TouchableOpacity
          style={buttonStyle}
          activeOpacity={0.8}
          onPress={this._clear}
        >
          <Image style={imageStyle} source={require("../source/clear.png")} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  _renderCancelButton = () => {
    let { cancelTitle, cancelTitleColor } = this.props;
    let { cancelTitleWidth } = this.state;

    let cancelContainerStyle = {
      width: cancelTitleWidth,
      height: "100%",
      alignItems: "center",
      justifyContent: "center"
    };

    let cancelTextStyle = {
      color: cancelTitleColor,
      fontSize: 15
    };

    return (
      <AnimatedTouchalbe
        style={cancelContainerStyle}
        activeOpacity={0.5}
        onPress={this._cancel}
      >
        <Text style={cancelTextStyle} numberOfLines={1}>
          {cancelTitle}
        </Text>
      </AnimatedTouchalbe>
    );
  };

  render() {
    let { barWidth, backgroundColor } = this.props;

    let containerStyle = {
      width: barWidth,
      height: 50,
      alignItems: "center",
      flexDirection: "row",
      backgroundColor
    };

    return (
      <View style={containerStyle}>
        {this._renderTextInput()}
        {this._renderCancelButton()}
      </View>
    );
  }

  _changeText = text => {
    this.textValueState = "changed";
    this.setState({ textValue: text });
    let { onChangeText } = this.props;
    onChangeText && onChangeText(text);
  };

  _submitEditing = text => {
    this.textValueState = "submitted";
    let { onSubmitEditing } = this.props;
    onSubmitEditing && onSubmitEditing(text);
  };

  _focus = () => {
    this.setState({ onFocus: true });
    Animated.timing(this.state.cancelTitleWidth, {
      toValue: 60,
      duration: 250
    }).start();
  };

  _blur = callback => {
    this.setState({ onFocus: false });
    Animated.timing(this.state.cancelTitleWidth, {
      toValue: 0,
      duration: 250
    }).start();
  };

  _clear = () => {
    this.textValueState = "changed";
    this.setState({ textValue: undefined });
    let { onCancel } = this.props;
    onCancel && onCancel();
  };

  _cancel = () => {
    Keyboard.dismiss();
    Animated.timing(this.state.cancelTitleWidth, {
      toValue: 0,
      duration: 250
    }).start(() => {
      if (
        this.textValueState === "changed" ||
        this.textValueState === "submitted"
      ) {
        this.setState({ onFocus: false, textValue: null });
      } else {
        this.setState({ onFocus: false });
      }
      let { onCancel } = this.props;
      onCancel && onCancel();
    });
  };
}
