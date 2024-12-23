<template>
  <view class="uni-tab-bar" v-if="loadPageFlag"
        :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">

    <download-app :color="PageNav.window.navigationBarTextStyle"
                  :backgroundColor="PageNav.window.navigationBarBackgroundColor"></download-app>

    <uni-nav-bar v-if="false" :leftFlag="!!Config.SUBSITE_ENABLE || !!Config.CHAIN_ENABLE || !!Config.LANG_ENABLE"
                 :left-width="leftWidth" :rightFlag="rightFlag" :statusBar="true" :fixed="true" :border="false"
                 :color="PageNav.window.navigationBarTextStyle"
                 :backgroundColor="PageNav.window.navigationBarBackgroundColor"
                 :background-color="PageNav.window.navigationBarBackgroundColor"
                 :style="'background-color: ' + PageNav.window.navigationBarBackgroundColor" right-icon="scan"
                 right-width="120" @clickRight="scan">

      <view class="input-view" :style="'color:' + PageNav.window.navigationBarTextStyle">
        <uni-icons type="search" size="22" :color="PageNav.window.navigationBarTextStyle" style="line-height: 60rpx;"/>
        <input confirm-type="search" class="input" type="text" :placeholder="__('输入搜索关键词')" @click="onSearch">
      </view>
      <block slot="right">
        <view style="padding-right: 14rpx;line-height: 80rpx;opacity: 1;position:relative;"
              @click.stop="$.gopage('/member/member/message')">
          <uni-icons type="chat" :color="PageNav.window.navigationBarTextStyle" size="24"
                     :style="'padding-bottom:2px;color:' + PageNav.window.navigationBarTextStyle"/>
          <view class="msg-num" v-if="newMsgNum>0">{{ newMsgNum }}</view>
        </view>
      </block>
    </uni-nav-bar>

    <view>

      <!-- 顶部内容 -->
      <view class="home-top-nav-content"  :style="'background: transparent;'">
        <!-- 标题 -->
        <!-- #ifndef MP-TOUTIAO -->
       
          <!-- #ifdef MP-WEIXIN -->
         <view class="home-top-nav-title cr-white single-text" v-if="(!searchIsFixed)" style="justify-content: flex-start;">
         	
			<view style="padding: 0 8rpx;margin-top: 35rpx;" :style="'color:' + siteNameColor">{{ plantformInfo.site_name }}</view>
         </view>
          <!-- #endif -->
		  
          <!-- #ifndef MP-WEIXIN -->
		  <view class="home-top-nav-title cr-white single-text" v-if="(!searchIsFixed)" style="justify-content: flex-start;">
			<view style="padding: 0 8rpx;margin-top: 0rpx;" :style="'color:' + siteNameColor">{{ plantformInfo.site_name }}</view>
		  </view>
          <!-- #endif -->

        <!-- #endif -->

        <!-- 搜索 -->
        <!-- <view v-if="searchIsFixed" class="search-fixed-seat"></view> -->
        <view :class="'pr '+(searchIsFixed ? 'search-content-fixed' : '')"
              :style="searchIsFixed ? topContentStyle : ''">
          <view v-if="commonAppIsEnableSearch" :style="searchStyle">
            <view class="margin-horizontal-main" style="padding: 0 24rpx;">
              <view class="view-input" :style="{borderColor:  borderColor,background:  backgroundColor}"
                    @click="onSearch">
                <i class="iconfont zc zc-search1" :color="fontColor"
                   style="line-height: 68rpx;"/>
                <span style="padding:0 20rpx;display: inline-flex;flex:1;">
                {{ __('输入商品名') }}
              </span>
                <label class="input-view-right">
                  {{ __('搜索') }}
                </label>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view :style="'background: ' + PageNav.window.navigationBarBackgroundColor +';border: 0;padding-left:20rpx;padding-right:20rpx;'">
        <scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
                     :style="'background: ' + PageNav.window.navigationBarBackgroundColor +';border: 0;width:660rpx;float:left;'"
                     v-if="tabBars.length>1">
          <view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list"
                :class="tabIndex==index ? 'active' : ''"
                :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
            <view class="pt20 text" :style="'color:' + PageNav.window.navigationBarTextStyle">
              {{ tab.category_alias || tab.category_name || "　" }}
            </view>
            <view class="bg-main" :style="tabIndex==index ? '' : ''"></view>
          </view>
        </scroll-view>
        <view v-if="tabBars.length>1" class="swiper-tab-rigth-box" style="width: 40rpx;text-align:center;float: right;"
              :style="'color:' + PageNav.window.navigationBarTextStyle" @click="goToCate()">
          <view :class="['swiper-tab-icon iconfont zc zc-chanpinnormal']">
            <text v-if="false">{{ __('分类') }}</text>
          </view>
        </view>
      </view>
      <swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab"
              :style="{height:(screenHeight-50)+'px'}">
        <swiper-item v-for="(tab, index1) in swiperTabItems" :key="index1">
          <scroll-view class="list" scroll-y @scroll="onScroll" @scrolltolower="scrolltolower('pageIndex-'+index1)"
                       :scroll-top="scrollTop" scroll-with-animation="true">
            <diy :id="'content-wrap' + index1" :isFilterFixed="isFilterFixed" :fixTop="topDistance"
                 :BgConfig="tab.BgConfig"
                 :PageContent="tab.PageContent" :pageId="tab.pageId" :PageNav="tab.PageNav"
                 :loadPageFlag="tab.loadPageFlag" :StoreInfo="chatInfo" :hideDiy="hideDiy"
                 :uniId="'pageIndex-'+index1" :paddingTop="headerNavHeight"></diy>

            <view class="uni-tab-bar-loading" v-if="!(tab.loadPageFlag)">
              {{ tab.loadingText || __('加载中....') }}
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>


    <!-- 弹出层 -->
    <view class="uni-mask" v-if="bannerShow"></view>
    <!-- 弹出层 -->
    <view v-for="(item, index) in popUps" :key="index">
      <view :class="['msk']" @tap="onPopClose(index)" v-if="item.pop_up_enable">
        <view class="msk_box">
          <image :src="item.pop_up_image" style='width:100%' mode="widthFix" @tap="onPopClick(item.pop_up_url)"></image>
          <view class="msk_box_info" style='right:16%;top:40%;'>
          </view>
          <view class="btn_cancel" @tap="onPopClose(index)">✕</view>
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
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
import downloadApp from '@/components/download-app.vue'

