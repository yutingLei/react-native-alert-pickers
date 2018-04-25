import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import * as Source from "./source";
import SearchBar from "./views/UISearchBar";
import ModalContainer from "./views/ModalContainer";

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default class PhoneCodePicker extends Component {
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
    itus: Source.itus,
    visible: false,
    translateY: new Animated.Value(height),
    animateHeight: new Animated.Value(20)
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

        <FlatList
          style={{ flex: 1 }}
          data={this.state.itus}
          extraData={this.state}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PhoneCodeItem data={item} onSelected={this._selectedCode} />
          )}
        />
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
    let itus = Source.itus.filter(itu => itu.name.includes(text));
    this.setState({ itus });
  };

  _selectedCode = (name, code) => {
    this.dismiss(() => {
      setTimeout(() => {
        this.props.onSelected && this.props.onSelected(name, code);
      }, 10);
    });
  };
}

class PhoneCodeItem extends PureComponent {
  render() {
    let containerStyle = {
      height: 50,
      alignItems: "center",
      flexDirection: "row"
    };

    let flagStyle = {
      width: 70,
      height: 35,
      resizeMode: "contain"
    };

    let codesStyle = {
      flex: 1,
      height: 50,
      paddingLeft: 10,
      justifyContent: "center",
      borderBottomWidth: 0.5,
      borderBottomColor: "rgb(220, 220, 220)"
    };

    let dialCodeStyle = {
      fontSize: 15,
      fontWeight: "bold"
    };

    let nameStyle = {
      fontSize: 11,
      color: "grey"
    };

    let {
      data: { code, name, dial_code },
      onSelected
    } = this.props;

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => onSelected && onSelected(name, dial_code)}
      >
        <Image style={flagStyle} source={Source.flags[code]} />
        <View style={codesStyle}>
          <Text style={dialCodeStyle}>{`${name}(${code})`}</Text>
          <Text style={nameStyle}>{dial_code}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}