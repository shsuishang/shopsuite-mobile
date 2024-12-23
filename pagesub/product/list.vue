<template>
  <view>
    <tp-search id="tp-search" class="tp-search" :search-text="options.pname" :placeholder="tpSearchPlaceholder" :style="tpSearchStyle" @change="search"></tp-search>
    <scroll-view scroll-y="true" class="m-product-all u-pa" @scrolltolower="scrollbottom" :scroll-top="scposition"
                @scroll="scroll" scroll-with-animation="true" :style="ptSearchStyle">
      <view class="fixPaddingTop" v-if="loadPageFlag">
        <diy id="diy" :BgConfig="BgConfig" :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav"
             :loadPageFlag="loadPageFlag"></diy>
      </view>

      <!--第七个模版-->
      <scroll-view scroll-x="true" v-if="cat_self.length>0 || cat_child.length>0"
                   :class="{'box-grids':1, 'box-grids-border':0, fixPaddingTop:!loadPageFlag}">
        <view>
          <!-- 当前分类 -->
          <view :class="{'box-grid':1, 'box-grid-border':0}" v-for="(items, ii) in cat_self"
                :key="items.id"
                :style="{width:((100/5))+'%','padding-top':(10)+'px','padding-bottom':(10)+'px','padding-left':(10)+'px','padding-right':(10)+'px','background-color':'transparent'}"
                @click="onCategory(items.category_id)">
            <view class="box-grid-icon">
              <image lazy-load :src="($.img(items.category_image, 80,  80))"></image>
            </view>
            <label class="box-grid-label">{{ items.category_name }}</label>
          </view>

          <!-- 子分类 -->
          <view :class="{'box-grid':1, 'box-grid-border':0}" v-for="(items, ii) in cat_child"
                :key="items.id"
                :style="{width:((100/5))+'%','padding-top':(10)+'px','padding-bottom':(10)+'px','padding-left':(10)+'px','padding-right':(10)+'px','background-color':'transparent'}"
                @click="onCategory(items.category_id)">
            <view class="box-grid-icon">
              <image lazy-load :src="($.img(items.category_image, 80,  80))"></image>
            </view>
            <label class="box-grid-label">{{ items.category_name }}</label>
          </view>
        </view>
      </scroll-view>
      <!--第七个模版-->

      <!--301模板-->
      <product-list v-if="loaded" ref="productList" :uniId="ptConfig.uniId" :isFilterFixed="ptConfig.isFilterFixed" :fix-top="ptConfig.topDistance"
                    :isShowFilter="ptConfig.isShowFilter" :isShowLoading="ptConfig.isShowLoading"
                    :options="ptConfig.options" :viewtype="ptConfig.viewtype" :titleText="ptConfig.titleText"
                    :titleColor="ptConfig.titleColor" :bgColor="ptConfig.bgColor" :paddingLeft="ptConfig.paddingLeft"
                    :paddingRight="ptConfig.paddingRight" :css="ptConfig.css"
                    :style="{backgroundColor: 'transparent'}"></product-list>
      <!--301模板-->
    </scroll-view>

    <view class="u-top-default">
    </view>

    <view class="u-top">
      <movable-area class="movableArea">
        <movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="returnPos.initX"
                      :y="returnPos.initY">
          <image src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_gotop.png'
                 :class='(isQuickNav?"quicknav":"hide")' @tap="returnTop"></image>
        </movable-view>
      </movable-area>
    </view>
  </view>
</template>


<script>
import uniDrawer from '@/components/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import diy from '@/components/themes/diy.vue'

import ProductList from "@/components/product-list";

import {mapMutations, mapState} from 'vuex';
import SearchBox from "@/uni_modules/search-box/components/search-box/search-box";
import TpSearch from "@/pagesub/components/tp-search/tp-search";

