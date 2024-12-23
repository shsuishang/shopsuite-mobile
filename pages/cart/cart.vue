<template>
  <view class="page">
    <view v-if="loadComplete">
      <block v-if="isdata">
        <view class="m-product-all">
          <view class="m-product-list">
            <block v-for="(store_items, storeindex) in cartlist.items" :key="storeindex">
              <view class="m-store" :data-id="(store_items.id)" v-if="false">
                <view class="m-store-c">
                  <view class="m-store-ck" @click="ckStore" :data-id="(store_items.id)"
                        :data-isck="(store_items.cart_select)">
                    <uni-icons :type="(store_items.cart_select?'circle-filled':'circle') "
                               :color="(store_items.cart_select?theme_bg:'#e3e3e3')" size="20"/>
                  </view>
                  <label class="m-store-info">
                    {{ store_items.store_name }}
                    {{ plantformInfo.site_name }}
                  </label>
                </view>
              </view>
              <view v-for="(item, itemindex) in store_items.items" :key="itemindex" class="m-product-item">
                <view :class="{'m-item-c':1, del:(item.cart_id==T_Id)}" @touchstart="removestart"
                      @touchmove="removeload"
                      @touchend="removeend" :data-id="(item.cart_id)" @longpress.stop="pressDelCart">
                  <navigator :url="'/pagesub/product/detail?id=' + (item.item_id)"
                             style="font-size:28rpx;line-height:2;display:flex;height:100%;width:100%;">
                    <view class="m-cart-ck" @click.stop="ckItem" :data-id="(item.cart_id)"
                          :data-isck="(item.cart_select)">
                      <uni-icons :type="(item.cart_select?'circle-filled':'circle') "
                                 :color="(item.cart_select?theme_bg:'#e3e3e3')" size="20"/>
                    </view>
                    <view class="m-product-img">
                      <image lazy-load :src="($.img(item.product_image, 200, 200))"/>
                    </view>
                    <view class="m-product-info">
                      <view class="m-product-name">
                        <image v-if="(item.product_state_id == 1002)" lazy-load
                               style="" class="off-shelf-simg"
                               src="http://static.shopsuite.cn/xcxfile/appicon/xiajia.png"/>

                        <label>
                          {{ item.product_name }}
                        </label>
                        <label class="m-min-name"
                               style="">{{
                            item.item_name ? item.item_name : ""
                          }}</label>
                      </view>
                      <view class="m-product-box">
                        <view class="m-product-price">
                          <block v-if="item.item_sale_price">
                            <label style="font-size: 12px;">{{ __('￥') }}</label> {{ number_format(item.item_sale_price, 2) }} <label
                              class="pre-info-price"
                              v-if="(item.item_save_price)">-{{
                              __('￥')
                            }}{{ number_format(item.item_save_price, 2) }}</label>
                          </block>

                          <block v-if="item.item_unit_points">
                            <label class="pre-info-price" style="margin: 0rpx 10rpx;">+</label><label
                              style="font-size:14x">{{ item.item_unit_points }}</label><label style="font-size: 12px;">{{ __('积分') }}</label>
                          </block>
                          <block v-if="item.item_unit_sp">
                            <label class="pre-info-price" style="margin: 0rpx 10rpx;">+</label><label
                              style="font-size:32rpx">{{ item.item_unit_sp }}</label><label>{{ __('众宝') }}</label>
                          </block>
                        </view>
                        <block>
                          <view class="u-cart-num">
                            <view class="u-num-btn thin-border-right" @click.stop="sub" :data-num="(item.cart_quantity)"
                                  :data-stock="(item.cart_quantity+item.buy_limit)"
                                  :data-cid="(item.cart_id)" :data-skuid="(item.item_id)" :data-userid="(item.user_id)">
                              -
                            </view>
                            <input type="number" :value="(item.cart_quantity)" @click.stop @blur="writenum"
                                   :data-stock="(item.cart_quantity+item.buy_limit)"
                                   :data-cid="(item.cart_id)" :data-skuid="(item.item_id)"
                                   :data-userid="(item.user_id)"/>
                            <view class="u-num-btn thin-border-left" @click.stop="add" :data-num="(item.cart_quantity)"
                                  :data-stock="(item.cart_quantity+item.available_quantity)"
                                  :data-cid="(item.cart_id)" :data-skuid="(item.item_id)" :data-userid="(item.user_id)">
                              +
                            </view>
                          </view>
                        </block>
                      </view>
                      <!-- <block v-else>
            <view class="u-cart-num">
              <view class="u-num-btn">-</view>
              <input type="text" :value="(item.cart_quantity)" />
              <view class="u-num-btn">+</view>
            </view>
            </block> -->
                    </view>
                    <view class="u-del" :data-id="(item.cart_id)" @click.stop.prevent="delcart" @touchstart.stop.prevent
                          @touchmove.stop.prevent @touchend.stop.prevent="delcart">
                      <view class="u-del-btn">{{ __('删除') }}</view>
                    </view>
                  </navigator>
                </view>
              </view>
            </block>
          </view>
        </view>
        <view class="u-cleanbox"></view>
        <view class="m-footer-btn" :style="'bottom:' + barBottom + 'px'">
          <view class="m-footer-btn-list">
            <view class="m-footer-btn-item">
              <view class="m-cart-ck" @click="ckAll" :data-isck="(isckall)">
                <uni-icons :type="(isckall?'circle-filled':'circle')" :color="(isckall?theme_bg:'#e3e3e3')" size="20"/>
              </view>
              <view style="padding-right: 10rpx;display: initial;line-height: 92rpx">{{ __("全选") }}</view>
              <view class="m-cart-del" @click="delAll">
                <label class="iconfont icon-delete"></label>
              </view>
            </view>
            <view class="m-footer-btn-item m-cart-total">
              <view style="line-height: 1.8;font-size: 12px;">{{ __('合计：') }}
                <block v-if="cartlist.order_money_amount">
                  <label style="font-size: 12px;">{{ __('￥') }}</label>
                  <text>{{ number_format(cartlist.order_money_amount, 2) }}</text>
                </block>

                <block v-if="cartlist.order_points_amount">
                  <label style="margin: auto 8rpx;">+</label>
                  <text v-if="cartlist.order_points_amount"> {{ number_format(cartlist.order_points_amount) }}</text>
                  <label style="font-size: 12px;">{{ __('积分') }}</label>
                </block>

                <block v-if="cartlist.order_sp_amount">
                  <label style="margin: auto 10rpx;">+</label>
                  <text v-if="cartlist.order_sp_amount"> {{ number_format(cartlist.order_sp_amount) }}</text>
                  <label>{{ __('众宝') }}</label>
                </block>
              </view>
              <view style="font-size: 20rpx;line-height: 28rpx"><label
                  style="margin-right: 10rpx;color:#888;">{{
                  __('优惠:￥')
                }}{{ number_format(cartlist.order_discount_amount, 2) }}</label>
                {{ __('不含运费') }}
              </view>
            </view>
          </view>
          <view class="m-footer-btn-main" @click="submitOrder">
            {{ sprintf(__('结算(%s)'), cartlist.Total) }}
          </view>
        </view>

        <view :class="{'m-panel-sp':1, hide:selectsp==0}" @click="closesp">
          <view :style="'bottom:' + barBottom + 'px'"
                :class="'m-panel-sp-content ' +  (selectct==0?'bounceOutDown animated':'bounceInUp animated')" catchtap>
            <view class="m-panel-sp-pinfo">
              <view class="m-panel-sp-pname">
                <view class="m-pstock">{{ __('选择商品') }}</view>
              </view>
              <uni-icons type="close" class="m-panel-sp-icon" color="#888" @click="closesp"/>
            </view>
            <scroll-view class="m-panel-sp-listbox" scroll-y="true">
              <block v-for="(select_items, key1) in spdata.selecInfo" :key="key1">
                <view class="m-panel-sp-listbox-item" @click="chooseRaiseBuyItem" :data-item_id="(select_items.item_id)"
                      :data-activity_id="(spdata.actId)" :data-activity_item_id="(spdata.activity_item_id)"
                      :data-cart_type="(cart_type)">
                  <view class="m-panel-sp-labellist" v-if="(true)">
                    <view class="m-panel-sp-pimg">
                      <image lazy-load :src="($.img(select_items.product_image, 200, 200))"/>
                    </view>
                    <view class="m-panel-sp-pname">{{ select_items.product_item_name }}

                      <view class="m-product-price">
                        <label style="font-size: 12px;">{{ __('￥') }}</label>{{ number_format(select_items.item_sale_price, 2) }} <label
                          class="pre-info-price"
                          v-if="(select_items.item_save_price)">-{{
                          __('￥')
                        }}{{ number_format(select_items.item_save_price, 2) }}</label>
                      </view>

                    </view>
                  </view>
                </view>
              </block>
              <!-- <view style="height:96rpx;width:100%;"></view> -->
            </scroll-view>
          </view>
        </view>
      </block>
      <block v-else>
        <navigator url="/pages/index/index" open-type="switchTab" class="m-nullpage">
          <view class="m-nullpage-middle">
            <label class="iconfont icon-konggouwuche"></label>
            <view class="m-null-tip">
              <text>{{ __('购物车空空如也') }}</text>
              <text>{{ __('去挑几件中意的商品吧') }}</text>
            </view>
          </view>
        </navigator>
        <guess-you-like ref="guessYouLike" :titleText="__('——猜你喜欢——')" :isShowLoading="false"></guess-you-like>
      </block>
    </view>
  </view>
