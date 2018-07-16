// system
import React from "react";
import {
  View,
  Dimensions,
  NativeModules,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
// custom
import { APColor } from "../utils";
import APActivity from "./APActivity";
// const
const { width } = Dimensions.get("window");
const RNImageManager = NativeModules.RNImageManager;

export default class APImageCell extends React.Component {
  static propTypes = {
    select: PropTypes.bool,
    source: PropTypes.any,
    provider: PropTypes.string,
    horizontal: PropTypes.bool,
    onPress: PropTypes.func
  };

  state = {
    startLoading: false,
    loading: true,
    image: null,
    err: null
  };

  render() {
    let { id, source, select, onPress, horizontal, provider } = this.props;
    let { loading, image, err, startLoading } = this.state;

    let size = {
      width: horizontal ? width * 0.9 : width * 0.45,
      height: horizontal ? "100%" : width * 0.45
    };

    let imageStyle = {
      ...size,
      alignItems: "center",
      justifyContent: "center"
    };

    let selectViewStyle = {
      top: 15,
      right: 15,
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: APColor.Select,
      backgroundColor: APColor.Clear,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center"
    };

    let selectStyle = {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: select ? APColor.Select : APColor.Clear
    };

    let selectView =
      loading || err ? null : (
        <View style={selectViewStyle}>
          <TouchableOpacity
            activeOpacity={1}
            style={selectStyle}
            onPress={() => onPress && onPress(id)}
          />
        </View>
      );

    let activity =
      loading || err ? <APActivity enable={loading} message={err} /> : null;

    return (
      <ImageBackground
        style={imageStyle}
        source={provider === "self" ? source : image}
        onError={event => this.setState({ err: event.nativeEvent.error })}
        onLoad={() => {
          if (provider === "self") {
            this.setState({ loading: false });
          }
        }}
        onLayout={() => {
          if (provider === "system" && !startLoading) {
            this.state.startLoading = true;

            RNImageManager.fetchImage(source, null, (err, image) => {
              if (err) {
                this.setState({ loading: false, err });
              } else {
                this.setState({ image, loading: false });
              }
            });
          }
        }}
      >
        {selectView}
        {activity}
      </ImageBackground>
    );
  }
}
