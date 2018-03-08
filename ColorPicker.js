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

const CancelButton = require("./views/CancelButton");
const height = Dimensions.get("window").height;

export default class ColorPicker extends Component {
  static propTypes = {
    useHex: PropTypes.bool,
    visible: PropTypes.bool.isRequired,
    onPicked: PropTypes.func
  };

  static defaultProps = {
    useHex: true,
    defaultColor: "rgb(255, 0, 0)"
  };

  state = {
    r: 255,
    g: 0,
    b: 0,
    a: 1,
    title: "#FF0000FF",
    opacity: new Animated.Value(0),
    offsetY: new Animated.Value(height)
  };

  componentWillReceiveProps(newProps) {
    if (newProps.visible) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300
      }).start();
      Animated.timing(this.state.offsetY, {
        toValue: 0,
        duration: 300
      }).start();
    }
  }

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
    Animated.timing(this.state.offsetY, {
      toValue: height,
      duration: 300
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 350
    }).start(() => {
      this.props.onPicked && this.props.onPicked(this.title);
    });
  };

  render() {
    let { title, opacity, offsetY } = this.state;
    if (!this.props.visible) {
      return <View />;
    }
    return (
      <Modal visible={this.props.visible} transparent animationType="none">
        <Animated.View style={[styles.background, { opacity }]}>
          <View style={{ flex: 1 }} />

          <Animated.View
            style={[styles.container, { transform: [{ translateY: offsetY }] }]}
          >
            {this._createContents()}
            <CancelButton title="Done" onPress={this._dismissModal} />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  container: {
    height: "75%",
    paddingBottom: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.0)"
  },
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
