<template>
  <view style="overflow-x: hidden;" class="page-container">
    <view>
      <view v-if="(udId>0)" @click="selectAddress" class="m-addres-info m-cell-access">
        <view class="m-ad-name">
          <text>{{ submitOrderInfo.user_delivery_address.ud_name }}</text>
          <text style="padding: 0;margin:0;">{{ submitOrderInfo.user_delivery_address.ud_mobile }}</text>
        </view>
        <view class="m-ad-address" v-if="(addressFlag)">
          <text>
            {{ submitOrderInfo.user_delivery_address.ud_province }}/{{
              submitOrderInfo.user_delivery_address.ud_city
            }}/{{ submitOrderInfo.user_delivery_address.ud_county }}
            {{ submitOrderInfo.user_delivery_address.ud_address }}
          </text>
        </view>
        <view class="m-cell-ft"></view>
      </view>
      <view v-else class="m-addres-info m-cell-access" @click="selectAddress">
        <view class="m-ad-address u-null-ad" v-if="!isVirtual">
          <label class="iconfont icon-shouhuodizhi"></label>{{ __('你还没有收货地址,马上') }}
          <text>{{ __('添加') }}</text>
        </view>
        <view class="m-ad-address u-null-ad" v-else>
          <label class="iconfont icon-shouhuodizhi"></label>{{ __('你还没有个人联系信息,马上') }}
          <text>{{ __('添加') }}</text>
        </view>
        <view class="m-cell-ft "></view>
      </view>
    </view>


    <block v-if="canSelfpick && !isVirtual && plantformInfo.chain_enable">
      <view class="distribution" v-if="(true)">
        <view style="width:30%">{{ __('配送方式') }}</view>
        <view class="check" style="display:flex;align-items: center;width:70%;justify-content: space-around">
          <view style="display:flex;align-items: center;" @click="express">
            <view v-if="(selfpickFlag)" class="border"
                  style="border-radius:50%;width:26rpx;height:26rpx;border:1px solid #db384c">
            </view>
            <image v-if="(addressFlag)" style="width:32rpx;height:32rpx;border-radius:50%"
                   src="/static/images/ziti.png"></image>
            <view style="margin-left:10rpx">{{ __('快递配送') }}</view>
          </view>
        </view>
      </view>


    </block>

    <view class="m-product-all">
      <view class="m-product-list">
        <block v-for="(store_items, store_index) in submitOrderInfo.items" :key="store_index">
          <view class="m-product-box">
            <view class="m-store" :data-id="(store_items.id)" v-if="selfpickFlag && false">
              <view class="m-store-c">
                <label class="m-store-info">
                  <label class="iconfont icon-store"> {{ store_items.store_name }}</label>
                </label>

                <span style="float: right;font-size: 10px;padding-right: 10rpx;color: #B2B2B2;"
                      v-if="selfpickFlag">{{ __('自提地址: ') }} {{ store_items.store_address }}</span>
              </view>
            </view>
            <view v-for="(item, itemindex) in store_items.items" :key="itemindex" class="m-product-item"
                  style="height: auto;flex-direction: column;">
              <view :class="'m-item-c ' + ((item.cart_id==0)?'del':'')" :data-id="(item.cart_id)">
                <navigator
                    :url="(item.kind_id == 1201 ? '/pagesub/product/detail?id=' : (item.kind_id == 1205 ? '/edu/course/detail?item_id=' : '/pagesub/product/detail?id=')) + (item.item_id)"
                    class="m-product-img">
                  <image :src="(item.product_image)"/>
                </navigator>
                <view class="m-product-info" @click="jumpDetail(item)">
                  <view class="m-product-name">
                    <label>
       
                      {{ item.product_name }}</label>
                    <label class="m-min-name">
                      {{ item.item_name ? item.item_name : "" }}
                      <label v-if="item.course_chapter_num">
                        <image style="width: 23rpx;height: 23rpx;margin-top: 15rpx;"
                               src="https://static.shopsuite.cn/shopsuite/edu/detail_video.png"
                               v-if="item.course_file_type === 0"></image>
                        <text v-else-if="item.course_file_type === 1" v-else
                              class="iconfont icon-a-ziyuan11"
                              style="font-size: small;padding-right: 10rpx"></text>
                        <text v-else class="iconfont icon-yinpin"
                              style="font-size: small;padding-right: 10rpx"></text>
                        <text
                            style="margin-left: 10rpx;">{{ item.course_chapter_num }}节课时
                        </text>
                      </label>
                    </label>
                  </view>
                  <view class="m-product-price">
                    <block v-if="item.item_unit_price">
                      <text class="mcs">{{ __('￥') }}</text>
                      {{ number_format(item.item_sale_price, 2) }}
                    </block>
                    <label class="pre-info-price" v-if="(item.item_save_price)">
                      -
                      <text class="mcs">{{ __('￥') }}</text>
                      {{ number_format(item.item_save_price, 2) }}
                    </label>

                    <block v-if="item.item_unit_points">
                      <label class="pre-info-price" style="margin: 0rpx 10rpx;">+</label><label
                        style="font-size:32rpx">{{ item.item_unit_points }}</label><label
                        style="font-size: 12px">{{ __('积分') }}</label>
                    </block>

                    <block v-if="item.item_unit_sp">
                      <label class="pre-info-price" style="margin: 0rpx 10rpx;">+</label><label
                        style="font-size:32rpx">{{ item.item_unit_sp }}</label><label
                        style="font-size: 12px">{{ __('众宝') }}</label>
                    </block>

                    <text
                        style="float: right;padding-right: 50rpx;">x{{ item.cart_quantity }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <block v-if="(isVirtual && kindId != 1205)  && plantformInfo.chain_enable">

            <view class="datetime" v-if="(product_service_date_flag)"
                  style="background:#fff;border-top:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;margin-top:20rpx;padding:20rpx 20rpx;display:flex;font-size:30rpx">
              <view class="section" style="width:60%">
                <picker mode="date" :value="(date)" :start="(stdate)" :end="(eddate)"
                        @change="bindDateChange">
                  <view class="picker">
                    {{ __('选择日期:') }} {{ date }}
                  </view>
                </picker>
              </view>
              <view class="section" style="width:40%">
                <picker mode="time" :value="(time)" @change="bindTimeChange">
                  <view class="picker">
                    {{ __('选择时间:') }} {{ time }}
                  </view>
                </picker>
              </view>
            </view>


            <view class="m-cells m-cells-form hide" style="margin-top:20rpx;z-index:1">
              <view class="m-cell" v-if="(product_service_contactor_flag)">
                <view class="m-cell-hd" style="width:20%">
                  <label class="u-label">{{ __('预约人') }}</label>
                </view>
                <view class="m-cell-bd">
                  <input class="u-input" maxlength="20" type="text" :value="(showud_name)"
                         placeholder="请输入预约人姓名" @input="inputud_name"/>
                </view>
                <div v-if="(ud_name=='')" class="m-cell-ft">
                  <uni-icons class="m-icon-warn" type="warn"></uni-icons>
                </div>
              </view>

              <view class="m-cell" v-if="(product_service_contactor_flag)">
                <view class="m-cell-hd" style="width:20%">
                  <label for="" class="u-label">{{ __('手机号码') }}</label>
                </view>
                <view class="m-cell-bd">
                  <input class="u-input" type="number" :value="(showphone)" placeholder="请输入手机号码"
                         @input="inputphone"/>
                </view>
                <div v-if="(!isre || phone=='')" class="m-cell-ft">
                  <uni-icons class="m-icon-warn" type="warn"></uni-icons>
                </div>
              </view>
              <view class="m-cell" v-if="(true)">
                <view class="m-cell-hd" style="width:20%">
                  <label for="" class="u-label">{{ __('详细地址') }}</label>
                </view>
                <view class="m-cell-bd">
                  <input class="u-input" maxlength="100" type="text" :value="(showdetail )"
                         placeholder="请输入详细地址" @input="inputdetail"/>
                </view>
                <view v-if="(detail=='')" class="m-cell-ft">
                  <uni-icons class="m-icon-warn" type="warn"></uni-icons>
                </view>
              </view>
            </view>


            <view class="m-cells-title">{{ __('备注') }}</view>
            <view class="m-cells m-cells-form">
              <view class="m-cell">
                <view class="m-cell-bd" style="position: relative;">
									<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)"
                            :data-id="(store_index)" :data-store_id="(store_items.store_id)"
                            @input="inputRemark"></textarea>
                  <view class="u-textarea-counter">
                    <label>{{ orderMessageLen[store_index] || 0 }}</label>/200
                  </view>
                </view>
              </view>
            </view>
            <view class="hint m-cell">
              <text>
                {{
                  __('温馨提示:请您确认预约时间与地址，仔细核对手机号并保持电话畅通。下单成功后您可在“我的预约”查看订单。距离预约服务时间超过24小时您可以取消预约订单，距离预约服务时间24小时之内可以联系商家取消预约订单。')
                }}
              </text>
            </view>
          </block>
          <block v-else>
            <view class="m-cells-title">{{ __('备注') }}</view>
            <view class="m-cells m-cells-form">
              <view class="m-cell">
                <view class="m-cell-bd">
									<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)"
                            :data-id="(store_index)" :data-store_id="(store_items.store_id)"
                            @input="inputRemark"></textarea>
                  <view class="u-textarea-counter">
                    <label>{{ orderMessageLen[store_index] || 0 }}</label>/200
                  </view>
                </view>
              </view>
            </view>
          </block>
          <view class="m-cells total-info">
            <view class="m-cell" @click="listInvoice" :data-id="(store_index)"
                  :data-user_invoice_id="user_invoice_id">
              <view class="m-cell-bd">
                <text>{{ __('发票') }}</text>
                <text class="highlight12" v-if="(invoice_header && user_invoice_id)">
                  ({{ invoice_header }})
                </text>
                <text class="highlight12" v-else-if="(user_invoice_id == 0)">
                  ({{ __('不需要发票') }})
                </text>
                <text class="highlight12" v-else>({{ __('不需要发票') }})</text>
              </view>
              <view class="arrow m-cell-access">
                <view class="m-cell-ft "></view>
              </view>
            </view>
            <view class="m-cell">
              <view class="m-cell-bd">
                <text>{{ __('商品总额') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">
                <text class="mcs">{{ __('￥') }}</text>
                {{ number_format(store_items.product_amount, 2) }}
              </view>
              <view class="arrow"></view>
            </view>
            <view class="m-cell" v-if="store_items.points_amount">
              <view class="m-cell-bd">
                <text>{{ __('积分抵扣') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">{{ store_items.points_amount }}
                <text class="mcs">{{ __('积分') }}</text>
              </view>
              <view class="arrow"></view>
            </view>

            <view class="m-cell" v-if="store_items.sp_amount">
              <view class="m-cell-bd">
                <text>{{ __('众宝抵扣') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">{{ store_items.sp_amount }}{{ __('众宝') }}</view>
              <view class="arrow"></view>
            </view>

            <view class="m-cell m-cell-parent" v-if="(store_items.discount_amount>0)">
              <view class="m-cell-bd"
                    v-if="hasLogin && (100 != plantformInfo.user_level_rate_map[userInfo.user_level_id])">
                <text>{{ __('活动优惠及会员折扣') }}</text>
                <text style="font-size:24rpx;color:#717171" v-if="hasLogin">
                  {{ sprintf(__('(%s折)'), plantformInfo.user_level_rate_map[userInfo.user_level_id] / 10) }}
                </text>
              </view>
              <view class="m-cell-bd" v-else>
                <text>{{ __('活动优惠') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">
                <text class="mcs">-{{ __('￥') }}</text>
                {{ number_format(store_items.discount_amount, 2) }}
              </view>
              <view class="arrow"></view>
            </view>

 

            <!--会员折扣 -->
            <view class="m-cell" v-if="(store_items.policy_discount_amount>0)">
              <view class="m-cell-bd">
                <text>{{ __('会员折扣') }}</text>
                <text style="font-size:24rpx;color:#717171">
                  {{ sprintf(__('(%s折)'), store_items.policy_discountrate / 10) }}
                </text>
              </view>
              <view class="m-cell-ft m-order-typetxt">
                -
                <text class="mcs">{{ __('￥') }}</text>
                {{ number_format(store_items.policy_discount_amount, 2) }}
              </view>
              <view class="arrow"></view>
            </view>
            <view class="m-cell">
              <view class="m-cell-bd">
                <text>{{ __('运费') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">
                <text class="mcs">+{{ __('￥') }}</text>
                {{ number_format(store_items.freight_amount, 2) || 0 }}
              </view>
              <view class="arrow"></view>
            </view>

            <!-- 返利 -->
            <view class="m-cell" v-if="(store_items.store_rebate>0)">
              <view class="m-cell-bd">
                <text>{{ __('获得红包') }}</text>
              </view>
              <view class="m-cell-ft m-order-typetxt">{{ sprintf(__('￥%.2f'), store_items.store_rebate) }}
              </view>
              <view class="arrow"></view>
            </view>

            <!-- 积分 -->
            <view class="m-cell" v-if="(0)">
              <view class="m-cell-bd">
                <text>{{ __('使用积分') }}</text>
                <text style="font-size:24rpx;color:#717171">{{ sprintf(__('(可使用%s积分)'), 0) }}</text>
              </view>
              <input type="number" class=" m-cell-ft m-order-typetxt" :value="(integral)"
                     placeholder="请输入抵扣积分" @input="count"/>
              <view class="arrow"></view>
            </view>

            <!-- 积分 -->
            <view class="m-cell" v-if="(0)">
              <view class="m-cell-bd">
                {{ __('积分抵现') }}
              </view>
              <view class="m-cell-ft m-order-typetxt" style="padding-right:20rpx">
                -
                <text class="mcs">{{ __('￥') }}</text>
                {{ number_format(discount, 2) }}
              </view>
            </view>
            <!-- 余额抵扣 -->
            <view class="m-cell" v-if="(0)">
              <view class="m-cell-bd">
                <text>{{ __('余额抵扣') }}</text>
                <text style="font-size:24rpx;color:#717171">{{ sprintf(__('(可使用￥%s)'), 0) }}</text>
              </view>
              <view class=" m-cell-ft m-order-typetxt" v-if="(isBalance)">
                <text class="mcs">{{ __('￥') }}</text>
                {{ number_format(balance, 2) }}
              </view>
              <switch checked @change="switchChange" style="transform:scale(0.6);"/>
            </view>

            <view class="m-cell ">
              <view class="m-cell-bd">
              </view>
              <view class="m-cell-ft m-total-info">
                {{ __('总金额：') }}
                <text class="mcs">{{ __('￥') }}</text>
                <text class="m-total-price">
                  {{
                    sprintf(__('%.2f'), store_items.money_amount ? store_items.money_amount : store_items.money_item_amount + store_items.freight_amount)
                  }}
                </text>
              </view>
            </view>
            <view v-if="(delivery_item_none_row.length > 0)">
              <block v-for="(items, i) in delivery_item_none_row" :key="i">
                {{ items.product_item_name }},
              </block>
            </view>
          </view>


        </block>
      </view>
    </view>


    <view class="u-cleanbox"></view>

    <view class="m-footer-btn">
      <view class="m-footer-btn-list">
        <view class="m-footer-btn-item m-cart-total">
          <view :style="'line-height: ' + (submitOrderInfo.order_freight_amount>0 ? 40 : 40) + 'rpx;'">
            {{ __('合计：') }}

            <block v-if="order_amount">
              <text class="mcs">{{ __('￥') }}</text>
              <text class="m-total-price">{{ number_format(order_amount, 2) }}</text>
            </block>


            <label v-if="submitOrderInfo.order_points_amount" style="padding: 0 6px"> + </label>
            <text class="m-total-price"
                  v-if="submitOrderInfo.order_points_amount">{{ submitOrderInfo.order_points_amount }}
            </text>
            <label v-if="submitOrderInfo.order_points_amount"
                   style="font-size: 12px;">{{ __('积分') }}</label>


            <label v-if="submitOrderInfo.order_sp_amount" style="padding: 0 6px"> + </label>
            <text class="m-total-price"
                  v-if="submitOrderInfo.order_sp_amount">{{ submitOrderInfo.order_sp_amount }}
            </text>
            <label v-if="submitOrderInfo.order_sp_amount" style="font-size: 12px;">{{ __('众宝') }}</label>
          </view>
          <view style="line-height: 40rpx;font-size: 24rpx;">
            <block v-if="submitOrderInfo.order_discount_amount>0">
              {{ __('优惠') }}(<label>
              <text class="mcs">{{ __('￥') }}</text>
              {{ number_format(submitOrderInfo.order_discount_amount, 2) }}</label>)
              <label style="margin-right: 10rpx;"></label>
            </block>

            <block v-if="submitOrderInfo.order_rebate_amount>0">
              {{ __('获得红包') }}(<label>
              <text class="mcs">{{ __('￥') }}</text>
              {{ number_format(submitOrderInfo.order_rebate_amount, 2) }}</label>)
              <label style="margin-right: 10rpx;"></label>
            </block>

            <block v-if="submitOrderInfo.order_freight_amount>0">
              {{ __('运费') }}(<label>
              <text class="mcs">{{ __('￥') }}</text>
              {{ number_format(submitOrderInfo.order_freight_amount, 2) }}</label>)
            </block>
            <block v-else>
              {{ __('免运费') }}
            </block>
          </view>
        </view>
      </view>
      <view v-if="(isSubmit)" class="m-footer-btn-main u-disabled">
        {{ __('正在提交....') }}
      </view>
      <block v-else>
        <view v-if="(!can_delivery && delivery_item_none_row.length > 0)">
          <button class="m-footer-btn-main" formType="submit">{{ __('不可配送') }}</button>
        </view>
        <view v-else-if="(show_oos && delivery_item_none_row.length > 0)">
          <button class="m-footer-btn-main" formType="submit">{{ __('暂时缺货') }}</button>
        </view>
        <form v-else-if="(!orderId)" report-submit="true" @submit="submitOrder">
          <button class="m-footer-btn-main" formType="submit">{{ __('提交订单') }}</button>
        </form>
        <form v-else report-submit="true" @submit="submitOrder">
          <button class="m-footer-btn-main" formType="submit">{{ __('去支付') }}</button>
        </form>
      </block>
    </view>

    <payment-box :paymentDataDefault="paymentData" :order_id="orderId" ref="paymentBox" @onCancel="onCancel"
                 @onPaid="onPaid" @onFail="onFail"></payment-box>
  </view>
</template>

<script>
import paymentBox from '@/components/payment-box.vue'

import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      options: {},
      isVirtual: false,
      kindId: 1201,
      udId: 0,
      spinfo: "",
      remark: "",
      remarkLength: 0,
      formId: "",
      submitOrderInfo: {
        items: [],
        userMembership: {}
      },
      userVoucherIds: [],
      redemptionIds: [],
      orderMessage: {},
      orderMessageLen: {},
      isSubmit: false,
      orderId: "",
      paymentData: {},
      integral: "",
      discount: 0,
      disbursements: "",
      IsUseCoupon: 1,
      canSelfpick: false, //是否允许自提
      storeSelfPickFlag: false, //店铺自提
      addressFlag: true,
      selfpickFlag: false, //是否自提
      chainFlag: false,
      date: "",
      starttime: "",
      endtime: "",
      pid: "",
      ud_name: "",
      phone: "",
      stdate: "",
      eddate: "",
      time: "",
      st: "",
      et: "",
      addInfo: "",
      addInfo1: "",
      shipMethod: 0,
      physicalStoreId: "",
      item_ids: [],
      store_id: '',
      userId: '',
      chain_id: 0,
      checked_store: 0,
      item_id: '',
      activity_id: 0,
      sponsorId: 0,
      balance: 0,
      realMoney: 0,
      isBalance: true,
      eCardCash: 0,
      extraCash: 0,
      isMembership: true,
      isECashCard: true,
      isCoupon: true,
      isTmplMsg: true,
      can_delivery: false,
      ifcart: false,
      cart_id: '',
      order_amount: 0,
      ChainInfo: {},
      chain_rows: [],
      latitude: '',
      longitude: '',

      invoice_header: '',
      invoice_type_id: 0,
      user_invoice_id: 0,
      invoice_row: {},

      urlArgs: {},
      delivery_item_none_row: [],
      show_oos: false,
      product_service_date_flag: false,
      product_service_contactor_flag: false,

      showPopupFlag: false,
      popupMsg: '',

      isFightGroup: 0,

      showud_name: '', //请输入预约人姓名
      showphone: '', //请输入电话号码
      isre: '', //请输入预约人姓名
      showdetail: '', //请输入预约详细地址
      detail: '', //
      isdata: '', //

      salesperson_id: '' //销售员Id
    }
  },
  components: {
    paymentBox
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('订单提交')
    });

    var that = this;

    //只传入item_id即可，数据从服务端读取。
    this.setData({
      activity_id: options.activity_id || null,
      urlArgs: options,
      options: options
    });

    if (options.ifcart) {
      this.setData({
        ifcart: parseInt(options.ifcart)
      })
    }

    if (options.cart_id) {
      this.setData({
        cart_id: options.cart_id
      })
    }

    if (options.checked_store) {
      this.setData({
        checked_store: options.checked_store
      })
    }

    var n = new Date,
        s = new Date((new Date).getTime() + 2 * 24 * 60 * 60 * 1000),
        r = new Date;
    var stdate = n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate(),
        sdate = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + (s.getDate()),
        eddate = (r.getFullYear() + 1) + "-" + (r.getMonth() + 1) + "-" + r.getDate();

    var _getDate = new Date((new Date).getTime() - 24 * 60 * 60 * 1000);
    var _year = _getDate.getFullYear();
    var _month = (_getDate.getMonth() + 1) < 10 ? "0" + (_getDate.getMonth() + 1) : (_getDate.getMonth() + 1);
    var _day = _getDate.getDate() < 10 ? "0" + _getDate.getDate() : _getDate.getDate();
    var _disableDate = _year + "-" + _month + "-" + _day;

    this.setData({
      stdate: stdate,
      date: sdate,
      eddate: eddate,
      disableDate: _disableDate
    })

    var time = n.getHours() + ':' + n.getMinutes();

    this.setData({
      time: time,
      st: time,
      et: time
    })

    this.notice.addNotification("RefreshOrder", that.RefreshOrder, that);
    this.notice.addNotification("GotoPayCheckout", that.gotopay, that);
    this.notice.addNotification("Refreshinvoice", that.Refreshinvoice, that);

    this.forceUserInfo(function (user) {
      that.getPlantformInfo(function (plantformInfo) {
        that.setData({
          storeSelfPickFlag: plantformInfo.product_ziti_flag
        });

        that.getCartList();
      });
    })
    // var n = this.shopInfo.VendorFeatureSet;
    // n.indexOf("Membership") > -1 ? this.setData({isMembership: true}) : this.setData({isMembership: false}), n.indexOf("ECashCard") > -1 ? this.setData({isECashCard: true}) : this.setData({isECashCard: false}), n.indexOf("Coupon") > -1 ? this.setData({isCoupon: true}) : this.setData({isCoupon: false}), n.indexOf("TmplMsg") > -1 ? this.setData({isTmplMsg: true}) : this.setData({isTmplMsg: false})
  },
  onUnload: function () {
    //移除通知
    var that = this
    this.notice.removeNotification("RefreshOrder", that);
    this.notice.removeNotification("GotoPayCheckout", that);
    this.notice.postNotificationName("Refreshinvoice", that);

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
    refreshData(options) {
      let that = this;
      this.forceUserInfo(function (user) {
        that.getCartList();
      });

    },
    inputud_name: function (e) {
      this.setData({
        ud_name: e.detail.value
      })
    },
    inputphone: function (e) {
      this.setData({
        phone: e.detail.value
      }), /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
        isre: true
      }) : this.setData({
        isre: false
      })
    },
    RefreshOrder: function (e) {
      console.info(e)
      this.setData({
        udId: e.ud_id,
        chain_id: this.chain_id,
        spinfo: e.spid,
        addInfo1: this.addInfo
      })

      // 修正urlArgs的ud_id参数
      this.editUrlArgs('ud_id', e.ud_id);

      this.getCartList();
    },

    Refreshinvoice: function (options) {
      var that = this;
      that.setData({
        user_invoice_id: options.user_invoice_id,
        invoice_type_id: options.invoice_type_id,
        invoice_header: options.invoice_header,
      })
    },

    jumpDetail(item) {
      var that = this;
      let again_url = '';
      if (item) {
          again_url = this.$.sprintf('/pagesub/product/detail?id=%d', item.item_id);
        uni.navigateTo({
          url: again_url
        });
      }

    },
    getCartList: function () {
      var that = this,
          params = this.urlArgs;

      if (that.chain_id) {
        params.chain_id = that.chain_id;
        params.if_chain = 1;
      }

      if (that.checked_store) {
        params.checked_store = that.checked_store;
      }
	  params.val = ""
      params.user_voucher_ids = that.userVoucherIds.join(",");
      params.redemption_ids = that.redemptionIds.join(",");
      params.ud_id = that.udId;

      params.delivery_type_id = that.selfpickFlag ? 5 : 10; //是否自提;  //DELIVERY_TYPE_SELF_PICK_UP = 5
      params.is_delivery = that.selfpickFlag ? 0 : 1; //是否自提

      that.$.request({
        url: this.Config.URL.cart.checkout,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {

            var ud_id = 0;
            if (!that.$.isNull(data.user_delivery_address)) {
              ud_id = data.user_delivery_address.ud_id;
            } else {
            }

            //无货
            if (data.items.length == 0) {
              that.$.confirm(that.__('无符合条件的商品'), that.$.navigateBack);
            }

            if (data.items[0].is_virtual) {
              var item_row = data.items[0].items[0];

              that.setData({
                item_ids: [item_row.item_id]
              });

              that.setData({
                isVirtual: data.items[0].is_virtual,
                product_service_date_flag: item_row.product_service_date_flag,
                product_service_contactor_flag: item_row
                    .product_service_contactor_flag,
                udId: ud_id,
                store_id: item_row.store_id,
                chainFlag: item_row.product_valid_type == 1002 ? false : true,
                addressFlag: item_row.product_valid_type == 1002 ? true :
                    false,
                submitOrderInfo: data,
                // eddate: eddate,
                // stdate: stdate,
                chain_id: that.chain_id
              });
            } else {
              var item_row = data.items[0].items[0];

              that.setData({
                store_id: item_row.store_id,
                isVirtual: data.items[0].is_virtual,
                product_service_date_flag: 1,
                product_service_contactor_flag: 1,
                udId: ud_id,
                submitOrderInfo: data,
                // eddate: eddate,
                // stdate: stdate,
                chain_id: that.chain_id
              });
            }

            that.setData({
              order_amount: data.order_money_amount,
              kindId: data.items[0].kind_id,
            });

            if (data.order_id) {
              that.setData({
                orderId: data.order_id,
                order_amount: data.trade_payment_amount,
              });

              that.$store.dispatch(`getUserInfo`, function (userIfo) {
              })

              that.setData({
                'paymentData': {
                  order_id: data.order_id,
                  order_money_amount: data.trade_payment_amount.toFixed(2),
                  user_money: that.userInfo.user_money,
                  user_points: that.userInfo.user_points,
                  user_recharge_card: that.userInfo.user_recharge_card,
                  user_sp: that.userInfo.user_sp
                }
              });
            }

            //地址信息监测
            if (ud_id > 0) {
              //that.checkDelivery(ud_id);
            }

    

            //判断线上线下店铺
            if (that.storeSelfPickFlag || that.plantformInfo.chain_enable) {
              that.setData({
                canSelfpick: true
              })
            }
          } else {
            that.$.confirm(msg, that.$.navigateBack);
          }
        },
        fail: function (err, ms) {
          that.$.confirm(err);
        }
      });
    },
    hidePopup: function (e) {
      //console.info(e);
      this.setData({
        showPopupFlag: false
      });
    },
    checkDelivery: function (ud_id) {
      var that = this;
      var params = that.urlArgs;
      params.ud_id = ud_id;
      that.spid ? params.cart_id = that.spid : '';

      that.$.request({
        url: this.Config.URL.cart.checkDelivery,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {
            if (data.need_edit == 1) {
              // 该地址信息不完整
              that.$.alert("该收货地址不完整，请重新选择！");
            } else {
              that.setData({
                submitOrderInfo: data,
              });

              that.setData({
                can_delivery: data.can_delivery,
                show_oos: data.show_oos,
                delivery_item_none_row: data.items.delivery_item_none_row,
              });

              // 修正urlArgs的ud_id参数
              that.editUrlArgs('ud_id', ud_id);
            }

          }
        }
      });
    },
    count: function (e) {
      let that = this;
      this.setData({
        integral: e.detail.value
      }), e.detail.value == 0 && this.setData({
        integral: ""
      }), parseInt(e.detail.value) > parseInt(this.submitOrderInfo.userMembership.UsablePoint) ? (this
          .setData({
            integral: "",
            discount: 0,
            disbursements: this.submitOrderInfo.ShoppingCartHeaderInfo.ActualPayPrice
          }), that.$.showModal({
        title: "提示",
        content: "请输入正确积分额度"
      })) : this.setData({
        discount: (this.integral / this.submitOrderInfo.userMembership.PointAsCashRate).toFixed(2),
        disbursements: (this.submitOrderInfo.ShoppingCartHeaderInfo.ActualPayPrice - this
                .integral /
            this.submitOrderInfo
                .userMembership.PointAsCashRate).toFixed(2)
      }), this.disbursements < 0 && this.setData({
        disbursements: 0
      }), (this.integral / this.submitOrderInfo.userMembership.PointAsCashRate).toFixed(2) > this
          .submitOrderInfo
          .ShoppingCartHeaderInfo
          .ActualPayPrice && this.setData({
        discount: this.submitOrderInfo.ShoppingCartHeaderInfo.ActualPayPrice
      }), this.submitOrderInfo.ShoppingCartHeaderInfo.MaxUsableCash >= this.disbursements ? this
          .setData({
            balance: this.disbursements,
            realMoney: 0
          }) : this.setData({
        balance: this.submitOrderInfo.ShoppingCartHeaderInfo.MaxUsableCash,
        realMoney: (this.disbursements - this.submitOrderInfo.ShoppingCartHeaderInfo.MaxUsableCash)
            .toFixed(2)
      })
    },
    getLocalTime: function (e) {
      e = e.replace("/Date(", "").replace(")/", "");
      var t = new Date(parseInt(e));
      return t
    },
    getUrlParam: function (name, url) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [,
        ""
      ])[1].replace(/\+/g, '%20')) || null
    },
    submitOrder: async function (e) {
      let that = this;
      if (that.$.isNull(that.orderId)) {

        var params = that.urlArgs;

        if (this.udId == 0) {
          let msg = that.__("请选择你的收货地址！")

          if (that.isVirtual) {
            msg = that.__("请选择你的个人联系信息！")
          }

          that.$.showModal({
            title: that.__("提示"),
            showCancel: false,
            content: msg
          });
          return
        }

        if (this.isVirtual) {
          var datetime = this.date + " " + this.time,
              n = datetime.replace(/-/g, "/");
          var r = new Date;
          var i = new Date(n);
          var s = r.getTime(),
              o = i.getTime();

          if (o - s < 0) {
            that.$.showModal({
              title: "提示",
              showCancel: false,
              content: "您选择的预约时间已不在服务预约时间范围内!"
            });
            return
          }

          if (this.product_service_date_flag)
            if (that.$.isNull(this.date) || that.$.isNull(this.time)) {
              that.$.showModal({
                title: "提示",
                showCancel: false,
                content: "请选择预约服务日期与时间!"
              });
              return
            }
        }

        params.user_voucher_ids = that.userVoucherIds.join(",");
        params.redemption_ids = that.redemptionIds.join(",");
        params.ud_id = params.ud_id || that.udId;
        params.ifcart = that.ifcart; // 传入cart_id时直接购买，未传时走购物车
        params.cart_id = that.cart_id;
        params.payment_type_id = that.StateCode.PAYMENT_TYPE_ONLINE;
        params.delivery_type_id = that.selfpickFlag ? 5 : 10; //是否自提;  //DELIVERY_TYPE_SELF_PICK_UP = 5
        params.delivery_time_id = 1;

        params.invoice_type_id = 1;
        params.order_invoice_title = "";

        params.order_message = JSON.stringify(that.orderMessage);

        params.virtual_service_date = that.date;
        params.virtual_service_time = that.date + ' ' + that.time;
        params.chain_id = that.chain_id;
        params.checked_store = that.checked_store;

        params.distributor_id = uni.getStorageSync('store_id');
        params.salesperson_id = that.salesperson_id;
        params.user_invoice_id = that.user_invoice_id;

        let source_item_id = uni.getStorageSync('source_item_id');
        params.source_item_id = source_item_id;

        params.is_delivery = that.selfpickFlag ? 0 : 1; //是否自提

        that.$.request({
          method: 'POST',
          url: that.Config.URL.user.order_add,
          data: params,
          success: async function (data, status, msg, code) {
            //console.info(JSON.stringify(data));
            if (200 == status) {

              //删除旧数据
              if (source_item_id) {
                let source_item_id_row = JSON.parse(source_item_id);
                for (let store_idx = 0; store_idx < data.items.length; store_idx++) {
                  for (let item_idx = 0; item_idx < data.items[store_idx].items
                      .length; item_idx++) {
                    let order_item_id = data.items[store_idx].items[item_idx]
                        .item_id;

                    //完成后删除数据吧
                    if (source_item_id) {
                      for (var tk in source_item_id_row) {
                        if (source_item_id_row[tk].u) {
                          if (tk == order_item_id) {
                            delete source_item_id_row[tk];
                          } else {
                            let time = parseInt(Date.parse(new Date()) /
                                100)
                            //判断是否超时
                            if (time - source_item_id_row[tk].t > 86400 *
                                30) {
                              delete source_item_id_row[tk];
                            }
                          }
                        } else {
                          delete source_item_id_row[tk];
                        }
                      }


                    }
                  }
                }

                uni.setStorageSync('source_item_id', JSON.stringify(
                    source_item_id_row));
              }

              that.setData({
                orderId: data.order_ids.join(','),
              });

              if (data.gb_id) {
                that.isFightGroup = data.gb_id;
              }

              //reloadUserResource
              await that.$store.dispatch(`getUserInfo`, function (userIfo) {

              })

              that.setData({
                'paymentData': {
                  order_id: that.orderId,
                  order_money_amount: data.order_money_amount.toFixed(2),

                  user_money: that.userInfo.user_money,
                  user_points: that.userInfo.user_points,

                  user_recharge_card: that.userInfo.user_recharge_card,
                  user_sp: that.userInfo.user_sp
                }
              });

              /*
              that.$.showToast({
                  title: "添加订单成功！"
              });
              */
              //
              //that.gotopay();
              that.notice.postNotificationName("GotoPayCheckout")
            } else {
              /*
              setTimeout(() => {

              that.setData({
                showPopupFlag: true,
                popupMsg: msg
              });

              }, 10);
                              */
              if (250 == status) {
                if (data && data.hasOwnProperty('mobile_is_bind')) {
                  that.$.confirm(msg,
                      function (data) {
                        if (data.confirm) {
                          //绑定手机操作
                          that.$.gopage("/member/member/bindphone");

                        }
                      },
                      true);
                } else {
                  that.$.confirm(msg);
                }
              } else {
                that.$.confirm(msg);
              }
            }
          },
          fail: function (data, status, msg, code) {
            that.$.showToast({
              title: msg
            })
          }
        });
      } else {
        //that.gotopay()
        that.notice.postNotificationName("GotoPayCheckout")
      }
    },
    gotopay: function (e) {
      //console.info('gotopay');
      setTimeout(() => {
        this.$refs.paymentBox.show();
      }, 400)

      return true;

      var param = {
        order_id: this.orderId,
        openid: this.userInfo.openId,
        typ: 'json',
        payment_channel_code: 'wx_native',
        prepay_flag: 1
      };

      var that = this;
      this.isSubmit = true;

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
              success: function (n) {
                that.isTmplMsg && that.sendMessage(param.order_id, 2);
                that.returnUrl(param.order_id)
              },
              fail: function (n) {
                that.$.gotopage("/member/order/detail?on=" + param
                    .order_id);
                that.isTmplMsg && that.sendMessage(param.order_id, 1)
              },
              complete: function (n) {
                if (n.errMsg == "requestPayment:cancel") {
                  that.$.gotopage("/member/order/detail?on=" + param
                      .order_id);

                  that.isTmplMsg && that.sendMessage(param.order_id, 1);
                }
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
    inputRemark: function (e) {

      var submitOrderInfo = this.submitOrderInfo;
      submitOrderInfo.items[e.currentTarget.dataset.id].remark = e.detail.value;
      submitOrderInfo.items[e.currentTarget.dataset.id].remarkLength = e.detail.value.length;


      var orderMessageLen = this.orderMessageLen;
      var orderMessage = this.orderMessage;

      this.$set(this.orderMessageLen, e.currentTarget.dataset.id, e.detail.value.length);
      this.$set(this.orderMessage, e.currentTarget.dataset.store_id, e.detail.value);

      this.setData({
        orderMessage: orderMessage,
        orderMessageLen: orderMessageLen
      })

      this.setData({
        submitOrderInfo: submitOrderInfo
      })
    },
    sendMessage: function (e, t) {
      let that = this;
      var n = {
        api: this.Config.URL.wx.get_tpl_msg_config,
        pages: "/member/order/detail?on=" + e,
        formId: this.formId,
        WeiXinOpenId: this.userInfo.openId,
        value: {
          order_id: e,
          msg_type: t == 1 ? 'OrderSubmitMessage' : 'OrderPaySuccessWXMessage'
        }
      };

      that.$.sendTpl(n)
    },

    listInvoice: function (e) {
      var that = this;
      var urlArgs = that.urlArgs;

      urlArgs.user_invoice_id = parseInt(e.currentTarget.dataset.user_invoice_id); //当前选中的
      urlArgs.issub = 1;
      var url = that.$.createUrl("/member/invoice/list", urlArgs);
      that.$.navigateTo({
        url: url
      })
    },
    onCancel: function (e) {
    },
    onPaid: function (e) {
      //重新加载用户资源数据
      let that = this;
      that.returnUrl(that.orderId);
    },
    onFail: function (e) {
      let that = this;
      that.$.gotopage("/member/order/detail?on=" + this.orderId)
    },
    returnUrl: function (e) {
      var that = this;


        that.$.gotopage("/member/order/detail?on=" + e);

      return

      if (!that.$.isNull(that.spinfo)) {
        var n = JSON.parse(that.spinfo);
        if (n.isFightGroup == 2) {
          that.$.navigateBack(1, function () {
            this.notice.postNotificationName("RefreshFG")
          });
          return
        }
        that.$.gotopage("/member/order/detail?on=" + e);
        return
      }
      that.$.gotopage("/member/order/detail?on=" + e);

    },
    selectAddress: function () {
      var that = this;
      var urlArgs = that.urlArgs;
      var url = '';

      if (that.udId > 0) {
        url = "/member/address/list";
        urlArgs.issub = "true";
        urlArgs.ud_id = that.udId;
      } else {
        url = "/member/address/manage";
        urlArgs.ud_id = -1;
        urlArgs.issub = "true";
      }
      that.$.navigateTo({
        url: that.$.createUrl(url, urlArgs)
      });

    },
    express: function () {
      this.setData({
        addressFlag: true,
        selfpickFlag: false,
		chain_id: 0,
        ud_name: "",
        phone: ""
      });

      this.addressFlag ? this.setData({
        shipMethod: 0
      }) : this.setData({
        shipMethod: 1
      });

      this.getCartList()
    },

    bindTimeChange: function (e) {
      this.setData({
        time: e.detail.value
      })
    },
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value,
      })
    },
    switchChange: function (e) {
      e.detail.value ? (this.setData({
        realMoney: this.realMoney,
        isBalance: true
      })) : (this.setData({
        disbursements: this.disbursements,
        isBalance: false
      }))
    },
    editUrlArgs: function (paramKey, paramValue) {
      var urlArgs = this.urlArgs;
      urlArgs[paramKey] = paramValue;
      this.setData({
        urlArgs: urlArgs,
      });
    },
  }
};
</script>


