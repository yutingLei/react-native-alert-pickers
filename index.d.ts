declare module "react-native-alert-pickers" {
  interface APBorderStyle {
    /**
     * 边框宽度
     */
    borderWidth?: 1;

    /**
     * 边框颜色
     */
    borderColor?: "black";

    /**
     * 边框弧度
     */
    borderRadius: 0;
  }

  /**
   * 字体设置
   */
  interface APFont {
    /**
     * 颜色
     */
    color?: "black";

    /**
     * 字体大小
     */
    fontSize?: 17;

    /**
     * 字体粗细
     */
    fontWeight?: 300 | "bold";

    /**
     * 字体位置
     */
    textAlign?: "center" | "left" | "right";
  }

  interface APImage {
    /**
     * 图片资源
     */
    source?: any;

    /**
     * 图片风格
     */
    style?: any;
  }

  /**
   * 提示按钮配置
   */
  interface APButton {
    /**
     * 字体设置
     * 默认为： { color: "black", fontSize: 17, textAlign: "center" }
     */
    font?: APFont;

    /**
     * 标题
     */
    title?: "";

    /**
     * 风格设置
     * 默认为：{height: 50, borderRadius: ios ? 10 : 0, justifyContent: "center", backgroundColor: "white"}
     */
    style?: object;

    /**
     * 是否可点击
     */
    enable?: true;

    /**
     * 失能时的字体颜色
     */
    disabledColor?: "0xefefef";

    /**
     * 点击响透明度
     */
    activeOpacity?: 0.8;

    /**
     * 点击触发
     */
    onPress?: (title) => {};

    /**
     * 左视图
     * 格式：{ style?: object; source?: object }
     */
    leftImage?: APImage;

    /**
     * 右视图
     * 格式：{ style?: object; source?: object }
     */
    rightImage?: APImage;
  }

  /**
   * 输入框配置
   */
  interface APTextField {
    /**
     * 键
     */
    key?: "";

    /**
     * 字体
     */
    font?: APFont;

    /**
     * 其它属性配置
     * for example: placeholder/selectionColor...
     */
    config?: APTextFieldExtension;

    /**
     * 输入字符串正则表达式
     */
    regular?: "";

    /**
     * 左视图
     */
    leftImage?: APImage;

    /**
     * 右视图
     */
    rightImage?: APImage;

    /**
     * 边框设置
     */
    borderStyle: APBorderStyle;
  }

  interface APSearchBar {
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
    textField?: APTextField;

    /**
     * 输入字符串改变回调
     */
    onChangeText?: (text) => void;

    /**
     * 提交字符串回调
     */
    onSubmitEditing?: (text) => void;

    /**
     * 取消按钮
     */
    cancelTitle?: "取消";
  }

  /**
   * 输入框配置
   */
  interface APTextFieldExtension {
    allowFontScaling?: false | true;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: false | true;
    autoFocus?: false | true;
    caretHidden?: false | true;
    /**
     * iOS only
     */
    clearButtonMode?: "never" | "while-editing" | "unless-editing" | "always";
    defaultValue?: "";
    keyboardType?:
      | "default"
      | "number-pad"
      | "decimal-pad"
      | "numeric"
      | "email-address"
      | "phone-pad";
    placeholder?: "";
    placeholderTextColor?: "gray";
    returnKeyType?: "done";
    secureTextEntry?: false | true;
    selectionColor?: "deepskyblue";
    defaultValue?: string;
    value?: string;
  }

  /**
   * 颜色选择器配置
   */
  interface APColorPickerConfig {
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
     * 取消按钮设置
     */
    cancelButton?: APButton;

    /**
     * 选择按钮设置
     */
    selectButton?: APButton;
  }

  /**
   * 联系人选择器配置
   */
  interface APContactPickerConfig {
    /**
     * 取消按钮
     */
    cancelButton?: APButton;

    /**
     * 搜索框
     */
    searchBar?: APSearchBar;

    /**
     * 选择回调
     */
    onSelected?: ({ name: string, phoneNumber: string }) => void;
  }

  /**
   * 地理位置选择器配置
   */
  interface APLocalePickerConfig {
    /**
     * 提示内容. 另外一个是'phoneCode'
     */
    mode?: "country" | "phoneCode";

    /**
     * 取消按钮
     */
    cancelButton?: APButton;

    /**
     * 选择按钮
     */
    onSelected?: ({ code: string, name: string, dial_code: string }) => void;

    /**
     * 搜索框
     */
    searchBar?: APSearchBar;
  }

  /**
   * 图片选择器配置
   */
  interface APImagePickerConfig {
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
     * 选择按钮
     */
    selectTitle?: "选择";

    /**
     * 取下按钮
     */
    cancelTitle?: "取消";

    /**
     * 选择图片触发
     */
    onSelected: (val) => void;
  }

  interface APAlertConfig {
    /**
     * 提示方式
     */
    mode?: "alert" | "action-sheet";

    /**
     * 标题
     */
    title?: "";

    /**
     * 信息
     */
    message?: "";

    /**
     * 按钮
     */
    alertButtons?: [APButton];

    /**
     * 取消按钮所在下标
     */
    cancelIndex?: 0;
  }

  interface APTextFieldAlertConfig {
    /**
     * 标志图片
     */
    icon?: APImage;

    /**
     * 标题
     */
    title?: "";

    /**
     * 信息
     */
    message?: "";

    /**
     * 输入框数组
     */
    textFields?: [APTextField];

    /**
     * 按钮数组
     */
    alertButtons?: [APButton];
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

  // Image Picker
  export class APImagePicker extends React.Component<APImagePickerConfig> {
    /**
     *
     * @param imagePickerConfig 选择器配置
     */
    show(imagePickerConfig?: APImagePickerConfig);
  }

  // Simple Alert
  export class APAlert extends React.PureComponent<APAlertConfig> {
    /**
     *
     * @param simpleAlertConfig 提示配置
     */
    show(simpleAlertConfig?: APAlertConfig);

    /**
     * "alert"
     */
    alert(alertConfig?: APAlertConfig);

    /**
     * "action-sheet"
     */
    actionSheet(actionSheetConfig?: APAlertConfig);
  }

  // TextFields Alert
  export class APTextFieldAlert extends React.PureComponent<
    APTextFieldAlertConfig
  > {
    /**
     *
     * @param textFieldAlertConfig 配置
     */
    show(textFieldAlertConfig?: APTextFieldAlertConfig);
  }

  // Search Bar
  export class APSearch extends React.Component<APSearchBar> {}
}
