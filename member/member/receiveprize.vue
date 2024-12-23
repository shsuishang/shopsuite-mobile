<template>
	<view>
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('姓名')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :placeholder="__('请输入姓名')" v-model="UserName" @input="inputname"  />
				</view>
				<view v-if="!isName" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('电话')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="number" :placeholder="__('请输入手机号')" v-model="UserPhone" @input="inputphone"  maxlength="11" />
				</view>
				<view v-if="!isPhone" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('地址')}}：</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :placeholder="__('请输入地址')" @input="inputaddress" v-model="UserAddress" />
				</view>
				<view v-if="!isAddress " class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
		</view>
		<view class="m-tip">{{__('注：为了方便兑奖，请认真填写兑奖信息。若因未填写资料或资料填写错误导致兑奖失败,主办方不承担任何责任')}}</view>
		<view class="btn_box">
			<button class="u-btn u-btn-default" @tap="submit">{{__('提交信息')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				UserName: "",
				UserPhone: "",
				UserAddress: "",
				isPhone: true,
				isName: true,
				isAddress: true,
				LuckyDrawId: "",
				LuckyDrawPrizeId: "",
				LuckyDrawUniqueId: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			this.setData({
				LuckyDrawId: options.activity_id,
				LuckyDrawPrizeId: options.id,
				LuckyDrawUniqueId: options.alh_item_id
			});
			this.RecipientInfo();
		},

		onShow: function(opt) {
			let that = this;

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),


			RecipientInfo: function() {
				var params = {
						activity_id: this.LuckyDrawId,
						alh_id: this.LuckyDrawPrizeId,
						alh_item_id: this.LuckyDrawUniqueId
					},
					that = this;
				that.$.request({
					url: that.Config.URL.user.getLotteryHistory,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								UserName: data.user_name,
								UserPhone: data.user_phone,
								UserAddress: data.user_address
							})
						} else {
							that.$.alert(msg);
						}
					}
				});
			},
			inputname: function(e) {
				let that = this;

				this.setData({
					UserName: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isName: false
				}) : this.setData({
					isName: true
				})
			},
			inputphone: function(e) {
				let that = this;
				if (e.detail.value.length > 11) {
					this.setData({
						UserPhone: e.detail.value.slice(0, 11)
					});
					return
				}
				this.setData({
					UserPhone: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isPhone: false
				}) : /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
					isPhone: true
				}) : this.setData({
					isPhone: false
				})
			},
			inputaddress: function(e) {
				let that = this;
				this.setData({
					UserAddress: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isAddress: false
				}) : this.setData({
					isAddress: true
				})
			},
			submit: function() {
				let that = this;
				that.$.isNull(this.UserName) && this.setData({
					isName: false
				}), that.$.isNull(this.UserPhone) && this.setData({
					isPhone: false
				}), that.$.isNull(this.UserAddress) && this.setData({
					isAddress: false
				});
				if (this.isName && this.isPhone && this.isAddress) {
					var params = {
							user_name: this.UserName,
							user_phone: this.UserPhone,
							user_address: this.UserAddress,
							activity_id: this.LuckyDrawId,
							alh_id: this.LuckyDrawPrizeId,
							alh_item_id: this.LuckyDrawUniqueId
						},
						t = this;
					that.$.request({
						url: that.Config.URL.user.updateLotteryAddress,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								setTimeout(function() {
										t.goback()
									},
									1e3)
							} else {
								that.$.alert(msg);
							}
						}
					});

				}
			},
			goback: function() {
				let that = this;
				that.$.navigateBack(1, function() {
					that.$.alert("提交信息成功！", function() {}, 2e3)
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";

	.m-tip {
		font-size: 24rpx;
		padding: 20rpx 30rpx 0;
		color: gray;
	}
</style>
