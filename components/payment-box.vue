<template name="payment-box">
  <view :class="['shareMsk', showBoxView?'':'hide']" style="z-index: 999;">
    <view :class="['sharebox', showBoxView?'bounceInUp animated':'bounceOutDown animated']" style="height: auto;">
      <view class="uni-padding-wrap" style="z-index:200">
        <view style="background:#FFF; padding:50rpx 0;">
          <view class="uni-hello-text uni-center">{{ __('支付金额') }}</view>
          <view class="uni-h1 uni-center uni-common-mt">
            <text class="rmbLogo">{{ __('￥') }}</text>
            {{ paymentDataDefault.order_money_amount }}
          </view>
        </view>

        <view class="uni-list">
          <label class="uni-list-cell uni-list-cell-pd"
                 v-if="defaultUserMoney && paymentDataDefault.user_money && blanceChannel.money">
            <view>
              {{ sprintf(__('账户余额 (￥%s)'), paymentDataDefault.user_money) }}
            </view>
            <view>
              <switch @change="switchMoney"/>
            </view>
          </label>
          <label class="uni-list-cell uni-list-cell-pd"
                 v-if="defaultUserMoney && paymentDataDefault.user_points && blanceChannel.points">
            <view>
              {{ sprintf(__('账户积分 (￥%s)'), paymentDataDefault.user_points) }}
            </view>
            <view>
              <switch @change="switchPoints"/>
            </view>
          </label>

          <label class="uni-list-cell uni-list-cell-pd"
                 v-if="defaultUserMoney && paymentDataDefault.user_recharge_card && blanceChannel.recharge_card">
            <view>
              {{ sprintf(__('充值余额 (￥%s)'), paymentDataDefault.user_recharge_card) }}
            </view>
            <view>
              <switch @change="switchRechargeCard"/>
            </view>
          </label>

          <label class="uni-list-cell uni-list-cell-pd"
                 v-if="defaultUserMoney && paymentDataDefault.user_sp && blanceChannel.sp">
            <view>
              {{ sprintf(__('现金券 (￥%s)'), paymentDataDefault.user_sp) }}
            </view>
            <view>
              <switch @change="switchSp"/>
            </view>
          </label>

          <label v-if="defaultUserMoney && (userMoney || userPoints || userSp || userRechargeCard)"
                 class="uni-list-cell uni-list-cell-pd" style="line-height: 50px;height: 50px;padding: 0rpx 30rpx;">
            <view>
              <input class="uni-input" password type="text" :placeholder="__('请输入支付密码')" name="password"
                     :value="password" @input="passwordChange"
                     style="width:100%;"/>
            </view>
          </label>


          <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
          <radio-group @change="paymentChange">
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList"
                   v-if="$.inArray(h5WeChatMPpayList, item.id)" :key="index">
              <view style="line-height: 35px;height: 35px;">
                <image :src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
                       mode="heightFix" style="height: 35px;"></image>
              </view>
              <view>
                <radio :value="index+''" :checked="index==paymentIndex"/>
              </view>
            </label>
          </radio-group>
          <!-- #endif -->

          <!-- #ifdef APP-PLUS -->
          <radio-group @change="paymentChange">
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList" :key="index">
              <view style="line-height: 35px;height: 35px;">
                <image :src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
                       mode="heightFix" style="height: 35px;"></image>
              </view>
              <view>
                <radio :value="index+''" :checked="index==paymentIndex ? true : false"/>
              </view>
            </label>
          </radio-group>
          <!-- #endif -->

          <!-- #ifdef H5 -->
          <radio-group @change="paymentChange" v-if="isWeixin">
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList"
                   v-if="$.inArray(h5WeChatpayList, item.id)" :key="index">
              <view style="line-height: 35px;height: 35px;">
                <image :src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
                       mode="heightFix" style="height: 35px;"></image>
              </view>
              <view>
                <radio :value="index+''" :checked="index==paymentIndex"/>
              </view>
            </label>
          </radio-group>
          <radio-group @change="paymentChange" v-else>
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList" :key="index">
              <view style="line-height: 35px;height: 35px;">
                <image :src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
                       mode="heightFix" style="height: 35px;"></image>
              </view>
              <view>
                <radio :value="index+''" :checked="index==paymentIndex"/>
              </view>
            </label>
          </radio-group>
          <!-- #endif -->
        </view>

        <view class="uni-btn-v uni-common-mt">
          <button type="primary" @tap="confirmPayment" :loading="loading">{{ __('确定支付') }}</button>
        </view>
      </view>
      <view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="cancel"></view>
    </view>
  </view>

