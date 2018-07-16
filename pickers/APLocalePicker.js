// system
import React, { Component } from "react";
import {
  View,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
// custom
import * as Source from "../source";
import { APTime, APColor } from "../utils";
import APContainer from "../views/APContainer";
import APSearch from "../views/APSearch";
import APButton from "../views/APButton";
import APLocaleCell from "../views/APLocaleCell";
// const
const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default class APLocalePicker extends Component {
  show = LocalePickerConfig => {
    this.setState({ ...LocalePickerConfig }, () => this.content.show());
  };

  render() {
    return (
      <APLocalePickerContent {...this.state} ref={r => (this.content = r)} />
    );
  }
}

class APLocalePickerContent extends Component {
  static propTypes = {
    mode: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchCancelTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    onSelected: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    mode: "country",
    searchPlaceholder: "搜索",
    searchCancelTitle: "取消",
    cancelTitle: "取消"
  };

  state = {
    itus: Source.itus,
    translateY: new Animated.Value(height),
    animateHeight: new Animated.Value(0)
  };

  componentDidMount() {
    Source.itus.sort((dt1, dt2) => dt1.name > dt2.name);
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
    let start = event.startCoordinates.screenY;
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
    }).start();
  };

  dismiss = val => {
    this.modal.dismiss(() => {
      let { cancelTitle, onSelected } = this.props;
      if (val && val !== cancelTitle) {
        onSelected && onSelected(val);
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
    let { translateY, animateHeight } = this.state;

    let containerStyle = {
      width: "90%",
      height: "90%",
      alignSelf: "center",
      backgroundColor: APColor.Clear
    };

    let contents = this._renderContents(translateY);
    let offsetView = <Animated.View style={{ height: animateHeight }} />;

    return (
      <View style={containerStyle}>
        {contents}
        {offsetView}
      </View>
    );
  };

  _renderContents = translateY => {
    let {
      mode,
      cancelTitle,
      searchCancelTitle,
      searchPlaceholder
    } = this.props;

    let contentStyle = {
      flex: 1,
      borderRadius: ios ? 15 : 0,
      overflow: "hidden",
      backgroundColor: "white"
    };

    let search = (
      <APSearch
        barWidth={width * 0.9}
        textInputProps={{
          placeholder: searchPlaceholder
        }}
        cancelTitle={searchCancelTitle}
        onCancel={() => this.setState({ itus: Source.itus })}
        onChangeText={this._onSearching}
        onSubmitEditing={this._onSearchSubmit}
      />
    );

    let list = (
      <FlatList
        style={{ flex: 1 }}
        data={this.state.itus}
        extraData={this.state}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <APLocaleCell {...item} mode={mode} onPress={this.dismiss} />
        )}
      />
    );

    let content = (
      <View style={contentStyle}>
        {search}
        {list}
      </View>
    );

    let seperate = <View style={{ height: 15 }} />;

    let cancel = (
      <APButton
        font={{ color: APColor.DeepBlue }}
        title={cancelTitle}
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
    let itus = Source.itus.filter(
      itu => itu.name.includes(text) || itu.code.includes(text)
    );
    this.setState({ itus });
  };
}