import diy from '../../components/themes/diy.vue'

import {mapMutations, mapState} from 'vuex'

export default {
  components: {
    statusBar,
    uniNavBar,
    diy,
    downloadApp
  },
  data() {
    return {
      options: {},
      userIsNew: 1,
      pageId: 0,
      loadPageFlag: false,
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
      isFilterFixed: false,
      hideDiy: false,
      chatInfo: {},
      shareImg: "",
      shareTitle: "",
      refresh: true,

      screenHeight: 0,
      swiperHeight: 0,
      w: 0, //windowWidth
      chatUrl: '',

      scrollLeft: 0,
      isClickChange: false,
      tabIndex: 0,
      swiperTabItems: [], //多页面页面数据
      tabBars: [],

      city: '全中国',
      showSubsiteFlag: true,
      rightFlag: true,
      leftWidth: "150",

      popUps: [],

      bannerShow: false,

      initX: '690',
      initY: '1336',

      oldscposition: 0,
      isQuickNav: false,
      scrollTop: 0,

      commonAppIsHeaderNavFixed: true,
      commonAppIsEnableSearch: true,
      topContentStyle: 'padding-top:8px;',
      searchStyle: '',
      searchIsFixed: false,
      topDistance: 0,

      siteNameColor: "#fff",

      borderColor: "#dfdfdf",
      fontColor: "#fff",
      backgroundColor: "transparent",
    }
  },
  watch: {},
  computed: {
    headerNavHeight() {
      return this.commonAppIsEnableSearch ? "260rpx" : "160rpx";
    },
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum'])
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
  async onLoad(options) {
    await this.$onLaunched;

    //#ifdef MP
    this.rightFlag = false;
    //#endif

    var that = this;

    that.$.getSystemInfo({
      success: function (t) {
        that.setData({screenHeight: t.screenHeight})
      }
    });


    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var opts = {};

      opts = that.$.parse_str(scene);
      options = Object.assign(options, opts);
    }

    var w = that.$.getSystemInfoSync().windowWidth;

    that.setData({
      w: w,
      options: options
    })

    //动态设置swiper的高度
    this.$nextTick(() => {
      this.setSwiperHeight();
    });

    that.initPageData();

    that.notice.addNotification("RefreshStoreName", that.RefreshStoreName, that);
    that.notice.addNotification("ScanCode", that.onScanCode, that);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;

    this.showCartNum();

    // #ifdef APP-PLUS
    if (this.pageId > 0) {
      this.hideDiy = false;
    }
    // #endif

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // #ifdef APP-PLUS
    this.hideDiy = true;
    // #endif
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面，注销事件
    var that = this

    that.notice.removeNotification("RefreshStoreName", that);
    that.notice.removeNotification("ScanCode", that);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif

    return {
      title: this.shareTitle,
      imageUrl: this.shareImg,
      path: "/pages/index/index?uid=" + this.userInfo.user_id
    }
  },

  /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.shareTitle,
      query: {
        uid: this.userInfo.user_id
      },
      imageUrl: this.shareImg,
    }
  },
  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function () {
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),

    initPageData: function () {
      let that = this;

      that.getPlantformInfo(function (plantform) {
        if (!!that.Config.LANG_ENABLE && (!!that.Config.SUBSITE_ENABLE || !!that.Config.CHAIN_ENABLE)) {
          that.leftWidth = "260";
        } else {
          that.leftWidth = "150";
        }

        //
        that.setData({
          city: that.$.getStorageSync('site_name') ? that.$.getStorageSync('site_name') : that.__('全国站')
        });

        /*
        that.$.request({
          url: that.Config.URL.category_mobile_nav,
          loading: false,
          ajaxCache: {
            timeout: that.Config.CACHE_EXPIRE
          },
          success(data) {
            let tmp = data.items;
            tmp.unshift({'id':0, category_name:that.__('首页'), category_alias:that.__('首页')});

            that.setData({
              tabBars: tmp
            })

            let ary = [];
            for (let i = 0, length = that.tabBars.length; i < length; i++) {
              ary.push({loadPageFlag:false, category_id:that.tabBars.category_id});
            }

            that.swiperTabItems = ary;

            that.loadBrandsAndProduncts(that.tabIndex, 0, 1, false)
          }
        });

         */
        that.setData({
          tabBars: [{'id': 0, category_name: that.__('首页'), category_alias: that.__('首页')}]
        })
        that.loadBrandsAndProduncts(that.tabIndex, 0, 1, false)


        uni.setNavigationBarTitle({
          title: plantform.site_name
        });
      })
    },

    //初始化数据
    initData: function (force_refresh) {
      var that = this;
      var param = {};

      // #ifndef APP-PLUS
      //that.$.setNavigationBarTitle({title: that.plantformInfo.site_name});
      // #endif

      //
      let $title = that.plantformInfo.site_name;
      let $desc = '' || this.plantformInfo.site_meta_description;
      let $link = that.$.sprintf('%s/h5/pages/index/index', that.Config.SiteUrl);
      let $img_url = this.shareImg || this.plantformInfo.logo;

      //初始化微信分享

      that.$.wxShare($title, $desc, $link, $img_url)

      /*
      let category_id = 0;

      if (!that.$.isNull(this.tabBars[this.tabIndex].category_id))
      {
        category_id = that.$.isNull(this.tabBars[this.tabIndex].category_id);
      }
      */

      that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].category_id || 0, 1, force_refresh)
    },

    goDetail(e) {
      uni.navigateTo({
        url: '/pages/template/tabbar/detail/detail?title=' + e.title
      });
    },
    close(index1, index2) {
      let that = this;
      that.$.showModal({
        content: '是否删除本条信息？',
        success: (res) => {
          if (res.confirm) {
            this.swiperTabItems[index1].items.splice(index2, 1);
          }
        }
      })
    },
    loadMore(e) {
      setTimeout(() => {
        this.addData(e);
      }, 1200);
    },
    addData(e) {
      if (this.swiperTabItems[e].total <= this.swiperTabItems[e].page) {
        this.swiperTabItems[e].loadingText = '没有更多了';
        return;
      }

      let category_id = this.tabBars[this.tabIndex].category_id;
      this.loadBrandsAndProduncts(this.tabIndex, category_id, this.swiperTabItems[e].page + 1, false);
    },
    loadBrandsAndProduncts(index, category_id, page, force_refresh) {
      var that = this;
      let params = {};

      params.category_id = category_id;
      params.page = page;
      params.page_index = 'page_index';

      that.$.request({
        url: that.Config.URL.getMobilePage,
        data: params,
        ajaxCache: {
          timeout: that.Config.CACHE_EXPIRE,
          forceRefresh: force_refresh
        },
        success: function (data, status, msg, code) {
          uni.stopPullDownRefresh()


          let tmp = that.swiperTabItems[index];
          tmp = {
            pageId: data.page_id,
            PageContent: that.$.parseJSON(data.page_code),
            BgConfig: that.$.parseJSON(data.page_config),
            PageNav: that.$.parseJSON(data.page_nav),
            shareImg: data.page_share_image,
            shareTitle: data.page_share_title || data.page_name
          }

          tmp.loadPageFlag = true
          tmp.page = data.page;

          //console.info(tmp.PageNav.window.navigationBarTextStyle);
          //console.info(tmp.PageNav.window.navigationBarBackgroundColor);

          if (tmp.PageNav.window.navigationBarTextStyle == 'black') {
            tmp.PageNav.window.navigationBarTextStyle = '#000000'
            that.siteNameColor = '#696969';
          }

          if (tmp.PageNav.window.navigationBarTextStyle == 'white') {
            tmp.PageNav.window.navigationBarTextStyle = '#ffffff'
            that.siteNameColor = '#ffffff';
          }

          uni.setNavigationBarColor({
            frontColor: tmp.PageNav.window.navigationBarTextStyle,
            backgroundColor: tmp.PageNav.window.navigationBarBackgroundColor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })


          //that.$.setNavigationBarTitle({title: tmp.shareTitle});

          /*
                      if (data.page >= data.total)
                      {
                          tmp.loadingText = that.__('没有更多了');
                      }
                      else
                      {
                          tmp.loadingText = that.__('加载中....');
                      }
                      */

          that.$set(that.swiperTabItems, index, tmp);

          that.setData({
            pageId: tmp.pageId,
            PageContent: tmp.PageContent,
            BgConfig: tmp.BgConfig,
            PageNav: tmp.PageNav,
            shareImg: tmp.shareImg,
            shareTitle: tmp.shareTitle,
            loadPageFlag: true
          });


          var top = parseInt(that.statusBar) - 2 - 2;

          that.setData({
            topContentStyle: 'background:' + tmp.PageNav.window.navigationBarBackgroundColor + ';padding-top:' + top + 'px;',
            //backgroundColor: tmp.PageNav.window.navigationBarTextStyle,
            //fontColor: tmp.PageNav.window.navigationBarBackgroundColor,
          });


          that.setData({
            chatInfo: {
              im_enable: data.im_enable,
              im_user_id: data.im_user_id,
              puid: data.puid
            },
            popUps: data.pop_ups
          });

          //动态设置swiper的高度
          that.$nextTick(() => {
            that.setSwiperHeight();
          });
        }
      });
    },
    async changeTab(e) {
      let that = this;
      let index = e.target.current;
      //this.tabIndex = index;

      if (!this.swiperTabItems[index].loadPageFlag) {
        let category_id = this.tabBars[index].category_id;
        this.loadBrandsAndProduncts(index, category_id, 1, false);
      } else {
        let tmp = that.swiperTabItems[index];


        //console.info(tmp.PageNav.window.navigationBarTextStyle);
        //console.info(tmp.PageNav.window.navigationBarBackgroundColor);

        if (tmp.PageNav.window.navigationBarTextStyle == 'black') {
          tmp.PageNav.window.navigationBarTextStyle = '#000000'
        }

        if (tmp.PageNav.window.navigationBarTextStyle == 'white') {
          tmp.PageNav.window.navigationBarTextStyle = '#ffffff'
        }

        uni.setNavigationBarColor({
          frontColor: tmp.PageNav.window.navigationBarTextStyle,
          backgroundColor: tmp.PageNav.window.navigationBarBackgroundColor,
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          }
        })


        // that.$.setNavigationBarTitle({title: tmp.shareTitle});

        that.setData({
          pageId: tmp.pageId,
          PageContent: tmp.PageContent,
          BgConfig: tmp.BgConfig,
          PageNav: tmp.PageNav,
          shareImg: tmp.shareImg,
          shareTitle: tmp.shareTitle
        });
      }

      if (this.isClickChange) {
        this.tabIndex = index;
        this.isClickChange = false;

        return;
      }

      let tabBar = await this.getElSize("tab-bar"),
          tabBarScrollLeft = tabBar.scrollLeft;
      let width = 0;

      for (let i = 0; i < index; i++) {
        //alert(this.tabBars[i].id);
        let result = await this.getElSize(this.tabBars[i].id);
        width += result.width;
      }

      let winWidth = uni.getSystemInfoSync().windowWidth,
          nowElement = await this.getElSize(this.tabBars[index].id),
          nowWidth = nowElement.width;
      if (width + nowWidth - tabBarScrollLeft > winWidth) {
        this.scrollLeft = width + nowWidth - winWidth;
      }
      if (width < tabBarScrollLeft) {
        this.scrollLeft = width;
      }
      this.isClickChange = false;
      this.tabIndex = index; //一旦访问data就会出问题

    },
    getElSize(id) { //得到元素的size
      return new Promise((res, rej) => {
        uni.createSelectorQuery().select("#tab_" + id).fields({
          size: true,
          scrollOffset: true
        }, (data) => {
          res(data);
        }).exec();
      })
    },
    async tapTab(e) { //点击tab-bar
      let that = this;

      let tabIndex = e.currentTarget.dataset.current;
      if (!this.swiperTabItems[tabIndex].loadPageFlag) {

      } else {
      }

      if (this.tabIndex === tabIndex) {
        return false;
      } else {
        let tabBar = await this.getElSize("tab-bar"),
            tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
        this.scrollLeft = tabBarScrollLeft;
        this.isClickChange = true;
        this.tabIndex = tabIndex;
      }
    },


    RefreshStoreName: function (e) {
      //console.info(e);

      let refresh = false;

      if (e.store_row.store_id != this.$.getStorageSync('store_id')) {
        refresh = true;
      }

      this.setData({city: e.store_row.store_name});

      this.$.setStorageSync('store_id', e.store_row.store_id);
      this.$.setStorageSync('store_name', e.store_row.store_name);

      // #ifdef H5
      $cookies.set('store_id', e.store_row.store_id);
      // #endif

      if (refresh) {
        //刷新首页
        this.setData({
          indexArray: []
        });

        this.initData(true)
      }
    },

    innertouch: function () {
    },
    onPopClose: function (index) {
      this.popUps[index].pop_up_enable = false;
      // this.setData({showPopFlag: false})
    },
    onPopClick: function (pop_up_url) {
      // this.$.gopage(this.indexPopUrl)
      this.$.gopage(pop_up_url)
    },

    confirm() {
    },

    onSearch(e) {
      let that = this;
      that.$.gopage("/pagesub/search/search");
    },
    scan: function (e) {
      let that = this;

      //#ifdef H5
      that.$.gopage('/pagesub/scan/scan');
      //#endif

      //#ifndef H5

      that.$.scanCode({
        success: function (e) {
          //console.info(e.result);
          that.onScanCode(e.result);
          //

          return
          var t = e.result.split("=");
          t.length > 2 || t.length < 2 ? that.$.alert(that.__("无法识别")) : t[0] == "productId" ? that.$.isNull(t[1]) ? that.$.alert(that.__("无法识别")) : that.$.navigateTo(
              "/pagesub/product/detail?id=" + t[1]) : t[0] == "eventId" ? that.$.isNull(t[1]) ? that.$.alert(that.__("无法识别")) : that.$.navigateTo(
              "../activitycheckin/activitycheckin?eventId=" + t[1]) : that.$.alert(that.__("无法识别"))
        },
        fail: function (e) {
          that.$.alert(that.__("无法识别"))
        }
      })
      //#endif

    },
    onScanCode: function (e) {
      //console.info('sss')
      //console.info(e)
      let that = this;

      that.$.gopage(
          '/pagesub/webpage/web?u=' +
          encodeURIComponent(e)
      );
    },

    showConfirmLang: function () {
      this.bannerShow = true;
    },
    closeBanner: function () {
      this.bannerShow = false;
    },
    scrolltolower: function (index) {
      uni.$emit('diy-scrollbottom', {uniId: index})
    },

    goToCate: function () {
      var that = this;
      that.$.gopage("/pages/category/category");
    },
    // 页面滚动监听
    onScroll(e) {
      let element = "#product-pageIndex-" + this.tabIndex;

      var that = this;
      const query = wx.createSelectorQuery();
      var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44;
      query.selectAll(element).boundingClientRect()
      query.exec((res) => {
        res[0].forEach((item) => {
          if (item.top <= 100) {
            that.isFilterFixed = true;
            //#ifdef MP
            that.topDistance = statusBarHeight
            //#endif
            //#ifndef MP
            that.topDistance = 46
            //#endif

            this.isShow = true;

          } else {
            that.isFilterFixed = false;
            that.topDistance = 0
            this.isShow = false;
          }
        })
      })

      this.oldscposition = e.detail.scrollTop;

      /*
      if (100 < e.detail.scrollTop) {
        that.setData({opacity: 1, background: "f8f8f8"});
      } else {
        that.setData({
          opacity: 0,
          background: "fff"
        })
      }
       */

      if (e.detail.scrollTop >= this.screenHeight) {
        this.setData({isQuickNav: true})
      } else {
        this.setData({isQuickNav: false})
      }

      if (this.commonAppIsHeaderNavFixed && this.commonAppIsEnableSearch) {
        var top = e.detail.scrollTop > 35 ? 35 : e.detail.scrollTop;
        var num = top * 7;
        this.oldscposition = e.detail.scrollTop;
        var base = 230;

        // #ifdef MP-ALIPAY
        base = 235
        // #endif

        // #ifdef H5 || MP-TOUTIAO || APP
        var len = 0;
        base = (len <= 0) ? 0 : 66 * len;
        // #endif 

        // #ifdef MP-WEIXIN || MP-ALIPAY
        var len = 3;
        base = (len <= 0) ? 0 : 66 * len;
        // #endif

        // 开启哀悼插件的时候不需要浮动导航并且搜索框也不需要缩短、开启站点灰度会导致浮动失效
        if ((this.plugins_mourning_data || 0) != 1) {
          var top_val = 35;

          var val = (num > base) ? base : num;
          // #ifdef MP-TOUTIAO
          top_val = 0;
          val = base
          // #endif
          this.setData({
            searchStyle: 'width: calc(100% - ' + val + 'rpx);',
            searchIsFixed: (top >= top_val),
          });
        }

      }
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

    doNothing() {
    },

    //动态设置swiper的高度
    setSwiperHeight() {
      let element = "#content-wrap" + this.tabIndex;
      let query = uni.createSelectorQuery().in(this);
      query.select(element).boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          this.swiperHeight = res[0].height;
        }
      });
    },
  }
}
</script>

