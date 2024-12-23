<template>
	<!-- 弹出层 -->
	<view class="uni-banner" style="background:#FFFFFF;"  v-if="loaded">
		<view :style="'height: ' + h + 'px; width:750uxp;padding:50rpx;'">
			<scroll-view scroll-y="true"  :style="'height: ' + h + 'px; '">
					<wxParse :content="protocol_text"  />
			</scroll-view>
		</view>
		<view style="height:50px;text-align: center;">
            <view class="button-sp-area">
                <button class="mini-btn" type="default" size="mini" @tap="disagree" v-if="!state && showBtnFlag">{{__('不同意')}}</button>

                <button class="mini-btn" type="warn" size="mini" @tap="agree">{{__('同意')}}</button>
            </view>
		</view>
	</view>
</template>

<script>

	import wxParse from '@/components/u-parse/u-parse.vue'
	export default {
		data() {
			return {
				protocols_key:'',
				protocol_text:'',
				loaded:false,
				h:0,
				showBtnFlag:true,
				state:false
			}
		},
		components: {
			wxParse
		},
		onLoad(options){
			uni.setNavigationBarTitle({
			    title:this.__('隐私政策')
			});
			
			var h = this.$.getSystemInfoSync().windowHeight;

			this.setData({
				h: h-50-50,
				protocols_key:options.id ? options.id : 'pr_protocols_description',
				showBtnFlag:options.no_btn ? false : true
			})
			

			//console.info(h)
			this.getProtocal();
		},
		methods: {
			getProtocal: function() {
				let that = this;
				let params = {protocols_key:this.protocols_key};


				that.$.request({
				    url: that.cf.URL.protocol,
				    data: params,
				    success: function (data, status, msg, code) {
						that.protocol_text = data.document;
						that.loaded = true;
						that.state = data.state;
				    }
				});
			},
			disagree: function() {
				let that = this;
				uni.showModal({
					title: '',
					content: that.__('十分抱歉，若您不同意此协议，我们将无法为您服务'),
					cancelText:that.__('返回'),
					confirmText:that.__('我再想想'),
					success: function (res) {
						if (res.confirm) {
						} else if (res.cancel) {
							uni.navigateBack({
								delta:1
							})
						}
					}
				});
			},

			agree: function() {
				let that = this;
				let params = {protocols_key:this.protocols_key, state:1};

				that.$.request({
				    url: that.cf.URL.protocol,
				    data: params,
				    success: function (data, status, msg, code) {
						that.$.alert('签订协议成功！')
						that.state = data.state;
						
						uni.navigateBack({
							delta:1
						})
				    }
				});
			}

		}
	}
</script>
<style lang="scss">

</style>
