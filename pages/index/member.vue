<template>
  <view class="page">
    <!-- 签到标签 -->
    <block v-if="!hasSigned">
      <view class='u-top3' style='z-index:10' v-if="!hasSigned">
        <view style="width: 120rpx;height: 60rpx;position:relative;">
          <button hover-class='none' style="box-shadow:4px 1px  15px 1px rgba(0,0,0,0.1)" class='anniu_qd'
                  v-if="!hasSigned"
                  @tap="click">
            <image class='inter_bj' style="box-shadow:20px 2px  10px 2px rgba(0,0,0,0.1)"
                   src='/static/images/integra.png'></image>
          </button>
        </view>
      </view>
      <view class='u-top3' style='z-index:10' v-else>
        <view style="width: 136rpx;height: 60rpx;position:relative;">
          <image class='inter_bj' style="" src='/static/images/true_qd.png'></image>
          <view v-if="hasSigned" style="font-size: 26rpx;color: #ebebe7;position: absolute;top: 12%;left:26%;"
                @tap="click">{{ __('已签到') }}
          </view>
        </view>
      </view>
    </block>

    <view class="m-banner-img">
      <view class="member-top">
        <!-- #ifdef APP-PLUS -->
        <view class="status-bar"></view>
        <!-- #endif -->

        <!-- 老头像位置  -->
        <navigator url="/member/member/task" class="m-user-info" v-if="false">
          <image lazy-load :src="(userInfo.user_avatar)" mode="scaleToFill"/>
          <view class="m-name">
            <label>{{ userInfo.user_nickname }}</label>
            <label style="position: relative;" v-if="hasLogin"><label
                class="sup">{{ plantformInfo.user_level_map[userInfo.user_level_id] }}</label></label>
          </view>
        </navigator>

        <view class="pd40 flex alcenter space" style="padding-bottom: 10rpx;">
          <navigator url="/pagesub/login/login" class="flex alcenter" v-if="!hasLogin">
            <image class="member-face" :src="userInfo.user_avatar"></image>
            <view class="ml30">
              <view class="ft16 text-w">
                <text class="ftw600">{{ __('登录／注册') }}</text>
                <text class="iconfont iconbtn_arrowr ml10"></text>
              </view>
            </view>
          </navigator>

          <view v-else>
            <navigator url="/member/member/task" class="flex alcenter">
              <image class="member-face" :src="userInfo.user_avatar"></image>
              <view class="ml30 text-left userinfo-box">
                <view class="ft16 text-w ftw600">
                  {{ userInfo.user_nickname }}
                  <label style="position: relative; margin-left: 3px;" v-if="hasLogin && false"><label
                      class="sup">{{ plantformInfo.user_level_map[userInfo.user_level_id] }}</label></label>
                </view>
                <view class="ft14" v-if="hasLogin" style="line-height: 28rpx;height: 28rpx;">
                  <label style="position: relative;" v-if="hasLogin"><label
                      class="sup">{{ plantformInfo.user_level_map[userInfo.user_level_id] }}</label></label>
                </view>
              </view>
              <text class="iconfont iconbtn_arrowr text-w ml10"></text>
            </navigator>
          </view>

          <!-- 设置ICON  -->
          <view>
            <view v-if="hasLogin" class="text-white flex">
              <navigator url="/member/member/message" style="margin-left: 20rpx;position: relative;">
                <uni-badge :text="newMsgNum" type="red" class="badge new-badge"></uni-badge>
                <view class="iconfont zc zc-email i-type"></view>
              </navigator>
              <navigator url="/member/member/options" style="margin-left: 20rpx;">
                <view class="iconfont zc zc-shezhi i-type"></view>
              </navigator>
            </view>
          </view>
        </view>

        <view class="flex space text-center" style="padding:16rpx 20rpx 8rpx;justify-content: space-around;">
          <navigator url="/member/cash/predepositlist" class="text-white">
            <view class="res-num">
              {{ number_format(userInfo.user_money, 2) || 0 }}
            </view>
            <view class="res-name">
              {{ __('余额') }}
            </view>
          </navigator>
          <navigator url="/integral/integral/record" class="text-white" v-if="(plantformInfo.points_enable)">
            <view class="res-num">
              <text class="padding-left-sm">{{ number_format(userInfo.user_points, 0) || 0 }}</text>
              <text class="cuIcon-question text-yellow" v-if="false"></text>
            </view>
            <view class="res-name">
              {{ __('积分') }}
            </view>
          </navigator>
        </view>

      </view>
    </view>
    <view class="item-box-container">
      <view class="item-box">
        <view class="m-ber" style="margin-top:0;">
          <view class="m-cell m-cell-access m-info-sp">
            <view class="m-cell-bd">
              <navigator url="/member/order/list?type=0&sl=1" class="m-order-title" hover-class="none">
                <label class="m-ber-n m-ber-title">{{ __('我的订单') }}</label>
                <label  style="position: absolute;right: 10rpx;">
                  <label class="m-ber-n" style="margin-right:20rpx;color:#999">{{ __('查看全部') }}</label>
				  <image class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill"/>
                </label>
              </navigator>
            </view>
          </view>
        </view>
        <view class="m-panel-bd" style="margin-top: 0;">
          <view class="m-media-box m-media-box-small-appmsg">
            <view :class="{'m-cells':1, iconBoxLattice:personalCenterList.type==2}">
              <navigator url="/member/order/list?type=2010&sl=2" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.wait_pay_num_entity >0)" :text="orders.wait_pay_num_entity" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-daizhifu"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待支付') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2030&sl=5" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.wait_shipping_num_entity >0)" :text="orders.wait_shipping_num_entity"
                           type="purple" class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-daifahuo2"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待发货') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2040&sl=3" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.ship_num_entity >0)" :text="orders.ship_num_entity" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-tubiaolunkuo-"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待收货') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2060&sl=4" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.fin_num_entity >0)" :text="orders.fin_num_entity" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-yiwancheng"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('已完成') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
            </view>
          </view>
        </view>

        <block v-if="isVirtual">
        <view class="m-ber">
          <view class="m-cell m-cell-access m-info-sp">
            <view class="m-cell-bd">
              <navigator url="/member/order/list?type=0&sl=1&kind_id=1202" class="m-order-title" hover-class="none">
                <label class="m-ber-n m-ber-title">{{ __('我的预约') }}</label>
                <label  style="position: absolute;right: 10rpx;">
				   <label class="m-ber-n" style="margin-right:20rpx;color:#999">{{ __('查看全部') }}</label>
                  <image class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill"/>
                </label>
              </navigator>
            </view>
          </view>
        </view>
        <view class="m-panel-bd" style="margin-top: 0;">
          <view class="m-media-box m-media-box-small-appmsg">
            <view :class="{'m-cells':1, iconBoxLattice:personalCenterList.type==2}">
              <navigator url="/member/order/list?type=2010&sl=2&kind_id=1202" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.wait_pay_num_v >0)" :text="orders.wait_pay_num_v" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-daizhifu"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待支付') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2030&sl=5&kind_id=1202" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.wait_shipping_num_v >0)" :text="orders.wait_shipping_num_v" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-daifahuo2"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待服务') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2040&sl=3&kind_id=1202" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.ship_num_v >0)" :text="orders.ship_num_v" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-tubiaolunkuo-"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('待确认') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
              <navigator url="/member/order/list?type=2060&sl=4&kind_id=1202" class="m-cell m-cell-access">
                <uni-badge v-if="(orders.fin_num_v >0)" :text="orders.fin_num_v" type="purple"
                           class="badge"></uni-badge>
                <view class="m-cell-hd main-color">
                  <label class="iconfont zc zc-yiwancheng"></label>
                </view>
                <view class="m-cell-bd m-cell-primary">
                  <p>{{ __('已完成') }}</p>
                </view>
                <text class="m-cell-ft"></text>
              </navigator>
            </view>
          </view>
        </view>
        </block>

        <view class="m-ber">
          <view class="m-cell m-cell-access m-info-sp">
            <view class="m-cell-bd">
              <label class="m-ber-n  m-ber-title">{{ __('常用功能') }}</label>
            </view>
          </view>
        </view>
        <view class="m-panel-bd" style="margin-top: 0;">
          <view class="m-media-box m-media-box-small-appmsg">
            <view :class="{'m-cells':1, iconBoxLattice:personalCenterList.type==2}">
              <block v-for="(item, i) in personalCenterList.list" :key="i" v-if="item.cat == 1">

                <view v-if="(item.id==8 && item.isShow)" @click="selectAddress" class="m-cell m-cell-access">
                  <view class="m-cell-hd" :style="{color:(item.color)}">
                    <label :class="['iconfont', item.icon]"></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <label>{{ __('收货地址') }}</label>
                  </view>
                  <text class="m-cell-ft"></text>
                </view>

          

                <view v-else-if="(item.FeatureKey=='CleanCacheKey' && item.isShow)" class="m-cell m-cell-access"
                      @click="cleanCache">
                  <view class="m-cell-hd " :style="{color:item.color}">
                    <label :class="['iconfont', item.icon]"></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <label>{{ __('清除缓存') }}</label>
                    <!-- #ifdef MP-WEIXIN -->
                    <label style="color:#717171;margin-right:8rpx;float:right;"
                           v-if="(personalCenterList.type!=2)">{{ currentSize }}KB</label>
                    <!-- #endif -->
                  </view>
                  <text class="m-cell-ft"></text>
                </view>
                <navigator v-else-if="(item.isShow)" :url="item.url"
                           class="m-cell m-cell-access">

                  <uni-badge v-if="item.FeatureKey=='service' && item.isShow && (orders.returning_num >0) "
                             :text="orders.returning_num" type="purple" class="badge"></uni-badge>
                  <uni-badge v-if="item.FeatureKey=='Message' && item.isShow && (newMsgNum >0) " :text="newMsgNum"
                             type="red" class="badge"></uni-badge>

                  <view class="m-cell-hd " :style="{color:(item.color)}">
                    <label :class="['iconfont', item.icon] "></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <block
                        v-if="item.FeatureKey=='UserMoneyKey' || item.FeatureKey=='Coupon' || item.FeatureKey=='MemGrade' || item.FeatureKey=='UserMoneyKey'">
                      <label>{{ item.name }}</label>
                      <label style="color:#717171;margin-right:8rpx;float:right;"
                             v-if="(personalCenterList.type!=2 && item.FeatureKey=='UserMoneyKey')">{{
                          sprintf(__('你有 ￥%s'), userInfo.user_money)
                        }}</label>
                      <label style="color:#717171;margin-right:8rpx;float:right;"
                             v-if="(personalCenterList.type!=2 && item.FeatureKey=='MemGrade')">{{
                          sprintf(__('你有 %s 积分'), userInfo.user_points)
                        }}</label>
                    </block>
                    <block v-else>
                      <label>{{ item.name }}</label>
                    </block>
                  </view>
                  <text class="m-cell-ft"></text>
                </navigator>
              </block>

            </view>
          </view>
        </view>


       <view class="m-panel-bd" style="margin-top: 0;">
          <view class="m-media-box m-media-box-small-appmsg">
            <view :class="{'m-cells':1, iconBoxLattice:personalCenterList.type==2}">
              <block v-for="(item, i) in personalCenterList.list" :key="i" v-if="item.cat == 2">

                <view v-if="(item.id==8 && item.isShow)" @click="selectAddress" class="m-cell m-cell-access">
                  <view class="m-cell-hd" :style="{color:(item.color)}">
                    <label :class="['iconfont', item.icon]"></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <label>{{ __('收货地址') }}</label>
                  </view>
                  <text class="m-cell-ft"></text>
                </view>


                <view v-else-if="(item.FeatureKey=='CleanCacheKey' && item.isShow)" class="m-cell m-cell-access"
                      @click="cleanCache">
                  <view class="m-cell-hd " :style="{color:item.color}">
                    <label :class="['iconfont', item.icon]"></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <label>{{ __('清除缓存') }}</label>
                    <!-- #ifdef MP-WEIXIN -->
                    <label style="color:#717171;margin-right:8rpx;float:right;"
                           v-if="(personalCenterList.type!=2)">{{ currentSize }}KB</label>
                    <!-- #endif -->
                  </view>
                  <text class="m-cell-ft"></text>
                </view>
				<navigator v-else-if="(item.isShow)" :url="item.url"
                           class="m-cell m-cell-access">
                  <view class="m-cell-hd " :style="{color:(item.color)}">
                    <label :class="['iconfont', item.icon] "></label>
                  </view>
                  <view class="m-cell-bd m-cell-primary">
                    <block
                        v-if="item.FeatureKey=='UserMoneyKey' || item.FeatureKey=='Coupon' || item.FeatureKey=='MemGrade' || item.FeatureKey=='UserMoneyKey'">
                      <label>{{ item.name }}</label>
                      <label style="color:#717171;margin-right:8rpx;float:right;"
                             v-if="(personalCenterList.type!=2 && item.FeatureKey=='UserMoneyKey')">{{
                          sprintf(__('你有 ￥%s'), userInfo.user_money)
                        }}</label>
                      <label style="color:#717171;margin-right:8rpx;float:right;"
                             v-if="(personalCenterList.type!=2 && item.FeatureKey=='MemGrade')">{{
                          sprintf(__('你有 %s 积分'), userInfo.user_points)
                        }}</label>
                    </block>
                    <block v-else>
                      <label>{{ item.name }}</label>
                    </block>
                  </view>
                  <text class="m-cell-ft"></text>
                </navigator>
              </block>

            </view>
          </view>
        </view>

      </view>

      <guess-you-like v-if="loadFlag" ref="guessYouLike" :titleText="__('——猜你喜欢——')" :maxNumber="1" :isShowLoading="false"></guess-you-like>

      <view class="m-tips" style="margin:30rpx 0;padding-bottom: 100rpx;" v-if="(!IsChannel)">
        <view class="m-tips-logo">
          <image lazy-load mode="aspectFit" src="/static/images/logo_tech.png"></image>
        </view>
        <view class="m-tips-str">{{ __('商城套件系统提供技术支持') }} {{ versionNumber }}</view>
      </view>
      <view class="m-tips" style="margin:30rpx 0;padding-bottom: 100rpx;" v-else>
        <view class="m-tips-str">{{ versionName }}{{ versionNumber }}</view>

        <view class="m-tips-str">
          <u-parse :content="icp_number + ' '" @navigate="navigate" :imageProp="{lazyLoad:true}"></u-parse>
        </view>
        <view class="m-tips-str">
          <u-parse :content="copyright + ' '" @navigate="navigate" :imageProp="{lazyLoad:true}"></u-parse>
        </view>
      </view>
    </view>
    <view class='msk' v-if='(isGetnum&&isStorage&&isFlagPhoto&&isWexinMobile)'>
      <view class='model'>
        <view class='hint'>
          <view class='title'>{{ __('绑定手机号') }}</view>
          <view class='content'>{{ __('您当前尚未绑定手机号，建议您绑定以获得更多优惠资讯') }}</view>
        </view>
        <view class='operation'>
          <view class='cancel' @click='cancel'>{{ __('取消') }}</view>
          <button class='success' bindgetphonenumber='getPhoneNumber' open-type='getPhoneNumber'>{{ __('确定') }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import guessYouLike from '@/components/product-list.vue'
import uParse from '@/components/u-parse/u-parse.vue'
import statusBar from '../../components/status-bar.vue'
import uniBadge from '@/components/uni-badge.vue';

import {mapMutations, mapState} from 'vuex';

export default {
  data: function () {
    return {
      Info: '',
      loadFlag:false,
      userInfo: {
        user_nickname: '新用户',
        user_avatar: 'https://static.shopsuite.cn/demodata/assets/data/avatar.png'
      },
      plantformInfo: {user_level_map: {}},
      resource: {
        user_points: 100
      },
      versionNumber: '',
      versionName: '',
      copyright: '',
      icp_number: '',
      isVirtual: false,
      hallB2bEnable: false,

      IsChannel: true,
      personalCenterList: {type: 2, list:[]},
      isMembership: true,
      isCoupon: true,
      isCutPrice: true,
      isECashCard: true,
      isMemDist: true,
      isFightGrp: true,
      isAbtVendor: true,
      currentSize: 0,
      limitSize: 0,

      isStorage: false,
      isGetnum: false,

      hasSigned: false,
      orders: {wait_pay_num: 0, wait_shipping_num: 0, ship_num: 0, fin_num: 0, returning_num: 0},
      isPlus: false
    };
  },
  computed: mapState([
    'Config',
    'StateCode',
    'notice',
    'hasLogin',
    'newMsgNum'
  ]),
  components: {
    guessYouLike,
    uParse,
    statusBar,
    uniBadge
  },
  async onLoad(opt) {
    uni.setNavigationBarTitle({
      title: this.__('用户中心')
    });

    //just for other passport
    if (opt.perm_id && opt.perm_key) {
      that.$.setStorageSync('uid', opt.perm_id);
      that.$.setStorageSync('ukey', decodeURIComponent(opt.perm_key));
    }

    await this.$onLaunched;

    var that = this;
    that.loadFlag = true;

    /*
    if (that.Lang.standard) {
      that.personalCenterList.type = 2;
    } else {
      that.personalCenterList.type = 1;
    }
     */


    this.getPlantformInfo(function (plantformInfo) {
      that.setData({
        plantformInfo: plantformInfo,

        personalCenterList: plantformInfo.user_center_menu,
        //IsChannel: this.shopInfo.IsChannel,
        versionNumber: plantformInfo.site_version,
        versionName: plantformInfo.site_name,
        copyright: plantformInfo.copyright,
        icp_number: plantformInfo.icp_number,
        hallB2bEnable: plantformInfo.hall_b2b_enable
      });

      //处理虚拟订单 我的预约
      for (const i in that.personalCenterList.list) {
        if (that.personalCenterList.list[i].FeatureKey == "isVirtual") {
          that.isVirtual =  that.personalCenterList.list[i].isShow
          break
        }
      }
    });

    //强制更新用户信息及资源
    //reloadUserResource
    await that.$store.dispatch(`getUserInfo`, function (userInfo) {
      that.userInfo = userInfo;
    })
  },

  onShow: async function (opt) {
    let that = this;

    if (that.$.isEmptyObject(this.personalCenterList.list)) {
      await that.load();
    } else {
      if (this.hasLogin) {
        await that.load();
      }
    }

    //强制更新用户信息及资源
    if (this.hasLogin) {
      await that.$store.dispatch(`getUserInfo`, function (userInfo) {
        that.userInfo = userInfo;
      })
    } else {
      this.setData({
        userInfo: this.userInfo
      });
    }

    this.showCartNum();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.load(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.$refs.guessYouLike.scrollbottom();
  },
  methods: {
    ...mapMutations([
      'login',
      'logout',
      'getPlantformInfo',
      'forceUserInfo',
      'reloadUserResource',
      'getUserInfo',
      'showCartNum'
    ]),
    load: async function (force_refresh) {
      if (typeof force_refresh == 'undefined') {
        force_refresh = true;
      }

      var that = this;


      var that = this;
      var params = {
        /*store_id: this.shopInfo.store_id*/
      };

      //判断系统，调取对应网址
      var url = this.Config.URL.store.menu;
      url = this.Config.URL.user.getOrderNum;

      await that.$.request({
        url: url,
        data: params,
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE
        },
        loading:false,
        success: function (data, status, msg, code) {
          that.setData({
            orders: data
          });

          that.$.stopPullDownRefresh()
        }
      });

      if (this.hasLogin) {
        //是否已经签到
        var params = {
          user_id: this.userInfo.user_id,
        };

        that.$.request({
          url: this.Config.URL.user.signState,
          data: params,
          loading:false,
          success: function (data, status, msg, code) {
            that.setData({
              hasSigned: status == 200 ? true : false
            })

            that.$forceUpdate();
          }
        });
      } else {
      }

      that.$.getStorage({
        key: 'cancel',
        success: function (e) {
          e.data == 'yes'
              ? that.setData({
                isStorage: false
              })
              : that.setData({
                isStorage: true
              });
        },
        fail: function (e) {
          that.setData({
            isStorage: true
          });
        }
      });
    },


    click: function () {
      var that = this;
      var param = {
        user_id: this.userInfo.user_id,
        //VendorId: that.cf.storeId
      };
      //console.log("签到", param);


      that.$.request({
        url: this.Config.URL.user.signIn,
		method: "POST",
        data: param,
        loading:false,
        success: function (data, status, msg, code) {
          that.reloadUserResource(function (user_info) {
          });

          if (200 == status) {
            that.$.confirm(msg)
          } else {
            that.$.confirm(that.__('抱歉！今日您已签到'))
          }

          that.load()
        }
      });
    },

    cancel: function () {
      let that = this;
      this.setData({
        isGetnum: false
      }),
          that.$.setStorage({
            key: 'cancel',
            data: 'yes'
          });
    },

    getPhoneNumber: function (e) {
      var that = this;
      that.$.login({
        success: function (n) {
          var r = {
            //vendorId: that.cf.storeId,
            userId: that.userInfo.Id,
            encryptData: e.detail.encryptedData,
            encryptDataIV: e.detail.iv,
            code: n.code
          };
          //console.log(r);

          /*that.$.xsr(that.$.makeUrl(user.UpdateUserWexinMobile, r), function(e) {
              e.Code == 0 &&
                  ((that.userInfo.Phone = e.Info),
                  that.setData({
                      isGetnum: false
                  }));
          });*/
        }
      });
    },

    selectAddress: function (e) {
      var that = this;
      that.$.gopage('/member/address/list');
      /*that.$.chooseAddress({
      success: function (that)
      {
          that.$.navigateTo("/member/address/list");
      }, fail: function (that)
      {
          that.$.navigateTo("/member/address/list");
      }
  })*/
    },

    goTabBar: function (e) {
      var that = this;
      that.$.goToTabBar(that, e.currentTarget.dataset.url);
    },

    cleanCache: function (e) {
      var that = this;
      const index = e.currentTarget.dataset.index;
      const path = e.currentTarget.dataset.path;

      that.$.confirm(
          that.__('确定要清除缓存吗？'),
          function (data) {
            if (data.confirm) {
              const language = uni.getStorageSync('selang')

              that.$.storage.clear();

              //如果不在允许的语言内，可重置
              uni.setStorageSync('selang', language);

              // #ifdef MP-WEIXIN
              var info = that.$.storage.info();

              that.setData({
                currentSize: Math.round(info.currentSize * 100) / 100,
                limitSize: Math.round((info.limitSize / 1024) * 100) / 100
              });
              // #endif

              //退出登录
              that.logout(true);
            }
          },
          true
      );
    },

    distributionWeStore: function (e) {
      var that = this;
      that.$.gopage('/pagesub/westore/index');

      //let url = that.$.sprintf('%s/tmpl/member/plantform_invite.html?u_id=%d&opener=uni&sss=ssss', that.Config.WapSiteUrl, that.userInfo.user_id);
      //that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(url) + "&tn=" + '推广中心' + "&tc=" + '#ff6700' + "&tb=" + 'white')
    },
    navigate(href, e) {
      // do something
      console.info(href);
      console.info(e);

      this.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(href));
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.page {
  margin-bottom: var(--window-bottom)
}

.member-top {
  -webkit-animation: changeBg 20s infinite;
  animation: changeBg 20s infinite;
  background-color: $default-skin-bg;
  background-image: url('data:image/png;base64,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');
  background-size: cover;
  text-align: center;
  width: 100%;
  /*height: 11rem;*/

  height: calc(340rpx + var(--status-bar-height));

  overflow: hidden;

  color: #fff;
  position: relative;
  z-index: 1;
}

@-webkit-keyframes changeBg {
  0% {
    background-color: $default-skin-bg;
  }

  10% {
    background-color: lighten($default-skin-bg, 10%);
  }

  20% {
    background-color: #ffce55;
  }

  30% {
    background-color: #a0d468;
  }

  40% {
    background-color: #48cfae;
  }

  50% {
    background-color: #4fc0e8;
  }

  60% {
    background-color: #5d9cec;
  }

  70% {
    background-color: #ac92ed;
  }

  80% {
    background-color: #ec87bf;
  }


  90% {
    background-color: #ff6700;
  }
}

@keyframes changeBg {
  0% {
    background-color: $default-skin-bg;
  }

  10% {
    background-color: lighten($default-skin-bg, 10%);
  }

  20% {
    background-color: #ffce55;
  }

  30% {
    background-color: #a0d468;
  }

  40% {
    background-color: #48cfae;
  }

  50% {
    background-color: #4fc0e8;
  }

  60% {
    background-color: #5d9cec;
  }

  70% {
    background-color: #ac92ed;
  }

  80% {
    background-color: #ec87bf;
  }

  90% {
    background-color: #ff6700;
  }
}

.m-banner-img {
  width: 100%;
  /*height: 200rpx;*/
  vertical-align: top;
  position: relative;
}

.m-user-info {
  text-align: center;
  /*
  position: absolute;
  top: 115rpx;
  width: 140rpx;
  height: 140rpx;
  left: 50%;
  margin-left: -70rpx;
  */
  z-index: 3;
  color: #666;
  margin-top: 100rpx;
}

.m-user-info image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 120rpx;
  border: 1px solid #fff;
  vertical-align: middle;
  box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);

  position: absolute;
  left: 305rpx;
}

.m-user-info .m-name {
  position: absolute;
  top: 260rpx;
  text-align: center;
  width: 750rpx;
}

.m-user-info text, .m-user-info label {
  line-height: 70rpx;

  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  font-weight: bold;

  .sup {
    font-size: .45rem;
    line-height: .6rem;
    background-color: #ff6700;
    height: .6rem;
    padding: 0 .1rem;
    margin-left: .2rem;
    border-radius: .1rem;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .15)
  }
}