<style lang="scss">
@import "../../styles/_variables";

.page-container {
  padding: 20rpx;
}

.m-island-type {
  background: #fff;
  padding: 30rpx 20rpx;

  .m-tit {
    height: 60rpx;
    line-height: 60rpx;
    margin-bottom: 20rpx;
  }

  .m-type {
    display: flex;
    justify-content: space-around;
  }
}

.m-item {
  .m-imgs {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #f1e6da;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 64rpx;
      height: 64rpx;
    }
  }

  .m-imgs-active {
    background: #333959;
  }

  .m-name {
    margin-top: 15rpx;
  }
}

.m-cells {
  font-size: 28rpx;

  border-radius: 12rpx;
}

.m-addres-info {
  padding: 32rpx 0;
  background-color: white;
  overflow: hidden;
  position: relative;

  border-radius: 12rpx;
}

.m-order-typetxt {
  color: $default-skin-bg;
  font-size: 16px;
}

.m-addres-info::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 6rpx;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAYAAADbEj6NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTZFNEY0MzZFNERFMTFFNUE1MEFGNzBDMjEwRENBN0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTZFNEY0MzdFNERFMTFFNUE1MEFGNzBDMjEwRENBN0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NkU0RjQzNEU0REUxMUU1QTUwQUY3MEMyMTBEQ0E3RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NkU0RjQzNUU0REUxMUU1QTUwQUY3MEMyMTBEQ0E3RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn/dxJgAAAEGSURBVHjaYpToP8mABlSAuAuIAxkGH1gPxGVAfIcYxRc/lpJqvhgQtwNxAhAzDTK/nwDiXCA+Q4ziP7ccSDWfB4grgLgIiDkHmd+vAXExEO8gRrGxqTdeeRYktgAQ10ADlm2Qefo8NDIOEKuBxATPBvV3DTQcBhN4BE2MK4D4Pw0SPBM0k7cAseQg8/sbIK4H4lkgb1EjwcMSPQinAXEjEIsMMk+/AOJqIF4AxP9olOADoTWbyiDz+xcg7gDiPiD+TqwmEhO8A9R8w0Hm919APBmaET8Qq4mYBA9L9BeBWGs4eJrEBG8IjXCHQeb3f9BMDqp1npOikYQEP2yasKQmeFDBDhBgALcVQI75FJrUAAAAAElFTkSuQmCC) center repeat;
  bottom: 0;
  border-bottom: 2px dashed #f1e6da;
}