</template>

<script>
import guessYouLike from '@/components/product-list.vue'
import {mapMutations, mapState} from 'vuex'
import {theme_bg} from "@/styles/_variables.scss";

export default {
  data: function () {
    return {
      options: {},
      selectsp: 0,
      selectct: 0,
      cart_type: 0,
      spdata: [],
      flag: false,
      isckall: false,
      cartlist: {items: []},
      X_Start: 0,
      X_End: 0,
      T_Id: 0,
      select_cart_ids: [],
      selectedItemJson: [],
      isdata: false,
      barBottom: 0,
      itemindex: 0,
      theme_bg: theme_bg,
      loadComplete: false // 没有加载数据前不显示的对应内容
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  components: {
    guessYouLike
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.$onLaunched;

    console.info('onLoad...')
    uni.setNavigationBarTitle({
      title: this.__('购物车')
    });

    var that = this;

    let bar_bottom = 0;
    // #ifdef H5
    bar_bottom = 50;
    // #endif

    that.setData({
      options: options,
      barBottom: bar_bottom
    })


    //console.log(this.tabBar)
    this.notice.addNotification("RefreshCart", that.RefreshCart, that);
  },

  onShow: function () {
    var that = this;

    this.getUserInfo(function (user) {
      that.getCartList()
    });
    this.showCartNum();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面，注销事件
    var that = this
    this.notice.removeNotification("RefreshCart", that);
  },

  onPullDownRefresh: function () {
    this.getCartList()
  },

  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum', 'showCartNum']),
    //获取平台信息
    getPlatType: function () {
      let platStr = null;
      // #ifdef MP-WEIXIN
      platStr = "weiXin"
      //#endif

      // #ifdef H5
      platStr = "H5"
      //#endif

      // #ifdef APP-PLUS
      platStr = "APP"
      //#endif
      return platStr
    },

    //数据格式为店铺结构
    formatCartList: function (data) {
      let that = this

      const cartObj = {};
      let cartList = {'items': []};

      //循环所有记录
      if (!that.$.isNull(data.items) && data.items.length > 0) {
        for (var index in data.items) {
          if (typeof cartObj[data.items[index].store_id] == "undefined") {
            cartObj[data.items[index].store_id] = {items: [], activitys: {gift: [], reduction: [], multiple: [],}}
          }

          cartObj[data.items[index].store_id].items.push(data.items[index])
        }
      }


      cartList.items = Object.values(cartObj)

      return cartList;
    },

    ckalllength: function (data) {
      var that = this,
          selected_ids = [];
      var total_sel = 0;
      var selectedItemJson = [];

      //循环所有店铺
      if (!that.$.isNull(data.items) && data.items.length > 0) {
        var isckall = true;
        var total = 0;

        for (var store_item_index in data.items) {
          //第一个店铺
          //var cart_items = data.items[0].items, i = 0, s = cart_items.length;
          var cart_items = data.items[store_item_index].items,
              s = cart_items.length;
          var i = 0;

          data.items[store_item_index].cart_select = true;

          for (var item in cart_items) {
            //按照item计算 i
            if (cart_items[item].cart_select) {
              i = i + cart_items[item].cart_quantity;
              selected_ids.push(cart_items[item].cart_id);

              selectedItemJson.push(cart_items[item].item_id + "|" + cart_items[item].cart_quantity + "|" + cart_items[item].cart_id);
            } else {
              isckall = false
              data.cart_select = false;
              data.items[store_item_index].cart_select = false;
            }
          }

          total = total + i;
        }

        data.Total = total;

        that.setData({
          select_cart_ids: selected_ids,
          selectedItemJson: selectedItemJson
        });


        this.setData({
          isckall: isckall
        })

        this.setData({
          isdata: true
        })
      } else {
        this.setData({
          isdata: false
        })
      }

      return data;
    },

    //店铺全选
    ckStore: function (e) {
      var param = {
            action: 'store',
            store_id: e.currentTarget.dataset.id,
            cart_select: e.currentTarget.dataset.isck ? false : true
          },
          that = this;

      //发送购物车请求
      that.$.request({
        url: this.Config.URL.cart.sel,
        data: param,
        method: "POST",
        success: function (data, status, msg, code) {
          that.getCartList()

          if (200 != status) {
            that.$.confirm(msg);
          }
        }
      });
    },

    //单品选中
    ckItem: function (e) {
      var param = {
            cart_id: e.currentTarget.dataset.id,
            cart_select: e.currentTarget.dataset.isck ? false : true
          },

          that = this;

      //发送购物车请求
      that.$.request({
        url: this.Config.URL.cart.sel,
        data: param,
        method: "POST",
        success: function (data, status, msg, code) {
          that.getCartList()

          if (200 != status) {
            that.$.confirm(msg);
          }
        }
      });
    },

    //全选
    ckAll: function (e) {
      var param = {
            action: 'all',
            cart_select: !e.currentTarget.dataset.isck
          },
          that = this;

      //发送购物车请求
      that.$.request({
        url: this.Config.URL.cart.sel,
        data: param,
        method: "POST",
        success: function (data, status, msg, code) {
          that.getCartList()

          if (200 != status) {
            that.$.confirm(msg);
          }
        }
      });
    },

    sub: function (e) {
      let that = this;
      var t = {
        btntype: 2,
        numval: e.currentTarget.dataset.num,
        CID: e.currentTarget.dataset.cid,
        stock: e.currentTarget.dataset.stock,
        skuId: e.currentTarget.dataset.skuid,
        userId: e.currentTarget.dataset.userid
      };

      if (t.numval == 1) {
        that.$.showModal({
          title: that.__("提示"),
          content: that.__("确认要删除这个商品吗？"),
          success: function (n) {
            if (n.confirm) {
              that.unifiedNum(t)
            }
          }
        })
      } else {
        that.unifiedNum(t)
      }
    },

    add: function (e) {
      let that = this;

      var t = {
        btntype: 1,
        numval: e.currentTarget.dataset.num,
        CID: e.currentTarget.dataset.cid,
        stock: e.currentTarget.dataset.stock,
        skuId: e.currentTarget.dataset.skuid,
        userId: e.currentTarget.dataset.userid
      };

      if (t.numval >= t.stock) {
        that.$.alert(that.__('不能再加了'));
        return;
      }

      this.unifiedNum(t)
    },

    writenum: function (e) {
      var t = {
        btntype: 3,
        numval: e.detail.value,
        CID: e.currentTarget.dataset.cid,
        stock: e.currentTarget.dataset.stock,
        skuId: e.currentTarget.dataset.skuid,
        userId: e.currentTarget.dataset.userid
      };
      this.unifiedNum(t)
    },
    unifiedNum: function (e) {

      var num_obj = {
        value: parseInt(e.numval),
        stock: parseInt(e.stock)
      };
      var flagObj = {
        btntype: e.btntype,
        skuId: e.skuId,
        userId: e.userId
      };
      e.btntype == 1 && (num_obj.value = num_obj.value + 1);
      e.btntype == 2 && (num_obj.value = num_obj.value - 1);

      num_obj.value > num_obj.stock && (num_obj.value = num_obj.stock);

      //num_obj.value <= 0 && (num_obj.value = 1);

      var param = {
        //store_id: this.shopInfo.store_id,
        cart_id: e.CID,
        cart_quantity: num_obj.value
      };

      var that = this;
      flagObj.cart_quantity = num_obj.value;
      //发送购物车请求
      that.$.request({
        url: this.Config.URL.cart.quantity,
        data: param,
        method: "POST",
        success: function (data, status, msg, code) {
          that.getCartList(flagObj)
		  
		  if (200 != status) {
		    that.$.confirm(msg);
		  }
        }
      });
    },
    // 获取购物车信息
    getCartList: function (flagObj) {
      let that = this;
      let param = {};

      this.$store.dispatch(`getCartList`, function (data) {
        data = that.ckalllength(data);
        that.setData({
          cartlist: data,
          loadComplete: true
        });

        that.setCartNum(data.Total);
        that.showCartNum();

        that.$.stopPullDownRefresh()
      })
 
    },
    removestart: function (e) {
      this.setData({
        X_Start: e.touches[0].pageX
      })
    },
    removeload: function (e) {
      this.setData({
        X_End: e.touches[0].pageX
      })
    },
    removeend: function (e) {
      this.setData({
        X_End: e.mp.changedTouches[0].pageX
      });
      this.direction(e.currentTarget.dataset.id)
    },
    direction: function (e) {

      var t = {
        xstart: this.X_Start,
        xend: this.X_End
      };

      if (t.xstart > t.xend) {
        if (t.xstart - t.xend > 100) {
          this.setData({
            T_Id: e
          })
        }
      } else {
        this.setData({
          T_Id: 0
        })
      }

    },


    pressDelCart: function (e) {
      var that = this;
      e.currentTarget.dataset.id;

      let itemList = [that.__('删除')]

      uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
          if (res.tapIndex == 0) {
            that.delcart(e);
          } else {
          }
        }
      })

    },

    // 删除购物车商品
    delcart: function (e) {
      var that = this;
      that.$.showModal({
        title: that.__("提示"),
        content: that.__("确认要删除这个商品吗？"),
        success: function (n) {
          if (n.confirm) {
            var param = {
              cart_id: e.currentTarget.dataset.id
            };
            that.$.request({
              url: that.Config.URL.cart.remove,
              data: param,
              method: "POST",
              success: function (data) {
                that.getCartList()
              }
            });
          }
        }
      })
    },
    // 结算
    submitOrder: function () {
      let that = this;
      that.selectedItemJson.length > 0 ? that.$.navigateTo({
        url: "/pagesub/checkout/checkout?cart_id=" + that.selectedItemJson.join(",")
      }) : that.$.showModal({
        title: that.__("提示"),
        content: that.__("请选择需要结算商品！"),
        showCancel: false
      })
    },
    // 删除所有商品
    delAll: function () {
      var that = this;
      that.select_cart_ids.length <= 0 ? that.$.confirm(that.__("请选择需要删除的商品！")) : that.$.confirm(that.__("是否删除选中商品？"), function (t) {
            if (t.confirm) {
              var param = {
                cart_id: that.select_cart_ids.toString()
              };
              that.$.request({
                url: that.Config.URL.cart.removeBatch,
                data: param,
                method: "POST",
                success: function (data) {
                  that.getCartList()
                }
              });
            }
          },
          true)
    },

    closesp: function () {
      var that = this;
      that.setData({
        selectct: 0,
        flag: false
      }), setTimeout(function () {
            that.setData({
              selectsp: 0
            })
          },
          1e3)
    },

    RefreshCart: function (e) {
      this.getCartList();
    },


  }
}
</script>


