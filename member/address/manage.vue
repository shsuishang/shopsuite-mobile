<template>
  <view class="page">
    <view class="m-cells m-cells-form">
      <view class="m-cell">
        <view class="m-cell-hd"><label class="u-label">{{ __('收件人') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="(ud_name||'')" :placeholder="__('请输入收件人姓名')"
                 @input="inputud_name"/>
        </view>
        <div v-if="(ud_name=='')" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </div>
      </view>
      <view class="m-cell m-cell-select-before" @click="showbox">
        <view class="m-cell-hd"><label class="u-label">{{ __('省/市/区') }}</label></view>
        <view class="m-cell-bd">
          <label>{{ seladstr }}</label>
        </view>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label for="" class="u-label">{{ __('详细地址') }}</label></view>
        <view class="m-cell-bd">
          <input class="u-input" type="text" :value="(showdetail ? detail : '')" :placeholder="__('请输入详细地址')"
                 @input="inputdetail"/>
        </view>
        <div v-if="(detail=='')" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </div>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label for="" class="u-label">{{ __('电话号码') }}</label></view>
        <view class="m-cell-bd" style="display: inherit;">
          <!-- 国家区号 -->
          <picker mode="selector" @change="onIntlChange" :value="mode_index" :range="_lang" range-key="name"
                  style="margin-right: 8rpx">
            <view class="country-int-code" style="color:#000000">{{ user_intl }}</view>
          </picker>
          <input class="u-input" type="number" :value="(phone ||'')" :placeholder="__('请输入电话号码')" @input="inputphone"
                 />
        </view>
        <div v-if="(!isre || phone=='')" class="m-cell-ft">
          <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
        </div>
      </view>
      <view class="m-cell">
        <view class="m-cell-hd"><label for="" class="u-label">{{ __('常用地址') }}</label></view>
        <view class="m-cell-bd">
          <switch type="switch" style="transform:scale(0.8)" :checked="(isDefault?true:false)" @change="ckDefault"/>
        </view>
      </view>
    </view>

    <liu-customize-sel ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                       @change='onConfirm'></liu-customize-sel>

    <view v-if="(isShow)" class="m-select-box-msk" @click="closead">
      <view class="m-select-box" @click.stop="notap">
        <view class="m-close-panel"><label @click.stop="closead">{{ __('关闭') }}</label></view>
        <view class="m-select-content">
          <picker-view indicator-style="height:50px" class="u-select" value="(value)" @change="bindChange">
            <picker-view-column>
              <view class="m-cell-bd" v-for="(item, i) in Province.pname" :key="i"><label>{{ item }}</label></view>
            </picker-view-column>
            <picker-view-column>
              <view class="m-cell-bd" v-for="(item, i) in City.cname" :key="i"><label>{{ item }}</label></view>
            </picker-view-column>
            <picker-view-column>
              <view class="m-cell-bd" v-for="(item, i) in District.dname" :key="i"><label>{{ item }}</label></view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
    </view>
    <button class="u-btn u-btn-default" @click="submit">{{ __('保存') }}</button>
  </view>
</template>

<style lang="scss" scoped>
@import "../../styles/_variables";

.btn_box {
  padding: 20rpx;
}

.m-cell-bd switch {
  float: right;
}

.m-cell-hd {
  width: 180rpx;
}

.m-select-box-msk {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.m-select-box {
  position: absolute;
  width: 100%;
  height: 300px;
  background-color: #fff;
  left: 0;
  bottom: 0;
}

.u-select {
  width: 100%;
  height: 300px;
  text-align: center;
}

.u-select .m-cell-bd {
  width: 100%;
  line-height: 50px;
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.u-select .m-cell-bd label {
  width: 100%;
}

.m-select-content {
  position: relative
}

.m-close-panel {
  height: 60rpx;
  border-bottom: 1rpx solid #dfdfdf;
  font-size: 24rpx;
  text-align: right;
  color: #73AE1F;
  line-height: 60rpx;
  box-sizing: border-box;
  padding: 0 20rpx;
}

.m-cell-select-before .m-cell-bd {
  padding: 0;
}

.m-icon-warn {
  color: red;
}

uni-picker{
  padding-top: 4rpx;
}
</style>

<script>

import {mapMutations, mapState} from 'vuex'


import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

export default {
  components: {
    mpvueCityPicker
  },
  data() {
    return {
      mode_index: 0,
      user_intl: '',
      country_code: 86,

      options: {},
      Pindex: 0,
      Cindex: 0,
      Dindex: 0,
      PCDlist: {},
      Province: {},
      City: {},
      District: {},
      selectedProId: 0,
      selectedCityId: 0,
      selectedCountyId: 0,
      selectedPro: '',
      selectedCity: '',
      selectedCounty: '',
      ud_id: 0,
      spid: "",
      addressinfo: {},
      seladstr: "",
      isShow: false,
      isDefault: false,
      showud_name: "",
      showdetail: true,
      showphone: "",
      showisDefault: "",
      ud_name: "",
      detail: "",
      value: [0, 0, 0],
      phone: "",
      isre: true,
      issub: false,

      cityPickerValueDefault: [0, 0, 0],
      themeColor: '#007AFF'
    }
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    _lang() {
      let lists = [];

      return lists;
    }
  },
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('地址管理')
    });

    var that = this;
    that.seladstr = that.__('请选择地址');

    this.setData({
      issub: options.issub,
      ud_id: options.ud_id>0 ?  options.ud_id : 0,
      spid: options.spid || "",
      options: options
    });

    if (options.ud_id > 0) {
      that.$.setNavigationBarTitle({
        title: this.__('修改地址')
      });
      var params = {
        ud_id: options.ud_id
      };
      that.$.request({
        url: this.Config.URL.user.address_get,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {
            that.setData({
              addressinfo: data,
              selectedProId: data.ud_province_id,
              selectedCityId: data.ud_city_id,
              selectedCountyId: data.ud_county_id,
              selectedPro: data.ud_province,
              selectedCity: data.ud_city,
              selectedCounty: data.ud_county,
              showud_name: data.ud_name,
              showphone: data.ud_mobile,
              showisDefault: data.ud_is_default,
              ud_name: data.ud_name,
              detail: data.ud_address,
              isDefault: data.ud_is_default,
              country_code: data.ud_intl,
              phone: data.ud_mobile
            });

            that.setData({
              seladstr: [that.selectedPro, that.selectedCity, that.selectedCounty].toString(),
              cityPickerValueDefault: [0, 0, 0],
            });

            for (let idx in that._lang) {
              if (that._lang[idx].id == that.country_code) {
                that.mode_index = idx;
                that.user_intl = '+' + that._lang[idx].id;
                break;
              }
            }
          }
        }
      });
    } else {
    }
  },
  onBackPress() {
    if (this.$refs.mpvueCityPicker.showPicker) {
      this.$refs.mpvueCityPicker.pickerCancel();
      return true;
    }
  },
  onUnload() {
    if (this.$refs.mpvueCityPicker.showPicker) {
      this.$refs.mpvueCityPicker.pickerCancel()
    }
  },

  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    onIntlChange: function (e) {
      var that = this;
      var index = e.detail.value
      this.setData({
        mode_index: e.detail.value,
        user_intl: '+' + this._lang[index].id
      })
    },
    inputud_name: function (e) {
      this.setData({
        ud_name: e.detail.value
      })
    },
    inputdetail: function (e) {
      return this.setData({
        detail: e.detail.value
      }), e.detail.value
    },
    inputphone: function (e) {
      this.setData({
        phone: e.detail.value
      });

      if (this.$.tel(e.detail.value, this.user_intl)) {
        this.setData({
          isre: true
        })
      } else {
        this.setData({
          isre: false
        })
      }
    },
    ckDefault: function (e) {
      this.setData({
        isDefault: e.detail.value
      })
    },
    submit: function () {
      var that = this;

      if (that.$.isNull(that.ud_name)) return;
      if (that.$.isNull(that.detail)) return;
      if (that.$.isNull(that.phone)) return;
      if (!that.isre) return;
      if (that.selectedCityId <= 0) {
        that.$.alert(that.__("请选择省市区！"));
        return
      }

      var params = {
        ud_id: that.ud_id ? that.ud_id : 0,
        ud_name: that.ud_name,
        ud_province_id: that.selectedProId,
        ud_city_id: that.selectedCityId,
        ud_county_id: that.selectedCountyId,
        ud_province: that.selectedPro,
        ud_city: that.selectedCity,
        ud_county: that.selectedCounty,
        ud_address: that.detail,
        ud_is_default: that.isDefault,
        ud_intl: that.user_intl,
        ud_mobile: that.phone
      }

      var options = that.options;

      if (that.ud_id) {
        that.$.request({
          url: this.Config.URL.user.address_edit,
          method:"POST",
          data: params,
          success: function (data, status, msg, code) {
            if (status == 200) {
              that.$.showToast({
                title: that.__("修改成功"),
                icon: "success",
                duration: 2e3,
                success: function () {
                  //
                  if (options.issub) {
                    that.$.navigateBack(1, function () {
                      options.ud_id = data.ud_id;
                      that.notice.postNotificationName("RefreshOrder", data)
                    })
                  } else {
                    that.$.navigateBack(1, function () {
                      that.notice.postNotificationName("RefreshAddress", 1)
                    })
                  }
                }
              })
            } else {
              that.$.alert(msg)
            }
          }
        });
      } else {
        params.ud_id = this.ud_id;
        var options = that.options;
        that.$.request({
          url: this.Config.URL.user.address_add,
          method:"POST",
          data: params,
          success: function (data, status, msg, code) {
            if (status == 200) {
              that.$.showToast({
                title: that.__("修改成功"),
                icon: "success",
                duration: 2e3,
                success: function () {
                  if (options.issub) {
                    that.$.navigateBack(1, function () {
                      options.ud_id = data.ud_id;
                      that.notice.postNotificationName("RefreshOrder", data)
                    })
                  } else {
                    that.$.navigateBack(1, function () {
                      that.notice.postNotificationName("RefreshAddress", 1)
                    })
                  }
                }
              })
            } else {
              that.$.alert(msg)
            }
          }
        });
      }

    },
    bindChange: function (e) {
      if (e.detail.value[0] != this.value[0]) {
        this.setData({
          value: [e.detail.value[0], 0, 0]
        });
      } else {
        if (e.detail.value[1] != this.value[1]) {
          this.setData({
            value: [e.detail.value[0], e.detail.value[1], 0]
          });
        } else {
          this.setData({
            value: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
          });
        }
      }

      //this.seladress(this.value[0], this.value[1], this.value[2]);

      this.setData({
        Pindex: this.value[0],
        selectedProId: this.Province.pid[this.value[0]],
        selectedCityId: this.City.cid[this.value[1]],
        selectedCountyId: this.District.did[this.value[2]],
        selectedPro: this.Province.pname[this.value[0]],
        selectedCity: this.City.cname[this.value[1]],
        selectedCounty: this.District.dname[this.value[2]],
      });
    },
    // 三级联动选择
    showbox() {
      this.$refs.mpvueCityPicker.open()
    },

    onCancel(e) {
      //console.log(e)
    },

    onConfirm(e) {
      let that = this;
      const disList = e.value

      let district_info = that.__('请选择地址')

      if (disList.length == 3) {
        district_info = that.$.sprintf('%s %s %s', disList[0].district_name, disList[1].district_name, disList[2].district_name)
      } else {
        return
      }

      this.setData({
        Pindex: this.cityCode,
        selectedProId: e.value[0].district_id,
        selectedCityId: e.value[1].district_id,
        selectedCountyId: e.value[2].district_id,
        selectedPro: e.value[0].district_name,
        selectedCity: e.value[1].district_name,
        selectedCounty: e.value[2].district_name,
        seladstr: district_info
      });
    }
  }
};
</script>
