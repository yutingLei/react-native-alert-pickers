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
  Keyboard
} from "react-native";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");
const CLEAR_COLOR = "rgba(0, 0, 0, 0)";

export default class UISearchBar extends Component {
  /**
   * @prop width: 搜索框宽度
   * @prop tintColor: 搜索框容器的背景色
   * @prop borderRadius
   * @prop backgroundColor: 搜索框背景色
   * @prop showClearButton: 是否显示清楚按钮
   * @prop placeholderText: 占位符
   * @prop cancelTitle: 取消按钮标题
   * @prop cancelTitleColor: 取消按钮的标题颜色
   * @prop onSubmitEditing: 提交搜索字符
   */
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tintColor: PropTypes.string,
    borderRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    showClearButton: PropTypes.bool,
    placeholderText: PropTypes.string,
    cancelTitle: PropTypes.string,
    cancelTitleColor: PropTypes.string,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    width,
    tintColor: "white",
    borderRadius: 8,
    backgroundColor: "#e9e9e9",
    showClearButton: true,
    placeholderText: "搜索",
    cancelTitle: "取消",
    cancelTitleText: "deepskyblue"
  };

  constructor(props) {
    super(props);
    this.offsetx = 25 + this.props.placeholderText.length * 5;
    this.state = {
      status: 0, // 0-nonEdit  1-beginEdit  2-endEdit
      value: null,
      left: new Animated.Value(this.props.width / 2 - this.offsetx),
      contentWidth: new Animated.Value(this.props.width - 20)
    };
  }

  handleFocus = () => {
    setTimeout(() => {
      this.setState({ status: 1 });
    }, 300);
    if (this.props.cancelTitle != null) {
      Animated.timing(this.state.contentWidth, {
        toValue: this.props.width - 60,
        duration: 300
      }).start();
    }
    if (this.state.status === 0) {
      Animated.timing(this.state.left, {
        toValue: 10,
        duration: 300
      }).start();
    }
  };

  handleCancel = isCancelPressed => {
    Keyboard.dismiss();
    const hasValue = this.state.value !== "" && this.state.value !== null;
    const status = isCancelPressed ? 0 : hasValue ? 2 : 0;
    const value = isCancelPressed ? null : this.state.value;
    this.setState({ status, value });
    if (!isCancelPressed && hasValue) {
      this.props.onSubmitEditing &&
        this.props.onSubmitEditing(this.state.value);
    } else {
      this.props.onCancel && this.props.onCancel();
    }
    Animated.timing(this.state.left, {
      toValue: status === 0 ? this.props.width / 2 - this.offsetx : 10,
      duration: 300
    }).start();
    Animated.timing(this.state.contentWidth, {
      toValue: this.props.width - 20,
      duration: 300
    }).start();
  };

  handleChanged = value => {
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  createClearButton = () => {
    if (!this.props.showClearButton) {
      return;
    }
    const isShow =
      this.state.status === 1 &&
      (this.state.value !== null && this.state.value !== "");
    const clearButtonStyle = {
      top: 9,
      right: 10,
      width: 12,
      height: 12,
      borderRadius: 6,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      display: isShow ? "flex" : "none",
      backgroundColor: "rgba(45, 45, 45, 0.3)"
    };
    return (
      <TouchableOpacity
        style={clearButtonStyle}
        onPress={() => this.setState({ value: "" })}
      >
        <Text style={{ color: "white", fontSize: 11 }}>x</Text>
      </TouchableOpacity>
    );
  };

  createCancelButton = () => {
    if (!this.props.cancelTitle) {
      return;
    }
    const isShow = this.state.status === 1;
    const cancelButtonStyle = {
      right: 5,
      width: 45,
      height: 30,
      justifyContent: "center",
      backgroundColor: CLEAR_COLOR,
      display: isShow ? "flex" : "none"
    };

    const cancelTitleStyle = {
      textAlign: "center",
      color: this.props.cancelTitleColor
    };

    return (
      <TouchableOpacity
        style={cancelButtonStyle}
        onPress={() => this.handleCancel(true)}
      >
        <Text style={cancelTitleStyle} numberOfLines={1}>
          {this.props.cancelTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      width,
      tintColor,
      borderRadius,
      backgroundColor,
      placeholderText
    } = this.props;

    const containerStyle = {
      width,
      height: 50,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tintColor,
      justifyContent: "space-between"
    };

    const contentStyle = {
      left: 10,
      height: 30,
      borderRadius,
      backgroundColor,
      alignItems: "center",
      justifyContent: "center"
    };

    const placeholder = this.state.status === 1 ? placeholderText : null;
    const textInputStyle = {
      width: "100%",
      height: "100%",
      paddingLeft: 25,
      paddingRight: this.props.showClearButton ? 22 : 5
    };

    const endEditStyle = {
      top: 7.5,
      height: 15,
      flexDirection: "row",
      position: "absolute",
      justifyContent: "center"
    };

    return (
      <View style={containerStyle}>
        <Animated.View
          style={[contentStyle, { width: this.state.contentWidth }]}
        >
          <TextInput
            ref={r => (this.inputRef = r)}
            style={textInputStyle}
            returnKeyType="search"
            selectionColor="#a9a9a9"
            value={this.state.value}
            placeholder={placeholder}
            onFocus={this.handleFocus}
            underlineColorAndroid={backgroundColor}
            onChangeText={this.handleChanged}
            onSubmitEditing={() => this.handleCancel(false)}
          />
          <Animated.View
            style={[endEditStyle, { left: this.state.left }]}
            onResponderStart={() => this.inputRef.focus()}
            onStartShouldSetResponder={e => this.state.status !== 1}
          >
            <Image
              style={{ width: 13, height: 13 }}
              source={require("../source/search.png")}
            />
            <Text
              style={{
                left: 3,
                fontSize: 12,
                color: "#696969",
                textAlign: "center",
                backgroundColor: CLEAR_COLOR,
                opacity: this.state.status === 0 ? 1 : 0
              }}
            >
              {this.props.placeholderText}
            </Text>
          </Animated.View>
          {this.createClearButton()}
        </Animated.View>
        {this.createCancelButton()}
      </View>
    );
  }
}
