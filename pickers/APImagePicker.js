//system
import React from "react";
import {
  View,
  Animated,
  Platform,
  FlatList,
  Dimensions,
  requireNativeComponent
} from "react-native";
import PropTypes from "prop-types";
// custom
import APButton from "../views/APButton";
import { APColor, APTime } from "../utils";
import APContainer from "../views/APContainer";
import APActivity from "../views/APActivity";
import APImageCell from "../views/APImageCell";
// const
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const APImagesView = requireNativeComponent("RNImagesView", APSystemProvider);

export default class APImagePicker extends React.Component {
  show = APImagePickerConfig => {
    this.setState({ ...APImagePickerConfig }, () => this.content.show());
  };

  render() {
    return (
      <APImagePickerContent {...this.state} ref={r => (this.content = r)} />
    );
  }
}

/**
 * 图片选择器内容实现
 */
class APImagePickerContent extends React.Component {
  static propTypes = {
    provider: PropTypes.string,
    horizontal: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.any),
    selectMode: PropTypes.string,
    selectTitle: PropTypes.string,
    cancelTitle: PropTypes.string,
    onSelected: PropTypes.func
  };

  static defaultProps = {
    provider: "system",
    horizontal: true,
    selectMode: "single",
    selectTitle: "选择",
    cancelTitle: "取消"
  };

  state = {
    err: null,
    images: null,
    loading: true,
    translateY: new Animated.Value(height)
  };

  show = () => {
    this.modal.show();
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: APTime.Default
    }).start(() => this.system && this.system.fetchAssetsCollections());
  };

  /**
   * 隐藏图片选择器
   * 点击“取消”或“选择”按钮触发
   */
  dismiss = val => {
    let { cancelTitle, onSelected } = this.props;
    let { nativeEvent } = val;

    this.modal.dismiss(() => {
      if (nativeEvent && nativeEvent.images) {
        onSelected && onSelected(nativeEvent.images);
      } else if (val && val !== cancelTitle) {
        onSelected && onSelected(val);
      }
    });

    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: APTime.Default
    }).start();
  };

  render() {
    let containerStyle = {
      width: "90%",
      height: "90%",
      transform: [{ translateY: this.state.translateY }]
    };

    let contentStyle = {
      flex: 1,
      overflow: "hidden",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white"
    };

    let { provider, cancelTitle } = this.props;

    let content = (
      <View style={contentStyle}>{this._renderContent(provider)}</View>
    );

    let seperator = <View style={{ height: 15 }} />;

    let cancel = (
      <APButton
        font={{ color: APColor.DeepBlue }}
        title={cancelTitle}
        onPress={this.dismiss}
      />
    );

    let contents = (
      <Animated.View style={containerStyle}>
        {content}
        {seperator}
        {cancel}
      </Animated.View>
    );

    return <APContainer ref={r => (this.modal = r)} content={contents} />;
  }

  _renderContent = provider => {
    switch (provider) {
      case "self":
        return (
          <APSelfProvider
            {...this.props}
            ref={r => (this.self = r)}
            onSelected={this.dismiss}
          />
        );
      default:
        return (
          <APSystemProvider
            {...this.props}
            ref={r => (this.system = r)}
            onSelected={this.dismiss}
          />
        );
    }
  };
}

/**
 * 自我提供图片实现
 */
class APSelfProvider extends React.Component {
  state = {
    selectedImages: new Map()
  };

  render() {
    return this._renderContent();
  }

  _renderContent = () => {
    let { images, provider, horizontal, selectTitle } = this.props;
    let { selectedImages } = this.state;

    console.log(`Images: ${JSON.stringify(this.props)}`);

    if (!images || (images && images.length === 0)) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <APActivity
            enable={false}
            message="未找到图片"
            messageFont={{ color: "red" }}
          />
        </View>
      );
    }

    let list = (
      <FlatList
        bounces={!horizontal}
        horizontal={horizontal}
        pagingEnabled={horizontal}
        numColumns={horizontal ? 1 : 2}
        data={images}
        extraData={this.state}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => (
          <APImageCell
            id={images.indexOf(item)}
            source={item}
            select={selectedImages.get(images.indexOf(item)) !== undefined}
            provider={provider}
            horizontal={horizontal}
            onPress={this._onPress}
          />
        )}
      />
    );

    let line = <View style={{ height: 1, backgroundColor: APColor.Gray }} />;

    let select = (
      <APButton
        font={{ color: APColor.DeepBlue }}
        title={selectTitle}
        style={{ borderRadius: 0 }}
        enable={selectedImages.size !== 0}
        onPress={this._onSelected}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        {list}
        {line}
        {select}
      </View>
    );
  };

  /**
   * 选择图片处理函数
   */
  _onPress = key => {
    let { images, selectMode } = this.props;
    let { selectedImages } = this.state;

    if (selectedImages.has(key)) {
      selectedImages.delete(key);
    } else {
      if (selectMode === "single") {
        selectedImages.clear();
        selectedImages.set(key, images[key]);
      } else {
        selectedImages.set(key, images[key]);
      }
    }
    this.setState({ selectedImages });
  };

  /**
   * 点击选择按钮处理函数
   */
  _onSelected = () => {
    let onSelected = this.props.onSelected;
    let selectedImages = this.state.selectedImages;
    onSelected && onSelected([...selectedImages.values()]);
  };
}

/**
 * 系统中获取图片来展示
 */
//

class APSystemProvider extends React.Component {
  state = {
    fetchCollections: false
  };

  fetchAssetsCollections = () => {
    this.setState({ fetchCollections: true });
  };

  render() {
    let { fetchCollections } = this.state;
    console.log(this.props.onSelected);
    return (
      <APImagesView
        {...this.props}
        style={{ flex: 1 }}
        fetchCollections={fetchCollections}
      />
    );
  }
}
