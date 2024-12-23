<template>
  <view class="page">
    <view :class="(show?'cover':'')" style="z-index:2">
    </view>
    <view class="m-box" v-if="is_data">
      <view class="m-box-item" style="z-index:1">
        <view class="m-title">
          <view class="m-pimg" style="width: 96rpx;">
            <image lazy-load mode="scaleToFill" :src="(dataInfo.order_item_image)"></image>
          </view>
          <view style="font-size:24rpx;color:#888;float:left;width: 614rpx;">
            <label>
              {{ dataInfo.item_name }}
            </label>
            <label>
              {{ __('￥') }}{{ dataInfo.order_item_sale_price }} x {{ dataInfo.order_item_quantity }}
            </label>
          </view>
        </view>
        <view class="m-text">
					<textarea style="z-index:2" auto-height v-model="return_buyer_message" :placeholder="__('退货备注')"
                    placeholder-class="placeholder-class" maxlength="200"
                    @input="inputOpinion"/>
        </view>
        <view class="m-upImg">
          <view class="m-upImg-item" v-for="(imglist, ii) in dataInfo.comment_image" :key="ii">
            <image lazy-load mode="aspectFit" :src="(imglist)" @click="ImgTap"></image>
            <view v-if="true" class="u-del-item" :data-index="(ii)" @click.stop="delImg"><label
                class="iconfont icon-delete" :data-index="(ii)"></label></view>
          </view>
          <view v-if="true" class="m-upImg-item upSelect" @click.stop="upImgs">
            <label class="iconfont icon-xiangji"></label>
          </view>
        </view>
      </view>

    </view>
    <view class="m-VComment">
      <view class="m-VConmmenBox">
        <view class="m-label">{{ __('退款原因') }}</view>
        <view class="m-cell-bd">
          <picker @change="bindPickerChange" :value="index" :range="returnReasonList" range-key="return_reason_name">
            <view class="uni-input">{{ return_reason_name }}</view>
          </picker>
        </view>
      </view>
      <view class="m-VConmmenBox">
        <view class="m-label">{{ __('退货数量') }}</view>
        <view class="m-startBox">
          <input v-model="return_item_num" type="number" :placeholder="__('请输入退货数量')"
                 placeholder-class="placeholder-class" style="line-height: 80rpx;height: 80rpx;" disabled="true"></input>
        </view>
        <view class="m-label m-right">{{ sprintf(__('可退数量 %s'), dataInfo.can_refund_num) }}</view>
      </view>
      <view class="m-VConmmenBox">
        <view class="m-label">{{ __('退款金额') }}</view>
        <view class="m-startBox">
          <input v-model="return_refund_amount" type="digit" :placeholder="__('请输入退款金额')"
                 placeholder-class="placeholder-class" style="line-height: 80rpx;height: 80rpx;" disabled="true"></input>

        </view>
        <view class="m-label m-right">{{ sprintf(__('可退金额 ￥ %s'), dataInfo.can_refund_amount) }}</view>
      </view>
      <view class="m-VConmmenBox">
        <view class="m-label">{{ __('联系方式') }}</view>
        <view class="m-startBox">
          <input v-model="return_tel" type="number" :placeholder="__('请输入联系方式')" placeholder-class="placeholder-class"
                 style="line-height: 80rpx;height: 80rpx;"></input>
        </view>
      </view>

    </view>
    <view style="height:120rpx;"></view>
    <view class="m-submitComment" v-if="(!isDisable)">
      <view class="m-subBtn" @click="submitComment">
        {{ __('提交退货申请') }}
      </view>
    </view>
    <view class="alert" v-if="(show)" style="z-index:3">
      <image lazy-load style="width:50rpx;height:50rpx" src="/static/images/true.png"></image>
      <text style="margin-left:20rpx">{{ Info }}</text>
    </view>
  </view>
</template>

<script>
import {mapMutations, mapState} from 'vuex';

