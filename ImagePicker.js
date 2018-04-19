import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  NativeModules,
  VirtualizedList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import CancelButton from "./views/CancelButton";
import ModalContainer from "./views/ModalContainer";
const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const RNImageManager = NativeModules.RNImageManager;
let targetImageSize = null;

export default class ImagePicker extends React.Component {
  state = {
    provider: "system",
    horizontal: true,
    images: undefined,
    selectMode: "single",
    selectTitle: "确定",
    onSelected: undefined
  };

  show = ImagePickerConfig => {
    if (ImagePickerConfig) {
      let {
        provider,
        horizontal,
        images,
        selectMode,
        selectTitle,
        onSelected
      } = ImagePickerConfig;
      this.setState(
        {
          provider: provider !== undefined ? provider : "system",
          horizontal: horizontal !== undefined ? horizontal : true,
          selectMode: selectMode !== undefined ? selectMode : "single",
          selectTitle: selectTitle !== undefined ? selectTitle : "确定",
          images,
          onSelected
        },
        () => this.content.show()
      );
    } else {
      this.content.show();
    }
  };

  render() {
    let {
      provider,
      horizontal,
      images,
      selectMode,
      selectTitle,
      onSelected
    } = this.state;
    return (
      <ImagePickerContent
        ref={r => (this.content = r)}
        provider={provider}
        horizontal={horizontal}
        images={images}
        selectMode={selectMode}
        selectTitle={selectTitle}
        onSelected={onSelected}
      />
    );
  }
}

class ImagePickerContent extends React.Component {
  static propTypes = {
    provider: PropTypes.string, // self, system
    horizontal: PropTypes.bool, // show mode
    images: PropTypes.arrayOf(PropTypes.any), // only for provider="self" mode
    selectMode: PropTypes.string, // single, multiple
    selectTitle: PropTypes.string, // 确定
    onSelected: PropTypes.func // values => void
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
      duration: 300
    }).start(() => {
      if (this.props.provider !== "self") {
        this.album.load();
      }
    });
  };

  dismiss = () => {
    this.modal.dismiss();
    Animated.timing(this.state.translateY, {
      toValue: height,
      duration: 300
    }).start(() => {
      let { provider, onSelected } = this.props;
      let values = provider.includes("self")
        ? this.user.commit()
        : this.album.commit();
      setTimeout(() => {
        onSelected && onSelected(values);
      }, 10);
    });
  };

  _renderContents = () => {
    let { provider } = this.props;
    if (provider === "self") {
      return <UsersImagePicker {...this.props} ref={r => (this.user = r)} />;
    } else {
      return <AlbumImagePicker {...this.props} ref={r => (this.album = r)} />;
    }
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
    let containerStyle = {
      justifyContent: "flex-end",
      paddingBottom: ios ? 20 : 0,
      transform: [{ translateY: this.state.translateY }]
    };

    let contentStyle = {
      width: "90%",
      height: "85%",
      borderRadius: ios ? 8 : 0,
      backgroundColor: "white",
      overflow: "hidden",
      alignSelf: "center"
    };

    let content = (
      <Animated.View style={containerStyle}>
        <View style={contentStyle}>{this._renderContents()}</View>
        {this._renderSelectButton()}
      </Animated.View>
    );

    return <ModalContainer ref={r => (this.modal = r)} content={content} />;
  }
}

