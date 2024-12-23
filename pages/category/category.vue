<template>
  <view class="page">
    <status-bar></status-bar>

    <search-box  @click="onSearch"></search-box>
    <view class="categroy-list" style="position: absolute;margin-top:90rpx;" v-if="!langStandard">
      <view>
        <uni-collapse ref="add" class="warp" @change="change(aid)" v-for="(val, aid) in categorySecondTree" :key="aid">
          <uni-collapse-item :title="val.category_name" open="true">
            <template v-if="(categorySecondTree.length > 0)">
              <uni-list>
                <view v-for="(cate, pi) in val.children" :key="pi">
                  <uni-list-item v-if="(cate.category_is_enable == 1)" :key="pi" :title="(cate.category_name)" thumb=""
                                 @click="goto(cate.category_id,val.category_id,val.category_name)"/>
                </view>
              </uni-list>
            </template>
          </uni-collapse-item>
        </uni-collapse>
      </view>
      <view style="width:100%;height:100rpx;"></view>
    </view>

    <view class="main" style="z-index: 100px;" v-else>
      <view class="page-body">
        <scroll-view class="categroy-left" scroll-y>
          <view v-if="false" data-id="brand" data-index="-2"
                @click="switchTab"
                :class="{'cate-list uni-ellipsis':1, on:(curIndex === -2)}">{{ __('品牌推荐') }}
          </view>
          <view v-for="(item, category_index) in categoryFirst" :key="category_index" :data-id="(item.category_id)"
                :data-index="(category_index)"
                @click="switchTab"
                :class="{'cate-list uni-ellipsis':1, on:(curIndex === category_index)}">{{ item.category_name }}
          </view>
        </scroll-view>

        <view class="categroy-right">
          <view :class="curIndex==0 ? 'categroy-right-box categroy-right-box-first' : 'categroy-right-box'">
            <block v-if="category_deep == 2">
              <view style="white-space: nowrap;overflow-y:auto;" class="right-cate-list">
                <label :class="['m-category-list', currentCid == categoryId ? 'active': '']" :data-id="categoryId"
                       @click="listProduct">{{ __('全部') }}</label>
                <label :class="['m-category-list', currentCid == item.category_id ? 'active': '']"
                       :data-id="item.category_id"
                       @click="listProduct" v-for="(item, index) in categorySecondTree"
                       :key="index">{{ item.category_name }}</label>
              </view>
            </block>
            <scroll-view :class="['categroy-right-scroll', category_deep == 2 ? 'categroy-right-scroll-deep2' : '']" scroll-y @scrolltolower="scrollbottom" :scroll-top="scrollTop"
                         @scroll="scroll" scroll-with-animation="true">
              <block v-if="category_deep == 2">
                <!--301模板-->
                <product-list ref="productList" :uniId="ptConfig.uniId" :isFilterFixed="ptConfig.isFilterFixed"
                              :isShowFilter="ptConfig.isShowFilter" :isShowLoading="ptConfig.isShowLoading"
                              :options="ptConfig.options" :viewtype="ptConfig.viewtype" :titleText="ptConfig.titleText"
                              :titleColor="ptConfig.titleColor" :bgColor="ptConfig.bgColor"
                              :paddingLeft="ptConfig.paddingLeft" :paddingRight="ptConfig.paddingRight"
                              :css="ptConfig.css"></product-list>
                <!--301模板-->

                <div style="height: 1px;"></div>
              </block>
              <block v-if="category_deep == 1">
              <!--301模板-->
              <product-list v-if="category_deep == 1" ref="productList" :uniId="ptConfig.uniId"
                            :isFilterFixed="ptConfig.isFilterFixed" :isShowFilter="ptConfig.isShowFilter"
                            :isShowLoading="ptConfig.isShowLoading" :options="ptConfig.options"
                            :viewtype="ptConfig.viewtype" :titleText="ptConfig.titleText"
                            :titleColor="ptConfig.titleColor" :bgColor="ptConfig.bgColor"
                            :paddingLeft="ptConfig.paddingLeft" :paddingRight="ptConfig.paddingRight"
                            :css="{paddingTop:'20rpx'}"></product-list>
              <!--301模板-->
            </block>
            <block v-else-if="category_deep == 3 && categorySecondTree.length > 0">
                <!--上级分类 全部-->
                <div v-if="false && curIndex !== -2 && categorySecondTree.length > 0" style="margin: 10px;">
                  <navigator
                      :url="'/pagesub/product/list?category_id=' + (categoryFirst[curIndex].category_id) + '&cname=' + (categoryFirst[curIndex].category_name) + '&page_id=' + (categoryFirst[curIndex].page_id)"
                      class="m-cell m-cell-access" style="padding:30rpx 44rpx 10rpx">
                    <view class="m-cell-bd m-cell-primary">
                      <p>{{ __('全部分类') }}</p>
                    </view>
                    <text class="m-cell-ft"></text>
                  </navigator>
                </div>

                <block v-for="(item, category_order) in categorySecondTree" :key="category_order">
                  <div v-if="curIndex !== -2" class="category-box">
                    <navigator
                        :url="'/pagesub/product/list?category_id=' + (item.category_id) + '&cname=' + (item.category_name) + '&page_id=' + (item.page_id)"
                        class="m-cell m-cell-access" style="margin-top: 0rpx;">
                      <view class="m-cell-bd m-cell-primary">
                        <p>{{ item.category_name }}</p>
                      </view>
                      <text class="m-cell-ft"></text>
                    </navigator>

                    <view class="category3-list" v-for="(val, pi) in item.children" :key="val.category_id">
                      <navigator
                          :url="'/pagesub/product/list?category_id=' + (val.category_id) + '&cname=' + (val.category_name) + '&page_id=' + (val.page_id)">
                        <image lazy-load :src="(val.category_image)"></image>
                        <view class="classname uni-ellipsis"
                              style="height:40rpx;display: inherit;white-space:inherit;word-break:break-all;line-height:1.5;">
                          <text>{{ val.category_name }}</text>
                        </view>
                      </navigator>
                    </view>
                    <br>
                  </div>
                  <block v-else>
                    <view class="product-list" v-for="(brand, inx) in item.items" v-bind:key="brand.id">
                      <navigator
                          :url="'/pagesub/product/list?brand_id=' + (brand.brand_id) + '&cname=' + (brand.brand_name) + '&page_id=' + (brand.page_id || 0)">
                        <image lazy-load :src="(brand.brand_image)" style="width:140rpx;height:140rpx;"></image>
                        <view class="classname text-overflow uni-ellipsis">
                          <text>{{ brand.brand_name }}</text>
                        </view>
                      </navigator>
                    </view>
                  </block>
                </block>
                <div style="height: 1px;"></div>
              </block>

            </scroll-view>
          </view>
        </view>
      </view>
    </view>

    <view class="u-top">
      <movable-area class="movableArea">
        <movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
          <image src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_gotop.png'
                 :class='(isQuickNav?"quicknav":"hide")' @tap="returnTop"></image>
        </movable-view>
      </movable-area>
    </view>
  </view>

