<template>
  <view :class="[isFilterFixed ? 'u-pa' : ''] ">
    <view :class="['m-tab', isFilterFixed ? 'm-tab-fixed' : 'm-tab-top'] "  :style="'top:' + fixTop + 'px'"  v-if="isShowFilter && tabs.length > 0">

      <scroll-view class="m-navbar scroll-view_H " scroll-x style="width: 94%" :show-scrollbar="true">
        <view class="m-navbar-info">
          <block v-for="(tab,index) in tabs" :key="index">
            <view class="m-navbar-item" :class="index == key ? 'item-on' : ''" @click="switchTabs(index)">
              {{ tab.name }}

              <label class="iconfont zc zc-youxiajiao active-icon" v-if="(index == key)"></label>
            </view>
          </block>
        </view>
      </scroll-view>

      <scroll-view scroll-top="200" class="m-navbar scroll-view_H" scroll-x
                   :style="'width:' + ((tabs[key].sidx && tabs[key].sort) ? '80%' : '94%')" :show-scrollbar="true"
                   v-if="(tabs[key].isShowFilter)">
        <block v-for="(price,index) in prices" :key="index">
          <view class="filter-item " :class="priceIndex == index ? 'filter-item-on' :''"
                @click="selectPriceIndex(index)">
            {{ price.title }}
          </view>
        </block>
      </scroll-view>


    </view>
    <view scroll-y="true" :class="['m-product-all  u-pa', isShowFilter && isFilterFixed ? 'm-product-box' : '']"
          :style="{backgroundColor:bgColor}">

      <view :class="{'m-product-list':1, 'm-listv':viewtype==1}" v-if="(isdata)" style="width: 100%;">
        <block v-for="(item, i) in pdlist" :key="i">
          <block
              v-if="((priceIndex == -1) || (post.product_unit_price_max > 0 ? item.ItemSalePrice >= post.product_unit_price_min && item.ItemSalePrice <= post.product_unit_price_max : item.ItemSalePrice >= post.product_unit_price_min))">
            <navigator v-if="(!isFG)"
                       :url="(item.is_virtual?'/pagesub/product/detail':'/pagesub/product/detail') + '?pid=' + (item.id)"
                       class="m-product-item" :style="{marginLeft:(i%2==0 ? 10-paddingLeft : 5)*2 + 'rpx'}">
              <view class="m-product-img product-list">
                <view class="m-img-number" :class="'m-img-' + (i > 3 ? 3 : i)" v-if="(isShowNumber)">
                  <span>{{ i + 1 }}</span>
                </view>
                <image lazy-load :src="($.img(item.product_image, 360,  360))" v-if="item.product_image"/>
              </view>
              <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;">
                <view class="m-product-name2">
                  <label>
                    <text class="tag tag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">
                      {{ item.activity_type_name }}
                    </text>
                    <text class="tag tag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">
                      {{ item.activity_type_name }}
                    </text>
                    <text class="tag tag-saleoff"
                          v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">
                      {{ item.activity_type_name }}
                    </text>
                    <text class="tag tag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">
                      {{ item.activity_type_name }}
                    </text>
                    {{ item.SalesName }}</label>
                </view>

                <view class="m-product-price1">
                  <view class="money">
                    <block v-if="item.ItemSalePrice">
                      <label>{{ __('￥') }}</label>{{ number_format(item.ItemSalePrice, 2) }}
                    </block>
                  </view>
                  <view class="num" v-if="(false && plantformInfo.config.product_salenum_flag && item.SaleNum>0)">
                    <text>{{ __('已售') }}</text>
                    <label style="color:#db384c;margin-left: 2px;">{{ item.SaleNum }}</label>
                  </view>
                  <view class="add-cart hide">
                    <uni-icons type="plusempty" size="20" color="#fff"></uni-icons>
                  </view>
                  <view :class="'c'+1" v-if="false">
                  </view>
                </view>
              </view>
            </navigator>
          </block>

        </block>


      </view>
      <navigator url="/pagesub/search/search" redirect="true" class="m-nullpage" v-else>
        <view class="m-nullpage-middle">
          <label class="iconfont icon-sousuo-sousuo"></label>
          <view class="m-null-tip">
            <text>{{ __('亲~找不到您想要的商品') }}</text>
            <text>{{ __('再多点提示呗') }}</text>
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
          <view class="u-loadmore u-loadmore-line">
            <text class="u-loadmore-tips">{{ __('没有更多数据啦！') }}</text>
          </view>
        </block>
      </view>
    </view>


  </view>
