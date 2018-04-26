declare module "react-native-alert-pickers" {
  interface ColorPickerConfig {
    /**
     * 使用16进制显示颜色。默认：true
     */
    useHex?: true;

    /**
     * 颜色选中触发函数
     */
    onSelected?: (title: string) => void;

    /**
     * 选中按钮标题。默认：'选择'
     */
    selectTitle?: "选择";

    /**
     * 取消按钮。默认：'取消'
     */
    cancelTitle?: "取消";
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

  interface LocalePickerConfig extends ContactPickerConfig {
    /**
     * 提示内容. 另外一个是'phoneCode'
     */
    mode?: "country";
  }

  interface ContactPickerConfig {
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

  interface TextFieldPickerConfig {
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
     * 注意：underlineColorAndroid,onFocus,onChangeText,onSubmitEditing等等配置TextInput的属性请不要使用
     */
    textFieldsOption?: [TextInputProperties];

    /**
     * 提交按钮标题
     */
    submitTitle?: "确定";

    /**
     * 提交按钮点击触发函数
     */
    onSubmitEditing?: (values) => void;
  }

  interface ImagePickerConfig {
    /**
     * 水平展示，默认true
     */
    horizontal?: true;

    /**
     * 图片提供则,默认"system". 另外一个是"self"
     */
    provider?: "system";

    /**
     * 需要展示的图片,当provider="self"需要
     */
    images?: any;

    /**
     * 选择图片模式. enum('single', 'multiple'), 默认'single'
     */
    selectMode?: "single";

    /**
     * 选择按钮标题, 默认'选择'
     */
    selectTitle?: "选择";

    /**
     * 取消按钮标题, 默认'取消'
     */
    cancelTitle?: "取消";

    /**
     * 点击选择按钮触发
     */
    onSelected?: (indexs) => void;
  }

  interface SimpleAlertConfig {
    /**
     * 提示模式, default: `alert`, 其它`action`
     */
    mode?: "alert";

    /**
     * 提示标题.
     */
    title?: string;

    /**
     * 提示信息
     */
    message?: string;

    /**
     * 按钮. eg: [{ title: '按钮一', color: 'green'}, { title: '按钮二', color: 'orange'}]
     * 默认: [{ title: '取消' }]
     */
    buttonsOption?: [ButtonOption];

    /**
     * 取消按钮在数组中的下标。默认0
     */
    cancelIndex?: 0;

    /**
     * 点击按钮触发
     */
    onSelected?: (title: string) => void;
  }

  interface SearchBarPropTypes {
    /**
     * 搜索框宽度
     */
    barWidth: "100%";

    /**
     * 搜索框背景色
     */
    tintColor?: "rgb(220, 220, 220)";

    /**
     * 搜索框容器背景色
     */
    backgroundColor?: "white";

    /**
     * 输入框属性
     * 例如：{ placeholder: '在此输入搜索内容', selectionColor: 'blue'}
     */
    textInputProps?: TextInputProperties;

    /**
     * 输入字符串改变回调
     */
    onChangeText?: (text) => void;

    /**
     * 提交字符串回调
     */
    onSubmitEditing?: (text) => void;

    /**
     * 取消按钮标题
     */
    cancelTitle?: "取消";

    /**
     * 取消按钮颜色
     */
    cancelTitleColor?: "black";

    /**
     * 取消按钮点击回调
     */
    onCancel?: () => void;
  }

  // Simple Alert
  export class SimpleAlert extends React.PureComponent<
    SimpleAlertConfig,
    ButtonOption
  > {
    /**
     *
     * @param simpleAlertConfig 提示配置
     */
    show(simpleAlertConfig?: SimpleAlertConfig);
  }

  // Color Picker
  export class ColorPicker extends React.Component<ColorPickerConfig> {
    /**
     *
     * @param colorPickerConfig 颜色选择器配置
     */
    show(colorPickerConfig?: ColorPickerConfig);
  }

  //Code Pickers
  class LocalePicker extends React.Component<LocalePickerConfig> {
    /**
     *
     * @param codePickerConfig 配置参数
     */
    show(codePickerConfig?: LocalePickerConfig);
  }
  export class ContactPicker extends React.Component<ContactPickerConfig> {
    /**
     *
     * @param textFieldPickerConfig 选择器配置
     */
    show(textFieldPickerConfig?: TextFieldPickerConfig);
  }

  // TextField Picker
  export class TextFieldPicker extends React.Component<TextFieldPickerConfig> {
    /**
     *
     * @param textFieldPickerConfig 选择器配置
     */
    show(textFieldPickerConfig?: TextFieldPickerConfig);
  }

  // Image Picker
  export class ImagePicker extends React.Component<ImagePickerConfig> {
    /**
     *
     * @param imagePickerConfig 选择器配置
     */
    show(imagePickerConfig?: ImagePickerConfig);
  }

  // Search Bar
  export class SearchBar extends React.Component<SearchBarPropTypes> {}
}
