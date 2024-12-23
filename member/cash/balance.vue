<template>
	<view>
		<view class="header">
			<view class="header-top">
				<view class="message">
					<view style="font-size:112rpx;color:#fff">{{user_total_weath}}</view>
					<view class="grade">
						{{__('总余额(￥)')}}
					</view>
				</view>
			</view>
			<view class="header-bottom" v-if="Config.PLANTFORM_FX_ENABLE">
				<view class="growth">
					<view class="num">{{__('余额(￥)')}}</view>
					<view>{{user_money}}</view>
				</view>
			</view>
		</view>
		<view class="m-btn-box">
			<navigator url="/member/cash/recharge" class="u-btn u-btn-default" v-if="(isECashCard)">{{__('我要充值')}}</navigator>
		</view>
		<view class="m-btn-box">
			<navigator url="/member/cash/predepositapply" class="u-btn btn-line-primary">{{__('我要提现')}}</navigator>
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
				user_total_weath: 0, user_money: 0, user_commission_now: 0, Height: 0, isECashCard: true, isMemDist: true
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的财富')
			});

			var that = this;
			that.$.getSystemInfo({
				success: function (e) {
					that.setData({Height: e.windowHeight})
				}
			}), this.setData({user_total_weath: options.user_total_weath, user_money: options.user_money, user_commission_now: options.user_commission_now});
		},
		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'login'])
		}
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";

	/* .header{
      width: 100%;
      height: 400rpx;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
    }
    .portionMoney{
      width: 60%;
      display: flex;
      font-size: 28rpx;
      justify-content: space-around
    } */
	.header{
		width: 100%;
		height: 480rpx;
	}
	.header-top{
		width: 100%;
		height: 280rpx;
		background: $default-skin-bg;
		display: flex;
		justify-content: center
	}
	.cover{
		position:fixed;width:100%;height:100%;top:0px;background:rgba(0,0,0,0.4);overflow: hidden;
	}
	.message{
		/* margin-top: 30rpx; */
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center
	}
	.grade{
		font-size: 28rpx;
		color: #fff;
		text-align: center
	}
	.header-top image{
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%
	}
	.header-bottom{
		width: 100%;
		height: 84rpx;
		padding: 20rpx 0;
		display: flex;
		background: $default-skin-bg;
	}
	.growth{
		width: 50%;
		border-right: 1px solid #fff;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
	}
	.integral{
		width: 50%;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
	}
	.num{
		margin: 8rpx 0
	}
</style>
