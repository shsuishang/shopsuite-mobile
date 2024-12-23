<template>
  <view :class="[isFilterFixed ? 'u-pa' : ''] ">
    <view class="m-tips" style="" v-if="titleText">
      <view class="m-tips-str"
            :style="'line-height: 100rpx;height: 100rpx;font-size: 32rpx;font-weight: 500;color:' + titleColor">
        {{ titleText }}
      </view>
    </view>
    <view :class="['m-tab', isFilterFixed ? 'm-tab-fixed' : 'm-tab-top'] " :style="'top:' + fixTop + 'px'" v-if="isShowFilter">
      <view class="m-navbar">
        <view :class="{'m-navbar-item':1,  'm-navbar-item-on':post.sidx=='product_sale_num'}" @click="sealnum">
          {{ __('销量') }}
        </view>
        <view :class="{'m-navbar-item':1,  'm-navbar-item-on':post.sidx=='product_add_time'}" @click="newpd">
          {{ __('新品') }}
        </view>
        <view :class="(post.sidx=='product_unit_price_min' || post.sidx=='product_unit_price_max')?'m-navbar-item m-navbar-item-on':'m-navbar-item'" @click="pdprice">
          <view class="m-sort">
          	<text>{{__('价格')}} </text>
          	<image src="/static/images/sort.png" v-if="post.sidx != 'product_unit_price_min' && post.sidx != 'product_unit_price_max'" />
          	<uni-icons type="arrowup" size="12" v-if="post.sidx == 'product_unit_price_min'" />
          	<uni-icons type="arrowdown" size="12" v-if="post.sidx == 'product_unit_price_max'" />
          </view>
        </view>
        <view :class="{'m-navbar-item':1,  'm-navbar-item-on':(is_filter)}" @click="onOpenFilter" style="display: flex;">
          {{ __('筛选') }}
          <i class="iconfont zc zc-shaixuan"></i>
        </view>
      </view>
    </view>
    <view scroll-y="true" :class="['m-product-all  u-pa', isShowFilter && isFilterFixed ? 'm-product-box' : '']"
          :style="{backgroundColor:bgColor, marginTop: (isShowFilter && isFilterFixed) ? (fixTop+customBarHeight)+'px' : ''}"
          @scrolltolower="scrollbottom"
          :scroll-top="scposition" @scroll="scrolltoupper">

      <view :class="{'m-product-list':1, 'm-listv':viewtype==1}" v-if="(isdata)" :style="css">
        <block v-for="(item, i) in pdlist" :key="i">
          <navigator v-if="(!isFG)"
                     :url="(item.is_virtual?'/pagesub/product/detail':'/pagesub/product/detail') + '?pid=' + (item.id)"
                     class="m-product-item">
            <view class="m-product-img product-list">
              <view class="no_goods" v-if="item.product_quantity==0">
                <view class="no_shadow"></view>
                <text class="no_goods_tip">{{ __('售罄，补货中') }}</text>
              </view>
              <image lazy-load :src="($.img(item.product_image, 360,  360))" v-if="item.product_image"/>
            </view>
            <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;">
              <view class="m-product-name2">
                <label>
                  <block v-for="id in item.activity_type_id_row">
                  </block>
                  {{ item.product_name }}
                </label>
              </view>
              <view class="m-product-name2" v-if="false">
                <uni-tag text="产地" type="success" size="small" :inverted="true" class="p-tag"></uni-tag>
                <uni-tag text="距离" type="royal" size="small" :inverted="true" class="p-tag"></uni-tag>
                <uni-tag text="溯源" type="gray" size="small" :inverted="true" class="p-tag"></uni-tag>
              </view>
              <view class="m-product-price1">
                <view class="money">
                  <block v-if="item.product_unit_price_range">
                    <label>{{ __('￥') }}</label>{{ item.product_unit_price_range }}
                  </block>

                  <block v-if="item.product_unit_points">
                    <label style="margin: 0rpx 10rpx;">+</label>{{ number_format(item.product_unit_points) }}
                    <label>{{ __('积分') }}</label>
                  </block>

                  <block v-if="item.product_unit_sp">
                    <label style="margin: 0rpx 10rpx;">+</label>{{ item.product_unit_sp }} <label>{{ __('众宝') }}</label>
                  </block>
                </view>
                <view class="num" v-if="!plantformInfo.prodcut_addcart_flag && (plantformInfo.product_salenum_flag && item.product_sale_num>0)">
                  <text>{{ __('已售') }}</text>
                  <label style="color:#db384c;margin-left: 2px;">{{ item.product_sale_num }}</label>
                </view>
                <view class="multi-spec-box" v-if="plantformInfo.prodcut_addcart_flag">
                  <view class="item-num-box">
                    <label class="item-num-over" v-if="(item.product_quantity==0)">{{__('已售空')}}</label>
                    <block v-else>
                      <block v-if="(!item.HasManualSku)">
                        <view @click.stop="subCart" :data-cart_id="(item.cart_id)" :data-num="(item.user_cart_quantity)" :data-stock="(item.product_quantity)" :data-step="(-1)" :data-spuid="(item.product_id ? item.product_id : 0)"
                              :data-pname="(item.product_name ? item.product_name : '')" :data-skuid="(item.item_id)" :data-index="(i)"
                              v-if="(item.user_cart_quantity>0)" class="iconfont icon-jian item-num-dec"></view>
                        <text class="item-num-add" v-if="(item.user_cart_quantity>0)">{{item.user_cart_quantity>99?'99+':item.user_cart_quantity}}</text>
                        <view @click.stop="addCart" :data-num="(item.user_cart_quantity)" :data-stock="(item.product_quantity)" :data-step="(1)" :data-spuid="(item.product_id ? item.product_id : 0)"
                              :data-pname="(item.product_name ? item.product_name : '')" :data-skuid="(item.item_id)" :data-index="(i)" :data-is_virtual="(item.kind_id!=1201)"
                              class="iconfont icon-add "></view>
                      </block>
                      <label class="item-num-choose" @click.stop="showProduct" :data-item_id="(item.item_id)"  :data-spuid="(item.product_id ? item.product_id : 0)" :data-index="(i)"
                             v-else>{{__('选规格')}}
                        <view class="car-num" v-if="(item.user_cart_quantity>0)" style="right:-14rpx;top:-20rpx;">{{item.user_cart_quantity>99?'99+':item.user_cart_quantity}}</view>
                      </label>
                    </block>

                  </view>
                </view>

                <view :class="'c'+1" v-if="false">
                </view>
              </view>
            </view>
          </navigator>
        </block>

        <view class="u-top-default" v-if="false">
          <view class="u-view" @click="viewType" style="line-height: 96rpx;">
            <label :class="(viewtype==1?'iconfont zc zc-viewlist':'iconfont zc zc-viewgallery')"></label>
          </view>
          <view class="u-back" @click="returnTop">
            <label class="iconfont icon-fanhuidingbu"></label>
          </view>
        </view>
      </view>
      <navigator url="/pagesub/search/search" redirect="true" v-else>
        <view v-if="!ispage" class="m-nullpage">
          <view class="m-nullpage-middle">
            <label class="iconfont icon-sousuo-sousuo"></label>
            <view class="m-null-tip">
              <text>{{ __('亲~找不到您想要的商品') }}</text>
              <text>{{ __('再多点提示呗') }}</text>
            </view>
          </view>
        </view>
      </navigator>


      <view class="m-loading-box" v-if="isShowLoading">
        <block v-if="(ispage)">
          <view class="u-loadmore">
            <label class="u-loading"></label>
            <text class="u-loadmore-tips">{{ __('正在加载') }}</text>
          </view>
        </block>
        <block v-else>
          <view class="u-loadmore u-loadmore-line" v-if="isdata">
            <text class="u-loadmore-tips">{{ __('没有更多数据啦！') }}</text>
          </view>
        </block>
      </view>
    </view>


    <view class="msk1" v-if="(chooseCartSpecBoxFlag)" style="z-index:20;" @click.stop="closeSpecBox">
      <view class="m-sp-box" @click.stop="innertouch">
        <view class="m-sp-top">
          <view class="u-close-sp" @click.stop="closeSpecBox">✕</view>
          <view class="m-sp-title">{{chooseItem.item_name}}</view>
          <view class="m-sp-body" v-for="(items, i) in chooseProduct.product_spec"  :key="i">
            <view>{{items.name}}：</view>
            <view class="m-sp-unit">
              <block v-for="(item, ii) in items.item"  :key="ii" >
                <view :class="['m-sp-choose',  item.select?'sp-choose-item-checked':'', spec_item_map[item.id] ? ' ' : 'item_disabled']">
                  <label class="sp-choose-item" :data-spid="(items.id)" :data-ckid="(item.id)"  :data-vid="(item.id)" :data-enable="spec_item_map[item.id]" @click.stop="selectSpec">{{item.name}}</label>
                </view>
              </block>
            </view>
          </view>
        </view>

        <view class="m-sp-bottom">
          <label class="sp-bottom-price">{{__('￥')}}{{chooseItem.item_sale_price}}</label> <label class="sp-bottom-des">(
          <block v-for="(items, i) in chooseProduct.product_spec"  :key="i">
            <block v-for="(item, ii) in items.item"  :key="ii">
              <block v-if="(item.select)">{{item.name}} </block>
            </block>
          </block>
          )</label>
          <view class="item-num-box" style="bottom:0;right:30rpx;font-weight: normal;height:100rpx;">
            <block>
              <view @click.stop="subCart" v-if="(chooseItem.user_cart_quantity>0)"  :data-num="(chooseItem.user_cart_quantity)"  :data-cart_id="(chooseItem.cart_id)"  :data-stock="(chooseProduct.available_quantity)"  :data-step="(-1)"
                    :data-spuid="(chooseItem.product_id ? chooseItem.product_id : 0)" :data-pname="(chooseItem.item_name ? chooseItem.item_name : '')"
                    :data-skuid="(chooseItem.item_id)"   :data-index="(chooseIndex)" class="iconfont icon-jian " style="font-size:50rpx;"></view>
              <text class="item-num-add" v-if="(chooseItem.user_cart_quantity>0)">{{chooseItem.user_cart_quantity>99?'99+':chooseItem.user_cart_quantity}}</text>
              <view @click.stop="addCart" :data-stock="(chooseItem.available_quantity)"  :data-num="(chooseItem.user_cart_quantity)"  :data-step="(1)" :data-spuid="(chooseItem.product_id ? chooseItem.product_id : 0)"
                    :data-pname="(chooseItem.item_name ? chooseItem.item_name : '')" :data-skuid="(chooseItem.item_id)"  :data-index="(chooseIndex)"
                    class="iconfont icon-add " style="font-size:50rpx;position:relative;bottom:5rpx;"></view>
            </block>
          </view>
        </view>
      </view>
    </view>


    <uni-drawer :visible="rightDrawerVisible" mode="right" @close="onCloseFilter">
      <view style="" class="drawer-box">
        <view class="uni-padding-wrap uni-common-mt">
          <view class="p-content-top"></view>
          <view class="p-content">
            <view class="p-content-title">{{ __('价格区间') }}</view>
            <view class="p-lists">
              <view style="display: inline-flex">
                <input class="uni-numbox-value" type="number" v-model="post.product_unit_price_min"
                       placeholder-class="placeholder-class" :placeholder="__('最低价')"/>
                <view class="uni-dot">-</view>
                <input class="uni-numbox-value" type="number" v-model="post.product_unit_price_max"
                       placeholder-class="placeholder-class" :placeholder="__('最高价')"/>
              </view>
            </view>
          </view>

          <view class="p-content">
            <view class="p-content-title uni-common-mt">{{ __('积分区间') }}</view>
            <view class="p-lists">
              <view style="display: inline-flex">
                <input class="uni-numbox-value" type="number" v-model="post.points_from"
                       placeholder-class="placeholder-class" :placeholder="__('最低积分')"/>
                <view class="uni-dot">-</view>
                <input class="uni-numbox-value" type="number" v-model="post.points_to"
                       placeholder-class="placeholder-class" :placeholder="__('最高积分')"/>
              </view>
            </view>
          </view>

          <block v-if="assist.length>0">
            <view class="p-content" v-for="(items, aid) in assist" :key="items.assist_id">
              <view class="p-content-title uni-common-mt">
                {{ items.assist_name }}
                <label :data-aid="aid" @click="assistItemReset" style="margin-left: 20rpx;">{{__('重置')}}</label>
              </view>

              <view class="p-lists" v-if="items['items'].length>0">
                <view class="tag-view" v-for="(assist_item, idx) in items['items']" :key="idx">
                  <uni-tag :text="assist_item.assist_item_name" type="ss" size="small"
                           :inverted="assist_item.assist_is_unselected" :data-id="assist_item.assist_item_id"
                           :data-index="idx" @click="setAssist(aid, idx)"></uni-tag>
                </view>
                <!--
                <checkbox-group  @change="assistItemChange" :data-aid="aid" v-if="'checkbox' == items.assist_format">
                  <view class="tag-view"  v-for="(assist_item, idx) in items['items']" :key="assist_item.id">
                  <label>
                    <checkbox :value="assist_item.assist_item_id+''" :checked="assist_item.checked" />{{assist_item.assist_item_name}}
                  </label>
                  </view>
                </checkbox-group>
                <radio-group  @change="assistItemRadionChange" :data-aid="aid" v-if="'radio' == items.assist_format">
                  <view class="tag-view"  v-for="(assist_item, idx) in items['items']" :key="assist_item.id">
                  <label>
                    <radio :value="assist_item.assist_item_id+''" :checked="assist_item.checked" />{{assist_item.assist_item_name}}
                  </label>
                  </view>
                </radio-group>
                -->
              </view>
            </view>
          </block>

          <view class="filter-btn-blank"></view>
          <view class="uni-common-mt filter-btn">
            <view class="p-bottom">
              <button class="button reset" type="warn" size="medium" @tap="onRest">{{ __('重置') }}</button>
              <button class="button confirm" type="warn" size="medium" @tap="onFilter">{{ __('确定') }}</button>
            </view>
          </view>
        </view>
      </view>
    </uni-drawer>
  </view>