export default {
  data() {
    return {
      dataInfo: {},
      CommentImgList: [],
      isDisable: false,
      show: false,
      Info: '',
      is_data: false,
      param: {},
      return_reason_id: 0,
      return_reason_name: '',
      returnReasonList: [],
      index: 0,

      order_item_id: '',
      return_buyer_message: '',
      return_refund_amount: '',
      return_item_num: '',
      return_tel: ''
    };
  },
  computed: mapState([
    'Config',
    'StateCode',
    'notice',
    'plantformInfo',
    'shopInfo',
    'userInfo',
    'hasLogin'
  ]),
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('售后申请')
    });

    this.setData({
      order_item_id: options.order_item_id
    })
    this.refreshData(options)
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    refreshData: function (options) {
      var that = this;
      var params = {order_id: options.order_id, order_item_id: options.order_item_id};

      that.$.request({
        url: this.Config.URL.user.return_item,
        data: params,
        success: function (data, status, msg, code) {
          data.comment_image = [];

          if (status == 200) {
            that.setData({
              dataInfo: data,
              is_data: true,
              param: params,
              returnReasonList: data.return_reason_list,
              return_reason_id: data.return_reason_list[0].return_reason_id,
              return_reason_name: data.return_reason_list[0].return_reason_name,
            });

            that.return_item_num = that.dataInfo.can_refund_num;
            that.return_refund_amount = that.dataInfo.can_refund_amount;
            that.return_tel = that.userInfo.user_mobile;
          }
        }
      });
    },
    inputOpinion: function (e) {
      var param = this.param;
      param.return_buyer_message = e.detail.value;

      this.setData({param: param});
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
      var that = this;
      this.return_reason_id = this.returnReasonList[this.index].return_reason_id;
      this.return_reason_name = this.returnReasonList[this.index].return_reason_name;
    },
    upImgs: function (e) {
      var that = this;
      var dataInfo = this.dataInfo;
      if (dataInfo.comment_image && dataInfo.comment_image.length == 9) {
        that.$.alert('最多上传9张图片！');
        return;
      }

      //that.$.showLoading();
      that.$.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (n) {
          that.$.showLoading();
          var r = n.tempFilePaths;
          that.$.uploadFile({
            url: that.Config.URL.upload,
            method: 'POST',
            filePath: r[0],
            name: 'upfile',
            //header: { 'content-type': 'multipart/form-data' },
            success: function (n) {
              that.$.hideLoading();
              var up_res = that.$.parseJSON(n.data);

              var s = up_res.data.file_url;
              dataInfo.comment_image.push(s);
              that.setData({dataInfo: dataInfo});
            },
            fail: function (e) {
              that.$.hideLoading();
            },
            complete: function (e) {
              that.$.hideLoading();
            }
          });
        },
        fail: function (e) {
          that.$.hideLoading();
        },
        complete: function (e) {
          that.$.hideLoading();
        }
      });
    },
    delImg: function (e) {
      //console.info(e);
      var dataInfo = this.dataInfo;
      var that = this;
      that.$.confirm(
          '是否放弃上传本张图片?',
          function (n) {
            if (n.confirm) {
              var i = [];
              for (let s = 0; s < dataInfo.comment_image.length; s++) {
                if (s != e.target.dataset.index) {
                  var o = dataInfo.comment_image[s];
                  i.push(o);
                }
              }
              dataInfo.comment_image = i;

              that.setData({dataInfo: dataInfo});
            }
          },
          true
      );
    },
    submitComment: function (e) {
      var that = this;
      var dataInfo = this.dataInfo;

      if (that.return_refund_amount <= 0) {
        that.$.alert('退款金额必填！');
        return;
      }

      if (that.return_item_num > that.dataInfo.can_refund_num) {
        that.$.alert('退货数量必须小于等于可退数量！');
        return;
      }

      /*
      var g = /^[1-9]*[1-9][0-9]*$/;
      if(!g.test(that.return_item_num))
      {
        that.$.alert('退货数量必须是正整数！');
        return;
      }
      */

      /*
      if (that.return_item_num < 1)
      {
        that.$.alert('退货数量必填！');
        return;
      }
      */

      that.$.confirm(
          '确认退货?',
          function (e) {
            if (e.confirm) {
              var params = {
                order_id: dataInfo.order_id,
                order_item_id: that.order_item_id,
                return_refund_amount: that.return_refund_amount,
                return_item_num: that.return_item_num,
                return_buyer_message: that.return_buyer_message,
                return_item_image: dataInfo.comment_image,
                refund_type: 2,
                return_tel: that.return_tel,
                return_reason_id: that.return_reason_id,
              };
              that.$.request({
                url: that.Config.URL.user.return_add_one,
                data: params,
                method: "POST",
                success: function (data, status, msg, code) {
                  if (status == 200) {


                    that.$.alert('申请退货成功！', function () {
                      let url = that.$.sprintf('/member/member/returndetail?return_id=%s', data.return_id)
                      that.$.gopage(url);

                      /*
                      setTimeout(function() {
                        that.$.navigateBack(1);
                      }, 2e3);
                      */
                    });
                  } else {
                    that.$.showToast({
                      title: msg,
                      icon: "error",
                      error: function () {

                      }
                    })
                  }
                }
              });
            }
          },
          true
      );
    },
    ImgTap: function (e) {
      var that = this,
          urls = [];

      for (var i in this.dataInfo.comment_image) {
        urls.push(this.dataInfo.comment_image[i]);
      }
      var s = e.target.dataset.src;

      that.$.previewImage({current: s, urls: urls});
    }
  }
};
</script>


