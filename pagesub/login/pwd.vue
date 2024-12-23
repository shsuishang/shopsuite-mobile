<template>
  <view class="content">
    <form report-submit="true" @submit="findPassword">
      <view class="m-cells m-cells-form">
        <view class="m-cell">
          <view class="m-cell-hd"><label class="u-label">{{ __('手机号码') }}</label></view>
          <view class="m-cell-bd">
            <input class="u-input" type="number" v-model="user_mobile" name="user_mobile" :placeholder="__('请输入手机号码')"
                   maxlength="11" @input="onInputMobile"/>
          </view>
          <view v-if="(!isUserMobile)" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
        </view>
        <view class="m-cell">
          <view class="m-cell-hd"><label class="u-label">{{ __('验 证 码') }}</label></view>
          <view class="m-cell-bd">
            <input class="u-input" type="number" name="channel_verify_code" v-model="channel_verify_code"
                   :placeholder="__('请输入手机验证码')"/>
          </view>
        </view>
        <view class="m-cell">
          <view class="m-cell-hd"><label class="u-label">{{ __('新 密 码') }}</label></view>
          <view class="m-cell-bd">
            <input class="u-input" type="text" name="user_password" :placeholder="__('新密码')" :value="user_password"
                   @input="onInputNewPassword"/>
          </view>
          <view v-if="(!isNewPassword)" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
        </view>
        <view class="m-cell m-cell-vcode hide">
          <view class="m-cell-hd">
            <label class="u-label">{{ __('验证码') }}</label>
          </view>
          <view class="m-cell-bd">
            <input class="u-input" :placeholder="__('请输入验证码')" maxlength="6" @input="onInputImgCode"/>
          </view>
          <view v-if="(!isImgCode)" class="m-cell-ft">
            <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
          </view>
          <view class="m-vcode-btn" @click="refresh">
            <imgcode ref="imgcode"></imgcode>
          </view>
        </view>
      </view>
      <view class="btn-row">
        <button type="primary" class="primary" formType="submit">{{ __('提交') }}</button>
      </view>
    </form>
    <verifycode-dialog :show="showCodeDialog" :len="4" :autoCountdown="true" :phone="user_mobile"
                       v-on:change="change"></verifycode-dialog>
  </view>
</template>
<script>
import verifycodeDialog from '@/components/verifycode-dialog/verifycode-dialog.vue';
import imgcode from '../components/verify-code/imgcode.vue';

import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      user_mobile: '',
      user_password: '',
      isNewPassword: true,
      isUserMobile: true,
      isImgCode: true,

      showCodeDialog: false,
      channel_verify_code: ''
    }
  },
  components: {
    verifycodeDialog,
    imgcode
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;
    uni.setNavigationBarTitle({
      title: this.__('忘记密码')
    });
    this.show();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

    /* start 图形验证码 */
    refresh: function () {
      this.$refs.imgcode.refresh();
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
        this.channel_verify_code = "请输入验证码";
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
    onInputMobile: function (e) {
      this.setData({user_mobile: e.detail.value})

      if (!/^1[0123456789]\d{9}$/.test(this.user_mobile)) {
        /*
        uni.showToast({
            icon: 'none',
            title: '手机号码不合法',
        });
        */
        this.setData({isUserMobile: false});

        return;
      } else {
        this.setData({isUserMobile: true});

        this.openCodeDialog();
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
      /**
       * 仅做示例
       */
      if (!/^1[0123456789]\d{9}$/.test(this.user_mobile)) {
        uni.showToast({
          icon: 'none',
          title: '手机号码不合法',
        });
        return;
      }


      var that = this;
      var params = {
        mobile: that.user_mobile,
        channel: 'mobile',
        channel_verify_key: that.user_mobile,
        channel_verify_code: that.channel_verify_code,
        pwd: that.user_password,
        client: 'wap'
      };
      that.$.request({
        url: this.Config.URL.set_pwd,
        data: params,
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.showToast({
              title: "修改密码成功!",
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
@import "../../styles/_variables.scss";
@import '../../styles/login.scss';

.m-cell-bd {
  width: 86%
}

.m-cell-hd {
  width: 24%;
}

.m-cell, m-cell-vcode {

  height: 60rpx;
  min-height: 60rpx;
  padding: 20rpx 0;
  padding-left: 60rpx;
  line-height: 60rpx;
}


.m-cell-vcode .m-icon-warn {
  position: relative;
  margin-top: 0px;
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
  padding: 0;
  text-align: center;
}

</style>
