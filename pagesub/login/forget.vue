<template>
  <view class="forget">

    <view class="content">
      <!-- 主体 -->
      <view class="main">
        <view class="tips">{{ __('若你忘记了密码，可在此重置新密码。') }}</view>
        <wInput
            v-if="bind_type==1"
            v-model="user_account"
            type="text"
            isShowIntl
            @intl="intlChange"
            :placeholder="__('请输入手机号码')"
        ></wInput>

        <wInput
            v-if="bind_type==2"
            v-model="user_account"
            type="text"
            :placeholder="__('请输入电子邮箱')"
        ></wInput>

        <wInput
            v-model="user_password"
            type="password"
            :placeholder="__('请输入新密码')"
            isShowPass
        ></wInput>

        <wInput
            v-model="channel_verify_code"
            type="number"
            maxlength="4"
            :placeholder="__('请输入验证码')"
            isShowCode
            :codeText="__('获取验证码')"
            ref="runCode"
            @setCode="onInputMobile()"
        ></wInput>
      </view>

      <wButton
          :text="__('重置密码')"
          :rotate="isRotate"
          @click.native="findPassword()"
      ></wButton>

    </view>
    <verifycode-dialog :show="showCodeDialog" :bindType="bind_type" :len="4" :autoCountdown="true"
                       :user_intl="user_intl" :phone="user_intl+user_account" v-on:change="change"></verifycode-dialog>
  </view>
</template>

<script>
import wInput from './watch-login/watch-input.vue' //input
import wButton from './watch-login/watch-button.vue' //button
import verifycodeDialog from '@/components/verifycode-dialog/verifycode-dialog.vue';
import imgcode from '../components/verify-code/imgcode.vue';

import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      user_intl: '',
      user_account: '',
      user_password: '',
      isNewPassword: true,
      isUserMobile: true,
      isImgCode: true,

      bind_type: 1,  //1:手机号注册   2:email 注册
      bind_mobile: 1,  //1:手机号注册   2:email 注册
      bind_email: 2,  //1:手机号注册   2:email 注册


      showCodeDialog: false,
      channel_verify_code: '',

      isRotate: false //是否加载旋转
    }
  },
  components: {
    wInput,
    wButton,
    verifycodeDialog,
    imgcode
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('找回密码')
    });

    this.bind_type = options.bind_type == 2 ? this.onChangeBindType(this.bind_email) : this.onChangeBindType(this.bind_mobile);

    //判断是否登录，如果登录则回到用户中心。
    if (this.hasLogin) {
      this.$.gotopage('/pages/index/member');
    }

    this.show();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    onChangeBindType: function (bind_type) {
      this.bind_type = bind_type;

      if (this.bind_email == this.bind_type) {
        uni.setNavigationBarTitle({
          title: this.__('电子邮箱') + this.__('找回密码')
        });
      }

      if (this.bind_mobile == this.bind_type) {
        uni.setNavigationBarTitle({
          title: this.__('手机号') + this.__('找回密码')
        });
      }

      return this.bind_type;
    },

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

    change: function (res) {
      if (res.type == 1) {
        this.channel_verify_code = res.code;
        this.showCodeDialog = false;
      } else if (res.type == -1) {
        this.channel_verify_code = this.__("请输入验证码");
        this.showCodeDialog = false;
      } else {
        res.resendCall();
        /*
                  setTimeout(function(){
                      res.resendCall()
                  },3000)
                  */
      }
    },
    openCodeDialog: function () {
      this.showCodeDialog = true;
    },
    onInputMobile: function () {
      let that = this;

      if (that.bind_type == that.bind_mobile) {
        if (!that.$.tel(this.user_account, this.user_intl)) {
          this.setData({isUserMobile: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('手机号不正确')
          });

          return false;
        } else {
          this.setData({isUserMobile: true});

          this.openCodeDialog();
        }
      } else if (that.bind_type == that.bind_email) {
        if (!that.$.email(this.user_account)) {
          this.setData({isUserMobile: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('电子邮箱不正确')
          });

          return false;
        } else {
          this.setData({isUserMobile: true});

          this.openCodeDialog();
        }
      }
    },
    onInputNewPassword: function (e) {
      this.setData({user_password: e.detail.value})

      if (e.detail.value) {
        this.setData({isNewPassword: true});
      } else {
        this.setData({isNewPassword: false});
      }
    },
    findPassword() {
      var that = this;

      //重置密码
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }

      if (!that.$.tel(this.user_account, this.user_intl)) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('手机号不正确')
        });

        return false;
      }


      if (!that.$.minlength(this.user_password, 6)) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('密码至少大约6位')
        });

        return false;
      }

      if (this.channel_verify_code.length != 4) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('验证码不正确')
        });

        return false;
      }

      that.isRotate = true
      setTimeout(function () {
        that.isRotate = false
      }, 2000)


      var params = {
        user_intl: that.user_intl,
        mobile: that.user_intl + that.user_account,
        bind_type: that.bind_type == that.bind_mobile ? 1: 2,
        verify_key: that.user_intl + that.user_account,
        verify_code: that.channel_verify_code,
        password: that.user_password,
        client: 'wap'
      };

      that.$.request({
        url: this.Config.URL.setNewPassword,
        method: "POST",
        data: params,
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.showToast({
              title: that.__("修改密码成功!"),
              icon: "success",
              duration: 2000, success: function () {
                that.$.gotopage('/pagesub/login/login');
              }
            })
          } else {
            that.$.confirm(msg);
          }
        }
      });
    }
  }
}
</script>


<style lang="scss">
@import '../../styles/reg.scss';
</style>

