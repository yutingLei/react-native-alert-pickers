## Advanced Pickers

### Color Picker

```js
import { ColorPicker } from 'react-native-alert-pickers'

<ColorPicker
	visible={true|false}
	selectTitle="确定"
	useHex
	onPicked={color => alert(color)}
/>
```

| 属性名      | 描述                   |  类型  |     取值      |
| :---------- | :--------------------- | :----: | :-----------: |
| visible     | 是否显示选择器         |  bool  | true or false |
| onPicket    | 选择颜色后回调函数     |  func  |   optional    |
| useHex      | 是否以 16 进制显示颜色 |  bool  |   默认 true   |
| selectTitle | 确定颜色按钮           | string |  默认'Done'   |

---

### Phone Code Picker

```js
import { PhoneCodePicker } from 'react-native-alert-pickers'

<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <PhoneCodePicker
        ref={r => (this.picker = r)}
        onSelected={(name, code) => alert(`${name} with ${code}`)}
    />
    <Text onPress={() => this.picker._show()}>点我</Text>
</View>
```

| 属性名     | 描述         |  类型  |         取值         |
| :--------- | :----------- | :----: | :------------------: |
| onSelected | 选择函数触发 |  func  | (name, code) => void |
| onCancel   | 取消函数触发 | string |      () => void      |

<div align = "center">
<img src="asserts/phoneCode1.png" width="400" />
<img src="Assets/phoneCode2.png" width="400" />
</div>

### Simple Alert

**Action Sheet**

| 属性名      | 描述                       |   类型   |                     取值                     |
| :---------- | :------------------------- | :------: | :------------------------------------------: |
| visible     | 是否显示选择器             |   bool   |                true or false                 |
| title       | 标题                       |  string  |                   optional                   |
| message     | 信息                       |  string  |                   optional                   |
| buttons     | 按钮数组(包含取消按钮)     | [Object] | 默认[{ title:'Done', color: 'deepskyblue' }] |
| cancelIndex | 取消按钮在按钮数组中的下标 |  number  |                    默认 0                    |
| alertType   | 提示类型                   |  number  |          两种值: 'alert' or 'actionSheet'    |
| onTouched   | 点击按钮回调函数           |   func   |        函数有一个参数，点击按钮的标题        |

```js
import { SimpleAlert } from 'react-native-alert-pickers'

<SimpleAlert
	visible={true|false}
	title="标题"
	message="信息"
	buttons={[
		{ title: "Test", color: "blue" },
		{ title: "Test2", color: "red" },
		{ title: "Cancel", color: "green" }
	]}
	cancelIndex={2}
	alertType="actionSheet"
	onTouched={title => alert(title)}
/>
```

**Alert**

| 属性名    | 描述                   |   类型   |                  取值                   |
| :-------- | :--------------------- | :------: | :-------------------------------------: |
| visible   | 是否显示选择器         |   bool   |              true or false              |
| title     | 标题                   |  string  |                optional                 |
| message   | 信息                   |  string  |                optional                 |
| buttons   | 按钮数组(包含取消按钮) | [Object] | 默认[{ title:'Done', style: 'cancel' }] |
| onTouched | 点击按钮回调函数       |   func   |     函数有一个参数，点击按钮的标题      |

```js
import { SimpleAlert } from 'react-native-alert-pickers'

<SimpleAlert
	visible={true|false}
	title="标题"
	message="信息"
	buttons={[
		{ title: "Test", style: 'default' },
		{ title: "Test2", style: 'destructive' },
		{ title: "Cancel", style: 'cancel' }
	]}
	onTouched={title => alert(title)}
/>
```
