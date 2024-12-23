<template>
  <view class="page">
    <view v-if="(isdata)" class="m-ad-list">
      <view v-for="(item, i) in addresslist" :key="i" class="m-ad-item" :data-id="(item.ud_id)"
            :data-ud_id="(item.ud_id)" @longpress="modify">
        <view class="m-ad-l" :data-sel="ud_id" :data-ud_id="(item.ud_id)" :data-address="(item.ud_address)"
              @tap="selectAddress">
          <view class="m-ad-i-top">
            <text>{{ item.ud_name }}</text>
            <label>({{ item.ud_intl }}){{ item.ud_mobile }}</label>
          </view>
          <view class="m-ad-i-bot">
            <label v-if="(item.ud_is_default)" class="m-ad-icon">{{ __('默认') }}</label>
            <text>{{ [item.ud_province, item.ud_city, item.ud_county].toString() }} {{ item.ud_address }}</text>
          </view>
        </view>
        <view class="m-ad-edit tbl">
          <label :data-ud_id="(item.ud_id)" @click="EditAddress" class="iconfont icon-edit"></label>
          <label class="iconfont icon-delete" :data-ud_id="(item.ud_id)" @click="DelAddress"></label>
        </view>
      </view>
      <button class="u-btn u-btn-default" @click="AddAddress" style="margin-top:50rpx;">{{ __('添加地址') }}</button>
    </view>
    <view class="m-nullpage" v-else @click="AddAddress">
      <view class="m-nullpage-middle">
        <label class="iconfont icon-dizhi"></label>
        <view class="m-null-tip">
          <text>{{ __('想把你的宝贝寄到哪去') }}</text>
          <text class="m-null-tipck">{{ __('马上去添加地址') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>


<style lang="scss">
@import "../../styles/_variables";

.m-ad-item:after {
  content: " ";
  position: absolute;
  border-bottom: 1px solid #ebebe7;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
  color: #ebebe7;
}

.m-ad-item {
  background-color: #fff;
  padding: 24rpx 20rpx 24rpx 30rpx;
  position: relative;
  /*border-bottom: 1px solid #d5d5d5;*/
}

.m-ad-l {
  width: 70%;
  display: inline-block;
}

.m-ad-i-top {
  font-size: 16px;
  line-height: 20px;
}

.m-ad-i-top text {
  margin-right: 20rpx;
}

.m-ad-i-bot {
  font-size: 14px;
  color: #888;
  line-height: 20px;
  margin-top: 10rpx;
}


.m-ad-icon {
  font-size: 12px;
  padding: 4rpx 8rpx;
  background-color: $default-skin-bg;
  color: #fff;
  border-radius: 8rpx;
  margin-right: 8rpx;
  text-align: center;
}

.m-ad-edit {
  position: absolute;
  right: 20rpx;
  top: 50%;
  width: 80rpx;
  height: 100rpx;
  margin-top: -50rpx;
  padding-left: 40rpx;
}

.m-ad-edit label {
  width: 40rpx;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 35rpx;
  display: block;
  vertical-align: middle;
  text-align: center;
  color: #888888;
}

</style>

<script>

import {mapMutations, mapState} from 'vuex'


export default {
  data() {
    return {
      options: {},
      addresslist: [],
      isdata: false,
      spid: "",
      ud_id: 0
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('地址列表')
    });

    this.setData({
      ud_id: options.ud_id || 0,
      spid: options.spid || "",
      options: options,
      isdata: false
    });

    var that = this;
    this.getAddressList();

    that.notice.addNotification("RefreshAddress", that.RefreshMethod, that);
  },
  onShow: function () {
  },
  onUnload: function () {
    // 离开页面，注销事件
    var that = this
    this.notice.removeNotification("RefreshAddress", that);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAddressList();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    RefreshMethod: function () {
      //console.info('.........RefreshMethod');
      this.getAddressList()
    },
    getAddressList: function () {
      var that = this;
      var params = {};

      that.setData({
        isdata: false,
        addresslist: []
      });

      that.$.request({
        url: that.Config.URL.user.address_lists,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {
            if (data.items.length > 0) {

              //that.addresslist = data.items;

              that.setData({
                isdata: true,
                addresslist: data.items
              });

            } else {
              that.setData({
                isdata: false
              });
            }
          }

          uni.stopPullDownRefresh()
        }
      });
    },
    modify: function (e) {
      var that = this;
      e.currentTarget.dataset.ud_id;

      let itemList = [that.__('编辑'), that.__('删除')]

      uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
          if (res.tapIndex == 0) {
            that.EditAddress(e);
          } else {
            that.DelAddress(e);
          }
        }
      })

    },
    selectAddress: function (obj) {
      if (obj.currentTarget.dataset.sel) {
        var that = this;
        var options = that.options;
        options.ud_id = obj.currentTarget.dataset.ud_id;
        options.address = obj.currentTarget.dataset.address;
        that.$.navigateBack(1, function () {
          //console.info('selectAddress')
          that.notice.postNotificationName("RefreshOrder", options)
        })
      }
    },
    EditAddress: function (obj) {
      var that = this;
      var options = this.options;
      options.ud_id = obj.currentTarget.dataset.ud_id;

      if (that.ud_id != 0) {
        that.$.redirectTo({
          url: that.$.createUrl("/member/address/manage", options)
        });
      } else {
        that.$.navigateTo({
          url: that.$.createUrl("/member/address/manage", options)
        });
      }
    },

    AddAddress: function () {
      var that = this;
      //var options = that.options;

      if (that.options.issub) {
        var options = {issub: 1};
      } else {
        var options = {};
      }

      if (that.ud_id != 0) {
        that.$.redirectTo({
          url: that.$.createUrl("/member/address/manage", options)
        });
      } else {
        that.$.navigateTo({
          url: that.$.createUrl("/member/address/manage", options)
        });
      }
    },

    DelAddress: function (e) {
      var that = this;
      that.$.showModal({
        title: that.__("提示"),
        content: that.__("确认删除这个地址吗？"),
        showCancel: true,
        success: function (n) {
          if (n.confirm) {
            var params = {
              ud_id: e.currentTarget.dataset.ud_id
            };
            that.$.request({
              url: that.Config.URL.user.address_remove,
              method:"POST",
              data: params,
              success: function (data, status, msg, code) {
                if (200 == status) {
                  that.$.showToast({
                    title: that.__("删除成功！")
                  });

                  that.notice.postNotificationName("RefreshOrder", 0);
                  that.getAddressList();
                }
              }
            });
          }
        }
      })
    }
  }
};
</script>
