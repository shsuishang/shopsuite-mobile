<template>
	<view class="content">

		<view class="m-cell">
			<view class="m-cell-hd"><label class="u-label">{{__('金额')}}</label></view>
			<view class="m-cell-bd">
				<input class="u-input" type="text" :value="(num||'')" placeholder="请输入金额"/>
			</view>
		</view>
	        <cwx-keyboard @confirmEvent="confirmEvent" :money.sync="num" btn-color='orange' title="确认付款"></cwx-keyboard>

			<payment-box :paymentDataDefault="paymentData" ref="paymentBox" @onCancel="onCancel" @onPaid="onPaid"
			 @onFail="onFail"></payment-box>
	 </view>
</template>

<script>
	import cwxKeyboard from './cwx-keyboard/cwx-keyboard'
	import paymentBox from '../../components/payment-box.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'


	    export default {
	        data() {
	            return {
	                num:'',
					paymentData: {}
	            }
	        },
	        components:{
	            cwxKeyboard,
				paymentBox
	        },
			computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
			onLoad: function(options) {
				var that = this
				uni.setNavigationBarTitle({
					title:this.__('扫码支付')
				});


				this.notice.addNotification("GotoPayCheckout", that.gotopay, that);
			},
			onUnload: function() {
				//移除通知
				var that = this

				this.notice.removeNotification("GotoPayCheckout", that);

				if (this.$refs.paymentBox.showBoxView) {
					this.$refs.paymentBox.cancel();
				}
			},
			onBackPress() {
				if (this.$refs.paymentBox.showBoxView) {
					this.$refs.paymentBox.cancel();

					return true;
				}
			},
	        methods: {
				...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),
	            confirmEvent(e){
					//console.log(e)
					var that = this
					that.$.request({
						url: this.Config.URL.user.qrcodeAdd,
						// data: params,
						success: function(data, status, msg, code) {
						that.setData({
							'paymentData': {
								order_id: that.order_id,
								order_money_amount: e,

								user_money: data.user_money,
								user_points: data.user_points
									},
								});
							}
						});
	               that.setData({
	               	'paymentData': {
	               		order_money_amount: e,
	               	}
	               });
	               //console.log(that.paymentData)

				   that.notice.postNotificationName("GotoPayCheckout")
				},
				onCancel: function(e) {
				},
				onPaid: function(e) {

				},
				onFail: function(e) {
				},
				gotopay: function(e) {
				    setTimeout(() => {
				        this.$refs.paymentBox.show();
				    }, 400)

					return true;

				},
	        }
	    }
</script>

<style lang="scss">

</style>
