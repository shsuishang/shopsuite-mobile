<template>
	<view class="page">
		<view class="feedback-box">
			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-bd">
						<textarea class="u-textarea" maxlength="500" :placeholder="__('请填写账号注销申请理由，账号注销申请通过前，您仍能使用该账号登录。')" @input="inputRemark" style="height:300rpx;"></textarea>
						<view class="u-textarea-counter">
							<label>{{remarkLength}}</label>/500</view>
					</view>
				</view>
			</view>

			<view hidden="true" class="m-cells m-cells-form" style="margin-top:80rpx;">
				<view class="m-cell">
					<view class="m-cell-hd"><label class="u-label">{{__('微信号')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :placeholder="__('请输微信号(可选)')" @input="inputwechat"/>
					</view>
				</view>


				<view class="m-cell" style="border-top:1px solid #eee;">
					<view class="m-cell-hd"><label  class="u-label">{{__('邮箱')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="Email" :placeholder="__('请输入邮箱地址(可选)')" @input="inputemail" maxlength="30"/>
					</view>
				</view>

			</view>
			
			<view class="btn_box" bind="submitdata">
				<view style="font-size: 24upx;display: flex;align-items: center; justify-content: center;">
					<text @tap="isShowAgree" :class="showAgree ? 'cuIcon-radiobox' : 'cuIcon-round'"></text>
					<text @tap="isShowAgree" style="margin: 0 0 0 2px;">{{ __('我已阅读并知晓了') }}</text>
					<!-- 协议地址 -->
					<navigator url="/member/member/protocol?id=cancellation_agreement" open-type="navigate" style="color: #e8152d;">
						{{ __('《用户注销协议》')}}
					</navigator>
				</view>
				<button class="u-btn u-btn-default" @click="submitdata">{{__('提交申请')}}</button>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				remark: "", 
				showAgree: false, //协议是否选择
				remarkLength: 0, wechat_id: "", Email: "", platform: "", categoryId: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('账号注销')
			});

			let that = this;
			this.setData({
				Email: that.$.isNull(this.userInfo.user_email) ? "" : this.userInfo.user_email,
				categoryId: options.id ? options.id : 1

			});
			try {
				var e = that.$.getSystemInfoSync();
				this.setData({
					platform: e.platform
				});
			} catch (e) {
				//console.log(e)
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			inputwechat: function (e) {
				this.setData({
					wechat_id: e.detail.value
				});
			},
			inputemail: function (e) {
				this.setData({
					Email: e.detail.value
				});
			},
			inputRemark: function (e) {
				this.setData({
					remark: e.detail.value,
					remarkLength: e.detail.value.length
				});
			},
			isShowAgree() {
			  let that = this;
			
			  //是否选择协议
			  that.showAgree = !that.showAgree;
			},
			submitdata: function () {
				let that = this;
				if (that.$.isNull(this.remark))
				{
					that.$.alert(that.__("请输入您宝贵的意见"));
					return;
				}
				
				if (!this.showAgree) {
				  that.$.confirm(that.__('请先阅读并同意《用户注销协议》'));
				
				  uni.showToast({
				    icon: 'none',
				    title: that.__('请先阅读并同意《用户注销协议》')
				  });
				
				  return;
				}
				
				var params = {
					MiniAppVersion: "",
					Wechat: this.wechat_id,
					feedback_question: this.remark,
					Platform: this.platform,
					Email: this.Email,
					feedback_category_id:that.categoryId
				};
				that.$.request({
					url: this.Config.URL.user.feedback_add,
					data: params,
					method:"POST", 
					success: function (data, status, msg, code) {
						if (200 == status) {
							that.$.alert(that.__("提交成功！"))
							setTimeout(function () {
								that.$.navigateBack(1, function () {
								})
							}, 1e3)
						} else {
							that.$.alert(msg)
						}
					}
				});
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.feedback-box{padding: 30rpx;}
	.m-cells::before{border: none;}
	.m-cells::after{border: none;}
	.m-cell::before{border: none;}
	.btn_box{margin-top: 50rpx;}
</style>
