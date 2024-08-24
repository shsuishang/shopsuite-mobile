### liu-customize-sel适用于uni-app项目的省市区三级选择组件
### 本组件目前兼容微信小程序、H5
### 本组件地址选择器，常用于省市县、小区选择，自带动画效果，脱离uni-popup，可在任何地方直接应用，自带省市区
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式	
``` html
<button @click="openAddress">打开地址选择器</button>
<liu-customize-sel ref="scroll" @change='chooseSuccess'></liu-customize-sel>
```
``` javascript
export default {
	data() {
		return {
			
		};
	},
	methods: {
		//打开地址选择器
		openAddress() {
			this.$refs.scroll.open()
		},
		//地址选择成功
		chooseSuccess(e) {
			console.log('所选择的地址信息:', e)
		}
	}
}
```

### 属性说明
| 名称                         | 类型            | 默认值                | 描述             |
| ----------------------------|--------------- | ---------------------- | ---------------|
| animation                   | Boolean        | true          | 是否开启动画
| safeArea                    | Boolean        | true          | 是否开启安全条
| isMask                      | Boolean        | true          | 是否点击阴影关闭
| @change                     | Function       |               | 选择成功回调事件



