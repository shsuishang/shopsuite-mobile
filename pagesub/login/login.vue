<template>
  <view class="login">
    <view class="auth-pop" v-if="loadFlag && (isMpWeixin && wechatConnectAuto && !isAuthorizationed)">
      <view class="auth-box" v-if="wechatConnectBox">
        <image src="https://static.shopsuite.cn/xcxfile/appicon/shield.png"></image>
        <label>{{ __('新用户注册') }}</label>
        <view class="">
          <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <image class="avatar" :src="userAvatar  ? userAvatar : '/static/images/user_no_avatar.png'"></image>
          </button>
          <view class="m-cells m-cells-form">
            <view class="m-cell">
              <view class="m-cell-hd">
                <label class="u-label">{{ __('昵称') }}</label>
              </view>
              <view class="m-cell-bd"><input type="nickname" class="weui-input" :placeholder="__('请输入昵称')"
                                             @blur="bindblur" @input="bindinput"/></view>
            </view>
          </view>
        </view>

        <view class="btn-row" style="margin-top: 40rpx;padding:10rpx 20rpx">
          <checkbox-group @change="onChangeProtocol">
            <label>
              <checkbox :checked="protocolChecked" value="1"/>
            </label>
            <label @tap="showProtocol('reg_protocols_description')">{{ __('同意') }}{{ __('《用户协议》') }}</label>
          </checkbox-group>
        </view>

        <button type="primary" @click="getUserProfile">{{ __('一键注册') }}</button>
      </view>
    </view>
    <view class="content" v-if="loadFlag && !(isMpWeixin && wechatConnectAuto && !isAuthorizationed)">
      <!-- 头部logo -->
      <view class="header">
        <image :src="logo"></image>
      </view>
      <!-- 主体表单 -->
      <view class="main">
        <wInput v-if="bind_type == 1" v-model="account" type="text" isShowIntl @intl="intlChange"
                :placeholder="__('请输入手机号码')"></wInput>

        <wInput v-if="bind_type == 2 || bind_type == 3" v-model="account" type="text"
                :placeholder="__('请输入账号')"></wInput>
        <wInput v-model="password" type="password" :placeholder="__('请输入密码')" isShowPass></wInput>
      </view>
      <view class="footer">
        <text @tap="isShowAgree" class="cuIcon" :class="showAgree ? 'cuIcon-radiobox' : 'cuIcon-round'"></text>
        <text @tap="isShowAgree" style="margin: 0 0 0 2px;">{{ __('登录即代表您已同意') }}</text>
        <!-- 协议地址 -->
        <navigator url="/member/member/protocol?id=reg_protocols_description" open-type="navigate">《{{
            __('服务协议')
          }}》
        </navigator>
        {{ __('和') }}
        <navigator url="/member/member/protocol?id=pr_protocols_description" open-type="navigate">《{{
            __('隐私政策')
          }}》
        </navigator>
      </view>
      <wButton :text="__('登 录')" :rotate="isRotate" @click.native="bindLogin()" class="wbutton"></wButton>

      <!-- 其他登录 -->
      <!-- #ifdef H5 -->
      <view class="other_login cuIcon">
        <view class="login_icon" v-for="provider in providerList" :key="provider.value"
              v-if="provider.value !== 'apple'">
          <!-- wap app -->
          <!-- <view class="cuIcon-item"><image :src="provider.image" @tap="plus_oauth(provider.value)"></image></view> -->
          <view class="cuIcon-item">
            <image :src="provider.image" @tap="h5_oauth(provider.value)"></image>
          </view>
        </view>

        <view class="login_icon" v-if="loadFlag && isMpH5Weixin">
          <view class="cuIcon-item">
            <image src="/static/images/login/weixin.png" @tap="onChangeBindType(5)"></image>
          </view>
        </view>

        <view class="login_icon">
          <view class="cuIcon-item">
            <image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image>
          </view>
        </view>

        <view class="login_icon">
          <view class="cuIcon-item">
            <navigator url="/pagesub/login/sms" open-type="navigate"><image src="/static/images/login/sms.png"></image></navigator>
          </view>
        </view>

        <view class="login_icon" v-if="false">
          <view class="cuIcon-item">
            <image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <view class="other_login cuIcon">
        <view class="login_icon" v-for="provider in providerList" :key="provider.value">
          <view class="cuIcon-item">
            <image :src="provider.image" @tap="oauth(provider.value)"></image>
          </view>
        </view>

        <view class="login_icon" v-if="loadFlag && isMpWeixin">
          <view class="cuIcon-item">
            <image src="/static/images/login/weixin.png" @tap="onChangeBindType(4)"></image>
          </view>
        </view>

        <view class="login_icon">
          <view class="cuIcon-item">
            <image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image>
          </view>
        </view>

        <view class="login_icon">
          <view class="cuIcon-item">
            <navigator url="/pagesub/login/sms" open-type="navigate"><image src="/static/images/login/sms.png"></image></navigator>
          </view>
        </view>

        <view class="login_icon" v-if="false">
          <view class="cuIcon-item">
            <image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- 底部信息 -->
      <view class="footer">
        <view @click="onChangeBindType(3)">{{ __('账号密码登录') }}</view>
        <text>|</text>
        <navigator url="/pagesub/login/forget" open-type="navigate">{{ __('找回密码') }}</navigator>
        <text>|</text>
        <navigator url="/pagesub/login/register" open-type="navigate">{{ __('注册账号') }}</navigator>
      </view>
    </view>
  </view>
</template>

<script>
import wInput from './watch-login/watch-input.vue'; //input
import wButton from './watch-login/watch-button.vue'; //button
// #ifdef H5
import $cookies from '../../helpers/vue-cookies';
// #endif

import {mapMutations, mapState} from 'vuex';

