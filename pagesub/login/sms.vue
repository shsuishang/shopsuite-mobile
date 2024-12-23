<template>
  <view class="register">

    <view class="content">
      <!-- 头部logo -->
      <view class="header">
        <image :src="logo"></image>
      </view>
      <!-- 主体 -->
      <view class="main">
        <wInput
            v-model="user_mobile"
            type="text"
            isShowIntl
            @intl="intlChange"
            :placeholder="__('请输入手机号码')"
        ></wInput>

        <wInput
            v-model="mobile_code"
            type="number"
            maxlength="4"
            :placeholder="__('请输入验证码')"
            isShowCode
            :codeText="__('获取验证码')"
            ref="runCode"
            @setCode="getSmsCode()"
        ></wInput>

      </view>

      <wButton
          :text="__('登 录')"
          :rotate="isRotate"
          @click.native="startReg()" style="margin-top: 30rpx;"
      ></wButton>

      <!-- 其他登录 -->
      <!-- #ifdef WEB || MP || APP -->
      <view class="other_login cuIcon" v-if="false">
        <view class="login_icon">
          <view class="cuIcon-item">
            <navigator url="/pagesub/login/login" open-type="navigate">
              <image src="/static/images/login/phone.png"></image>
            </navigator>
          </view>
        </view>
      </view>
      <!-- #endif -->
      <!-- 底部信息 -->
      <view class="footer" v-if="false">
        <navigator url="/pagesub/login/forget" open-type="navigate">{{ __('找回密码') }}</navigator>
        <text>|</text>
        <navigator url="/pagesub/login/register" open-type="navigate">{{ __('注册账号') }}</navigator>
      </view>
    </view>
  </view>
</template>


<script>
import wInput from './watch-login/watch-input.vue' //input
import wButton from './watch-login/watch-button.vue' //button
import imgcode from '../components/verify-code/imgcode.vue';

import {mapMutations, mapState} from 'vuex'

