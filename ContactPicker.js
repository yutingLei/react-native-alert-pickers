import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  NativeModules,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import SearchBar from "./views/UISearchBar";
import ModalContainer from "./views/ModalContainer";

const RNContactManager = NativeModules.RNContactManager;
const { width, height } = Dimensions.get("window");

export default class ContactPicker extends Component {
  state = {
    searchPlacehodler: "搜索",
    searchCancelTitle: "取消",
    cancelTitle: "取消",
    onSelected: undefined,
    onCancel: undefined
  };

  show = ContactPickerConfig => {
    if (ContactPickerConfig) {
      let {
        searchPlacehodler,
        searchCancelTitle,
        cancelTitle,
        onSelected,
        onCancel
      } = ContactPickerConfig;
      this.setState(
        {
          searchPlacehodler:
            searchPlacehodler !== undefined ? searchPlacehodler : "搜索",
          searchCancelTitle:
            searchCancelTitle !== undefined ? searchCancelTitle : "取消",
          cancelTitle: cancelTitle !== undefined ? cancelTitle : "取消",
          onSelected,
          onCancel
        },
        () => this.content.show()
      );
    } else {
      this.content.show();
    }
  };

  render() {
    let {
      searchPlacehodler,
      searchCancelTitle,
      cancelTitle,
      onSelected,
      onCancel
    } = this.state;
    return (
      <ContactPickerContent
        ref={r => (this.content = r)}
        searchPlacehodler={searchPlacehodler}
        searchCancelTitle={searchCancelTitle}
        cancelTitle={cancelTitle}
        onSelected={onSelected}
        onCancel={onCancel}
      />
    );
  }
}

class ContactPickerContent extends Component {
  static propTypes = {
    searchPlacehodler: PropTypes.string,
    searchCancelTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    onSelected: PropTypes.func,
    onCancel: PropTypes.func
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

  dismiss = callback => {
    this.modal.dismiss();
    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: 300
    }).start(() => {
      this.setState(
        {
          imutContacts: null,
          contacts: null,
          loading: false,
          err: null
        },
        () =>
          setTimeout(() => {
            callback && callback();
          }, 10)
      );
    });
  };

  _renderContainer = () => {
    let containerStyle = {
      width: "90%",
      height: "90%",
      alignSelf: "center",
      backgroundColor: "rgba(0, 0, 0, 0)"
    };

    let { animateHeight } = this.state;
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
    let contentStyle = {
      flex: 1,
      borderRadius: 15,
      overflow: "hidden",
      backgroundColor: "white"
    };

    let { cancelTitle, searchCancelTitle, searchPlacehodler } = this.props;
    let { loading, err, imutContacts, opacity, translateY } = this.state;
    let content;
    if (this.state.loading || this.state.err) {
      contentStyle.width = "100%";
      contentStyle.justifyContent = "center";

      let loadNode = this.state.loading ? (
        <ActivityIndicator animating={this.state.loading} hidesWhenStopped />
      ) : null;

      let errNode = this.state.err ? (
        <Text style={{ fontSize: 17, color: "red", fontWeight: "bold" }}>
          {this.state.err}
        </Text>
      ) : null;

      content = (
        <View style={contentStyle}>
          {loadNode}
          {errNode}
        </View>
      );
    } else {
      content = (
        <View style={contentStyle}>
          <SearchBar
            width={width * 0.9}
            placeholderText={searchPlacehodler}
            cancelTitle={searchCancelTitle}
            onCancel={() => this.setState({ contacts: imutContacts })}
            onChangeText={this._onSearching}
            onSubmitEditing={this._onSearchSubmit}
          />

          <FlatList
            style={{ flex: 1 }}
            data={this.state.contacts}
            // extraData={this.state}
            keyExtractor={item => item.phoneNumber}
            renderItem={({ item }) => (
              <ContactItem data={item} onSelected={this._selectedContact} />
            )}
          />
        </View>
      );
    }

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
    let { imutContacts } = this.state;
    if (imutContacts) {
      let contacts = imutContacts.filter(
        contact =>
          contact.name.includes(text) || contact.phoneNumber.includes(text)
      );
      this.setState({ contacts: contacts });
    }
  };

  _selectedContact = data => {
    this.dismiss(() => {
      this.props.onSelected && this.props.onSelected(data);
    });
  };
}

class ContactItem extends PureComponent {
  render() {
    let containerStyle = {
      height: 50,
      padding: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderColor: "rgb(180, 180, 180)"
    };

    let nameStyle = {
      fontSize: 15,
      fontWeight: "bold"
    };

    let codeStyle = {
      fontSize: 11,
      color: "grey"
    };

    let {
      data: { phoneNumber, name },
      onSelected
    } = this.props;

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => onSelected && onSelected(this.props.data)}
      >
        <Text style={nameStyle}>{name}</Text>
        <Text style={codeStyle}>{phoneNumber}</Text>
      </TouchableOpacity>
    );
  }
}
