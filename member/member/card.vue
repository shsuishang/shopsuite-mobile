<template>
	<view class="page">
		<view class='zt'>
		    <view class='nr' style='background:#422f83;background-size:100% 100%'>
		        <view class="content" @click="previewImage">
		            <view class='logobackground'>
		                <view style="float: left;">
		                    <image class='logo' mode="aspectFill" :src='UserInfo.user_avatar'></image>
		                </view>
		                <view class='name'>
		                    <view class='category' style='color:#fff'>{{UserInfo.user_nickname}}</view>
		                </view>
		                <view class='card_name'>
		                    <view class='category' style="color: #fff;font-size: 26rpx;">{{UserInfo.user_level_name}}{{__('会员卡')}}</view>
		                </view>
		            </view>
		            <view class='lb_box' style="width: 100%;margin: 64rpx auto 0 auto;height:22px;">
		                <view style="width: 100%;color: #fff;">
		                    <view style='float:left;margin-left: 6%;font-size:15px;color:#fff'>{{UserInfo.user_level_card}}</view>
		                </view>
		            </view>
		        </view>
		    </view>

			<button class="payment" formType="submit" @click="favorable">{{__('优惠买单')}}</button>

		    <view style='width:89%;margin:33px auto 0 auto;background:white;border-top:1px solid #f1f1f1;' v-if="false">
		        <view class='m-cell-access' @tap='showCardDetail'
		              style="height:100rpx;width: 100%;font-size: 14px;line-height: 92rpx;display:-webkit-box;display:flex;align-items:center;">
		            <view style='flex:1;'>会员卡详情</view>
		            <text class="m-cell-ft"></text>
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
				UserInfo:{}
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			guessYouLike
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('会员卡')
			});

			var that = this;


			this.forceUserInfo(function(user) {
				that.setData({
					UserInfo: user
				});
			});

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),
			previewImage: function(e) {
				//预览图片
				var that = this;
				var current = this.sprintf('%s?data=%s', this.Config.URL.qrcode, this.UserInfo.user_level_card);
				var n = [current];

				uni.previewImage({
					current: current,
					urls: n
				})
			},
			showCardDetail:function (e) {
				wx.navigateTo({url: "/member/member/carddesc"})
			},
			favorable:function (e) {
				wx.navigateTo({url: "/chain/chain/favorable"})
			}
		}
	};
</script>



<style lang="scss">
@import "../../styles/_variables";

page{ background-color:#fff; } .zt{ width: 100%； } .nr{ width:91%; margin:16px auto 0 auto; border-radius:19rpx; padding-bottom:49rpx; background:white; } .m-cell-ft {text-align: right;color: #999999;} .m-cell-link {color: #586C94;font-size: 14px;} .m-cell-access .m-cell-ft:after {content: " ";display: inline-block;height: 12rpx;width: 12rpx;border-width: 4rpx 4rpx 0 0;border-color: #ebebe7;border-style: solid;-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);position: relative;top: -4rpx;position: absolute;top: 50%;margin-top: -8rpx;right: 4rpx;} .m-cell-access .m-cell-ft {padding-right: 13px;position: relative;} page { background-color:#fff; } button{ position:relative; display:block; margin-left:auto; margin-right:auto; padding-left:0px; padding-right:0px; box-sizing:border-box; text-align:center; text-decoration:none; line-height:2.55555556; border-radius:5px; -webkit-tap-highlight-color:transparent; overflow:hidden; background-color:#fff; margin-top:140rpx; } .shareButton { color: #fb4458; width: 120px; height: 40px; line-height: 40px; border: 1px solid #fb4458; box-shadow: 2px 5px 5px #fb4458, 0 0 0 #fb4458, 0px 2px 3px #fb4458, 0 0 0 #fb4458; border-radius: 20px; margin-top: 50px; } .container { min-height: 100%; padding: 20rpx 0rpx; } .touch-item { font-size: 14px; display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; box-shadow: 0 0 0 green, 0 0 0 blue, 0px 2px 3px #ccc, 0 0 0 yellow; width: 100%; overflow: hidden; } .content { width: 100%; padding-top: 12px; line-height: 22px; margin-right: 0; -webkit-transition: all 0.4s; transition: all 0.4s; } .del { background-color: orangered; width: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; -webkit-transform: translateX(90px); transform: translateX(90px); -webkit-transition: all 0.4s; transition: all 0.4s; margin-top: 12px; } .touch-move-active .content, .touch-move-active .del { -webkit-transform: translateX(0); transform: translateX(0); } .logobackground { margin-left: 5%; width: 90%; height: 211rpx; border-top-left-radius: 10px; border-top-right-radius: 10px; padding-top: 0px; } .maskImage { margin-top: -80px; background-color: white; opacity: 0.3; position: absolute; } .logo { height:50px; width:50px; border-radius:30px; margin-top:0px; margin-left:6rpx; } .name { color:white; font-size:16px; flex-direction:row; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; float:left; width:67%; margin-top:1%; margin-left:2%; } .card_name{ color:white; font-size:16px; flex-direction:row; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; float:left; width:67%; margin-top:3%; margin-left:2%; } .category { padding:5px; font-size:28rpx; line-height:10px; float:left; } .discount { color:white; font-size:12px; float:right; } .date { color:white; font-size:12px; float:right; margin-top:-38rpx; margin-right:54rpx; } .sm{ width:91%; color:#888; font-size:13px; margin:28rpx auto; } .m-cell-ft{ text-align:right; color:#cfcfd4; position:relative; }

.payment { width: 90%; height: 80rpx; line-height: 82rpx; background: #db384c; color: #fff; margin-top: 50rpx; }

</style>
