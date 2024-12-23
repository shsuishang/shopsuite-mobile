<template>
	<view class="tagController">
		<view class="tagContainer">
			<view class="tagItem" :class="tagBgColor" v-bind:key="index" v-for="(tagText,index) in value">
				<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				<text v-if="isShowDelIcon" class="tagDelIcon" @tap="delTag" :data-text="tagText">x</text>
			</view>
		</view>
		<view class="tagInput" v-if="isShowAdd">
			<input type="text" v-model="tagString" placeholder-class="placeholder-class" placeholder="输入新的标签" />
			<button type="default" size="mini" @tap="createTags">添加</button>
		</view>
	</view>
</template>

<script>
	export default {
		name:'robby-tags',
		props: ['enableDel','bgColorType','value', 'enableAdd'],
		data() {
			return {
				tagString:'',
				isShowDelIcon: this.enableDel || false,
				isShowAdd: this.enableAdd || false
			}
		},
		computed:{
			tagBgColor: function(){
				if(this.bgColorType === null){
					return 'tagBgDefault'
				}else if(this.bgColorType === 'primary'){
					return 'tagBgPrimary'
				}else if(this.bgColorType === 'success'){
					return 'tagBgSuccess'
				}else if(this.bgColorType === 'warn'){
					return 'tagBgWarning'
				}else if(this.bgColorType === 'error'){
					return 'tagBgError'
				}else{
					return 'tagBgDefault'
				}
			}
		},
		methods: {
			createTags: function(){
				let tempTagArr = []
				if(this.tagString.length>0){
					let newvalue = this.tagString.split(/,|，/)
					for(let i=0;i<newvalue.length;i++){
						let newTag = newvalue[i].trim()
						
						if(newTag !== '' && this.value.indexOf(newTag) < 0){
							tempTagArr.push(newTag)
						}
					}
				}
				this.tagString = ''
				this.value.splice(this.value.length,0, ...tempTagArr)
				this.$emit('add', {
					currentTag: tempTagArr,
					allTags: this.value
				})
				this.$emit('input', this.value)
			}, 
			delTag: function(e){
				let delTagText = e.currentTarget.dataset.text
				let delTagIndex = this.value.indexOf(delTagText)
				this.value.splice(delTagIndex,1)
				this.$emit("delete", {
					currentTag: delTagText,
					allTags: this.value
				})
				this.$emit('input', this.value)
			},
			tapTag: function(e){
				let selTagText = e.currentTarget.dataset.text
				this.$emit("click", selTagText)
			}
		}
	}
</script>

<style lang="scss">
	
	.placeholder-class{
		font-size: 24rpx;
	}
	.tagController{
		padding: 10rpx;
	}
	.tagContainer{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	.tagItem{
		padding: 10rpx 20rpx;
		margin: 10rpx;
		border-radius: 40rpx;
		color: white;
	}
	.tagBgDefault{
		background-color: #cfcfcf;
		color: black;
	}
	.tagBgPrimary{
		background-color: #007aff;
	}
	.tagBgSuccess{
		background-color: #4cd964;
	}
	.tagBgWarning{
		background-color: #f0ad4e;
	}
	.tagBgError{
		background-color: #dd524d;
	}
	.tagDelIcon{
		padding-left: 20rpx;
	}
	.tagInput{
		padding: 10rpx;
	}
	.tagInput input{
		width: 60%;
		display: inline-block;
	}
</style>