</template>


<script>
import statusBar from '../../components/status-bar.vue'
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'


import {mapMutations, mapState} from 'vuex'
import ProductList from "../../components/product-list";
import SearchBox from "../../uni_modules/search-box/components/search-box/search-box";

let scrollTimeout = null

export default {
  data: function () {
    return {
      height: 0,
      categoryActive: 0,
      scrollTop: 0,
      categoryFirst: [], //默认一级分类
      categorySecondTree: [],
      curIndex: 0,// 一级分类Index
      categoryId: 0, // 一级分类编号
      category_deep: false, // false| 1| 2| 3，当前一级分类这个分支是几级分类，false为不确定
      currentCid: -1, //当前选中分类
      langStandard: true,

      initX: '690',
      initY: '1336',

      w: 0,
      screenHeight: 0,
      oldscposition: 0,
      isQuickNav: false,

      opacity: 1,
      background: "f1f1f1",
      toView: 0,

      ptConfig: {
        uniId: 'category',
        isFilterFixed: false,
        isShowFilter: false,
        isShowLoading: true,
        options: {},
        viewtype: 0,
        titleText: '',
        titleColor: '',
        bgColor: '',
        paddingLeft: 0,
        paddingRight: 0,
        css: {paddingTop:"0rpx"},
      }
    }
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  components: {
    SearchBox,
    ProductList,
    statusBar,
    uniCollapse,
    uniCollapseItem,
    uniList,
    uniListItem
  },
  mounted() {
    let view = uni.createSelectorQuery().in(this).select(".movableArea");
    let that = this;

    view.fields({
      size: true,
      scrollOffset: true
    }, data => {
      if (data) {
        that.setData({
          initX: data.width,
          initY: data.height - 100,
        });
      }
    }).exec();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    uni.setNavigationBarTitle({
      title: this.__('分类')
    });

    var w = that.$.getSystemInfoSync().windowWidth;
    //that.langStandard = that.Lang.standard;
    that.categoryId = options.category_id
    that.w = w

    that.$.getSystemInfo({
      success: function (t) {
        that.setData({screenHeight: t.screenHeight})
      }
    });
  },


  onReady() {
    var that = this;

    this.height = uni.getSystemInfoSync().windowHeight;

    //初始化，默认读取一级分类
    if (that.langStandard) {
      const params = {size: 500}
      that.$.request({
        url: that.Config.URL.pt.listCategory,
        loading: false,
        data:params,
        ajaxCache: {
          timeout: that.Config.CACHE_EXPIRE
        },
        success(data) {
          that.setData({
            categoryFirst: data.items
          })

          that.setData({
            categoryId: that.categoryFirst[that.curIndex].category_id
          });

          if (that.langStandard) {
            that.loadCategoryTree(that.categoryId)
          }

        }
      });
    } else {
      that.loadCategoryTree(that.categoryId)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showCartNum();
  },

  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),

    switchTab(e) {
      this.setData({
        toView: e.target.dataset.id,
        curIndex: parseInt(e.target.dataset.index),
        // categorySecondTree: [],
        currentCid: e.target.dataset.id,//e.target.dataset.id,
        //category_deep: false,
      })

      if (this.curIndex == -2) {
        this.loadBrand(e.target.dataset.id)
      } else {
        this.categoryId = e.target.dataset.id
        this.loadCategoryTree(this.categoryId)
      }
    },
    listProduct(e) {
      let that = this;
      let categoryId = e.target.dataset.id;

      if (categoryId == 0) {
        categoryId = that.categoryId
      }

      that.setData({
        currentCid: categoryId
      });

      //设置商品请求数据
      that.ptConfig.options = {
        category_id: categoryId
      }
    },
    doNothing() {
    },

    loadCategoryTree(category_id) {
      var that = this;

      that.$.request({
        url: that.Config.URL.pt.treeCategory,
        data: {
          category_parent_id: category_id
        },
        ajaxCache: {
          timeout: that.Config.CACHE_EXPIRE
        },
        success(data) {
          //data 即为 tree
          if (data.length == 0) {
            //去读取商品接口 一级分类
            let e = {target: {dataset: {id: category_id}}}
            that.listProduct(e)
            that.category_deep = 1;
          } else {
            //计算category_deep
            let category_deep = that.getCategoryLevel(data)

            that.setData({
              categorySecondTree: data,
              category_deep: category_deep,
            });

            if (that.category_deep == 2) {
              //去读取商品接口
              let e = {target: {dataset: {id: category_id}}}
              that.listProduct(e)
            }
          }

          that.returnTop()
        }
      });
    },

    scroll: function (t) {
      let that = this;

      that.setData({oldscposition: t.detail.scrollTop});

      if (100 < t.detail.scrollTop) {
        that.setData({opacity: 1, background: "f8f8f8"});
      } else {
        that.setData({
          opacity: 0,
          background: "fff"
        })
      }
      if (t.detail.scrollTop >= this.screenHeight) {
        this.setData({isQuickNav: true})
      } else {
        this.setData({isQuickNav: false})
      }
    },

    scrollbottom: function (e) {
      var that = this;
      uni.$emit('diy-scrollbottom', {uniId: that.ptConfig.uniId})
    },

    returnTop: function () {
      let that = this;
      //视图会发生重新渲染
      that.scrollTop = that.oldscposition
      //当视图渲染结束 重新设置为0
      that.$nextTick(() => {
        that.scrollTop = 0
      });
      this.setData({isQuickNav: false})
    },

    loadBrand(category_id) {
      return

      var that = this;
      that.$.request({
        url: that.Config.URL.product.brand,
        data: {},
        ajaxCache: {
          timeout: that.Config.CACHE_EXPIRE
        },
        success(data) {
          that.setData({
            categorySecondTree: data.items,
          })
        }
      });
    },

    goto: function (e, r, t) {
      uni.navigateTo({
        url: '/pagesub/product/list?category_id=' + e + '&parent_id=' + r + '&cname=' + t
      });
    },
    change(e) {
      if (!this.categorySecondTree[e].children.length) {
        uni.navigateTo({
          url: '/pagesub/product/list?category_id=' + this.categorySecondTree[e].category_id + '&cname=' + this.categorySecondTree[e].category_name
        });
      }
    },
    onSearch(e) {
      let that = this;
      that.$.gopage("/pagesub/search/search");
    },
    getCategoryLevel(tree) {
      //从第二级读取的， 只判断第二级是否有子级别
      let lv = 2;

      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children.length > 0) {
          lv = lv + 1;

          return lv;
        }
      }

      return lv;
    },
  }

}

