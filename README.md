## Install
```sh
$ npm install react-native-alert-pickers
$ react-native link react-native-alert-pickers
```

## Advanced Pickers

`注意：使用global关键词可以全局使用,最好在root component创建时创建以下选择器或提示框`

### 颜色选择器(ColorPicker)

**函数**

```js
    interface ColorPickerConfig {
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

    /**
     *
     * @param colorPickerConfig 颜色选择器配置
     */
    show(colorPickerConfig?: ColorPickerConfig);
```

**使用栗子**

```js
import { ColorPicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ColorPicker ref={r => (this.picker = r)} />
    <Text onPress={() => this.picker.show()}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/colorPicker1.png" width="400" />
<img src="asserts/colorPicker1.png" width="400" />
</div>

---

### (电话区号/联系人)选择器(PhoneCodePicker/ContactPicker)

`ContactPicker 当前仅支持iOS`
**iOS 使用 `ContactPicker` 需在info.plist中设置 `NSContactsUsageDescription`**

**函数**

```js
    interface CodePickerConfig {
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

    /**
     *
     * @param codePickerConfig 配置参数
     */
    show(codePickerConfig?: CodePickerConfig);
```

**使用栗子**

```js
import { PhoneCodePicker, ContactPicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <PhoneCodePicker ref={r => (this.picker1 = r)} />
    <ContactPicker ref={r => (this.picker2 = r)} />
    <Text onPress={() => this.picker1.show()}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/phoneCode1.png" width="400" />
<img src="asserts/phoneCode2.png" width="400" />
<img src="asserts/contactCode1.png" width="400" />
<img src="asserts/contactCode2.png" width="400" />
</div>

---

### 带输入框的提示(TextFieldPicker)

**函数**

```js
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
     * 注意：underlineColorAndroid,onFocus,onChangeText...等等配置TextInput的属性,onSubmitEditing不支持使用
     * 例如两个输入框:
     * [
     *  { key: 'firstKey', placeholder: 'The first param', returnKeyType: 'next'},
     *  { key: 'firstKey', placeholder: 'The second param'}
     * ]
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

    /**
     *
     * @param textFieldPickerConfig 选择器配置
     */
    show(textFieldPickerConfig?: TextFieldPickerConfig);
```

**使用栗子**

```js
import { TextFieldPicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <TextFieldPicker ref={r => (this.picker = r)} />
        <Text
          onPress={() =>
            this.picker.show({
              textFieldsOption: [
                { key: "first", placeholder: "The first param" },
                { key: "second", placeholder: "The second param" }
              ],
              onSubmitEditing: values => alert(JSON.stringify(values))
            })
          }
        >
          点我
        </Text>
</View>
```

<div align = "center">
<img src="asserts/textFieldPicker1.png" width="400" />
<img src="asserts/textFieldPicker2.png" width="400" />
</div>

---

### 图片选择器(ImagePicker)

`ImagePicker 当前仅支持iOS`
**iOS 使用 `ContactPicker` 需在info.plist设置 `NSPhotoLibraryUsageDescription`**
**[图片资源](https://github.com/dillidon/alerts-and-pickers/tree/new/Example/Resources/Assets.xcassets/interior%20designs)**

**函数**

```js
    interface ImagePickerConfig {
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
     * 例如:
     * [require('imgs/test.png'), { uri: 'imgs path'}]
     */
    selectTitle?: "确定";

    /**
     * 点击选择按钮触发
     */
    onSelected?: (indexs) => void;
  }

    /**
     *
     * @param imagePickerConfig 选择器配置
     */
    show(imagePickerConfig?: ImagePickerConfig);
```

**使用栗子**

```js
import { ImagePicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ImagePicker ref={r => (this.picker = r)} />
    <Text onPress={() => this.picker.show()}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/imagePicker1.png" width="400" />
<img src="asserts/imagePicker2.png" width="400" />
</div>

---

## Advanced Alert

### 提示框(SimpleAlert)

**函数**

```js
    /**
     *
     * @param alertType 提示类型('alert' 或 'action')
     * @param title 标题
     * @param message 信息
     * @param buttonsOption 按钮信息
     * @param cancelIndex 取消按钮在buttonsOption中的下标
     * @param onSelected 点击按钮回调函数
     */
    show(
      alertType: "alert",
      title: "提示",
      message?: string,
      buttonsOption?: [ButtonOption],
      cancelIndex?: 0,
      onSelected?: (title: string) => void
    );
```

**使用栗子**

```js
import { SimpleAlert } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <SimpleAlert ref={r => (global.alert = r)}/>
    <Text onPress={() => {
        global.alert.show('alert', '我是标题', '我是信息', [{ title: '确定'}, { title: '取消', color: 'red'}], 1, title => {})
        // this.alert.show('action', '我是标题', '我是信息', [{ title: '确定'}, { title: '取消'}], 1, title => {})
    }}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/simpleAlert1.png" width="400" />
<img src="asserts/simpleAlert2.png" width="400" />
</div>
