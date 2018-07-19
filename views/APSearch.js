// system
import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
// custom
import { APColor } from "../utils";
// const
const ios = Platform.OS === "ios";
const AnimatedTouchalbe = Animated.createAnimatedComponent(TouchableOpacity);

export default class APSearch extends React.Component {
  static propTypes = {
    // Content
    barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    tintColor: PropTypes.string,
    backgroundColor: PropTypes.string,

    // TextInput
    textField: PropTypes.object,

    // Cancel
    cancelTitle: PropTypes.string,
    cancelTitleColor: PropTypes.string
  };

  static defaultProps = {
    width: "100%",
    tintColor: APColor.Gray,
    backgroundColor: "white",
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

    let { textField } = this.props;
    let textFieldConfig = {
      config: {
        autoCapitalize: "none",
        autoCorrect: false,
        placeholder: "搜索",
        blurOnSubmit: true,
        clearButtonMode: "while-editing",
        placeholderTextColor: "grey",
        selectionColor: "grey",
        ...textField.config
      }
    };
    let { defaultValue, value } = textFieldConfig.config;
    if (this.textValueState === "non-fill" && (defaultValue || value)) {
      this.textValueState = "filled";
      this.state.textValue = defaultValue || value;
    }

    let { textValue, onFocus } = this.state;
    let inputStyle = {
      flex: 1,
      marginLeft: ios ? 5 : 0,
      color: (textField && textField.font && textField.font.color) || "black",
      textAlign: textValue || onFocus ? "left" : "center"
    };

    return (
      <View style={containerStyle}>
        <TextInput
          {...textFieldConfig.config}
          style={inputStyle}
          onBlur={this._blur}
          onFocus={this._focus}
          multiline={false}
          value={textValue}
          returnKeyType="search"
          returnKeyLabel="Search"
          onChangeText={this._changeText}
          onSubmitEditing={this._submitEditing}
          underlineColorAndroid={APColor.Clear}
        />
        {this._renderClearButton(
          textFieldConfig.config.clearButtonMode,
          textValue
        )}
      </View>
    );
  };

  _renderClearButton = (clearButtonMode, textValue) => {
    let showClearButton = textValue && this.state.onFocus;
    if (clearButtonMode === "while-editing" && showClearButton && !ios) {
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
      overflow: "hidden",
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
    let {
      textField: { onChangeText }
    } = this.props;
    onChangeText && onChangeText(text);
  };

  _submitEditing = text => {
    this.textValueState = "submitted";
    let {
      textField: { onSubmitEditing }
    } = this.props;
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
