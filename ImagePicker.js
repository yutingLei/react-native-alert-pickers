import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import ModalContainer from "./views/ModalContainer";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

export default class ImagePicker extends React.Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.any),
    selectMode: PropTypes.string,
    selectTitle: PropTypes.string,
    onSelected: PropTypes.func
  };

  static defaultProps = {
    selectMode: "single",
    horizontal: true,
    selectTitle: "确定"
  };

  state = {
    imageSelecteStates: [],
    translateY: new Animated.Value(height)
  };

  componentDidMount() {
    let { images } = this.props;
    if (images) {
      let imageSelecteStates = Array(images.length).fill(false);
      setTimeout(() => {
        this.setState({ imageSelecteStates });
      }, 10);
    }
  }

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: 300
    }).start();
  };

  dismiss = () => {
    this.modal.dismiss();
    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: 300
    }).start();

    let { imageSelecteStates } = this.state;
    let indexs = [];
    imageSelecteStates.filter((state, index) => {
      if (state) {
        indexs.push(index);
      }
    });

    setTimeout(() => {
      this.props.onSelected && this.props.onSelected(indexs);
    }, 350);
  };

  _renderAlertContents = () => {
    let { translateY } = this.state;

    let contentStyle = {
      width: "90%",
      height: "85%",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white",
      overflow: "hidden",
      alignSelf: "center"
    };

    return (
      <View ref="content" style={contentStyle}>
        {this._renderImageContainer()}
      </View>
    );
  };

  _renderImageContainer = () => {
    let { imageSelecteStates } = this.state;
    let { horizontal, images } = this.props;
    if (!images) {
      let textContainerStyle = {
        flex: 1,
        justifyContent: "center"
      };

      let textStyle = {
        color: "red",
        fontSize: 17,
        fontWeight: "bold",
        textAlign: "center"
      };
      return (
        <View style={textContainerStyle}>
          <Text style={textStyle}>啊呀，没找到图片!</Text>
        </View>
      );
    }

    let count = images.length / 2 + images.length % 2;
    let itemWidth = width * 0.9;

    let contentStyle = {
      flexWrap: "wrap",
      flexDirection: "row",
      height: horizontal ? "100%" : count * itemWidth / 2,
      width: horizontal ? itemWidth * images.length : itemWidth
    };

    return (
      <ScrollView
        bounces={!horizontal}
        pagingEnabled={horizontal}
        horizontal={horizontal}
        contentContainerStyle={contentStyle}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        {images.map(image => (
          <ImageItem
            select={imageSelecteStates[images.indexOf(image)]}
            key={images.indexOf(image)}
            image={image}
            horizontal={horizontal}
            onSelect={this._select}
          />
        ))}
      </ScrollView>
    );
  };

  _renderSelectButton = () => {
    let selectContainerStyle = {
      height: 60,
      width: "90%",
      alignSelf: "center",
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0)"
    };

    return (
      <View style={selectContainerStyle}>
        <CancelButton title={this.props.selectTitle} onPress={this.dismiss} />
      </View>
    );
  };

  render() {
    let content = (
      <Animated.View
        style={{
          justifyContent: "flex-end",
          paddingBottom: ios ? 20 : 0,
          transform: [{ translateY: this.state.translateY }]
        }}
      >
        {this._renderAlertContents()}
        {this._renderSelectButton()}
      </Animated.View>
    );

    return <ModalContainer ref={r => (this.modal = r)} content={content} />;
  }

  _select = image => {
    let { imageSelecteStates } = this.state;
    let { selectMode, images } = this.props;
    let index = images.indexOf(image);

    if (selectMode === "single") {
      if (imageSelecteStates[index]) {
        imageSelecteStates[index] = false;
      } else {
        imageSelecteStates.fill(false);
        imageSelecteStates[index] = true;
      }
    } else {
      imageSelecteStates[index] = !imageSelecteStates[index];
    }
    this.setState({ imageSelecteStates });
  };
}

class ImageItem extends React.Component {
  render() {
    let { image, select, horizontal } = this.props;

    let containerStyle = {
      width: horizontal ? width * 0.9 : width * 0.45,
      height: horizontal ? "100%" : width * 0.45,
      alignItems: "center",
      justifyContent: "center"
    };

    let imageStyle = {
      width: "100%",
      height: "100%",
      resizeMode: "cover"
    };

    let selectColor = select ? "rgb(90, 130, 140)" : "rgba(0, 0, 0, 0)";
    let selectViewStyle = {
      top: 15,
      right: 15,
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: "white",
      backgroundColor: selectColor,
      position: "absolute"
    };

    return (
      <View style={containerStyle}>
        <Image style={imageStyle} source={image} />
        <View
          style={selectViewStyle}
          onStartShouldSetResponder={() => true}
          onResponderRelease={this._press}
        />
      </View>
    );
  }

  _press = () => {
    this.props.onSelect(this.props.image);
  };
}
