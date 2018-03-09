import React, { Component } from "react";
import {
  View,
  Text,
  Slider,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import ActionSheetView from "./views/ActionSheetView";

export default class ColorPicker extends Component {
  static propTypes = {
    useHex: PropTypes.bool,
    visible: PropTypes.bool.isRequired,
    onPicked: PropTypes.func
  };

  static defaultProps = {
    useHex: true
  };

  state = {
    r: 255,
    g: 0,
    b: 0,
    a: 1,
    title: "#FF0000FF"
  };

  _onRValueChange = r => {
    this.setState({ r: Math.ceil(r * 255) });
  };

  _onGValueChange = g => {
    this.setState({ g: Math.ceil(g * 255) });
  };

  _onBValueChange = b => {
    this.setState({ b: Math.ceil(b * 255) });
  };

  _onAValueChange = a => {
    this.setState({ a: Math.floor(a * 100) / 100 });
  };

  _createContents = () => {
    let { r, g, b, a } = this.state;
    let color;
    if (this.props.useHex) {
      r = `0${r.toString(16)}`.slice(-2);
      g = `0${g.toString(16)}`.slice(-2);
      b = `0${b.toString(16)}`.slice(-2);
      a = `0${Math.ceil(a * 255).toString(16)}`.slice(-2);
      color = `#${r}${g}${b}${a}`.toUpperCase();
      this.title = `#${r}${g}${b}${a}`.toUpperCase();
    } else {
      color = `rgba(${r},${g},${b},${a})`;
      this.title = `RGBA(${r},${g},${b},${a})`;
    }

    return (
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{this.title}</Text>
        <View style={[styles.circleView, { backgroundColor: color }]} />
        {this._createSliders()}
      </View>
    );
  };

  _createSliders = () => {
    let { r, g, b, a } = this.state;

    return (
      <View style={styles.sliderContainer}>
        <Slider
          value={r / 255}
          minimumTrackTintColor="red"
          onValueChange={this._onRValueChange.bind(this)}
        />
        <Slider
          value={g / 255}
          minimumTrackTintColor="green"
          onValueChange={this._onGValueChange.bind(this)}
        />
        <Slider
          value={b / 255}
          minimumTrackTintColor="blue"
          onValueChange={this._onBValueChange.bind(this)}
        />
        <Slider
          value={a}
          minimumTrackTintColor="black"
          onValueChange={this._onAValueChange.bind(this)}
        />
      </View>
    );
  };

  _dismissModal = () => {
    this.ref._dismiss && this.ref._dismiss();
  };

  render() {
    let { title } = this.state;
    return (
      <ActionSheetView
        ref={r => (this.ref = r)}
        visible={this.props.visible}
        contentHeight="75%"
        content={this._createContents()}
        cancel={<CancelButton title="Done" onPress={this._dismissModal} />}
        onDismissed={() => this.props.onPicked && this.props.onPicked(title)}
      />
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 0.95,
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    backgroundColor: "rgb(250, 250, 250)"
  },
  title: {
    fontSize: 15,
    textAlign: "center"
  },
  circleView: {
    width: 150,
    height: 150,
    borderRadius: 75,
    shadowRadius: 10,
    shadowColor: "grey",
    shadowOpacity: 0.8,
    elevation: 20,
    alignSelf: "center"
  },
  sliderContainer: {
    justifyContent: "space-around"
  }
});