<style lang="scss">
@import '../../styles/_variables';

.m-box-item {
  margin-bottom: 20rpx;
}

.m-title {
  box-sizing: border-box;
  height: 260rpx;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 20rpx;
  height: 120rpx;
  display: inline-flex;
}

.m-pimg {
  width: 90rpx;
  height: 90rpx;
  background-color: sandybrown;
  margin-right: 20rpx;
  vertical-align: middle;
  float: left;
}

.m-pimg image {
  width: 100%;
  height: 100%;
}

.m-start {
  height: 70rpx;
  display: inline-block;
  vertical-align: middle;
  line-height: 70rpx;
  float: left;
}

.m-label {
  font-size: 28rpx;
  color: #333;
  vertical-align: middle;
  margin-right: 10rpx;
  display: inline-block;
  line-height: 80rpx;
  height: 80rpx;
  width: 120rpx;
}

.m-startBox {
  display: inline-block;
  /* color: #eee; */
  width: 360rpx;
}

.m-startBox label {
  padding: 0 5px;
  font-size: 36rpx;
}

.m-right {
  width: 260rpx;
  color: #36BC9B;
  font-size: 26rpx;
}

.sel {
  color: $default-skin-bg;
}

.m-VComment {
  background-color: #fff;
  padding: 20rpx;
  margin-top: 20rpx;
}

.m-VConmmenBox {
  /* margin-bottom: 10rpx; */
  display: inline-flex;
}

.m-VConmmenBox:first-child {
  /* margin-bottom: 10rpx; */
  display: inline-flex;
}

.m-text {
  box-sizing: border-box;
  padding: 10rpx 10rpx 0 10rpx;
  background-color: #fff;
  font-size: 24rpx;
  min-height: 100rpx;
  font-size: 28rpx;
  line-height: 40rpx;
}

.m-text textarea {
  width: 100%;
  height: 100%;
}

.m-upImg {
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
}

.m-upImg-item {
  width: 120rpx;
  height: 120rpx;
  border: 1px solid #eee;
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

.m-subBtn {
  float: right;
  padding: 0 20rpx;
  height: 100%;
  background-color: $default-skin-bg;
  color: #fff;
  font-size: 28rpx;
  line-height: 100rpx;
}

.m-media-box-desc {
  display: block;
}

.alert {
  font-size: 32rpx;
  width: 70%;
  padding: 0 40rpx;
  height: 200rpx;
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
  z-index: 998;
}

.uni-input {
  padding-left: 0px;
}
</style>