class UsersImagePicker extends React.Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  static defaultProps = {
    loading: false
  };

  state = {
    imageSelecteStates: []
  };

  commit = () => {
    return this.images;
  };

  componentWillReceiveProps(newProps) {
    if (newProps.images && newProps.images.length !== 0) {
      let { imageSelecteStates } = this.state;
      imageSelecteStates = Array(newProps.images.length).fill(false);
      this.setState({ imageSelecteStates });
    }
  }

  _renderImages = () => {
    let { images, loading } = this.props;
    if (loading || !images) {
      return (
        <ActivityAndError
          err={images ? null : "哎呀，没找到图片"}
          loading={loading}
        />
      );
    }

    let { horizontal } = this.props;
    let { imageSelecteStates } = this.state;
    let lines = images.length / 2 + images.length % 2;
    let imageWidth = horizontal ? width * 0.9 : width * 0.45;

    let imageContainerStyle = {
      flexWrap: "wrap",
      flexDirection: "row",
      width: horizontal ? imageWidth * images.length : width * 0.9,
      height: horizontal ? "100%" : lines * imageWidth
    };

    return (
      <FlatList
        bounces={!horizontal}
        horizontal={horizontal}
        pagingEnabled={horizontal}
        numColumns={horizontal ? 1 : 2}
        data={images}
        extraData={this.state}
        keyExtractor={item => `${images.indexOf(item)}`}
        renderItem={({ item }) => (
          <ImageItem
            index={images.indexOf(item)}
            source={item}
            select={imageSelecteStates[images.indexOf(item)]}
            provider={this.props.provider}
            horizontal={horizontal}
            onSelect={this._select}
          />
        )}
      />
    );
  };

  _select = (source, index) => {
    let { images, selectMode } = this.props;
    let { imageSelecteStates } = this.state;

    if (!this.images) {
      this.images = [];
    }

    if (selectMode.includes("single")) {
      if (imageSelecteStates[index]) {
        this.images.pop();
        imageSelecteStates[index] = false;
      } else {
        this.images.push(source);
        imageSelecteStates.fill(false);
        imageSelecteStates[index] = true;
      }
    } else {
      if (!this.images.includes(source)) {
        this.images.push(source);
      }
      imageSelecteStates[index] = !imageSelecteStates[index];
    }
    this.setState({ imageSelecteStates });
  };

  render() {
    return this._renderImages();
  }
}

class AlbumImagePicker extends React.Component {
  state = {
    loadCollectionErr: null,
    loadingCollection: true,
    loadingAssets: true,
    loadAssetErr: null,
    translateX: new Animated.Value(width * 0.9),
    assetsCollections: null,
    assets: null
  };

  load = () => {
    RNImageManager.fetchAssetsCollections()
      .then(assetsCollections => {
        this.setState({ assetsCollections, loadingCollection: false });
      })
      .catch(loadCollectionErr => {
        this.setState({ loadCollectionErr, loadingCollection: false });
      });
  };

  commit = () => {
    if (this.state.assets) {
      return this.user.commit();
    }
  };

  _renderContents = () => {
    let contentStyle = {
      flex: 1
    };

    return (
      <View style={contentStyle}>
        {this._renderAssetsCollection()}
        {this._renderImagesContainer()}
      </View>
    );
  };

  _renderAssetsCollection = () => {
    let {
      assetsCollections,
      loadCollectionErr,
      loadingCollection
    } = this.state;
    if (loadingCollection || loadCollectionErr) {
      return (
        <ActivityAndError err={loadCollectionErr} loading={loadingCollection} />
      );
    }

    return (
      <FlatList
        bounces={false}
        keyExtractor={option => option.title}
        data={assetsCollections}
        renderItem={({ item }) => (
          <CollectionItem
            collectionOption={item}
            onPress={this._pressCollectionItem}
          />
        )}
      />
    );
  };

  _renderImagesContainer = () => {
    let { assets, loadingAssets, loadAssetErr } = this.state;
    if (loadingAssets || loadAssetErr) {
      assets = null;
    }

    let imagesContainerStyle = {
      width: width * 0.9,
      height: "100%",
      position: "absolute",
      backgroundColor: "white",
      transform: [{ translateX: this.state.translateX }]
    };

    let userPicker = assets ? (
      <UsersImagePicker
        {...this.props}
        ref={r => (this.user = r)}
        images={assets}
        loading={loadingAssets}
      />
    ) : null;

    return (
      <Animated.View style={imagesContainerStyle}>
        <BackItem onPress={this._back} />
        {userPicker}
      </Animated.View>
    );
  };

  render() {
    return this._renderContents();
  }

