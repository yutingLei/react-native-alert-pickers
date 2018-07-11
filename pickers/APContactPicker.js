// system
import React, { Component } from "react";
import {
  View,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  NativeModules
} from "react-native";
import PropTypes from "prop-types";
// custom
import { APColor, APTime } from "../utils";
import APButton from "../views/APButton";
import APSearch from "../views/APSearch";
import APActivity from "../views/APActivity";
import APContainer from "../views/APContainer";
import APContactCell from "../views/APContactCell";
// const
const RNContactManager = NativeModules.RNContactManager;
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

/**
 * 联系人选择器
 */
export default class APContactPicker extends Component {
  show = ContactPickerConfig => {
    this.setState({ ...ContactPickerConfig }, () => this.content.show());
  };

  render() {
    return (
      <APContactPickerContent {...this.state} ref={r => (this.content = r)} />
    );
  }
}

/**
 * 联系人选择器内容
 */
class APContactPickerContent extends Component {
  static propTypes = {
    searchPlacehodler: PropTypes.string,
    searchCancelTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    onSelected: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    searchPlacehodler: "输入联系人名称或电话号码",
    searchCancelTitle: "取消",
    cancelTitle: "取消"
  };

  state = {
    err: null,
    loading: true,
    imutContacts: null,
    contacts: null,
    translateY: new Animated.Value(height),
    animateHeight: new Animated.Value(20)
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

    Animated.timing(this.state.animateHeight, {
      toValue: Math.abs(start - end),
      duration: APTime.Default
    }).start();
  };

  _keyboardHide = () => {
    Animated.timing(this.state.animateHeight, {
      toValue: 20,
      duration: APTime.Default
    }).start();
  };

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start(() => {
      RNContactManager.fetchContacts()
        .then(contacts => {
          this.setState({ imutContacts: contacts, contacts, loading: false });
        })
        .catch(err => {
          this.setState({ err, loading: false });
        });
    });
  };

  dismiss = (name, number) => {
    this.modal.dismiss(() => {
      let { onSelected } = this.props;
      if (name && number) {
        onSelected && onSelected({ name, number });
      }
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
        content={this._renderContainer()}
      />
    );
  }

  _renderContainer = () => {
    let containerStyle = {
      width: "90%",
      height: "90%",
      alignSelf: "center",
      backgroundColor: APColor.Clear
    };

    let content = this._renderContent();
    let keyboardOffset = (
      <Animated.View style={{ height: this.state.animateHeight }} />
    );

    return (
      <View style={containerStyle}>
        {content}
        {keyboardOffset}
      </View>
    );
  };

  _renderContent = () => {
    let { cancelTitle, searchCancelTitle, searchPlacehodler } = this.props;
    let { loading, err, imutContacts, contacts, translateY } = this.state;

    let contentStyle = {
      flex: 1,
      borderRadius: ios ? 15 : 0,
      overflow: "hidden",
      backgroundColor: "white"
    };

    if (loading) {
      contentStyle = {
        ...contentStyle,
        alignItems: "center",
        justifyContent: "center"
      };
    }

    let activity = loading ? (
      <APActivity enable={loading} message={err} />
    ) : null;

    let search = loading ? null : (
      <APSearch
        barWidth={width * 0.9}
        cancelTitle={searchCancelTitle}
        textInputProps={{ placeholder: searchPlacehodler }}
        onCancel={() => this.setState({ contacts: imutContacts })}
        onChangeText={this._onSearching}
        onSubmitEditing={this._onSearchSubmit}
      />
    );

    let list = loading ? null : (
      <FlatList
        style={{ flex: 1 }}
        data={contacts}
        keyExtractor={item => item.phoneNumber}
        renderItem={({ item }) => (
          <APContactCell {...item} onPress={this.dismiss} />
        )}
      />
    );

    let content = (
      <View style={contentStyle}>
        {activity}
        {search}
        {list}
      </View>
    );

    let seperate = <View style={{ height: 15 }} />;
    let cancel = (
      <APButton
        title={cancelTitle}
        font={{ color: APColor.DeepBlue }}
        onPress={this.dismiss}
      />
    );

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        {content}
        {seperate}
        {cancel}
      </Animated.View>
    );
  };

  _onSearching = text => {
    let { imutContacts } = this.state;
    if (imutContacts) {
      let contacts = imutContacts.filter(
        contact =>
          contact.name.includes(text) || contact.phoneNumber.includes(text)
      );
      this.setState({ contacts });
    }
  };
}
