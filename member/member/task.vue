<template>
  <view class="page">
    <scroll-view class='u-pa1' @scrolltolower="scrollbottom" scroll-y="true"
                 @scroll="scrolltoupper">
      <view :class="flag||flag1?'cover':''" style="z-index:9"></view>

      <view style="background:#f7f7f7;position:relative">
        <view class="header">
          <view :class="member.IsEnabled?'header-top':'if_carh1'">
            <view style="width: 94%;margin: 0 auto;border-radius: 12px;"
                  :class="member.IsEnabled?'if_carh2':'if_carh3'">
              <view style="width: 100%;display: flex;" :class="member.IsEnabled?'':'if_carh'">
                <view class="message"
                      style="flex: 1;margin-top: 4%;width:140rpx;height:140rpx;border-radius:120rpx;border:1px solid #fff;vertical-align:middle;overflow:hidden;margin-left:4%;">
                  <image lazy-load style="width:140rpx;height:140rpx;" :src="(UserInfo.user_avatar)"></image>
                </view>
                <view class="grade"
                      style="flex: 4;text-align:left;text-align:left;font-family:PingFangSC-Semibold;font-size:14px;color:#4A4A4A;font-weight:bold;">
                  <view>{{ message.user_nickname }}</view>
                  <view
                      style="margin: 2% 0 0 0;text-align: left;font-family: PingFangSC-Regular;font-size: 22rpx;color: #8f6846;">
                    {{ plantformInfo.user_level_map[userInfo.user_level_id] || __('普通会员') }}
                  </view>
                </view>
              </view>
              <view v-if="member.IsEnabled == true" class='card_vip' style="overflow: hidden;">
                <view class='show_card' data-index="index" style='position: relative;'>
                  <view class='name_card' v-if="member.IsReceive == false"
                        style="position: absolute;top: 13%;left: 24%;font-family: PingFangSC-Semibold;color: #4A4A4A;letter-spacing: 0;width: 54%;text-align: center;">
                    {{ message.user_level_name }}{{ __('会员卡') }}
                  </view>
                  <view class='name_card' v-if="member.IsReceive == true"
                        style="position: absolute;top: 23%;left: 5%;font-family: PingFangSC-Semibold;color: black;">
                    {{ message.user_level_name }}{{ __('会员卡') }}
                  </view>
                  <view v-if="member.IsEnabled && member.IsReceive && member.ReciveStatus == 1 && member.IsToWeixin"
                        @tap='openCard'
                        style="position: absolute;top: 54%;left: 5%;font-size: 22rpx;color: #9B9B9B;font-family: PingFangSC-Semibold;"
                        class='num_card'>{{ message.user_level_card }}
                  </view>
                  <view v-if="false && message.user_level_card != null && member.IsReceive&& member.IsToWeixin== false "
                        style="position: absolute;top: 54%;left: 5%;font-size: 22rpx;color: #9B9B9B;font-family: PingFangSC-Semibold;"
                        @tap='cardvip' class='num_card'>{{ message.user_level_card }}
                  </view>
                  <view
                      v-if="member.ReciveStatus == 2  && member.IsToWeixin &&message.user_level_card != null&& member.DrawMethod == 1"
                      style="position: absolute;top: 56%;left:-2%;font-size:22rpxcolor: #9B9B9B;font-family: PingFangSC-Semibold;"
                      class='num_card'>
                    <button
                        style="background: #fcf3f4;width:200rpx;text-align: center;position: absolute;top: 54%;border-radius: 49rpx;font-family: PingFangSC-Semibold;font-size:22rpx"
                        class='num_card' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
                        hidden="showPhoneNumber">
                      <view style=' color:#9B9B9B'>{{ message.user_level_card }}</view>
                    </button>
                  </view>
                  <view @click.stop="cardDetail"
                        v-if="member.ReciveStatus == 2  && member.IsToWeixin &&message.user_level_card != null&& member.DrawMethod == 2"
                        style="position: absolute;top: 56%;left:5%;font-size:22rpx;color: #9B9B9B;font-family: PingFangSC-Semibold;"
                        class='num_card'>{{ message.user_level_card }}
                  </view>
                  <view v-if="member.IsEnabled && member.IsReceive && member.ReciveStatus == 1 && member.IsToWeixin "
                        @tap='openCard'
                        style="width: 120rpx;height: 120rpx;background: #F92C46;border-radius: 50%;position: absolute;top: 32%;right: 6%;">
                    <image src='https://static.shopsuite.cn/xcxfile/appicon/img/erweima.png'
                           style="border-radius: 0;width: 49%;height: 49%;position: absolute;top: 25%;left: 25%;"></image>
                  </view>
                  <view
                      v-if="false && message.user_level_card != null && member.IsReceive&& member.IsToWeixin== false  "
                      @tap='cardvip'
                      style="width: 120rpx;height: 120rpx;background: #F92C46;border-radius: 50%;position: absolute;top: 32%;right: 6%;">
                    <image src='https://static.shopsuite.cn/xcxfile/appicon/img/erweima.png'
                           style="border-radius: 0;width: 49%;height: 49%;position: absolute;top: 25%;left: 25%;"></image>
                  </view>
                  <view v-if="member.ReciveStatus == 2  && member.IsToWeixin &&message.user_level_card != null "
                        @tap='getPhoneNumber'
                        style="width: 120rpx;height: 120rpx;background: #F92C46;border-radius: 50%;position: absolute;top: 32%;right: 6%;">
                    <image src='https://static.shopsuite.cn/xcxfile/appicon/img/erweima.png'
                           style="border-radius: 0;width: 49%;height: 49%;position: absolute;top: 25%;left: 25%;"></image>
                  </view>
                  <button
                      style="background: #F92C46;width: 41%;/*padding-right: 47%*/text-align: center;position: absolute;top: 60%;right: 29%;border-radius: 27px;"
                      class='num_card' v-if="member.DrawMethod == 1 && member.IsReceive == false"
                      open-type="getPhoneNumber"
                      @getphonenumber="getPhoneNumber" hidden="showPhoneNumber">
                    <view>{{ __('立即领取') }}</view>
                  </button>
                  <view
                      style="background: #F92C46;width: 48%;text-align:center;position: absolute;top: 60%;right: 24%;border-radius: 49rpx;"
                      @click.stop="cardDetail" v-if="member.DrawMethod == 2 && member.IsReceive == false"
                      class='num_card'>{{ __('立即领取') }}
                  </view>
                </view>
              </view>
            </view>
            <view v-if="member.IsEnabled && member.IsReceive && member.ReciveStatus == 1 && member.IsToWeixin "
                  @tap='openCard' class='wx_kb grade'>
              <image style="width: 106px;height: 29px;border-radius: 0;"
                     src='https://static.shopsuite.cn/xcxfile/appicon/img/cardp-bg.png'></image>
            </view>
          </view>
        </view>
        <view :class="member.IsEnabled?'header-bottom':'if_carh4'">
          <navigator url="/member/member/growth" class="growth">
            <view class="num">{{ message.user_exp }}</view>
            <view style='color:#9B9B9B;'>{{ __('成长值') }}</view>
          </navigator>
          <navigator url="/member/cash/predeposit" class="growth">
            <view class="num">{{ number_format(message.user_money, 2) }}</view>
            <view style='color:#9B9B9B;'>{{ __('余额') }}</view>
          </navigator>
          <navigator url="/integral/integral/integral" class="integral">
            <view class="num">{{ number_format(message.user_points) }}</view>
            <view style='color:#9B9B9B;'>{{ __('积分') }}</view>
          </navigator>
        </view>


        <view class="prerogative" style='padding:130rpx 0 20rpx 0;margin-top:0'>
          <view class="prerogative-top">
            <text style="margin-left: 5px;color: #8f6846;font-size: 32rpx;">{{ __('会员权益') }}</text>
          </view>
        </view>

        <view class="prerogative1" v-if="message.user_level_rate==100||message.user_level_rate==0">
          <view class="prerogative-bottom">{{ __('尊敬的会员，您现在无会员折扣可以使用。') }}
          </view>
        </view>
        <view class="prerogative1" v-else>
          <view class="prerogative-bottom">{{ __('尊敬的会员，您在购物时可享受') }}{{ message.user_level_rate / 10 }}{{ __('折优惠') }}
          </view>
        </view>
        <view style='background:#fff'>
          <view class="prerogative">
            <view class="prerogative-top">
              <text style="margin-left: 5px;color: #8f6846;font-size: 32rpx;">{{ __('任务中心') }}</text>
            </view>
          </view>
          <view class="mission" style='padding:26rpx 0rpx' v-if="true">
            <view class="draw">
              <image style='width:12px;height:12px'
                     src="https://static.shopsuite.cn/xcxfile/appicon/img/qiandao.png"></image>
              <text>{{ __('签到领积分') }}</text>
            </view>
            <button style="margin-right: 0px;padding-left: 9rpx; padding-right: 9rpx; " @click="click"
                    :class="'color'"> {{isSign ?  __('去签到') : __('已签到') }}
            </button>
          </view>
          <view class="mission" style='padding:26rpx 0rpx'>
            <view class="draw">
              <image style='width:12px;height:10px'
                     src="https://static.shopsuite.cn/xcxfile/appicon/img/gouwu.png"></image>
              <text>{{ __('购物领积分') }}</text>
            </view>
            <navigator open-type="switchTab" class="button" url="/pages/index/index">{{ __('去购物') }}
            </navigator>
          </view>
          <view class="mission" style='padding:26rpx 0rpx'>
            <view class="draw">
              <image style='width:12px;height:12px'
                     src="https://static.shopsuite.cn/xcxfile/appicon/img/pinglun.png"></image>
              <text>{{ __('评价领积分') }}</text>
            </view>
            <navigator class="button" url="/member/order/list?type=2060&sl=4">{{ __('去评价') }}
            </navigator>
          </view>
          <view class="alert" v-if="flag" style="z-index:1000">
            <image style="width:50rpx;height:50rpx"
                   src="https://static.shopsuite.cn/xcxfile/appicon/img/true.png"></image>
            <text style="margin-left:20rpx">{{ signMsg }}</text>
          </view>
          <view class="alert1" v-if="(flag1)" style="z-index:1000">
            <view>{{ __('抱歉！今日您已签到') }}</view>
            <view style="margin-top:20rpx">{{ __('~明天再来哦~') }}</view>
          </view>
        </view>
      </view>

      <guess-you-like ref="guessYouLike" :titleText="__('——猜你喜欢——')"></guess-you-like>
    </scroll-view>
    <view class="u-top-default">
      <navigator url='/pages/index/index' open-type="switchTab" class="u-back2">
        <image src='http://appicon-1253690476.file.myqcloud.com/endorsement/gohome.png'></image>
      </navigator>
    </view>
  </view>
