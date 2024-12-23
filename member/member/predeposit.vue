<template>
    <view class="page">
        <view class="topbg">
            <view class="topinfo">
                <navigator  :url="'../cash/balance?user_total_weath=' + (CashData.user_total_weath) + '&user_money=' + (CashData.user_money) + '&user_commission_buy=' + (CashData.user_commission_buy)">
                    <label style="font-size:56px">{{sprintf(__('￥%s'), CashData.user_total_weath)}}</label>
                </navigator>
                <view class="portionMoney"><label>{{sprintf(__('余额 ￥%s'), CashData.user_money)}}</label></view>
                <!-- <navigator url="/member/cash/predepositapply?price=(CashData.user_commission_buy)" class="m-t-text">申请提现</navigator> -->
            </view>
        </view>
        <view class="m-cells">
            <navigator url="/member/cash/predepositlist" class="m-cell m-cell-access" v-if="(isMemDist||isECashCard)">
                <view class="m-cell-bd">
                    <label>{{__('资金明细')}}</label>
                </view>
                <view class="m-cell-ft"></view>
            </navigator>
            <navigator url="/member/cash/predepositapplylist" class="m-cell m-cell-access" v-if="(isMemDist||isECashCard)">
                <view class="m-cell-bd">
                    <label>{{__('提现记录')}}</label>
                </view>
                <view class="m-cell-ft"></view>
            </navigator>
        </view>
        <view class="m-text-box" v-if="(isMemDist)">
            <view @click="showTip">
                <label class="iconfont icon-14052218"></label>{{__('代言规则')}}
            </view>
        </view>

        <view class="m-btn-box">
            <view class="u-btn u-btn-default" @click="goto" v-if="(isECashCard)">{{__('我要充值')}}</view>
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
                CashData: {},
                isECashCard: true, isMemDist: true
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('')
            });


            var that = this;
            var params = {user_id: this.userInfo.user_id};

            this.forceUserInfo(function (resource) {
                that.$.request({
                    url: this.Config.URL.fx.index,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            var new_data = {
                                user_money: that.$.sprintf('%.2f', resource.user_money),
                                user_commission_buy: that.$.sprintf('%.2f', data.user_commission_buy),
                                month_commission_buy: that.$.sprintf('%.2f', data.month_commission_buy),
                                month_fans_num: data.month_num,
                                isShowDistributionButton: true,
                                commission_buy_amount: that.$.sprintf('%.2f', data.commission_buy_amount),
                                total_fans_num: data.all_num,
                                user_total_weath: that.$.sprintf('%.2f', resource.user_money+data.user_commission_buy),
                            };

                            that.setData({CashData: new_data})
                        }
                    }
                });
            });


            // var r = this.shopInfo.VendorFeatureSet;
            // r.indexOf("ECashCard") > -1 ? this.setData({isECashCard: true}) : this.setData({isECashCard: false}),
            // r.indexOf("MemDist") > -1 ? this.setData({isMemDist: true}) : this.setData({isMemDist: false})
            // 系統配置是否启用分销、提现等系统
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            showTip: function () {
                let that = this;
                that.$.confirm("只要你在店铺分享任何商品或者活动页面到微信，吸引到朋友点击并且进入店铺，TA即会成为你的一级粉丝，TA分享的一级粉丝会成为你的二级粉丝，一、二级粉丝支付购买的任何店铺内的商品，都会按照一定的计算方法算作你的奖金收益。 如果没有获得收益，主要可能有以下原因：- 你的朋友在之前已经成为其他人粉丝；- 系统判定该笔订单数据异常，收益被取消；- 自己点击了自己分享的商品链接。")
            },
            "goto": function () {
                that.$.redirectTo("/member/cash/recharge")
            }
		}
	}
</script>

<style lang="scss">
    @import "../../styles/_variables";

    .topbg {background-color: $default-skin-bg;padding-bottom: 20rpx;}
    .topinfo {display: flex;width: 100%;flex-flow: column;padding-top:40rpx;justify-content: center;align-items: center;color: white;font-size: 14px;position: relative;}
    /* .topinfo label {font-size: 56px;} */
    .m-t-text{float: right;position: relative;margin-right: 40rpx;}
    .m-t-text::after {content:" ";display:inline-block;height:12rpx;width:12rpx;border-width:4rpx 4rpx 0 0;border-color:#fff;border-style:solid;-webkit-transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0);transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0);position:relative;position:absolute;top: 50%;margin-top: -6rpx;}

    .menu_list{display: -webkit-box;margin-top: 40rpx;}
    .menu_item{color: white;float: left;-webkit-box-flex: 1;box-sizing: border-box;text-align: center;
        position: relative;}
    .menu_item text{font-size: 14px;}
    .menu_item:nth-child(1):before {content: "";border-right: 1rpx solid white;height: 50rpx;position: absolute;right: 0;bottom: 0;}
    .m-cells{font-size: 28rpx;background-color: #fff;}
    .m-cell-bd{color: #333;}
    .m-text-box{font-size: 24rpx;box-sizing: border-box;padding: 20rpx;color: #888;line-height: 40rpx;}
    .m-text-box label{padding-right: 10rpx;}
    .m-cell-bd{line-height: 50rpx;}
    /* .m-btn-box{padding-bottom: 10rpx;} */
    .m-btn-box-two{
        display: flex;
        justify-content: space-around;
    }
    .portionMoney{
        width: 60%;
        display: flex;
        font-size: 28rpx;
        justify-content: space-around
    }
</style>
