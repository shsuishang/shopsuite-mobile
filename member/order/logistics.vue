<template>
  <view class="page">
    <view class="m-logisticsbox">
      <view class="m-cells">
        <!-- <view class="m-cell ">
          <view class="m-cell-bd">
            <text>物流单号：{{Logistics.LogisticCode}}</text>
          </view>
        </view>
        <view class="m-cell">
          <view class="m-cell-bd">
            <text>物流公司：{{Logistics.ShipperName}}</text>
          </view>
        </view> -->
		<view style="padding-left: 15px; padding-right: 15px;" v-if="Logistics.orderLogistics && Logistics.orderLogistics.logistics_explain">
		  <text>{{ __('物流备注：') }}{{ Logistics.orderLogistics.logistics_explain }}</text>
		</view>
        <view class="m-cell">
          <view class="m-cell-bd" v-if="LogisticName!='达达配送'">
            <text>{{ __('物流状态：') }}{{ Logistics.express_state }}</text>
          </view>
          <view class="m-cell-bd" v-if="LogisticName=='达达配送'">
            <text>{{ __('物流状态：') }}{{ DLogistics.express_state }}</text>
          </view>
        </view>
      </view>
      <view class="map" v-if="LogisticName=='达达配送'&&Info.Status==3">
        <image src="/static/images/call.png" bindtap="call"></image>
        <map class="m-map" longitude="Info.TransporterLng" latitude="Info.TransporterLat" markers="markers" scale="14"
             show-location style="width: 100%; height: 400rpx;"></map>
      </view>
      <view class="m-logistbox" v-if="LogisticName=='达达配送'">
        <view v-for="(item, index) in DLogistics.Traces" :key="index" class="m-logistitem">
          {{ item.AcceptStation }}
          <view>{{ item.AcceptTimeStr || item.AcceptTime }}</view>
        </view>
      </view>
      <view class="m-logistbox" v-if="LogisticName!='达达配送'">
        <view v-for="(item, index) in Logistics.Traces" :key="index" class="m-logistitem">
          {{ item.AcceptStation }}
          <view>{{ item.AcceptTimeStr || item.AcceptTime }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

import $ from "../../helpers/util";

import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      options: {},
      order_id: "",
      Logistics: {},
      markers: [],
      Info: [],
      DLogistics: [],
      LogisticName: "",
      path: ""
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('物流进度')
    });

    this.setData({
      order_id: options.on,
      LogisticName: options.LogisticName
    })
    //this.GetShipmentStakeholders();
    if (options.LogisticName == '达达配送') {
      this.GetShipmentDetailList()
    } else {
      this.ExpressQuery(options.on,options.express_id,options.tracking_number,options.order_logistics_id);
    }
  },
  onUnload: function () {
    //移除通知
    let that = this;
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

    ExpressQuery(on,express_id,tracking_number,order_logistics_id) {//查询物流进度
      var that = this;
      var params = {
        order_id: on,
		express_id: express_id,
		order_tracking_number: tracking_number,
		order_logistics_id: order_logistics_id,
      };

      that.$.request({
        url: this.Config.URL.delivery_info,
        data: params,
        success: function (data, status, msg, code) {
          if (200 == status) {
            that.setData({
              Logistics: data
            })
          }
        }
      });
    },

    GetShipmentStakeholders: function () {//获取达达配送订单详情信息
      var that = this;
      var val = {
        order_id: this.data.order_id,
        store_id: app.globalData.shopInfo.store_id
      }
      var that = this
      that.$.request($.makeUrl(orderapi.GetShipmentStakeholders, val), function (data) {
        that.setData({
          Info: data.Info
        })
        that.getImageInfo()
        //console.log(data)
      });
    },
    GetShipmentDetailList: function () {//获取配送单详情
      var that = this;
      var val = {
        order_id: this.data.order_id,
        store_id: app.globalData.shopInfo.store_id
      }
      //console.log(val)
      var that = this
      that.$.request($.makeUrl(orderapi.GetShipmentDetailList, val), function (data) {
        //console.log(data)
        data.Info.Traces.reverse()
        that.setData({
          DLogistics: data.Info
        });
      });
    },
    getImageInfo: function () {
      var obj = [];
      var that = this;
      //console.log(this.data.Info)
      wx.getImageInfo({
        src: that.data.Info.LogoPath,
        success: function (res) {
          //console.log(res)
          that.setData({
            path: res.path
          })
        }
      })
      var merchant = {
        latitude: that.data.Info.StoreAddressLat,
        longitude: that.data.Info.StoreAddressLng,
        width: 50,
        height: 60,
        iconPath: '../../assets/merchant.png'
      }
      var horseman = {
        latitude: that.data.Info.TransporterLat,
        longitude: that.data.Info.TransporterLng,
        width: 50,
        height: 60,
        iconPath: '../../assets/horseman.png'
      }
      var person = {
        latitude: that.data.Info.OrderAddressLat,
        longitude: that.data.Info.OrderAddressLng,
        width: 50,
        height: 60,
        iconPath: '../../assets/person.png'
      }
      obj.push(merchant)
      obj.push(horseman)
      obj.push(person)
      that.setData({
        markers: obj
      })
    },

    call: function () {
      var that = this
      wx.makePhoneCall({
        phoneNumber: that.data.Info.TransporterPhone
      })
    }
  }
};
</script>


<style lang="scss">
@import "../../styles/_variables";

.m-cells {
  font-size: 28rpx;
}

.m-logistbox {
  margin-top: 20rpx;
}

.m-logistitem {
  font-size: 28rpx;
  background-color: #fff;
  padding: 40rpx 20rpx 40rpx 100rpx;
  border-bottom: 1rpx solid #ebebe7;
  line-height: 40rpx;
  color: #888;
  position: relative;
}

.m-logistitem::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 1rpx;
  height: 100%;
  border-left: 1rpx solid #ebebe7;
  margin-left: 50rpx;
}

.m-logistitem::before {
  content: "";
  position: absolute;
  width: 30rpx;
  height: 30rpx;
  left: 0;
  top: 0;
  background-color: #d5d5d5;
  border-radius: 100%;
  margin-left: 35rpx;
  margin-top: 40rpx;
  z-index: 2;
}

.m-logistitem:first-child {
  color: $default-skin-bg;
}

.m-logistitem:first-child::before {
  content: "";
  position: absolute;
  width: 30rpx;
  height: 30rpx;
  left: 0;
  top: 0;
  background-color: $default-skin-bg;
  border-radius: 100%;
  margin-left: 35rpx;
  margin-top: 40rpx;
  z-index: 2;
}

.map {
  /* margin-top: 20rpx; */

}

.map image {
  width: 60rpx;
  height: 60rpx;
  z-index: 999;
  position: absolute;
  top: 100rpx;
  right: 20rpx;
}
</style>