.m-ad-name {
  display: -webkit-box;
  position: relative;
  margin-left: 40rpx;
  -webkit-box-flex: 1;
  height: 20px;
  line-height: 20px;
  font-weight: 400;
  font-size: 14px;
}

.m-ad-name text {
  margin: 0 10rpx 0 20rpx;
}

.m-ad-name::after {
  content: "\e7e0";
  position: absolute;
  left: -48rpx;
  width: 30rpx;
  height: 30rpx;
  margin-top: -20rpx;
  font-family: "iconfont" !important;
  text-align: center;
  line-height: 80rpx;
  font-size: 80rpx;
}

.m-ad-address {
  width: 650rpx;
  margin-left: 16rpx;
  display: -webkit-box;
  -webkit-box-flex: 1;
  line-height: 50rpx;
  font-weight: 400;
  font-size: 14px;
  position: relative;
  padding-left: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #888;
  margin-top: 10rpx;
}

.m-addres-info .m-cell-ft {
  position: absolute;
  right: 20rpx;
  top: 50%;
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
  padding: 10rpx 20rpx;
  font-size: 12px;
}

.m-total-info label {
  font-size: 32rpx;
  color: $default-skin-bg;
}

.m-footer-btn {
  height: 110rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  //border-top: 1rpx solid #d5d5d5;
  border-radius: 0;
  z-index: 100;

  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);

  display: flex;

  uni-form {
    width: auto;
    margin: auto;
  }
}

