<template>
  <view class="page">
    <block v-if="userInfo.user_mobile && type == 1">
      <view class="m-cells m-cells-form">
        <view class="m-cell">
          <view class="m-cell-hd"><label class="u-label">{{ __('手机号码') }}</label></view>
          <view class="m-cell-bd" style="display: inherit;">
            <view style="width: 400rpx;height: 48rpx;">{{ user_intl }}{{ mobileNum }}</view>
          </view>
        </view>
        <view class="m-cell m-cell-vcode">
          <view class="m-cell-hd"><label class="u-label">{{ __('验证码') }}</label></view>
          <view class="m-cell-bd"><input class="u-input" type="number" v-model="newcode" :placeholder="__('请输入验证码')"
                                         maxlength="6"/></view>
          <view v-if="!isCode" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
          <view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{ btntext }}</view>
          <view v-else class="m-vcode-btn">{{ btntext }}</view>
        </view>
      </view>
      <view class="btn_box">
        <button class="u-btn u-btn-default" @tap="rebind">{{ __('重新绑定') }}</button>
      </view>
    </block>
    <block v-else>
      <view class="m-cells m-cells-form">
        <view class="m-cell">
          <view class="m-cell-hd"><label class="u-label">{{ __('手机号码') }}</label></view>
          <view class="m-cell-bd" style="display: inherit;">
            <block>
              <!-- 国家区号 -->
              <picker mode="selector" @change="onIntlChange" :value="mode_index" :range="langLists"
                      range-key="name" style="width: 80rpx;text-align: center;">
                <view class="country-int-code" style="color:#000000">{{ user_intl }}</view>
              </picker>

              <input class="u-input" type="number" style="width: 400rpx;height: 48rpx;" v-model="mobileNum"
                     :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone"/>
            </block>
          </view>
          <view v-if="!isPhone" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
        </view>
        <view class="m-cell m-cell-vcode">
          <view class="m-cell-hd"><label class="u-label">{{ __('验证码') }}</label></view>
          <view class="m-cell-bd"><input class="u-input" type="number" v-model="Code" :placeholder="__('请输入验证码')"
                                         maxlength="6" @input="inputcode"/></view>
          <view v-if="!isCode" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
          <view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{ btntext }}</view>
          <view v-else class="m-vcode-btn">{{ btntext }}</view>
        </view>
      </view>
      <view class="btn_box">
        <button class="u-btn u-btn-default" @tap="submitdata">{{ __('保存') }}</button>
      </view>
    </block>
    <view class="content" v-if="false">
      <view>
        <button @click="openCodeDialog">{{ __('发送验证码 - 保存按钮 - 根据手机号发送验证码 - 填写验证码后直接提交') }}</button>
        <view>{{ sprintf(__('验证码为：%s'), code) }}</view>
      </view>
      <verifycode-dialog :show="showCodeDialog" :len="6" :autoCountdown="true" :phone="'139****7978'"
                         v-on:change="change"></verifycode-dialog>
    </view>
  </view>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import verifycodeDialog from '../../components/verifycode-dialog/verifycode-dialog.vue';