</template>


<script>
import {mapMutations, mapState} from 'vuex'

import guessYouLike from '@/components/product-list.vue'

export default {
  data: function () {
    return {
      message: "",
      member: {
        IsEnabled: true,
        IsReceive: true,
        CardNum: 111,
        CardName: "sss",
        ReciveStatus: 2,
        IsToWeixin: false,
        DrawMethod: 2
      },
      con: "",
      Info: "",
      UserInfo: "",
      flag: false,
      flag2: false,
      flag1: false,
      flag3: false,
      isSign: true,
      signMsg: '',
      screenHeight: 0,
      isquicknav: false,
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  components: {
    guessYouLike
  },
  onLoad: async function (options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('会员中心')
    });

    var that = this;


    this.forceUserInfo(function (user) {
      that.setData({
        UserInfo: user
      });
      that.load();
    });

  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'reloadUserResource']),

    scrollbottom: function (a) {
      this.$refs.guessYouLike.scrollbottom();
    },
    scrolltoupper: function (a) {
      a.detail.scrollTop >= this.screenHeight ? this.setData({isquicknav: true}) : this.setData({isquicknav: false})
    },

    getPhoneNumber: function (a) {
      if (-1 < a.detail.errMsg.indexOf("ok")) {
        if (0 == (o = this).member.IsToWeixin) {
          var e = {
            userId: app.globalData.UserInfo.Id,
            vendorId: app.globalData.VendorInfo.Id,
            cardId: o.member.Id,
            phone: app.globalData.UserInfo.Phone
          };
          $.xsr($.makeUrl(user.AddMemberCard, e), function (a) {
            //console.log("buzhidao:", a), 0 == a.Code && $.alert(a.Info.Msg), o.onLoad()
          })
        } else {
          o.GetMemberCard();
          var o = this, t = {vendorId: app.globalData.VendorInfo.Id, cardInfo: o.member.WeixinId};
          $.xsr($.makeUrl(user.GetMemberCardPostInfo, t), function (a) {
            o.setData({
              id: a.Info.id,
              tsamp: a.Info.tsamp,
              nonstr: a.Info.nonstr,
              sign: a.Info.sign
            }), wx.addCard({
              cardList: [{
                cardId: o.id,
                cardExt: '{ "timestamp":' + o.tsamp + ', "signature":"' + o.sign + '","nonce_str":"' + o.nonstr + '"}'
              }], success: function (a) {
                o.onLoad();
                var e = {
                  vendorId: app.globalData.VendorInfo.Id,
                  userId: app.globalData.UserInfo.Id,
                  cCode: a.cardList[0].code,
                  cCard: a.cardList[0].cardId,
                  cardId: o.member.Id
                };
                $.xsr($.makeUrl(user.GetMCardRelationInfo, e), function (a) {
                  o.onLoad()
                });
                var t = {
                  userId: app.globalData.UserInfo.Id,
                  vendorId: app.globalData.VendorInfo.Id,
                  cardId: o.member.Id,
                  phone: app.globalData.UserInfo.Phone
                };
                $.xsr($.makeUrl(user.AddMemberCard, t), function (a) {
                  0 == a.Code && ($.alert(a.Info.Msg), o.onLoad())
                })
              },
              fail: function (a) {
              }
            })
          })
        }
      }
    },

    openCard: function () {
    },

    load: function () {
      var that = this,
          params = {
            user_id: this.userInfo.user_id,
          };

      that.$.request({
        url: this.Config.URL.user.signState,
        data: params,
        success: function (data, status, msg, code) {
          that.setData({
            isSign: status == 250 ? 1 : 0
          })
        }
      });


      that.setData({
        message: this.userInfo
      })

      that.message.user_level_rate = that.plantformInfo.user_level_rate_map[this.userInfo.user_level_id]
    },

    click: function () {
      let that = this;
      that.$.navigateTo({url: "/member/member/sign"})
      return;
      let param = {
        user_id: this.userInfo.user_id
      };

      that.$.request({
        url: this.Config.URL.user.signIn,
        data: param,
        success: function (data, status, msg, code) {
          that.reloadUserResource(function (user_info) {
          });
          that.setData({
            flag: !that.$.isNull(data)
          });
          that.setData({
            signMsg: msg
          });
          if (200 == status) {
            that.setData({
              flag: true
            });
            setTimeout(function () {
              that.setData({
                flag: false
              })
            }, 2e3)
          } else {
            that.setData({
              flag1: true
            });
            setTimeout(function () {
              that.setData({
                flag1: false
              })
            }, 2e3);
          }

          that.load()
        }
      });
    },
    cardDetail: function (a) {
      wx.navigateTo({url: "../vip_ind/vip_ind?cardid=" + this.member.Id})
    },
    cardvip: function (a) {
      wx.navigateTo({url: "/member/member/card"})
    },
    copyId: function (user_id) {
      uni.setClipboardData({
        data: user_id,
        complete() {
          uni.showToast({
            title: "已复制到剪贴板"
          })
        }
      })
    }
  }
};
</script>


