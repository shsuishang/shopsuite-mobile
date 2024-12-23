# 附件上传组件 jin-attachment
> 该组件依赖less, 如果项目没有安装less,请先安装

### 组件功能说明
1. 可选择多张图片
2. 选择图片后自动添加到后面
3. 图片上自带删除图标，点击可删除
4. 图片可点击预览
5. 可获取当前的图片地址数组
6. 可上传图片到服务器
7. 可设置上传的图片数量
8. APP端可以上传文件
9. 可配置是否显示上传进度条
10. 微信端可以选择文件，利用接口wx.chooseMessageFile

`已测试安卓端、微信小程序端、H5端`

### 使用说明
拷贝该组件到`components`目录下之后  
在 `script` 中引用组件

``` javascript 
import Attachment from '../../components/jin-attachment/jin-attachment.vue';
export default {
    components: {Attachment}
}
```

在 template 中使用组件：  

``` javascript
<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :heaer="header" :showProcess="true" :attachmentList.sync="attachmentList"></Attachment>
```

### 重要说明
APP端可以上传文件，但是需要引入uni-app插件市场的`chuck-filemanager`插件，可以选择试用，然后在mainfest.json中勾选该插件，既可在自定义基座中运行


 chuck-filemanager插件地址 https://ext.dcloud.net.cn/plugin?id=680

### 组件参数说明

属性名  | 类型| 默认值  | 说明|
--------- | --------|--------- | --------|
attachmentList | `Array<Object>` | []  | 初始化的图片数据，可用于单向数据初始化，需要双向绑定可直接用 :attachmentList.sync="attachmentList" |
mode  |  `String` | null | 组件模式，create => 可新增或编辑附件 不填或其他 => 只能查看附件 |
uploadFileUrl  | `String` | null | 上传文件的服务器url |
showProcess  | `Boolean` | true | 是否显示进度，默认显示 |
header  | `Object` | null | 上传图片到服务器时，HTTP 请求 Header |
limit  | `Number` | null | 限制可上传的图片数量,图片最大上传数量 |
fileKeyName  | `String` | 'file' | 用于在服务端通过自定义key值获取该文件数据|
canUploadFile | `Boolean` | false | 是否能上传文件，只有微信端和安卓版设置为true时有效

### `attachmentList`参数的 `Object`说明
属性名  | 类型| 默认值  | 说明|
--------- | --------|--------- | --------|
type | `String` | 'image'  | 文件类型 image => 图片，file => 文件
url | `String` | null  | 文件或者图片的url地址
fileName | `String` | null  | 文件名
process | `Number` | null  | 文件或图片的上传进度

### 自定义事件说明
事件名称  | 说明| 返回参数 |
--------- | --------|--------- |
uploadSuccess | 图片上传成功回调函数，每选择一个或者多个附件后会立即上传至后端服务器| 返回的参数与 uni.uploadFile接口参数一致 |


### demo示例

``` javascript
<template>
	<view style="padding: 30rpx;">
		<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :heaer="header" :showProcess="true" :attachmentList.sync="attachmentList" @uploadSuccess="uploadSuccess"></Attachment>
	</view>
</template>

<script>
import Attachment from '../../components/jin-attachment/jin-attachment.vue';
export default {
	data() {
		return {
			uploadFileUrl: 'http://localhost:8080', //替换成你的后端接收文件地址
			header: {
				// 如果需要header，请上传
			},
			attachmentList: [
				{
					url: 'https://avatar-static.segmentfault.com/151/147/1511478734-593e62d4d3076_big64',
					type: 'image',
					fileName: 'xxx.png'
				},
				{
					url: 'https://avatar-static.segmentfault.com/820/689/820689728-59e9b54a71fdc_huge256',
					type: 'image',
					fileName: 'xxx.png'
				},
				{
					url: 'https://avatar-static.segmentfault.com/820/689/820689728-59e9b54a71fdc_huge256',
					type: 'image',
					fileName: 'xxx.png'
				},
				{
					url: 'https://avatar-static.segmentfault.com/820/689/820689728-59e9b54a71fdc_huge256',
					type: 'image',
					fileName: 'xxx.png'
				},
				{
					url: 'https://avatar-static.segmentfault.com/820/689/820689728-59e9b54a71fdc_huge256',
					type: 'image',
					fileName: 'xxx.png'
				},
				{
					type: 'file',
					fileName: '这个组件真棒.doc',
					url: 'https://avatar-static.segmentfault.com/820/689/820689728-59e9b54a71fdc_huge256'
				}
			]
		}
	},
	components: {
		Attachment
	},
	methods:{
		uploadSuccess(result) {
			if(result.statusCode == 200) {
				//上传成功的回调处理
				uni.showToast({
					title: '上传成功',
					icon: 'none'
				});
			}else{
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
			}
		}
	}
	
}
</script>

<style>
</style>

```
<br>
> 如遇问题，欢迎评论指出，作者微信 wangjinxin613，添加好友时请备注 jin-attachment 