<style lang="scss">
@import "../../styles/_variables.scss";

.m-product-all {
  padding: 24rpx;
}

.m-product-list {
  background-color: #fff;
  border-radius: 20rpx;

  padding-top: 10rpx;
}

/*店铺信息 start*/

.m-store:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  //border-bottom: 1px solid #ebebe7;
  color: #ebebe7;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.m-store {
  height: 100rpx;
  border-bottom: 0rpx solid #e3e3e3;
  position: relative;
  overflow: hidden;
}

.m-store-c {
  position: absolute;
  height: 100%;
  width: 850rpx;
}

.m-store-ck {
  float: left;
  width: 60rpx;
  height: 100%;
  position: relative;

  padding-left: 0rpx;
}

.m-store-ck icon,
.m-store-ck .uni-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -40rpx;
  margin-left: -20rpx;
}

.m-store-info {
  height: 100rpx;
  line-height: 100rpx;
  width: 538rpx;
  float: left;
  box-sizing: border-box;
  position: relative;

  padding-left: 14rpx;
}

/*.m-store-info::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 1rpx;border-bottom: 1rpx solid #e3e3e3;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}*/


.pre-info-price {
  height: 18rpx!important;;
  font-size: 12px!important;
  color: #b0b0b0!important;
  margin: 0 0 0 10rpx!important;
}