<style lang="scss">
@import "../../styles/_variables";

.header {
  width: 100%;
  background: $default-skin-bg;
  padding-top: 20rpx;
}

.header-top {
  width: 100%;
  height: 290rpx;
  background: $default-skin-bg;
  justify-content: left;
}

.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.butoo {
  background-color: #f7f7f7;
  width: 200px;
  color: red;
  text-align: left;
  padding-left: 5px;
  margin-top: 0px;
  margin-left: 15px;
}

/* .message { margin-top: 30rpx; } */
.grade {
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  padding: 49rpx 0 0 20rpx
}

.header-top image {
  width: 118rpx;
  height: 118rpx;
  border-radius: 50%;
}

.header-bottom {
  width: 94%;
  height: 120rpx;
  background: #fff;
  padding: 20rpx 0;
  display: flex;
  margin: 0 auto;
  border-radius: 21rpx;
  position: absolute;
  top: 236rpx;
  left: 3%;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.048)
}

.growth {
  width: 50%;
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  margin-top: 2%;
}

.integral {
  width: 50%;
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  margin-top: 2%;
}

.num {
  margin-bottom: 10rpx;
  color: #8f6846;
  font-family: Tahoma-Bold;
  font-size: 26rpx;
}

.prerogative {
  margin-top: 20rpx;
  padding: 45rpx 0 20rpx 0;
  background: #fff;
}

