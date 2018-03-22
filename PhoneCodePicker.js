import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import * as Source from "./source";
import SearchBar from "./views/UISearchBar";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const IPHONEX = WIDTH === 375 && HEIGHT === 812;

export default class PhoneCodePicker extends Component {
  static propTypes = {
    onSelected: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {};

  state = {
    itus: Source.itus,
    visible: false,
    opacity: new Animated.Value(0),
    offset: new Animated.Value(HEIGHT),
    animateHeight: new Animated.Value(0)
  };

  componentDidMount() {
    Source.itus.sort((dt1, dt2) => dt1.name > dt2.name);
    if (Platform.OS === "ios") {
      this.keyboardShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardShow
      );
      this.keyboardHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardHide
      );
    } else {
      this.keyboardShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardShow
      );
      this.keyboardHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardHide
      );
    }
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
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
    let start = event.startCoordinates.screenY;
    let end = event.endCoordinates.screenY;

    Animated.timing(this.state.animateHeight, {
      toValue: 0,
      duration: 250
    }).start();
  };

  _show = () => {
    this.setState({ visible: true, itus: Source.itus });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300
    }).start();
    Animated.timing(this.state.offset, {
      toValue: 0,
      duration: 300
    }).start();
  };

  _dismiss = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300
    }).start();
    Animated.timing(this.state.offset, {
      toValue: HEIGHT,
      duration: 300
    }).start(() => {
      this.setState({ visible: false });
    });
  };

  render() {
    let { opacity, offset, visible, animateHeight } = this.state;

    let groundStyle = {
      flex: 1,
      padding: "5%",
      paddingBottom: IPHONEX ? "10%" : "5%",
      backgroundColor: "rgba(0, 0, 0, 0.6)"
    };

    let containerStyle = {
      flex: 1,
      justifyContent: "space-between"
    };

    let contentStyle = {
      flex: 1,
      borderRadius: 15,
      overflow: "hidden",
      backgroundColor: "white"
    };

    let content = (
      <View style={contentStyle}>
        <SearchBar
          width={WIDTH * 0.9}
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
    let seperate = <View style={{ height: 25 }} />;
    let cancel = <CancelButton title="取消" onPress={this._cancel} />;

    return (
      <Modal visible={visible} transparent={true} animationType="none">
        <Animated.View style={[groundStyle, { opacity }]}>
          <View style={{ height: 50 }} />

          <Animated.View
            style={[containerStyle, { transform: [{ translateY: offset }] }]}
          >
            {content}
            {seperate}
            {cancel}
          </Animated.View>

          <Animated.View style={{ height: animateHeight }} />
        </Animated.View>
      </Modal>
    );
  }

  _onSearching = text => {
    let itus = Source.itus.filter(itu => itu.name.includes(text));
    this.setState({ itus });
  };

  _cancel = () => {
    this._dismiss();
    setTimeout(() => {
      this.props.onCancel && this.props.onCancel();
    }, 350);
  };

  _selectedCode = (name, code) => {
    this._dismiss();
    setTimeout(() => {
      this.props.onSelected && this.props.onSelected(name, code);
    }, 350);
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

    let { data: { code, name, dial_code }, onSelected } = this.props;

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