export default {
  data() {
    return {
      loadFlag: false,
      options: {},
      connect: {},
      providerList: [],
      hasProvider: false,
      logo: '',

      account: '',
      password: '',

      positionTop: 0,
      protocolChecked: false,

      wechatConnectBox: false, //授权界面

      wechatConnectAuto: false, //微信自动登录

      isAuthorizationed: false,
      isMpWeixin: false,
      wxwork: 0, //是否企业微信

      isMpToutiao: false,
      plusOauthWeixin: {},

      bind_type: 3, //1:手机号注册   2:email 注册


      isMpH5Weixin: false,
      code: "", //微信公众号登录回调

      user_intl: '',

      system: '', // 系统版本
      platform: '', // 平台

      client_info: '{}',

      data: {},

      userAvatar: '',
      userNickname: '',

      showAgree: false, //协议是否选择
      isRotate: false //是否加载旋转
    };
  },
  components: {
    wInput,
    wButton
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'forcedLoginState']),
  async onLoad(options) {
    let that = this;

    uni.setNavigationBarTitle({
      title: this.__('登录')
    });

    await this.$onLaunched;

    this.getPlantformInfo(plantformInfo => {
      this.logo = plantformInfo.site_mobile_logo;
      this.wechatConnectAuto = plantformInfo.wechat_connect_auto ? true : false;
    });

    that.setData({
      options: options
    });

    // 先判断 系统版本
    uni.getSystemInfo({
      success: res => {
        this.system = res.system;
        this.platform = res.platform;
      },
      fail: err => {
      },
      complete: () => {
      }
    });

    // #ifdef MP-TOUTIAO
    this.isMpToutiao = true;
    let login_func = that.$.login;

    login_func({
      success: function (datainfo) {
        console.info(datainfo);

        const activity_id = uni.getStorageSync('activity_id');

        //请求服务器
        that.$.request({
          url: that.Config.URL.wx.checkAppLogin,
          data: {
            code: datainfo.code,
            wxwork: that.wxwork,
            activity_id:activity_id,
            source_store_id: that.$.getStorageSync('source_store_id'),
            source_user_id: that.$.getStorageSync('source_user_id'),
            source_ucc_code: that.$.getStorageSync('source_ucc_code'),
            client_info: that.client_info
          },
          success: function (data, status, msg, code) {
            if (status == 200) {
              that.setData({isAuthorizationed: true});

              var key = that.$.setStorageSync('ukey', data.token);

              that.toMain(data);
            } else {
              that.setData({isAuthorizationed: false});
              that.setData({wechatConnectBox: true});
            }
          },
          fail: function () {
            // fail
            // that.$.hideToast();
          },
          complete: function () {
            // complete
          }
        });
      }
    });
    // #endif

    // #ifdef MP-WEIXIN
    this.isMpWeixin = true;

    //判断是否企业微信
    let e = that.$.getSystemInfoSync();

    wx.getUserInfo({
      success: res => {
        that.setData({
          data: res
        });
      },
      fail: function (err) {
        console.log('获取失败: ', err);
      }
    });

    if (e.environment) {
      this.wxwork = e.environment == 'wxwork' ? 1 : 0;
    }

    this.wxwork = e.environment == 'wxwork' ? 1 : 0;

    //如果是自动登录
    if (this.wechatConnectAuto) {
      this.wechatMpLogin();
    }
    // #endif

    // #ifdef H5
    if (that.$.isWeixin()) {
      that.isMpH5Weixin = that.$.isWeixin()


      //微信登录回调
      if (options.code) {
        //alert(options.code);
        this.code = options.code;
        that.wechatMpH5Login(options.code);
      } else {
        //如果是自动登录
        if (that.wechatConnectAuto) {
          that.weixin_h5_oauth('weixin');
        }
      }

      //这里执行的是有code的情况下执行微信登陆
      //没有的话执行 this.weixin_h5_oauth()方法
    } else {
      //H5
      let ukey = $cookies.get('ukey');

      if (ukey) {
      } else {
        ukey = that.$.getStorageSync('ukey');
      }

      //判断Cookie是否登录
      if (ukey) {
        that.$.request({
          url: this.Config.URL.userInfo,
          data: {perm_key: ukey},
          success: function (data, status, msg, code) {
            if (200 == status) {
              var key = that.$.setStorageSync('ukey', ukey);

              that.toMain(data);

              //返回来源页面
            } else {
              that.logout();
            }
          },
          fail: function (err, status) {
            that.logout();
          }
        });
      }
    }
    // #endif

    this.initPosition();
    //this.initProvider();

    // #ifdef APP-PLUS
    plus.push.getClientInfoAsync(
        function (info) {
          console.log(info);
          if (info.clientid) {
            that.client_info = JSON.stringify(info);
          }
        },
        function (e) {
          console.log(JSON.stringify(e));
        }
    );
    // #endif

    //默认登录方式1、手机  2、Email  3、用户昵称
    this.onChangeBindType(1);


    that.loadFlag = true;
  },
  //仅 5+App 平台上支持此函数。
  onBackPress() {
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    bindblur(e) {
      this.userNickname = e.detail.value; // 获取微信昵称
    },
    bindinput(e) {
      this.userNickname = e.detail.value; //这里要注意如果只用blur方法的话用户在输入玩昵称后直接点击保存按钮，会出现修改不成功的情况。
    },

    onChooseAvatar: function (e) {
      let that = this;
      let {avatarUrl} = e.detail;
      that.$.showLoading({
        title: '加载中'
      });

      that.$.uploadFile({
        url: that.Config.URL.upload,
        method: 'POST',
        filePath: avatarUrl,
        name: 'upfile',
        // 							header: {
        // 								"content-type": "multipart/form-data"
        // 							},
        success: function (n) {
          that.$.hideLoading();

          var up_res = that.$.parseJSON(n.data);
          if (up_res.status == 200) {
            var s = up_res.data.file_url;
            that.setData({
              userAvatar: s
            });
          } else {
            that.$.alert(up_res.msg)
          }


        },
        fail: function (e) {
          that.$.hideLoading();
        },
        complete: function (e) {
          that.$.hideLoading();
        }
      });
    },

    onChangeBindType: function (bind_type) {
      var that = this;
      this.bind_type = bind_type;

      if (this.bind_type == 2) {
        uni.setNavigationBarTitle({
          title: this.__('电子邮箱登录')
        });

        that.$.showToast({
          icon: 'none',
          title: that.__('请输入电子邮箱')
        });
      }

      if (this.bind_type == 1) {
        uni.setNavigationBarTitle({
          title: this.__('手机号登录')
        });

        that.$.showToast({
          icon: 'none',
          title: that.__('请输入手机号')
        });
      }

      if (this.bind_type == 3) {
        uni.setNavigationBarTitle({
          title: this.__('账号登录')
        });

        that.$.showToast({
          icon: 'none',
          title: that.__('请输入账号密码')
        });
      }

      //微信登录小程序
      if (this.bind_type == 4) {
        that.wechatConnectAuto = true;

        uni.setNavigationBarTitle({
          title: this.__('微信登录')
        });

        that.wechatMpLogin();
      }

      //微信公众号
      if (this.bind_type == 5) {
        that.weixin_h5_oauth('weixin')

        uni.setNavigationBarTitle({
          title: this.__('微信登录')
        });
      }


      //微信App
      if (this.bind_type == 6) {
        uni.setNavigationBarTitle({
          title: this.__('微信登录')
        });
      }

      return this.bind_type;
    },

    intlChange: function (data) {
      this.user_intl = data;
    },
    initProvider() {
      let that = this;
      //const filters = ['weixin', 'qq', 'sinaweibo'];
      //const filters = [];

      //connect
      that.$.request({
        url: that.Config.URL.connect,
        data: {},
        success: (data, status, msg, code) => {
          if (status == 200) {
            that.connect = data;
            const filters = data.filters;
            console.info(filters);

            // #ifndef H5
            that.$.getProvider({
              service: 'oauth',
              success: res => {
                if (res.provider && res.provider.length) {
                  for (let i = 0; i < res.provider.length; i++) {
                    if (~filters.indexOf(res.provider[i])) {
                      that.providerList.push({
                        value: res.provider[i],
                        image: '/static/images/login/' + res.provider[i] + '.png'
                      });
                    }
                  }
                  that.hasProvider = true;
                }

                //增加第三方的
                let tid = 'fb';
                if (~filters.indexOf(tid)) {
                  that.providerList.push({
                    value: tid,
                    image: '/static/images/login/' + tid + '.png'
                  });
                }

                tid = 'google';
                if (~filters.indexOf(tid)) {
                  that.providerList.push({
                    value: tid,
                    image: '/static/images/login/' + tid + '.png'
                  });
                }

                console.log(that.providerList);
              },
              fail: err => {
                console.error('获取服务供应商失败：' + JSON.stringify(err));
              }
            });
            // #endif

            // #ifdef H5
            //判断是否为APP调用
            if (that.$.ifUniApp()) {
              //1. 初始化加载分享模块
              plus.oauth.getServices(
                  function (res) {
                    //console.log(JSON.stringify(res));

                    if (res && res.length) {
                      for (let i = 0; i < res.length; i++) {
                        if (~filters.indexOf(res[i]['id'])) {
                          if ('weixin' == res[i]['id']) {
                            if (that.$.isWeixin()) {
                              that.providerList.push({
                                value: res[i]['id'],
                                image: '/static/images/login/' + res[i]['id'] + '.png'
                              });
                            }
                          } else {
                            that.providerList.push({
                              value: res[i]['id'],
                              image: '/static/images/login/' + res[i]['id'] + '.png'
                            });
                          }
                        }

                        if ('weixin' == res[i]['id']) {
                          that.plusOauthWeixin = res[i];
                        }
                      }

                      that.hasProvider = true;
                    }
                  },

                  function (e) {
                    alert('获取分享服务列表失败：' + e.message);
                  }
              );

              //setTimeout(share, 5000)
            } else {
              let res = data.items;
              for (let i = 0; i < res.length; i++) {
                if (~filters.indexOf(res[i]['id'])) {
                  if ('weixin' == res[i]['id']) {
                    if (that.$.isWeixin()) {
                      that.providerList.push({
                        value: res[i]['id'],
                        image: '/static/images/login/' + res[i]['id'] + '.png'
                      });
                    }
                  } else {
                    that.providerList.push({
                      value: res[i]['id'],
                      image: '/static/images/login/' + res[i]['id'] + '.png'
                    });
                  }
                }

                if ('weixin' == res[i]['id']) {
                  that.plusOauthWeixin = res[i];
                }
              }

              that.hasProvider = true;
            }
            // #endif
          } else {
          }
        },
        fail: function () {
        },
        complete: function () {
        }
      });
    },
    initPosition() {
      let that = this;
      /**
       * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
       * 反向使用 top 进行定位，可以避免此问题。
       */
      this.positionTop = that.$.getSystemInfoSync().windowHeight - 100;
    },
    bindLogin() {
      var that = this;

      //登录
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }

      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      /*
            if (this.account.length < 4) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('账号最短为 4 个字符')
                });
                return;
            }

            if (this.password.length < 6) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('密码最短为 6 个字符')
                });
                return;
            }
      */

      that.isRotate = true;
      setTimeout(function () {
        that.isRotate = false;
      }, 2000);

      /**
       * 下面简单模拟下服务端的处理
       * 检测用户账号密码是否在已注册的用户列表中
       * 实际开发中，使用 that.$.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
       */
      //SYS.URL.login,
      if (that.bind_type == 1) {
        if (!that.$.tel(this.account, this.user_intl)) {
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: that.__('手机号不正确')
          });

          return false;
        }
      }
      const params = {
        username: this.account,
        password: this.password,
        client_info: that.client_info
      };

      if (that.bind_type == 1) {
        params.username = this.user_intl + this.account;
      }
      if (!this.showAgree) {
        that.$.confirm(that.__('请先阅读并同意《隐私政策》'));

        uni.showToast({
          icon: 'none',
          title: that.__('请先阅读并同意《隐私政策》')
        });

        return;
      }

      params.user_account = params.username;
      params.encrypt = false;

      that.$.request({
        url: this.Config.URL.login,
		method: 'POST',
        data: params,
        success: function (data, status, msg, code) {
          //console.info(JSON.stringify(data));

          if (200 == status) {
            var key = that.$.setStorageSync('ukey', data.token);

            // #ifdef H5
            $cookies.set('ukey', key);
            // #endif

            that.toMain(data);
          } else {
            msg = msg || that.__('用户账号或密码不正确')

            that.$.showToast({
              icon: 'none',
              title: msg
            });
          }
        },
        fail: function (err, status) {
          that.$.showToast({
            icon: 'none',
            title: that.__('登录有误，请重试')
          });
        }
      });
    },
    oauth(value) {
      let that = this;

      if ('fb' == value) {
        /*
        //自研的接口
        let jyappEvents = uni.requireNativePlugin("JY-FaceBookAppEvents");
        jyappEvents.jy_facebookLogin(res=> {
          console.info(res);
          if (res.errorCode == "0")
          {
            that.$.request({
              url: that.Config.URL.do_app_login,
              type: 'POST',
              dataType: 'json',
              data: {
                bind_name: 'fb',
                code: res.data.token,
                openId: res.data.userId,
                nickName: res.data.userId,
                authResponse: JSON.stringify(res['data']),
                client_info:that.client_info
              },
              success: (data, status, msg, code) => {
                console.info(data);

                if (200 == status) {
                  
                  var key = that.$.setStorageSync('ukey', data.token);

                  // #ifdef H5
                  $cookies.set('uid', data.user_id);
                  $cookies.set('ukey', data.key);
                  // #endif

                  that.toMain(data);
                } else {
                  that.$.showToast({
                    icon: 'none',
                    title: that.__('登录失败！')
                  });
                }
              }
            });
          }
          else
          {
            that.$.showToast({
              icon: 'none',
              title: that.__('登录失败！')
            });
          }
        })
        */

        //云插件https://ext.dcloud.net.cn/plugin?id=3639

        var facebook = uni.requireNativePlugin('sn-facebook');

        // 获取登录状态
        const rs = facebook.isLoggedIn();

        // 登出
        facebook.logout(e => {
          console.info('---------------------');
          // 登录
          facebook.loginWithParams(
              {
                permissions: [
                  // 权限，更多权限请看 https://developers.facebook.com/docs/permissions/reference
                  'email',
                  // "user_photos",
                  // "user_gender",
                  // "user_birthday",
                  'public_profile'
                ],
                // 返回字段，更多字段请查看 https://developers.facebook.com/docs/graph-api/reference/user/
                fields: 'id, name, email, picture' // gender, birthday,
              },
              res => {
                // e 对象如下
                // {
                //     result: true,
                //     data: {
                //         token: '',
                //         userId: '',
                //         name: '',
                //         email: '',
                //         gender: '',
                //         birthday: ''
                //         photo: ''
                //     }
                // }

                const activity_id = uni.getStorageSync('activity_id');

                if (res.result == true) {
                  that.$.request({
                    url: that.Config.URL.do_app_login,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                      bind_name: 'fb',
                      code: res.data.token,
                      activity_id:activity_id,
                      openId: res.data.userId,
                      nickName: res.data.name,
                      authResponse: JSON.stringify(res['data']),
                      client_info: that.client_info
                    },
                    success: (data, status, msg, code) => {
                      console.info(data);

                      if (200 == status) {

                        var key = that.$.setStorageSync('ukey', data.token);

                        // #ifdef H5
                        $cookies.set('uid', data.user_id);
                        $cookies.set('ukey', data.key);
                        // #endif

                        that.toMain(data);
                      } else {
                        that.$.showToast({
                          icon: 'none',
                          title: that.__('登录失败！')
                        });
                      }
                    }
                  });
                } else {
                  that.$.showToast({
                    icon: 'none',
                    title: that.__('登录失败！')
                  });
                }
              }
          );
        });
      } else if ('google' == value) {
        //android 配置  https://developers.google.com/identity/sign-in/android/start
        //https://developers.google.com/identity/sign-in/android/start
        //JY-GoogleSignin
        console.info('google init');
        //JY-GoogleSignin
        let JYGoogleSignin = uni.requireNativePlugin('JY-GoogleSignin');
        JYGoogleSignin.jy_init(
            {
              client_id: that.connect.google_app_id
            },
            res => {
              //	这里不会有返回数据

              console.info('google init ok');
            }
        );

        JYGoogleSignin.jy_startLogin(res => {
          console.info(res);
          if (res.errorCode == '0') {
            that.$.request({
              url: that.Config.URL.do_app_login,
              type: 'POST',
              dataType: 'json',
              data: {
                bind_name: 'google',
                code: res.data.idToken,
                openId: res.data.userId,
                user_email: res.data.email,
                nickName: res.data.fullName,
                avatarUrl: res.data.photoUrl,
                authResponse: JSON.stringify(res['data']),
                client_info: that.client_info
              },

              success: (data, status, msg, code) => {
                console.info(data);

                if (200 == status) {

                  var key = that.$.setStorageSync('ukey', data.token);

                  // #ifdef H5
                  $cookies.set('uid', data.user_id);
                  $cookies.set('ukey', data.key);
                  // #endif

                  that.toMain(data);
                } else {
                  that.$.showToast({
                    icon: 'none',
                    title: that.__('登录失败！')
                  });
                }
              }
            });
          } else {
            that.$.showToast({
              icon: 'none',
              title: that.__('登录失败！')
            });
          }
        });
      } else if ('sms' == value) {
        this.sms_oauth(value);
      } else {
        that.$.login({
          provider: value,
          success: res => {
            that.$.getUserInfo({
              provider: value,
              success: infoRes => {
                if (infoRes.errMsg == 'getUserInfo:ok') {
                  //console.info(JSON.stringify(infoRes));
                  //console.info(value);

                  /**
                   * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                   * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                   */
                      //this.toMain(infoRes.userInfo.nickName);
                  var t = infoRes.userInfo;
                  t.bind_name = value;

                  //{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

                  /*
                  if (value == 'weixin')
                  {
                    let rawData = JSON.parse(infoRes.rawData);

                    var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
                    var iv = encodeURIComponent(rawData.iv);
                    var code = t.openId;

                    t.code = code;
                    t.encryptedData = encryptedData;
                    t.iv = iv;
                  }
                  */
                  t.code = t.openId;

                  t.source_store_id = that.$.getStorageSync('source_store_id');
                  t.source_user_id = that.$.getStorageSync('source_user_id');
                  t.source_ucc_code = that.$.getStorageSync('source_ucc_code');
                  t.client_info = that.client_info;


                  const activity_id = uni.getStorageSync('activity_id');
                  t.activity_id = activity_id;

                  //请求服务器
                  that.$.request({
                    url: that.Config.URL.do_app_login,
                    data: t,
                    success: function (data, status, msg, code) {
                      if (status != 200) {
                        // 登录错误
                        that.$.showModal({
                          title: '提示',
                          content: '无法登录，请重试！',
                          showCancel: false
                        });

                        that.$.navigateBack();
                        return;
                      }

                      var key = that.$.setStorageSync('ukey', data.token);

                      that.toMain(data);
                    },
                    fail: function () {
                      // fail
                      // that.$.hideToast();
                    },
                    complete: function () {
                      // complete
                    }
                  });
                } else {
                }
              }
            });
          },
          fail: err => {
            console.error('授权登录失败：' + JSON.stringify(err));
          }
        });
      }
    },

    /* wap app 登录*/
    plus_oauth(value) {
      let that = this;

      // 登录操作
      function authLogin() {
        //console.info('plusOauthWeixin')
        //console.info(that.plusOauthWeixin)
        var s = that.plusOauthWeixin;

        if (!s.authResult) {
          s.login(
              function (e) {
                authUserInfo();
              },
              function (e) {
                alert('登录认证失败！');
              }
          );
        } else {
          //alert( "已经登录认证！" );

          authUserInfo();
        }
      }

      // 获取登录用户信息操作
      function authUserInfo() {
        var s = that.plusOauthWeixin;

        if (!s.authResult) {
          alert('未登录授权！');
        } else {
          s.getUserInfo(
              function (res) {
                ////console.info( "获取用户信息成功："+JSON.stringify(res) );
                //alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );

                var value = 'weixin';
                var infoRes = res.target;

                if (true) {
                  /**
                   * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                   * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                   */
                      //this.toMain(infoRes.userInfo.nickName);
                  var t = infoRes.userInfo;
                  t.bind_name = value;

                  //{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

                  if (value == 'weixin') {
                    /*
                      let rawData = JSON.parse(infoRes.rawData);

                      var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
                      var iv = encodeURIComponent(rawData.iv);
                      var code = t.openId;

                      t.encryptedData = encryptedData;
                      t.iv = iv;
                  */
                    t.code = t.openid;
                  }

                  t.source_store_id = that.$.getStorageSync('source_store_id');
                  t.source_user_id = that.$.getStorageSync('source_user_id');
                  t.source_ucc_code = that.$.getStorageSync('source_ucc_code');
                  t.client_info = that.client_info;

                  const activity_id = uni.getStorageSync('activity_id');
                  t.activity_id = activity_id;

                  //请求服务器
                  that.$.request({
                    url: that.Config.URL.do_app_login,
                    data: t,
                    success: function (data, status, msg, code) {
                      if (status != 200) {
                        // 登录错误
                        that.$.showModal({
                          title: '提示',
                          content: '无法登录，请重试！',
                          showCancel: false
                        });

                        that.$.navigateBack();
                        return;
                      }


                      var key = that.$.setStorageSync('ukey', data.token);

                      that.toMain(data);
                    },
                    fail: function () {
                      // fail
                      // that.$.hideToast();
                    },
                    complete: function () {
                      // complete
                    }
                  });
                } else {
                }
              },
              function (e) {
                alert('获取用户信息失败：' + e.message + ' - ' + e.code);
              }
          );
        }
      }

      authLogin();
    },

    h5_oauth(id) {
      let that = this;

      if ('fb' == id) {
        this.fb_oauth(id);
      } else if ('google' == id) {
        this.google_oauth(id);
      } else if ('weixin' == id) {
        this.weixin_h5_oauth(id);
      } else if ('sms' == id) {
        this.sms_oauth(id);
      } else if ('qq' == id) {
        this.qq_oauth(id);
      }
    },

    weixin_h5_oauth(id) {
      let that = this;

      let ukey = $cookies.get('ukey');

      if (ukey) {
      } else {
        ukey = that.$.getStorageSync('ukey');
      }

      //判断Cookie是否登录
      if (ukey) {
        that.$.request({
          url: this.Config.URL.userInfo,
          data: {perm_key: ukey},
          success: function (data, status, msg, code) {
            if (200 == status) {
              var key = that.$.setStorageSync('ukey', ukey);

              data['as'] = $cookies.get('as');
              that.toMain(data);

              //返回来源页面
            } else {
              that.logout();
            }
          },
          fail: function (err, status) {
            that.logout();
          }
        });
      } else {
        if (getCurrentPages()[getCurrentPages().length - 1].route == 'pagesub/login/login' || getCurrentPages()[getCurrentPages().length - 1].route == '/pagesub/login/login') {
          //记录来源页面
          if (getCurrentPages().length > 1) {
            var prePage = getCurrentPages()[getCurrentPages().length - 2];
            if (prePage) {
              that.$.setStorageSync('pre_route', prePage.route);

              if (prePage.options) {
                that.$.setStorageSync('pre_options', prePage.options);
              }
            }
          } else {
          }

          //是否企业微信
          if (that.$.isQyWeixin()) {
            window.location.href = that.Config.URL.wx.mplogin + '&wxwork=1' + '&callback=' + encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pagesub/login/login'); //暂时注释
          } else {
            //前端跳转

            let url = (that.Config.CONFIG.base_url=="https://demo.modulithshop.cn" ?  "https://test.suteshop.com" : that.Config.CONFIG.base_url) + '/h5/pagesub/login/login';
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + that.plantformInfo.wechat_app_id + "&redirect_uri=" + encodeURIComponent(url) +
                "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"

            //后台跳转
            //window.location.href = that.Config.URL.wx.mplogin + '&callback=' + encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pagesub/login/login'); //暂时注释
          }
        } else {
          var prePage = getCurrentPages()[getCurrentPages().length - 1];
          if (prePage) {
            that.$.setStorageSync('pre_route', prePage.route);

            if (prePage.options) {
              that.$.setStorageSync('pre_options', prePage.options);
            }
          }
          //记录来源页面

          //是否企业微信
          if (that.$.isQyWeixin()) {
            window.location.href = that.Config.URL.wx.mplogin + '&wxwork=1' + '&callback=' + encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pagesub/login/login'); //暂时注释
          } else {
            //前端跳转
            let url = (that.Config.CONFIG.base_url=="https://demo.modulithshop.cn" ?  "https://test.suteshop.com" : that.Config.CONFIG.base_url) + '/h5/pagesub/login/login';
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + that.plantformInfo.wechat_app_id + "&redirect_uri=" + encodeURIComponent(url) +
                "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
            //window.location.href = that.Config.URL.wx.mplogin + '&callback=' + encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pagesub/login/login'); //暂时注释
          }
        }
      }
    },

    //微信公众号端登陆
    wechatMpH5Login(code) {
      const activity_id = uni.getStorageSync('activity_id');

      let that = this;
      that.$.request({
        url: that.Config.URL.wx.checkMpH5Login,
        data: {
          code: code,
          activity_id: activity_id,
          wxwork: that.wxwork,
          source_store_id: that.$.getStorageSync('source_store_id'),
          source_user_id: that.$.getStorageSync('source_user_id'),
          source_ucc_code: that.$.getStorageSync('source_ucc_code'),
          client_info: that.client_info
        },
        method: 'GET',
        success: function (data, status, msg, code) {
          var key = that.$.setStorageSync('ukey', data.token);

          // #ifdef H5
          $cookies.set('ukey', key);
          // #endif

          that.toMain(data);

          /*
          console.log("返回openid", res.data.openid);
          // that.openid = res.data.data.openid;
          if (res.data.code == 500) { //code为500是没有此用户需要注册
            that.openid = res.data.openid;
            that.state = 1;
            //this.openid = res.data.openid;
            that.toggle('center');
          } else {
            that.openid = res.data.openid.data.openid;
            let {username} = res.data.openid.data;
            that.login(username, username)
          }
           */
        }
      })
    },

    //微信端登陆小程序
    wechatMpLogin(code) {
      let login_func = this.$.login;

      if (this.wxwork) {
        login_func = wx.qy.login;

        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              that.setData({isAuthorizationed: false});

              login_func({
                success: function (qy_datainfo) {
                  that.$.login({
                    success: function (datainfo) {
                      const activity_id = uni.getStorageSync('activity_id');

                      //请求服务器
                      that.$.request({
                        url: that.Config.URL.wx.checkAppLogin,
                        data: {
                          qy_code: qy_datainfo.code,
                          code: datainfo.code,
                          wxwork: that.wxwork,
                          activity_id:activity_id,
                          source_store_id: that.$.getStorageSync('source_store_id'),
                          source_user_id: that.$.getStorageSync('source_user_id'),
                          source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                          client_info: that.client_info
                        },
                        success: function (data, status, msg, code) {
                          if (status == 200) {
                            that.setData({isAuthorizationed: true});


                            var key = that.$.setStorageSync('ukey', data.token);

                            that.toMain(data);
                          } else {
                            that.setData({isAuthorizationed: false});
                          }
                        },
                        fail: function () {
                          // fail
                          // that.$.hideToast();
                        },
                        complete: function () {
                          // complete
                        }
                      });
                    }
                  });
                }
              });
            } else {
              login_func({
                success: function (qy_datainfo) {
                  that.$.login({
                    success: function (datainfo) {
                      //请求服务器
                      const activity_id = uni.getStorageSync('activity_id');

                      that.$.request({
                        url: that.Config.URL.wx.checkAppLogin,
                        data: {
                          qy_code: qy_datainfo.code,
                          code: datainfo.code,
                          wxwork: that.wxwork,
                          activity_id:activity_id,
                          source_store_id: that.$.getStorageSync('source_store_id'),
                          source_user_id: that.$.getStorageSync('source_user_id'),
                          source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                          client_info: that.client_info
                        },
                        success: function (data, status, msg, code) {
                          if (status == 200) {
                            that.setData({isAuthorizationed: true});


                            var key = that.$.setStorageSync('ukey', data.token);

                            that.toMain(data);
                          } else {
                            that.setData({isAuthorizationed: false});
                          }
                        },
                        fail: function () {
                          // fail
                          // that.$.hideToast();
                        },
                        complete: function () {
                          // complete
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      } else {
		let that = this;
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              that.setData({isAuthorizationed: false});

              //console.log('是否授权！是');
              //console.info(res);

              login_func({
                success: function (datainfo) {
                  //console.log('是否注册！否');
                  //console.info(datainfo);
                  //请求服务器

                  const activity_id = uni.getStorageSync('activity_id');
                  that.$.request({
                    url: that.Config.URL.wx.checkAppLogin,
                    data: {
                      code: datainfo.code,
                      wxwork: that.wxwork,
                      activity_id:activity_id,
                      source_store_id: that.$.getStorageSync('source_store_id'),
                      source_user_id: that.$.getStorageSync('source_user_id'),
                      source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                      client_info: that.client_info
                    },
                    success: function (data, status, msg, code) {
                      if (status == 200) {
                        that.setData({isAuthorizationed: true});

                        var key = that.$.setStorageSync('ukey', data.token);

                        that.toMain(data);
                      } else {
                        that.setData({isAuthorizationed: false});
                        that.setData({wechatConnectBox: true});
                      }
                    },
                    fail: function () {
                      // fail
                      // that.$.hideToast();
                    },
                    complete: function () {
                      // complete
                    }
                  });
                }
              });
            } else {
              login_func({
                success: function (t) {
                  //console.log('是否注册！否');
                  //console.info(t);
                  //请求服务器

                  const activity_id = uni.getStorageSync('activity_id');
                  that.$.request({
                    url: that.Config.URL.wx.checkAppLogin,
                    data: {
                      code: t.code,
                      wxwork: that.wxwork,
                      activity_id:activity_id,
                      source_store_id: that.$.getStorageSync('source_store_id'),
                      source_user_id: that.$.getStorageSync('source_user_id'),
                      source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                      client_info: that.client_info
                    },
                    success: function (data, status, msg, code) {
                      if (status == 200) {
                        that.setData({isAuthorizationed: true});


                        var key = that.$.setStorageSync('ukey', data.token);

                        that.toMain(data);
                      } else {
                        that.setData({isAuthorizationed: false});
                        that.setData({wechatConnectBox: true});
                      }
                    },
                    fail: function () {
                      // fail
                      // that.$.hideToast();
                    },
                    complete: function () {
                      // complete
                    }
                  });
                }
              });
            }
          }
        });
      }
    },


    weibo_oauth(id) {
      let that = this;
    },

    qq_oauth(id) {
      let that = this;

      // #ifdef H5
      //H5调用  forcedLoginState: true,  window.location 跳转
      let pre_route = that.$.getStorageSync('pre_route');
      let pre_options = that.$.getStorageSync('pre_options');

      let base_url = that.cf.CONFIG.base_url + '/h5';
      let return_url = base_url + '/pages/index/member';
      let pre_url = '';

      if (pre_route) {
        pre_url = '/' + that.$.createUrl(pre_route, pre_options);

        pre_url = '?jump=' + encodeURIComponent(pre_url);
      } else {
      }

      return_url = return_url + pre_url;

      let url = that.connect.qq_url;

      /*
      if ((url.indexOf("?") != -1))
      {
        url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
      }
      else
      {
        url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
      }

      url = url + '&rand=' + Math.random()
      */

      // #endif

      // #ifdef H5
      setTimeout(() => {
        window.location.href = url;
      }, 100);
      // #endif
    },

    fb_oauth(id) {
      let that = this;

      FB.login(function (response) {
        console.info(response.authResponse);
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function (me) {
            console.log('Good to see you, ' + me.name + '.');

            const activity_id = uni.getStorageSync('activity_id');

            that.$.request({
              url: that.Config.URL.do_app_login,
              type: 'POST',
              dataType: 'json',
              data: {
                bind_name: 'fb',
                activity_id: activity_id,
                code: response['authResponse']['accessToken'],
                openId: response['authResponse']['userID'],
                nickName: me.name,
                authResponse: JSON.stringify(response['authResponse'])
              },
              success: function (data, status, msg, code) {
                console.info(data);

                if (200 == status) {

                  var key = that.$.setStorageSync('ukey', data.token);

                  // #ifdef H5
                  $cookies.set('uid', data.user_id);
                  $cookies.set('ukey', data.key);
                  // #endif

                  that.toMain(data);
                } else {
                  that.$.showToast({
                    icon: 'none',
                    title: that.__('登录失败！')
                  });
                }
              }
            });
          });
        } else {
          that.$.showToast({
            icon: 'none',
            title: that.__('User cancelled login or did not fully authorize.')
          });
        }
      });
    },

    google_oauth(id) {
      let that = this;

      // #ifdef H5
      //H5调用  forcedLoginState: true,  window.location 跳转
      let pre_route = that.$.getStorageSync('pre_route');
      let pre_options = that.$.getStorageSync('pre_options');

      let base_url = that.cf.CONFIG.base_url + '/h5';
      let return_url = base_url + '/pages/index/member';
      let pre_url = '';

      if (pre_route) {
        pre_url = '/' + that.$.createUrl(pre_route, pre_options);

        pre_url = '?jump=' + encodeURIComponent(pre_url);
      } else {
      }

      return_url = return_url + pre_url;

      let url = that.connect.google_url;

      /*
      if ((url.indexOf("?") != -1))
      {
        url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
      }
      else
      {
        url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
      }

      url = url + '&rand=' + Math.random()
      */

      // #endif

      // #ifdef H5
      setTimeout(() => {
        window.location.href = url;
      }, 100);
      // #endif
    },

    sms_oauth(id) {
      let that = this;

      that.$.gopage('/pagesub/login/sms');
    },

    toMain(userInfo) {
      var that = this;

      that.$.request({
        url: this.Config.URL.userInfo,
        success: function (data, status, msg, code) {
          userInfo = Object.assign(userInfo, data);

          that.login(userInfo);

          that.notice.postNotificationName('RefreshCart', 0);

          //判断是否需要进入激活页面
          if (2 == userInfo.user_state) {
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
            // #ifdef H5
            if (that.$.isWeixin()) {
              let pre_route = that.$.getStorageSync('pre_route');
              let pre_options = that.$.getStorageSync('pre_options');

              //console.info(pre_route);
              //console.info(pre_options);

              if (pre_route) {
                let pre_url = '/' + that.$.createUrl(pre_route, pre_options);
                that.$.gotopage(pre_url);
              } else {
                that.$.gotopage('/pages/index/member');
              }

              return;
            }
            // #endif

            if (
                getCurrentPages()[getCurrentPages().length - 1].route == 'pagesub/login/login' ||
                getCurrentPages()[getCurrentPages().length - 1].route == '/pagesub/login/login'
            ) {
              if (getCurrentPages().length > 1) {
                var prePage = getCurrentPages()[getCurrentPages().length - 2];

                // #ifndef H5
                if ('pagesub/login/login' == prePage.route || '/pagesub/login/login' == prePage.route) {
                  that.$.switchTab({
                    url: '/pages/index/member'
                  });
                } else {
                  if (prePage.refreshData) {
                    prePage.refreshData(prePage.options);
                    that.$.navigateBack();
                  } else if (prePage.onLoad) {
                    prePage.onLoad(prePage.options);
                    that.$.navigateBack();
                  } else {
                    let pre_url = '/' + that.$.createUrl(prePage.route, prePage.options);
                    that.$.gotopage(pre_url);
                  }
                }
                // #endif

                // #ifdef H5
                //修正 onLoad 不存在问题。
                //console.info('++++++++++++++++++++++');
                //console.info(prePage);
                //console.info(prePage.onLoad);
                //console.info(prePage.route);
                //console.info(prePage.options);

                if ('pagesub/login/login' == prePage.route || '/pagesub/login/login' == prePage.route) {
                  that.$.switchTab({
                    url: '/pages/index/member'
                  });
                } else {
                  if (prePage.refreshData) {
                    prePage.refreshData(prePage.options);
                    that.$.navigateBack();
                  } else if (prePage.onLoad) {
                    prePage.onLoad(prePage.options);
                    that.$.navigateBack();
                  } else {
                    let pre_url = '/' + that.$.createUrl(prePage.route, prePage.options);
                    that.$.gotopage(pre_url);
                  }
                }
                // #endif
              } else {
                //回到上个页面
                that.$.switchTab({
                  url: '/pages/index/member'
                });
              }
            } else {
              var prePage = getCurrentPages()[getCurrentPages().length - 1];

              if ('pagesub/login/login' == prePage.route || '/pagesub/login/login' == prePage.route) {
                that.$.switchTab({
                  url: '/pages/index/member'
                });
              } else {
                prePage.onLoad && prePage.onLoad(prePage.options);
              }

              //that.$.navigateBack();
            }
          }
        }
      });
    },

    getUserProfile: function (e) {
      var that = this;

      wx.getUserProfile({
        desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: res2 => {
          console.log(res2);
          that.data.userInfo = res2.userInfo;
          that.data.userInfo.avatarUrl = that.userAvatar;
          that.data.userInfo.nickName = that.userNickname;
          that.bindGetUserInfo({detail: that.data});
        },
        fail: function (err) {
          console.log('获取失败: ', err);
          //微信授权取消后不让自动去绑定
          that.$.switchTab({
            url: '/pages/index/index'
          });

          return false;

          that.bindGetUserInfo({detail: that.data});
        }
      });
    },

    bindGetUserInfo: function (res2) {
      var that = this;

      if (!this.protocolChecked) {
        this.$.showModal({
          title: this.__('提示'),
          content: this.__('请先阅读并同意用户协议'),
          showCancel: false
        });

        return;
      }

      let login_func = that.$.login;
      if (this.wxwork) {
        login_func = wx.qy.login;

        //console.info(res2);
        if (res2.detail.errMsg == 'getUserInfo:ok') {
          that.setData({isAuthorizationed: false});
          var wx_user = that.$.parseJSON(res2.detail.rawData);
          login_func({
            success: function (qy_datainfo) {
              that.$.login({
                success: function (res) {
                  var t = {
                    code: res.code,
                    wxwork: that.wxwork,
                    NickName: wx_user.nickName,
                    sex: wx_user.gender,
                    photo: wx_user.avatarUrl,
                    WXCountry: wx_user.country,
                    WXCity: wx_user.city,
                    WXProvince: wx_user.province,
                    Uid: 0,
                    storeId: 0
                  };

                  var encryptedData = encodeURIComponent(res2.detail.encryptedData); //一定要把加密串转成URI编码
                  var iv = encodeURIComponent(res2.detail.iv);
                  var code = res.code;

                  const activity_id = uni.getStorageSync('activity_id');

                  //请求服务器
                  that.$.request({
                    url: that.Config.URL.wx.applogin,
                    data: {
                      qy_code: qy_datainfo.code,
                      code: code,
                      activity_id: activity_id,
                      wxwork: that.wxwork,
                      encryptedData: encryptedData,
                      iv: iv,
                      source_store_id: that.$.getStorageSync('source_store_id'),
                      source_user_id: that.$.getStorageSync('source_user_id'),
                      source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                      client_info: that.client_info,
                      user_info: res2.detail.userInfo
                    },
                    success: function (data, status, msg, code) {
                      if (status != 200) {
                        // 登录错误
                        that.$.showModal({
                          title: '提示',
                          content: '无法登录，请重试！',
                          showCancel: false
                        });

                        that.$.navigateBack();
                        return;
                      }


                      var key = that.$.setStorageSync('ukey', data.token);

                      that.toMain(data);
                    },
                    fail: function () {
                      // fail
                      // that.$.hideToast();
                    },
                    complete: function () {
                      // complete
                    }
                  });
                }
              });
            }
          });
        }
      } else {
        //console.info(res2);
        if (res2.detail.errMsg == 'getUserInfo:ok') {
          that.setData({isAuthorizationed: false});
          var wx_user = that.$.parseJSON(res2.detail.rawData);
          login_func({
            success: function (res) {
              var t = {
                code: res.code,
                wxwork: that.wxwork,
                NickName: wx_user.nickName,
                sex: wx_user.gender,
                photo: wx_user.avatarUrl,
                WXCountry: wx_user.country,
                WXCity: wx_user.city,
                WXProvince: wx_user.province,
                Uid: 0,
                storeId: 0
              };

              var encryptedData = encodeURIComponent(res2.detail.encryptedData); //一定要把加密串转成URI编码
              var iv = encodeURIComponent(res2.detail.iv);
              var code = res.code;

              const activity_id = uni.getStorageSync('activity_id');

              //请求服务器
              that.$.request({
                url: that.Config.URL.wx.applogin,
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv,
                  activity_id:activity_id,
                  source_store_id: that.$.getStorageSync('source_store_id'),
                  source_user_id: that.$.getStorageSync('source_user_id'),
                  source_ucc_code: that.$.getStorageSync('source_ucc_code'),
                  client_info: that.client_info,
                  user_info: res2.detail.userInfo
                },
                success: function (data, status, msg, code) {
                  if (status != 200) {
                    // 登录错误
                    that.$.showModal({
                      title: '提示',
                      content: '无法登录，请重试！',
                      showCancel: false
                    });

                    that.$.navigateBack();
                    return;
                  }


                  var key = that.$.setStorageSync('ukey', data.token);

                  that.toMain(data);
                },
                fail: function () {
                  // fail
                  // that.$.hideToast();
                },
                complete: function () {
                  // complete
                }
              });
            }
          });
        }
      }
    },

    onChangeProtocol: function (e) {
      var values = e.detail.value;

      if (values.length > 0) {
        this.protocolChecked = true;
      } else {
        this.protocolChecked = false;
      }
    },

    showProtocol: function (id) {
      uni.navigateTo({
        url: '/member/member/protocol?id=' + id
      });
    },
    startLogin: function () {
      //登录
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }

      console.info(this.account);
      console.info(typeof this.account);
      if (this.account.length == '') {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '用户名不能为空'
        });
        return;
      }
      if (this.password.length < 5) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '密码不正确'
        });
        return;
      }

      console.log('登录成功');

      _this.isRotate = true;
      setTimeout(function () {
        _this.isRotate = false;
      }, 3000);
      // uni.showLoading({
      // 	title: '登录中'
      // });
      // getLogin()
      // .then(res => {
      // 	//console.log(res)
      // 	//简单验证下登录（不安全）
      // 	if(_this.account==res.data.username && _this.password==res.data.password){
      // 		let userdata={
      // 			"username":res.data.username,
      // 			"nickname":res.data.nickname,
      // 			"accesstoken":res.data.accesstoken,
      // 		} //保存用户信息和accesstoken
      // 		_this.$store.dispatch("setUserData",userdata); //存入状态
      // 		try {
      // 			uni.setStorageSync('setUserData', userdata); //存入缓存
      // 		} catch (e) {
      // 			// error
      // 		}
      // 		uni.showToast({
      // 			icon: 'success',
      // 			position: 'bottom',
      // 			title: '登录成功'
      // 		});
      // 		uni.reLaunch({
      // 			url: '../../../pages/index',
      // 		});
      // 	}else{
      // 		_this.password=""
      // 		uni.showToast({
      // 			icon: 'error',
      // 			position: 'bottom',
      // 			title: '账号或密码错误，账号admin密码admin'
      // 		});
      // 	}
      // 	uni.hideLoading();
      // }).catch(err => {
      // 	uni.hideLoading();
      // })
    },

    jy_facebookShareUrl() {
      let jyappEvents = uni.requireNativePlugin('JY-FaceBookAppEvents');
      jyappEvents.jy_facebookShareUrl(
          {
            shareUrl: 'http://www.baidu.com',
            sharePic: '随便写'
          },
          res => {
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(res)
            });
          }
      );
    },

    isShowAgree() {
      let that = this;

      //是否选择协议
      that.showAgree = !that.showAgree;
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