<style lang="scss">
@import "../../styles/_variables";
@import '../../styles/layout.scss';

.uni-tab-bar-loading {
  text-align: center;
  font-size: 28rpx;
  color: #999;
}


.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background-size: cover !important;
  background-position: top center !important;
  margin-bottom: var(--window-bottom);
}


.city {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  //margin-left: 16rpx;
  white-space: nowrap;
}

.input-view {
  width: 92%;
  display: flex;
  background-color: #e7e7e7;
  background-color: transparent;
  /*height: 88rpx;*/
  border-radius: 30rpx;
  padding: 0 4%;
  flex-wrap: nowrap;
  margin: 14rpx 0;
  line-height: 60rpx;
  margin-left: 10rpx;
}

.input-view .uni-icon {
  line-height: 60rpx !important;
}

.input-view .input {
  height: 60rpx;
  line-height: 60rpx;
  width: 94%;
  padding: 0 3%;
  color: inherit;
}

.input-view .uni-input-placeholder {
  color: inherit;
}

.uni-swiper-tab {

  line-height: 70rpx;
  height: 76rpx;

  .swiper-tab-list {

    width: auto;
    margin-right: 0rpx;


    padding-left: 36rpx;

    &:first-child {
      padding-left: 0rpx;
    }

    line-height: 70rpx;
    height: 70rpx;

    .bg-main {
      bottom: 8rpx;
    }

    .pt20 {
      padding-top: 0rpx;
    }
  }
}