</template>


<script>

import {mapMutations, mapState} from 'vuex';

// #ifdef H5
import wPay from "../helpers/pPay";

// #endif


export default {
  name: "payment-box",
  props: {
    order_id: {
      type: String,
      default: ''
    },
    kind: {
      type: String,
      default: 'order'  //favorable
    },
    defaultUserMoney: {
      type: Boolean,
      default: true
    },
    paymentDataDefault: {
      type: Object,
      default() {
        return {
          order_id: '',
          order_money_amount: 0,
          user_money: 0,
          user_points: 0,
          user_recharge_card: 0,
          user_sp: 0
          //openid: app.globalData.userInfo.openId,
          //typ: 'json',
          //payment_channel_code: 'wx_native',
          //prepay_flag: 1
        }
      },
    }
  },
  data() {
    return {
      loading: false,
      h5payList: ['paypal', 'redsys', 'payu', 'ccav'],
      h5WeChatpayList: ['wxpay', 'offline'],
      h5WeChatMPpayList: ['wxpay', 'offline'],
      providerList: [
        {
          name: '微信',
          id: 'wxpay',
          loading: false
        }, {
          name: '支付宝',
          id: 'alipay',
          loading: false
        },
        {
          name: 'Paypal',
          id: 'paypal',
          loading: false
        },
        {
          name: 'Redsys',
          id: 'redsys',
          loading: false
        },
        {
          name: 'Payu',
          id: 'payu',
          loading: false
        },
        {
          name: 'Ccav',
          id: 'ccav',
          loading: false
        },
        {
          name: 'Cash on delivery',
          id: 'offline',
          loading: false
        }/*,{
									name: '百度',
									id: 'baidu',
									loading: false
								}*/],
      blanceChannel: {
        money: false,
        points: false,
        recharge_card: false,
        sp: false
      },
      showBoxView: false,
      userMoney: false,
      userPoints: false,
      userRechargeCard: false,
      userSp: false,
      password: '', //支付密码
      paymentIndex: 0,
      isWeixin: false
    }
  },
  computed: mapState([
    'Config',
    'StateCode',
    'notice',
    'plantformInfo',
    'shopInfo',
    'userInfo',
    'hasLogin'
  ]),
  created: function () {
    let that = this;
    // #ifdef APP-PLUS
    uni.getProvider({
      service: "payment",
      success: (e) => {
        //console.log("payment success", e);
        this.providerList = e.provider.map((value) => {
          switch (value) {
            case 'alipay':
              return {
                name: '支付宝',
                id: value,
                loading: false
              }
            case 'wxpay':
              return {
                name: '微信',
                id: value,
                loading: false
              }/*
							case 'baidu':
								return {
									name: '百度',
									id: value,
									loading: false
								}*/
          }
        })

        this.providerList.push({
          name: 'Paypal',
          id: 'paypal',
          loading: false
        });


        this.providerList.push({
          name: 'Redsys',
          id: 'redsys',
          loading: false
        });

        this.providerList.push({
          name: 'Payu',
          id: 'payu',
          loading: false
        });

        this.providerList.push({
          name: 'Ccav',
          id: 'ccav',
          loading: false
        });

        this.providerList.push({
          name: 'Cash on delivery',
          id: 'offline',
          loading: false
        });
      },
      fail: (e) => {
        //console.log("获取登录通道失败：", e);
      }
    });
    // #endif

    // #ifdef H5
    if (that.$.isWeixin()) {
      this.setData({isWeixin: true});
    } else {
    }
    // #endif
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    confirmPayment(e) {
      let that = this;
      if ((this.userMoney || this.userPoints || this.userSp || this.userRechargeCard)) {
        if (!this.password) {
          that.$.showModal({
            content: that.__("请输入余额支付密码！"),
            showCancel: false
          });

          return
        }

	      this.moneyPay(this.providerList[this.paymentIndex], this.paymentIndex)

        return
      }

      console.info(this.providerList)

      // #ifdef APP-PLUS
      if (that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
        this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
      } else {
        this.requestPayment(this.providerList[this.paymentIndex], this.paymentIndex);
      }
      // #endif

      // #ifdef MP-WEIXIN
      if (this.providerList[this.paymentIndex].id !== 'wxpay' && this.providerList[this.paymentIndex].id !== 'wx_native') {
        if (this.providerList[this.paymentIndex].id == 'wxpay') {
          //this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
          this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
        } else if (that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
          this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
        } else {
          this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
        }
      } else {
        wx.login({
          success: res => {
            // 登录注册接口
            if (res.code) {
              // 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
              let params = {'code': res.code};

              that.$.request({
                url: that.cf.URL.get_miniapp_open_id,
                data: params,
                success: (data, status, msg, code) => {
                  that.weixinPay(data.openid)
                },
                fail: (err, status) => {
                  ////console.info(err);
                  ////console.info(status);
                }
              })
            } else {
              that.$.showModal({
                content: that.__("授权失败"),
                showCancel: false
              })
            }
          }
        });
      }


      // #endif

      // #ifdef H5
      if (that.$.isWeixin()) {
        if (this.providerList[this.paymentIndex].id !== 'wxpay' && this.providerList[this.paymentIndex].id !== 'wx_native') {
          if (this.providerList[this.paymentIndex].id == 'wxpay') {
            //this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
            this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
          } else if (that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
            this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
          } else {
            this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
          }
        } else {
          this.mpPay();
        }

      } else {
        if (this.providerList.length > 0 && this.providerList[this.paymentIndex].id == 'wxpay') {
          //this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
          this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
        } else if (this.providerList.length > 0 && that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
          this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
        } else {
          this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
        }
      }
      // #endif


      // #ifdef MP-BAIDU
      this.baiduPay()
      // #endif
    },
    switchMoney(e) {
      // #ifdef MP_BAIDU
      this.userMoney = e.detail.checked;
      // #endif

      // #ifndef MP_BAIDU
      this.userMoney = e.detail.value;
      // #endif
    },

    switchPoints(e) {
      // #ifdef MP_BAIDU
      this.userPoints = e.detail.checked;
      // #endif

      // #ifndef MP_BAIDU
      this.userPoints = e.detail.value;
      // #endif
    },

    switchRechargeCard(e) {
      // #ifdef MP_BAIDU
      this.userRechargeCard = e.detail.checked;
      // #endif

      // #ifndef MP_BAIDU
      this.userRechargeCard = e.detail.value;
      // #endif
    },

    switchSp(e) {
      // #ifdef MP_BAIDU
      this.userSp = e.detail.checked;
      // #endif

      // #ifndef MP_BAIDU
      this.userSp = e.detail.value;
      // #endif
    },


    passwordChange(e) {
      this.password = e.target.value;
    },

    paymentChange(e) {
      //console.log("type:" + e.detail.value);
      let payment_index = parseInt(e.detail.value);
      this.paymentIndex = payment_index;
    },

    async moneyPay(e, index) {
      let that = this;

      this.loading = true;
      let code = 'money';

      if (this.providerList.length > 0) {
        this.providerList[index].loading = true;

        code = e.id;
      } else {
        code = 'money';
      }

      code = 'money';

      let result = await this.getOrderInfo(code);

      if (result.status == 250) {
        that.$.showModal({
          content: result.msg || that.__("获得订单信息失败"),
          showCancel: false
        })

        return
      }

      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        //console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }
            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {
      }

      this.loading = false;
    },
    async weixinPay(openid) {
      let that = this;
      //console.log("发起支付");
      this.loading = true;

      let result = await this.getOrderInfo('wxpay', openid);
      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        //console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }

            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {

        let paymentData = orderInfo.data;
        that.$.requestPayment({
          timeStamp: paymentData.timeStamp + '',
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: 'MD5',
          paySign: paymentData.paySign,
          success: (res) => {
            this.$emit('onPaid', orderInfo);
          },
          fail: (res) => {
            that.$.showModal({
              content: that.__("支付失败"),
              showCancel: false
            })

            this.$emit('onFail');
          },
          complete: () => {
            this.loading = false;
          }
        })
      }

    },
    async baiduPay() {
      let that = this;
      //console.log("发起支付");
      this.loading = true;

      let result = await this.getOrderInfo('baidu');
      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        //console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }

            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {

        let paymentData = orderInfo.data;
        that.$.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: 'MD5',
          paySign: paymentData.paySign,
          success: (res) => {
            this.$emit('onPaid', orderInfo);
          },
          fail: (res) => {
            ////console.info(res.errMsg);
            that.$.showModal({
              content: that.__("支付失败"),
              showCancel: false
            })

            this.$emit('onFail');
          },
          complete: () => {
            this.loading = false;
          }
        })
      }

    },

    async requestPayment(e, index) {
      let that = this;

      this.loading = true;
      this.providerList[index].loading = true;
      let result = await this.getOrderInfo(e.id);
      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        //console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }

            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {
        let pay_params = Object.assign({}, orderInfo.data);
        delete pay_params['order_id'];

        pay_params['partnerid'] = pay_params['partnerid'] + "";
        pay_params['timestamp'] = pay_params['timestamp'] + "";

        that.$.requestPayment({
          provider: e.id,
          orderInfo: e.id == 'alipay' ? orderInfo.data : pay_params,
          success: (e) => {
            //console.log("success", e);
            //进入订单页面

            this.$emit('onPaid', orderInfo);
          },
          fail: (e) => {
            //console.log("fail", e);
            that.$.showModal({
              content: that.__("支付失败"),
              showCancel: false
            })


            this.$emit('onFail');
          },
          complete: () => {

            this.loading = false;
            this.providerList[index].loading = false;
          }
        })
      }
    },
    async h5OldPay(e, index) {
      let that = this;
      //console.log("发起支付");
      this.loading = true;
      this.providerList[index].loading = true;

      //页面直接跳转支付模式
      var id = uni.getStorageSync('uid');
      var key = uni.getStorageSync('ukey');


      let appid = "";
      let payment_channel_code = e.id;

      if (e.id == 'wxpay') {
        //payment_channel_code = 'wx_native';
      }

      var pm_money = 0;
      var pm_recharge_card = 0;
      var pm_points = 0;
      var pm_credit = 0;

      var password = this.password;
      var order_id = this.order_id;

      if (this.userMoney) {
        pm_money = this.paymentDataDefault.order_money_amount;
      }

      let params = {
        perm_id: id,
        perm_key: key,

        order_id: order_id,
        password: password,
        pm_recharge_card: pm_recharge_card,
        pm_money: pm_money,
        pm_points: pm_points,
        pm_credit: pm_credit,
        payment_channel_code: payment_channel_code,
        mp_flag: 0,
        old_mp_flag: 1,
        appid: appid,
        typ: 'e'
      }

      // #ifdef H5
      /*
      */
      // #endif

      //let url = that.$.createUrl(that.cf.URL.pay.pay, {key:key,order_id:order_id,password:password,pm_recharge_card:pm_recharge_card,pm_money:pm_money,pm_points:pm_points,pm_credit:pm_credit,payment_channel_code:payment_channel_code, mp_flag:isWeixin()?1:0, old_mp_flag:1});
      let url = that.$.createUrl(that.cf.URL.pay.wechatJSAPIPay, params);


      // #ifdef APP-PLUS
      that.$.gotopage(
          '/pagesub/webpage/webpage?u=' +
          encodeURIComponent(url)
      );

      /*
      that.$.showModal({
        title: that.__('提示'),
        content: that.__('是否支付完成？'),
        success: res => {
          if (res.confirm) {
            let redirect_url = '/member/order/detail?on=' + that.order_id;
          that.$.gopage(redirect_url);

          } else if (res.cancel) {
            let redirect_url = '/member/order/detail?on=' + that.order_id;
          that.$.gopage(redirect_url);
          }

        }
      });
      */
      // #endif


      // #ifdef H5
      that.$.showModal({
        title: that.__('提示'),
        content: that.__('是否支付完成？'),
        success: res => {
          if (res.confirm) {
            let redirect_url = that.cf.SiteUrl + '/h5/member/order/detail?on=' + that.order_id;

            if (that.kind == 'order') {
            } else if (that.kind == 'favorable') {
              redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?order_id=' + that.order_id;
            } else {

            }

            window.location.href = redirect_url;
          } else if (res.cancel) {

            let redirect_url = that.cf.SiteUrl + '/h5/member/order/detail?on=' + that.order_id;
            if (that.kind == 'order') {
            } else if (that.kind == 'favorable') {
              redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?order_id=' + that.order_id;
            } else {

            }

            window.location.href = redirect_url;
          }
        }
      });

      window.location.href = url;
      // #endif
    },
    async h5Pay(e, index) {
      let that = this;
      //console.log("发起支付");
      this.loading = true;
      let code = '';

      if (this.providerList.length > 0) {
        this.providerList[index].loading = true;

        code = e.id;
      } else {
        code = 'pm_money';
      }

      let result = await this.getOrderInfo(code);

      if (result.status == 250) {
        that.$.showModal({
          content: result.msg || that.__("获得订单信息失败"),
          showCancel: false
        })

        return
      }

      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        //console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }

            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {

        that.$.showModal({
          title: that.__('提示'),
          content: that.__('是否支付完成？'),
          success: res => {
            if (res.confirm) {
              this.$emit('onPaid', orderInfo);
            } else if (res.cancel) {
              this.$emit('onFail');
            }
          }
        });

        if (e.id == 'alipay') {
          window.location.href = orderInfo.mweb_url;
          //window.open(orderInfo.data.mweb_url);
        } else {
          let redirect_url = that.cf.SiteUrl + '/h5/member/order/detail?init_pay_flag=1&on=' + that.order_id;
          if (that.kind == 'order') {
          } else if (that.kind == 'favorable') {
            redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?init_pay_flag=1&order_id=' + that.order_id;
          } else {

          }

          //页面已经跳转走了
          window.location.href = orderInfo.mweb_url + '&redirect_url=' + encodeURIComponent(redirect_url);

          //window.open(orderInfo.data.mweb_url);
          //that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(orderInfo.data.mweb_url) + "&tn=" + '在线支付' + "&tc=" + '#ff6700' + "&tb=" + 'white')
        }
        /*
wPay({
appId:orderInfo.data.appId,
timeStamp:orderInfo.data.timeStamp,
nonceStr:orderInfo.data.nonceStr,
signature:orderInfo.data.signType,
package:orderInfo.data.package,
paySign:orderInfo.data.paySign
},res=>{
//console.log('调用成功!');
//进入订单页面

//console.log("success", res);
this.$emit('onPaid', orderInfo);

},fail=>{
//console.log('调用失败!');
that.$.showModal({
  content: "支付失败,原因为: " + fail,
  showCancel: false
})

this.$emit('onFail');
})
        */
      }

      this.loading = false;
    },
    async mpPay() {
      let that = this;
      //console.log("发起支付");
      this.loading = true;

      let result = await this.getOrderInfo('wxpay');
      let orderInfo = result.data;

      if (orderInfo.status_code !== 200) {
        ////console.log("获得订单信息失败", orderInfo);
        if (result.code == 101) {
          that.$.showModal({
            title: that.__('提示'),
            content: that.__('未设置支付密码，去设置？'),
            success: res => {
              if (res.confirm) {
                let redirect_url = '/member/member/paypwd';
                that.$.gopage(redirect_url);
              } else if (res.cancel) {
              }

            }
          });
        } else {
          that.$.showModal({
            content: result.msg || that.__("获得订单信息失败"),
            showCancel: false
          })
        }

        this.loading = false;
        return;
      } else {
      }

      if (orderInfo.paid) {
        this.loading = false;

        this.$emit('onPaid', orderInfo);
      } else {


        wPay({
          appId: orderInfo.data.appId,
          timeStamp: orderInfo.data.timeStamp,
          nonceStr: orderInfo.data.nonceStr,
          signature: orderInfo.data.signType,
          package: orderInfo.data.package,
          paySign: orderInfo.data.paySign
        }, res => {
          //console.log('调用成功!');
          //进入订单页面

          //console.log("success", res);
          this.$emit('onPaid', orderInfo);

        }, fail => {
          //console.log('调用失败!');
          //console.info(fail)
          that.$.showModal({
            content: that.__("支付失败"),
            showCancel: false
          })

          this.$emit('onFail');
        })
      }
    },
    getOrderInfo(payment_channel_code, openid) {
      let that = this;
      let url = that.cf.URL.pay.wechatAppletPay;

      if (payment_channel_code == 'wxpay') {
        //payment_channel_code = 'wx_native';
      }

      let appid = "";
      // #ifdef APP-PLUS
      appid = plus.runtime.appid;
      // #endif

      var pm_money = 0;
      var pm_recharge_card = 0;
      var pm_points = 0;
      var pm_sp = 0;
      var pm_credit = 0;

      var password = this.password;
      var order_id = this.order_id;

      if (this.userMoney) {
        pm_money = this.paymentDataDefault.order_money_amount;
      }

      if (this.userPoints) {
        pm_points = this.paymentDataDefault.user_points;
      }

      if (this.userSp) {
        pm_sp = this.paymentDataDefault.user_sp;
      }

      if (this.userRechargeCard) {
        pm_recharge_card = this.paymentDataDefault.user_recharge_card;
      }


      let params = {
        order_id: order_id,
        password: password,
        pm_recharge_card: pm_recharge_card,
        pm_money: pm_money,
        pm_points: pm_points,
        pm_sp: pm_sp,
        pm_credit: pm_credit,
        payment_channel_code: payment_channel_code,
        appid: appid,
        typ: 'json'
      }

      // #ifdef APP-PLUS
      params['prepayapp_flag'] = 1;
      // #endif

      // #ifdef MP-WEIXIN
      params['prepay_flag'] = 1;
      params['openid'] = openid;
      // #endif

      // #ifdef H5

      if (that.$.isWeixin()) {
        params['mp_flag'] = 1;
        //params['openid'] = 'ouUkf1br8vToo1Vcv6HFH7KIo6cc';
      } else {
        //H5支付 微信
        params['return_flag'] = 1;

      }
      // #endif

      if (payment_channel_code == 'wxpay' || payment_channel_code == 'wxpay') {
        url = that.cf.URL.pay.wechatAppletPay;

        // #ifdef APP-PLUS
        params['prepayapp_flag'] = 1;
        url = that.cf.URL.pay.wechatAppPay;
        // #endif

        // #ifdef MP-WEIXIN
        params['prepay_flag'] = 1;
        params['openid'] = openid;
        url = that.cf.URL.pay.wechatAppletPay;
        // #endif

        // #ifdef H5
        if (that.$.isWeixin()) {
          params['mp_flag'] = 1;
          //params['openid'] = 'ouUkf1br8vToo1Vcv6HFH7KIo6cc';

          url = that.cf.URL.pay.wechatJSAPIPay;
        } else {
          //H5支付 微信
          params['return_flag'] = 1;
          url = that.cf.URL.pay.wechatH5Pay;
        }
        // #endif

      } else if (payment_channel_code == 'alipay') {
        url = that.cf.URL.pay.alipPay;
      } else if (payment_channel_code == 'money') {
        url = that.cf.URL.pay.moneyPay;
      } else if (payment_channel_code == 'offline') {
        url = that.cf.URL.pay.offlinePay;
      }

      return new Promise((res) => {
        that.$.request({
          url: url,
          method: "POST",
          data: params,
          success: (data, status, msg, code) => {
			  if (200 != status) {
				  that.setData({
					  loading : false
				  })
			  }
            res({data: data, status: status, msg: msg, code: code});
          },
          fail: (err, status) => {
            //console.info(err);
            //console.info(status);
            res({data: err, status: status});
          }
        })
      })
    },
    cancel() {
      this.setData({
        showBoxView: false
      });
      //this.$emit('onCancel');
    },
    show() {
      let that = this;

      //处理有效的支付方式
      setTimeout(() => {
        this.getPlantformInfo((plantformInfo) => {
          var payment_channel_code_row = []

          // plantformInfo.payment_channel_list.find(item => {
          //   return item.value == id;
          // })

          for (var i in plantformInfo.payment_channel_list) {
            if (plantformInfo.payment_channel_list[i].enable) {
              payment_channel_code_row.push(plantformInfo.payment_channel_list[i].ext2)
            }
          }

          if (typeof payment_channel_code_row != 'undefined') {
            var tk = this.providerList.length;

            while (tk--) {
              let tmp_code = this.providerList[tk].id;

              //如果启用了支付方式
              if (that.$.inArray(payment_channel_code_row, tmp_code)) {
              } else {
                //删除
                this.providerList.splice(tk, 1);
              }
            }

            //判断余额支付途径blanceChannel

            let tmpList = ['money', 'points', 'recharge_card', 'sp']

            for (var tk in tmpList) {
              //如果启用了支付方式
              if (that.$.inArray(payment_channel_code_row, tmpList[tk])) {
                this.blanceChannel[tmpList[tk]] = true;
              } else {
                //删除
                this.blanceChannel[tmpList[tk]] = false;
              }
            }

            //this.$forceUpdate();
          }
        });
      }, 10);

      setTimeout(() => {
        this.setData({
          showBoxView: true
        });

        //完成支付事件
        if (that.paymentDataDefault.order_money_amount <= 0) {
          let orderInfo = {};
          that.$emit('onPaid', orderInfo);
        }
      }, 10);

    }
  }
}
</script>

<style lang="scss">
.m-panel-sp-icon {
  position: absolute;
  right: 20rpx;
  top: 10rpx;
}

.rmbLogo {
  font-size: 40rpx;
}
</style>
