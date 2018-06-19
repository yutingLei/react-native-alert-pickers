import React from "react";
import PropTypes from "prop-types";
import { NativeModules, requireNativeComponent } from "react-native";

const { RNMapManager } = NativeModules;
var RNMap = requireNativeComponent("RNMap", MapView);

class MapView extends React.Component {
  static startUpdateLocation() {
    RNMapManager.startUpdateLocation();
  }

  static stopUpdateLocation() {
    RNMapManager.stopUpdateLocation();
  }

  render() {
    return <RNMap {...this.props} />;
  }
}

MapView.propTypes = {
  /**
   * 地图类型.
   * iOS： enum('standard', 'satellite', 'hybrid', 'satelliteFlyover', 'hybridFlyover', 'mutedStandard')
   *       iOS 9.0+ for ('satelliteFlyover', 'hybridFlyover', 'mutedStandard')
   */
  mapType: PropTypes.string,

  /**
   * 是否支持缩放
   */
  zoomEnabled: PropTypes.bool,

  /**
   * 是否支持滑动
   */
  scrollEnabled: PropTypes.bool,

  /**
   * 是否支持旋转
   */
  rotateEnabled: PropTypes.bool,

  /**
   * 是否支持捏合操作
   */
  pitchEnabled: PropTypes.bool,

  /**
   * 是否显示罗盘
   */
  showsCompass: PropTypes.bool,

  /**
   * 是否显示缩放比例尺
   */
  showsScale: PropTypes.bool,

  /**
   * 是否显示兴趣点
   */
  showsPointsOfInterest: PropTypes.bool,

  /**
   * 是否显示建筑
   */
  showsBuildings: PropTypes.bool,

  /**
   * 是否显示交通
   */
  showsTraffic: PropTypes.bool,

  /**
   * 是否显示用户位置
   */
  showsUserLocation: PropTypes.bool,

  /**
   * 用户跟随模式
   * emum('none', 'follow', 'follow-heading')
   */
  userTrackingMode: PropTypes.string,

  /**
   * 显示区域
   */
  region: PropTypes.shape({
    /**
     * 经纬度
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,

    /**
     * 经纬度最大最小显示的差值
     */
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired
  })
};

module.exports = MapView;