</script>

<style lang="scss">
@import "../../styles/_variables.scss";

page {
  background-color: #fff !important;
}


.page {
  background-color: #fff !important;
}

uni-page-body {
  background-color: #fff !important;
  min-height: 100% !important;
  height: 100% !important;
}

.page-body {
  display: flex;
}


.top {
  width: 100%;
  height: 82rpx;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  position: fixed;
  z-index: 99;
  line-height: 82rpx;

}

.top-left {
  margin-top: 16rpx;
  float: left;
}

.top-left img {
  width: 40rpx;
  height: 52rpx;
}

.b-left {
  float: left;
  margin-top: -4rpx;

}

.b-left image {
  width: 40rpx;
  height: 40rpx;
  margin-top: 14rpx;
  margin-left: 20rpx
}


.top-right {
  width: 50rpx;
  height: 52rpx;
  margin-right: 24rpx;
  margin-top: 14rpx;
  float: right;
}

.top-right image {
  width: 50rpx;
  height: 52rpx;
}

.top-right view {
  width: 50rpx;
  height: 30rpx;
  font-size: 24rpx;
  position: absolute;
  margin-top: -62rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 30rpx;
  text-align: center;

}

.categroy-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.uni-collapse:before {
  height: 0;
}


.input-view {
  display: flex;
  background-color: #ffffff;
  height: 88rpx;
  //padding: 14rpx 4%;
  flex-wrap: nowrap;
  line-height: 60rpx;
}

