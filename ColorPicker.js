import React, { Component } from "react";
import { View, Text, Slider, Animated, Dimensions } from "react-native";
import PropTypes from "prop-types";
import ModalContainer from "./views/ModalContainer";
import CancelButton from "./views/CancelButton";
const { height } = Dimensions.get("window");

export default class ColorPicker extends Component {
  state = {
    useHex: true,
    onSelected: undefined,
    selectTitle: "确定"
  };

  show = ColorPickerConfig => {
    let { useHex, onSelected, selectTitle } = ColorPickerConfig;
    this.setState(
      {
        useHex: useHex !== null ? useHex : true,
        onSelected,
        selectTitle: selectTitle !== null ? selectTitle : "确定"
      },
      () => this.content.show()
    );
  };

  render() {
    let { useHex, onSelected, selectTitle } = this.state;

    return (
      <ColorPickerContent
        useHex={useHex}
        onSelected={onSelected}
        selectTitle={selectTitle}
        ref={r => (this.content = r)}
      />
    );
  }
}

class ColorPickerContent extends Component {
  static propTypes = {
    useHex: PropTypes.bool,
    onSelected: PropTypes.func,
    selectTitle: PropTypes.string
  };

  static defaultProps = {
    useHex: true,
    selectTitle: "Done"
  };

  state = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    translate: new Animated.Value(height)
  };

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translate, {
      toValue: 0,
      duration: 300
    }).start();
  };

  dismiss = () => {
    this.modal.dismiss();
    Animated.timing(this.state.translate, {
      toValue: height,
      duration: 300
    }).start(() => {
      this.setState(
        {
          r: 0,
          g: 0,
          b: 0,
          a: 1
        },
        () => {
          setTimeout(() => {
            let { onSelected } = this.props;
            onSelected && onSelected(this.title);
          }, 10);
        }
      );
    });
  };

  _renderContents = () => {
    let { translate } = this.state;
    let contentStyle = {
      height: 445,
      padding: 20,
      overflow: "hidden",
      justifyContent: "space-between",
      backgroundColor: "rgba(0, 0, 0, 0)",
      transform: [{ translateY: translate }]
    };

    let seperatorStyle = {
      height: 10,
      backgroundColor: "rgba(0, 0, 0, 0)"
    };

    return (
      <Animated.View style={contentStyle}>
        {this._renderColorContent()}
        <View style={seperatorStyle} />
        {this._renderCancelComponent()}
      </Animated.View>
    );
  };

  _renderColorContent = () => {
    let { r, g, b, a } = this.state;
    let colorContentStyle = {
      flex: 1,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 8,
      backgroundColor: "white"
    };

    let colors = [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      Math.round(a * 255)
    ];
    let color = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${a})`;
    let title;
    if (this.props.useHex) {
      title = `#${colors
        .map(color => `0${color.toString(16).toUpperCase()}`.slice(-2))
        .join("")}`;
    } else {
      title = color;
    }
    this.title = title;

    let titleStyle = {
      color,
      height: 40,
      fontSize: 15,
      textAlign: "center"
    };

    let circleStyle = {
      width: 150,
      height: 150,
      borderRadius: 75,
      shadowRadius: 10,
      shadowColor: "grey",
      shadowOpacity: 0.8,
      elevation: 20,
      alignSelf: "center",
      backgroundColor: color
    };

    return (
      <View style={colorContentStyle}>
        <Text style={titleStyle}>{title}</Text>
        <View style={circleStyle} />
        {this._renderSliders()}
      </View>
    );
  };

  _renderSliders = () => {
    let slidersContainerStyle = {
      flex: 1,
      justifyContent: "space-between"
    };

    return (
      <View style={slidersContainerStyle}>
        <Slider
          minimumTrackTintColor="red"
          onValueChange={this._onRValueChange}
        />
        <Slider
          minimumTrackTintColor="green"
          onValueChange={this._onGValueChange}
        />
        <Slider
          minimumTrackTintColor="blue"
          onValueChange={this._onBValueChange}
        />
        <Slider
          value={this.state.a}
          minimumTrackTintColor="black"
          onValueChange={this._onAValueChange}
        />
      </View>
    );
  };

  _renderCancelComponent = () => {
    let { selectTitle } = this.props;
    return <CancelButton title={selectTitle} onPress={() => this.dismiss()} />;
  };

  render() {
    let { title } = this.state;
    return (
      <ModalContainer
        ref={r => (this.modal = r)}
        content={this._renderContents()}
      />
    );
  }

  _onRValueChange = r => {
    this.setState({ r });
  };
  _onGValueChange = g => {
    this.setState({ g });
  };
  _onBValueChange = b => {
    this.setState({ b });
  };
  _onAValueChange = a => {
    this.setState({ a });
  };
}