.m-footer-btn-list {
  width: 70%;
  height: 100%;
  position: relative;
  float: left;

}

.m-footer-btn-item {
  position: relative;
  float: left;
  width: 100%;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
  padding: 15rpx 0;
  box-sizing: border-box;
  height: 100%;
}

.m-footer-btn-main {
  height: 80rpx;
  float: left;
  background-color: $default-skin-bg;
  color: #fff;
  line-height: 80rpx;
  font-size: 32rpx;
  text-align: center;
  border-radius: 0;


  border-radius: 9px;
  line-height: 80rpx;

  text-align: center;
  margin: auto;
  margin-left: 20rpx;
  margin-right: 20rpx;

  width: 230rpx;
}

.m-cart-total {
  text-align: right;
  padding-right: 20rpx;
}

.m-cart-total text {
  font-size: 36rpx;
  color: $default-skin-bg;

  &.mcs {
    font-size: 12px;
  }
}

.m-cart-total label {
  color: $default-skin-bg;
}

.m-product-price text {
  font-size: 24rpx;
  margin-left: 8rpx;
}

.pre-info-price {
  height: 18rpx !important;
  font-size: 12px !important;
  color: #b0b0b0 !important;
  margin: 0 0 0 10rpx !important;

  margin-left: 30rpx !important;

  .mcs {
    color: #b0b0b0;
    font-size: 10px;
  }
}