.input-view .uni-icon {
  line-height: 60rpx !important;
}

.input-view .input {
  height: 60rpx;
  line-height: 60rpx;
  width: 94%;
  padding: 0 3%;
}


//for ZH

/* .main{
  margin-bottom:var(--window-bottom)
} */

.categroy-left {
  position: absolute;
  // #ifndef APP || MP
  top: calc(60rpx + 14rpx + 14rpx + 50rpx);
  // #endif
  // #ifdef APP || MP
  top: calc(60rpx + 14rpx + 14rpx + 50rpx + var(--status-bar-height) - 6rpx);
  // #endif
  bottom: 0;
  z-index: 1;
  width: 20%;
  box-sizing: border-box;

  background-color: #fff;
}

.categroy-left .cate-list {
  text-align: center;
  /*border-left: 3px solid #eee;*/
  border-right: 0px solid #fff;
  /*background-color: #eee;*/

  white-space: normal;
  height: 100rpx;
  line-height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.categroy-left .cate-list.on {
  color: $default-skin-bg-active;
  border-color: $default-skin-bg-active;
  border-top: 0px solid #fff;
  border-bottom: 0px solid #fff;
  border-right: 0px solid #fff;
  background-color: #f5f5f5;

  font-weight: bold;
  font-size: 14px;
}

.categroy-right {
  z-index: 1;
  width: 100%;
  left: 20%;
  height: auto;
  overflow: hidden;
  position: absolute;
  // #ifndef APP || MP
  top: calc(60rpx + 14rpx + 14rpx + 50rpx);
  // #endif
  // #ifdef APP || MP
  top: calc(60rpx + 14rpx + 14rpx + 50rpx + var(--status-bar-height) - 6rpx);
  // #endif
  bottom: 0;

  .categroy-right-box{

    width: 80%;
    height: auto;
    overflow: hidden;
    position: absolute;
    background-color: #f5f5f5;
    border-radius: 10px;
    top:0;
    bottom: 0;
  }

  .categroy-right-box-first{
    border-radius: 0px;
  }

  .right-cate-list {
    margin-left: 20rpx;
    margin-right: 20rpx;
    margin-top: 20rpx;
    background-color: #fff;
    border-top-left-radius: 10rpx;
    border-top-right-radius: 10rpx;

    padding: 10rpx;
  }
}


.categroy-right-scroll {
  z-index: 1;
  width: calc(100% - 20rpx);
  height: calc(100% - 0rpx);
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;

  border-radius: 10px;

  padding-left: 10rpx;
  padding-right: 10rpx;
}

.categroy-right-scroll-deep2{
  height: calc(100% - 60rpx);
}

.cate-box {
  /*height: 100%;*/
  /*padding:40rpx;*/
  box-sizing: border-box;
}

.cate-box .cate-banner image {
  display: block;
  width: 100%;
  height: 190rpx;
}

.cate-title {
  position: relative;
  height: 50rpx;
  line-height: 50rpx;
  padding: 30rpx 0 30rpx;
  text-align: center;
  color: $default-skin-bg-active;
  font-size: 28rpx;
}

.cate-title::before {
  position: absolute;
  left: 100rpx;
  top: 43rpx;
  content: '';
  width: 70rpx;
  height: 4rpx;
  background: $default-skin-bg-active;
}

.cate-title::after {
  position: absolute;
  right: 100rpx;
  top: 43rpx;
  content: '';
  width: 70rpx;
  height: 4rpx;
  background: $default-skin-bg-active;
}

.category-level-2 {
  color: lighten($default-skin-bg-active, 13.5%)
}


.category3-list {
  display: inline-block;
  width: 176rpx;
  /*height: 160rpx;*/
  text-align: center;
  margin: 0 0rpx 0rpx 0;
  padding: 10rpx 2rpx 10rpx 8rpx;

  font-size: 24rpx;
  vertical-align: top;
}

.category3-list image {
  width: 108rpx;
  height: 108rpx;
  margin-bottom: 10rpx;
}

.category3-list:nth-child(3n) {
  margin-right: 0;
}

/*
.product-list {
  display: inline-block;
  width: 160rpx;

  text-align: center;
  margin: 0 0rpx 0rpx 0;
  padding: 10rpx;

  font-size: 24rpx;
  vertical-align: top;
}

.product-list image {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 10rpx;
}

.product-list:nth-child(3n) {
  margin-right: 0;
}
*/

.uni-ellipsis {
  font-size: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: pre-wrap
}

/* 分类子级内容 */
.categroy-parent {
  background-color: transparent;
  margin-top: 14px;
  margin-bottom: 14px;
}

.categroy-parent navigator {
  position: relative;
  display: block;
  font-size: 0.545rem;
  line-height: 1.6rem;
  height: 1.6rem;
  color: #6d6d6d;
  text-align: center;
}

.categroy-parent navigator:after {
  content: "";
  border-bottom: 1px solid #ddd;
  position: absolute;
  left: 15%;
  right: 15%;
  top: 45%;
}

.categroy-parent navigator label {
  display: inline-block;
  position: relative;
  z-index: 2;
  padding: 0 10rpx;
  background: #f2f2f2;
  font-size: 26rpx;
}

/*
.categroy-right .categroy-parent:nth-child(1) navigator label {
  background-color: #ff6700;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(2) navigator label {
  background-color: #AC92ED;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(3) navigator label {
  background-color: #4FC0E8;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(4) navigator label {
  background-color: #A0D468;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(5) navigator label {
  background-color: #48CFAE;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(6) navigator label {
  background-color: #EC87BF;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(7) navigator label {
  background-color: #FFCE55;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(8) navigator label {
  background-color: #5D9CEC;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(9) navigator label {
  background-color: #FB6E52;
  color:#fff;
}

.categroy-right .categroy-parent:nth-child(10) navigator label {
  background-color: #AAB2BD;
  color:#fff;
}
*/


/*全部商品 start*/
.m-navbar-item {
  padding: 20rpx 0;
  font-size: 24rpx;

  i {
    font-size: 0rpx;
    line-height: 0;
    vertical-align: middle;
    display: inline-block;
    width: 0rpx;
    height: 0rpx;
    margin-left: 9.375rpx;
    border-width: 9.375rpx;
    border-color: #aaa transparent transparent transparent;
    border-style: solid dashed dashed dashed;
  }
}

.m-navbar-item:after {
  border: none;
}

.m-navbar-item.m-navbar-item-on {
  background-color: #fff;
  color: $default-skin-bg;

  i {
    border-color: $default-skin-bg transparent transparent;
  }
}

.m-navbar-item.m-navbar-item-on::before {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 6rpx;
  border-bottom: 6rpx solid $default-skin-bg;
  color: #cccccc;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 3;
}

.m-sort {
  position: relative;
}

.m-sort image {
  width: 24rpx;
  height: 24rpx;
  position: absolute;
  /*top: 50%;*/
  margin-top: 10rpx;
  margin-left: 2rpx;
}

/*全部商品 end*/
.m-product-price1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.num {
  font-size: 24rpx;
  color: #717171;
  padding-right: 20rpx;
  /*margin-left:260rpx; */
}

.u-pa .m-tab {
  top: var(--window-top);
}

.filter-box {
  top: var(--window-top);
}

.tag-view {
  margin: 10rpx 20rpx;
  display: inline-block;
}

.uni-numbox-value {
  border: 2rpx solid #cccccc;
  background-color: #ffffff;
  width: 150rpx;
  height: 48rpx;
  text-align: center;
  display: inline-block;
}

.uni-dot {
  width: 30rpx;
  height: 100%;
  text-align: center;
  display: inline-block;
  line-height: 44rpx;
  height: 44rpx;
}

.uni-padding-wrap {
  overflow: hidden;
  max-width: 400rpx;
}


/*
.product-list {
  position: relative;
  z-index: 1;

  &:hover {
    z-index: 2;
  }

  .flag {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
    width: 64px;
    height: 20px;
    margin-left: -32px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    color: #fff;
  }

  .flag-reduction {
    background-color: #e50dbb;
    z-index: 8;
  }

  .flag-saleoff {
    background-color: #e53935;
    z-index: 7;
  }

  .flag-postfree {
    background-color: #ffac13;
    z-index: 6;
  }

  .flag-bargain {
    background-color: #ffac13;
    z-index: 4;
  }

  .flag-gift {
    background-color: #2196f3;
    z-index: 3;
  }

  .flag-new {
    background-color: #83c44e;
    z-index: 5;
  }

  .flag-selfsupport {
    background-color: #f44336;
    z-index: 10;

    position: absolute;

    top: 1px;
    right: 5px;
    left: auto;
    width: 40px;
  }
}
*/
.placeholder-class {
  font-size: 25rpx;
}

.button {
  line-height: 2;
  font-size: 34rpx;
}

.uni-common-mt {
  margin-top: 20rpx;
}


.city {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-left: 6rpx;
  white-space: nowrap;
}


.m-cell {
  padding: 32rpx 44rpx;

  p {
    height: 34rpx;
    font-size: 24rpx;
    font-weight: bold;
    line-height: 34rpx;
    color: #282F40;
  }

}

.m-category-list {
  display: inline-block;
  font-size: 24rpx;
  padding: 6rpx 15rpx;
  border-radius: 8rpx;
  margin: 10rpx;
  color: #888;
  border: 1rpx solid #d5d5d5;
}

.m-category-list.active {
  color: $default-skin-bg !important;
  border: 1rpx solid $default-skin-bg !important;
}

.m-cell-access .m-cell-ft:after {
  /*border-color: #c3c3c3;*/
  margin-top: -12rpx;

  //display: none;

}

.category-box {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.10);
  margin: 20rpx;
  border-radius: 20rpx;

  background-color: #fff;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.uni-scroll-view-content {
  .category-box:last-child {
  }
}
</style>
