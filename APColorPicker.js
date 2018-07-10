// system
import React from "react";
import {
  View,
  Text,
  Slider,
  Animated,
  Dimensions,
  Platform
} from "react-native";
import PropTypes from "prop-types";
// custom
import APContainer from "./views/APContainer";
import APButton from "./views/APButton";
import { APTime, APColor } from "./utils";
// const
const { height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

/**
 * 颜色选择器，支持R,G,B,A四种属性
 */
export default class APColorPicker extends React.Component {
  show = ColorPickerConfig => {
    this.setState({ ...ColorPickerConfig }, () => this.content.show());
  };

  render() {
    return (
      <APColorPickerContent {...this.state} ref={r => (this.content = r)} />
    );
  }
}

class APColorPickerContent extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    onSelected: PropTypes.func,
    selectTitle: PropTypes.string,
    cancelTitle: PropTypes.string
  };

  static defaultProps = {
    mode: "rgba",
    selectTitle: "选择",
    cancelTitle: "取消"
  };

  state = {
    r: 180,
    g: 50,
    b: 50,
    a: 1,
    translateY: new Animated.Value(height)
  };

  show = () => {
    this.container.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start();
  };

  dismiss = title => {
    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: APTime.Default
    }).start();

    this.container.dismiss(() => {
      if (title === "selected") {
        console.log(this.color);
        let onSelected = this.props.onSelected;
        onSelected && onSelected(this.color);
      }
    });
  };

  render() {
    return (
      <APContainer
        mode="action-sheet"
        ref={r => (this.container = r)}
        content={this._renderContents()}
      />
    );
  }

  _renderContents = () => {
    let { translateY } = this.state;
    let contentStyle = {
      height: 500,
      padding: ios ? 20 : 0,
      paddingTop: 0,
      overflow: "hidden",
      transform: [{ translateY }],
      justifyContent: "space-between",
      backgroundColor: APColor.Clear
    };

    let { cancelTitle } = this.props;

    let seperator = (
      <View
        style={{
          height: 10,
          backgroundColor: APColor.Clear
        }}
      />
    );

    let selecte = (
      <APButton
        title={cancelTitle}
        font={{ color: APColor.DeepBlue }}
        onPress={this.dismiss}
      />
    );

    return (
      <Animated.View style={contentStyle}>
        {this._renderColorContent()}
        {seperator}
        {selecte}
      </Animated.View>
    );
  };

  _renderColorContent = () => {
    let colorContentStyle = {
      flex: 1,
      borderRadius: 8,
      backgroundColor: "white"
    };
    this.color = this._getColor();

    let title = (
      <Text
        style={{
          height: 50,
          fontSize: 17,
          paddingTop: ios ? 10 : 0,
          textAlign: "center",
          textAlignVertical: "center" // android only
        }}
        numberOfLines={1}
      >
        {this.color}
      </Text>
    );

    let colorCircle = (
      <View
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          alignSelf: "center",
          elevation: 20,
          shadowColor: this.color,
          shadowRadius: 10,
          shadowOpacity: 0.8,
          backgroundColor: this.color
        }}
      />
    );

    let sliders = this._renderSliders();

    let line = <View style={{ height: 1, backgroundColor: APColor.Gray }} />;

    let select = (
      <APButton
        font={{ color: APColor.DeepBlue }}
        title={this.props.selectTitle}
        onPress={() => this.dismiss("selected")}
      />
    );

    return (
      <View style={colorContentStyle}>
        {title}
        {colorCircle}
        {sliders}
        {line}
        {select}
      </View>
    );
  };

  _renderSliders = () => {
    let slidersContainerStyle = {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      justifyContent: "space-around"
    };
    let mode = this.props.mode;
    let isHLS = mode.includes("hsl");
    let hasAlpha = mode.includes("a");
    let sliderSource = [
      {
        key: "r", // or h
        value: isHLS ? 180 : 0,
        thumbImage: isHLS ? undefined : require("./source/red_circle.png"),
        maximumValue: isHLS ? 360 : 255,
        minimumTrackTintColor: isHLS ? this.color : "red"
      },
      {
        key: "g", // or l
        value: isHLS ? 50 : 0,
        thumbImage: isHLS ? undefined : require("./source/green_circle.png"),
        maximumValue: isHLS ? 100 : 255,
        minimumTrackTintColor: isHLS ? this.color : "green"
      },
      {
        key: "b", // or s
        value: isHLS ? 50 : 0,
        thumbImage: isHLS ? undefined : require("./source/blue_circle.png"),
        maximumValue: isHLS ? 100 : 255,
        minimumTrackTintColor: isHLS ? this.color : "blue"
      },
      hasAlpha
        ? {
            key: "a",
            step: 0.01,
            value: 1,
            thumbImage: isHLS
              ? undefined
              : require("./source/black_circle.png"),
            minimumTrackTintColor: isHLS ? this.color : APColor.HalfClear
          }
        : undefined
    ];

    switch (mode) {
      case "rgb":
      case "hsl":
        sliderSource.pop(4);
        break;
      default:
        break;
    }

    return (
      <View style={slidersContainerStyle}>
        {sliderSource.map(src => (
          <Slider
            {...src}
            onValueChange={val =>
              this.setState({
                [src.key]: src.key === "a" ? val : Math.round(val)
              })
            }
          />
        ))}
      </View>
    );
  };

  _getColor = () => {
    let { r, g, b, a } = this.state;
    let mode = this.props.mode;
    let colors = [r, g, b];

    /// 包含alpha
    if (mode.includes("a")) {
      colors.push(Math.round(a * 100) / 100);
    }
    switch (mode) {
      case "rgba":
        return `rgba(${colors})`;
      case "rgba-hex":
        colors = colors.map(color => `0${color.toString(16)}`.slice(-2));
        return `#${colors.join("").toUpperCase()}`;
      case "rgb-hex":
        colors = colors.map(color => `0${color.toString(16)}`.slice(-2));
        return `#${colors.join("").toUpperCase()}`;
      case "hsl":
        return `hsl(${r}, ${g}%, ${b}%)`;
      case "hsla":
        return `hsla(${r}, ${g}%, ${b}%, ${colors[3]})`;
      default:
        return `rgb(${colors})`;
    }
  };
}