</template>


<script>
import uniDrawer from '@/components/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import {mapMutations, mapState} from 'vuex';
import $ from "../helpers/util";

export default {
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    optionStr: {
      type: String,
      default: '{}'
    },
    css: {
      type: Object,
      default() {
        return {}
      },
    },
    isShowFilter: {
      type: [Boolean, Number],
      default: false
    },

    isFilterFixed: {
      type: Boolean,
      default: false
    },

    fixTop: {
      type: Number,
      default() {
        return 0
      },
    },

    viewtype: {
      type: Number,
      default: 1
    },

    titleText: {
      type: String,
      default: ''
    },

    titleColor: {
      type: String,
      default: '#bfbfbf'
    },

    bgColor: {
      type: String,
      default: '#f8f8f8'
    },

    paddingLeft: {
      type: Number,
      default: 0
    },

    paddingRight: {
      type: Number,
      default: 0
    },

    maxNumber: {
      type: Number,
      default: 100
    },

    isShowLoading: {
      type: [Boolean, Number],
      default: true
    },
    isGuessFlag: {
      type: Boolean,
      default: false
    },
    uniId:
        {
          type: String,
          default() {
            return 'guessyoulike'
          }
        }
  },
  data() {
    return {
      isStoreFlag: 0,
      h: 0,
      /* viewtype: 1, */
      requestNewFlag: true, //新请求
      assist: [],
      pdlist: [],
      fglist: [],
      sort: 2,
      flag: true,
      ispage: true,
      scposition: '',
      old: {
        scposition: 0
      },
      istop: false,
      isdata: false,
      isVirtual: false,
      isFG: false,
      is_filter: false,
      post: {
        sidx: 'product_order',
        sort: 'ASC',
        isnew: false,
        keywords: '',
        store_category_ids: 0,
        page: 1,
        store_id: null,

        pa_id: null,
        pa_type_id: null,

        product_unit_price_min: null,
        product_unit_price_max: null,

        points_from: null,
        points_to: null,

        virtual: null,
        store_type: 1
      },

      rightDrawerVisible: false,
      customBarHeight: 0,

      inverted: {
        gift: true,
        groupbuy: true,
        xianshi: true,
        virtual: true
      },
      contract_row: [],
      market_row: [],

      chooseCartSpecBoxFlag: false,
      chooseIndex: 0,
      chooseProduct: {},
      chooseItem: {},
      spec_item_map: {},
    };
  },

  components: {
    uniDrawer,
    uniTag
  },
  computed: mapState([
    'Config',
    'StateCode',
    'notice',
    'plantformInfo',
    'shopInfo',
    'userInfo',
    'hasLogin',
    'cartList',
    'cartMap'
  ]),
  created() {
    var that = this;

    // #ifdef WEB

    // #endif

    // #ifndef WEB
    var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.customBarHeight = statusBarHeight - 15 - 18
    // #endif

    var h = that.$.getSystemInfoSync().windowHeight;

    that.setData({
      h: h
    })


    var post = this.post;
    var options = this.options;

    let tmp_opt = JSON.parse(this.optionStr);
    options = Object.assign(options, tmp_opt);

    this.setData({
      post: {
        store_id: options.store_id,
        sidx: options.sidx ? options.sidx : 'product_order',
        sort: options.sort ? options.sort : 'ASC',
        keywords: options.keywords,
        store_category_ids: options.store_category_id,
        category_id: options.category_id,
        brand_id: options.brand_id,
        product_tags: options.product_tag_ids ? options.product_tag_ids : [],
        kind_id: options.kind_id,
        store_type: options.store_type,
        page: 1,

        product_unit_price_min: options.product_unit_price_min ? options.product_unit_price_min : '',
        product_unit_price_max: options.product_unit_price_max ? options.product_unit_price_max : '',

        sp_from: options.sp_from ? options.sp_from : '',
        sp_to: options.sp_to ? options.sp_to : '',

        points_from: options.points_from ? options.points_from : '',
        points_to: options.points_to ? options.points_to : '',

        pa_id: options.pa_id ? options.pa_id : '',
        pa_type_id: options.pa_type_id ? options.pa_type_id : '',

        virtual: null,
        activity_type_ids: options.activity_type_ids ? options.activity_type_ids : [],
        contract_type_ids: options.contract_type_ids ? options.contract_type_ids : [],
        market_category_ids: options.market_category_ids ? options.market_category_ids : [],
		item_ids: options.item_ids ? options.item_ids : '',
        assist: {}
      }
    });

    this.GetPlist(function () {
      that.pdlist.length == 0 ? that.setData({isdata: false}) : that.setData({isdata: true});
    });

    uni.$on('diy-scrollbottom', function (data) {
      console.log('监听到事件来自 update ，携带参数 uniId 为：' + data.uniId);

      if (data.uniId == that.uniId) {
        console.log('监听到 scrollbottom');
        console.info(that.$refs)
        that.scrollbottom();
      }
    })

    uni.$on('returnTop', function (data) {
      that.returnTop();
    })
  },
  watch: {
    options(newVal, oldVal) {
      this.setData({
        requestNewFlag: true,
        //pdlist: [],
      });

      let that = this;
      that.ispage = true;

      var post = this.post;
      var options = this.options;


      this.setData({
        post: {
          store_id: options.store_id,

          sidx: options.sidx ? options.sidx : 'product_order',
          sort: options.sort ? options.sort : 'ASC',

          keywords: options.keywords,
          store_category_ids: options.store_category_id,
          category_id: options.category_id,
          brand_id: options.brand_id,
          product_tags: options.product_tag_ids ? options.product_tag_ids : [],
          kind_id: options.kind_id,
          store_type: options.store_type,
          page: 1,

          product_unit_price_min: options.product_unit_price_min ? options.product_unit_price_min : '',
          product_unit_price_max: options.product_unit_price_max ? options.product_unit_price_max : '',

          sp_from: options.sp_from ? options.sp_from : '',
          sp_to: options.sp_to ? options.sp_to : '',

          points_from: options.points_from ? options.points_from : '',
          points_to: options.points_to ? options.points_to : '',

          pa_id: options.pa_id ? options.pa_id : '',
          pa_type_id: options.pa_type_id ? options.pa_type_id : '',

          virtual: null,
          activity_type_ids: options.activity_type_ids ? options.activity_type_ids : [],
          contract_type_ids: options.contract_type_ids ? options.contract_type_ids : [],
          market_category_ids: options.market_category_ids ? options.market_category_ids : [],
          assist: {}
        }
      });

      this.GetPlist(function () {
        that.pdlist.length == 0 ? that.setData({isdata: false}) : that.setData({isdata: true});
      });
    },

    optionStr(newVal, oldVal) {
      this.setData({
        requestNewFlag: true,
        //pdlist: []
      });

      let that = this;
      that.ispage = true;

      var post = this.post;
      var options = {};

      if (typeof newVal == 'string') {
        options = JSON.parse(newVal);
      } else {
        options = newVal;
      }

      this.setData({
        post: {
          store_id: options.store_id,
          sidx: options.sidx ? options.sidx : 'product_order',
          sort: options.sort ? options.sort : 'ASC',
          keywords: options.keywords,
          store_category_ids: options.store_category_id,
          category_id: options.category_id,
          brand_id: options.brand_id,
          product_tags: options.product_tag_ids ? options.product_tag_ids : [],
          kind_id: options.kind_id,
          store_type: options.store_type,
          page: 1,

          product_unit_price_min: options.product_unit_price_min ? options.product_unit_price_min : '',
          product_unit_price_max: options.product_unit_price_max ? options.product_unit_price_max : '',

          sp_from: options.sp_from ? options.sp_from : '',
          sp_to: options.sp_to ? options.sp_to : '',

          points_from: options.points_from ? options.points_from : '',
          points_to: options.points_to ? options.points_to : '',

          pa_id: options.pa_id ? options.pa_id : '',
          pa_type_id: options.pa_type_id ? options.pa_type_id : '',

          virtual: null,
          activity_type_ids: options.activity_type_ids ? options.activity_type_ids : [],
          contract_type_ids: options.contract_type_ids ? options.contract_type_ids : [],
          market_category_ids: options.market_category_ids ? options.market_category_ids : [],
          assist: {}
        }
      });

      this.GetPlist(function () {
        that.pdlist.length == 0 ? that.setData({isdata: false}) : that.setData({isdata: true});
      });
    }
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

    async init() {
      await this.$store.dispatch(`getCartList`, (data) => {
        this.cartList = data.items
      })
    },

    viewType: function (e) {
      this.viewtype == 0 ? this.setData({viewtype: 1}) : this.setData({viewtype: 0});
    },

    /**
     * 销量排序
     */
    sealnum: function () {
      uni.$emit('returnTop')

      var post = this.post;
      post.sidx = 'product_sale_num';
      post.sort = 'DESC';
      post.page = 1;

      this.setData({
        requestNewFlag: true,
        //pdlist: [],
        post: post
      });

      this.GetPlist();
    },

    /**
     * 新品排序
     */
    newpd: function () {
      uni.$emit('returnTop')

      var post = this.post;
      post.sidx = 'product_add_time';
      post.sort = 'DESC';
      post.page = 1;

      this.setData({
        requestNewFlag: true,
        //pdlist: [],
        post: post
      });

      this.GetPlist();
    },

    /**
     * 价格排序
     */
    pdprice: function () {
      uni.$emit('returnTop')

      var post = this.post;
      post.sidx = this.sort == 1 ? 'product_unit_price_max' : 'product_unit_price_min';
      post.sort = this.sort == 1 ? 'DESC' : 'ASC';
      post.page = 1;

      this.sort == 1
          ? this.setData({
            sort: 2,
            requestNewFlag: true,
            //pdlist: [],
            post: post
          })
          : this.setData({
            requestNewFlag: true,
            //pdlist: [],
            sort: 1,
            post: post
          });

      this.GetPlist();
    },

    /**
     * 过滤搜索
     */
    onFilter: function () {
      uni.$emit('returnTop')

      var post = this.post;

      post.page = 1;
      post.activity_type_ids = [];
      post.contract_type_ids = [];
      post.market_category_ids = [];

      var is_filter = false;

      for (var i = 0; i < this.contract_row.length; i++) {
        if (!this.contract_row[i].contract_is_unselected) {
          post.contract_type_ids.push(this.contract_row[i].contract_type_id);

          is_filter = true;
        }
      }

      for (var i = 0; i < this.market_row.length; i++) {
        if (!this.market_row[i].market_is_unselected) {
          post.market_category_ids.push(this.market_row[i].market_category_id);

          is_filter = true;
        }
      }

      if (!this.inverted.gift) {
        post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_GIFT);
        is_filter = true;
      }

      if (!this.inverted.groupbuy) {
        post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_DIY_PACKAGE);
        is_filter = true;
      }

      if (!this.inverted.xianshi) {
        post.activity_type_ids.push(this.StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT);
        is_filter = true;
      }

      if (!this.inverted.virtual) {
        post.virtual = 1;
        is_filter = true;
      } else {
        post.virtual = null;
      }

      post.assist = {};

      let ao = {};
      for (var a = 0, lenA = this.assist.length; a < lenA; ++a) {
        var items = this.assist[a].items;

        let temp = [];
        for (var i = 0, lenI = items.length; i < lenI; ++i) {

          if (!items[i].assist_is_unselected) {
            temp.push(items[i].assist_item_id);
          }
        }

        if (temp.length > 0) {
          ao[this.assist[a].assist_id] = temp;
        }
      }

      /*
      post.assist = JSON.stringify(ao);
      post.activity_type_ids = JSON.stringify(post.activity_type_ids);
      post.contract_type_ids = JSON.stringify(post.contract_type_ids);
      post.market_category_ids = JSON.stringify(post.market_category_ids);
      */
      console.info(JSON.stringify(this.assist))
      console.info(JSON.stringify(ao))

      post.assist = ao;
      post.activity_type_ids = post.activity_type_ids;
      post.contract_type_ids = post.contract_type_ids;
      post.market_category_ids = post.market_category_ids;

      this.setData({
        requestNewFlag: true,
        //pdlist: [],
        post: post,
        is_filter: is_filter
      });

      this.GetPlist();

      this.rightDrawerVisible = false;


      this.onCloseFilter()
    },


    assistItemReset: function (e) {
      var aid = parseInt(e.target.dataset.aid);

      let assist = this.assist.concat();
      var items = assist[aid].items;

      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].assist_is_unselected = true;
      }

      this.setData({assist: assist})
    },

    assistItemChange: function (e) {
      var values = e.detail.value;
      var aid = parseInt(e.target.dataset.aid);

      let assist = this.assist.concat();
      var items = assist[aid].items;

      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].assist_is_unselected = false;
        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].assist_item_id == values[j]) {
            items[i].assist_is_unselected = true;
            break
          }
        }
      }

      this.setData({assist: assist})
    },
    assistItemRadionChange: function (e) {
      var value = e.target.value;
      var aid = parseInt(e.target.dataset.aid);

      let assist = this.assist.concat();
      var items = assist[aid].items;

      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].assist_is_unselected = false;
        if (items[i].assist_item_id == value) {
          items[i].assist_is_unselected = true;
          break
        }
      }

      this.setData({assist: assist})
    },
    scrollbottom: function (e) {
      if (this.flag) {
        var that = this;
        that.setData({flag: false}), clearTimeout(n);

        var post = this.post;
        /*
                post.sidx = 'product_unit_price_min';
                post.sort = this.sort == 1 ? 'DESC' : 'ASC';
        */
        post.page = parseInt(that.post.page) + 1;

        var n = setTimeout(function () {
          that.setData({
            post: post
          }),
              that.GetPlist();
        }, 500);
      }
    },

    /*
         * 读取商品数据
         */
    GetPlist: function (callback) {

      let url = this.Config.URL.pt.list;

      if (this.isGuessFlag) {
        url = this.Config.URL.pt.guess;
      }

      this.setData({flag: false});
      var that = this;

      let params = Object.assign({}, that.post);

      //转为逗号分割
      let assistItemIds = []

      for (var assistId in that.post.assist) {
        var items = that.post.assist[assistId];

        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          assistItemIds.push(items[i]);
        }
      }

      params.product_assist_data = assistItemIds.join(",");
      params.activity_type_ids = that.post.activity_type_ids.join(",");
      params.contract_type_ids = that.post.contract_type_ids.join(",");
      params.market_category_ids = that.post.market_category_ids.join(",");
      params.product_tags = that.post.product_tags.join(",");

      that.$.request({
        url: url,
        data: params,
        loading: false,
        method: "GET",
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE
        },
        success: function (data, status, msg, code) {
          let cartMap = that.cartMap

          for (var i = 0; i < data.items.length; i++) {
            data.items[i]['id'] = data.items[i]['item_id'];

            let activity_type_ids = data.items[i]['activity_type_ids'];
            data.items[i]['activity_type_id_row'] = activity_type_ids.split(",");

            if (data.items[i]['product_unit_price_min'] != data.items[i]['product_unit_price_max'] && data.items[i]['product_unit_price_min'] < data.items[i]['product_unit_price_max']) {
              data.items[i]['product_unit_price_range'] = that.$.mf(data.items[i]['product_unit_price_min'], 0) + "~" + that.$.mf(data.items[i]['product_unit_price_max'], 0)
            } else {
			data.items[i]['product_unit_price_range'] = that.$.mf(data.items[i]['product_unit_price_min'], 2)
            }

            //处理购物车数量 计算sku总库存
            data.items[i]['cart_id'] = 0;
            data.items[i]['user_cart_quantity'] = 0;

            data.items[i]['product_quantity'] = 0;
            let skuList = data.items[i]['items']
            for (var k = 0; k < skuList.length; k++) {
              if (typeof cartMap[skuList[k]['item_id']] != "undefined") {
                if (typeof data.items[i]['user_cart_quantity'] != "undefined") {
                  data.items[i]['cart_id'] = cartMap[skuList[k]['item_id']]['cart_id'];
                  data.items[i]['user_cart_quantity'] = data.items[i]['user_cart_quantity'] + cartMap[skuList[k]['item_id']]['quantity'];
                } else {
                  data.items[i]['cart_id'] = cartMap[skuList[k]['item_id']]['cart_id'];
                  data.items[i]['user_cart_quantity'] = cartMap[skuList[k]['item_id']]['quantity'];
                }
              } else {
              }

              //计算SKU总库存
              data.items[i]['product_quantity'] = data.items[i]['product_quantity'] + skuList[k]['item_quantity'] - skuList[k]['item_quantity_frozen']
            }

            //数据转换
            if (data.items[i]['product_spec'] && that.$.isJson(data.items[i]['product_spec'])) {
              data.items[i]['product_spec'] = JSON.parse(data.items[i]['product_spec'])
            } else {
              data.items[i]['product_spec'] = []
            }

            if (data.items[i]['product_uniqid'] && that.$.isJson(data.items[i]['product_uniqid'])) {
              data.items[i]['product_uniqid'] = JSON.parse(data.items[i]['product_uniqid'])
            } else {
              data.items[i]['product_uniqid'] = []
            }

            //data.items[i]['HasManualSku'] = data.items[i]['product_spec'].length > 1;
            data.items[i]['HasManualSku'] = data.items[i]['items'].length > 1;
          }

          //筛选辅助属性
          /*
          if (that.assist.length == 0) {
            for (var i = 0; i < data.assists.length; i++) {
              for (var j = 0; j < data.assists[i]['items'].length; j++) {
                data.assists[i]['items'][j].assist_is_unselected = true
              }
            }
            that.setData({
              assist: data.assists
            })
          }
           */
          if (that.requestNewFlag) {
            that.setData({
              requestNewFlag:false,
              pdlist: []
            });
          }

          if (200 == status && data.items.length > 0) {
            if (data.page >= data.total || data.page >= that.maxNumber) {
              that.setData({
                flag: false,
                ispage: false,
                pdlist: that.pdlist.concat(data.items),
              })
            } else {
              that.setData({
                flag: true,
                ispage: true,
                pdlist: that.pdlist.concat(data.items),
              })
            }

            that.setData({
              isdata: true
            })

          } else {
            that.setData({
              flag: false,
              ispage: false,
              isdata: false
            })
          }


          callback && callback();

        }
      });
    },

    scrolltoupper: function (t) {
      this.old.scposition = t.detail.scrollTop;
    },
    returnTop: function () {
      var that = this;

      // 解决view层不同步的问题
      that.setData({
        scposition: this.old.scposition
      })

      this.$nextTick(function () {
        that.setData({
          scposition: 0
        })
      });
    },
    onCloseFilter() {
      this.rightDrawerVisible = false;
      uni.$emit('onOpenFilter', false)
    },
    onOpenFilter() {
      this.rightDrawerVisible = true;
      uni.$emit('onOpenFilter', true)


      //
      let that = this;

      if (!that.post.category_id) {
        return
      }

      if (that.assist.length == 0) {
        that.$.request({
          url: that.Config.URL.pt.listFilter,
          data: {category_id: that.post.category_id},
          ajaxCache: {
            timeout: this.Config.CACHE_EXPIRE
          },
          success: function (data, status, msg, code) {
            let contracts = data.contracts;

            for (var i = 0; i < contracts.length; i++) {
              contracts[i].contract_is_unselected = true;
            }

            that.setData({contract_row: contracts});


            let markets = data.markets;

            for (var i = 0; i < markets.length; i++) {
              markets[i].market_is_unselected = true;
            }

            that.setData({market_row: markets});

            //筛选辅助属性
            for (var i = 0; i < data.assists.length; i++) {
              for (var j = 0; j < data.assists[i]['items'].length; j++) {
                data.assists[i]['items'][j].assist_is_unselected = true
              }
            }

            that.setData({
              assist: data.assists
            })
          }
        });
      }
    },

    setType(type) {
      this.inverted[type] = !this.inverted[type];
    },

    setContract(index) {
      this.contract_row[index].contract_is_unselected = !this.contract_row[index]
          .contract_is_unselected;
    },

    setMarket(index) {
      console.info(this.market_row[index]);
      this.market_row[index].market_is_unselected = !this.market_row[index].market_is_unselected;
    },

    setAssist(aid, index) {
      console.info(this.assist[aid]['items'][index]);
      this.assist[aid]['items'][index].assist_is_unselected = !this.assist[aid]['items'][index].assist_is_unselected;
    },
    // 重置
    onRest: function () {

      this.post.sidx = "product_sale_num";
      this.post.sord = "DESC";
      this.post.isnew = !1;
      this.post.keywords = "";
      //this.post.store_category_ids = null;
      this.post.page = 1;
      this.post.store_id = "";

      this.post.product_unit_price_min = "";
      this.post.product_unit_price_max = "";

      this.post.points_from = null;
      this.post.points_to = null;

      this.post.virtual = null;
      this.post.store_type = 1;


      this.post.activity_type_ids = [];
      this.post.product_tags = [];

      this.contract_row = [];
      this.market_row = [];
      this.assist = [];

      (this.inverted = {
        gift: true,
        groupbuy: true,
        xianshi: true,
        virtual: true,
      });

      this.onFilter();
      this.onCloseFilter()
    },
    //列表购物车
    addCart: async function (e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let step = parseInt(e.currentTarget.dataset.step);
      let user_cart_quantity = parseInt(e.currentTarget.dataset.num);

      let params = {
        item_id: e.currentTarget.dataset.skuid,
        cart_quantity: step,
        activity_id: 0,
        chain_id: 0,
      };

      if (e.currentTarget.dataset.stock == user_cart_quantity) {
        that.$.alert(that.$.__("亲~商品没有库存啦！"));
        return
      }

      if (e.currentTarget.dataset.is_virtual)
      {
        that.$.navigateTo({
          url: "/pagesub/checkout/checkout?ifcart=0&cart_id=" + params.item_id + "|" + params.cart_quantity + "|" + 0 + "&chain_id=" + params.chain_id
        })

        return
      }

      await this.$store.dispatch(`addCart`, {
        params: params, callback: (data, status, msg, code) => {
          if (status == 200) {

            // that.pdlist[index].cart_id = data.cart_id
            // that.pdlist[index].user_cart_quantity = that.pdlist[index].user_cart_quantity + step
            //that.$.alert(that.$.__('添加购物车成功'));

            that.$set(that.pdlist[index], 'cart_id', data.cart_id)
            that.$set(that.pdlist[index], 'user_cart_quantity', that.pdlist[index].user_cart_quantity + step)

            //多规格下购物车
            that.chooseItem['cart_id'] = data.cart_id
            that.chooseItem['user_cart_quantity'] = that.chooseItem['user_cart_quantity'] + step

            if (that.plantformInfo.prodcut_addcart_flag) {
              that.$store.dispatch(`getCartList`, function (data) {})
            }
          }
        }
      })

      this.$forceUpdate();
    },

    subCart: async function (e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let step = parseInt(e.currentTarget.dataset.step);
      let user_cart_quantity = parseInt(e.currentTarget.dataset.num);

      let params = {
        cart_id: e.currentTarget.dataset.cart_id,
        cart_quantity: user_cart_quantity + step,
        activity_id: 0,
        chain_id: 0,
      };

      if (user_cart_quantity+step < 0) {
        that.$.alert(that.$.__("亲~购物车已经没有啦！"));
        return
      }

      await this.$store.dispatch(`editCartQuantity`, {
        params: params, callback: (data, status, msg, code) => {
          if (status == 200) {
            that.pdlist[index].user_cart_quantity = that.pdlist[index].user_cart_quantity + step
            //that.$.alert(that.$.__('添加购物车成功'));

            //多规格下购物车
            that.chooseItem['user_cart_quantity'] = that.chooseItem['user_cart_quantity'] + step

            if (that.plantformInfo.prodcut_addcart_flag) {
              that.$store.dispatch(`getCartList`, function (data) {})
            }
          }
        }
      })
    },

    closeSpecBox: function(e) {
      this.setData({
        chooseCartSpecBoxFlag: false,
        chooseIndex: 0,
      });
    },
    showProduct: function(e) {
      let that = this;
      let index = e.target.dataset.index
      let item_id = e.target.dataset.item_id
      that.showItem(index, item_id);
    },
    showItem: function(index, item_id) {
      let that = this;
      let chooseProduct = that.pdlist[index]

      that.setData({
        chooseCartSpecBoxFlag: true,
        chooseIndex: index,
        chooseProduct: chooseProduct,
      });


      let params = {
        item_id: item_id
      };
      that.$.request({
        url: this.Config.URL.pt.item,
        data: params,
        loading: false,
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE,
          forceRefresh: false
        },

        success: function (data, status, msg, code) {
          if (200 == status) {
            let chooseItem = data.item_row
            let item_spec = JSON.parse(chooseItem.item_spec)
            let product_spec = chooseProduct.product_spec
            let product_uniqid = JSON.parse(data.product_uniqid)

            that.spec_item_map = {}

            //读取商品规格信息
            if (product_spec.length > 0) {
              for (var n in product_spec) {
                for (var r in product_spec[n].item) {
                  if (item_spec[n].item.id == product_spec[n].item[r].id) {
                    product_spec[n].item[r].select = true;
                  } else {
                    product_spec[n].item[r].select = false;
                  }

                  that.spec_item_map[product_spec[n].item[r].id] = 1;

                  //start 判断规格值是否可点
                  let spec_item_ids = []
                  spec_item_ids.push(product_spec[n].item[r].id)
                  for (var spec_tmp_index in item_spec) {
                    if (n != spec_tmp_index)
                    {
                      spec_item_ids.push(item_spec[spec_tmp_index]['item']['id']);
                    }
                  }

                  let tmp_id = spec_item_ids.sort(function (a, b) {
                    return a - b;
                  }).join("-");

                  console.info(tmp_id)
                  console.info(product_uniqid[tmp_id][3])

                  if (typeof product_uniqid[tmp_id][3] != "undefined")
                  {
                    if (product_uniqid[tmp_id][3] == that.StateCode.PRODUCT_STATE_NORMAL)
                    {
                      that.spec_item_map[product_spec[n].item[r].id] = 1;
                    }
                    else
                    {
                      that.spec_item_map[product_spec[n].item[r].id] = 0;
                    }

                    console.info(that.spec_item_map[product_spec[n].item[r].id])
                  }
                  else
                  {
                    that.spec_item_map[product_spec[n].item[r].id] = 1;
                  }
                  //end 判断规格值是否可点
                }
              }
            }

            console.info(that.spec_item_map)

            //修正购物车数量
            if (typeof that.cartMap[data.item_row.item_id] == "undefined") {
              data.item_row['cart_id'] = 0;
              data.item_row['user_cart_quantity'] = 0;
            } else {
              data.item_row['cart_id'] = that.cartMap[data.item_row.item_id]['cart_id'];
              data.item_row['user_cart_quantity'] = that.cartMap[data.item_row.item_id]['quantity'];
            }

            that.setData({
              chooseItem: data.item_row
            });
          }
        }
      })


    },

    selectSpec: function (e) {
      let that = this;
      if (!e.target.dataset.enable) {
        return;
      }

      var params = {
            spid: e.target.dataset.spid,
            ckid: e.target.dataset.ckid,
      }

      let item_spec = JSON.parse(that.chooseItem.item_spec)

      var uniqid, spec_ids = [];
      for (var spec_key in item_spec) {
        if (params.spid == item_spec[spec_key].id) {
          spec_ids.push(params.ckid);
        } else {
          spec_ids.push(item_spec[spec_key].item.id);
        }
      }

      uniqid = spec_ids.sort(function (a, b) {
        return a - b;
      }).join("-");


      let item_id = that.chooseProduct.product_uniqid[uniqid][0];
      that.showItem(that.chooseIndex, item_id);
    },
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/store_tpl.scss';