</template>


<script>
import uniDrawer from '@/components/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import {mapMutations, mapState} from 'vuex';

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
    priceList: {
      type: String,
      default: ''
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

      prices: [],
      priceIndex: -1,
      sidxName: '排序',


      key: 0,
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
        store_type: 1,
        product_ids: ''
      },

      tabs: [],

      rightDrawerVisible: false,

      inverted: {
        gift: true,
        groupbuy: true,
        xianshi: true,
        virtual: true
      },
      contract_row: [],
      market_row: [],
      isShowNumber: false,
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
    'hasLogin'
  ]),
  created() {
    var that = this;

    var h = that.$.getSystemInfoSync().windowHeight;

    that.setData({
      h: h
    })


    var post = this.post;
    var options = this.options;


    let tmp_opt = this.optionStr;


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
        product_tags: options.tag_id ? [options.tag_id] : [],
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
        activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
        contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
        market_category_ids: options.market_category_id ? [options.market_category_id] : [],
        assist: {},
        product_ids: options.data[0].ids


      },
      tabs: options.data ? options.data : []
    });


    if (this.tabs) {
      this.tabs.map(function (value, index) {
        if (value.title) {
          that.tabs[index].prices = that.priceTabs(value.title)
        }
        if (value.options) {

          if (typeof value.options == 'string') {
            var parse = JSON.parse(value.options);
            that.tabs[index].sidx = parse.sidx
            that.tabs[index].sort = parse.sort
          } else {
            that.tabs[index].sidx = value.options.sidx
            that.tabs[index].sort = value.options.sort
          }


        }
      })

      this.prices = this.tabs[0].prices
      this.isShowNumber = this.tabs[0].isShowNumber
      this.post.sidx = this.tabs[0].sidx ? this.tabs[0].sidx : ''
      this.post.sort = this.tabs[0].sort ? this.tabs[0].sort : ''
      this.editSidxName()
      //console.log(this.tabs)

    }

    if (this.post.product_ids) {

      this.GetPlist(function () {
        that.pdlist.length == 0 ? that.setData({isdata: false}) : that.setData({isdata: true});
      });
    } else {
      this.isdata = !1;
      return;

    }


    uni.$on('diy-scrollbottom', function (data) {
      console.log('监听到事件来自 update ，携带参数 uniId 为：' + data.uniId);

      if (data.uniId == that.uniId) {
        console.log('监听到 scrollbottom');
        console.info(that.$refs)
        that.scrollbottom();
      }
    })
  },
  watch: {
    isFilterTop0(newVal, oldVal) {
      console.log(newVal)
    },
    options(newVal, oldVal) {
      this.setData({
        pdlist: []
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
          product_tags: options.tag_id ? [options.tag_id] : [],
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
          activity_type_ids: options.activity_type_id ? [options.activity_type_id] : [],
          contract_type_ids: options.contract_type_id ? [options.contract_type_id] : [],
          market_category_ids: options.market_category_id ? [options.market_category_id] : [],
          assist: {},
          product_ids: options.data[0].ids

        },
        tabs: options.data ? options.data : []
      });


      if (this.tabs) {
        this.tabs.map(function (value, index) {
          if (value.title) {
            that.tabs[index].prices = that.priceTabs(value.title)
          }
          if (value.options) {

            if (typeof value.options == 'string') {
              var parse = JSON.parse(value.options);
              that.tabs[index].sidx = parse.sidx
              that.tabs[index].sort = parse.sort
            } else {
              that.tabs[index].sidx = value.options.sidx
              that.tabs[index].sort = value.options.sort
            }


          }
        })

        this.prices = this.tabs[0].prices
        this.isShowNumber = this.tabs[0].isShowNumber
        this.post.sidx = this.tabs[0].sidx
        this.post.sort = this.tabs[0].sort
      }

      if (this.post.product_ids) {

        this.GetPlist(function () {
          that.pdlist.length == 0 ? that.setData({isdata: !1}) : that.setData({isdata: !0});
        });
      } else {
        this.isdata = !1;
        return;

      }

    },


  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    pdprice: function () {
      this.post.sort = this.post.sort == 'DESC' ? 'ASC' : 'DESC';
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
        pdlist: [],
        post: post,
        is_filter: is_filter
      });

      this.GetPlist();

      this.rightDrawerVisible = false;
    },

    editSidxName: function () {
      console.log(this.post.sidx)
      if (this.post.sidx == 'product_unit_price') {
        this.sidxName = '价格';
      } else if (this.post.sidx == 'product_sale_num') {
        this.sidxName = '销量';
      } else if (this.post.sidx == 'product_favorite_num') {
        this.sidxName = '收藏';
      } else if (this.post.sidx == 'product_add_time') {
        this.sidxName = '新品';
      } else if (this.post.sidx == 'product_order') {
        this.sidxName = '排序';
      }
    },
    priceTabs: function (priceList) {

      if (priceList) {

        var list = priceList.split(',');
        var price = [];
        for (var i in list) {
          i = parseInt(i)
          if (list[i + 1]) {
            if (i == 0) {
              price.push({
                from: list[i],
                to: parseFloat(list[i + 1]),
                title: parseFloat(list[i]) + '-' + list[i + 1]
              })
            } else {
              price.push({
                from: parseFloat(list[i]) + 1,
                to: parseFloat(list[i + 1]),
                title: parseFloat(list[i]) + 1 + '-' + list[i + 1]
              })
            }

          } else {
            price.push({
              from: parseFloat(list[i]),
              to: 0,
              title: list[i] + '以上'
            })
          }
        }

        return price
        console.log(this.prices)
      }

    },
    selectPriceIndex: function (index) {
      var that = this;
      this.priceIndex = index;
      this.post.product_unit_price_min = this.prices[index].from;
      this.post.product_unit_price_max = this.prices[index].to;
    },

    switchTabs: function (index) {


      var that = this;
      var tab = this.tabs[index]
      this.setData({
        key: index,
        prices: tab.prices,
        priceIndex: -1,
        isShowNumber: tab.isShowNumber
      })
      this.post.product_unit_price_min = 0;
      this.post.product_unit_price_max = 0;
      this.post.sidx = tab.sidx ? tab.sidx : "";
      this.post.sort = tab.sort ? tab.sort : "";
      this.post.page = 1;
      this.post.product_ids = tab.ids;
      console.log(tab)
      this.editSidxName()

      if (this.post.product_ids.length > 0) {
        this.GetPlist(function () {
          that.pdlist.length == 0 ? that.setData({isdata: !1}) : that.setData({isdata: !0});
        });
      } else {
        this.isdata = !1;
        return;
      }

    },


    assistItemReset: function (e) {
      var aid = parseInt(e.target.dataset.aid);

      let assist = this.assist.concat();
      var items = assist[aid].items;

      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false;
      }

      this.setData({assist: assist})
    },

    assistItemChange: function (e) {
      var values = e.detail.value;
      var aid = parseInt(e.target.dataset.aid);

      let assist = this.assist.concat();
      var items = assist[aid].items;

      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false;
        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].assist_item_id == values[j]) {
            items[i].checked = true;
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
        items[i].checked = false;
        if (items[i].assist_item_id == value) {
          items[i].checked = true;
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
      params.item_id = that.post.product_ids;

      that.$.request({
        url: this.Config.URL.pt.listItem,
        data: params,
        loading: false,
        method: "GET",
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE
        },
        success: function (data, status, msg, code) {
          that.setData({
            pdlist: []
          });

          for (var i = 0; i < data.items.length; i++) {
            data.items[i]['id'] = data.items[i]['item_id'];
            data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
            data.items[i]['ProductName'] = data.items[i]['product_name'];
            data.items[i]['ProductTips'] = data.items[i]['product_tips'];
            data.items[i]['SalesName'] = data.items[i]['product_name'];
            data.items[i]['ProductPic'] = data.items[i]['product_image'];
            data.items[i]['ItemSalePrice'] = parseFloat(data.items[i]['item_unit_price']);
            data.items[i]['SaleNum'] = data.items[i]['product_sale_num'];
            data.items[i]['Stock'] = data.items[i]['product_quantity'];
            data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
            data.items[i]['user_cart_quantity'] = 1;

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

            data.items[i]['HasManualSku'] = data.items[i]['product_spec'].length > 1;
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
    },
    onOpenFilter() {
      this.rightDrawerVisible = true;


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
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables.scss';

.m-navbar {
  background-color: #f5f5f5;
  padding: 0 24rpx;

}

/*全部商品 start*/
.m-navbar-item {
  // width:172rpx;
  padding: 20rpx;
  font-size: 28rpx;
  height: 36rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #222222;
  line-height: 40rpx;
  letter-spacing: 1rpx;
  position: relative;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
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

.num {
  font-size: 24rpx;
  color: #717171;
  // padding-right: 20rpx;
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
}

.m-listv .m-product-item:nth-child(even) {
  margin-right: 0;
}

.scroll-view_H {
  width: 100%;
  white-space: nowrap;


  .m-navbar-item {
    display: inline-block;


    .active-icon {
      position: absolute;
      bottom: 0rpx;
      right: -10rpx;
      color: $default-skin-bg;

      &:before {
        font-weight: bold;
      }
    }
  }
}

.money {
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: $default-skin-bg;
  line-height: 50rpx;
}

.add-cart {
  width: 50rpx;
  height: 50rpx;
  background: $default-skin-bg;
  border-radius: 18rpx;
  text-align: center;
  line-height: 50rpx;
}

.filter-item {
  display: inline-block;

  padding: 10rpx 18rpx;
  margin-right: 30rpx;
  margin-top: 4rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 40rpx;
  line-height: 32rpx;

  margin-bottom: 4rpx;
}

.filter-item-on {
  color: $default-skin-bg;
  border-radius: 34rpx;
  border: 2rpx solid $default-skin-bg;
}

.m-listv .m-product-name2 {
  line-height: 32rpx;
  height: 64rpx;
}

.item-on {
  font-size: 32rpx;
  font-weight: 600;
  color: #222222;
  line-height: 44rpx;
  margin-left: -10px;
}

.m-navbar-info {
  display: flex;
  justify-content: space-between;
}

.m-img-number {
  position: absolute;
  top: 20rpx;
  left: 18rpx;
  width: 54rpx;
  height: 56rpx;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: 54rpx 56rpx;

  span {
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 44rpx;
  }
}

.m-img-0 {
  background-image:url('https://static.shopsuite.cn/xcxfile/appicon/rank/1.png')
}

.m-img-1 {
  background-image:url('https://static.shopsuite.cn/xcxfile/appicon/rank/2.png')
}

.m-img-2 {
  background-image:url('https://static.shopsuite.cn/xcxfile/appicon/rank/3.png')
}

.m-img-3 {
  background-image:url('https://static.shopsuite.cn/xcxfile/appicon/rank/4.png')
}


.m-screen {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 40rpx;

  .sort-img {
    width: 20rpx;
    height: 12rpx;
    margin-top: 2px;
  }
}

.tab-filter {
  width: 100%;
  height: 60rpx;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}

</style>
