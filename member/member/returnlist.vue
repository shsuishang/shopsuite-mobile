<template>
  <view v-if="loadComplete">
    <scroll-view v-if="isdata" scroll-y="true" class="m-orderlist  page-container" @scrolltolower="scrollbottom">
      <view class="sstouch-main-layout">
        <view class="sstouch-order-list" style="padding-bottom: 12px;">
          <view>
            <view v-if="pdlist.length > 0">
              <view v-for="(item, i) in pdlist" :key="i" class="m-panel m-panel-access">
                <view class="m-panel-hd">
                  <text>{{ __('服务单号：') }}{{ item.return_id }}</text>
                  <label v-for="(states, index) in plantformInfo.return_state_list" :key="index">
                    <label v-if="states.value == item.return_state_id">
                      {{ states.label }}
                    </label>
                  </label>
                </view>
                <view class="m-product-list">
                  <navigator :url="'/member/order/detail?on=' + (item.order_id)" class="m-product-item" :key="item.order_id"
                             v-for="(val, ii) in item.items">
                    <view class="m-product-img">
                      <image :src="(val.order_item_image)" mode="aspectFill"/>
                    </view>
                    <view class="m-product-info">
					  <view class="m-product-name">
					    <label>
					      {{ val.product_name }}
					    </label>
					    <label class="m-min-name"
					           style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1"
					    >
					      {{ val.item_name ? val.item_name : "" }}
					    </label>
					  </view>
                      <view class="m-product-price">
                        <block v-if="val.order_item_sale_price">
                          <label>{{ __('￥') }}</label>{{ val.order_item_sale_price }}
                        </block>
                        <text style="float: right;margin-right: 60rpx;">x{{ val.order_item_quantity }}</text>
                      </view>
                    </view>
                  </navigator>
                </view>

                <view class="m-total-info">
                  <text>
                    <text class="default">{{ __('退货数量') }}：</text>
                    <block v-if="item.return_num">
                      <label class="m-total-price">{{ item.return_num }}</label>
                    </block>
                  </text>
                  <text style="margin-left: 60rpx">
                    <text class="default">{{ __('退货金额') }}：</text>
                    <block v-if="item.return_refund_amount">
                      <text style="">{{ __('￥') }}</text>
                      <label class="m-total-price">{{ item.return_refund_amount }}</label>
                    </block>
                  </text>
                </view>
                <view class="m-total-btn">
                  <navigator :url="sprintf('/member/member/returndetail?return_id=%s', item.return_id)"
                             class="u-link-btn">{{ __('退款详情') }}
                  </navigator>
                </view>
              </view>


              <view class="loading" v-if="flag">
                <view class="spinner"><i></i></view>
                {{ __('订单数据读取中...') }}
              </view>
            </view>
            <view class="sstouch-norecord refund" v-else>
              <view class="norecord-ico"><i></i></view>
              <dl>
                <dt>{{ __('您还没有退货信息') }}</dt>
                <dd>{{ __('已购订单详情可申请退货') }}</dd>
              </dl>
            </view>

          </view>
        </view>
      </view>

      <view class="m-loading-box">
        <block v-if="(ispage)">
          <view class="u-loadmore">
            <view class="u-loading"></view>
            <text class="u-loadmore-tips">{{ __('正在加载') }}</text>
          </view>
        </block>
        <block v-else>
          <view class="u-loadmore u-loadmore-line">
            <text class="u-loadmore-tips">{{ __('没有更多数据啦！') }}</text>
          </view>
        </block>
      </view>
    </scroll-view>
    <view class="m-nullpage" v-else>
      <view class="m-nullpage-middle">
        <label class="iconfont icon-meiyougengduo"></label>
        <view class="m-null-tip">
          <label style="font-size:32rpx;">{{ __('亲~什么都没有') }}</label>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      pdlist: [],
      flag: true,
      ispage: true,
      scposition: "",
      istop: false,
      isdata: false,
      post: {
        sidx: '',
        sord: '',
        isnew: false,
        keywords: "",
        store_category_ids: 0,
        page: 1,
        wd_id: null
      },
      sort: 0,
      loadComplete: false // 没有加载数据前不显示的对应内容
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('售后服务')
    });
    var that = this;
    that.GetPlist();
  },
  onReachBottom: function () {
    this.scrollbottom()
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    scrollbottom: function (e) {

      if (this.flag) {
        var that = this;
        that.setData({
          flag: false
        }), clearTimeout(n);

        var post = this.post
        post.sidx = 'product_unit_price';
        post.sord = this.sort == 1 ? 'DESC' : 'ASC';
        post.page = parseInt(that.post.page) + 1;

        var n = setTimeout(function () {
              that.setData({
                post: post
              }), that.GetPlist()
            },
            500)
      }
    },

    /*
     * 读取商品数据
     */
    GetPlist: function (callback) {
      //console.info(1111111)
      this.setData({
        flag: false
      });

      var that = this;
      let params = that.post;
      params.u_id = that.post.wd_id;


      that.$.request({
        url: this.Config.URL.user.return_lists,
        data: params,
        success: function (data, status, msg, code) {

          if (data.page >= data.total) {
            that.setData({
              flag: false,
              ispage: false,
              pdlist: that.pdlist.concat(data.items)
            })
          } else {
            that.setData({
              flag: true,
              ispage: true,
              pdlist: that.pdlist.concat(data.items)
            })
          }

          that.pdlist.length == 0 ? that.setData({
            isdata: false,
            loadComplete: true
          }) : that.setData({
            isdata: true,
            loadComplete: true
          })
        },
        fail: function (data) {
          that.setData({
            loadComplete: true
          });
          that.$.alert("网络异常请重试！");
        }
      });
    },
    returnTop: function () {
      this.setData({
        scposition: 0
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/_variables";

.m-navbar-item {
  padding: 20rpx 0;
  font-size: 28rpx;
}

.m-navbar-item:after {
  border: none;
}

.m-navbar-item.m-navbar-item-on {
  background-color: #fff;
  color: $default-skin-bg;
}

.m-navbar-item.m-navbar-item-on::before {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 6rpx;
  border-bottom: 6rpx solid $default-skin-bg;
  color: #CCCCCC;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 3;
}

.m-panel-hd label {
  float: right;
  color: $default-skin-bg;
  font-size: 26rpx;
}

.m-total-info {
  text-align: right;
  padding: 10rpx 38rpx;
  font-size: 24rpx;
}

.m-total-info label {
  font-size: 32rpx;
  color: $default-skin-bg;
}

.m-total-info text {
  font-size: 24rpx;
  color: $default-skin-bg;
}

.m-total-info .default {
  font-size: 24rpx;
  color: #555555;
}

.m-total-btn {
  text-align: right;
  padding: 20rpx 20rpx 20rpx 20rpx;
  position: relative;
}

.m-total-btn::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #ebebe7;
  color: #ebebe7;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.m-total-btn .u-link-btn {
  margin: 0 10rpx;
  vertical-align: middle;
  display: inline-block;
  line-height: 40rpx;
  background-color: #fff;

  font-size: 24rpx;
}

.m-sort {
  position: relative
}

.m-sort image {
  width: 24rpx;
  height: 24rpx;
  position: absolute;
  /*top: 50%;*/
  margin-top: 10rpx;
  margin-left: 2rpx;
}

.m-product-price text {
  font-size: 24rpx;
  color: #999999;
  margin-left: 6rpx
}

.m-tab {
  position: fixed;
  width: 100%;
  top: var(--window-top);
  z-index: 2;
}

.m-orderlist {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 2rpx;
}


.u-tuan-label {
  padding: 5rpx;
  background-color: $default-skin-bg;
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #fff;
  margin-right: 5rpx;
}

.alert {
  font-size: 32rpx;
  width: 70%;
  height: 200rpx;
  padding: 0 40rpx;
  position: absolute;
  left: 10%;
  top: 40%;
  background: #fff;
  border-radius: 10rpx;
  justify-content: center;
  display: flex;
  align-items: center;
  z-index: 999;
}

.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 998
}

.m-product-name {
  font-size: 24rpx;
}

.m-product-img {
  image {
    padding: 10rpx;
  }
}

.m-product-item {
  margin-top: 0rpx;
}

.scroll-view_H {
  width: 100%;
  white-space: nowrap;

  height: 84rpx;

  .m-navbar-item {
    display: inline-block;
    padding-left: 20rpx;
    padding-right: 20rpx;

    /*min-width:110rpx;*/
    min-width: 150rpx;
  }
}

</style>

