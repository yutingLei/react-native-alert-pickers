import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  MapView,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import SearchBar from "./views/UISearchBar";
import ModalContainer from "./views/ModalContainer";

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default class LocationPicker extends Component {
  state = {
    searchPlaceholder: "搜索",
    searchCancelTitle: "取消",
    cancelTitle: "取消",
    onSelected: undefined,
    onCancel: undefined
  };

  show = LocationPickerConfig => {
    if (LocationPickerConfig) {
      let {
        searchPlaceholder,
        searchCancelTitle,
        onSelected,
        onCancel,
        cancelTitle
      } = LocationPickerConfig;
      this.setState(
        {
          searchCancelTitle:
            searchCancelTitle !== undefined ? searchCancelTitle : "取消",
          searchPlaceholder:
            searchPlaceholder !== undefined ? searchPlaceholder : "搜索",
          cancelTitle: cancelTitle !== undefined ? cancelTitle : "取消",
          onSelected: onSelected,
          onCancel: onCancel
        },
        () => this.content.show()
      );
    } else {
      this.content.show();
    }
  };

  render() {
    let {
      searchPlaceholder,
      searchCancelTitle,
      onSelected,
      onCancel,
      cancelTitle
    } = this.state;
    return (
      <LocationPickerContent
        ref={r => (this.content = r)}
        searchPlaceholder={searchPlaceholder}
        searchCancelTitle={searchCancelTitle}
        cancelTitle={cancelTitle}
        onSelected={onSelected}
        onCancel={onCancel}
      />
    );
  }
}

class LocationPickerContent extends Component {
  static propTypes = {
    searchPlaceholder: PropTypes.string,
    searchCancelTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    onSelected: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    searchPlaceholder: "搜索",
    searchCancelTitle: "取消",
    cancelTitle: "取消"
  };

  state = {
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
    let start = event.startCoordinates.screenY;
    let end = event.endCoordinates.screenY;

    Animated.timing(this.state.animateHeight, {
      toValue: Math.abs(start - end),
      duration: 250
    }).start();
  };

  _keyboardHide = event => {
    Animated.timing(this.state.animateHeight, {
      toValue: 20,
      duration: 250
    }).start();
  };

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: 300
    }).start();
  };

  dismiss = callback => {
    this.modal.dismiss();
    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: 300
    }).start(() => {
      callback && callback();
    });
  };

  _renderContainer = () => {
    let { animateHeight } = this.state;

    let containerStyle = {
      width: "90%",
      height: "90%",
      alignSelf: "center",
      backgroundColor: "rgba(0, 0, 0, 0)"
    };

    let keyboardOffsetStyle = {
      height: animateHeight
    };

    return (
      <View style={containerStyle}>
        {this._renderContent()}
        <Animated.View style={keyboardOffsetStyle} />
      </View>
    );
  };

  _renderContent = () => {
    let { opacity, translateY } = this.state;
    let { cancelTitle, searchCancelTitle, searchPlaceholder } = this.props;

    let contentStyle = {
      flex: 1,
      borderRadius: ios ? 15 : 0,
      overflow: "hidden",
      backgroundColor: "white"
    };

    let mapViewStyle = {
      flex: 1
    };

    let content = (
      <View style={contentStyle}>
        <SearchBar
          barWidth={width * 0.9}
          textInputProps={{
            placeholder: searchPlaceholder
          }}
          cancelTitle={searchCancelTitle}
          onCancel={() => this.setState({ itus: Source.itus })}
          onChangeText={this._onSearching}
          onSubmitEditing={this._onSearchSubmit}
        />
        <MapView style={mapViewStyle} />
      </View>
    );
    let seperate = <View style={{ height: 15 }} />;
    let cancel = <CancelButton title={cancelTitle} onPress={this.dismiss} />;

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        {content}
        {seperate}
        {cancel}
      </Animated.View>
    );
  };

  render() {
    return (
      <ModalContainer
        ref={r => (this.modal = r)}
        content={this._renderContainer()}
      />
    );
  }

  _onSearching = text => {
    // let itus = Source.itus.filter(itu => itu.name.includes(text));
    // this.setState({ itus });
  };

  _selectedLocation = location => {
    this.dismiss(() => {
      setTimeout(() => {
        this.props.onSelected && this.props.onSelected(location);
      }, 10);
    });
  };
}
