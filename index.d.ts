declare module "react-native-alert-pickers" {
  interface ColorPickerTypes {
    /**
     * 使用16进制显示颜色(默认true)
     */
    useHex?: true | false;

    /**
     * 是否显示颜色选择器(true | false)
     *
     * @requires
     */
    visible: true | false;

    /**
     * 颜色选中触发函数
     */
    onPicked?: (title: string) => void;

    /**
     * 选中按钮标题(默认"Done")
     */
    selectTitle?: "Done";
  }

  interface ButtonOptions {
    /**
     * 按钮标题
     */
    title: string;
    /**
     * 按钮类型("default"|"cancel"|"destructive")
     */
    style?: "default" | "cancel" | "destructive";
    /**
     * 按钮标题颜色(e.g. "deepskyblue")
     */
    color?: "deepskyblue";
  }

  interface SimpleAlertTypes {
    /**
     * 是否显示颜色选择器(true|false)
     */
    visible: true | false;

    /**
     * 提示标题
     */
    title?: string;
    /**
     * 提示信息
     */
    message?: string;
    /**
     * 提示按钮(alert is [{ title: "Done", style: "cancel"}] or
     *         actionSheet is [{ title: "Done", color: "deepskyblue"}]
     *        )
     */
    buttons?: [ButtonOptions];
    /**
     * 取消按钮在buttons中的下标(仅限actionSheet模式)
     */
    cancelIndex?: 0;
    /**
     * 提示模式("alert"|"actionSheet")
     */
    alertType?: "alert";
    /**
     * 点击按钮后触发
     */
    onTouched?: (title: string) => void;
  }

  export class ColorPicker extends React.Component<ColorPickerTypes> {}
  export class SimpleAlert extends React.PureComponent<SimpleAlertTypes> {}
}