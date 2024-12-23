<template>
  <view class="page">
	  <view class="m-tab">
	    <view class="m-navbar">
	      <view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" @click="allStatus">
	        {{ __('全部') }}
	      </view>
	      <view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')" @click="notInvoice">
	        {{ __('未开票') }}
	      </view>
	      <view :class="'m-navbar-item ' + (tapindex==3?'m-navbar-item-on':'')" @click="yesInvoice">
	        {{ __('已开票') }}
	      </view>
	    </view>
	  </view>
	  <scroll-view scroll-y="true" class="m-scrollBox" @scrolltolower="scrollbottom" scroll-top="(scposition)" v-if="(isdata)">
		<view class="box-sty" v-for="(item, i) in invoiceList" :key="i">
			<view class="box-head">
				<navigator :url="'/member/order/detail?on=' + (item.order_id)">
					<view style="margin-left: 40upx;">
						{{ __('订单编号：') }}  {{ item.order_id }}
					</view>
				</navigator>
				<view class="box-state-sty">
					<text v-if="item.invoice_status == 0">{{ __('未开票') }}</text>
					<text v-else>{{ __('已开票') }}</text>
				</view>
			</view>
			<view class="box-content-sty">
				<view class="box-head-sty">
					{{ __('发票抬头：') }} {{ item.invoice_title }}
				</view>
				<view class="box-invo-con" v-if="false">
					{{ __('发票内容：') }} {{ item.invoice_content }}
				</view>
				<view>
					{{ __('纳税人识别号：') }} {{ item.invoice_company_code }}
				</view>
				<view>
					{{ __('发票类型：') }} 
					<text v-if="item.invoice_type == 1">{{ __('普通发票') }}</text>
					<text v-else>{{ __('增值税专用发票') }}</text>
				</view>
				<view>
					{{ __('开票金额：') }} <text style="color: red;"> {{ __('￥') }}{{ item.invoice_amount }}</text>
				</view>
				<view v-if="item.invoice_status && item.invoice_datetime" style="font-size: 24upx; color: #959595;">
					{{ __('开票时间：') }} {{ item.invoice_datetime }}
				</view>
				<view v-if="item.invoice_status && item.invoice_img" style="position: absolute;right: 10rpx;bottom: 5rpx;" >
					<a :href="item.invoice_img" class="u-link-btn">{{ __('查看详情') }}</a>
				</view>
			</view>
			
		</view>
		<view class="m-loading-box">
		    <block v-if="(ispage)">
		        <view class="u-loadmore">
		            <label class="u-loading"></label>
		            <text class="u-loadmore-tips">{{__('正在加载')}}</text>
		        </view>
		    </block>
		    <block v-else>
		        <view class="u-loadmore u-loadmore-line">
		            <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
		        </view>
		    </block>
		</view>
			
					 
		</scroll-view>

    <view class="m-nullpage" v-else>
      <view class="m-nullpage-middle">
        <label class="iconfont icon-dizhi"></label>
        <view class="m-null-tip">
          <text>{{ __('您尚无发票信息') }}</text>
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
      invoiceList: [],
	  isdata: false,
	  page: 1,
	  tapindex: 1,
	  size: 10,
	  ispage: true,
	  invoice_status:'',
	  flag: true,
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('我的发票')
    });

    this.setData({
      options: options,
    });

    this.listInvoice();
  },
  onShow: function () {
  },
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listInvoice();
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    RefreshMethod: function () {
      this.listInvoice()
    },
	scrollbottom: function () {
	  if (this.flag) {
	    var that = this;
	    that.setData({
	      flag: false
	    });
	
	    clearTimeout(t);
	    var t = setTimeout(function () {
	      that.setData({
	        flag: false,
	        page: parseInt(that.page) + 1,
	        size: 10
	      });
	
	      that.listInvoice()
	    }, 100)
	  }
	},
	listInvoice: function () {
	  var that = this;
	  var params = {
		invoice_status: this.invoice_status,
	    page: that.page,
	    size: that.size,
	  };
	
	  that.$.request({
	    url: that.Config.URL.user.listOrderInvoice,
	    data: params,
	    success: function (data, status, msg, code) {
	      if (200 == status && data.items.length > 0) {
			  for (let i = 0; data.items.length > i; i++) {
				  if (data.items[i].invoice_datetime) {
					  data.items[i].invoice_datetime = $.formatDateFormatter(data.items[i].invoice_datetime, "yyyy-MM-dd hh:mm:ss");
				  }
			  }
	        if (data.page >= data.total) {
	          that.setData({
	            flag: false,
	            ispage: false,
	            invoiceList: that.invoiceList.concat(data.items)
	          })
	        } else {
	          that.setData({
	            flag: true,
	            ispage: true,
	            invoiceList: that.invoiceList.concat(data.items)
	          })
	        }
	
	        that.setData({
	          isdata: true,
	        })
	
	      } else {
	        that.setData({
	          flag: false,
	          ispage: false,
	          isdata: false,
	        })
	      }
	    },
	    fail: function (data) {
	      that.setData({
	        isdata: false,
	      });
	      that.$.alert("网络异常请重试！");
	    }
	  });
	},
	allStatus: function () {
	  this.setData({
	    tapindex: 1,
	    page: 1,
	    ispage: true,
	    flag: true,
	    invoice_status: '',
		invoiceList: []
	  }), this.listInvoice()
	},
	notInvoice: function () {
	  this.setData({
	    tapindex: 2,
	    page: 1,
	    ispage: true,
	    flag: true,
	    invoice_status: 0,
	    invoiceList: []
	  }), this.listInvoice()
	},
	yesInvoice: function () {
	  this.setData({
	    tapindex: 3,
	    page: 1,
	    ispage: true,
	    invoice_status: 1,
	    flag: true,
	    invoiceList: []
	  }), this.listInvoice()
	},

  }
};
</script>


<style lang="scss">
@import "../../styles/_variables";

.box-sty {
	background-color: #fff;
	margin-top: 20upx;
	border-radius: 20upx;
	padding-bottom: 20upx;
	margin-left: 10upx;
	margin-right: 10upx;
}

.box-head {
	margin-top: 20upx;
	padding-top: 20upx;
	display: flex;
	justify-content: space-between;
	border-bottom: 1upx solid #dbdbdb;
	padding-bottom: 10upx;
}

.box-state-sty {
	color: red;
	margin-right: 40upx;
}

.box-content-sty {
	padding-left: 40upx;
	margin-top: 20upx;
	padding-right: 40upx;
	position: relative;
}

.box-content-sty .u-link-btn {
  margin: 0 10rpx;
  vertical-align: middle;
  display: inline-block;
  line-height: 30rpx;
  background-color: #fff;
  font-size: 22rpx;
}
.box-head-sty {
	white-space: nowrap; 
	overflow: hidden; 
	text-overflow: ellipsis;
}

.box-invo-con {
	display: -webkit-box; 
	-webkit-line-clamp: 2; 
	-webkit-box-orient: vertical; 
	overflow: hidden;
}

.m-orderlist {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.m-navbar-item {
  padding: 20rpx 0;
  font-size: 24rpx;
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


</style>