.m-act-img {
  width: 100rpx;
  height: 100rpx;
}


.m-item-act {
  position: relative;
  height: 100%;
  width: 850rpx;
  height: 100rpx;
}


.act-item-name {
  width: 360rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.m-act-change {
  float: right;
  width: 100rpx;
  background-color: #fff;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  position: absolute;
  font-size: 28rpx;
  top: 0rpx;
  right: 100rpx;
  color: #888;
  text-align: center;
}

/*选择规格遮罩 start*/
.m-panel-sp {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.2)
}

.m-panel-sp-content {
  background-color: #fff;
  position: absolute;
  width: 100%;
  bottom: 0;
  box-shadow: 0px -10rpx 15rpx rgba(0, 0, 0, 0.35);
}

.m-panel-sp-pinfo {
  height: 80rpx;
  box-sizing: border-box;
  padding: 20rpx;
  position: relative;
}

.m-panel-sp-pimg {
  width: 100rpx;
  height: 100rpx;
  background-color: #fff;
  border-radius: 8rpx;
  box-sizing: border-box;
  padding: 10rpx;
  box-shadow: 0px 0rpx 10rpx rgba(0, 0, 0, 0.35);
  float: left;
}

.m-panel-sp-pimg image {
  width: 100%;
  height: 100%;
}

