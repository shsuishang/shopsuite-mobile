<template>
	<view>
        <view v-if="(isShow)">
			<!-- 出现选择 -->
            <view class="header" v-if="!quick && Info.length">{{__('充值金额')}}</view>
			<view style="display:flex;width:100%" v-if="!quick && Info.length">
				<view class="content" style="width:100%">
				  <view v-for="(item, index) in Info"  :key="index">
					<view :class="'money ' +  (item.recharge_level_id==fid?'redborder redfont':'grayborder')" :data-id="(item.recharge_level_id)" :data-recharge_level_value="(item.recharge_level_value)" :data-recharge_level_name="(item.recharge_level_name)"  @click="choose">
					  <text class="realMoney">{{__('￥')}}{{item.recharge_level_value}}</text>
					  <text :class="'giveMoney ' +  (item.recharge_level_id==fid?'':'grayfont')" v-if="(item.ExtraAmount)">{{__('赠送:')}}({{__('￥')}}{{item.recharge_level_gift}})</text>
					</view>
				  </view>
				</view>
			</view>

			<!-- 不出现选择 -->
            <view class="m-cell" v-if="!(!quick && Info.length)">
                <view class="m-cell-hd"><label  class="u-label">{{__('充值金额')}}</label></view>
                <view class="m-cell-bd">
                    <input v-if="!fid" class="u-input" type="digit" :value="(pdr_amount)" :placeholder="__('请输入充值金额')" @input="inputRecharge" maxlength="9"/>
					<label v-else>{{pdr_amount}}</label>
                </view>
                <div v-if="(!isMoney)" class="m-cell-ft">
                    <icon class="m-icon-warn" type="warn" ></icon>
                </div>
            </view>
			<block v-else>
				<!-- 是否有图片 -->
				<view class="header">{{__('充值说明')}}</view>
				<view v-for="(item, index) in Info" :data-id="(item.recharge_level_id)" :key="index">
				    <view class="message" v-if="item.recharge_level_id==fid">{{item.recharge_level_description}}</view>
				</view>
			</block>


            <form report-submit="true" @submit="paysubmit">
                <button class="payment" formType="submit">{{__('充值')}}</button>
            </form>
        </view>

        <view v-else class="m-nullpage">
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <text>{{__('亲~什么都没有')}}</text>
                </view>
            </view>
        </view>

        <payment-box :paymentDataDefault="paymentData" :defaultUserMoney="false" :order_id="order_id" ref="paymentBox"  @onCancel="onCancel"  @onPaid="onPaid"  @onFail="onFail"></payment-box>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

    import paymentBox from '../../components/payment-box.vue'


	export default {
		data() {
			return {
                Info: [],
                fid: 0,
                order_id: "",
                isShow: true,
                isMoney : 1,
                pdr_amount: '',
				quick:false, //跳转过来直接支付

                paymentData:{}
			};
		},

        components: {
            paymentBox
        },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('余额充值')
            });

            if (options.fid)
			{
				this.quick = true;

				this.setData({
					fid: options.fid
				})

			}
			else
			{
				this.quick = false;
			}

            this.GetVendorECashCardList()
		},
        onUnload: function() {
            //移除通知
            var that = this

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

            choose: function (e) {
				this.setData({
					fid: e.currentTarget.dataset.id,
					pdr_amount:e.currentTarget.dataset.recharge_level_value
				})

				this.$.setNavigationBarTitle({title: e.currentTarget.dataset.recharge_level_name});
            },

            GetVendorECashCardList: function () {
                var params = {
					page: 1,
					size: 50
				};
                let that = this;

                that.$.request({
                    type:'post',
                    url: this.Config.URL.pay.recharge_list,
                    data: params,
                    success:function(data, status, msg, code) {
                        if(status == 200){
							if (data.items.length)
							{
								that.setData({
									Info: data.items,
									isShow: true
								})

								data.items.forEach(function (v, k) {
									if (that.quick && that.fid == v.recharge_level_id)
									{
										that.$.setNavigationBarTitle({title: v.recharge_level_name});

										that.setData({
											fid: v.recharge_level_id,
											pdr_amount: v.recharge_level_value
										})
									}
								})

								if (!that.fid)
								{
									that.setData({
										fid: data.items[0].recharge_level_id,
										pdr_amount: data.items[0].recharge_level_value
									})
								}
							}
							else
							{
								that.setData({isShow: true})
							}
                        }
						else
						{
							that.setData({isShow: true})
						}
                    }
                });
            },
            inputRecharge: function (e) {
                let that = this;
                this.setData({pdr_amount: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isMoney: false}) : /^\d+(?:\.\d{1,2})?$/.test(e.detail.value) && e.detail.value > 0  ? this.setData({isMoney: true}) : this.setData({isMoney: false})
            },
            paysubmit: function (e) {
                let that = this;
                if (!this.isMoney) {
                    that.$.alert('请输入正确的金额！');
                    return;
                }

                var params = {
                    pdr_amount: this.pdr_amount,
                    userId: this.userInfo.user_id,
					recharge_level_id:this.fid/* ,
                    store_id: this.shopInfo.store_id */
                };

                that.$.request({
                    type:'post',
                    url: this.Config.URL.pay.recharge,
                    data: params,
                    success:function(data, status, msg, code) {
                        if(status == 200){
                            that.setData({
                                order_id: data.pay_sn
                            });

                            that.gotopay();
                        }
						else
						{
							that.$.alert(msg);
						}
                    }
                });

                /*//console.log(params), that.$.xsr(that.$.makeUrl(orderapi.ECashRecharge, params), function (e) {
                    //console.log(e), that.setData({order_id: e.Info.order_id}), e.Code == 0 && (e.Info.RealCardCash > 0 ? that.gotopay() : e.Info.RealCardCash == 0 && that.$.redirectTo("../rechargeorderdetail/rechargeorderdetail?on=" + e.Info.order_id))
                })*/
            },

            gotopay: function () {
                var that = this;

                that.setData({
                    order_id: that.order_id,
                    'paymentData': {
                        order_id: that.order_id,
                        order_money_amount: that.pdr_amount,
                    }
                });


                this.$refs.paymentBox.show();
                return true;

                var param = {
                        order_id: this.order_id,
                        openid: this.userInfo.openId,
                        /* store_id: this.shopInfo.store_id, */
                        typ: 'json',
                        payment_channel_code: 'wx_native',
                        prepay_flag: 1
                    };

                var that = this;

                that.$.request({
                    url: this.Config.URL.pay.pay,
                    data: param,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.requestPayment({
                                timeStamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                "package": data.package,
                                signType: data.signType,
                                paySign: data.paySign,
                                success: function (n) {
                                    that.returnUrl(param.order_id)
                                },
                                fail: function (e) {
                                },
                                complete: function (n) {
                                    n.errMsg == "requestPayment:cancel" && (that.$.redirectTo("../rechargeorderdetail/rechargeorderdetail?on=" + param.order_id), that.sendMessage(param.order_id, 1))
                                }
                            })
                        }
                        else
                        {
                            that.$.alert(msg)
                        }

                    },

                    fail: function (err) {
                    }
                });

            },

			onCancel: function(e) {
			},
			onPaid: function(e) {
				let that = this;
				that.reloadUserResource(function (user_info) {
					that.returnUrl(that.order_id);
				});
			},
			onFail: function(e) {
				let that = this;
				that.$.gotopage("/member/cash/rechargelist?on=" + this.order_id)
			},
            returnUrl: function (e) {
                var that = this;


				that.$.gotopage("/member/cash/rechargelist?on=" + e);
				return

                if (!that.$.isNull(that.spinfo))
                {
                    var n = JSON.parse(that.spinfo);
                    if (n.isFightGroup == 2)
                    {
                        if (n.isOwner)
                        {
                            that.$.redirectTo("../rechargeorderdetail/rechargeorderdetail?on=" + e);
                            return
                        }
                        that.$.navigateBack(1, function () {
                            this.notice.postNotificationName("RefreshFG")
                        });
                        return
                    }
                    that.$.redirectTo("../rechargeorderdetail/rechargeorderdetail?on=" + e);
                    return
                }
                that.$.redirectTo("../rechargeorderdetail/rechargeorderdetail?on=" + e);
                return
            }
		}
	}
</script>

<style lang="scss">
    @import "../../styles/_variables";

    .header{
        font-size: 32rpx;
        margin: 40rpx 30rpx;
    }
    .content{
        width:100%
    }
    .grayborder{
        border: 1px solid #aaaaaa
    }
    .redborder{
        border: 1px solid $default-skin-bg
    }
    .grayfont{
        color: rgb(122, 122, 122)
    }
    .redfont{
        color: $default-skin-bg;
    }
    .money{
        width: 20%;
        height: 78rpx;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: space-around;
        border-radius: 8rpx;
        padding: 20rpx 30rpx;
        float: left;
        margin: 0 0 3.5% 3.6%;
    }
    .realMoney{
        font-size: 28rpx
    }
    .giveMoney{
        font-size: 24rpx;
    }
    .payment{
        height: 80rpx;
        line-height: 82rpx;
        background: $default-skin-bg;
        color: #fff;
        margin: 50rpx 30rpx;

    }
    .message{
        font-size: 30rpx;
        padding: 0 30rpx 30rpx 30rpx;
        color: #999;
    }
    .hidden{
        display: none;
    }
</style>