.u-null-ad label {
  font-size: 40rpx;
}

.u-null-ad text {
  color: $default-skin-bg;
  text-decoration: underline;
}

.u-disabled {
  background-color: $default-skin-bg-disabled;
}

.arrow {
  width: 20rpx;
}

.coupon {
  position: relative;
  left: 12rpx;
  font-weight: bold;
  font-size: 26rpx;
}

.nearbylist-item {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #eee;
  background: white;
}

.nearbylist-item:last-child {
  border: none;
}

.item-info {
  position: relative;
  font-size: 28rpx;
}

.item-name {
  display: inline-block;
  font-size: 30rpx;
}

.item-phone {
  line-height: 45rpx;
}

.item-distance {
  float: right;
  font-size: 26rpx;
  color: #bbb;
}

.item-address {
  position: relative;
  font-size: 26rpx;
  color: #bbb;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-right: 40rpx;
  line-height: 40rpx
}

.item-info::after {
  content: " ";
  display: inline-block;
  height: 12rpx;
  width: 12rpx;
  border-width: 4rpx 4rpx 0 0;
  border-color: #ebebe7;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  top: -4rpx;
  position: absolute;
  top: 72%;
  right: 4rpx;
  padding: 3rpx;
}

.distribution {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30rpx 30rpx;
  margin-top: 20rpx;
  font-size: 28rpx;
}


