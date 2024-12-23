<template>
	<view class="page">
		<block v-if="(Prize.length > 0)">
			<view class="m-myprice-item" v-for="(item, index) in Prize" :key="index">
				<image lazy-load :src="(item.awards_image)" />
				<view class="price-title">{{item.awards_name}}</view>
				<view class="price-time">{{item.alh_datetime}}</view>
				<view :class="'price-btn ' + (item.alh_is_send?'gray':'red')" @click="buttonclicked" :data-id="(item.alh_id)" :data-activity_id="(item.activity_id)" :data-alh_is_send="(item.alh_is_send)" :data-alh_item_id="(item.alh_item_id)">{{item.alh_is_send?__('已经发奖'):__('去领奖品')}}</view>
			</view>
		</block>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{sprintf(__('没有%s中的奖品，快去%s吧~~'), tip1, tip2)}}</text>
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

	export default {
		data: function() {
			return {
				Prize: [], Category: 0, tip1: "", tip2: "", isLuckDraw: true, isGoldenEgg: true
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('我的奖品')
			});

			//console.info(options);
			var that = this;
			var t = this.shopInfo.VendorFeatureSet;
			this.setData({Category: options.category});
			if (options.category == 1) {
				this.setData({isGoldenEgg: false});
				this.setData({isLuckDraw: true});
				that.$.setNavigationBarTitle({title: "幸运大抽奖-我的奖品"});
				this.setData({
					tip1: "抽",
					tip2: "抽奖"
				});
			} else {
				this.setData({isGoldenEgg: true});
				this.setData({isLuckDraw: false});

				that.$.setNavigationBarTitle({title: "幸运砸金蛋-我的奖品"});
				this.setData({
					tip1: "砸",
					tip2: "砸金蛋"
				})
			}
		},
		onShow: function () {
			if (this.isGoldenEgg || this.isLuckDraw)
			{
				this.getPrizelist();

			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getPrizelist: function () {
				var params = {
					activity_type: this.Category,
					activity_type_id: this.StateCode.ACTIVITY_TYPE_LOTTERY,
					store_id: this.shopInfo.store_id
				};
				var that = this;
				that.$.request({
					url    : that.Config.URL.user.listsLotteryHistory,
					data   : params,
					success: function (data, status, msg, code)
					{
						if (status == 200) {
							that.setData({Prize: data.items})
						}
						else {
							that.$.alert(msg);
						}
					}
				});
			},
			buttonclicked: function (e) {
				let that = this;
				if (e.target.dataset.alh_is_send != '0'){
					return
				};

				that.$.navigateTo({url: "/member/member/receiveprize?id=" + e.target.dataset.id + "&activity_id=" + e.target.dataset.activity_id + "&uniqueid=" + e.target.dataset.uniqueid})
			}
		}
	};
</script>



<style lang="scss">
	@import "../../styles/_variables";

	.m-myprice-item{width: 100%;height: 200rpx;background: white;padding: 30rpx;box-sizing: border-box;position: relative;border-bottom: 1rpx solid lightgray;}
	.m-myprice-item image{height: 140rpx;width: 140rpx;box-sizing: border-box;position: absolute;top: 30rpx;left: 30rpx;}
	.price-title{font-size: 30rpx;position: absolute;left: 200rpx;top: 30rpx;}
	.price-time{position: absolute;left: 200rpx;bottom: 30rpx;line-height: 50rpx;font-size: 24rpx;color: gray;}
	.price-btn{width: 150rpx;height: 50rpx;color: white;position: absolute;bottom: 30rpx;right: 30rpx;font-size: 26rpx;line-height: 50rpx;text-align: center;border-radius: 8rpx;}

	.red{background: $default-skin-bg;}
	.gray{background: #ccc;}
</style>