.m-panel-sp-pname {
  padding-left: 20rpx;
  width: 580rpx;
  /*float:right;*/
  font-size: 28rpx;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  margin-top: 6rpx;
}

.m-panel-sp-pname .m-pprice {
  color: $default-skin-bg;
  font-size: 32rpx;
  line-height: 50rpx;
  font-weight: bold;
}

.m-panel-sp-icon {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}

/* .m-panel-sp-listbox{height: 604rpx;} */
.m-panel-sp-listbox-item {
  height: 130rpx;
  border-top: 1rpx solid #e3e3e3;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
}

/*选择规格遮罩 end*/


.u-cart-num {
  position: relative;

  z-index: 2;
  margin-top:12rpx;
}

.m-cart-ck {
  float: left;
  width: 48rpx;
  //background-color: #fff;
  height: 100%;
  position: relative;
  padding-left: 0rpx;

  margin:auto 6rpx auto 14rpx
}

.m-cart-ck icon,
.m-cart-ck .uni-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -46rpx;
  margin-left: -20rpx;
}

.uniui-circle-filled {
  font-size: 24px;
}

.m-product-info {
  width: 440rpx;
  height: auto;
}

.m-product-info::before {
  border: none;
}

.m-product-item::before {
  content: "";
  border: none;
}

