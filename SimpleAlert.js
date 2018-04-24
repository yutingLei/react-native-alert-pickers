import React, { PureComponent } from "react";
import {
  View,
  Text,
  Animated,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ModalContainer from "./views/ModalContainer";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default class SimpleAlert extends PureComponent {
  state = {
    alertType: "alert",
    title: "提示",
    message: undefined,
    buttonsOption: [{ title: "取消" }],
    cancelIndex: 0,
    onSelected: undefined
  };

  show = (
    alertType,
    title,
    message,
    buttonsOption,
    cancelIndex,
    onSelected
  ) => {
    this.setState(
      {
        alertType: alertType !== null ? alertType : "alert",
        title: title !== null ? title : "提示",
        message: message,
        buttonsOption:
          buttonsOption !== null ? buttonsOption : [{ title: "取消" }],
        cancelIndex: cancelIndex !== null ? cancelIndex : 0,
        onSelected
      },
      () => this.content.show()
    );
  };

  render() {
    let {
      title,
      message,
      alertType,
      buttonsOption,
      cancelIndex,
      onSelected
    } = this.state;

    return (
      <SimpleAlertContent
        title={title}
        message={message}
        alertType={alertType}
        cancelIndex={cancelIndex}
        buttonsOption={buttonsOption}
        onSelected={onSelected}
        ref={r => (this.content = r)}
      />
    );
  }
}

class SimpleAlertContent extends PureComponent {
  static propTypes = {
    alertType: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    buttonsOption: PropTypes.arrayOf(PropTypes.object),
    cancelIndex: PropTypes.number,
    onSelected: PropTypes.func
  };

  static defaultProps = {
    alertType: "alert",
    buttonsOption: [{ title: "取消" }],
    cancelIndex: 0
  };

  state = {
    translateY: new Animated.Value(0)
  };

  show = () => {
    this.contentHeight = 0;
    this.modal.show();

    let { alertType } = this.props;
    if (alertType !== "alert") {
      this.state.translateY.setValue(height);
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 300
      }).start();
    }
  };

  dismiss = option => {
    this.modal.dismiss();
    let { alertType } = this.props;
    if (alertType !== "alert") {
      Animated.timing(this.state.translateY, {
        toValue: height,
        duration: 300
      }).start();
    }

    setTimeout(() => {
      this.props.onSelected && this.props.onSelected(option);
    }, 350);
  };

  _renderAlertContents = () => {
    let { alertType } = this.props;
    let { translateY } = this.state;

    let contentStyle = {
      height: this.state.contentHeight,
      width: alertType === "alert" ? "70%" : ios ? "90%" : "100%",
      opacity: alertType === "alert" ? 1 : 1,
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white",
      overflow: "hidden",
      alignSelf: "center",
      transform: alertType === "alert" ? undefined : [{ translateY }]
    };

    return (
      <Animated.View ref="content" style={contentStyle}>
        {this._renderTitleComponent()}
        {this._renderMessageComponent()}
        {this._renderButtons()}
      </Animated.View>
    );
  };

  _renderTitleComponent = () => {
    let { title, alertType } = this.props;
    if (!title) {
      return null;
    }

    let titleStyle = {
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      color: alertType === "alert" ? "black" : "darkgray",
      fontSize: alertType === "alert" ? 17 : 14,
      fontWeight: "bold",
      textAlign: "center"
    };
    return (
      <Text
        ref="title"
        style={titleStyle}
        numberOfLines={alertType === "alert" ? 2 : 1}
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
      paddingTop: 10,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 10,
      borderBottomWidth: 0.5,
      borderColor: "rgb(220, 220, 220)",
      overflow: "hidden"
    };

    let messageStyle = {
      color: alertType === "alert" ? "black" : "gray",
      fontSize: alertType === "alert" ? 14 : 11,
      textAlign: "center"
    };
    return (
      <View ref="messageContainer" style={containerStyle}>
        <TextInput
          style={messageStyle}
          value={message}
          editable={false}
          multiline={alertType === "alert"}
          dataDetectorTypes="all"
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

    if (layout.height > height - this.titleHeight - 125) {
      this._messageTooLong();
    } else {
      if (this.buttonsHeight) {
        let contentHeight = Math.min(
          this.titleHeight + this.messageHeight + 20 + this.buttonsHeight,
          height - 80
        );
        this.refs.content.setNativeProps({
          style: {
            height: contentHeight
          }
        });
      }
    }
  };

  _renderButtons = () => {
    let { alertType, buttonsOption, cancelIndex } = this.props;
    if (!buttonsOption) {
      return null;
    }

    cancelIndex = Math.abs(cancelIndex) % buttonsOption.length;
    this.cancelOption = buttonsOption[cancelIndex];
    buttonsOption.splice(cancelIndex, 1);
    if (alertType === "alert") {
      buttonsOption.push(this.cancelOption);
    }

    return (
      <View ref="buttons" onLayout={this._layoutButtons}>
        <ScrollView bounces={false}>
          {buttonsOption.map(option => (
            <ButtonItem
              key={option.title}
              option={option}
              onPress={this.dismiss}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  _layoutButtons = event => {
    let {
      nativeEvent: { layout }
    } = event;
    this.buttonsHeight = layout.height;

    if (this.messageHeight > height - this.titleHeight - 135) {
      this._messageTooLong();
    } else {
      if (this.messageHeight) {
        let contentHeight = Math.min(
          this.titleHeight + this.messageHeight + 20 + this.buttonsHeight,
          height - 80
        );
        this.refs.content.setNativeProps({
          style: {
            height: contentHeight
          }
        });
      }
    }
  };

  _messageTooLong = () => {
    this.refs.messageContainer.setNativeProps({
      style: {
        height: height - this.titleHeight - 135
      }
    });
    this.refs.content.setNativeProps({
      style: {
        height: height - 80
      }
    });
    this.refs.buttons.setNativeProps({
      style: {
        height: 45
      }
    });
  };

  _renderCancelButton = () => {
    let cancelContainerStyle = {
      height: 60,
      width: ios ? "90%" : "100%",
      alignSelf: "center",
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0)"
    };
    let cancelButtonStyle = {
      borderRadius: ios ? 8 : 0
    };

    if (this.cancelOption && !this.cancelOption.color) {
      this.cancelOption.color = "red";
    }

    return (
      <View style={cancelContainerStyle}>
        <ButtonItem
          style={cancelButtonStyle}
          option={this.cancelOption}
          onPress={this.dismiss}
        />
      </View>
    );
  };

  render() {
    let { alertType, buttonsOption } = this.props;
    let content =
      alertType === "alert" ? (
        this._renderAlertContents()
      ) : (
        <Animated.View
          style={{
            paddingBottom: ios ? 20 : 0,
            transform: [{ translateY: this.state.translateY }]
          }}
        >
          {this._renderAlertContents()}
          {this._renderCancelButton()}
        </Animated.View>
      );

    return (
      <ModalContainer
        ref={r => (this.modal = r)}
        modalType={alertType}
        content={content}
      />
    );
  }
}

class ButtonItem extends PureComponent {
  state = {
    backgroundColor: "white"
  };

  render() {
    let { style, option, onPress, seperate } = this.props;

    let buttonStyle = {
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 0.5,
      borderColor: "rgb(220, 220, 220)",
      backgroundColor: this.state.backgroundColor
    };

    let titleStyle = {
      fontSize: 15,
      color: option.color || (ios ? "rgb(0, 68, 240)" : "rgb(80, 120, 80)")
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[buttonStyle, style]}
        onPress={this._press}
        onPressIn={this._pressIn}
        onPressOut={this._pressOut}
      >
        <Text style={titleStyle}>{option.title}</Text>
      </TouchableOpacity>
    );
  }

  _press = () => {
    let { onPress, option } = this.props;
    onPress && onPress(option.title);
  };

  _pressIn = () => {
    this.setState({ backgroundColor: "rgb(180, 180, 180)" });
  };

  _pressOut = () => {
    this.setState({ backgroundColor: "white" });
  };
}
