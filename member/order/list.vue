<template>
  <view class="page">
    <view :class="(show?'cover':'')">

    </view>
    <view class="m-product-all">
      <view class="m-tab">
        <scroll-view class="m-navbar scroll-view_H" scroll-x style="width: 100%">
          <view :class="['m-navbar-item ellipsis', tapindex==1?'m-navbar-item-on':'']" @click="allOrders">
            {{ __('全部订单') }}
          </view>
          <view :class="['m-navbar-item ellipsis', tapindex==2?'m-navbar-item-on':'']" @click="toBePaid">
            {{ __('待支付') }}
          </view>
          <view :class="['m-navbar-item ellipsis', tapindex==5?'m-navbar-item-on':'']" @click="toBeShipping">
            <label v-if="(kindId==1201)">{{ __('待发货') }}</label>
            <label v-else>{{ __('待服务') }}</label>
          </view>
          <view :class="['m-navbar-item ellipsis', tapindex==3?'m-navbar-item-on':'']" @click="receiptOfGoods">
            <label v-if="(kindId==1201)">{{ __('待收货') }}</label>
            <label v-else>{{ __('待确认') }}</label>
          </view>
          <view :class="['m-navbar-item ellipsis', tapindex==4?'m-navbar-item-on':'']" @click="toBeEvaluated">
            <label v-if="(kindId==1201)">{{ __('已完成') }}</label>
            <label v-else>{{ __('已服务') }}</label>
          </view>
        </scroll-view>
      </view>
      <view v-if="loadComplete">
        <scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist page-container"
                     @scrolltolower="scrollbottom">
          <view v-for="(items, i) in orderlist" :key="i" class="m-panel m-panel-access">
            <view class="m-panel-hd">
              <text>{{ __('订单编号：') }}{{ items.order_id }}</text>
			  <label v-if="(items.order_state_id == 2020 || items.order_state_id == 2030) && items.order_is_shipped == 3031">
			  	{{ __('部分发货') }}
			  </label>
			  <label v-else>
			  	{{ getLabelByValue(items.order_state_id) }}
			  </label>
			  <label v-if="items.activity_groupbooking_history" style="margin-right: 10rpx;">
			  	{{ getEnableByValue(items.activity_groupbooking_history.gb_enable) }}
			  </label>
            </view>

            <view class="m-product-list">
              <navigator :url="'/member/order/detail?on=' + (items.order_id)" v-for="(item, ii) in items.items"
                         :key="ii" class="m-product-item">
                <view class="m-product-img">
                  <image :src="(item.order_item_image)" mode="aspectFill"/>
                </view>
                <view class="m-product-info">
                  <view class="m-product-name">
                    <!-- items.OrderType == 1 拼团 -->
                    <label>
                      {{ item.product_name }}
                    </label>
                    <label class="m-min-name"
                           style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1"
                    >
                      {{ item.item_name ? item.item_name : "" }}
                    </label>
                  </view>

                  <view class="m-product-price">
                    <block v-if="item.item_unit_price">
                      <label>{{ __('￥') }}</label>{{ item.item_unit_price }}
                    </block>

                    <block v-if="item.item_unit_points">
                      <label style="margin: auto 10rpx;">+</label>{{ item.item_unit_points }}{{ __('积分') }}
                    </block>

                    <block v-if="item.item_unit_sp">
                      <label style="margin: auto 10rpx;">+</label>{{ item.item_unit_sp }}{{ __('众宝') }}
                    </block>

                    <text style="float: right;margin-right: 60rpx;">x{{ item.order_item_quantity }}</text>
                  </view>
                </view>
              </navigator>
            </view>
            <!-- items.Type==2 ???? -->
            <view class="m-product-item" v-if="(items.Type==2)" style="height:154rpx">
              <view class="m-product-img">
                <image :src="(items.store_logo)" mode="aspectFill" style="width:172rpx;height:172rpx"/>
              </view>
              <view class="m-product-info2" style="padding:20rpx 0">
                <view class="m-product-name">
                  <label>{{ items.store_name }}</label>
                </view>
              </view>
            </view>
            <view class="m-total-info">
              <view>
                {{ __('总金额') }}：
                <block v-if="items.order_payment_amount">
                  <text style="">{{ __('￥') }}</text>
                  <label class="m-total-price">{{ items.order_payment_amount }}</label>
                </block>
              </view>
              <view v-if="items.order_payment_amount !== items.trade_payment_amount && items.trade_payment_amount > 0">
                {{ __('待付款') }}：
                <block v-if="items.order_payment_amount">
                  <text style="">{{ __('￥') }}</text>
                  <label class="m-total-price">{{ items.trade_payment_amount }}</label>
                </block>
              </view>

              <block v-if="items.order_resource_ext1"></block>
              <label class="m-total-price" v-if="items.order_resource_ext1" style="margin: auto 10rpx;"> +
                {{ items.order_resource_ext1 }}{{ __('积分') }}</label>
              <label class="m-total-price" v-if="items.order_resource_ext2" style="margin: auto 10rpx;"> +
                {{ items.order_resource_ext2 }}{{ __('众宝') }}</label>
            </view>
            <view class="m-total-btn">
              <form report-submit="true">
                <button :data-on="(items.order_id)" :data-order_payment_amount="(items.trade_payment_amount)"
                        v-if="(items.order_is_paid != StateCode.ORDER_PAID_STATE_YES && items.order_state_id!=StateCode.ORDER_STATE_CANCEL)"
                        class="u-link-btn" @click="gotopay" formType="submit">{{ __('去支付') }}
                </button>
              </form>

              <view :data-on="(items.order_id)" v-if="(items.order_lock_status)" class="u-link-btn">
                {{ __('退款/退货中...') }}
              </view>


              <navigator :url="'/member/product/comment?od=' + (items.order_id)"
                         v-if="(!items.order_buyer_evaluation_status&&items.order_state_id == StateCode.ORDER_STATE_FINISH)"
                         class="u-link-btn">{{ __('去评价') }}
              </navigator>
              <navigator :url="'/member/product/comment?od=' + (items.order_id)"
                         v-if="(items.order_buyer_evaluation_status == 1)"
                         class="u-link-btn">{{ __('查看评价') }}
              </navigator>
              <view :data-on="(items.order_id)"
                    v-if="(items.kind_id==1202 && items.order_state_id == StateCode.ORDER_STATE_SHIPPED)"
                    class="u-link-btn"
                    @click="writeOrder">{{ __('确认服务') }}
              </view>
              <block v-if="items.if_buyer_cancel">
                <view :data-on="(items.order_id)" v-if="(!items.activity_groupbooking_history)" class="u-link-btn" @click="cancelOrder">
                  {{ __('取消订单') }}
                </view>
                <view :data-on="(items.order_id)" v-else-if="(items.activity_groupbooking_history && (!items.activity_groupbooking_history.gbh_flag || 1==items.activity_groupbooking_history.gb_enable))" class="u-link-btn" @click="cancelOrder">
                  {{ __('取消订单') }}
                </view>
              </block>
              <view :data-on="(items.order_id)"
                    v-if="(items.kind_id==1201 && items.order_state_id == StateCode.ORDER_STATE_SHIPPED)"
                    class="u-link-btn"
                    @click="confirmReceipt">{{ __('确认收货') }}
              </view>
              <navigator :url="'/member/order/detail?on=' + (items.order_id)" class="u-link-btn">{{ __('查看详情') }}
              </navigator>
              <!-- ????? -->
              <navigator v-if="(items.Type==2)"
                         :url="'../favorableorderdetail/favorableorderdetail?on=' + (items.order_id)"
                         class="u-link-btn">{{ __('查看详情') }}
              </navigator>
            </view>
          </view>
          <view class="m-loading-box">
            <block v-if="(ispage)">
              <view class="u-loadmore">
                <label class="u-loading"></label>
                <text class="u-loadmore-tips">{{ __('正在加载') }}</text>
              </view>
              <view>
                <text></text>
              </view>
            </block>
            <block v-else>
              <view class="u-loadmore u-loadmore-line">
                <text class="u-loadmore-tips">{{ __('没有更多数据啦！') }}</text>
              </view>
            </block>
          </view>
        </scroll-view>

        <navigator url="/pagesub/product/list" redirect="true" class="m-nullpage" v-else>
          <view class="m-nullpage-middle" v-if="(!flag)">
            <view class="m-null-tip">
              <label style="font-size:32rpx;">{{ __('亲~您还没有订单哦，') }}</label><label
                class="highlight-link">{{ __('快去看看吧') }}</label>
            </view>
          </view>
        </navigator>
      </view>
      <view class="alert" v-if="(show)">
        <image style="width:50rpx;height:50rpx" src="/static/images/true.png"></image>
        <text style="margin-left:20rpx">{{ receiveMsg }}</text>
      </view>
    </view>


    <payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox" @onCancel="onCancel"
                 @onPaid="onPaid" @onFail="onFail"></payment-box>
  </view>
