## Advanced Pickers

```sh
$ npm install react-native-alert-pickers
```

### 颜色选择器(ColorPicker)

```js
import { ColorPicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ColorPicker
    	ref={r => (this.alert = r)}
    	onSelected={color => alert(color)}
    />
    <Text onPress={() => this.alert.show()}>点我</Text>
</View>
```

| 属性名      | 描述                   |  类型  |    取值    |
| :---------- | :--------------------- | :----: | :--------: |
| onSelected  | 选择颜色后回调函数     |  func  |  optional  |
| useHex      | 是否以 16 进制显示颜色 |  bool  | 默认 true  |
| selectTitle | 确定颜色按钮           | string | 默认'Done' |

<div align = "center">
<img src="asserts/colorPicker1.png" width="400" />
<img src="asserts/colorPicker1.png" width="400" />
</div>

---

### 电话前缀选择器(PhoneCodePicker)

```js
import { PhoneCodePicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <PhoneCodePicker
        ref={r => (this.picker = r)}
        onSelected={(name, code) => alert(`${name} with ${code}`)}
    />
    <Text onPress={() => this.picker.show()}>点我</Text>
</View>
```

| 属性名            | 描述           |  类型  |         取值         |
| :---------------- | :------------- | :----: | :------------------: |
| onSelected        | 选择函数触发   |  func  | (name, code) => void |
| searchPlaceholder | 搜索框占位符   | string |        '搜索'        |
| searchCancelTitle | 搜索框取消按钮 | string |        '取消'        |
| cancelTitle       | 取消按钮标题   | string |        '取消'        |

<div align = "center">
<img src="asserts/phoneCode1.png" width="400" />
<img src="asserts/phoneCode2.png" width="400" />
</div>

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

`注意：使用global关键词可以使SimpleAlert全局使用,最好在root component创建<SimpleAlert ref={r => (global.alert = r)}/>`

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

### 带输入框的提示(TextFieldPicker)

| 属性名           | 描述                           |   类型   |          取值          |
| :--------------- | :----------------------------- | :------: | :--------------------: |
| title            | 标题                           |  string  |        optional        |
| message          | 信息                           |  string  |        optional        |
| textFieldsOption | 输入框属性设置等               | [Object] | [{ key: 'firstKey' }], |
| submitTitle      | 提交按钮标题                   |  string  |       默认`取消`       |
| onSubmitEditing  | 点击按钮回调函数               |   func   |    `values => void`    |

说明: `textFieldsOption`支持 TextInput 中的绝大多数属性设置这里的`textFieldsOption`中的`key`和提交函数触发返回的`values`有联系（而且必传），返回的`values`则是`{ firstKey: 第一个输入框输入的值}`
例如传入的`textFieldsOption`为`[{ key: 'firstKey'}, { key: 'secondKey}]`，第一个输入框中的内容为`123`,第二个输入框中的内容为`456`，那么返回的值就是`{ firstKey: '123', secondKey: '456' }`

```js
import { TextFieldPicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <TextFieldPicker
          ref={r => (this.picker = r)}
          title="我是标题"
          message="我是信息我是信息我是信息我是信息我是信息我是信息我是信息"
          textFieldsOption={[
            {
              key: "username",
              placeholder: "用户名",
              leftImage: require("./search.png")
            },
            {
              key: "password",
              placeholder: "密码"
            },
            {
              key: "confirm",
              placeholder: "确认密码",
              leftImage: require("./search.png")
            }
          ]}
          onSubmitEditing={values => alert(JSON.stringify(values))}
        />
    <Text onPress={() => this.picker.show()}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/textFieldPicker1.png" width="400" />
<img src="asserts/textFieldPicker2.png" width="400" />
</div>

### 图片选择器(ImagePicker)

```sh
$ react-native link react-native-alert-pickers
```

| 属性名        | 描述                           |  类型  |               取值                |
| :------------ | :----------------------------- | :----: | :-------------------------------: |
| horizontal    | 图片展示方向                   |  bool  |            默认 `true`            |
| images        | 需要展示的图片                 | array  |         `provider="self"`         |
| provider      | 图片提供者                     | string |         `self`, `system`          |
| selectMode    | 选择图片模式                   | string | `single` `multiple`, 默认`single` |
| selectTitle   | 选择按钮标题                   | string |            默认`确定`             |
| onSelected    | 点击选择按钮回调函数           |  func  |         `values => void`          |

```
 注意：当前仅支持iOS
```

**[图片资源](https://github.com/dillidon/alerts-and-pickers/tree/new/Example/Resources/Assets.xcassets/interior%20designs)**

```js
import { ImagePicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ImagePicker
        ref={r => (this.picker = r)}
        horizontal={false}
        provider="self"
        selectMode="multiple"
        images={[
            require("./first.jpg"), // or { uri: ... }
            require("./second.jpg"),
            require("./third.jpg"),
            require("./forth.jpg")
        ]}
        onSelected={values => alert(values)}
    />
    <Text onPress={() => this.picker.show()}>点我</Text>
</View>
```

<div align = "center">
<img src="asserts/imagePicker1.png" width="400" />
<img src="asserts/imagePicker2.png" width="400" />
</div>
