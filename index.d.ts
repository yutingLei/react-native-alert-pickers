import React from "react";
import { ViewProperties } from "react-native";

export interface ColorPickerTypes extends ViewProperties {
  /**
   * 使用16进制显示颜色
   *
   * @type {boolean}
   * @memberOf ColorPickerTypes
   * @default true
   */
  useHex?: boolean;

  /**
   * 是否显示颜色选择器
   *
   * @type {boolean}
   * @memberOf ColorPickerTypes
   */
  visible: boolean;

  /**
   * 颜色选中触发函数
   *
   * @type {func}
   * @memberOf ColorPickerTypes
   * @default undefined
   */
  onPicked?: (title: string) => void;

  /**
   * 选中按钮标题
   *
   * @type {string}
   * @memberOf ColorPickerTypes
   * @default Done
   */
  selectTitle?: string;
}

export interface SimpleAlertTypes extends ViewProperties {
  /**
   * 是否显示颜色选择器
   *
   * @type {boolean}
   * @memberOf SimpleAlertTypes
   */
  visible: boolean;

  /**
   * 提示标题
   *
   * @type {string}
   * @memberOf SimpleAlertTypes
   * @default null
   */
  title?: string;
  /**
   * 提示信息
   *
   * @type {string}
   * @memberOf SimpleAlertTypes
   * @default null
   */
  message?: string;
  /**
   * 提示按钮
   *
   * @type {arrayOf(Object)}
   * @memberOf SimpleAlertTypes
   * @default alert: [{ title: "Done", style: "cancel" }]
   *          actionSheet: [{ title: "Done", color: "deepskyblue" }]
   */
  buttons?: [object];
  /**
   * 取消按钮在buttons中的下标(仅限actionSheet模式)
   *
   * @type {number}
   * @memberOf SimpleAlertTypes
   * @default 0
   */
  cancelIndex?: number;
  /**
   * 提示模式
   *
   * @type {string}
   * @memberOf SimpleAlertTypes
   * @default alert
   */
  alertType?: string;
  /**
   * 是否显示颜色选择器
   *
   * @type {func}
   * @memberOf SimpleAlertTypes
   * @default null
   */
  onTouched?: (title: string) => void;
}

export class ColorPicker extends React.Component<ColorPickerTypes> {}
export class SimpleAlert extends React.PureComponent<SimpleAlertTypes> {}