</template>


<script>

import paymentBox from '../../components/payment-box.vue'

import {mapMutations, mapState} from 'vuex'


export default {
  data() {
    return {
      isdata: false,
      tapindex: 1,
      page: 1,
      rows: 10,
      ispage: true,
      flag: true,
      type: 0,
      kindId: 1201,
      formId: "",
      orderlist: [],
      show: false,
      receiveMsg: "",
      order_id: "",
      paymentData: {},
	  enableOpinion: [
	  		  {
	  			value: 0,
	  			label: "拼团失败",
	  		  },
	  		  {
	  		  	value: 1,
	  		  	label: "拼团成功",
	  		  },
	  		  {
	  		  	value: 2,
	  		  	label: "拼团中",
	  		  },
	  		  {
	  		  	value: 3,
	  		  	label: "拼团未生效",
	  		  },
	  ],
      loadComplete: false // 没有加载数据前不显示的对应内容
    }
  },
  components: {
    paymentBox
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;

    this.setData({
      tapindex: options.sl ? options.sl : 1,
      page: 1,
      rows: 10,
      orderlist: [],
      type: options.type ? options.type : 0,
      kindId: options.kind_id ? options.kind_id : 1201
    });

    if (this.kindId == 1201) {
      uni.setNavigationBarTitle({
        title: this.__('我的订单')
      });
    } else {
      uni.setNavigationBarTitle({
        title: this.__('我的预约')
      });
    }

    var t = this;
    this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);
    this.getOrderlist()
  },

  onShow() {
    // 刷新评论
    uni.$on('refreshComment', (data) => {
      let orderlist = this.orderlist;
      for (var i = 0; i < orderlist.length; i++) {
        if (orderlist[i].order_id == data) {
          orderlist[i].order_buyer_evaluation_status = 1
        }
      }
    });
  },

  onUnload: function () {
    //移除通知
    // 离开页面，注销事件
    var that = this
    this.notice.removeNotification("RefreshMessage", that);


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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderlist();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    RefreshMessage: function (e) {
      this.setData({
        tapindex: 1,
        page: 1,
        rows: 10,
        orderlist: [],
        ispage: true,
        flag: true,
        type: 0,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    allOrders: function () {
      this.setData({
        tapindex: 1,
        page: 1,
        rows: 10,
        orderlist: [],
        ispage: true,
        flag: true,
        type: 0,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    toBePaid: function () {
      this.setData({
        tapindex: 2,
        page: 1,
        rows: 10,
        orderlist: [],
        ispage: true,
        flag: true,
        type: this.StateCode.ORDER_STATE_WAIT_PAY,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    toBeShipping: function () {
      this.setData({
        tapindex: 5,
        page: 1,
        rows: 10,
        orderlist: [],
        ispage: true,
        flag: true,
        type: this.StateCode.ORDER_STATE_WAIT_SHIPPING,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    receiptOfGoods: function () {
      this.setData({
        tapindex: 3,
        page: 1,
        rows: 10,
        ispage: true,
        flag: true,
        orderlist: [],
        type: this.StateCode.ORDER_STATE_SHIPPED,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    toBeEvaluated: function () {
      this.setData({
        tapindex: 4,
        page: 1,
        rows: 10,
        ispage: true,
        flag: true,
        orderlist: [],
        type: this.StateCode.ORDER_STATE_FINISH,
        kindId: this.kindId,
        loadComplete: false
      }), this.getOrderlist()
    },
    scrollbottom: function () {
      if (this.flag) {
        var that = this;
        that.setData({
          flag: false
        });

        clearTimeout(t);
        var t = setTimeout(function () {
          that.setData({
            order_state_id: that.type,
            flag: false,
            page: parseInt(that.page) + 1,
            rows: 10
          });

          that.getOrderlist()
        }, 100)
      }
    },
    getLabelByValue(value) {
      const state = this.plantformInfo.order_state_list.find((item) => item.value === value);
      //return state ? state.label : '';
	  let orderStateMap = {
	  	2010 : this.__("待支付"),
	  	2011  : this.__("待订单审核"),
	  	2013  : this.__("待财务审核"),
	  	2020  : this.__("待出库"),
	  	2030 : this.__("待发货"),
	  	2040 : this.__("待收货"),
	  	2060 : this.__("交易完成"),
	  	2070   : this.__("交易取消")
	  }
	  
	  return orderStateMap[value] || (state ? state.label : '')
    },
	getEnableByValue(value) {
	  const state = this.enableOpinion.find((item) => item.value === value);
	  return state ? state.label : '';
	},
    getOrderlist: function () {
      var that = this;
      var params = {
        page: that.page,
        size: that.rows,
        order_state_id: that.type,
        kind_id: that.kindId
      };

      that.$.request({
        url: this.Config.URL.user.order_lists,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status && data.items.length > 0) {
            /*
            const orderStates = [that.StateCode.ORDER_STATE_WAIT_PAY, that.StateCode.ORDER_STATE_WAIT_REVIEW, that.StateCode.ORDER_STATE_WAIT_FINANCE_REVIEW, that.StateCode.ORDER_STATE_PICKING, that.StateCode.ORDER_STATE_WAIT_SHIPPING];

            for (var i = 0; i < data.items.length; i++) {
              if (that.$.inArray(orderStates, data.items[i].order_state_id)) {
                data.items[i].if_buyer_cancel = true;
              } else {
                data.items[i].if_buyer_cancel = false;
              }
            }
            */

            if (data.page >= data.total) {
              that.setData({
                flag: false,
                ispage: false,
                orderlist: that.orderlist.concat(data.items)
              })
            } else {
              that.setData({
                flag: true,
                ispage: true,
                orderlist: that.orderlist.concat(data.items)
              })
            }

            that.setData({
              isdata: true,
              loadComplete: true
            })

          } else {
            that.setData({
              flag: false,
              ispage: false,
              isdata: false,
              loadComplete: true
            })
          }
        },
        fail: function (data) {
          that.setData({
            loadComplete: true
          });
          that.$.alert("网络异常请重试！");
        }
      });
    },
    cancelOrder: function (e) {
      var that = this
      var params = {
        order_id: e.currentTarget.dataset.on
      };
      that.$.confirm(that.__("是否取消订单"), function (e) {
        if (e.confirm) {
          that.$.request({
            url: that.Config.URL.user.order_cancel,
            method: "POST",
            data: params,
            success: function (data, status, msg, code) {
              if (status == 200) {
                that.$.alert("取消成功！", function () {
                  that.setData({
                    orderlist: [],
                    page: 1
                  });
                  that.getOrderlist();
                });
              }
            }
          });
        }
      }, true)
    },
    writeOrder: function (e) {
      var that = this;
      var params = {
        order_id: e.currentTarget.dataset.on
      };

      that.$.confirm("是否核销订单？", function (e) {
        if (e.confirm) {
          that.$.request({
            url: that.Config.URL.user.order_receive,
            data: params,
            success: function (data, status, msg, code) {
              if (status == 200) {
                that.$.alert("核销成功！", function () {
                  that.setData({
                    orderlist: [],
                    page: 1,
                    receiveMsg: msg
                  });
                  that.getOrderlist();
                });
              } else {
                (that.setData({
                  show: true
                }), setTimeout(function () {
                  that.setData({
                    show: false
                  })
                }, 2e3)), that.getOrderlist()
              }
            }
          });
        }

      }, true)
    },
    confirmReceipt: function (obj) {
      var params = {
        order_id: obj.currentTarget.dataset.on
      };

      var that = this;
      that.$.confirm(that.__("是否确认收货？"), function (e) {
        if (e.confirm) {
          that.$.request({
            url: that.Config.URL.user.order_receive,
            method: "POST",
            data: params,
            success: function (data, status, msg, code) {
              if (status == 200) {
                that.$.alert(that.__("收货成功！"), function () {
                  that.setData({
                    orderlist: [],
                    page: 1
                  });
                  that.getOrderlist();
                });
              } else {
                that.$.showModal({title: "提示", showCancel: !1, content: msg});
              }
            }
          });
        }

      }, true)
    },
    gotopay: async function (e) {
      var that = this;

      await that.$store.dispatch(`getUserInfo`, function (userIfo) {

      })

      that.setData({
        order_id: e.currentTarget.dataset.on,
        'paymentData': {
          order_id: e.currentTarget.dataset.on,
          order_money_amount: e.currentTarget.dataset.order_payment_amount,

          user_money: this.userInfo.user_money,
          user_points: this.userInfo.user_points,
          user_recharge_card: this.userInfo.user_recharge_card,
          user_sp: this.userInfo.user_sp
        }
      });

      this.$refs.paymentBox.show();
      return true;


      this.setData({
        formId: e.detail.formId
      });
      var param = {
        order_id: e.currentTarget.dataset.on,
        openid: this.userInfo.openId,
        typ: 'json',
        payment_channel_code: 'wx_native',
        prepay_flag: 1
      };

      that.$.request({
        url: this.Config.URL.pay.pay,
        data: param,
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              "package": data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: function () {
                that.sendMessage(e.currentTarget.dataset.on), that.$.alert(that.__("支付成功！"), function () {
                  that.setData({
                    orderlist: [],
                    page: 1
                  }), that.getOrderlist()
                })
              },
              fail: function (e) {
                // that.$.alert(that.__("支付成功！"), e)
              }
            })
          } else {
            that.$.alert(msg)
          }
        },

        fail: function (err) {
        }
      });
    },

    onCancel: function (e) {
      return
    },
    onPaid: function (e) {
      let that = this
      that.$.alert(that.__('支付成功'), function () {
        that.$.gotopage("/member/order/detail?on=" + e.order_id)
      }, 2000)

      if (this.$refs.paymentBox.showBoxView) {
        this.$refs.paymentBox.cancel();
      }
    },
    onFail: function (e) {
    },

    sendMessage: function (order_id) {
      let that = this;
      var params = {
        api: orderapi.OrderPaySuccessWXMessage,
        pages: "/member/order/detail?on=" + order_id,
        formId: this.formId,
        WeiXinOpenId: this.userInfo.openId,
        value: {
          order_id: order_id
        }
      };
      that.$.sendTpl(params)
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/_variables";

.m-navbar-item {
  padding: 20rpx 0;
  font-size: 28rpx;
}

.m-navbar-item:after {
  border: none;
}

.m-navbar-item.m-navbar-item-on {
  background-color: #fff;
  color: $default-skin-bg;
}

.m-navbar-item.m-navbar-item-on::before {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 6rpx;
  border-bottom: 6rpx solid $default-skin-bg;
  color: #CCCCCC;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 3;
}

.m-panel-hd label {
  float: right;
  color: $default-skin-bg;
  font-size: 26rpx;
}

.m-total-info {
  text-align: right;
  padding: 10rpx 38rpx;
  font-size: 24rpx;
}

.m-total-info label {
  font-size: 32rpx;
  color: $default-skin-bg;
}

.m-total-info text {
  font-size: 24rpx;
  color: $default-skin-bg;
}

.m-total-btn {
  text-align: right;
  padding: 20rpx 20rpx 20rpx 20rpx;
  position: relative;
}

.m-total-btn::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #ebebe7;
  color: #ebebe7;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.m-total-btn .u-link-btn {
  margin: 0 10rpx;
  vertical-align: middle;
  display: inline-block;
  line-height: 40rpx;
  background-color: #fff;

  font-size: 24rpx;
}

.m-sort {
  position: relative
}

.m-sort image {
  width: 24rpx;
  height: 24rpx;
  position: absolute;
  /*top: 50%;*/
  margin-top: 10rpx;
  margin-left: 2rpx;
}

.m-product-price text {
  font-size: 24rpx;
  color: #999999;
  margin-left: 6rpx
}

.m-tab {
  position: fixed;
  width: 100%;
  top: var(--window-top);
  z-index: 2;
}

.m-orderlist {
  padding-top: 84rpx;
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}


.u-tuan-label {
  padding: 5rpx;
  background-color: $default-skin-bg;
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #fff;
  margin-right: 5rpx;
}

.alert {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  padding: 0 40rpx;
  position: absolute;
  left: 10%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  align-items: center;
  z-index: 999;
}

.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 998
}

.m-product-name {
  font-size: 24rpx;
}

.m-product-img {
  image {
    padding: 10rpx;
  }
}

.m-product-item {
  margin-top: 0rpx;
}

.scroll-view_H {
  width: 100%;
  white-space: nowrap;

  height: 84rpx;

  .m-navbar-item {
    display: inline-block;
    padding-left: 20rpx;
    padding-right: 20rpx;

    /*min-width:110rpx;*/
    min-width: 150rpx;
    min-width: 108rpx;
  }
}

</style>