.m-product-item:last-child::after {
  content: "";
  border: none;
}

.m-product-item:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  //border-bottom: 1px solid #ebebe7;
  color: #ebebe7;
  /*transform-origin: 0 100%;*/
  transform: scaleY(0.5);
}

.m-product-item {
  border-bottom: 0rpx solid #e3e3e3;
  position: relative;
  overflow: hidden;
  height: auto;
}

.m-item-c {
  position: relative;
  height: 100%;
  width: 850rpx;
  //height: 212rpx;
}

.u-del {
  width: 100rpx;
  background-color: $default-skin-bg;
  float: right;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  display: flex;

  .u-del-btn {
    margin:auto;
  }
}

/*底部按钮 start*/

.m-footer-btn:before {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #ebebe7;
  color: #ebebe7;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.m-footer-btn {
  height: 112rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border-top: 0rpx solid #e3e3e3;
  z-index: 3;

  display: flex;
}

.m-footer-btn-list {
  width: 75%;
  height: 100%;
  position: relative;
  float: left;
}

.m-footer-btn-item {
  position: relative;
  float: left;
  width: 30%;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
  padding: 15rpx 0;
  box-sizing: border-box;
  height: 100%;
}

.m-footer-btn-main {
  width: 25%;
  height: 100%;
  float: left;
  background: $default-skin-bg;
  color: #fff;
  font-size: 32rpx;
  text-align: center;

  border-radius: 9px;
  line-height: 80rpx;
  height: auto;

  text-align: center;
  margin: auto;
  margin-right: 20rpx;

}