/*全部商品 start*/
.m-navbar-item {
  padding: 20rpx 0;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #555555;
  line-height: 44rpx;
  justify-content: center;

  i {
    font-size: 0rpx;
    /*
    line-height: 0;
    vertical-align: middle;
    display: inline-block;
    width: 0rpx;
    height: 0rpx;
    margin-left: 9.375rpx;
    border-width: 9.375rpx;
    border-color: #aaa transparent transparent transparent;
    border-style: solid dashed dashed dashed;
    */

    &:before {
      font-size: 14px;
      line-height: 1.5;
    }
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
  /*
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
   */
}

.m-sort {
	padding: 0 44upx 0 0;
	box-sizing: border-box;
	width: 100%;
	text-align: center;
	position: relative;
	image {
		width: 18upx;
		height: 20upx;
		right: 65upx;
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
	.uni-icons{
		right: 60upx;
		position: absolute;
		top:50%;
		transform: translateY(-50%);
		color: $default-skin-bg !important;
		font-weight: 700;
	}
}

/*全部商品 end*/
.m-product-price1 {
  display: flex;
  justify-content: space-between;

  label {
    font-weight: initial;
  }
}

.m-listv {
  .m-product-price1 {
    width: 312rpx;
  }
}

.m-listv.m-product-list {
  padding: 0;
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

.u-pa .m-tab-top {
  top: 0;
}

.u-pa .m-tab-fixed {
  position: fixed !important;
}

.filter-box {
  top: var(--window-top);
}

.filter-box-top {
  top: 0;
}

.tag-view {
  margin: 10rpx 20rpx;
  display: inline-block;
}

.uni-numbox-value {
  border: 2rpx solid #cccccc;
  background-color: #ffffff;
  width: 220rpx;
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
}


/* */
.product-list {
  position: relative;
  z-index: 1;

  &:hover {
    z-index: 2;
  }

  .no_goods {
    .no_shadow {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 11;
      opacity: 0.7;
      background-color: #B2B2B2;
    }

    .no_goods_tip {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 12;
      text-align: center;
      height: 60rpx;
      line-height: 60rpx;
    }

    position: absolute;
    z-index: 10;
    height: 60rpx;
    line-height: 60rpx;
    color: #fff;
    font-size: 26rpx;
    width: 100%;
    bottom: 0;
    left: 0;
    width: 100%;
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


.u-pa {
  position: inherit !important;
}

.u-pa .m-product-list {
  padding-top: 0rpx;
}

.u-pa .m-tab {
  position: relative;
}

.m-product-box {
  margin-top: calc(var(--window-top) + 4rpx);
}

.dropItem {
}


.u-pa .m-product-list {

}

.m-listv .m-product-item:nth-child(1) {
  margin-top: 20rpx !important;
}

.m-listv .m-product-item:nth-child(2) {
  margin-top: 20rpx !important;
}


.m-listv .m-product-item:nth-child(odd) {
  margin-left: 0;
  margin-left: 12rpx;
}

/* #ifdef MP-WEIXIN */
.m-listv .m-product-item:nth-child(odd) {
  margin-left: 20rpx;
}
/* #endif */

.m-listv .m-product-item:nth-child(even) {
  margin-right: 0;
  margin-left: 12rpx;
}

.tag {
  display: inline-block;
  /* width: 60px; */
  height: 20rpx;
  line-height: 24rpx;
  text-align: center;
  color: #fff;
  font-size: 22rpx;
  vertical-align: top;
  margin-right: 4rpx;
  /* top: 3px; */
  /* position: absolute; */
  margin-top: 14rpx;
  border-radius: 6rpx;
  /* transform: scale(0.5); */
}

.tag span {
  transform: scale(0.8) !important;
}


.tag-view {
  margin: 10rpx 4rpx;
  display: inline-block;
}

.uni-numbox-value {
  text-align: center;
  display: inline-block;

  width: 220rpx;
  height: 72rpx;
  background: #f5f5f5;
  border-radius: 18rpx;
}

.uni-dot {
  text-align: center;
  display: inline-block;

  width: 26rpx;
  height: 72rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #888888;
  line-height: 72rpx;
  padding: 0 22rpx;
}

.drawer-box {
  padding: 10rpx;
  padding-top: calc(var(--window-top) + 0rpx);


  .filter-btn-blank {
    height: calc(var(--window-top) + 120rpx);
    line-height: calc(var(--window-top) + 120rpx);
  }

  .filter-btn {
    width: 100%;
    background: #fff;

    position: fixed;
    bottom: 0rpx;
    height: calc(var(--window-top) + 120rpx);
    line-height: calc(var(--window-top) + 120rpx);
    display: flex;

    padding-top: 20rpx;
  }
}


.p-bottom {
  padding-bottom: 74rpx;
  display: flex;
  width: 520rpx;

  .button {
    width: 50%;
    height: 80rpx;
    line-height: 80rpx;
  }

  .reset{
    background: lighten($default-skin-bg, 6.5%);border-radius: 18rpx 0px 0px 18rpx;
  }

  .confirm{
    background: $default-skin-bg;border-radius: 0px 18rpx 18rpx 0px;
  }
}

.p-top {
  text-align: center;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 700;
  color: #333333;

  position: relative;
}

.p-content-top {
  /* #ifdef MP */
  height: 60rpx;
  /* #endif */
  /* #ifndef MP */

  /* #endif */
}

.p-content {
  padding-top: 40rpx;
}

.p-content-title {
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 700;
  color: #222222;
  line-height: 40rpx;
  padding-bottom: 20rpx;
}

.p-lists {
  display: flex;
  flex-wrap: wrap;

  .uni-tag {
    width: 110rpx;
    height: 70rpx;
    margin-right: 16rpx;
    margin-bottom: 4rpx;
    background: #f5f5f5;
    border-radius: 18rpx;
    border: 2rpx solid #f5f5f5;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222 !important;
    line-height: 70rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }

  .uni-tag--ss {
    border: 2rpx solid $default-skin-bg;
    background-color: #f7e9e9;
  }

  .ss-uni-tag--inverted {
    background-color: #f5f5f5;
    border: 2rpx solid #f5f5f5;
  }
}

.money{
  font-size: 14px;
}

.m-product-price1{
  position: relative;
}

.multi-spec-box{
  color: $default-skin-bg;

  position: absolute;
  right: 0;
  bottom: 0;

  .item-num-box{
    display:flex; height:24px;line-height: 24px;
  }

  .item-num-over{}

  .iconfont{
    font-size: 20px;
  }

  .icon-jian{
    margin-top:0px;
  }
  .icon-add{
    margin-top:-2px;
  }

  .item-num-add{font-size: 12px;width: 50rpx;text-align: center;}
  .item-num-choose{
    font-size: 12px;
    width: 76rpx;
    padding: 4rpx 10rpx;
    text-align: center;
  }
}

.item_disabled {
  background-color: #ddd !important;
  cursor: not-allowed;
}
</style>