export default {
  data: function () {
    return {
      logo: "",
      user_intl: "",
      user_mobile: "",
      user_avatar: "https://static.shopsuite.cn/demodata/assets/data/avatar.png",
      user_password: "",
      mobile_code: "",
      btntext: "发送",
      isUserMobile: true,
      isUserEmail: true,
      isNickname: true,
      isPassword: true,
      isSend: true,
      sendTime: 120,
      isCode: true,
      isImgCode: false,


      client_info: '{}',

      countdown: 6,
      cTimer: null,

      isRotate: false //是否加载旋转
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  components: {
    wInput,
    wButton,
    imgcode
  },
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('手机验证码登录')
    });

    this.setData({
      options: options
    })

    this.btntext = this.__('发送')

    setTimeout(() => {
      this.getPlantformInfo((plantformInfo) => {
        this.logo = plantformInfo.site_mobile_logo;
      });
    }, 200);

    this.show();


    // #ifdef APP-PLUS
    plus.push.getClientInfoAsync(function (info) {
      console.log(info);
      if (info.clientid) {
        that.client_info = JSON.stringify(info);
      }
    }, function (e) {
      console.log(JSON.stringify(e));
    })
    // #endif
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    intlChange: function (data) {
      this.user_intl = data;
    },

    /* start 图形验证码 */
    refresh: function () {
      //this.$refs.imgcode.refresh();
    },
    show: function () {
      var _self = this;
      setTimeout(function () {
        _self.refresh();
      }, 500);
    },
    onInputImgCode: function (e) {
      if (e.detail.value.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase()) {
        this.setData({isImgCode: true})
      } else {
        this.setData({isImgCode: false})
      }
    },
    /* end 图形验证码 */

    inputuser_email: function (e) {
      let that = this;
      this.setData({user_email: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isUserEmail: false}) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({isUserEmail: true}) : this.setData({isUserEmail: false})
    },
    startReg: function (e) {
      let that = this;

      //注册
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }

      if (!that.$.tel(this.user_mobile, this.user_intl)) {
        this.setData({isUserMobile: false});

        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('手机号不正确')
        });

        return false;
      }


      if (this.mobile_code.length != 4) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('验证码不正确')
        });

        return false;
      }

      this.update();
    },

    update: function () {
      var that = this;

      var params = {
        user_mobile: this.user_intl + this.user_mobile,
        verify_key: this.user_intl + this.user_mobile,
        verify_code: this.mobile_code,
        client_info: that.client_info
      };

      that.$.request({
        url: this.Config.URL.doSmsLogin,
        data: params,
        success: function (data, status, msg, code) {
          if (status == 200) {
            var id = that.$.setStorageSync('uid', data.user_id);
            var key = that.$.setStorageSync('ukey', data.token);

            // #ifdef H5
            $cookies.set('uid', data.user_id);
            $cookies.set('ukey', data.token);
            // #endif

            that.$.request({
              url: that.Config.URL.userInfo,
              success: function (data, status, msg, code) {

                that.$.showToast({
                  title: that.__("登录成功!"), success: function () {

                    that.login(data);
                    that.notice.postNotificationName('RefreshCart', 0);

                    //判断是否需要进入激活页面
                    if (2 == data.user_state) {
                      that.$.toActive();
                    }

                    /**
                     * 强制登录时使用reLaunch方式跳转过来
                     * 返回首页也使用reLaunch方式
                     */
                    if (that.forcedLoginState) {
                      that.$.reLaunch({
                        url: '/pages/index/member'
                      });
                    } else {
                      let pre_route = that.$.getStorageSync('pre_route');
                      let pre_options = that.$.getStorageSync('pre_options');

                      if (pre_route) {
                        let pre_url = '/' + that.$.createUrl(pre_route, pre_options);
                        that.$.gotopage(pre_url);
                      } else {
                        that.$.gotopage('/pages/index/member');
                      }

                      return;
                    }
                  }
                })
              }
            });

          } else {
            that.$.confirm(msg);
          }
        }

      });
    },
    inputphone: function (e) {
      let that = this;
      this.setData({user_mobile: e.detail.value});
      that.$.isNull(e.detail.value) ? this.setData({isUserMobile: false}) : /^1[0123456789]\d{9}$/.test(e.detail.value) ? this.setData({isUserMobile: true}) : this.setData({isUserMobile: false})
    },


    inputcode: function (e) {
      let that = this;
      this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: false}) : this.setData({isCode: true})
    },
    getSmsCode: function () {
      let that = this;

      if (!that.$.tel(this.user_mobile, this.user_intl)) {
        this.setData({isUserMobile: false});

        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('手机号不正确')
        });
        return false;
      }

      //获取验证码
      this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）


      /*
              if (!this.isImgCode)
              {
                  uni.showToast({
                      icon: 'none',
                      title: '请输入正确的图形验证码',
                  });
                  return;
              }
              */

      setTimeout(function () {
        that.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
      }, 60000)

      if (this.isSend) {
        this.setData({isSend: false});
        var t = this.sendTime;
        var params = {
          mobile: this.user_intl + this.user_mobile
        };

        that.$.request({
          url: this.Config.URL.sendMobileVerifyCode,
          data: params,
          success: function (data, status, msg, code) {
            if (status == 200) {
              var r = setInterval(function () {
                t > 0 ? that.setData({btntext: t-- + "s"}) : (that.setData({
                  isSend: true,
                  sendTime: 120,
                  btntext: that.__("重新发送")
                }), clearInterval(r))
              }, 1e3);
            } else {
              that.setData({isSend: true});
              that.$.alert(msg)

              that.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
            }
          }
        });
      }
    },

    startTimer: function () {
      var that = this;
      if (that.cTimer == null) {
        that.countdown--;
        that.cTimer = setInterval(function () {
          that.countdown--;
          if (that.countdown == 0) {
            that.clearTimer();
          }
        }, 1000);
      }
    },
    clearTimer: function () {
      var that = this;
      clearInterval(that.cTimer);
      that.cTimer = null;
      that.countdown = 6;
    }
  }
};
</script>


<style lang="scss">

@import '../../styles/reg.scss';

.cuIcon-item {
  font-size: 64rpx;

  image {
    width: 64rpx;
    height: 64rpx;
  }
}

/* common/authorization-info.wxss */
.auth-pop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  z-index: 999;
}

.auth-box {
  width: 600rpx;
  background-color: #fff;
  border-radius: 24rpx;
  box-sizing: border-box;
  padding: 110rpx 60rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.5);
}

.auth-box image {
  width: 112rpx;
  height: 112rpx;
}

.auth-box label {
  font-size: 32rpx;
  color: #333;
  margin: 20rpx 0;
  display: inline-block;
  width: 100%;
}

.auth-box text {
  font-size: 24rpx;
  color: #666;
}

.auth-box button {
  margin-top: 80rpx;
}

.btn-row {
  margin-top: 50px;
  padding: 0px;

  label {
    font-size: 32rpx;
    color: #333;
    margin: 20rpx 0;
    display: inline;
    width: 100%;
  }
}

.avatar-wrapper {
  padding: 0;
  width: 112rpx !important;
  height: 112rpx !important;
  border-radius: 16rpx;
  margin-top: 80rpx;
  margin-bottom: 80rpx;
}

.avatar {
  display: block;
  width: 112rpx;
  height: 112rpx;
}

.footer {
  font-size: 12px;
}

.footer {
  .cuIcon {
    font-size: 14px;
    margin: 0;
  }
}
</style>
