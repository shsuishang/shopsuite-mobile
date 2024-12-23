<template>
	<view class="page">
		<view class="m-product-all">
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="allOrders">
						{{__('成长值解读')}}
					</view>
					<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @click="toBePaid">
						{{__('成长值明细')}}
					</view>
				</view>
			</view>
			<view :class="[tapindex==1?'':'hide']" style="font-size:28rpx;position:absolute;top:66rpx">
				<view style="background:#fff;overflow:hidden">
					<view class="what">
						<text>{{__('什么是成长值')}}</text>
					</view>
					<view class="specific">
						{{__('成长值是会员通过购物、评价、签到等行为获得的，成长值总额决定了会员等级。')}}
					</view>
					<view class="contrast">
						<text>{{__('会员等级对照表')}}</text>
					</view>
					<view class="table">
						<view class="title">
							<label class="title-left">
								{{__('会员等级')}}
							</label>
							<label class="title-right">
								{{__('所需成长值')}}
							</label>
						</view>
						<view class="title" v-for="(items, index) in Info" :key="index">
							<label class="title-left">
								{{items.user_level_name}}
							</label>
							<label class="title-right">
                {{items.user_level_exp}}
							</label>
						</view>
					</view>
				</view>
				<view style="margin-top:20rpx;background:#fff;overflow:hidden;">
					<view class="how">
						<text>{{__('如何获取')}}</text>
					</view>
					<view style="margin-top:30rpx;">
						<view class="rule">
							<text>{{__('1、购物')}}</text>
							<view>{{__('确认后可获得成长值,获取成长值=订单金额*')}}{{growthvalue.exp_consume_rate ? growthvalue.exp_consume_rate : 0}}。</view>
						</view>
						<view class="rule">
							<text>{{__('2、下单')}}</text>
							<view>{{__('提交一个订单并且通过审核后最高可获得')}}{{growthvalue.exp_consume_max ? growthvalue.exp_consume_max : 0}}{{__('个成长值。')}}</view>
						</view>
						<view class="rule">
							<text>{{__('3、签到')}}</text>
							<view>{{__('每日签到可获得')}}{{growthvalue.exp_login ? growthvalue.exp_login : 0}}{{__('个成长值')}}。</view>
						</view>
						<view class="rule">
							<text>{{__('4、进行商品评价')}}</text>
							<view>{{__('购买商品订单交易完成后可获得')}}{{growthvalue.exp_evaluate_good ? growthvalue.exp_evaluate_good : 0}}{{__('个成长值')}}。</view>
						</view>
					</view>
				</view>
			</view>
			<view :class="(tapindex==2?'':'hide')" style="font-size:28rpx">
				<scroll-view v-if="(list.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom"  style="width:100%;height:100%;position:absolute;top:66rpx">
					<view class="detail" v-for="(items, i) in list"  :key="i">
						<view class="detail-left">
							<text>{{items.exp_log_desc}}</text>
							<view class="time" style="margin-top:20rpx">{{items.exp_log_time}}</view>
						</view>
						<view class="detail-right">+{{items.exp_log_value}}</view>
					</view>
					<view class="m-loading-box">
						<block v-if="(ispage)">
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
				<view redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle">
						<view class="m-null-tip">
							<text>{{__('亲~您还没有成长值哦')}}</text>
						</view>
					</view>
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
                list: [], tapindex: 1, page: 1, ispage: true, flag: true, Info: "", growthvalue: "", windowHeight: 0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('成长值')
			});

			let that = this;
            try
            {
                var t = that.$.getSystemInfoSync();
                this.setData({windowHeight: t.windowHeight})
            } catch (n)
            {
                //console.log(" Do something when catch error")
            }
            var params = {};

            // 等级规则
            that.$.request({
                url: this.Config.URL.account.listBaseUserLevel,
                data: params,
                success: function (data, status, msg, code) {
                    if (200 == status) {
                        that.setData({
                            Info: data.items
                        })
                    }
                }
            });

            // 获取成长经验的途径
            that.$.request({
                url: this.Config.URL.account.listsExpRule,
                data: params,
                success: function (data, status, msg, code) {
                    if (200 == status) {
                        that.setData({
                            growthvalue: data
                        })
                    }
                }
            });
            this.getMemberGrowthDetailList()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            getMemberGrowthDetailList: function () {
                var that = this, params = { page: this.page, size: 20};
                // 列出成长值
                that.$.request({
                    url: this.Config.URL.user.listsExp,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status && data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['exp_log_time'] = that.$.formatDateFormatter(data.items[r]['exp_log_time'], 'yyyy-MM-dd hh:mm:ss')
							}
                            if (data.page >= data.total) {
                                that.setData({
                                    flag: false,
                                    ispage: false,
                                    list: that.list.concat(data.items)
                                })
                            } else {
                                that.setData({
                                    flag: true,
                                    ispage: true,
                                    list: that.list.concat(data.items)
                                })
                            }
                        } else {
                            that.setData({
                                flag: false,
                                ispage: false
                            })
                        }
                    }
                });
            },
            allOrders: function () {
                this.setData({tapindex: 1})
            },
            toBePaid: function () {
                this.setData({tapindex: 2})
            },
            scrollbottom: function () {
                if (this.flag)
                {
                    var that = this;
                    that.setData({flag: false}), clearTimeout(t);
                    var t = setTimeout(function () {
                        that.setData({page: that.page + 1}), that.getMemberGrowthDetailList()
                    }, 500)
                }
            }
		}
	};
</script>



<style lang="scss">

	@import "../../styles/_variables";

	.m-navbar-item {padding: 20rpx 0;font-size: 24rpx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6rpx;border-bottom: 6rpx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;}
	.what{
		width: 100%;
		margin-top: 58rpx;
		text-align: center
	}
	.what text{
		font-size: 32rpx;
		font-weight: bolder;
		color: #333;
	}
	.specific{
		width: 80%;
		margin: 26rpx auto 0;
		color: #505050;
		font-size: 28rpx
	}
	.contrast{
		width: 100%;
		margin-top: 40rpx;
		text-align: center
	}
	.contrast text{
		font-size: 28rpx;
		color: #333
	}
	.table{
		width: 80%;
		border-top:1px solid #d9d9d9;
		border-left:1px solid #d9d9d9;
		margin: 40rpx auto;
	}
	.table .title{
		display: flex;
		width: 100%
	}
	.title-left,.title-right{
		width: 50%;
		border-bottom:1px solid #d9d9d9;
		border-right:1px solid #d9d9d9;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		color: #505050
	}
	.how{
		width: 100%;
		margin-top: 30rpx;
		text-align: center
	}
	.how text{
		font-size: 32rpx;
		font-weight: bolder;
	}
	.rule{
		padding: 14rpx 30rpx;
		font-size: 28rpx
	}
	.rule text{
		color:#333
	}
	.rule view{
		margin-top: 10rpx;
		color: #505050
	}
	/* .detail{
      display: flex;
      justify-content: space-between;
      padding: 24rpx 30rpx;
      align-items: center;
      border-bottom:1px solid #d9d9d9;
      background: #fff
    } */
	.detail {padding: 24rpx 30rpx;position: relative;display: -webkit-box;display: -webkit-flex;display: flex;-webkit-box-align: center;-webkit-align-items: center;align-items: center;justify-content: space-between;background: #fff}
	.detail::before {content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-bottom: 1px solid #ebebe7;color: #ebebe7;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}
	.detail-left{
		color: #333;
	}
	.detail-left view{
		margin-top: 10rpx;
	}
	.detail-right{
		color: #505050
	}
</style>