.m-user-info .Phone {
  width: 140rpx;
  height: 140rpx;
  border-radius: 120rpx;
  border: 1px solid #fff;
  vertical-align: middle;
  box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.m-user-info .NickName {
  line-height: 70rpx;
  display: block;
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.member-order-tab {
  font-size: 24rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  line-height: 40rpx;
  /*box-shadow: 0px 0rpx 10rpx rgba(0, 0, 0, 0.35);*/


  border-radius: 14rpx;

  width: 710rpx;
  background: #FFFFFF;
  opacity: 1;


  overflow: hidden;
}

.i-type {
  font-size: 40rpx;
}

.m-cell-hd {
  text-align: center;
  line-height: 56rpx;
}

.member-order-tab .g-flex-item {
  padding: 28rpx 0 20rpx 0;
}

.member-order-tab .g-flex-item:active {
  background-color: #ececec;
}

.my_od {
  border-left: 1px solid #dfdfdf;
}

.all_order {
  position: relative;
  display: block;
}

.m-panel-bd {
  margin-top: 20rpx;


  border-radius: 0 0 14rpx 14rpx;
  overflow: hidden;
}

.m-panel-bd label {
  vertical-align: middle;
  font-size: 50rpx;
  margin: 0rpx 10rpx;
}

.m-cell-primary {
  font-size: 24rpx;
  margin-top: 10rpx;

  label {
    font-size: 24rpx;
  }
}

.m-animate-img {
  width: 100%;
  height: 250rpx;
  overflow: hidden;
  -webkit-animation: imageAnimation 15s linear infinite alternate;
  animation: imageAnimation 15s linear infinite alternate;
  webkit-backface-visibility: hidden;
  -webkit-filter: blur(5px);
  filter: blur(5px);
  margin-top: -20px;
}

.m-animate-warp {
  overflow: hidden;
  height: 200rpx;
  -webkit-animation: imageAnimation 15s linear infinite alternate;
  animation: imageAnimation 15s linear infinite alternate;
}

@-webkit-keyframes imageAnimation {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 0 100%;
  }
}

@keyframes imageAnimation {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 0 100%;
  }
}