.m-cart-total {
  text-align: right;
  padding-right: 24rpx;
  width: 70%;
}

.m-cart-total text {
  font-size: 16px;
  color: $default-skin-bg;
}

.m-cart-total label {
  color: $default-skin-bg;
}

.m-cart-del {
  line-height: 70rpx;
  font-size: 32rpx;
  display: initial;
}

/*底部按钮 end*/
.del {
  -webkit-animation: mdel .2s 1;
  animation: mdel .2s 1;
  left: -100rpx;
}

@-webkit-keyframes mdel {
  0% {
    left: 0;
  }

  100% {
    left: -100rpx;
  }
}

@keyframes mdel {
  0% {
    left: 0;
  }

  100% {
    left: -100rpx
  }
}

view {
  font-size: 28rpx;
  line-height: 2;
}

.m-product-name {
  line-height: 40rpx;
  font-size: 13px;
}

.m-product-item {
  padding: 0;
  margin-top: 0;
  display: block;
  background-color: transparent;
}

.m-product-img {
  image {
    padding: 14rpx;
  }
}

.m-act-img {
  width: 212rpx;
  height: 100rpx;

  image {
    width: 100rpx;
    height: 100rpx;
  }
}

.m-product-box{
  display: flex;
}

.m-product-price {
  line-height: 74rpx !important;
  flex:1;
}

.off-shelf-img {
  width: 100rpx;
  height: 100rpx;
  float: right;
  position: absolute;
  right: 100rpx;
  z-index: 3;
}

.off-shelf-simg {
  width:100rpx;height:100rpx;
  float: right;
  position: absolute;

  z-index: 3;
  right: -16rpx;
  top: -10px;
}

.m-footer-btn-list {
  .m-cart-ck {
    line-height: 24px;
    margin-top: 24rpx;
    margin-left: 10rpx;
  }
}


.u-num-btn {
  width: 52rpx;
  line-height: 56rpx;
  height: 56rpx;
}

.u-cart-num {
  width: 160rpx;
}
</style>
