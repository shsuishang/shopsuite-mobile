<template>
	<view>
		<scroll-view class="m-scrollBox" v-if="CaseDetailList.length>0" scroll-y="true" @scrolltolower="scrollbottom">
			<view class="m-panel m-panel-access m-comment ">
				<view class="m-panel-bd">
					<view v-for="(item, index) in CaseDetailList"  :key="index" class="m-media-box m-media-box-appmsg">
						<view class="m-media-box-hd" v-if="false">
							<image class="m-media-box-thumb" :src="item.buyer_user_avatar" />
						</view>
						<view class="m-media-box-bd" style="display: inline-flex;">
							<view class="m-media-box-title text-overflow" style="width: 65%;">
								<navigator v-if="item.trade_is_paid != StateCode.ORDER_PAID_STATE_YES && item.trade_type_id!=StateCode.TRADE_TYPE_DEPOSIT" :url="'/member/order/detail?on=' + item.order_id" class="m-user-info"><label>{{item.trade_title}}</label></navigator>
								<label v-else>{{item.trade_title}}</label>

								<view class="m-media-box-info"  style="width: 100%;padding-top: 0px;">
									<view class="m-media-box-info-meta">{{item.order_id}}</view>
								</view>
							</view>
							<view class="m-media-box-num" :style="'width:35%;' + item.trade_is_paid == StateCode.ORDER_PAID_STATE_YES ? 'color:green' : 'color:gray'">
								<label style="float:right;">{{__('￥')}}{{item.trade_payment_amount}}</label>
								 <view class="m-media-box-info"  style="width: 100%;padding-top: 16px;">
									<view class="m-media-box-info-meta" style="float:right;padding-right:0">{{item.trade_create_time}}</view>
								 </view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="m-loading-box">
				<block v-if="ispage">
					<view class="u-loadmore">
						<label class="u-loading"></label>
						<text class="u-loadmore-tips">{{__('正在加载')}}</text>
					</view>
				</block>
				<block v-else>
					<view class="u-loadmore u-loadmore-line">
						<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
					</view>
				</block>
			</view>

		</scroll-view>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('赶快去分享商品，赚取收益吧!')}}</text>
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
		name: "predeposit",
		data: function() {
			return {
                tapindex: 1, page: 1, ChangeType: 0, ispage: true, flag: true, CaseDetailList: []
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('充值记录')
			});


			this.setData({CaseDetailList: []}), this.InitData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            InitData: function () {
                var params = {
                        change_type: this.ChangeType,
                        page: this.page
                    },
                    that = this;
                that.$.request({
                    url: this.Config.URL.pay.consume_trade,
                    data: params,
                    success: function (data, status, msg, code) {

                        if (status == 200) {
                            if (data.page >= data.total) {
                                that.setData({
                                    CaseDetailList: that.CaseDetailList.concat(data.items),
                                    flag: false,
                                    ispage: false
                                })
                            } else {
                                that.setData({
                                    CaseDetailList: that.CaseDetailList.concat(data.items),
                                    flag: true,
                                    ispage: true
                                })
                            }
                        } else {
                            that.setData({flag: false, ispage: false})
                        }
                    }

                });
            },
            scrollbottom: function () {
                if (this.flag)
                {
                    var that = this;
                    var t = null;

                    that.setData({flag: false});
                    clearTimeout(t);
                    var t = setTimeout(function () {
                        that.setData({page: parseInt(that.page) + 1}), that.InitData()
                    }, 500)
                }
            },
            allTypes: function () {
                this.setData({
                    tapindex: 1,
                    page: 1,
                    ispage: true,
                    flag: true,
                    ChangeType: 0,
                    CaseDetailList: []
                }), this.InitData()
            },
            expenditure: function () {
                this.setData({
                    tapindex: 2,
                    page: 1,
                    ispage: true,
                    flag: true,
                    ChangeType: 1,
                    CaseDetailList: []
                }), this.InitData()
            },
            income: function () {
                this.setData({
                    tapindex: 3,
                    page: 1,
                    ispage: true,
                    ChangeType: 2,
                    flag: true,
                    CaseDetailList: []
                }), this.InitData()
            }
		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar-item {padding: 20rpx 0;font-size: 24rpx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6rpx;border-bottom: 6rpx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-media-box-thumb{border-radius: 100%;overflow: hidden;}
	.m-media-box-num{float: right;font-size: 32rpx;}
	.m-media-box-num text{color:$default-skin-bg;}
	.m-media-box-info{-webkit-box-flex:2;-webkit-flex:2;flex:2;}
	.m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;}
	.m-scrollBox{padding-top:0rpx;position: absolute;box-sizing: border-box;width: 100%;height: 100%; }
	.m-panel{margin-top:-4rpx;}
	.m-num{float: right;color: $default-skin-bg}
	.m-panel-hd label{color: $default-skin-bg;font-size: 28rpx;margin-left: 20rpx;}
</style>