export default {
  data() {
    return {
      options: {},
      viewtype: 1,

      cat_self: [],
      cat_child: [],

      sort: 2,


      PageContent: [],
      BgConfig: {BackgroundObj: {type: 1, bgColor: '#ffffff', "pathColor": "#f8f8f8", "path": ""}},
      PageNav: {
        window: {
          "navigationBarBackgroundColor": "#ffffff",
          "navigationBarTextStyle": "black",
          "navigationBarTitleText": "",
          "backgroundColor": "#f8f8f8",
          "backgroundTextStyle": "dark"
        }
      },
      loadPageFlag: false,
      loaded: false,

      pageId: 0,

      shareImg: "",
      shareTitle: "",
      chatUrl: '',
      timer: null,


      ptConfig: {
        uniId: 'category',
        isFilterFixed: true,
        topDistance:44,
        isShowFilter: true,
        isShowLoading: true,
        options: {},
        viewtype: 1,
        titleText: '',
        titleColor: '',
        bgColor: '',
        paddingLeft: 0,
        paddingRight: 0,
        css: {padding: "0 10rpx"},
      },

      returnPos: {
        initX: '690',
        initY: '1336',
      },

      scposition: 0,
      screenHeight: 0,
      oldscposition: 0,
      isQuickNav: false,

      opacity: 1,
      background: "f1f1f1",

      ptSearchStyle:"z-index: 5;",
      tpSearchStyle:"z-index: 5;",
      tpSearchPlaceholder:"",
    };
  },

  components: {
    TpSearch,
    SearchBox,
    uniDrawer,
    uniTag,
    diy,
    ProductList
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
  mounted() {
    this.initReturnPos();

    uni.$on('onOpenFilter', data => {
      if (data) {
        this.tpSearchStyle = "z-index: 5;"
        this.ptSearchStyle = "z-index: 6;"
      } else {
        this.tpSearchStyle = "z-index: 6;"
        this.ptSearchStyle = "z-index: 5;"
      }
    })
  },
  async onLoad(options) {
    await this.$onLaunched;
    this.loaded = true;

    // #ifdef MP-WEIXIN || MP-ALIPAY
    this.ptConfig.topDistance = (this.statusBar - 5 + 44);
    // #endif


    uni.setNavigationBarTitle({
      title: this.__('商品列表')
    });

    var that = this;
    this.setData({options: options});

    this.pageId = options.page_id ? options.page_id : 0;

    that.$.setNavigationBarTitle({title: options.pname || options.cname || this.__('商品列表')});

    that.$.getSystemInfo({
      success: function (t) {
        that.setData({screenHeight: t.screenHeight})
      }
    });

    /*
        that.$.setNavigationBarColor({
            frontColor: that.PageNav.window.navigationBarTextStyle == "white" ? "#ffffff" : "#000000",
            backgroundColor: that.PageNav.window.navigationBarBackgroundColor
        });
     */

    var post = this.post;

    that.ptConfig.options = {
      store_id: options.store_id,
      sidx: 'product_sale_num',
      sort: 'DESC',
      keywords: options.pname,
      store_category_ids: options.store_category_id,
      category_id: options.category_id,
      brand_id: options.brand_id,
      product_tag_ids: options.tag_id ? [options.tag_id] : [],
      kind_id: options.kind_id,
      store_type: options.store_type,
      page: 1,

      product_unit_price_min: options.product_unit_price_min ? options.product_unit_price_min : '',
      product_unit_price_max: options.product_unit_price_max ? options.product_unit_price_max : '',

      sp_from: options.sp_from ? options.sp_from : '',
      sp_to: options.sp_to ? options.sp_to : '',

      points_from: options.points_from ? options.points_from : '',
      points_to: options.points_to ? options.points_to : '',

      virtual: options.virtual ? options.virtual : 0,
      activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
      contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
      market_category_ids: options.market_category_id ? [options.market_category_id] : [],
	  item_ids: options.item_ids ? options.item_ids : '',
      // assist: []
    }

    if (this.pageId) {
      //this.getPageInfo(false);
    }


    this.tpSearchPlaceholder = this.$.__('请输入商品名称')

    if (options.category_id && options.cname) {
      this.tpSearchPlaceholder = that.$.sprintf(this.$.__('请输入分类 %s 下商品名称'), options.cname)
    }
    // this.GetPlist(function() {
    //     that.pdlist.length == 0 ? that.setData({ isdata: false }) : that.setData({ isdata: true });
    // });
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    initReturnPos: function () {
      let view = uni.createSelectorQuery().in(this).select(".movableArea");
      let that = this;

      view.fields({
        size: true,
        scrollOffset: true
      }, data => {
        if (data) {
          that.returnPos.initX = data.width;
          that.returnPos.initY = data.height - 100;
        }
      }).exec();

      uni.$on('returnTop', function (data) {
        that.returnTop();
      })
    },
    getPageInfo: function (force_refresh) {
      var that = this;

      if (that.pageId <= 0) {
        return;
      }

      var params = {
        page_id: that.pageId
      };

      that.$.request({
        url: this.Config.URL.minipage,
        data: params,
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE,
          forceRefresh: force_refresh
        },
        success: function (data, status, msg, code) {
          that.$.stopPullDownRefresh();

          if (200 == status) {
            that.setData({
              loadPageFlag: true,
              pageId: data.page_id,
              PageContent: that.$.parseJSON(data.page_code),
              BgConfig: that.$.parseJSON(data.page_config),
              PageNav: that.$.parseJSON(data.page_nav),
              shareImg: data.page_share_image,
              shareTitle: data.page_share_title
            });

            if (that.PageNav.window.navigationBarTextStyle == 'black') {
              that.PageNav.window.navigationBarTextStyle = '#000000'
            }

            if (that.PageNav.window.navigationBarTextStyle == 'white') {
              that.PageNav.window.navigationBarTextStyle = '#ffffff'
            }

            that.$.setNavigationBarColor({
              frontColor: that.PageNav.window.navigationBarTextStyle,
              backgroundColor: that.PageNav.window.navigationBarBackgroundColor
            })

            if (data.page_name) {
              that.$.setNavigationBarTitle({
                title: data.page_name
              });
            }

            if (that.hasLogin && data.im_enable) {
              var perm_id = that.$.getStorageSync('uid');
              var perm_key = that.$.getStorageSync('ukey');
              let chat_url = that.$.sprintf("/im/chat/chat?uid=%s", data.im_user_id);

              that.setData({
                chatUrl: chat_url
              });
            }
          }
        }
      });
    },

    /**
     * 分类过滤
     */
    onCategory: function (category_id) {
      var post = this.post;
      post.category_id = category_id;
      post.page = 1;

      this.setData({
        pdlist: [],
        ispage: true, //loading
        post: post
      });

      this.GetPlist();
    },

    doNothing() {
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
      let that = this;
      uni.$emit('diy-scrollbottom', {uniId: that.ptConfig.uniId})
    },

    search: function (e) {
      uni.$emit('returnTop')

      let that = this;

      let opts = Object.assign({}, that.ptConfig.options);
      opts.keywords = e;

      that.ptConfig.options = opts
      that.$forceUpdate() //二维数组，开启强制渲染
    },

    returnTop: function () {
      let that = this;

      //视图会发生重新渲染
      that.scposition = that.oldscposition

      //当视图渲染结束 重新设置为0
      that.$nextTick(() => {
        that.scposition = 0
      });

      this.setData({isQuickNav: false})
    },
  }
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.m-product-all{
  margin-top: 44px;
  height: calc(100% - var(--window-top) - 44px);
}

.m-listv .ts-sty {
  .ts-top-box {
    background: linear-gradient(to right, #dbc4aa, #ba9877);
    line-height: 1.2;

    .tag {
      border-radius: 0;
      margin-top: 0;
      padding: 2px 5px;
      background: none;
      height: 1.2;
      line-height: 1.2;
      font-size: 22rpx;
    }
  }
}

/*Grid*/
.box-grids {
  position: relative;
  overflow: hidden;
  clear: both;
  height: 230rpx;

  background-color: #ffffff;
  white-space: nowrap;
  width: 100%;


  .box-grid {
    padding: 40rpx 20rpx;
    width: 33.33333333%;
    box-sizing: border-box;


    display: inline-block;
    text-align: center;
    font-size: 36rpx;

    &.active {
      .box-grid-label {
        color: #c0a080;
        // background-color: pink;
      }
    }
  }

  .box-grid-border {
    border-right: 1rpx solid #d9d9d9;
    border-bottom: 1rpx solid #d9d9d9;
  }

  .box-grid:active {
    background-color: #ececec;
  }

  .box-grid-icon {
    width: 68rpx;
    height: 68rpx;
    margin: 0 auto;

    image {
      display: block;
      width: 100%;
      height: 100%;
    }

  }

  .box-grid-label {
    margin-top: 10rpx;
  }

  .box-grid-label {
    display: block;
    text-align: center;
    color: #000;
    font-size: 24rpx;
    line-height: 40rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.box-grids-border {
  border-top: 1rpx solid #d9d9d9;
  border-left: 1rpx solid #d9d9d9;
}

.active {
  background-color: #c0a080;
}
</style>