.iconBoxLattice .m-cell {
  display: inline-block;
  width: 25%;
  box-sizing: border-box;
  text-align: center;
  vertical-align: top;
  border-right: 1rpx solid #f8f8f8;
  border-bottom: 1rpx solid #f8f8f8;	
 
  .zc:before{
    font-size: 56rpx !important;
  }
}

.iconBoxLattice .m-cell .iconfont, .iconBoxLattice .m-cell .zc {
  font-size: 56rpx !important;
  height: 0.6rem;
  line-height: 0.6rem;
}

.iconBoxLattice .m-cell::before {
  border: none;
}

.iconBoxLattice .m-cell p {
  font-size: 24rpx;
}

.iconBoxLattice .m-cell label {
  font-size: 24rpx;
}

.iconBoxLattice .m-cell label.iconfont {
  font-size: 60rpx;
}

.iconBoxLattice .m-cell label.zc {
  font-size: 48rpx;
}

.iconBoxLattice .m-cell image {
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 60rpx !important;
  height: 60rpx !important;
}

.iconBoxLattice .m-cell-ft {
  display: none;
}

.msk {
  position: fixed;
  top: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.model {
  width: 80%;
  height: 290rpx;
  background: #fff;
  border-radius: 6rpx;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hint {
  height: 200rpx;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hint::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e5e5e5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}

.hint .title {
  font-size: 36rpx;
}

.hint .content {
  width: 80%;
  color: #999999;
  font-size: 30rpx;
  margin-top: 20rpx;
}

.operation {
  height: 90rpx;
  display: flex;
  align-items: center;
}

.cancel,
.success {
  flex: 1;
  background: #fff;
  height: 90rpx;
  font-size: 36rpx;
}

button::after {
  line-height: none;
}

.cancel {
  position: relative;
  text-align: center;
  line-height: 90rpx;
}

.success {
  color: #3cc51f;
  padding: 0;
}

.cancel::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border-right: 2px solid #e5e5e5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}

.m-cell-bd label {
  margin: 0rpx 5rpx;
}


.page, uni-page-wrapper, page {
  background: #F7F7F7;
}

.flex {
  display: flex;
}

.flex.space {
  justify-content: space-between;
}

.flex.center {
  justify-content: center;
}

.flex.alcenter {
  align-items: center;
}

.flex.alend {
  align-items: flex-end
}

.flex.start {
  justify-content: flex-start;
}

.flex.end {
  justify-content: flex-end;
}

.flex.wrap {
  flex-direction: row;
  flex-wrap: wrap;
}

.flex .col1 {
  width: 100%;
}

.flex .col2 {
  width: 50%;
}

.flex .col3 {
  width: 33.33%;
}

.flex .col4 {
  width: 25%;
}

.flex .col5 {
  width: 20%;
}


.ft12 {
  font-size: 24rpx;
}

.ft14 {
  font-size: 28rpx;
}

.ft16 {
  font-size: 32rpx;
}

.ft18 {
  font-size: 36rpx;
}

.ft20 {
  font-size: 40rpx;
}

.ft22 {
  font-size: 44rpx;
}

.ft24 {
  font-size: 48rpx;
}

.ft28 {
  font-size: 56rpx;
}

.ft32 {
  font-size: 64rpx;
}

.ft36 {
  font-size: 72rpx;
}

.ft40 {
  font-size: 80rpx;
}

.ft50 {
  font-size: 100rpx;
}

.ft80 {
  font-size: 160rpx;
}

.text-over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-over2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.text-over3 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.text-line {
  text-decoration: line-through;
}

.text-w {
  color: #FFFFFF;
}

.text-main {
  color: #333333;
}

.text-default {
  color: #000000;
}

.text-info {
  color: #666666;
}

.text-placeholder {
  color: #CCCCCC;
}

.text-notice {
  color: #999999;
}

.text-price {
  color: #FF6D00;
}

.text-load-more {
  color: #ADAEB3;
}

.text-theme {
  color: #FF6D00
}

.text-sign {
  color: #FF4F4E;
}

.text-yellow {
  color: #FF9B20;
}

.text-plus {
  color: #F2D591;
}

.bg-w {
  background: #FFFFFF;
}

.bg-default {
  background: #F7F7F7;
}

.bg-main {
  background: #FF6D00;
}

.bg-yellow {
  background: #FFB70E;
}

.bg-info {
  background: #F0F0F0;
}

.bg-invite {
  background: #C79A2F;
}

.mt10 {
  margin-top: 10rpx;
}

.mt15 {
  margin-top: 15rpx;
}

.mt20 {
  margin-top: 20rpx;
}

.mt30 {
  margin-top: 30rpx;
}

.mt40 {
  margin-top: 40rpx;
}

.mt50 {
  margin-top: 50rpx;
}

.mt60 {
  margin-top: 60rpx;
}

.mt80 {
  margin-top: 80rpx;
}

.mt240 {
  margin-top: 240rpx;
}

.mb10 {
  margin-bottom: 10rpx;
}

.mb15 {
  margin-bottom: 15rpx;
}

.mb20 {
  margin-bottom: 20rpx;
}

.mb30 {
  margin-bottom: 30rpx;
}

.mb40 {
  margin-bottom: 40rpx;
}

.mb50 {
  margin-bottom: 50rpx;
}

.mb60 {
  margin-bottom: 60rpx;
}

.ml10 {
  margin-left: 10rpx;
}

.ml15 {
  margin-left: 15rpx;
}

.ml20 {
  margin-left: 20rpx;
}

.ml30 {
  margin-left: 30rpx;
}

.ml40 {
  margin-left: 40rpx;
}

.ml50 {
  margin-left: 50rpx;
}

.ml60 {
  margin-left: 60rpx;
}

.mr10 {
  margin-right: 10rpx;
}

.mr15 {
  margin-right: 15rpx;
}

.mr20 {
  margin-right: 20rpx;
}

.mr30 {
  margin-right: 30rpx;
}

.mr40 {
  margin-right: 40rpx;
}

.mr50 {
  margin-right: 50rpx;
}

.mr60 {
  margin-right: 60rpx;
}

/**一般PADDING需要用到的值,其他的不通用的单独设置**/
.pt10 {
  padding-top: 10rpx;
}

.pt20 {
  padding-top: 20rpx;
}

.pt30 {
  padding-top: 30rpx;
}

.pt40 {
  padding-top: 40rpx;
}

.pt60 {
  padding-top: 60rpx;
}

.pt90 {
  padding-top: 90rpx;
}

.pt100 {
  padding-top: 100rpx;
}

.pt120 {
  padding-top: 120rpx;
}

.pt160 {
  padding-top: 160rpx;
}

.pd20 {
  padding: 20rpx;
}

.pd30 {
  padding: 30rpx;
}

.pd40 {
  padding: 40rpx;
}

.plr30 {
  padding: 0rpx 30rpx;
}

.plr40 {
  padding: 0rpx 40rpx;
}

.plr60 {
  padding: 0rpx 60rpx;
}

.pr30 {
  padding-right: 30rpx;
}

.pl20 {
  padding-left: 20rpx;
}

.pl30 {
  padding-left: 30rpx;
}

.pl50 {
  padding-left: 50rpx;
}

.pb20 {
  padding-bottom: 20rpx;
}

.pb30 {
  padding-bottom: 30rpx;
}

.pb40 {
  padding-bottom: 40rpx;
}

/*圆角通用的设置*/
.bdr8 {
  border-radius: 8rpx;
}

.bdr16 {
  border-radius: 16rpx;
}

.bdr32 {
  border-radius: 32rpx;
}


.userinfo-box {
  color: #fff;

  .sup {
    font-size: 8px;
    line-height: 12px;
    background-color: #ff6700;
    height: 12px;
    padding: 2px 2px;
    border-radius: .1rem;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .15)
  }
}

.invite-item {
  width: calc(50% - 15rpx);
  height: 144rpx;
  border-radius: 16rpx;
  background: #FFFFFF;
}

.invite-item image {
  width: 80rpx;
  height: 80rpx;
}

.member-face {
  width: 120rpx;
  height: 120rpx;
  border-radius: 120rpx;
  border: 2px solid white;
}

.sign-btn {
  width: 160rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);
  border-radius: 32rpx;
}