.m-product-price1 text {
  font-size: 24rpx;
  color: #888;
  margin-left: 8rpx;
}

.m-product-price {
  /*display: flex;*/
  justify-content: space-between;
  padding-right: 20rpx;
  margin-top: 6rpx;
}

.u-cart-num {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx
}

.btn {
  font-size: 28rpx;
  color: #333333;
  padding-left: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #ffffff;
  border-bottom: 1px solid #d5d5d5
}

/*mask*/
.drawer_screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
}

/*content*/
.drawer_box {
  width: 650rpx;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 1001;
  background: #FAFAFA;
  margin: -150px 50rpx 0 50rpx;
  border-radius: 3px;
}

.drawer_title {
  padding: 15px;
  font: 20px "microsoft yahei";
  text-align: center;
}

.drawer_content {
  height: 210px;
  overflow-y: scroll;
  /*超出父盒子高度可滚动*/
}

.btn_ok {
  padding: 10px;
  font: 20px "microsoft yahei";
  text-align: center;
  border-top: 1px solid #E8E8EA;
  color: #3CC51F;
}

.top {
  padding-top: 8px;
}

.bottom {
  padding-bottom: 8px;
}

.title {
  height: 30px;
  line-height: 30px;
  width: 160rpx;
  text-align: center;
  display: inline-block;
  font: 300 28rpx/30px "microsoft yahei";
}