.prerogative-top {
  border-left: 6rpx solid #fff;
  font-size: 28rpx;
  height: 28rpx;
  margin-left: 5%;
  line-height: 28rpx;
}

.prerogative1 {
  padding: 0 0 50rpx 0;
  background: #fff;
}

.prerogative-bottom {
  font-size: 26rpx;
  height: 28rpx;
  margin-left: 7%;
  color: #9B9B9B;
}

.color {
  width: 106rpx;
  height: 48rpx;
  display: flex;
  justify-content: center;
  line-height: 48rpx;
  font-size: 24rpx;
  background: $default-skin-bg;
  color: #fff;
  border-radius: 10rpx;
}

/* .mission{ padding: 26rpx 0; border-top:1px solid #d9d9d9; position: relative; background: #fff; display: flex; justify-content: space-between; align-items: center } .mission::before{ content:" "; position:absolute; top:0; right:0; height:1px; border-top:1px solid #ebebe7; color:#ebebe7; -webkit-transform-origin:0 0; transform-origin:0 0; -webkit-transform:scaleY(0.5); transform:scaleY(0.5); } */
.mission {
  padding: 20rpx 0rpx;
  display: -webkit-box;
  position: relative;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  width: 85%;
  margin: 0 auto;
}

.mission::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #f1f1f1;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.button {
  width: 106rpx;
  height: 48rpx; /* text-align: center; */
  display: flex;
  justify-content: center;
  line-height: 48rpx;
  font-size: 24rpx;
  color: #fff;
  border-radius: 10rpx;
}