var r = '';
export default {
  name: 'asset',
  data: function () {
    return {
      mode_index: 0,
      user_intl: '+86',
      mobileNum: '',
      password: '',
      Code: '',
      newcode: '',
      btntext: this.__('发送'),
      isSend: true,
      isPhone: true,
      sendTime: 120,
      isCode: true,
      isPassword: true,
      setDefaultLang: false,
      langSetComplete: false,
      showCodeDialog: false,
      code: "1231",
      langLists: [],
      type: 1,
    };
  },
  components: {
    verifycodeDialog,
  },

  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),

  },
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('绑定手机')
    });

    var that = this;

    // 未设置手机号时，显示
    if (!this.userInfo.user_mobile) {
      that.setData({
        setDefaultLang: true
      })
    }

    that.initLang();

    that.setData({
      user_intl: that.getUserIntl(that.userInfo.user_intl),
      mobileNum: that.userInfo.user_mobile,
    })
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    rebind: function () {
      var that = this;
      var params = {
        verify_key: that.user_intl + this.mobileNum,
        verify_code: this.newcode,
      }
      that.$.request({
        url: this.Config.URL.account.unBindMobile,
        data: params,
		method: "POST",
        success: function (data, status, msg, code) {
          if (status == 200) {
            clearInterval(that.r)
            that.setData({
              type: 2,
              newcode: '',
              btntext: that.__('发送'),
              isSend: true,
              mobileNum: ''
            })
          } else {
            that.$.alert(msg)
          }
        }
      })

    },
    initLang() {
      var that = this;
      let lists = [];

      that.setData({
        langLists: lists,
        langSetComplete: true
      });
    },
    getUserIntl: function (userInfoIntl) {
      if (userInfoIntl) {
        return userInfoIntl;
      } else {
        return "+" + this.langLists[this.mode_index].id
      }
    },
    onIntlChange: function (e) {
      var that = this;
      var index = e.detail.value
      this.setData({
        mode_index: e.detail.value,
        user_intl: '+' + this.langLists[index].id
      })
    },
    change: function (res) {
      if (res.type == 1) {
        this.code = res.code;
        this.showCodeDialog = false;
      } else if (res.type == -1) {
        this.code = this.__("请输入验证码");
        this.showCodeDialog = false;
      } else {
        setTimeout(function () {
          res.resendCall()
        }, 3000)
      }


    },
    openCodeDialog: function () {
      this.showCodeDialog = true;
    },

    inputphone: function (e) {
      let that = this;
      this.setData({
        mobileNum: e.detail.value
      });

      if (that.$.isNull(e.detail.value)) {
        this.setData({
          isPhone: false
        });
      } else {
        if (that.$.tel(e.detail.value, this.user_intl)) {
          this.setData({
            isPhone: true
          })
        } else {
          this.setData({
            isPhone: false
          });
        }
      }
    },
    onInputPassword: function (e) {

    },

    inputcode: function (e) {
      let that = this;
      this.setData({
        Code: e.detail.value
      }),
          that.$.isNull(e.detail.value) ?
              this.setData({
                isCode: false
              }) :
              this.setData({
                isCode: true
              });
    },
    sendmessage: function () {
      let that = this;
      //console.info(this.mobileNum)
      if (that.$.isNull(this.mobileNum)) {
        this.setData({
          isPhone: false
        });
      } else if (that.$.tel(this.mobileNum, this.user_intl)) {
        if (false && this.mobileNum && this.mobileNum == this.userInfo.user_mobile) that.$.confirm(that.__(
            '你已经绑定过该手机！'));
        else if (this.isSend) {
          this.setData({
            isSend: false
          });

          var t = this.sendTime;
          var params = {
            user_intl: that.user_intl,
            mobile: that.user_intl + this.mobileNum
          };
          that.$.request({
            url: this.Config.URL.sendMobileVerifyCode,
            data: params,
            success: function (data, status, msg, code) {
              if (status == 200) {
                that.r = setInterval(function () {
                  t > 0 ?
                      that.setData({
                        btntext: t-- + 's'
                      }) :
                      (that.setData({
                        isSend: true,
                        sendTime: 120,
                        btntext: that.__('重新发送')
                      }),
                          clearInterval(that.r));
                }, 1e3);
              } else {
                that.setData({
                  isSend: true
                }),
                    that.$.alert(msg);
              }
            }
          });
        }
      } else {
        this.setData({
          isPhone: false
        });
      }
    },
    submitdata: function () {
      let that = this;
      if (that.$.isNull(this.mobileNum))
        this.setData({
          isPhone: false
        });
      else if (that.$.tel(this.mobileNum, this.user_intl))
        if (false && this.mobileNum == this.userInfo.user_mobile) {
          that.$.confirm(that.__('你目前已经绑定该手机！'));
        } else if (that.$.isNull(this.Code))
          this.setData({
            isCode: false
          });
        else {
          var params = {
            password: this.password,
            user_intl: that.user_intl,

            verify_key: that.user_intl + this.mobileNum,
            verify_code: this.Code,
          };

          that.$.request({
            url: this.Config.URL.account.bindMobile,
            data: params,
			method: "POST",
            success: function (data, status, msg, code) {
              if (status == 200) {
                let user_info = {};
                user_info['user_mobile'] = that.mobileNum;
                user_info['as'] = 1;

                that.login(user_info);

                that.$.showModal(that.__('操作成功'), function () {
                  that.$.backpage(1);
                });
              } else {
                that.$.confirm(msg);
              }
            }
          });
        } else
        this.setData({
          isPhone: false
        });
    }
  }
};
</script>


<style lang="scss">
@import '../../styles/_variables.scss';

.m-cell-vcode {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
}

.m-vcode-img {
  width: 216rpx;
  height: 88rpx;
}

.btn_box {
  padding: 20rpx;
}

.m-code {
  right: 210rpx;
}

.m-vcode-btn {
  width: 150rpx;
  text-align: center;
}
</style>