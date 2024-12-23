<template>
	<view class="content">
		<zwy-calendar type="sign" :signDayArr="signDayArr" :checkDate="true" bgweek="#006afe" bgday="#006afe" @change="signDate"></zwy-calendar>
		<sigin-in :sign_list="sign_list" :is_sign="today_is_sign" :continue_sign_days="continue_sign_days" @click="getsigin"></sigin-in>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import zwyCalendar from './components/zwy-calendar/zwy-calendar.vue'
	import siginIn from './fanxiao-sign/sigin-in.vue';
	
	export default {
		components: {
			zwyCalendar,
			siginIn,
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('签到')
			});
			var that = this;
			
			that.loadSignState();
		},
		data() {
			return {
				sign_list: [],
				signDayArr: [],
				today_is_sign: 0,
				continue_sign_days: 0,
				message: {}
			};
		},
		methods: {
			signDate(event) {
			},
			getsigin(e) {
				this.handleSign();
			},
			handleSign() {
				let that = this;
				let param = {
					user_id: this.userInfo.user_id
				};
				
				that.$.request({
					url: this.Config.URL.user.signIn,
					data: param,
					method: "POST",
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.showModal({
								content: that.__("签到成功"),
								showCancel: false
							})
							that.loadSignState()
						} else {
							that.$.showModal({
								content: that.__("签到失败，请重试"),
								showCancel: false
							})
						}
					}
				});
			},
			loadSignState: function() {
				var that = this,
						params = {
							user_id: this.userInfo.user_id,
						};
			
				that.$.request({
					url: this.Config.URL.user.getSignInfo,
					data: params,
					success: function(data, status, msg, code) {
						that.signDayArr = data.sign_day_arr
						that.today_is_sign = data.today_is_sign
						that.sign_list = data.sign_list
						that.continue_sign_days = data.continue_sign_days
					}
				});
			
			
				that.setData({
					message: this.userInfo
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
	page {
		background: #f4f5f7;
	}
</style>
