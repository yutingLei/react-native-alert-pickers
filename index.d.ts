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

  interface TextFieldPickerTypes {
    /**
     * 标题
     */
    title?: string;

    /**
     * 信息
     */
    message?: string;

    /**
     * 输入框属性,所有的TextInput属性
     *
     * 注意：underlineColorAndroid,onFocus,onChangeText,onSubmitEditing不支持使用
     */
    textFieldsOption?: Array;

    /**
     * 提交按钮标题
     */
    submitTitle?: "确定";

    /**
     * 提交按钮点击触发函数
     */
    onSubmitEditing?: (values) => void;
  }

  interface ImagePickerTypes {
    /**
     * 水平展示，默认true
     */
    horizontal?: true;

    /**
     * 图片提供则,默认"self". 另外一个是"system"
     */
    provider?: "self";

    /**
     * 需要展示的图片,当provider="self"需要
     */
    images?: any;

    /**
     * 选择图片模式. enum('single', 'multiple'), 默认'single'
     */
    selectMode?: "single";

    /**
     * 选择按钮标题, 默认'确定'
     */
    selectTitle?: "确定";

    /**
     * 点击选择按钮触发
     */
    onSelected?: (indexs) => void;
  }

  export class ColorPicker extends React.Component<ColorPickerTypes> {}
  export class SimpleAlert extends React.PureComponent<
    SimpleAlertTypes,
    ButtonOption
  > {}
  export class PhoneCodePicker extends React.Component<PhoneCodePickerTypes> {}
  export class TextFieldPicker extends React.Component<TextFieldPickerTypes> {}
  export class ImagePicker extends React.Component<ImagePickerTypes> {}
}
