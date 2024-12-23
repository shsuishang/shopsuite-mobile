<template>
  <view class="page  page-container">
    <view class="move-area" v-if="isdata">
      <movable-view v-if="(orderInfo.IsRedPacketIcon)" inertia class="move-img" direction="all" @click='isShowRPK'>
        <image lazy-load src="https://static.shopsuite.cn/xcxfile/appicon/rpk_min.png"></image>
      </movable-view>

      <view class="m-cell"
            v-if="remainPayTime > 0 && orderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && orderInfo.order_state_id==StateCode.ORDER_STATE_WAIT_PAY && orderInfo.order_payment_amount == orderInfo.consume_trade.trade_payment_amount">
        <view class="m-cell-bd" style="text-align: center;">
          <text>{{ __('订单取消倒计时') }}
            <text style="color: red;padding:0 10rpx"> {{ remainPayTimeStr }}</text>
          </text>
        </view>
      </view>

      <view class="m-cells">

        <view class="m-cell ">
          <view class="m-cell-bd">
            <text>{{ sprintf(__('编号：%s'), orderInfo.order_id) }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">
			<label v-if="orderInfo.activity_groupbooking_history" style="margin-right: 10rpx;">
				{{ getEnableByValue(orderInfo.activity_groupbooking_history.gb_enable) }}
			</label>
			<label v-if="(orderInfo.order_state_id == 2020 || orderInfo.order_state_id == 2030) && orderInfo.order_is_shipped == 3031">
				{{ __('部分发货') }}
			</label>
			<label v-else>
				{{ getLabelByValue(orderInfo.order_state_id) }}
			</label>
		  </view>
        </view>
        <view>

          <navigator v-for="(logistics_item, i) in orderInfo.logistics" :key="i"
                     :url="'/member/order/logistics?on=' + (orderInfo.order_id) + '&express_id=' + (logistics_item.express_id) + '&express_name=' + '&logistics_id=' + (logistics_item.logistics_id) + '&express_name=' + (logistics_item.express_name) + '&logistics_number=' +(logistics_item.logistics_number) + '&tracking_number=' + (logistics_item.order_tracking_number) + '&order_logistics_id=' + (logistics_item.order_logistics_id)">
            <view class="m-cell m-cell-access">
              <view class="m-cell-bd">
                <text>{{
                    sprintf(__('物流信息： %s %s'), logistics_item.express_name || "", logistics_item.order_tracking_number || "")
                  }}
                </text>
              </view>
              <view class="m-cell-ft">
              </view>
            </view>
          </navigator>

          <!--厂家自送 其他配送-->
          <view v-if="(orderInfo.LogisticsKey=='VENDOR'||orderInfo.LogisticsKey=='OTHER')">
            <view class="m-cell">
              <view class="m-cell-bd">
                <text>{{ sprintf(__('送货人：%s %s'), orderInfo.LogisticCode, orderInfo.Shipper) }}</text>
              </view>
            </view>
          </view>
          <view v-if="(orderInfo.LogisticsKey=='CLIENT')">
            <view class="m-cell">
              <view class="m-cell-bd">
                <text>{{ sprintf(__('提货人：%s %s'), orderInfo.LogisticCode, orderInfo.Shipper) }}</text>
              </view>
            </view>
          </view>
        </view>


        <!-- 是否需要发货 -->
        <view class="m-addres-info"
              v-if="(orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_EXP && orderInfo.delivery)">
          <view class="m-ad-name">
            <text>{{ orderInfo.delivery.da_name }}</text>
            <text>{{ orderInfo.delivery.da_mobile }}</text>
          </view>
          <view class="m-ad-address">
            <text>{{ orderInfo.delivery.da_province }}/{{ orderInfo.delivery.da_city }}/{{
                orderInfo.delivery.da_county
              }}
              {{ orderInfo.delivery.da_address }}
            </text>
          </view>
        </view>

        <view class="massage"
              v-if="orderInfo.delivery && orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_SELF_PICK_UP"
              style="align-items: center;justify-content: space-between">
          <view class="massage-name">
            {{ sprintf(__('预约人：%s'), orderInfo.delivery.da_name) }}
          </view>
          <view class="massage-tel" style="margin-right:30rpx">
            {{ sprintf(__('电话：%s'), orderInfo.delivery.da_mobile) }}
          </view>
        </view>

        <view class="code1"
              v-if="(((orderInfo.kind_id != 1201 && orderInfo.kind_id != 1205) || orderInfo.chain_id || orderInfo.chain_code)&&orderInfo.order_is_paid==3013)"
              style="background:#fff;padding-bottom:20rpx">

          <image lazy-load :src="(orderInfo.virtual_qrcode)" :data-src="(orderInfo.virtual_qrcode)"
                 style="width:375rpx;height:375rpx" @click="previewProductImg"></image>
          <text v-if="orderInfo.chain_code">{{ sprintf(__('服务码：%s'), orderInfo.chain_code) }}</text>
        </view>

      </view>


      <view class="m-cells total-info" v-if="(orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_SELF_PICK_UP)">
        <view class="m-cell" v-if="(orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_SELF_PICK_UP)">
          <view class="m-cell-bd">
            <text>{{ __('商家电话') }}</text>
          </view>
          <view @click="call" style="display:flex">
            <image lazy-load src="/static/images/call.png" style="width:30rpx;height:30rpx;margin-right:10rpx"></image>
            <view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{ orderInfo.chain_mobile }}</view>
          </view>
        </view>
        <view class="m-cell" v-if="(orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_SELF_PICK_UP)"
              style="display:flex;flex-flow: row;justify-content: space-between;align-items: stretch">
          <view class="m-cell-bd" style="flex: 0 1 20%;">
            <text>{{ __('商家地址') }}</text>
          </view>

          <view style="display:flex;float: right;">
            <view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{ orderInfo.chain_address }}</view>
          </view>
        </view>

        <view class="m-cell">
          <view class="m-cell-bd">
            <text>{{ __('自提日期') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">{{ orderInfo.virtual_service_date }}</view>
        </view>
      </view>


      <view class="m-product-all m-cells">
        <view class="m-product-list">
          <navigator v-for="(item, i) in orderInfo.items" :key="i"
                     :url="(orderInfo.kind_id == 1201 ? '/pagesub/product/detail?id=' : (orderInfo.kind_id == 1205 ? '/edu/course/detail?item_id=' : '/pagesub/product/detail?id=')) + (item.item_id)"
                     class="m-product-item">
            <view class="m-product-img">
              <image lazy-load :src="(item.order_item_image)" mode="aspectFill"/>
            </view>
            <view class="m-product-info">
              <view class="m-product-name">
                <label>
                  {{ item.product_name }}</label>
                <label class="m-min-name"
                       style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
                  {{ item.item_name ? item.item_name : "" }}
                </label>
              </view>
              <view class="m-product-price">
                <block v-if="item.order_item_sale_price">
                  <label class="mcs">{{ __('￥') }}</label>{{ item.order_item_sale_price }}
                </block>
                <label class="pre-info-price" v-if="(item.item_save_price)" style="padding: 0 8rpx;color: #b0b0b0;">
                  <text class="mcs" style="font-size:12px;color: #b0b0b0;">-{{ __('￥') }}</text>
                  {{ number_format(item.item_save_price, 2) }}
                </label>

                <block v-if="item.item_unit_points">
                  <label style="margin: auto 10rpx;">+</label>{{ item.item_unit_points }}{{ __('积分') }}
                </block>

                <block v-if="item.item_unit_sp">
                  <label style="margin: auto 10rpx;">+</label>{{ item.item_unit_sp }}{{ __('众宝') }}
                </block>

                <text style="float: right;margin-right: 60rpx;">x{{ item.order_item_quantity }}</text>

                <navigator @click.stop
                           :url="'/member/product/return?order_id=' + (item.order_id) + '&order_item_id=' + (item.order_item_id)"
                           v-if="(!distFlag && item.if_return)" class="u-link-btn hide" style="line-height:30rpx;">
                  {{ __('退货') }}
                </navigator>
                <navigator @click.stop v-for="(return_id, j) in item.return_ids" :key="j" @click.stop :url="'/member/member/returndetail?return_id=' + (return_id)"
                           v-if="(return_id)" class="u-link-btn hide" style="line-height:30rpx;">{{ __('售后详情') }}
                </navigator>

              </view>

            </view>
          </navigator>
        </view>
		<!-- #ifdef MP-WEIXIN -->
        <block v-if="imEnable">
        <view class="link_kfu" @click="goKefu">
          <!-- #ifdef MP-WEIXIN -->
          <block v-if="1==plantformInfo.kefu_type_id">
            <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
          </block>
          <!-- #endif -->

          <label class="iconfont icon-more"></label>
          <text class="kfu_txt">联系客服</text>
        </view>
        </block>
        <!-- #endif -->
      </view>
      <view v-if="(orderInfo.order_message)">
        <view class="m-cells-title">{{ __('备注') }}</view>
        <view class="m-cells m-cells-form">
          <view class="m-cell">
            <view class="m-cell-bd">
              {{ orderInfo.order_message }}
            </view>
          </view>
        </view>
      </view>
      <view class="m-cells total-info">
        <view class="m-cell" v-if="(orderInfo.kind_id != 1201)">
          <view class="m-cell-bd">
            <text style="">{{ __('预约时间') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt" style="color:#000">{{ orderInfo.virtual_service_time }}</view>
        </view>
        <view class="m-cell" v-if="(orderInfo.kind_id != 1201 && orderInfo.chain_id)">
          <view class="m-cell-bd">
            <text>{{ __('商家电话') }}</text>
          </view>
          <view @click="call" style="display:flex">
            <image lazy-load src="/static/images/call.png" style="width:30rpx;height:30rpx;margin-right:10rpx"></image>
            <view class="m-cell-ft m-order-typetxt" style="color:#17abe3"> {{ orderInfo.chain_mobile }}</view>
          </view>
        </view>
        <view class="m-cell" v-if="(orderInfo.kind_id != 1201 && orderInfo.chain_id)"
              style="display:flex;flex-flow: column;justify-content: space-between;align-items: stretch">
          <view class="m-cell-bd">
            <text>{{ __('商家地址') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt" style="color:#717171;text-align:left;margin-top:20rpx">
            {{ orderInfo.chain_address }}
          </view>
        </view>
        <view class="m-cell">
          <view class="m-cell-bd">
            <text>{{ __('商品总额') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">
            <text>{{ __('￥') }}</text>
            {{ orderInfo.order_product_amount }}
          </view>
        </view>

        <!-- todo 会员折扣等级 -->
        <view class="m-cell" v-if="(0 && !(orderInfo.LevelDiscount==0))">
          <view class="m-cell-bd">
            <text>{{ __('会员折扣') }}</text>
            <text style="font-size:24rpx;color:#717171">{{ sprintf(__('%s折'), orderInfo.MomentMemberDiscount) }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-
            <text>{{ __('￥') }}</text>
            {{ orderInfo.LevelDiscount }}
          </view>
        </view>
        <view class="m-cell" v-if="orderInfo.order_points_fee">
          <view class="m-cell-bd">
            <text>{{ __('积分') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-{{ orderInfo.order_points_fee }} {{ __('积分') }}</view>
        </view>
        <!-- todo 积分抵现 -->
        <view class="m-cell" v-if="false && orderInfo.order_resource_ext1">
          <view class="m-cell-bd">
            <text>{{ __('积分') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-{{ orderInfo.order_resource_ext1 }} {{ __('积分') }}</view>
        </view>

        <view class="m-cell" v-if="orderInfo.order_resource_ext2">
          <view class="m-cell-bd">
            <text>{{ __('众宝') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-{{ orderInfo.order_resource_ext2 }} {{ __('众宝') }}</view>
        </view>


        <view class="m-cell" v-if="(0 && !(orderInfo.PointAsCash==0))">
          <view class="m-cell-bd">
            <text>{{ __('积分抵现') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-
            <text>{{ __('￥') }}</text>
            {{ orderInfo.PointAsCash }}
          </view>
        </view>
        <view class="m-cell" v-if="(0 && deduction>0)">
          <view class="m-cell-bd">
            <text>{{ __('余额抵扣') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">-
            <text>{{ __('￥') }}</text>
            {{ deduction }}
          </view>
        </view>
        <view class="m-cell" v-if="(1 || orderInfo.delivery_type_id == StateCode.DELIVERY_TYPE_EXP)">
          <view class="m-cell-bd">
            <text>{{ __('运费') }}</text>
          </view>
          <view class="m-cell-ft m-order-typetxt">+
            <text>{{ __('￥') }}</text>
            {{ orderInfo.order_shipping_fee }}
          </view>
        </view>
        <view class="m-cell tbt">
          <view class="m-cell-bd">
          </view>
          <view class="m-cell-ft m-total-info">
            <view>
              {{ __('总金额') }}：
              <label class="m-total-price">
                <text>{{ __('￥') }}</text>
                {{ orderInfo.order_payment_amount }}</label>
            </view>
            <view>
              {{ __('待付款') }}：
              <label class="m-total-price">
                <text>{{ __('￥') }}</text>
                {{ orderInfo.consume_trade.trade_payment_amount }}</label>
            </view>
            <view class="m-total-time">{{ sprintf(__('下单时间：%s'), orderInfo.order_time) }}</view>
          </view>

        </view>
        <view style="height:108rpx;">
        </view>
      </view>
      <view class="u-cleanbox"></view>
    </view>
    <view class="m-footer-btn"
          v-if="!distFlag && isdata && (orderInfo.if_buyer_cancel || orderInfo.order_state_id == 2060 || orderInfo.order_state_id == 2030 || orderInfo.order_state_id == 2020   || orderInfo.order_state_id == StateCode.ORDER_STATE_SHIPPED  || (orderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && orderInfo.order_state_id!=StateCode.ORDER_STATE_CANCEL))">
      <navigator :url="'/member/product/comment?od=' + (orderInfo.order_id)"
                 v-if="(orderInfo.order_buyer_evaluation_status == 0 && orderInfo.order_state_id == 2060)"
                 class="u-link-btn">{{ __('去评价') }}
      </navigator>
      <navigator :url="'/member/product/comment?od=' + (orderInfo.order_id)"
                 v-if="(orderInfo.order_buyer_evaluation_status == 1 && orderInfo.order_state_id == 2060)"
                 class="u-link-btn">{{ __('查看评价') }}
      </navigator>
      <form report-submit="true" @submit="gotopay">
        <button :data-on="(orderInfo.order_id)"
                v-if="(orderInfo.order_is_paid  != StateCode.ORDER_PAID_STATE_YES && orderInfo.order_state_id!=StateCode.ORDER_STATE_CANCEL)"
                class="u-link-btn" formType="submit">{{ __('去支付') }}
        </button>
      </form>

      <block v-if="orderInfo.if_buyer_cancel">
        <view :data-on="(orderInfo.order_id)" v-if="(!orderInfo.activity_groupbooking_history)" class="u-link-btn" @click="cancelOrder">
          {{ __('取消订单') }}
        </view>
        <view :data-on="(orderInfo.order_id)" v-else-if="(orderInfo.activity_groupbooking_history && (!orderInfo.activity_groupbooking_history.gbh_flag || 1==orderInfo.activity_groupbooking_history.gb_enable))" class="u-link-btn" @click="cancelOrder">
          {{ __('取消订单') }}
        </view>
      </block>

      <view :data-on="(orderInfo.order_id)"
            v-if="(orderInfo.kind_id==1201 && orderInfo.order_state_id == StateCode.ORDER_STATE_SHIPPED)"
            class="u-link-btn"
            @click="confirmReceipt">{{ __('确认收货') }}
      </view>
    </view>

    <view
        v-if="false && orderInfo.order_state_id >2010 && orderInfo.order_state_id!=2040 && orderInfo.order_state_id != 2070 && orderInfo.order_refund_amount == 0 && orderInfo.order_is_paid == StateCode.ORDER_PAID_STATE_YES"
        class="m-footer-btn">
      <view class="u-link-btn"
            v-if="orderInfo.kind_id==1201"
            @click="applyCancelOrder(orderInfo)">
        {{ __('申请取消订单') }}
      </view>
    </view>
    <!--<template is="shareMskTpl" data="(PageQRCodeInfo)"/>-->
    <view class="share-rpk " v-if="(showRPK && orderInfo.IsRedPacketIcon)" @click='isShowRPK'>
      <view class="share-rpkbox (showRPK?'animated bounceIn':'animated bounceOut')" catchtap
            style='background:url(https://static.shopsuite.cn/xcxfile/appicon/rpk_box.png) no-repeat;background-size: cover;'>
        <view class="send-rpk" catchtap='shareBox'></view>
        <view class="close-rpk" catchtap='isShowRPK'></view>
      </view>
    </view>
    <view class="m-loading-box">
      <block v-if="(!orderInfo)">
        <view class="u-loadmore">
          <label class="u-loading"></label>
          <text class="u-loadmore-tips">{{ __('正在加载') }}</text>
        </view>
        <view>
          <text></text>
        </view>
      </block>
    </view>


    <payment-box :paymentDataDefault="paymentData" :order_id="orderId" ref="paymentBox" @onCancel="onCancel"
                 @onPaid="onPaid" @onFail="onFail"></payment-box>
  </view>
</template>

<script>

import paymentBox from '../../components/payment-box.vue'


import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      options: {},
	  imEnable:0,
      orderInfo: {delivery: {}},
      formId: "",
      showRPK: true,
      activityGroupId: 0,
      maxRPK: 0,
      deduction: 0,
      isdata: false,
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
      orderId: "",
      paymentData: {},
      distFlag: false,

      remainPayTime: 0,
      remainPayTimeStr: '--:--:--',
      remainTime: false
    }
  },
  components: {
    paymentBox
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('订单详情')
    });

    let that = this;

    this.setData({
      options: options,
      distFlag: options.dist_flag ? true : false,
    });


    this.getPlantformInfo(function (plantformInfo) {
      that.setData({
        imEnable: plantformInfo.im_enable
      })
    });

    if (that.$.isNull(this.userInfo)) {
      that.forceUserInfo(function (user) {
        that.initPage(options)
      });
    } else {
      that.initPage(options)
    }

    this.notice.addNotification("RefreshMessage", this.RefreshMessage, this);
  },
  onShow: function () {
    //this.initPage(this.options)
  },
  onUnload: function () {
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

    var that = this
    that.notice.removeNotification("RefreshMessage", that);
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    goKfu: function (e) {
      let that = this;
      //先判断是否登录
      let ProductInfo = that.orderInfo.items[0];
      this.forceUserInfo(function (user) {
        var t = e.currentTarget.dataset;
        var url = that.Config.kefu + "/im_client/?web_plugin_id=24775";
        url = url + "&product_send=true&product_title=" + ProductInfo.product_name + "&product_订单号=" + ProductInfo.order_id + "&product_价格=" + ProductInfo.order_item_amount + "&product_image=" + ProductInfo.order_item_image;
        that.$.gotopage(
            '/pagesub/webpage/webpage?u=' + encodeURIComponent(url)
        );
      });
    },

    goKefu: function (e) {
      let that = this;
      let ProductInfo = that.orderInfo.items[0];

      if (1 == that.plantformInfo.kefu_type_id) {
        // #ifdef MP-WEIXIN
        return;
        // #endif
      }

      //先判断是否登录
      this.forceUserInfo(function (user) {
        var t = e.currentTarget.dataset;
        //that.$.gopage(t.appurl);

        that.$.request({
          url: that.Config.URL.user.kefu_config,
          data: {user_id: that.orderInfo.buyer_user_id, store_id: that.orderInfo.store_id},
          loading: false,
          success: function (rd, r_status, r_msg, code) {
            if (r_status == 200) {
              let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&order_id=%s", rd.friend_id, ProductInfo.order_id);

              that.$.gopage(chat_url);
            } else {
              that.$.alert(r_msg);
            }
          }
        });
      });

      return;
    },

    call: function () {
      let that = this;
      that.$.makePhoneCall({
        phoneNumber: this.orderInfo.chain_mobile + ""
      })
    },

    getLabelByValue(value) {
      const state = this.plantformInfo.order_state_list.find((item) => item.value === value);
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

    RefreshMessage: function (e) {
      this.initPage(this.options)
    },

    touchstart() {
      let that = this;
      that.remainTime = setInterval(() => {
        //console.log(this.money);
        if (that.remainPayTime <= 0) {
          clearInterval(this.remainTime);
        }
        that.remainPayTime--;

        let hours = that.$.doubleNum(Math.floor(that.remainPayTime / 60 / 60));
        let minutes = that.$.doubleNum(Math.floor(that.remainPayTime / 60 % 60));
        let seconds = that.$.doubleNum(Math.floor(that.remainPayTime % 60));
        that.remainPayTimeStr = hours + ':' + minutes + ':' + seconds
      }, 1000);
    },
    touchend() {
      clearInterval(this.remainTime);
    },

    initPage: function (options) {
      var params = {
            user_id: this.userInfo.user_id,
            order_id: options.on
          },
          that = this;
      that.touchend();
      that.$.request({
        url: this.Config.URL.user.order_detail,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {
            data.order_time = that.$.formatDateFormatter(data.order_time, 'yyyy-MM-dd hh:mm:ss')
			data.virtual_service_date = that.$.formatDateFormatter(data.virtual_service_date, 'yyyy-MM-dd')
            if (data.chain_code) {
              const virtual_qrcode = that.$.sprintf('%s/front/sys/config/getQrcode?code=%s&w=%d&h=%d', that.Config.SiteUrl, data.chain_code, 450, 450);
              data.virtual_qrcode = virtual_qrcode;
            }

            const orderStates = [that.StateCode.ORDER_STATE_WAIT_PAY, that.StateCode.ORDER_STATE_WAIT_REVIEW, that.StateCode.ORDER_STATE_WAIT_FINANCE_REVIEW, that.StateCode.ORDER_STATE_PICKING, that.StateCode.ORDER_STATE_WAIT_SHIPPING];

            if (that.$.inArray(orderStates, data.order_state_id)) {
              data.if_buyer_cancel = true;
            } else {
              data.if_buyer_cancel = false;
            }

            that.setData({
              isdata: true,
              orderInfo: data,
              deduction: 0,
              remainPayTime: data.remain_pay_time ? data.remain_pay_time : 0
              //(e.Info[0].ECardCash + e.Info[0].ExtraCash).toFixed(2)
              // 余额折扣？
            })
            if (that.remainTime === false) {
              that.touchstart();
            }

            //支付跳转订单
            if (that.options.init_pay_flag && parseInt(that.options.init_pay_flag)) {
              //如果未支付
              if (data.order_is_paid != that.StateCode.ORDER_PAID_STATE_YES && data.order_state_id==that.StateCode.ORDER_STATE_WAIT_PAY) {
                that.$.showModal({
                  title: that.__('提示'),
                  content: that.__('在线支付状态有延迟，是否重试？'),
                  success: res => {
                    if (res.confirm) {
                      let redirect_url = '/member/order/detail?on=' + options.on + '&init_pay_flag=1';
                      that.$.gotopage(redirect_url);

                      //window.location.href = redirect_url;
                    } else if (res.cancel) {
                    }
                  }
                });
              } else {
         
              }

            }
          }
        }
      });
      /* 红包活动分享 var t = {store_id: this.shopInfo.Id, sponsorId: this.userInfo.Id, order_id: options.on};
      that.$.xsr(that.$.makeUrl(orderapi.PrepareShareLuckyRedPacket, t), function (e) {
          that.setData({maxRPK: e.Info.LuckyOrder, activityGroupId: e.Info.LuckyRedPacketactivityGroupId})
      })*/
    },
    applyCancelOrder: function (orderInfo) {
      let that = this;
      uni.navigateTo({
        url: "/pagesub/product/return?order_id=" + (orderInfo.order_id) + "&order_state=" + (orderInfo.order_state_id)
      });
    },
    cancelOrder: function (e) {
      let that = this;
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
                  if (200 == status) {
                    that.$.alert("取消成功！", function () {
                      setTimeout(function () {
                        that.notice.postNotificationName("RefreshMessage", e)
                      }, 1500)

                      /*
that.$.navigateBack(1, function() {
  var e = {};
  that.notice.postNotificationName("RefreshMessage", e)
})
                      */
                    })
                  } else {
					   that.$.showModal({title: "提示", showCancel: !1, content: msg});
				  }
                }
              });
            }
          },
          true)
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
                  that.notice.postNotificationName("RefreshMessage", e)
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
        orderId: that.orderInfo.order_id,
        'paymentData': {
          order_id: that.orderInfo.order_id,
          order_money_amount: that.orderInfo.consume_trade.trade_payment_amount,

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
            order_id: this.orderInfo.order_id,
            openid: this.userInfo.openId,
            typ: 'json',
            payment_channel_code: 'wx_native',
            prepay_flag: 1
          },
          that = this;


      that.$.request({
        url: this.Config.URL.pay.pay,
        data: param,
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.requestPayment({
              timeStamp: data.timeStamp + '',
              nonceStr: data.nonceStr,
              "package": data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: function (e) {
                that.sendMessage(that.orderInfo.order_id);

                that.$.alert(that.__("支付成功！"), function () {
                  that.$refs.paymentBox.cancel();
                  that.initPage(that.options);

                  that.notice.postNotificationName("RefreshMessage", e)
                  /*
that.$.navigateBack(1, function() {
var e = {};
that.notice.postNotificationName("RefreshMessage", e);
})
                  */
                })
              },
              fail: function (e) {
                that.$.alert(that.__('支付失败！'))
                //console.log("支付失败：", e)
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
      let that = this;

      that.$.alert(that.__("支付成功！"), function () {
        that.$refs.paymentBox.cancel();
        that.initPage(that.options);

        that.notice.postNotificationName("RefreshMessage", e)
        /*
        that.$.navigateBack(1, function() {
            var e = {};
that.notice.postNotificationName("RefreshMessage", e)
        })
        */
      })
    },
    onFail: function (e) {
      let that = this;
      that.$.alert(that.__('支付失败！'))
      //console.log("支付失败：", e)
    },

    sendMessage: function (e) {
      let that = this;
      var t = {
        api: orderapi.OrderPaySuccessWXMessage,
        pages: "/member/order/detail?on=" + e,
        formId: this.formId,
        WeiXinOpenId: this.userInfo.openId,
        value: {
          store_id: this.shopInfo.store_id,
          order_id: e
        }
      };
      that.$.sendTpl(t)
    },
    onShareAppMessage: function () {
      var that = this;
      return {
        title: "拼手气红包，第" + this.maxRPK + "个领取的红包最大!",
        imageUrl: "https://static.shopsuite.cn/xcxfile/appicon/shareImg.png",
        path: "pages/redpacket/redpacket?g=" + this.activityGroupId + "&n=" + this.maxRPK + "&uid=" + this.userInfo.Id,
        success: function () {
          that.$.xsr1(that.$.makeUrl(orderapi.ShareCount, {
            sponsorId: this.userInfo.Id,
            audienceType: 1,
            audienceId: 0,
            ContentType: 22,
            contentId: that.activityGroupId
          }), function (e) {
          })
        }
      }
    },
    shareQRCode: function (e) {
      var that = this,
          params = {
            store_id: this.shopInfo.Id,
            sponsorId: this.userInfo.Id,
            imageUrl: "https://static.shopsuite.cn/xcxfile/appicon/shareImg.png",
            path: "pages/redpacket/redpacket?g=" + this.activityGroupId + "&n=" + this.maxRPK + "&uid=" + this.userInfo.Id,
            luckyOrder: this.maxRPK
          };
      //生成二维码并返回地址。 - 需要修改调整为小程序地址
      that.$.request({
        url: this.Config.URL.wx.getMiniAppQRCodeUnlimit,
        data: params,
        success: function (data, status, msg, code) {
          that.setData({
            PageQRCodeInfo: {
              Path: data.url,
              IsShare: true,
              IsShareBox: false,
              IsJT: true
            }
          })
        }
      });
    },
    shareBox: function () {
      this.setData({
        PageQRCodeInfo: {
          Path: "",
          IsShare: true,
          IsShareBox: true,
          IsJT: false
        }
      })
    },
    cancelShare: function () {
      this.setData({
        PageQRCodeInfo: {
          Path: "",
          IsShare: false,
          IsShareBox: false,
          IsJT: false
        }
      })
    },
    saveImg: function () {
      var that = this;
      that.$.loading(), that.$.downloadFile({
        url: this.PageQRCodeInfo.Path,
        success: function (t) {
          that.$.hideloading(), that.$.saveImageToPhotosAlbum({
            filePath: t.tempFilePath,
            success: function () {
              that.setData({
                PageQRCodeInfo: {
                  Path: "",
                  IsShare: false,
                  IsShareBox: false,
                  IsJT: false
                }
              }), that.$.alert("保存图片成功！"), that.$.xsr1(that.$.makeUrl(orderapi.ShareCount, {
                sponsorId: this.userInfo.Id,
                audienceType: 3,
                audienceId: 0,
                ContentType: 22,
                contentId: that.activityGroupId
              }))
            },
            fail: function (e) {
              that.$.hideloading();
              that.$.alert("保存图片失败！");
            }
          })
        },
        fail: function (e) {
          that.$.hideloading()
        }
      })
    },
    showCodeImg: function () {
      let that = this;
      that.$.previewImage({
        current: this.PageQRCodeInfo.Path,
        urls: [this.PageQRCodeInfo.Path]
      })
    },
    isShowRPK: function () {
      var e = this;
      e.showRPK ? setTimeout(function () {
            e.setData({
              showRPK: false
            })
          },
          250) : e.setData({
        showRPK: true
      })
    },
    previewProductImg: function (e) {
      var that = this;
      var i = e.target.dataset.src;
      let n = [];

      n.push(i);
      //console.info(i);
      //console.info(n);
      that.$.previewImage({
        current: i,
        urls: n
      })
    }
  }
};
</script>


<style lang="scss">
@import "../../styles/_variables";

.m-cells {
  font-size: 28rpx;
  border-radius: 9px;
}

.link_kfu {
  position: relative;
  text-align: center;
  background-color: #fff;
  margin-top: 20rpx;
  height: 80rpx;
  line-height: 80rpx;

  .kfu_txt {
    margin-left: 20rpx;
  }
}

.m-order-typetxt {
  color: $default-skin-bg;
  font-size: 28rpx;

  text {
    font-size: 24rpx;
  }
}

.m-total-price {
  text {
    font-size: 24rpx;
  }
}


.m-addres-info {
  padding: 20rpx 0;
  background-color: white;
  overflow: hidden;
  position: relative;
  margin-top: 20rpx;
}

.m-ad-name {
  display: -webkit-box;
  position: relative;
  margin-left: 28rpx;
  -webkit-box-flex: 1;
  height: 20px;
  line-height: 20px;
  font-weight: 400;
  font-size: 14px;
}

.m-ad-name text {
  margin: 0 20rpx;
}

.m-ad-name::after {
  content: "\e7e0";
  position: absolute;
  left: -25rpx;
  width: 30rpx;
  height: 30rpx;
  font-family: "iconfont" !important;
  text-align: center;
  line-height: 35rpx;
  font-size: 60rpx;
  background-size: cover;
  top: 50%;
  margin-top: -14rpx;
}

.m-ad-address {
  width: 650rpx;
  margin-left: 8rpx;
  display: -webkit-box;
  -webkit-box-flex: 1;
  line-height: 40rpx;
  font-weight: 400;
  font-size: 12px;
  position: relative;
  padding-left: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #888;
}

.m-product-all {
  margin-top: 20rpx;
}

.total-info {
  margin-top: 20rpx;
}

.m-panel-hd::after {
  border: none;
}

.m-total-info {
  padding: 10rpx;
  font-size: 24rpx;
  color: #000;
}

.m-total-info label {
  font-size: 32rpx;
  color: $default-skin-bg;
}

.m-total-time {
  color: #888;
}

.m-footer-btn {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  text-align: right;
  box-sizing: border-box;
  padding: 20rpx;

  &:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #E5E5E5;
    color: #E5E5E5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

.u-link-btn {
  margin: 0 10rpx;
  vertical-align: middle;
  display: inline-block;
  line-height: 40rpx;

  font-size: 24rpx;
}

.m-product-price text {
  font-size: 12px;
  color: #888;
  background-color: #fff;

  &.mcs {
    font-size: 12px;
  }
}


.m-product-price label {

  &.mcs {
    font-size: 12px;
  }
}

.massage {
  width: 100%;
  height: 100rpx;
  display: flex;
  //border-bottom: 2rpx solid #d9d9d9;
  background: #fff;
  font-size: 28rpx;
  color: #000;
}

.massage-name {
  margin-left: 30rpx;
}

.massage-tel {
  margin-left: 40rpx;
}

.code1 {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  align-content: space-between;
}

.code image {
  width: 50%;
}

.code text {
  font-size: 24rpx;
  color: #717171;
}

.move-area {
  /*
  position: absolute;
  min-height: 100%;
  width: 100%;
  */
}

.move-img {
  height: 126rpx;
  width: 100rpx;
  z-index: 5;
  margin-top: 70%;
  margin-left: 650rpx;
}

.move-img image {
  height: 126rpx;
  width: 100rpx;
}

.share-rpk {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 5;
}

.share-rpkbox {
  width: 640rpx;
  height: 698rpx;
  background-color: red;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -320rpx;
  margin-top: -349rpx;
}

.send-rpk {
  width: 222rpx;
  height: 70rpx;
  position: absolute;
  left: 50%;
  margin-left: -100rpx;
  top: 50%;
  margin-top: 140rpx;
}

.close-rpk {
  width: 50rpx;
  height: 50rpx;
  position: absolute;
  left: 50%;
  margin-left: -22rpx;
  bottom: 25rpx;
}

.shareCodeImg {
  height: 800rpx;
}

.m-product-name {
  font-size: 24rpx;
}

.m-product-img {
  image {
    padding: 10rpx;
  }
}

.m-cell-access .m-cell-ft:after {
  margin-top: -8rpx;
}

.link_kfu contact-button {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>

