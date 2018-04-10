## Advanced Pickers

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

| 属性名        | 描述                       |   类型   |                   取值                   |
| :------------ | :------------------------- | :------: | :--------------------------------------: |
| title         | 标题                       |  string  |                 optional                 |
| message       | 信息                       |  string  | iOS 支持网址、邮箱、电话、时间等特殊字符 |
| buttonsOption | 按钮数组(包含取消按钮)     | [Object] |         默认`[{ title:'取消' }]`         |
| cancelIndex   | 取消按钮在按钮数组中的下标 |  number  |                  默认 0                  |
| alertType     | 提示类型                   |   enum   |  `"alert"` or `"action"`. 默认`"alert"`  |
| onSelected    | 点击按钮回调函数           |   func   |             `title => void`              |

```js
import { SimpleAlert } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <SimpleAlert
        ref={r => (this.alert = r)}
        title="我是标题"
        message="我是详情"
        alertType="action" //默认 "alert"
        buttonsOption={[
            { title: "按钮1", color: "deepskyblue" },
            { title: "按钮2", color: "red" },
            { title: "按钮3", color: "orange" }
            { title: "取消" }
        ]}
        cancelIndex={3}
        onSelected={title => alert(title)}
    />
    <Text onPress={() => this.alert.show()}>点我</Text>
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
