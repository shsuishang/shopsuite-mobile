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
            v-if="bindType==1"
            v-model="userAccount"
            type="text"
            isShowIntl
            @intl="intlChange"
            :placeholder="__('请输入手机号码')"
        ></wInput>

        <wInput
            v-if="bindType==2"
            v-model="userAccount"
            type="text"
            :placeholder="__('请输入电子邮箱')"
        ></wInput>


        <wInput
            v-if="bindType==3"
            v-model="userAccount"
            type="text"
            :placeholder="__('请输入账号')"
            @input="onInputUserAccount"
        ></wInput>

        <wInput
            v-model="userPassword"
            type="password"
            :placeholder="__('请输入登录密码')"
            isShowPass
        ></wInput>

        <wInput
            v-if="bindType!=3"
            v-model="mobileCode"
            :type="bindType==3 ? 'string' : 'number'"
            maxlength="4"
            :placeholder="__('请输入验证码')"
            isShowCode
            :isShowCodeImg="bindType==3"
            :codeText="__('获取验证码')"
            ref="runCode"
            @setCode="getSmsCode()"
        ></wInput>

        <view v-if="bindType==3" style="position: relative">
          <wInput :placeholder="__('请输入验证码')" maxlength="6" @input="onInputImgCode"/>
          <view class="m-vcode-btn" @click="refresh">
            <imgcode ref="imgcode" :verify-key="verifyKey"></imgcode>
          </view>
        </view>

        <wInput
            v-model="addressString"
            type="text"
            :placeholder="addressString"
            v-if="Config.PLANTFORM_FX_AGENT_ENABLE"
            @click.native="showbox"
        ></wInput>

        <wInput
            v-model="sourceUserId"
            type="text"
            :placeholder="__('请输入推荐人编号')"
            v-if="Config.PLANTFORM_FX_ENABLE"
        ></wInput>

        <block v-if="hall_enterprise_enable">
          <wInput
              v-model="user_company_id"
              type="text"
              :placeholder="__('请输入企业编号')"
              v-if="!user_type"
          ></wInput>

          <view class="uni-padding-wrap" style="display: flex;flex-wrap:nowrap">
            <radio-group @change="radioChange">
              <label class="radio" style="margin-right: 30rpx;">
                <radio value="0" name="user_type" checked="true"/>
                {{ __('个人身份') }}
              </label>
              <label class="radio">
                <radio value="1" name="user_type"/>
                {{ __('企业身份') }}
              </label>
            </radio-group>
          </view>
          <block v-if="user_type">
            <view class="m-upImg">
              <view>{{ __('企业证书') }}</view>
              <view class="m-upImg-item">
                <block v-if="user_company_certificates">
                  <image lazy-load mode="aspectFit" :src="(user_company_certificates)" @click="upImgs"></image>
                </block>
                <view v-else class="m-upImg-item upSelect" @click.stop="upImgs">
                  <label class="iconfont icon-xiangji"></label>
                </view>
              </view>

            </view>

            <picker @change="bindPickerChange" :value="index" :range="industry" range-key="industry_name">
              <view class="uni-input">{{ industry[index].industry_name }}</view>
            </picker>
          </block>
        </block>


      </view>

      <wButton
          :text="__('注 册')"
          :rotate="isRotate"
          @click.native="startReg()" style="margin-top: 30rpx;"
      ></wButton>


      <view v-if="false" class="other_login cuIcon" style="margin-top:40rpx">
        <view class="login_icon">
          <view class="cuIcon-item" style="height: 32px;">
            <image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image>
          </view>
        </view>
        <view class="login_icon">
          <view class="cuIcon-item" style="height: 32px;">
            <image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image>
          </view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer" style="margin-top:100rpx">
        <text @tap="isShowAgree" class="cuIcon" :class="showAgree ? 'cuIcon-radiobox' : 'cuIcon-round'"></text>
        <text @tap="isShowAgree" style="margin: 0 0 0 2px;">{{ __('注册即代表您已同意') }}</text>

        <!-- 协议地址 -->
        <navigator url="/member/member/protocol?id=reg_protocols_description" open-type="navigate">《{{ __('服务协议') }}》
        </navigator>
        <navigator url="/member/member/protocol?id=pr_protocols_description" open-type="navigate">《{{ __('隐私政策') }}》
        </navigator>
      </view>
    </view>

    <liu-customize-sel ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                       @change='onConfirm'></liu-customize-sel>
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
      userAccount: "",
      userNickname: "",
      logo: "",
      userIntl: "",
      user_company_id: "",
      user_company_certificates: "",
      userAvatar: "https://static.shopsuite.cn/demodata/assets/data/avatar.png",
      userPassword: "",
      mobileCode: "",
      btntext: "发送",
      isUserMobile: true,
      isUserEmail: true,
      isNickname: true,
      isPassword: true,
      isSend: true,
      sendTime: 120,
      isCode: true,
      isImgCode: false,
      sourceUserId: '',
      sourceUccCode: '',
      activity_id: '',

      verifyKey: '',


      bindType: 1,  //1:手机号注册   2:email 注册  3:字符串
      bindMobile: 1,  //1:手机号注册   2:email 注册
      bindEmail: 2,  //1:手机号注册   2:email 注册
      bindString: 3,  //1:手机号注册   2:email 注册

      isDistrict: true,

      user_type: 0,
      industry: [],
      industry_id: 0,

      index: 0,
      hall_enterprise_enable: 0,

      selectedProId: 0,
      selectedCityId: 0,
      selectedCountyId: 0,
      selectedPro: '',
      selectedCity: '',
      selectedCounty: '',
      addressString: "请选择所属地区",

      cityPickerValueDefault: [0, 0, 0],
      themeColor: '#007AFF',


      protocol_text: '',
      bannerShow: false,
      countdown: 6,
      cTimer: null,


      showAgree: false, //协议是否选择
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
    uni.setNavigationBarTitle({
      title: this.__('注册')
    });

    await this.$onLaunched;

    this.setData({
      options: options
    })

    this.onChangeBindType(this.bindMobile)
    /*
    if (options.bind_type == 2) {
      this.onChangeBindType(this.bindEmail)
    } else if (options.bind_type == 1) {
      this.onChangeBindType(this.bindMobile)
    } else if (options.bind_type == 3) {
      this.onChangeBindType(this.bindString)
    }
    */

    this.btntext = this.__('发送')
    this.addressString = this.__('请选择所属地区')

    let source_user_id = this.$.getStorageSync('source_user_id');
    this.setData({sourceUserId: source_user_id})
    let source_ucc_code = this.$.getStorageSync('source_ucc_code');
    this.setData({sourceUccCode: source_ucc_code})

    //行业领域
    /*
    that.$.request({
      url: this.Config.URL.getIndustry,
      data: {},
      success: function (data, status, msg, code) {
        if (status == 200) {
          that.setData({
            industry: data
          })
        }
      }
    })
     */

    setTimeout(() => {
      this.getPlantformInfo((plantformInfo) => {
        this.logo = plantformInfo.site_mobile_logo;
        this.hall_enterprise_enable = plantformInfo.hall_enterprise_enable;

      });

    }, 200);

    this.show();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

    onChangeBindType: function (bindType) {
      this.bindType = bindType;

      if (this.bindEmail == this.bindType) {
        uni.setNavigationBarTitle({
          title: this.__('电子邮箱注册')
        });
      }

      if (this.bindMobile == this.bindType) {
        uni.setNavigationBarTitle({
          title: this.__('手机号注册')
        });
      }

      return this.bindType;
    },

    radioChange: function (e) {
      this.setData({
        user_type: parseInt(e.detail.value)
      })

    },

    bindPickerChange: function (e) {
      this.index = e.target.value
    },

    upImgs: function (e) {
      var that = this;

      that.$.chooseImage({
        count: 1, sizeType: ["compressed"], success: function (n) {
          that.$.showLoading();
          var r = n.tempFilePaths;
          that.$.uploadFile({
            url: that.Config.URL.upload,
            method: "POST",
            filePath: r[0],
            name: "upfile",
            //header: {"content-type": "multipart/form-data"},
            success: function (n) {
              that.$.hideLoading();

              var up_res = that.$.parseJSON(n.data);
              var s = up_res.data.file_url;
              that.setData({user_company_certificates: s})
              console.log(that.user_company_certificates)
            },
            fail: function (e) {
              that.$.hideLoading()
            },
            complete: function (e) {
              that.$.hideLoading()
            }
          })
        },
        fail: function (e) {
          that.$.hideLoading()
        },
        complete: function (e) {
          that.$.hideLoading()
        }
      })
    },

    intlChange: function (data) {
      this.userIntl = data;
    },

    /* start 图形验证码 */
    refresh: function () {
      this.$refs.imgcode.refresh();
    },
    show: function () {
      var that = this;
      if (that.bindType == 3) {
        setTimeout(function () {
          that.refresh();
        }, 1);
      }
    },
    onInputImgCode: function (e) {
      this.mobileCode = e.toLocaleLowerCase();
      if (e.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase()) {
        this.setData({isImgCode: true})
      } else {
        this.setData({isImgCode: false})
      }
    },
    /* end 图形验证码 */

    onInputUserAccount: function (e) {
      this.verifyKey = e
    },


    startReg: function (e) {
      let that = this;

      //注册
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }

      if (that.bindType == that.bindMobile) {
        if (!that.$.tel(this.userAccount, this.userIntl)) {
          this.setData({isUserMobile: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('手机号不正确')
          });

          return false;
        }
      } else if (that.bindType == that.bindEmail) {
        if (!that.$.email(this.userAccount)) {
          this.setData({isUserEmail: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('电子邮箱不正确')
          });

          return false;
        }
      }
      /*
              if (that.$.isNull(this.userNickname))
              {
                  this.setData({isNickname: false});
              }

              if (that.$.isNull(this.mobileCode))
              {
                  this.setData({isCode: false});
              }
              */

      if (!that.$.minlength(this.userPassword, 6)) {
        this.setData({isPassword: false});

        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('密码至少大约6位')
        });

        return false;
      }

      if ((this.bindType != 3) && this.mobileCode.length != 4) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: that.__('验证码不正确')
        });

        return false;
      }


      if (that.$.isNull(this.selectedProId) || that.$.isNull(this.selectedCityId) || that.$.isNull(this.selectedCountyId)) {
        if (that.cf.PLANTFORM_FX_AGENT_ENABLE) {
          this.setData({isDistrict: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('请选择地区信息')
          });

          return;
        }
      }

      this.update();
    },

    update: function () {
      var that = this;

      if (that.bindType == 3) {
        if (this.mobileCode.toLocaleLowerCase()!="" || this.mobileCode.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase()) {
        } else {
          uni.showToast({
            icon: 'none',
            title: that.__('验证码有误'),
          });

          return;
        }
      }

      if (!this.showAgree) {
        that.$.confirm(that.__('请先同意注册协议'));

        uni.showToast({
          icon: 'none',
          title: that.__('请先同意注册协议'),
        });

        return;
      }

      var params = {
        user_account: this.userAccount,
        user_mobile: '',
        user_email: '',

        user_nickname: this.userNickname,
        password: this.userPassword,
        user_avatar: this.userAvatar,
        
        verify_key: this.userIntl + this.userAccount,
        verify_code: this.mobileCode,
        source_user_id: this.sourceUserId,
        source_ucc_code: this.sourceUccCode,
        activity_id: this.activity_id
      };

      params.bind_type = that.bindType; //1:手机号注册   2:Email注册

      if (that.bindType == that.bindMobile) {
        params.user_account = this.userIntl + this.userAccount;
        params.user_mobile = this.userIntl + this.userAccount;
        params.verify_key = this.userIntl + this.userAccount;
      } else if (that.bindType == that.bindEmail) {
        params.user_account = this.userAccount;
        params.user_email = this.userAccount;
        params.verify_key = this.userAccount;
      } else {
        params.user_account = this.userAccount;
        params.verify_key = this.userAccount;

        //服务端跳过验证。
      }

      if (that.cf.PLANTFORM_FX_AGENT_ENABLE) {
        params.user_province_id = that.selectedProId;
        params.user_city_id = that.selectedCityId;
        params.user_county_id = that.selectedCountyId;
      }


      if (that.user_type) {
        params.user_province_id = that.selectedProId;
        params.user_city_id = that.selectedCityId;
        params.user_county_id = that.selectedCountyId;
        params.user_company_certificates = that.user_company_certificates;
        params.industry_id = that.industry_id;

      } else {
        params.user_company_id = that.user_company_id;
      }

      that.$.request({
        url: this.Config.URL.register,
        method: "POST",
        data: params,
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.showToast({
              title: that.__("注册成功!"), success: function () {
                var id = that.$.setStorageSync('uid', data.user_id);
                var key = that.$.setStorageSync('ukey', data.token);

                // #ifdef H5
                $cookies.set('uid', data.user_id);
                $cookies.set('ukey', data.token);
                // #endif

                that.$.request({
                  url: that.Config.URL.userInfo,
                  success: function (data, status, msg, code) {
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
                });
              }
            })
          } else {
            that.$.confirm(msg);
          }
        }

      });
    },

    onInputNickname: function (e) {
      let that = this;
      this.setData({userNickname: e.detail.value})
      that.$.isNull(e.detail.value) ? this.setData({isNickname: false}) : this.setData({isNickname: true})
    },

    onInputPassword: function (e) {
      let that = this;
      this.setData({userPassword: e.detail.value})
      that.$.isNull(e.detail.value) ? this.setData({isPassword: false}) : this.setData({isPassword: true})
    },

    inputcode: function (e) {
      let that = this;
      this.setData({mobileCode: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: false}) : this.setData({isCode: true})
    },

    getSmsCode: function () {
      let that = this;
      let url = this.Config.URL.sendMobileVerifyCode;
      var params = {};

      if (that.bindType == that.bindMobile) {
        if (!that.$.tel(this.userAccount, this.userIntl)) {
          this.setData({isUserMobile: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('手机号不正确')
          });
          return false;
        }

        url = this.Config.URL.sendMobileVerifyCode;
        params = {
          mobile: this.userIntl + this.userAccount
        };
      } else if (that.bindType == that.bindEmail) {
        if (!that.$.email(this.userAccount)) {
          this.setData({isUserEmail: false});

          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('电子邮箱不正确')
          });

          return false;
        }

        url = this.Config.URL.sendEmailVerifyCode
        params = {
          email: this.userAccount
        };
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

        that.$.request({
          url: url,
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

    // 三级联动选择
    showbox() {
      /*
      this.setData({
          isShow: true
      })
      */
      this.$refs.mpvueCityPicker.open()
    },

    onCancel(e) {
      //console.log(e)
    },

    onConfirm(e) {
      let that = this;
      const disList = e.value

      let districtInfoStr = that.__('请选择地址')

      if (disList.length == 3) {
        districtInfoStr = that.$.sprintf('%s %s %s', disList[0].district_name, disList[1].district_name, disList[2].district_name)
      } else {
        return
      }

      this.setData({
        isDistrict: true,
        selectedProId: e.value[0],
        selectedCityId: e.value[1],
        selectedCountyId: e.value[2],
        selectedPro: e.label[0],
        selectedCity: e.label[1],
        selectedCounty: e.label[2],
        addressString: districtInfoStr
      });
    },

    onChangeProtocol: function (e) {
      var values = e.detail.value;

      if (values.length > 0) {
        this.showAgree = true;
      } else {
        this.showAgree = false;
      }
    },
    closeBanner: function () {
      this.bannerShow = false;
    },
    showBanner: function () {
      let that = this;

      that.$.request({
        url: that.Config.URL.protocol,
        data: {},
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.bannerShow = true;
            that.protocol_text = data.document;
          } else {
            that.$.confirm(msg);
          }
        }
      });

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
    },

    isShowAgree() {
      let that = this;

      //是否选择协议
      that.showAgree = !that.showAgree;
    },

    showProtocol: function (id) {
      uni.navigateTo({
        url: '/member/member/protocol?id=' + id
      })
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

.m-upImg {
  box-sizing: border-box;
  padding: 20rpx;
  display: flex;
  line-height: 136rpx;
  // background-color: #fff;
}

.m-upImg-item {
  width: 120rpx;
  height: 120rpx;
  // border: 1px solid #eee;
  display: inline-block;
  margin: 9rpx;
  border-radius: 4rpx;
  vertical-align: middle;
  position: relative;
}

.m-upImg-item image {
  width: 100%;
  height: 100%;
}

.u-del-item {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  line-height: 40rpx;
  color: #fff;
  z-index: 5;
}

.u-del-item label {
  font-size: 28rpx;
}

.upSelect {
  background-color: #eee;
  text-align: center;
  line-height: 120rpx;
}

.upSelect label {
  font-size: 40rpx;
}

.m-submitComment {
  position: fixed;
  height: 100rpx;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 5;
  left: 0;
  bottom: 0;
}

.uni-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 36rpx; /* Input 高度 */
  color: #333333;
  padding: 32rpx;
  margin-top: 24rpx;
  margin-bottom: 24rpx;

  border: none;
  border-radius: 2.5rem;
  -webkit-box-shadow: 0 0 60rpx 0 rgba(43, 86, 112, .1);
  box-shadow: 0 0 60rpx 0 rgba(43, 86, 112, .1);
  background: none;
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

.m-vcode-btn{
  position: absolute;
  right: 16rpx;
  top: 32rpx;
}
</style>
