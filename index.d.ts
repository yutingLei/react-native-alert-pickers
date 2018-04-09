declare module "react-native-alert-pickers" {
  interface ColorPickerTypes {
    /**
     * 使用16进制显示颜色(默认true)
     */
    useHex?: true | false;

    /**
     * 颜色选中触发函数
     */
    onSelected?: (title: string) => void;

    /**
     * 选中按钮标题(默认"Done")
     */
    selectTitle?: "Done";
  }

  interface ButtonOption {
    /**
     * 按钮标题
     */
    title: string;
    /**
     * 按钮标题颜色(e.g. ios: "rgb(0, 68, 240)", android: "rgb(80, 120, 80)")
     */
    color?: "rgb(0, 68, 240)";
  }

  interface SimpleAlertTypes {
    /**
     * 提示标题
     */
    title?: string;
    /**
     * 提示信息
     */
    message?: string;
    /**
     * 按钮
     */
    buttonsOption?: [ButtonOption];
    /**
     * 取消按钮在buttons中的下标
     */
    cancelIndex?: 0;
    /**
     * 提示模式("alert"|"actionSheet")
     */
    alertType?: "alert";
    /**
     * 点击按钮后触发
     */
    onSelected?: (title: string) => void;
  }

  interface PhoneCodePickerTypes {
    /**
     * 搜索框占位符
     */
    searchPlacehodler?: "搜索";

    /**
     * 搜索框取消按钮标题
     */
    searchCancelTitle?: "取消";

    /**
     * 取消按钮标题
     */
    cancelTitle?: "取消";

    /**
     * 选择出发函数
     */
    onSelected?: (name, code) => void;
  }

  export class ColorPicker extends React.Component<ColorPickerTypes> {}
  export class SimpleAlert extends React.PureComponent<
    SimpleAlertTypes,
    ButtonOption
  > {}
  export class PhoneCodePicker extends React.Component<PhoneCodePickerTypes> {}
}