.hint {
  padding: 40rpx;
  font-size: 12px;
  color: #717171;
}

.hint text {
  padding-left: 20rpx;
}

.footer {
  border-top: 2rpx solid #d5d5d5;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
}

.footer view {
  width: 50%;
  text-align: center;
  font-size: 32rpx;
  line-height: 100rpx;
}

.footer-btn {
  width: 50%;
  background: $default-skin-bg;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  border-radius: 1rpx;
  color: #fff;
}

.m-store-c {
  margin: 20rpx 0;
}

.m-store-info {
  padding: 20rpx;
}


.m-store-info label {
  font-size: 20rpx;
}

.u-textarea {
}

.m-product-box {
  border-radius: 12rpx;
  background-color: #fff;
}

.m-product-item {
  flex-direction: column;
  background-color: transparent;
}

.m-product-item:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #ebebe7;
  color: #ebebe7;
  /*transform-origin: 0 100%;*/
  transform: scaleY(0.5);
}

.m-item-c {
  position: relative;
  /* width: 850rpx; */
  //height: 212rpx;
  display: flex;
}

.m-item-act {
  position: relative;
  width: 850rpx;
  height: 100rpx;
}

.m-act-img {
  width: 212rpx;
  height: 212rpx;

  image {
    width: 100rpx;
    height: 100rpx;
  }
}

.act-item-name {
  width: 570rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.u-textarea-counter {
  position: absolute;
  right: 20rpx;
  bottom: 0;
}

.mcs {
  font-size: 12px;
  color: $default-skin-bg;
}

.m-total-price {
  color: $default-skin-bg;
  font-size: 17px;
}

form {
  flex: 1;
}
</style>