  _pressCollectionItem = collectionID => {
    Animated.timing(this.state.translateX, {
      toValue: 0,
      duration: 300
    }).start(() => {
      RNImageManager.fetchAssets(collectionID, false)
        .then(assets => {
          if (assets.length <= 10) {
            targetImageSize = null;
          } else if (assets.length > 10 && assets.length <= 30) {
            targetImageSize = { width: width * 0.9, height: 0.9 };
          } else if (assets.length > 30 && assets.length <= 100) {
            targetImageSize = { width: width * 0.45, height: width * 0.45 };
          } else {
            targetImageSize = { width: width * 0.1, height: width * 0.1 };
          }
          this.setState({ assets, loadingAssets: false });
        })
        .catch(loadAssetErr => {
          this.setState({ loadAssetErr, loadingAssets: false });
        });
    });
  };

  _back = () => {
    Animated.timing(this.state.translateX, {
      toValue: width * 0.9,
      duration: 300
    }).start(() => {
      this.setState({ loadingAssets: true, assets: null, err: null });
    });
  };
}

class CollectionItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    collectionOption: PropTypes.object
  };

  render() {
    let {
      collectionOption: { title, count, id },
      onPress
    } = this.props;

    let itemStyle = {
      height: 65,
      padding: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: "rgb(180, 180, 180)"
    };

    let titleStyle = {
      color: "deepskyblue",
      fontSize: 20,
      fontWeight: "bold"
    };

    let countStyle = {
      color: "gray",
      fontSize: 15
    };

    let imageStyle = {
      width: 15,
      height: 15,
      resizeMode: "contain"
    };

    return (
      <TouchableOpacity
        style={itemStyle}
        activeOpacity={0.75}
        onPress={() => onPress(id)}
      >
        <Text>
          <Text style={titleStyle}>{title}</Text>
          <Text style={countStyle}>{` (${count})`}</Text>
        </Text>
        <Image style={imageStyle} source={require("./source/arrow.png")} />
      </TouchableOpacity>
    );
  }
}

class ImageItem extends React.Component {
  state = {
    source: null
  };

  render() {
    let { source, select, horizontal, provider } = this.props;

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
        <Image
          style={imageStyle}
          source={provider.includes("self") ? source : this.state.source}
          onLayout={() => {
            if (provider.includes("system")) {
              RNImageManager.fetchImage(source, targetImageSize)
                .then(image => this.setState({ source: image }))
                .catch(err => alert(err));
            }
          }}
        />
        <View
          style={selectViewStyle}
          onStartShouldSetResponder={() => true}
          onResponderRelease={this._press}
        />
      </View>
    );
  }

  _press = () => {
    let source = this.props.provider.includes("self")
      ? this.props.source
      : this.state.source;
    this.props.onSelect(source, this.props.index);
  };
}

class BackItem extends React.PureComponent {
  render() {
    let containerStyle = {
      width: "100%",
      height: 30,
      justifyContent: "center",
      backgroundColor: "rgb(240, 240, 240)"
    };

    let imageStyle = {
      width: 20,
      height: 20,
      marginTop: 5,
      marginLeft: 10,
      resizeMode: "contain"
    };

    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={0.8}
        onPress={this.props.onPress}
      >
        <Image style={imageStyle} source={require("./source/back.png")} />
      </TouchableOpacity>
    );
  }
}

class ActivityAndError extends React.Component {
  static propTypes = {
    err: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool
  };

  static defaultProps = {
    err: null,
    loading: true
  };

  render() {
    let { err, loading } = this.props;

    let containerStyle = {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    };

    let textStyle = {
      color: "red",
      fontSize: 17,
      fontWeight: "bold",
      textAlign: "center"
    };

    let errNode =
      err && !loading ? <Text style={textStyle}>{`${err}`}</Text> : null;

    return (
      <View style={containerStyle}>
        <ActivityIndicator animating={loading} hidesWhenStopped />
        {errNode}
      </View>
    );
  }
}
