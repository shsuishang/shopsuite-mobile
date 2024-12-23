<template>
	<view class="page">
		<view style="margin-top: 5%;">
			<view class='card_name'>会员卡详情
			</view>
			<view style="display: flex;width: 95%;margin: 30rpx auto;wxcs_style_margin: 20rpx auto;">
				<view style=' flex: 1;color: #ccc;font-size:32rpx;'>特权说明
				</view>
				<view style=' flex: 4;font-size:32rpx;'>
					<view style='font-size:32rpx;'>{{member.MemberCardPrerogative}}</view>
				</view>
			</view>
			<view style="display: flex;width: 95%;margin: 30rpx auto;wxcs_style_margin: 20rpx auto;">
				<view style=' flex: 1;color: #ccc;font-size:32rpx;'>有效日期
				</view>
				<view style=' flex: 4;font-size:32rpx;'>{{member.EffectiveTimeStr}}
				</view>
			</view>
			<view style="display: flex;width: 95%;margin: 30rpx auto;wxcs_style_margin: 20rpx auto;">
				<view style=' flex: 1;color: #ccc;font-size:32rpx;'>电话
				</view>
				<view style=' flex: 4;font-size:32rpx;color:#39a851'>{{member.ServiceTel}}
				</view>
			</view>
			<view style="display: flex;width: 95%;margin: 30rpx auto;wxcs_style_margin: 20rpx auto;">
				<view style=' flex: 1;color: #ccc;font-size:32rpx;'>使用须知
				</view>
				<view style=' flex: 4;font-size:32rpx;'>{{member.Description}}
				</view>
			</view>
		</view>

	</view>
</template>


<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import guessYouLike from '@/components/product-list.vue'

	export default {
		data: function() {
			return {
				UserInfo:{},
				member:{}
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			guessYouLike
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('会员卡详情')
			});

			var that = this;

			this.forceUserInfo(function(user) {
				that.setData({
					UserInfo: user
				});
			});

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource'])
		}
	};
</script>



<style lang="scss">
@import "../../styles/_variables";
.card_name{ width:95%; border-bottom:2rpx solid #ccc; margin:0 auto; padding-bottom:3%; font-size:30rpx; }
</style>
