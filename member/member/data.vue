<template>
  <view class="page">
    <view class="m-cells m-cells-form">
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('用户编号') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="number" :value="user_id" disabled="true"/>
        </view>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('账号') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="user_account" disabled="true"/>
        </view>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('昵称') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="user_nickname" @input="inputuser_user_nickname"/>
        </view>
      </view>

      <view class="m-cell" style="padding: 2rpx 30rpx">
        <view class="m-cell-hd"><label class="u-label">{{ __('头像') }}</label></view>
        <view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
          <view class="uni-uploader-body">
            <view class="uni-uploader__files">
              <block v-if="user_avatar">
                <view class="uni-uploader__file">
                  <image class="uni-uploader__img" :src="user_avatar" :data-src="user_avatar"
                         @click.stop="upImgs"></image>
                </view>
              </block>
              <view class="uni-uploader__input-box" v-else>
                <view class="uni-uploader__input" @click.stop="upImgs"></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('真实姓名') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="user_realname" :placeholder="__('请输入真实姓名')" @input="inputReName"
                 maxlength="30"/>
        </view>
      </view> -->
      <view class="m-celli hide">
        <view class="m-cell-hd"><label class="u-label">{{ __('身份证') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="idcard" :value="user_idcard" :placeholder="__('请输入身份证号码')" @input="inputICard"
                 maxlength="18"/>
        </view>
        <div v-if="(!isCardNo)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </div>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('邮箱') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="user_email" :placeholder="__('请输入邮箱地址')" @input="inputuser_email"
                 maxlength="30"/>
        </view>
        <view v-if="(!isUserEmail)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </view>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('生日') }}</label></view>
        <view class="m-cell-bd">
          <picker mode="date" @change="bindDateChange">
            <label>{{ $.formatDateFormatter(user_birthday, "yyyy-MM-dd") }}</label>
          </picker>
        </view>
      </view>
      <view class="m-cell hide">
        <view class="m-cell-hd"><label class="u-label">{{ __('手机号码') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="number" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone"
                 :value="user_mobile"/>
        </view>
        <view v-if="(!isUserMobile)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </view>
      </view>
      <view class="m-cell m-cell-vcode hide">
        <view class="m-cell-hd">
          <label class="u-label">{{ __('验证码') }}</label>
        </view>
        <view class="m-cell-bd">
          <input class="u-input" type="number" :placeholder="__('请输入验证码')" maxlength="6" @input="inputcode"/>
        </view>
        <view v-if="(!isCode)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </view>
        <view v-if="(isSend)" @click="sendmessage" class="m-vcode-btn">{{ btntext }}</view>
        <view v-else class="m-vcode-btn">{{ btntext }}</view>
      </view>

      <view class="m-cell" @click="showbox" v-if="Config.PLANTFORM_FX_AGENT_ENABLE && false ">
        <view class="m-cell-hd"><label class="u-label">{{ __('地区') }}</label></view>
        <view class="m-cell-bd">
          <label>{{ seladstr }}</label>
        </view>
        <view v-if="(!isDistrict)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </view>
      </view>

      <view class="m-cell" v-if="false">
        <view class="m-cell-hd"><label class="u-label">{{ __('地址') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="user_address" :placeholder="__('请输入联系地址')"
                 @input="onInputAddress"/>
        </view>
        <view v-if="(!isUserAddress)" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </view>
      </view>
    </view>

    <liu-customize-sel ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                       @change='onConfirm'></liu-customize-sel>

    <button class="u-btn u-btn-default" @click="submitInfo" style="margin-top:50rpx;">{{ __('保存') }}</button>

  </view>
</template>


<script>

import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

import {mapMutations, mapState} from 'vuex'

export default {
  data: function () {
    return {
      options: {},
      user_id: 0,
      user_account: "",
      user_nickname: "",
      user_realname: "",
      user_avatar: "",
      user_idcard: "",
      user_address: "",
      isCardNo: true,
      user_email: "",
      user_birthday: "",
      isUserEmail: true,
      isUserAddress: true,
      user_mobile: "",
      mobile_code: "",
      btntext: "发送",
      isSend: true,
      isUserMobile: true,
      sendTime: 120,
      isCode: true,

      isDistrict: true,

      Pindex: 0,
      selectedProId: 0,
      selectedCityId: 0,
      selectedCountyId: 0,
      selectedPro: '',
      selectedCity: '',
      selectedCounty: '',
      seladstr: "请选择所属地区",

      cityPickerValueDefault: [0, 0, 0],
      themeColor: '#007AFF'
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  components: {
    mpvueCityPicker
  },
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('个人资料')
    });

    //console.info(this.userInfo);
    this.seladstr = this.__("请选择所属地区");

    let that = this;

    that.setData({
      options: options
    });

    this.forceUserInfo(function (user) {
      that.setData({
        user_id: user.user_id,
        user_account: that.$.isNull(user.user_account) ? "" : user.user_account,
        user_nickname: that.$.isNull(user.user_nickname) ? "" : user.user_nickname,
        user_realname: that.$.isNull(user.user_realname) ? "" : user.user_realname,
        user_avatar: that.$.isNull(user.user_avatar) ? "" : user.user_avatar,
        user_idcard: that.$.isNull(user.user_idcard) ? "" : user.user_idcard,
        user_email: that.$.isNull(user.user_email) ? "" : user.user_email,
        user_birthday: that.$.isNull(user.user_birthday) ? that.__("请选择生日日期") : user.user_birthday,
        user_mobile: that.$.isNull(user.user_mobile) ? "" : user.user_mobile
      })
    });
  },
  onShow: function (opt) {
    let that = this;
    this.setData({
      user_id: this.userInfo.user_id,
      user_account: that.$.isNull(this.userInfo.user_account) ? "" : this.userInfo.user_account,
      user_nickname: that.$.isNull(this.userInfo.user_nickname) ? "" : this.userInfo.user_nickname,
      user_realname: that.$.isNull(this.userInfo.user_realname) ? "" : this.userInfo.user_realname,
      user_avatar: that.$.isNull(this.userInfo.user_avatar) ? "" : this.userInfo.user_avatar,
      user_idcard: that.$.isNull(this.userInfo.user_idcard) ? "" : this.userInfo.user_idcard,
      user_email: that.$.isNull(this.userInfo.user_email) ? "" : this.userInfo.user_email,
      user_birthday: that.$.isNull(this.userInfo.user_birthday) ? this.__("请选择生日日期") : this.userInfo.user_birthday,
      user_mobile: that.$.isNull(this.userInfo.user_mobile) ? "" : this.userInfo.user_mobile
    })
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    bindDateChange: function (e) {
      this.setData({
        user_birthday: e.detail.value
      })
    },
    inputReName: function (e) {
      this.setData({
        user_realname: e.detail.value
      })
    },
    inputuser_user_nickname: function (e) {
      this.setData({
        user_nickname: e.detail.value
      })
    },

    inputICard: function (e) {
      let that = this;
      if (that.$.isNull(e.detail.value)) {
        this.setData({
          isCardNo: true,
          user_idcard: e.detail.value
        });
        return
      }
      this.IdentityCodeValid(e.detail.value) ? this.setData({
        isCardNo: true
      }) : this.setData({
        isCardNo: false
      }), this.setData({
        user_idcard: e.detail.value
      })
    },
    inputuser_email: function (e) {
      let that = this;
      this.setData({
        user_email: e.detail.value
      }), that.$.isNull(e.detail.value) ? this.setData({
        isUserEmail: false
      }) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({
        isUserEmail: true
      }) : this.setData({
        isUserEmail: false
      })
    },

    onInputAddress: function (e) {
      let that = this;

      if (e.detail.value) {
        this.setData({
          isUserAddress: true
        })
      } else {
        this.setData({
          isUserAddress: false
        })
      }
    },

    submitInfo: function (e) {
      let that = this;
      this.update();
    },

    update: function () {
      var that = this;
      var params = {
        user_id: this.user_id,
        user_nickname: this.user_nickname,
        user_realname: this.user_realname,
        user_avatar: this.user_avatar,
        //user_idcard: this.user_idcard,
        user_email: this.user_email,
        user_birthday: this.user_birthday,
        //user_mobile: this.user_mobile,
        //code: this.mobile_code,
      };

      if (false) {
        params.user_province_id = that.selectedProId;
        params.user_city_id = that.selectedCityId;
        params.user_county_id = that.selectedCountyId;
        params.user_address = that.user_address;
      }

      params.user_birthday == that.__("请选择生日日期") && (params.user_birthday = "");

      that.$.request({
        url: this.Config.URL.account.edit_user_info,
        data: params,
        method: "POST",
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.$.showToast({
              title: that.__("更新成功!"),
              success: function () {
                //this.userInfo = data;
                that.userInfo.user_nickname = params.user_nickname;
                that.userInfo.user_realname = params.user_realname;
                that.userInfo.user_avatar = params.user_avatar;
                that.userInfo.user_idcard = params.user_idcard;
                that.userInfo.user_email = params.user_email;
                that.userInfo.user_birthday = params.user_birthday;
                that.userInfo.user_mobile = params.user_mobile;

                that.login(that.userInfo);

                that.$.navigateBack(1)
              }
            })
          } else {
            that.$.confirm(msg);
          }
        }
      });
    },
    IdentityCodeValid: function (e) {
      var t = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
          },
          n = true;
      if (!e || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(
          e)) {
        n = false;
      } else if (!t[e.substr(0, 2)]) {
        n = false;
      } else if (e.length == 18) {
        e = e.split("");
        var r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            i = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
            s = 0,
            o = 0,
            u = 0;
        for (var a = 0; a < 17; a++) {
          o = e[a], u = r[a], s += o * u;
        }
        var f = i[s % 11];
        i[s % 11] != e[17].toUpperCase() && (n = false)
      }
      return n
    },
    inputphone: function (e) {
      let that = this;
      this.setData({
        user_mobile: e.detail.value
      }), that.$.isNull(e.detail.value) ? this.setData({
        isUserMobile: false
      }) : /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
        isUserMobile: true
      }) : this.setData({
        isUserMobile: false
      })
    },
    inputcode: function (e) {
      let that = this;
      this.setData({
        mobile_code: e.detail.value
      }), that.$.isNull(e.detail.value) ? this.setData({
        isCode: false
      }) : this.setData({
        isCode: true
      })
    },
    upImgs: function (e) {
      var that = this;

      that.$.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: function (n) {
          that.$.showLoading();
          var r = n.tempFilePaths;
          that.$.uploadFile({
            url: that.Config.URL.upload,
            method: "POST",
            filePath: r[0],
            name: "upfile",
// 							header: {
// 								"content-type": "multipart/form-data"
// 							},
            success: function (n) {
              that.$.hideLoading();

              var up_res = that.$.parseJSON(n.data);
              var s = up_res.data.file_url;
              that.setData({
                user_avatar: s
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
        fail: function (e) {
          that.$.hideLoading()
        },
        complete: function (e) {
          that.$.hideLoading()
        }
      })
    },
    sendmessage: function () {
      let that = this;
      if (that.$.isNull(this.user_mobile)) {
        this.setData({
          isUserMobile: false
        });
      } else if (!/^1[23456789]\d{9}$/.test(this.user_mobile)) {
        this.setData({
          isUserMobile: false
        });
      } else if (this.user_mobile == this.userInfo.user_mobile) {
        that.$.confirm(that.__("你已经绑定过该手机！"));
      } else if (this.isSend) {
        this.setData({
          isSend: false
        });
        var t = this.sendTime;
        var params = {
          mobile: this.user_mobile
        };
        that.$.request({
          url: this.Config.URL.sendMobileVerifyCode,
          data: params,
          success: function (data, status, msg, code) {
            if (status == 200) {
              var r = setInterval(function () {
                t > 0 ? that.setData({
                  btntext: t-- + "s"
                }) : (that.setData({
                  isSend: true,
                  sendTime: 120,
                  btntext: that.__("重新发送")
                }), clearInterval(r))
              }, 1e3);
            } else {
              that.setData({
                isSend: true
              }), that.$.alert(msg)
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
      this.$refs.mpvueCityPicker.show()
    },

    onCancel(e) {
      //console.log(e)
    },

    onConfirm(e) {
      let that = this;
      //console.info(e);
      //console.info(JSON.stringify(e));
      this.pickerText = JSON.stringify(e)

      this.setData({
        isDistrict: true,
        Pindex: this.cityCode,
        selectedProId: e.value[0],
        selectedCityId: e.value[1],
        selectedCountyId: e.value[2],
        selectedPro: e.label[0],
        selectedCity: e.label[1],
        selectedCounty: e.label[2],
        seladstr: that.$.isNull(e.label.toString()) ? that.__("请选择地址") : e.label.toString()
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/_variables";

.m-cell-bd label {
  color: #888;
}

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