.msg-num {
  width: auto;
  height: 16px;
  line-height: 16px;
  border-radius: 16px;
  min-width: 16px;
  padding: 2px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;


  position: absolute;
  top: 6px;
  right: 8px;

  background-color: #f43530;
  color: #fff;
  transform: translate(40%, -20%);
}


/* 弹出层形式的广告 */
.uni-banner {
  width: 80%;
  height: 32%;
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 10rpx;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

.uni-list-cel {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.swiper-tab-rigth-box {
  font-size: 28rpx;

  .swiper-tab-icon {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 66rpx;
    overflow: hidden;
    height: 66rpx;

    text {
      margin-left: 4rpx;
    }
  }
}

.swiper-tab-icon:before {
  padding-top: 2rpx;
  font-size: 32rpx;
  color: inherit;
  vertical-align: middle;
}

.swiper-tab-line {
  width: 4rpx;
  height: 28rpx;
  background: linear-gradient(180deg, rgba(155, 11, 0, 0) 0%, rgba(117, 13, 5, 0.86) 100%);
  opacity: 1;
}


/**
 * 顶部内容
 */
.home-top-nav-content {
  background-repeat: no-repeat;
  background-size: 100% auto;
  /* #ifdef MP || APP */
  padding-top: calc(var(--status-bar-height) - 4px);
  /* #endif */
  /* #ifndef  MP || APP */
  padding-top: calc(15px);
  /* #endif */

  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;

}

.home-top-nav-title {
  display: flex;
  align-items: center;
  padding: 18rpx 18rpx;
  padding-top: 16rpx;


  font-size: 36rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 50rpx;

  span{
    margin-left: 10rpx;
    color: $default-skin-bg;
  }
}

/**
 * 搜索
 */
.pr {
  padding-bottom: 12rpx;
}

.search-fixed-seat {
  padding-top: 70rpx;
}

.search-content-fixed {
  position: fixed !important;
  top: 0;
  z-index: 11;

  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% auto;

  .view-input .zc-search1{
    color: #e9e8e8;
  }
}

/* #ifdef H5 || MP-TOUTIAO || APP */
.search-content-fixed .nav-top-right-icon {
  top: 0px !important;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.search-content-fixed {
  top: 0px !important;
}
/* #endif */

.view-input {
  display: flex;
  height: 67rpx;
  margin-top: 6px;
  background: #FFFFFF;
  border-radius: 34rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #AAAAAA;
  line-height: 67rpx;
  padding-left: 16rpx;
  border: 1rpx solid #FFFFFF;
  border-color: #FFFFFF;

  i {
    color: $default-skin-bg;
  }
}

// 右侧搜索按钮
.input-view-right {
  background: $default-skin-bg;
  border-radius: 29rpx;
  font-size: 28rpx;
  text-align: center;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 500;
  color: #FFFFFF;
  height: 56rpx;
  line-height: 56rpx;
  padding: 0rpx 26rpx;
  float: right;
  margin-right: 6rpx;
  margin-top: 6rpx;
}
</style>
