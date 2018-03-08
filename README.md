## Advanced Pickers

### Color Picker

```js
import ColorPicker from 'react-native-alert-pickers'

<ColorPicker visible={true|false} onPicked={color => alert(color)} >

```

|属性名|描述|类型|取值|
|:----|:-----|:-----:|:-----:|
|visible|是否显示选择器|bool|true or false|
|onPicket|选择颜色后回调函数|func|optional|
|useHex|是否以16进制显示颜色|bool|默认true|