.draw {
  font-size: 28rpx;
  height: 40rpx;
  line-height: 40rpx;
  display: flex;
  align-items: center;
}

.draw image {
  width: 40rpx;
  height: 40rpx;
}

.draw text {
  margin-left: 20rpx;
}

.alert {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  position: absolute;
  left: 15%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  align-items: center;
}

.alert1 {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  position: absolute;
  left: 15%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.u-back2 image {
  border-radius: 100%;
  width: 77rpx;
  height: 77rpx;
  border: 1px solid #eee;
  font-size: 20rpx;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.35);
  z-index: 999;
  opacity: 0.8;
  line-height: 77rpx;
  margin-bottom: 20rpx;
}

.wx_kb {
  width: 100%;
  text-align: right;
  position: absolute;
  top: 1%;
  right: 3%;
}

.if_carh {
  height: 205rpx;
}

.if_carh1 {
  width: 100%;
  height: 223rpx;
  background: #db384c;
  justify-content: left;
}

.if_carh2 {
  background: #fcf3f4;
  padding-bottom: 20rpx;
}

.if_carh3 {
  background: #fff;
}

.if_carh4 {
  position: absolute;
  top: 17%;
  left: 3%;
  width: 94%;
  height: 153rpx;
  background: #fff;
  padding: 20rpx 0;
  display: flex;
  margin: 0 auto;
  border-radius: 21rpx;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1)
}

.if_carh5 {
  background: #fff;
}

.card_vip {
  width: 100%;
  height: 253rpx;
  display: none;
}

.show_card {
  width: 91%;
  height: 192rpx;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0 auto
}

.name_card {
  float: left;
  color: white;
  line-height: 102rpx;
  font-size: 24rpx;
}

.num_card {
  color: white;
  line-height: 75rpx;
  font-size: 32rpx;
}

.overbalance {
  width: 100%;
  margin: 22rpx auto;
  box-sizing: border-box;
  background: #fff;
}

.overbalanceTitle {
  width: 100%;
  height: 88rpx;
  font-family: PingFangSC-Medium;
  font-size: 26rpx;
  color: #000;
  font-weight: 500;
  line-height: 37rpx;
  padding-top: 27rpx;
  padding-bottom: 24rpx;
  box-sizing: border-box; /* letter-spacing: 0; */
  background: #fff;
  box-shadow: 0 2rpx 0 0 #efefef;
  padding-right: 24rpx;
}

.overbalanceTitle image {
  width: 23rpx;
  height: 26rpx;
  margin-right: 15rpx;
}

.overbalanceConversion {
  width: 100%;
  height: 469rpx;
  padding: 30rpx;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
}

.everyConversion {
  display: inline-block;
  width: 300rpx;
  height: 430rpx;
  margin-right: 20rpx;
  padding: 20rpx 25rpx 34rpx;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 5rpx 10rpx 0 rgba(0, 0, 0, 0.06);
  border-radius: 8rpx;
}