.sign-btn image {
  width: 40rpx;
  height: 36rpx;
}

.sign-icon {
  &::before {
    font-size: 36rpx;
    line-height: 36rpx;
  }
}

.sign-text {
  font-size: 28rpx;
  line-height: 36rpx;
}

.unio2o-plus-box {
  width: 100%;
  height: 140rpx;

  background: url(data:image/png;base64,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) no-repeat;
  background-size: 100% 100%;
}

.unio2o-plus-box .plus-main {
  padding-top: 30rpx;
  padding-left: 60rpx;
  padding-right: 60rpx;
  color: #E3BE49;
}

.plus-text {
  background: linear-gradient(90deg, rgba(255, 230, 172, 1) 0%, rgba(233, 183, 64, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plug-btn {
  width: 172rpx;
  height: 64rpx;
  background: linear-gradient(90deg, rgba(255, 230, 172, 1) 0%, rgba(242, 213, 145, 1) 100%);
  border-radius: 32rpx;
}


.invite-face {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
}

.input-info {
  width: 630rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 16rpx;
  border: 2rpx solid rgba(230, 230, 230, 1);
}


.u-top3 {
  position: fixed;
  right: 0rpx;
  top: 138rpx;
  z-index: 99;
  height: 67rpx;
}

.inter_bj {
  width: 100%;
  height: 100%;
}

.jifen_inter {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 20%;
  left: 12%;
}


.alert {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  position: fixed;
  left: 15%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  align-items: center;
}

.anniu_qd {
  font-size: 12px;
  color: #292929;
  padding-left: 0;
  padding-right: 0;
  line-height: 38rpx;
  letter-spacing: 10rpx;
  background: #fff;
  width: 120rpx;
  height: 58rpx;
  border-radius: 0;
  border-top-left-radius: 36rpx;
  border-bottom-left-radius: 36rpx;
}

.alert1 {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  position: fixed;
  left: 15%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.inter_bj {
  width: 100%;
  height: 100%;
}

.jifen_inter {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 20%;
  left: 12%;
}


.m-ber {
  /* padding:20rpx; */
  margin-top: 20rpx;
  background: rgba(255, 255, 255, 1);

  border-radius: 14rpx 14rpx 0 0;

  .m-cell {

    &::after {

      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ebebe7;
      color: #ebebe7;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      /*left: 30rpx;
      right: 30rpx;*/
    }

    &::before {
      border: none;
    }
  }


  .m-ber-image {
    width: 46rpx;
    height: 46rpx;
    float: left;
    margin-top: -2rpx;
    margin-right: 10rpx;

  }

  .m-ber-image img {
    width: 100%;
    height: 100%;
  }

  .m-ber-n {
    // padding-left:30rpx;

  }


  .m-ber-title {
    font-size: 32rpx;
    line-height: 32rpx;
    font-weight: 600;
  }

  .nav-image {
    width: 12rpx;
    height: 24rpx;
  }

  .m-ber-quan {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    padding-top: 40rpx;
    padding-bottom: 20rpx;
  }

  .m-ber-l {
    font-size: 12px;
    text-align: center;
    background: rgba(255, 255, 255, 1);
    line-height: 20px;
    position: relative;
    color: #999;
  }
}


.unio2o-plus-box {
  width: 100%;
  height: 140rpx;
}

.unio2o-plus-box .plus-main {
  padding-top: 30rpx;
  padding-left: 60rpx;
  padding-right: 60rpx;
  color: #E3BE49;
}

.plus-text {
  background: linear-gradient(90deg, rgba(255, 230, 172, 1) 0%, rgba(233, 183, 64, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plug-btn {
  width: 172rpx;
  height: 64rpx;
  background: linear-gradient(90deg, rgba(255, 230, 172, 1) 0%, rgba(242, 213, 145, 1) 100%);
  border-radius: 32rpx;
}

.res-num {
  line-height: 32rpx;
  height: 32rpx;
  font-size: 28rpx;
  font-weight: 400;
}

.res-name {
  margin-top: 12rpx;
  line-height: 32rpx;
  height: 32rpx;
  font-size: 22rpx;
  font-weight: 300;
}

.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  background: transparent;
}

.badge {
  margin-top: 2rpx !important;
  right: 64rpx;
}

.iconBoxLattice {
  .badge {
    margin-top: -12rpx !important;
    right: 18rpx;
  }
}

.item-box {
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.item-box-container {
  position: absolute;
  top: calc(284rpx + var(--status-bar-height));
  left: 0rpx;
  right: 0;
  z-index: 1;
}


.new-badge {
  position: absolute;
  right: 48rpx;
  /* #ifndef MP-WEIXIN*/
  right: -20rpx;
  top: -20rpx;
  /* #endif */
}

.main-color{
  color:#ff6700;
}
</style>
