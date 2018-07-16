declare module "react-native-alert-pickers" {
  /**
   * 取消标题配置
   */
  interface APIncludeCancel {
    /**
     * 取消按钮标题
     */
    cancelTitle?: "取消";
  }

  /**
   * 搜索配置
   */
  interface APIncludeSearch {
    /**
     * 搜索框占位符
     */
    searchPlacehodler?: "搜索";

    /**
     * 搜索框取消按钮标题
     */
    searchCancelTitle?: "取消";
  }

  /**
   * 选择按钮点击触发配置
   */
  interface APIncludeSelected {
    /**
     * 选择触发函数
     */
    onSelected?: (val) => void;
  }

  /**
   * 颜色选择器配置
   */
  interface APColorPickerConfig extends APIncludeCancel, APIncludeSelected {
    /**
     * enum: ('rgb', 'rgba', 'rgb-hex', 'rgba-hex', 'hsl', 'hsla')
     * mode             example
     * 'rgb'            'rgb(255, 255, 255)'
     * 'rgba'           'rgba(255, 255, 255, 1)'
     * 'rgb-hex'        '#FFFFFF'
     * 'rgba-hex'       '#FFFFFFFF'
     * 'hsl'            'hsl(360, 100%, 100%)'
     * 'hsla'           'hsla(360, 100%, 100%, 1.0)'
     */
    mode?: "rgb" | "rgba" | "rgb-hex" | "rgba-hex" | "hsl" | "hsla";

    /**
     * 选中按钮标题。默认：'选择'
     */
    selectTitle?: "选择";
  }

  /**
   * 联系人选择器配置
   */
  interface APContactPickerConfig
    extends APIncludeSearch,
      APIncludeCancel,
      APIncludeSelected {}

  /**
   * 地理位置选择器配置
   */
  interface APLocalePickerConfig
    extends APIncludeSearch,
      APIncludeCancel,
      APIncludeSelected {
    /**
     * 提示内容. 另外一个是'phoneCode'
     */
    mode?: "country" | "phoneCode";
  }

  /**
   * 图片选择器配置
   */
  interface APImagePickerConfig extends APIncludeCancel, APIncludeSelected {
    /**
     * 图片提供者, enum('system', 'self')
     */
    provider?: "system" | "self";
    /**
     * 图片展示方向
     */
    horizontal?: true;
    /**
     * 图片数组,在provider="self"时赋值
     */
    images?: [any];
    /**
     * 选择图片模式，enum('single', 'multiple')
     */
    selectMode?: "single" | "multiple";
    /**
     * 选择按钮标题
     */
    selectTitle?: "选择";
  }

  interface TextFieldPickerConfig {
    /**
     * 图标. 必须用 require('')赋值
     */
    icon?: image;

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

  interface SimpleAlertConfig {
    /**
     * 提示模式, default: `alert`, 其它`action`
     */
    mode?: "alert" | "action-sheet";

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

  interface APSearchPropTypes {
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
  export class APColorPicker extends React.Component<APColorPickerConfig> {
    /**
     *
     * @param colorPickerConfig 颜色选择器配置
     */
    show(colorPickerConfig?: APColorPickerConfig);
  }

  //Code Pickers
  class APLocalePicker extends React.Component<APLocalePickerConfig> {
    /**
     *
     * @param codePickerConfig 配置参数
     */
    show(codePickerConfig?: APLocalePickerConfig);
  }
  export class APContactPicker extends React.Component<APContactPickerConfig> {
    /**
     *
     * @param textFieldPickerConfig 选择器配置
     */
    show(textFieldPickerConfig?: APContactPickerConfig);
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
  export class APImagePicker extends React.Component<APImagePickerConfig> {
    /**
     *
     * @param imagePickerConfig 选择器配置
     */
    show(imagePickerConfig?: APImagePickerConfig);
  }

  // Search Bar
  export class APSearch extends React.Component<APSearchPropTypes> {}
}