.everyConversion .moreCoupon {
  width: 250rpx;
  height: 250rpx;
  background-image: linear-gradient(-225deg, #f87c5e 0%, #db384c 100%);
  margin-bottom: 24rpx;
  border-radius: 8rpx;
  text-align: center;
  box-sizing: border-box;
  font-size: 24rpx;
  line-height: 33rpx;
  padding-top: 55rpx;
  color: #fff;
}

.moreCoupon view:first-child {
  width: 100%;
  height: 90rpx;
  margin: 0 auto;
  text-align: center;
  font-size: 40rpx;
}

.moreCoupon view:first-child text {
  font-size: 64rpx;
  line-height: 90rpx;
}

.moreCoupon view:last-child {
  width: 100%;
  text-align: center;
  padding: 0 10rpx;
  box-sizing: border-box;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.everyConversion image {
  display: block;
  width: 250rpx;
  height: 250rpx;
  margin-bottom: 24rpx;
}

.everyConversion .titel {
  display: block;
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  line-height: 33rpx;
  color: #000; /* letter-spacing: 0; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 19rpx;
}

.everyConversion .integralBtn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}

.everyConversion .integralBtn text {
  font-family: PingFangSC-Semibold;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #db384c; /* letter-spacing: 0; */
}

.everyConversion .integralBtn button {
  width: 100rpx;
  height: 50rpx;
  background: #db384c;
  border-radius: 10rpx;
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  color: #fff; /* letter-spacing: 0; */
  padding: 0;
  margin: 0;
  line-height: 50rpx;
}

.m-listv {
  margin-top: 20rpx;
  background: #f8f8f8;
  padding: 0 4rpx 0 16rpx;
  overflow: hidden;
}

.recommend {
  text-align: center;
  padding: 20rpx 0;
  color: #DB384c;
  font-size: 30rpx;
  font-weight: bold
}

.m-listv .m-product-item {
  margin: 10rpx;
  width: 345rpx;
  height: 520rpx;
  overflow: hidden;
  float: left;
  border-radius: 8rpx;
  background-color: #fff;
}

.m-listv .m-product-img {
  width: 345rpx;
  height: 345rpx;
  float: left;
  text-align: center;
}

.m-product-img image {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20rpx;
}

.m-product-info {
  height: 210rpx;
  width: 538rpx;
  float: left;
  box-sizing: border-box;
  padding: 20rpx 0;
  position: relative;
}

.m-listv .m-product-name {
  width: 345rpx;
  height: 100rpx;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  position: relative;
}

.m-product-name label {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.m-listv .m-product-price {
  padding: 0 20rpx;
  font-size: 32rpx;
  line-height: 40rpx;
  color: #DB384C;
}

.m-product-price label {
  font-size: 24rpx;
}

.msk2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.m-coupon-box {
  background-color: #db384c;
  padding: 10rpx 25rpx 35rpx 25rpx;
  border-radius: 35rpx;
  width: 62%;
  margin: 25% auto;
}

.coupon_title {
  font-size: 52rpx;
  color: #fff;
  margin: 30rpx auto;
  text-align: center;
  letter-spacing: 3rpx;
}

.coupon_back {
  width: 468rpx;
  height: 450rpx;
}

.shopbox {
  display: flex;
  align-items: center;
  padding: 28rpx 48rpx 22rpx 38rpx;
}

.shop_name {
  font-size: 28rpx;
}

.context_box {
  margin: 10rpx auto 0;
  display: flex;
  align-items: center;
  color: #db384c;
}

.left {
  margin-right: 20rpx;
  text-align: center;
  width: 30%;
  max-width: 45%;
  overflow: hidden;
}

.left2 {
  margin-right: 20rpx;
  text-align: center;
  width: 35%;
  max-width: 50%;
  overflow: hidden;
  line-height: 53px;
  font-size: 38rpx;
}

.right {
  margin: auto 0;
  overflow: hidden;
}

.youhuiquan {
  border-bottom: 1rpx solid #db384c;
  overflow: hidden;
  height: 47rpx;
  max-width: 280rpx;
  line-height: 43rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.manjian {
  max-width: 306rpx;
  line-height: 50rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.youxiaoqi {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 22rpx; /* text-align: center; */
  padding-left: 38rpx;
}

.lijishiyong_box {
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lijishiyong {
  width: 250rpx;
  height: 60rpx;
  background-color: #db384c;
  color: #fff;
  border-radius: 35rpx;
  letter-spacing: 4rpx;
  text-align: center;
  font-size: 28rpx;
  line-height: 60rpx;
  margin-top: 32rpx;
}

.close_msk1 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 124rpx;
}

</style>
