<template>
  <view class="page">
    <block v-if="(isdata)">
      <header-nav-menu ref="headerNavMenu" :menu="nav_nemu"></header-nav-menu>
      <scroll-view class='u-pa1 fix-titlenview-trans' scroll-y="true" :scroll-top="scposition" @scroll="scrolltoupper">
        <view class="m-banner-ad">
          <swiper :indicator-dots="false" autoplay="true" interval="3000" duration="300" @change="swiperImg">
            <swiper-item v-for="(item, ii) in ProductInfo.productPicList" :key="ii">
              <view class="no_goods" v-if="ProductInfo.if_store==false">
                <view class="no_shadow"></view>
                <text class="no_goods_tip">{{ __('售罄，补货中') }}</text>
              </view>
              <image lazy-load class="slide-image" mode="aspectFill" :src="(item.path)" :data-src="(item.path)"
                     @click="previewProductImg"/>
            </swiper-item>
          </swiper>
          <navigator v-if="(ProductInfo.product_video)" :url="ProductInfo.pv_url" class="video">
            <image lazy-load src="/static/images/play.png" style="width:100rpx;height:100rpx"></image>
          </navigator>
          <view class="indicator-point" v-if="ProductInfo.productPicList.length">
            {{ currentSwipperImageIndex }}/{{ ProductInfo.productPicList.length }}
          </view>
        </view>


        <view :class="['product-info', ProductInfo.activity_base_row ? 'activity-fixtop' : '']">
          <view class="m-cells" style="margin-top:0rpx" v-if="true">
            <view class="m-cell m-info-box info-content">
              <view class="m-cell-bd">
                <view class="m-info-price">
				 <block v-if="ProductInfo.showPrice">
				   <text>{{ __('￥') }}</text>
				   {{ number_format(ProductInfo.itemSalePrice, 2) }}
				 </block>

                  <block v-if="ProductInfo.item_row.item_unit_points && !b2bFlag">
                    <text style="margin-left: 20rpx;font-weight: bold;">+
                      <text style="font-size:32rpx;font-weight: bold;">{{ ProductInfo.item_row.item_unit_points }}</text>
                      {{ __('积分') }}
                    </text>
                  </block>

                  <block v-if="ProductInfo.item_unit_sp">
                    <text style="margin-left: 20rpx;">+
                      <text style="font-size:32rpx">{{ ProductInfo.item_unit_sp }}</text>
                      {{ __('众宝') }}
                    </text>
                  </block>

                  <block v-if="plantformInfo.product_salenum_flag">
                    <view class="dis" style=""
                          v-if="(ProductInfo.kind_id != 1201 && ProductInfo.product_sale_num>0)">
                      <view class="num">{{ __('已服务') }}
                        <text style="color:red">{{ ProductInfo.product_sale_num || 0 }}</text>
                        {{ __('人次') }}
                      </view>
                    </view>
                    <view class="dis"
                          v-if="(ProductInfo.kind_id == 1201 && ProductInfo.product_sale_num>0)">
                      <view class="num">{{ __('已售') }}
                        <text style="color:red;font-weight: bold;font-size: 12px;margin-left:1px;">
                          {{ ProductInfo.product_sale_num || 0 }}
                        </text>
                        {{ __('') }}
                      </view>
                    </view>
                  </block>

                  <view class="favorite-share">
                    <label @click="PDCollection" :data-id="(ProductInfo.item_id)"
                           :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?' highlight ':'']">
                    </label>
                    <label class="iconfont zc zc-share" @click='onShareBox(1)'></label>
                  </view>

                </view>
                <view class="nameBox">
                  <view class="m-info-name">{{ ProductInfo.product_name }}</view>
                </view>
                <label>{{ ProductInfo.product_tips || " " }}</label>
              </view>
            </view>
            <view v-if="(ProductInfo.SpecLst.length>0)" class="m-cell m-cell-access m-info-sp" @click="ckselectsp">
              <view class="m-cell-bd" style="display: flex;">
                <text class="m-info-tip" style="width:64rpx;line-height: 64rpx;">{{ __('已选') }}</text>
                <scroll-view scroll-x="true" class="spec-box-grids">
                  <view class="m-imfo-sp-selext m-panel-sp-labellist">
                    <block v-for="(items, i) in ProductInfo.SpecLst" :key="i">
                      <block v-for="(item, ii) in items.svLst" :key="i + '|' + ii">
                        <view v-if="(item.IsChecked)" class="spec-box-grid">{{ item.Name }}</view>
                      </block>
                    </block>
                  </view>
                </scroll-view>
              </view>
              <view class="m-cell-ft"></view>
            </view>

            <view v-if="false" class="m-cell m-cell-access m-info-sp" @click="onSelectAddress">
              <view class="m-cell-bd">
                <text class="m-info-tip">{{ __('产地') }}</text>
                <label class="m-imfo-sp-selext">
                  南京
                </label>

                <label class="m-imfo-sp-selext" style="float: right;">
                  溯源
                </label>
              </view>
              <view class="m-cell-ft"></view>
            </view>


            <view class="m-cell m-cell-access m-info-sp" @click="onSelectAddress" v-if="ProductInfo.kind_id == 1201">
              <view class="m-cell-bd">
                <text class="m-info-tip">{{ __('送至') }}</text>
                <label class="m-imfo-sp-selext">
                  {{ product_freight_info.district_info }}
                </label>

                <label class="m-imfo-sp-selext">
                  {{ product_freight_info.content || '' }}
                </label>
              </view>
              <view class="m-cell-ft"></view>
            </view>
            <view class="m-policy" v-if="(wholesale_policy_rows.length > 0)">
              <view class="m-cell-bd" style="padding:20rpx 30rpx;display:flex;flex-wrap: nowrap;">
                <view class="m-imfo-sp-title" style="width:50%;">
                  {{ __('价格') }}
                </view>

                <view class="m-imfo-sp-title">
                  {{ __('起批量') }}
                </view>
              </view>
              <view class="m-cell-bd" style="padding:20rpx 30rpx;display:flex;flex-wrap: nowrap;"
                    v-for="(row,ii) in wholesale_policy_rows" :key="ii">
                <label class="m-imfo-sp-money" style="width:50%;">
                  <span>{{ __('￥') }}</span>{{ row.policy_wholesale_price }}
                </label>

                <label class="m-imfo-sp-selext">
                  {{ row.item_quantity_str }}
                </label>
              </view>
            </view>


            <view class="m-cell m-cell-access m-info-sp">
              <view class="m-cell-bd">
                <text class="m-info-tip">{{ __('服务') }}</text>
                <label class="m-imfo-sp-selext">
                  <!-- {{ sprintf(__('由 %s 销售和发货，并提供售后服务'), store_info.store_name) }} -->
                  {{ __('销售和发货，并提供售后服务') }}
                </label>
                <view style="margin-left:56rpx;" v-if="ProductInfo.contracts.length > 0">
                  <label style="margin-left: 16rpx;margin-right: 0rpx;font-size: 12px;"
                         v-for="(ct, ci) in ProductInfo.contracts" :key="ci">
                    <image lazy-load :src="(ct.contract_type_icon)"
                           style="margin-right: 6rpx;width: 30rpx;height: 30rpx;vertical-align: middle;"/>
                    {{ ct.contract_type_name }}
                  </label>
                </view>
              </view>
            </view>
          </view>


          <!--评论-->
          <view class="evaluate" v-if="last_comments.length > 0 ">
            <view class="evaluate-top">
              <label
                  class="left">{{
                  __('用户评价')
                }}({{ ProductInfo.product_evaluation_num }})</label>
              <navigator :url="'/pagesub/product/commentlist?id=' + (proId)" class="evaluate-right">
                <label class="right">{{ __('全部评价') }}</label>
                <image style="width:16rpx;height:28rpx;position: absolute;margin-left:20rpx;margin-top:10rpx;"
                       src="https://static.shopsuite.cn/xcxfile/appicon/goto.png"/>
              </navigator>
            </view>
            <view class="evaluate-bottom">
              <scroll-view scroll-x="true" class="scroll-view_H" style="background:rgba(255,255,255,1);">
                <view class="scroll-view-item_H" v-for="(item, i) in last_comments" :key="i">
                  <view class="uesr-evaluate">
                    <view class="uesr-evaluate-center">
                      <view class="center-top">
                        <view class="user-image">
                          <image style="width:100%;height:100%;border-radius:50%;" :src="(item.user_avatar)"/>
                        </view>
                        <label class="user-name">{{ item.user_name }}</label>
                      </view>
                      <view class="user-text">
                        <label>{{ item.comment_content }}</label>
                      </view>
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>

          <!--店铺信息-->
          <view class="m-panel m-panel-access goods-detail-store"
                v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag) && false">
            <navigator redirect="true" :url="'/pagesub/index/store?store_id=' + (ProductInfo.store_id)">
              <view class="m-panel-hd store_name" style="height: 44rpx;">
                <label class="iconfont icon-store"></label>
                <label class="icon-mall" v-if="(store_info.store_is_selfsupport)">{{ __('自营') }}</label>
                <label class="icon-mall" style="color:#333;">{{ store_info.store_name }}</label>
              </view>
              <view class="m-panel-bd" style="clear: both;"> <!-- v-if="(!store_info.store_is_selfsupport)"  -->
                <view class="store-rate">
                  <label class="equal" style="width: 33%;">{{ __('描述相符') }}
                    <view style="padding-left: 10rpx;">{{ store_info.store_credit.store_desccredit.credit }}</view>
                    <!--<i></i>-->
                  </label>
                  <label class="equal" style="width: 33%;text-align: center;">{{ __('服务态度') }}
                    <view style="padding-left: 10rpx;">{{ store_info.store_credit.store_servicecredit.credit || '--' }}
                    </view>
                    <!--<i></i>-->
                  </label>
                  <label class="equal" style="width: 33%;text-align: right;">{{ __('发货速度') }}
                    <view style="padding-left: 10rpx;">{{ store_info.store_credit.store_deliverycredit.credit || '--' }}
                    </view>
                    <!--<i></i>-->
                  </label>
                </view>

                <view class="item-more"></view>
              </view>
            </navigator>
          </view>


          <!--评论-->
          <view
              :class="'m-panel m-panel-access m-comment ' + ((ProductInfo.analytics_row && ProductInfo.analytics_row.product_evaluation_num>0)?'':'hide')"
              v-if="false">
            <view class="m-panel-hd">
              {{ __('评价') }}（{{ ProductInfo.analytics_row ? ProductInfo.analytics_row.product_evaluation_num : 0 }}）
              <label v-if="(ProductInfo.analytics_row && ProductInfo.analytics_row.evaluation_percent)">{{ __('好评度') }}
                <text>{{ ProductInfo.analytics_row.evaluation_percent }}%</text>
              </label>
            </view>
            <view class="m-panel-bd">
              <view class="m-media-box m-media-box-appmsg" v-if="(last_comment)">
                <view class="m-media-box-hd">
                  <image lazy-load class="m-media-box-thumb" :src="(last_comment.user_avatar)"/>
                </view>
                <view class="m-media-box-bd">
                  <label class="m-media-box-title">{{ last_comment.user_nickname }}</label>
                  <view class="m-media-box-desc">
                    <view style="margin-bottom:10rpx;">
                      <label style="margin-right:10rpx;font-size:20rpx;">
                        {{ last_comment.item_name }}
                      </label>
                    </view>
                    <label v-if="(last_comment.comment_content!=null)">
                      {{ last_comment.comment_content }}
                    </label>
                  </view>

                  <view class="m-media-box-info">
                    <view class="m-media-box-info-meta m-start" v-for="(itemIndex, i) in [1, 2, 3, 4, 5]"
                          :key="i">
                      <label
                          :class="'iconfont icon-start ' + ((itemIndex<=last_comment.comment_scores)?'sel':'')"
                          :data-index="(itemIndex)" :data-type="1"></label>
                    </view>
                    <view class="m-media-box-info-meta m-tiem">{{ last_comment.comment_time }}</view>
                    <view class="m-media-list">
                      <image lazy-load v-for="(item, ii) in last_comment.comment_image" :key="ii"
                             :src="(item)" @click="ImgTap"></image>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="m-panel-ft"
                  v-if="(ProductInfo.analytics_row && ProductInfo.analytics_row.product_evaluation_num>1)">
              <navigator :url="'/pagesub/product/commentlist?id=' + (proId)" class="m-cell m-cell-access m-cell-link">
                <view class="m-cell-bd">{{ __('查看全部评论') }}</view>
                <text class="m-cell-ft"></text>
              </navigator>
            </view>
          </view>

        </view>
        <view>
          <view class="m-panel-access m-detail">
            <view class="m-tab">
              <view class="m-navbar">
                <view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')"
                      v-if="(ProductInfo.product_detail)"
                      @click="picDetail">
                  {{ __('商品详情') }}
                </view>
                <view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')"
                      v-if="(ProductInfo.product_extension)"
                      @click="spcParam">
                  {{ __('规格参数') }}
                </view>
                <view :class="'m-navbar-item ' + (tapindex==3?'m-navbar-item-on':'')" v-if="(ProductInfo.product_param)"
                      @click="packingList">
                  {{ __('包装清单') }}
                </view>
                <view :class="'m-navbar-item ' + (tapindex==5?'m-navbar-item-on':'')"
                      v-if="(ProductInfo.product_service)"
                      @click="showServiceTab">
                  {{ __('售后服务') }}
                </view>
              </view>
            </view>
            <view :class="'m-RichText ' + (tapindex==1?'':'hide')" v-if="ProductInfo.product_detail">
              <wxParse :content="ProductInfo.product_detail"  @navigate="navigate"  :imageProp="{lazyLoad:true, mode:'widthFix'}"/>
            </view>
            <view :class="'m-RichText ' + (tapindex==2?'':'hide')" v-if="ProductInfo.product_extension">
              <wxParse :content="ProductInfo.product_extension" :imageProp="{lazyLoad:true, mode:'widthFix'}"/>
            </view>
            <view :class="'m-RichText ' + 'm-Packinglist ' + (tapindex==3?'':'hide')" v-if="ProductInfo.product_param">
              <wxParse :content="ProductInfo.product_param" :imageProp="{lazyLoad:true, mode:'widthFix'}"/>
            </view>
           <view :class="' m-Packinglist ' + (tapindex==5?'':'hide')" v-if="ProductInfo.product_service">
              <rich-text type="text" :nodes="(ProductInfo.product_service)"/>
            </view>
          </view>
          <view class="m-tips" v-if="(!isChannel)">
            <view class="m-tips-logo">
              <image lazy-load mode="aspectFit" src="/static/images/logo_tech.png"></image>
            </view>
            <view class="m-tips-str">{{ __('商城套件系统提供技术支持') }} {{ versionNumber }}</view>
          </view>
        </view>

        <view class="u-cleanbox" style="height:calc(120rpx + env(safe-area-inset-bottom))"></view>
      </scroll-view>

      <view class="m-footer-btn bottom-safearea" :class="ProductInfo.kind_id != 1201 ? 'm-fg-btn' : ''">
        <block v-if="(ProductInfo.kind_id != 1201)">
          <view class="m-footer-btn-list">
            <view class="m-footer-btn-item" style="width: 50%;" @click="PDCollection" :data-id="(ProductInfo.item_id)">
              <view class="m-footer-btn-icon">
                <label
                    :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?' highlight ':'']"></label>
              </view>
              <text>{{ isCollection ? __('已收藏') : __('收藏') }}</text>
            </view>
			<!-- #ifdef MP-WEIXIN -->
            <view class="m-footer-btn-item" :data-id="(ProductInfo.item_id)" :data-name="(store_info.store_name)"
                  :data-keyword="(ProductInfo.keyWord)" :data-appid="(AppId)" :data-appurl="(chatUrl)" :data-type="10"
                  @click="tplGoToPage"
                  v-if="(chatUrl)" style="width: 50%;">
              <view class="m-footer-btn-icon">
                <!-- #ifdef MP-WEIXIN -->
                <block v-if="1==plantformInfo.kefu_type_id">
                  <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
                </block>
                <!-- #endif -->
                <label class="iconfont icon-more "></label>
              </view>
              <text>{{ __('客服') }}</text>
            </view>
			<!-- #endif -->

          </view>
          <block v-if="(!ProductInfo.normalStatus)">
            <view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
              {{ __('立即预约') }}
            </view>
            <view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
              {{ __('商品已下架') }}
            </view>
          </block>
          <block v-else-if="(!ProductInfo.if_store)">
            <view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
              {{ __('立即预约') }}
            </view>
            <view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
              {{ __('库存不足') }}
            </view>
          </block>
          <block v-else>
            <view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main m-now" style="width: 70%;"
                  @click="ckselectsp1">
              {{ __('立即预约') }}
            </view>
            <view v-else class="m-footer-btn-main m-now" style="width: 70%;" @click.stop="buynow">
              {{ __('立即预约') }}
            </view>
          </block>
        </block>
        <block v-else>
          <view class="m-footer-btn-list">
            <view class="m-footer-btn-item" @click="PDCollection" :data-id="(ProductInfo.item_id)" v-if="(!chatUrl)">
              <view class="m-footer-btn-icon">
                <label
                    :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?'highlight ':'']"></label>
              </view>
              <text>{{ isCollection ? __('已收藏') : __('收藏') }}</text>
            </view>
			<!-- #ifdef MP-WEIXIN -->
			<block v-if="imEnable">
            <view class="m-footer-btn-item" :data-id="(proId)" :data-name="(store_info.store_name)"
                  :data-keyword="(ProductInfo.keyWord)"
                  :data-appid="(AppId)" :data-appurl="(chatUrl)" :data-type="10" @click="tplGoToPage" v-if="(chatUrl)">
              <view class="m-footer-btn-icon">
                <!-- #ifdef MP-WEIXIN -->
                <block v-if="1==plantformInfo.kefu_type_id">
                  <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
                </block>
                <!-- #endif -->
                <label class="iconfont icon-more "></label>
              </view>
              <text>{{ __('客服') }}</text>
            </view>
			</block>
            <!-- #endif -->
            <view data-url="/pages/cart/cart" class="m-footer-btn-item" style="margin-right: 14rpx;" @click="goTabBar">
              <view class="m-footer-btn-icon">
                <label class="iconfont icon-cart "></label>
                <uni-badge v-if="cartNum>0" :text="cartNum" type="danger"></uni-badge>
              </view>
              <text>{{ __('购物车') }}</text>
            </view>
          </view>
          <block v-if="(!ProductInfo.normalStatus)">
            <view class="m-footer-btn-main m-footer-desable m-footer-btn-main-left">
              {{ __('立即购买') }}
            </view>
            <view class="m-footer-btn-main m-footer-desable m-footer-btn-main-right">
              {{ __('商品已下架') }}
            </view>
          </block>
          <block v-else-if="(!ProductInfo.if_store)">
            <view class="m-footer-btn-main m-footer-desable m-footer-btn-main-left">
              {{ __('立即购买') }}
            </view>
            <view class="m-footer-btn-main m-footer-desable m-footer-btn-main-right">
              {{ __('库存不足') }}
            </view>
          </block>
          <block v-else>
              <view class="m-footer-btn-main m-footer-btn-main-left" @click="ckselectsp">
                {{ __('加入购物车') }}
              </view>
              <view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main m-footer-btn-main-right m-now"
                    @click="ckselectsp1">
                {{ __('立即购买') }}
              </view>
              <view v-else class="m-footer-btn-main m-footer-btn-main-right m-now" @click.stop="ckselectsp1">
                <!-- 不需要选择数量使用： buynow -->
                {{ __('立即购买') }}
              </view>
          </block>
        </block>
      </view>

      <view :class="'m-panel-sp ' + (selectsp==0?'hide':'') " @click.stop="closesp">
        <view :class="'m-panel-sp-content ' + (selectct==0?'bounceOutDown animated':'bounceInUp animated')" @click.stop>
          <view class="m-panel-sp-pinfo" v-if="!b2bFlag">
            <view class="m-panel-sp-pimg">
              <image lazy-load :src="(selectimg||ProductInfo.productPicList[0].path)"/>
            </view>
            <view class="m-panel-sp-pname">
           
              <view class="m-pprice">

                <block v-if="ProductInfo.showPrice">
                  <text style="font-size: 12px;">{{ __('￥') }}</text>
                  {{ number_format(ProductInfo.itemSalePrice, 2) }}
                </block>

                <block v-if="ProductInfo.item_row.item_unit_points">
                  <text style="margin-left: 20rpx;font-size: 22rpx;">+
                    <text style="font-size:16px">{{ ProductInfo.item_row.item_unit_points }}</text>
                    {{ __('积分') }}
                  </text>
                </block>

                <block v-if="ProductInfo.item_unit_sp">
                  <text style="margin-left: 20rpx;font-size: 22rpx;">+
                    <text style="font-size:16px">{{ ProductInfo.item_unit_sp }}</text>
                    {{ __('众宝') }}
                  </text>
                </block>
              </view>

              <view class="m-pstock" v-if="true">
                {{
                  sprintf(__('库存%s件'), ProductInfo.if_store ? ProductInfo.item_row.item_quantity - ProductInfo.item_row.item_quantity_frozen : 0)
                }}
              </view>

              <view v-if="(ProductInfo.SpecLst.length)" class="m-pspec">{{ __('已选：') }}
                <block v-for="(items, i) in ProductInfo.SpecLst" :key="i">
                  <!-- #ifdef H5 -->
                  <block v-for="(item, ii) in items.svLst" :key="i + '|' + ii">
                    <span v-if="(item.IsChecked)" style="margin-left: 4rpx;">{{ item.Name }}</span>
                  </block>
                  <!-- #endif -->
                  <!-- #ifndef H5 -->
                  <block v-for="(item, ii) in items.svLst" :key="ii">
                    <span v-if="(item.IsChecked)" style="margin-left: 4rpx;">{{ item.Name }}</span>
                  </block>
                  <!-- #endif -->
                </block>
              </view>
            </view>
            <view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closesp"></view>
          </view>
          <view v-else class="m-panel-sp-pinfo" :style="'height: ' + ((ProductInfo.product_spec[0]) && ProductInfo.product_spec[0].spec_format == 'image' ? 0 : 30)  + 'px'">
            <view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closesp"></view>
          </view>

          <scroll-view class="m-panel-sp-listbox" scroll-y="true" style="max-height: 750rpx;">
            <block v-if="b2bFlag && ProductInfo.product_spec.length>0">
              <view class="m-panel-sp-listbox-item">
                <view v-if="(ProductInfo.product_spec[0]) && ProductInfo.product_spec[0].spec_format == 'image'" style="display: flex;flex-wrap: wrap;">
                    <view class="m-panel-sp-labellist" style="display: flex;flex-wrap: wrap;">
                      <text style="width: 100%;">{{ ProductInfo.product_spec[0].name }}</text>
                      <block v-for="(item, ii) in ProductInfo.SpecLst[0].svLst" :key="0 + '|' + ii">
                        <block v-if="(ProductInfo.product_spec_image_row[item.Id])">
                          <view class="spec-info" :class="item.IsChecked ? 'spec-checked' :''">
                            <view style="background-color: #fff;border-radius: 12rpx 12rpx 0 0;position: relative;">
                              <image lazy-load class="spec-image" mode="aspectFill"
                                     :src="ProductInfo.product_spec_image_row[item.Id]" :data-ckid="ProductInfo.SpecLst[0].ckid"
                                     :data-unit_id="ProductInfo.SpecLst[0].unit_id"
                                     :data-spid="item.Id"
									 :data-chk="item.IsChecked"
                                     :data-enable="ProductInfo.spec_item_map[item.Id]" @click.stop="selectS"/>
                              <image
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqAgMAAAC8WPH1AAAACVBMVEUAAACmpqb7+/u/97gPAAAAA3RSTlMlbfJHEMYPAAAAUklEQVR42mNgGIRAalUDFiZDFpzJiBBlW4ZQOwnOzHKCMzMZHWDMELhRLHCTHCRhTKaGTDizcQmc2TYBzpwFN4lpJQOCCTeWaRVcG2NowAAEHAC6axEksUAxfgAAAABJRU5ErkJggg=="
                                  style="width: 40rpx;height: 42rpx;position: absolute;top:16rpx;right:20rpx;"
                                  :data-src="ProductInfo.product_spec_image_row[item.Id]"
                                  @click.stop="previewSpecImg"></image>
                            </view>

                            <view class="spec-info-name"
                                  :data-ckid="ProductInfo.SpecLst[0].ckid"
                                  :data-unit_id="ProductInfo.SpecLst[0].unit_id"
                                  :data-spid="item.Id"
								   :data-chk="item.IsChecked"
								   :data-enable="ProductInfo.spec_item_map[item.Id]"
                                  @click.stop="selectS">
                              {{ item.Name }}
                            </view>
                          </view>

                        </block>
                      </block>
                    </view>

                </view>
                <block v-for="(item, ii) in productUniqid" :key="ii">
                  <label :class="item[4]==0 || item[4] == color ? (proIds[ii] && proIds[ii].quantity >0 ? 'm-panel-sp-sellabel-b2b-h m-ys' : 'm-panel-sp-sellabel-b2b m-ys') : 'm-panel-sp-sellabel1 m-ys'"
                         style="width:96%;float:left;height:56rpx;line-height:56rpx;overflow:hidden;padding-left:10rpx;font-size: 12px;position: relative;">
                    
					<view style="float: left;width: 30%;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item[6] }}</view> 
					<view style="float: left;">
						<text style="margin-left:10rpx;color:#888;font-size: 10px">{{ __('￥') }}</text>
						<text style="margin-left:10rpx;color:#888;">{{ number_format(item[1], 2) }}</text>
						<text v-if="ProductInfo.item_row.item_unit_points" style="margin-left:10rpx;color:#888;">{{ sprintf(__('+积分%s'), ProductInfo.item_row.item_unit_points) }}</text>
						<text style="margin-left:10rpx;color:#888;">{{ sprintf(__('库存 %s'), item[2] ? item[2] : 0) }}</text>
					</view> 
                    <view class="u-cart-num" style="position: absolute;right: 0rpx;margin-top: 0px;width: 194rpx;height:56rpx;line-height:56rpx;">
                      <view class="example-body" style="height:100%">
                        <uni-number-box  :min="0" :max="item[2]" :value="numberValue" :id="ii"
										:disabled="item[3] == 1002" @change="changes($event, ii)"/>
                      </view>
                    </view>
                 
                  </label>
                </block>
              </view>
            </block>
            <block v-for="(items, key1) in ProductInfo.SpecLst" :key="key1" v-else>
              <view class="m-panel-sp-listbox-item">
                <view class="m-cells-title">{{ items.Name }}</view>
                <view class="m-panel-sp-labellist" style="display: flex;flex-wrap: wrap;">
                  <text style="width: 100%;">{{ ProductInfo.product_spec[key1].name }}</text>
                  <block v-for="(item, ii) in items.svLst" :key="key1 + '|' + ii">
                    <block v-if="(ProductInfo.product_spec_image_row[item.Id])">
                      <view class="spec-info" :class="(item.IsChecked ? 'spec-checked' :'') + ' ' + (ProductInfo.spec_item_map[item.Id] ? ' ' : 'item_disabled') ">
                        <view style="background-color: #fff;border-radius: 12rpx 12rpx 0 0;position: relative;">
                          <image lazy-load class="spec-image" mode="aspectFill"
                                 :src="ProductInfo.product_spec_image_row[item.Id]" :data-ckid="items.ckid"
                                 :data-unit_id="items.unit_id"
                                 :data-spid="item.Id"
                                 :data-enable="ProductInfo.spec_item_map[item.Id]" @click.stop="selectSpec"/>
                          <image
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqAgMAAAC8WPH1AAAACVBMVEUAAACmpqb7+/u/97gPAAAAA3RSTlMlbfJHEMYPAAAAUklEQVR42mNgGIRAalUDFiZDFpzJiBBlW4ZQOwnOzHKCMzMZHWDMELhRLHCTHCRhTKaGTDizcQmc2TYBzpwFN4lpJQOCCTeWaRVcG2NowAAEHAC6axEksUAxfgAAAABJRU5ErkJggg=="
                              style="width: 40rpx;height: 42rpx;position: absolute;top:16rpx;right:20rpx;"
                              :data-src="ProductInfo.product_spec_image_row[item.Id]"
                              @click.stop="previewSpecImg"></image>
                        </view>

                        <view class="spec-info-name"
                              :data-ckid="items.ckid"
                              :data-unit_id="items.unit_id"
                              :data-spid="item.Id"
                              :data-enable="ProductInfo.spec_item_map[item.Id]"
                              :class="ProductInfo.spec_item_map[item.Id] ? ' ' : 'item_disabled'"
                              @click.stop="selectSpec">
                          {{ item.Name }}
                        </view>
                      </view>

                    </block>
                    <block v-else>
                      <label v-if="item.IsChecked" class="m-panel-sp-sellabel">{{ item.Name }}</label>
                      <label
                          v-else
                          :data-ckid="items.ckid"
                          :data-unit_id="items.unit_id"
                          :data-spid="item.Id"
                          :data-enable="ProductInfo.spec_item_map[item.Id]"
                          :class="ProductInfo.spec_item_map[item.Id] ? ' ' : 'item_disabled'"
                          @click.stop="selectSpec"
                      >
                        {{ item.Name }}
                      </label>
                    </block>
                  </block>
                </view>
              </view>
            </block>

            <!-- <view style="height:96rpx;width:100%;"></view> -->
          </scroll-view>
          <view style="height:calc(140rpx + env(safe-area-inset-bottom))"></view>
          <view :class="['m-m-panel-sp-btn', (ProductInfo.if_store && ProductInfo.normalStatus) ? '' : 'm-footer-desable']">
            <view class="m-pprice" style="width:50%;float:left;height:100rpx;line-height:100rpx;text-align:center"
                  v-if="b2bFlag && ProductInfo.product_spec.length>0">
              {{ __('￥') }}{{ number_format(price, 2) }}&nbsp;&nbsp;&nbsp;&nbsp;{{ __('数量:') }} {{ quantity }}
            </view>
            <view class="m-m-panel-sp-lbtn"
                  v-else>
              <view style="width: 100rpx">{{ __('数量') }}</view>
              <view class="u-cart-num" style="margin-top:10rpx">
                <view class="u-num-btn" @click.stop="sub">-</view>
                <input type="number" v-model="numval" @blur="writenum"/>
                <view class="u-num-btn" @click.stop="add">+</view>
              </view>
            </view>
              <view v-if="(!ProductInfo.normalStatus)" class="m-m-panel-sp-rbtn m-footer-btn-main-right m-footer-desable" style="width:100%">
                {{ __('商品已下架') }}
              </view>
              <view v-else-if="(!ProductInfo.if_store)"
                    class="m-m-panel-sp-rbtn m-footer-btn-main-right m-footer-desable" style="width:100%">
                {{ __('库存不足') }}
              </view>
              <block v-else-if="ProductInfo.kind_id != 1201">
                <view class="m-m-panel-sp-rbtn m-footer-btn-main-right" @click.stop="buynow"
                      >
                  {{ __('立即预约') }}
                </view>
              </block>
              <block v-else>
                <block v-if="(addCartFlag)">
                  <view v-if="(b2bFlag && ProductInfo.product_spec.length>0)" class="m-m-panel-sp-rbtn m-footer-btn-main" @click.stop="addCart">
                    {{ __('加入购物车') }}
                  </view>
                  <view v-else class="m-m-panel-sp-rbtn m-footer-btn-main-right" @click.stop="addCart">
                    {{ __('加入购物车') }}
                  </view>
                </block>
                <block v-else-if="(buyFlag)">
                  <view v-if="(b2bFlag && ProductInfo.product_spec.length>0)" class="m-m-panel-sp-rbtn  m-footer-btn-main"  @click.stop="buynow">
                    {{ __('立即购买') }}
                  </view>
                  <view v-else class="m-m-panel-sp-rbtn  m-footer-btn-main-right"  @click.stop="buynow">
                    <label v-if="ProductInfo.kind_id != 1201">{{ __('立即预约') }}</label>
                    <label v-else>{{ __('立即购买') }}</label>
                  </view>
                </block>
              </block>
          </view>
        </view>
      </view>
    </block>
    <view class="m-nullpage" v-else>
      <view class="m-nullpage-middle" v-if="loaded">
        <label class="iconfont icon-meiyougengduo"></label>
        <view class="m-null-tip">
          <text>{{ __('什么都没有！') }}</text>
        </view>
      </view>
      <view class="m-nullpage-middle" v-else>
        <loading></loading>
      </view>
    </view>
	
    <!-- 弹出层 -->
   
    <view :class="'m-panel-sp ' + (shareBoxFlag==0?'hide':'') " @click.stop="closeNativeShare">
      <view :class="'m-panel-sp-content ' + (shareContetnFlag==0?'bounceOutDown animated':'bounceInUp animated')"
            @click.stop>
        <view class="page-body">
          <!-- #ifdef APP-PLUS -->
          <view class="btn-area" v-if="providerList.length > 0">
            <block v-for="(value,index) in providerList" :key="index">
              <button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'"
                      @tap="share(value)">{{ value.name }}
              </button>
            </block>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="btn-area">
            <button type="primary" open-type="share">{{ __('分享') }}</button>
          </view>
          <!-- #endif -->

          <view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closeNativeShare"></view>
        </view>
      </view>
    </view>

    <!-- #ifdef APP-PLUS -->
    <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
    <!-- #endif -->

    <!-- #ifndef APP-PLUS -->
    <share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg"
                  @shareQRCode="shareQRCode"
                  @saveImg="saveImg" ref="shareBoxMp"></share-box-mp>
    <!-- #endif -->

    <liu-customize-sel ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                       @change='onDistrictConfirm'></liu-customize-sel>

    <l-painter useCORS @success="createPoster($event)" isCanvasToTempFilePath ref="painter" path-type="url"
               custom-style="position: fixed; left: 200%"></l-painter>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import wxParse from '@/components/u-parse/u-parse.vue'

import shareBoxMp from '@/components/share-box-mp.vue'
import shareBoxApp from '@/components/share-box-app.vue'
import shareBoxH5 from '@/components/share-box-h5.vue'

import headerNavMenu from '@/components/header-nav-menu.vue'

import uniBadge from '@/components/uni-badge.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import loading from '@/components/loading.vue'
import {mapMutations, mapState} from 'vuex'

function getNowFormatDate() {
  var e = new Date,
      t = "-",
      n = e.getMonth() + 1,
      r = e.getDate();
  n >= 1 && n <= 9 && (n = "0" + n), r >= 0 && r <= 9 && (r = "0" + r);
  var i = e.getFullYear() + t + n + t + r;
  return i
}

var intervalDate;
var intervalPt;
var intervalCt;
var intervalTimeAct;

export default {
  data() {
    return {
      numberValue: 0,
      b2bFlag: 0,
	  imEnable:0,
      proIds: {},
      productUniqid: [],
      ss: [
        "ss1",
        "ss2",
        "ss3",
        "ss4",
        "ss5"
      ],
      color: '',
      message_path: '',
      price: 0,
      quantity: 0,

      options: {},
      isMore: false,
      selectsp: 0,
      selectct: 0,
      proId: 0,
      splist: [],
      splistStr: [],
      numval: 1,
      stock: 1,
      inputval: 1,
      skuId: 0,
      selectimg: "",
      pname: "",
      desc: "",
      isCollection: false,
      activityTypeId: 0,
      gbId: 0, //页面所属团编号
      eventGbId: 0, //快速选择参团的临时团编号。
      parameters: [],
      acticity_ids: [],
      isdata: false,
      loaded: false,
      tapindex: 1,
      isChannel: true,
      gbRows: [],
      isAll: false,

      ProductInfo: {
        acticity_id: 0,
        productPicList: [],
        activity_base_row: {}
      },


      last_comment: {},
      last_comments: [],
      analytics_row: {},
      contracts: [], //服务


      store_product_list: [],
      store_product_num: 0,
      faq_rows: [],
      store_info: {},
      Coupons: [],
      isCancelSuccess: true,
      isCancel: true,
      CouponAmount: 0,
      user_is_new: 0,
      addCartFlag: false, //{{__('加入购物车')}}标记
      buyFlag: false, //{{__('立即购买')}}标记
      isVoucher: false,
      virtual_flag: false,
      versionNumber: "",
      CashData: {},
	  item_ids: "",
      PageQRCodeInfo: {
        Path: "",
        IsShare: false,
        IsShareBox: false,
        IsJT: false
      },
      isModified: true,
      timer: null,
      days: "",
      hours: "",
      minutes: "",
      seconds: "",
      isShare: true,
      if_saas_status: false,
      isStoreFlag: 0, //店铺内打开
      voucherList: [],

      AppId: '',
      chatUrl: '',

      isJoin: false,

      ispage: false,

      shareData: {
        shareText: '随商商城系统，支持原生App、微信小程序，邀请你一起体验！',
        shareTitle: '随商商城系统，支持原生App、微信小程序，邀请你一起体验！',
        href: "https://www.suteshop.com",
        image: '',
        price: 0
      },

      shareText: '随商商城系统，支持原生App、微信小程序，邀请你一起体验！',
      shareTitle: '随商商城系统，支持原生App、微信小程序，邀请你一起体验！',
      href: "https://www.suteshop.com",
      image: '',

      shareBoxFlag: 0,
      shareContetnFlag: 0,

      shareType: 0,
      providerList: [],

      wholesale_policy_rows: [],
      scposition: 0,
      old: {
        scposition: 0
      },
      isnav: true,
      screenHeight: 0,
      isquicknav: false,


      Id: 0,
      needed_point: 0,


      cityPickerValueDefault: [0, 0, 0],
      themeColor: '#007AFF',
      product_freight_info: {
        content: "",
        district_info: "上海市/上海市",
        if_store: false
      },

      latitude: '',
      longitude: '',
      is_chain: 0,

      currentSwipperImageIndex: 1,

      //BEGIN 生成海报参数
      productPoster: '',
      show: false,
      poster: {
        css: {
          width: "750rpx",
          height: '1334rpx',
          background: '#fff'
        },
        views: [{
          type: "image",
          src: "https://kuteshop.oss-accelerate.aliyuncs.com/modulithshop/image/media/plantform/20230915/c9ef027ff64d4cd1b81c7c521f565524.jpg",
          css: {
            left: '0rpx',
            top: '0rpx',
            width: '750rpx',
            height: '1334rpx',
            position: "fixed"
          }
        }, {
          type: "image",
          src: "商品图片",
          css: {
            left: '20rpx',
            top: '20rpx',
            width: '710rpx',
            height: '710rpx',
            position: "fixed"
          }
        },
          {
            type: 'text',
            text: '商品名称',
            css: {
              maxLines: 2,
              lineClamp: 2,
              width: '680rpx',
              left: '35rpx',
              top: '770rpx',
              fontSize: '28rpx',
              color: '#333',
              lineHeight: '50rpx',
              position: "fixed"
            }
          },
          {
            type: 'text',
            text: '¥0',
            css: {
              width: '680rpx',
              left: '35rpx',
              top: '890rpx',
              fontSize: '38rpx',
              color: '#E50F41',
              position: "fixed"
            }
          }, {
            type: "qrcode",
            text: "二维码",
            css: {
              left: '35rpx',
              top: '990rpx',
              width: '260rpx',
              height: '260rpx',
              position: "fixed"
            }
          }, {
            type: 'text',
            text: '长按保存或扫码查看',
            css: {
              position: "fixed",
              left: '60rpx',
              top: '1270rpx',
              fontSize: '20rpx',
              color: '#999'
            }
          }]
      },
      //END 商品海报信息

    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: 'og:url',
          content: this.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', this.Config.SiteUrl, this.proId, this.userInfo.user_id)
        },
        {name: 'og:type', content: "article"},
        {name: 'og:title', content: this.pname},
        {name: 'og:description', content: this.desc || this.pname},
        {
          name: 'og:image',
          content: this.ProductInfo.productPicList.length ? this.ProductInfo.productPicList[0].path : ''
        },
      ],

      title: this.pname
    }
  },
  components: {
    shareBoxMp,
    shareBoxApp,
    shareBoxH5,
    uniBadge,
    wxParse,
    uniTag,
    uniNumberBox,
    loading,
    headerNavMenu,
    uniPopup,
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'cartNum']),
    nav_nemu: function () {
      return [
        {url: '/pages/index/index', type: 'switchTab', icon: 'zc-dianpu', name: this.__('首页')},
        {url: '/member/member/message', type: 'navigate', icon: 'zc-zaixian-im', name: this.__('消息')},
        {url: '/member/member/favorites', type: 'navigate', icon: 'zc-shoucang11', name: this.__('我的收藏')},
        {url: '/member/member/browse', type: 'navigate', icon: 'zc-zuji', name: this.__('浏览记录')},
      ];
    },
  },
  async onLoad(options) {
    await this.$onLaunched;

    uni.setNavigationBarTitle({
      title: this.__('商品详情')
    });

    var that = this;

    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var opts = {};

      opts = that.$.parse_str(scene);

      options = Object.assign(options, opts);
    }

    that.$.getSystemInfo({
      success: function (t) {
        that.setData({
          screenHeight: t.screenHeight
        })
      }
    })

    this.setData({
      options: options,
      isStoreFlag: options.is_store_flag ? parseInt(options.is_store_flag) : 0,
      if_saas_status: this.Config.SAAS_STATUS,
    })

    options.pid = options.pid || options.id

    that.InitData(options);

    this.getPlantformInfo(function (plantformInfo) {
      that.poster.views[0].src = plantformInfo.product_poster_bg;
      that.setData({
        b2bFlag: plantformInfo.b2b_flag,
        imEnable: plantformInfo.im_enable
      })
      let district_list = uni.getStorageSync('district_list');

      if (district_list) {
        that.cityPickerValueDefault = district_list.split(',').map(Number)
      } else {
        that.cityPickerValueDefault = plantformInfo.default_shipping_district.split(',').map(Number)
      }

      //that.cityPickerValueDefault = [110000, 110100, 110101]
    });

  },
  onShareAppMessage() {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif

    return {
      imageUrl: this.ProductInfo.productPicList[0].path,
      title: this.pname,
      path: "/pagesub/product/detail?id=" + this.proId + "&uid=" + this.userInfo.user_id
    }
  },
  /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.pname,
      query: {
        uid: this.userInfo.user_id,
        pid: this.proId
      },
      imageUrl: this.ProductInfo.productPicList[0].path,
    }
  },
  onBackPress() {

    if (this.$refs.mpvueCityPicker.showPicker) {
      //this.$refs.mpvueCityPicker.pickerCancel();
      return true;
    }

    // #ifdef APP-PLUS
    if (this.$refs.shareBoxApp.showBoxView) {
      this.$refs.shareBoxApp.cancel();
      return true;
    }
    // #endif


    // #ifdef H5
    if (this.$refs.shareBoxH5.showBoxView) {
      this.$refs.shareBoxH5.cancel();
      return true;
    }
    // #endif

    // #ifdef MP-WEIXIN
    if (this.$refs.shareBoxMp.showBoxView) {
      this.$refs.shareBoxMp.cancel();
      return true;
    }
    // #endif
  },
  onUnload() {
    clearInterval(intervalDate);
    clearInterval(intervalPt);
    clearInterval(intervalCt);
    clearInterval(intervalTimeAct);


    if (this.$refs.mpvueCityPicker.showPicker) {
      //this.$refs.mpvueCityPicker.pickerCancel()
    }

    // #ifdef APP-PLUS
    if (this.$refs.shareBoxApp.showBoxView) {
      this.$refs.shareBoxApp.cancel();
    }
    // #endif

    // #ifdef H5
    if (this.$refs.shareBoxH5.showBoxView) {
      this.$refs.shareBoxH5.cancel();
    }
    // #endif

    // #ifdef MP-WEIXIN
    if (this.$refs.shareBoxMp.showBoxView) {
      this.$refs.shareBoxMp.cancel();
    }
    // #endif
  },
  onNavigationBarButtonTap(e) {
    var that = this;

    if (e.index === 0) {
      that.onMenu(e);
    } else if (e.index === 1) {
      that.onShareBox(e);
    } else {
      uni.showToast({
        title: "你点了收藏按钮",
        icon: "none"
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initProduct(true);
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum']),

    //生成的海报图片
    createPoster(e) {
      this.productPoster = e
      if (this.productPoster) {
        uni.hideLoading();
        this.$refs.shareBoxMp.path = this.productPoster;
      }
    },

    swiperImg: function (e) {
      this.currentSwipperImageIndex = e.detail.current + 1;
    },
    InitData: function (options) {
      var that = this;
      this.setData({
        proId: options.pid,
        message_path: "/pagesub/product/detail?pid=" + options.pid + "&uid=" + this.userInfo.user_id,
        splistStr: [],
        gbId: parseInt(options.gb_id || 0),
        isJoin: (!that.$.isNull(options.gb_id) && options.gb_id != 0) ? true : false
      });

      that.$.isNull(this.userInfo) ? this.getUserInfo(function (user) {
        //that.initProduct(false);
        that.setData({
          isChannel: this.shopInfo.isChannel
        });
        that.setData({
          user_is_new: 0,
          CouponAmount: 10
        })
      }) : null


    },

    gopage: function (e) {
      var that = this;

      this.$.gotopage('/chain/chain/index?chain_id=' + e.currentTarget.dataset.chain_id)

    },

    call: function (e) {
      let that = this;
      that.$.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone
      })
    },

    initProduct: function (force_refresh) {
      if (typeof force_refresh == 'undefined') {
        force_refresh = true;
      }

      var that = this;


      //存入本地
      let district_id = uni.getStorageSync('district_id');


      var params = {
        item_id: that.proId,
        gb_id: (that.eventGbId || that.gbId),
        comment_flag: 1 //如果有，则读取一条评论
      };

      if (district_id) {
        params.district_id = district_id;
      } else {
        params.district_id = that.cityPickerValueDefault[1]
      }

      that.$.request({
        url: this.Config.URL.pt.item,
        data: params,
        loading: false,
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE,
          forceRefresh: force_refresh
        },

        success: function (data, status, msg, code) {
          if (200 == status) {
            //that.$report('fb_mobile_content_view', data.item_row);

            data.marketPrice = Math.max(data.item_row.item_unit_price, data.item_row.item_sale_price, data.item_row.item_market_price);
            data.itemSalePrice = data.item_row.item_sale_price;
            data.showPrice = data.item_row.item_sale_price > 0;

            if (data.marketPrice <= data.itemSalePrice) {
              data.marketPrice = 0
            }

            if (data.last_comments) {
              that.last_comments = data.last_comments
              that.last_comment = data.last_comment
            }

            //data.if_store = data.product_freight_info.if_store;
            data.if_store = data.if_store;
            data.normalStatus = data.product_state_id == that.StateCode.PRODUCT_STATE_NORMAL;
            //data.normalStatus = true;

            data.productPicList = [];

            data.pv_url = '/pagesub/video/video?pid=' + data.product_id + '&url=' + encodeURIComponent(data.product_video) + '&title=' + encodeURIComponent(data.product_name)


            let tmp = {};
            tmp.path = data.image.item_image_default;
            tmp.Video = false;
            data.productPicList.push(tmp);

            if (data.image.item_image_other) {
              let it = data.image.item_image_other.split(',')

              for (var i = 0; i < it.length; i++) {
                let tmp = {};
                tmp.path = it[i];
                tmp.Video = false;

                data.productPicList.push(tmp);
              }
            }

            data.product_spec = JSON.parse(data.product_spec)
            data.item_spec = JSON.parse(data.item_row.item_spec)
            data.productUniqid = JSON.parse(data.product_uniqid)

            data.product_spec_image_row = {};
            data.spec_item_map = {};

            for (const productUniqidKey in data.productUniqid) {
              data.product_spec_image_row[data.productUniqid[productUniqidKey][4]] = data.productUniqid[productUniqidKey][5]
            }

            data.SpecLst = [];

            if (data.product_spec.length <= 0) {
              that.setData({
                b2bFlag: 0
              })
            }


            //for b2b
            data.Ids = [];

            for (var n in data.product_spec) {
              data.SpecLst[n] = {};
              data.SpecLst[n].svLst = [];
              data.SpecLst[n].unit_id = data.product_spec[n].id;
              data.SpecLst[n].spec_format = data.product_spec[n].spec_format;

              //for b2b
              data.Ids[n] = {};
              data.Ids[n].info = [];
              data.Ids[n].id = data.product_spec[n].id;

              for (var r in data.product_spec[n].item) {
                data.SpecLst[n].svLst[r] = {};
                data.SpecLst[n].svLst[r].Id = data.product_spec[n].item[r].id;
                data.SpecLst[n].svLst[r].Name = data.product_spec[n].item[r].name;
                data.Ids[n].info[r] = data.product_spec[n].item[r].id; //for b2b

                if (data.item_spec[n].item.id == data.product_spec[n].item[r].id) {
                  data.SpecLst[n].svLst[r].IsChecked = true;
                  data.product_spec[n].item[r].select = true;
                } else {
                  data.SpecLst[n].svLst[r].IsChecked = false;
                }

                if (!that.selectimg && data.product_spec_image_row[data.product_spec[n].item[r].id]) {
                  data.SpecLst[n].svLst[r].imagePath = data.product_spec_image_row[data.product_spec[
                      n].item[r].id];
                } else {
                  //data.SpecLst[n].svLst[r].imagePath = data.product_image;
                  data.SpecLst[n].svLst[r].imagePath = data.product_image || data.product_spec_image_row[data.product_spec[n].item[r].id];
                }
              }
            }

            for (var t in data.product_spec) {
              for (var s in data.product_spec[t].item) {

                //默认都可以点
                data.spec_item_map[data.product_spec[t].item[s].id] = 1

                if (data.product_spec[t].item[s].select == 1) {
                  that.setData({
                    color: data.product_spec[0].item[0].id,
                  });
                }

                //start 判断规格值是否可点
                let spec_item_ids = []
                spec_item_ids.push(data.product_spec[t].item[s].id)
                for (var spec_tmp_index in data.item_spec) {
                  if (t != spec_tmp_index)
                  {
                    spec_item_ids.push(data.item_spec[spec_tmp_index]['item']['id']);
                  }
                }

                let tmp_id = spec_item_ids.sort(function (a, b) {
                  return a - b;
                }).join("-");

                if (typeof data.productUniqid[tmp_id][3] != "undefined")
                {
                  if (data.productUniqid[tmp_id][3] == that.StateCode.PRODUCT_STATE_NORMAL)
                  {
                    data.spec_item_map[data.product_spec[t].item[s].id] = 1;
                  }
                  else
                  {
                    data.spec_item_map[data.product_spec[t].item[s].id] = 0;
                  }
                }
                else
                {
                  data.spec_item_map[data.product_spec[t].item[s].id] = 1;
                }
                //end 判断规格值是否可点
              }
            }

            if (data.SpecLst.length > 0) {
              for (var n in data.SpecLst) {
                for (var r in data.SpecLst[n].svLst) {
                  data.SpecLst[n].svLst[r].IsChecked &&
                  (data.SpecLst[n].ckid = data.SpecLst[n].svLst[r].Id,
                      that.splist.push(data.SpecLst[n].svLst[r].Id), that.splistStr.push(data.SpecLst[n].svLst[
                      r].Name),
                      that.setData({
                        selectimg: data.SpecLst[n].svLst[r].imagePath
                      }));

                  data.product_spec[n].item[r].IsChecked &&
                  (data.product_spec[n].ckid = data.product_spec[n].item[r].id, that.splist.push(data.item_row
                      .product_spec[n].item[r].id), that.splistStr.push(data.product_spec[n].item[r].name), that.setData({
                    selectimg: data.product_spec[n].item[r].imagePath
                  }));
                }
              }
            } else {
              that.setData({
                selectimg: data.product_image
              });
            }

            var perm_id = that.$.getStorageSync('uid');
            var perm_key = that.$.getStorageSync('ukey');
            that.$.setNavigationBarTitle({
              title: data.product_item_name
            });


            //data.product_detail = '<style>img{max-width:100%!important;height:auto;}</style>' + data.product_detail;
            //data.product_detail = data.product_detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')

            data.product_detail && (data.product_detail = data.product_detail.replace(new RegExp(
                '<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
            data.product_param && (data.product_param = data.product_param.replace(new RegExp(
                '<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
            data.product_extension && (data.product_extension = data.product_extension.replace(
                new RegExp('<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
            data.product_service && (data.product_service = data.product_service.replace(new RegExp(
                '<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));

			data.product_detail = data.product_detail + "<div style='text-align:center;padding:10px 0 2px'><a href='https://www.shopsuite.cn'>Powered by shopsuite.cn</a></div>"
            //let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", data.store_info.user_id, data.item_id);
            let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", 0, data.item_id);
            that.setData({
              chatUrl: chat_url
            });

            if (true) {
              /*
								that.$.request({
									url: that.Config.URL.user.kefu_config,
									data: {user_id: data.store_info.user_id, store_id:data.store_info.store_id},
									loading: false,
									success: function(rd, r_status, r_msg, code) {
										if (r_status == 200) {
											let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", rd.friend_id, data.item_id);
											that.setData({
												chatUrl: chat_url
											});
										}
										else
										{
											that.$.alert(r_msg);
										}
									}
								});
								*/
            } else {
            }

            that.setData({
              ProductInfo: data,
              productUniqid: data.productUniqid,
              //store_info: data.store_info,
              isCollection: data.is_favorite > 0 ? true : false,
              skuId: data.item_id,
              parameters: data.product_param,
              desc: data.ProductTips,
              pname: data.product_item_name,
              stock: data.item_quantity
            });

            that.poster.views[1].src = data.productPicList[0].path
            that.poster.views[2].text = data.product_item_name
            that.poster.views[3].text = '¥' + that.number_format(that.ProductInfo.itemSalePrice, 2)
            that.poster.views[4].text = that.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', that.Config.SiteUrl, that.proId, that.userInfo.user_id);

            that.setData({
              isdata: true
            });


            //读取帮助信息
            //that.getFaq(data.product_id);
          } else {
            that.setData({
              isdata: false
            });
          }

          if (200 != status) {

          } else {

            //初始化微信分享
            let $title = that.pname;
            let $desc = that.desc;
            let $link = that.$.sprintf('%s/h5/pagesub/product/detail?id=%s', that.Config.SiteUrl, that.proId);
            let $img_url = that.ProductInfo.productPicList[0].path;

            //初始化微信分享
            that.$.wxShare($title, $desc, $link, $img_url)

            //that.getStoreProdcutList();
          }

          that.setData({
            loaded: true
          });

          that.$forceUpdate();


          that.$.stopPullDownRefresh()
        },
        complete: function (res, status) {
        }
      });
    },

    getFaq: function (product_id) {
      let that = this;

      let faq_params = {
        product_id: product_id,
        rows: 2,
      }
      that.$.request({
        url: this.Config.URL.sns.story_lists,
        data: faq_params,
        loading: false,/*
                    ajaxCache: {
                        timeout: Config.CACHE_EXPIRE
                    }, */
        success: function (data, status, msg, code) {
          if (status == 200) {
            that.faq_rows = data.items;

            if ('analytics_row' in (that.ProductInfo)) {
              if (that.ProductInfo.analytics_row && 'product_ask_num' in (that.ProductInfo.analytics_row)) {
                that.ProductInfo.analytics_row.product_ask_num = data.records;
              }
            }
          }
        }
      });
    },

    ckselectsp: function (e) {
      this.setData({
        //change: e.currentTarget.offsetLeft,
        selectsp: 1,
        selectct: 1,
        addCartFlag: true,
        buyFlag: false
      })
    },
    ckselectsp1: function (e) {
      this.setData({
        //change: e.currentTarget.offsetLeft,
        selectsp: 1,
        selectct: 1,
        buyFlag: true,
        addCartFlag: false
      })
    },
    closesp: function (e) {
      this.eventGbId = 0;
      this.isJoin = this.eventGbId || this.gbId;

      var that = this;
      that.setData({
        selectct: 0,
        /*addCartFlag: false*/
      });

      setTimeout(function () {
            that.setData({
              selectsp: 0
            })
          },
          1e2)
    },

    selectSpec: function (e) {
      let that = this;
      if (!e.target.dataset.enable) {
        return;
      }

      var params = {
            spid: e.target.dataset.spid,
            ckid: e.target.dataset.ckid,
            unit_id: e.target.dataset.unit_id
          },
          n = [],
          r = this.splist;

      var uniqid, spec_ids = [];
      for (var spec_key in that.ProductInfo.item_spec) {
        if (params.unit_id == that.ProductInfo.item_spec[spec_key].id) {
          spec_ids.push(params.spid);
        } else {
          spec_ids.push(that.ProductInfo.item_spec[spec_key].item.id);
        }
      }

      uniqid = spec_ids.sort(function (a, b) {
        return a - b;
      }).join("-");

      var item_id = that.ProductInfo.productUniqid[uniqid][0];

      if (that.b2bFlag) {
        return;
      }

      that.setData({
        proId: item_id
      })

      that.initProduct(false);
    },
    sub: function () {
      this.unifiedNum(2)
    },
    add: function () {
      this.unifiedNum(1)
    },
    writenum: function (e) {
      this.setData({
        inputval: e.detail.value
      }), this.unifiedNum(3)
    },
    unifiedNum: function (e) {
      let that = this;
      var t = {
        value: parseInt(this.numval),
        stock: parseInt(this.stock),
        inputval: parseInt(this.inputval)
      };
      if (t.stock <= 0) {
        that.$.alert(that.__('亲~商品没有库存啦！'));
        return
      }
      e == 1 ? t.value = t.value + 1 : e == 2 ? t.value = t.value - 1 : (t.value = t.inputval, this.setData({
        numval: t.inputval
      }));
      if (t.value > t.stock) {
        this.setData({
          numval: t.stock
        });
        return
      }
      if (t.value <= 0) {
        this.setData({
          numval: 1
        });
        return
      }
      this.setData({
        numval: t.value
      })
    },
    addCart: async function () {
      var that = this;

      if (that.b2bFlag) {
        that.addCartBat();
        return;
      }

      var params = {
        item_id: that.proId,
        cart_quantity: that.numval,
        activity_id: that.ProductInfo.activity_id,
      };

      if (that.stock <= 0) {
        that.$.alert("亲~商品没有库存啦！");
        return
      }

      await this.$store.dispatch(`addCart`, {
        params: params, callback: (data, status, msg, code) => {
          if (status == 200) {
            that.$.alert(that.$.__('添加购物车成功'));

            that.setData({
              numval: 1,
              inputval: 1
            })

            if (that.plantformInfo.prodcut_addcart_flag) {
              that.$store.dispatch(`getCartList`, function (data) {})
            }
          }

          that.setData({
            selectct: 0
          });

          setTimeout(function () {
            that.setData({
              selectsp: 0
            })
          }, 1e3);

        }
      })
    },

    //for b2b
    //商品数量
    changes(e, id) {
      console.log(e, id);
      var that = this;
      var t = that.productUniqid[id][0];
      that.proIds[id] = {
        item_id: t,
        quantity: e
      };
	  
	  that.$forceUpdate() //二维数组，开启强制渲染
	  
      this.setprice();
    },

    //计算价格
    setprice: function () {
      var that = this;
      var price = 0;
      var quantity = 0;
      for (var i in that.proIds) {
        price = price + that.proIds[i].quantity * that.productUniqid[i][1];
        quantity += that.proIds[i].quantity;
      }
      console.log(quantity)
      this.setData({
        price: price,
        quantity: quantity
      });
    },
    selectS: function (evnet) {
		const k = 0;
		const d = evnet.target.dataset.spid
		const chk = evnet.target.dataset.chk

      var that = this;
      that.setData({
        color: d
      })
      if (chk == true) {
        return true;
      }
      // evnet.target.dataset.unit_id = 1002;
      var p = that.ProductInfo.SpecLst[0].svLst;
      for (var l = 0; l < p.length; l++) {
        if (p[l].IsChecked == true) {
          p[l].IsChecked = false;
        }
      }

      for (var l = 0; l < p.length; l++) {
        if (p[l].Id == d) {
          p[l].IsChecked = true;
        }
      }

      // this.setData({
      // 	proId: items.id
      // });
      that.selectSpec(evnet);
    },

    addCartBat: function () {
      var that = this;
      var pat = [];
      if (that.ProductInfo.SpecLst.length > 0) {
        for (var i in that.proIds) {
          if (that.proIds[i].quantity > 0) {
            pat.push(that.proIds[i]);
          }
        }

        if (pat.length <= 0) {
          that.$.alert('亲~请选择商品！');
          return;
        }
      } else {
        pat = [
          {item_id: that.options.pid, quantity: 1}
        ]
      }

      var params = {
        par: JSON.stringify(pat),
        prd: that.options.pid
      };
      that.$.request({
        url: this.Config.URL.cart.batchadd,
        data: params,
        method: 'POST',
        success: function (data, status, msg, code) {
          if (status == 200) {
            //that.notice.postNotificationName("RefreshProduct", true);

            //
            that.notice.postNotificationName('RefreshCart', that.numval);

            that.setCartNum({
              type: 'add',
              num: that.numval
            });

            that.$.alert('添加进货车成功');

            that.setData({
              numval: 1,
              inputval: 1
            });
          } else {
            that.$.alert(msg);
          }

          that.setData({
            selectct: 0
          });

          setTimeout(function () {
            that.setData({
              selectsp: 0
            });
          }, 1e3);
        }
      });
    },

    PDCollection: function (e) {
      var that = this;
      if (this.isCollection) {
        var params = {
          item_id: e.currentTarget.dataset.id
        };

        that.$.request({
          url: this.Config.URL.user.removeWishItem,
          data: params,
          method: 'POST',
          success: function (data, status, msg, code) {

            if (200 == status) {
              that.setData({
                isCollection: false
              });
            }

            that.$.alert(that.__('已取消收藏！'));
          }
        });
      } else {
        var params = {
          item_id: e.currentTarget.dataset.id
        };
        that.$.request({
          url: this.Config.URL.user.addWishItem,
          data: params,
          method: "POST",
          success: function (data, status, msg, code) {
            if (200 == status) {
              that.setData({
                isCollection: true
              })
            }

            that.$.alert(that.__('已收藏！'))
          }
        });

      }
    },

    picDetail: function () {
      this.setData({
        tapindex: 1
      })
    },
    spcParam: function () {
      this.setData({
        tapindex: 2
      })
    },

    packingList: function () {
      this.setData({
        tapindex: 3
      })
    },

    showServiceTab: function () {
      this.setData({
        tapindex: 5
      })
    },

    //单规格，不需要选规格，默认购买一个。
    buynow: function (e) {
      var that = this;
      var params = {
        item_id: that.proId,
        proName: that.pname,
        cart_quantity: that.numval,
        activity_id: that.ProductInfo.activity_id,

        SKU_Id: that.skuId
      };

      //for b2b
      if (that.b2bFlag && that.ProductInfo.SpecLst.length > 0) {
        var pat = [];
        for (var i in that.proIds) {
          if (that.proIds[i].quantity > 0) {
            var t = that.proIds[i].item_id + '|' + that.proIds[i].quantity + '|0';
            pat.push(t);
          }
        }

        console.log(pat);
        if (pat.length <= 0) {
          that.$.alert('亲~请选择商品！');
          return;
        }
        var str = pat.join(',');
        that.$.navigateTo({
          url: '/pagesub/checkout/checkout?ifcart=0&cart_id=' + str + '&prd=' + that.options.pid
        }), this.setData({
          selectct: 0
        });
      } else {
        that.$.navigateTo({
          url: "/pagesub/checkout/checkout?ifcart=0&cart_id=" + params.item_id + "|" + params.cart_quantity + '|0'
        }), this.setData({
          selectct: 0
        });
      }

      var n = this;
      setTimeout(function () {
            n.setData({
              selectsp: 0
            })
          },
          1e3)
    },
 

    cancel: function () {
      this.setData({
        isCancel: false
      })
    },
    cancelsuccess: function () {
      this.setData({
        isCancelSuccess: true
      })
    },

    ImgTap: function (e) {
      var that = this,
          n = [];
      for (var r in this.last_comment.comment_image) n.push(this.last_comment.comment_image[r]);
      var i = e.target.dataset.src;
      that.$.previewImage({
        current: i,
        urls: n
      })
    },
    previewProductImg: function (e) {
      var that = this,
          n = [];
      for (var r in this.ProductInfo.productPicList) {
        n.push(this.ProductInfo.productPicList[r].path);
      }

      var i = e.target.dataset.src;

      that.$.previewImage({
        current: i,
        urls: n
      })
    },
    previewSpecImg: function (e) {
      var that = this,
          n = [];

      for (var r in this.ProductInfo.product_spec_image_row) {
        n.push(this.ProductInfo.product_spec_image_row[r]);
      }

      var i = e.target.dataset.src;

      that.$.previewImage({
        current: i,
        urls: n
      })
    },

    goTabBar: function (e) {
      var that = this;
      that.$.goToTabBar(that, e.currentTarget.dataset.url)
    },

    cancelShare: function (e) {
    },
    showCodeImg: function (e) {
    },
    shareQRCode: function (e) {
      let that = this;
      if (this.productPoster == '') {
        uni.showLoading({
          title: '海报生成中..',
          mask: true
        });

        // #ifdef MP-WEIXIN
        let path = that.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', that.Config.SiteUrl, this.proId, this.userInfo.user_id);
        that.$.request({
          url: that.Config.URL.fx.poster,
          data: {
            user_id: that.userInfo.user_id,
            path: path,
            width: 430,
            poster_type: 2
          },
          success: function (data, status, msg, code) {
            if (200 == status) {
              let qrcode_url = data.qrcode;

              if (data.qrcode.indexOf("?") != -1) {
                qrcode_url = data.qrcode + '&rand=' + Math.random()
              } else {
                qrcode_url = data.qrcode + '?rand=' + Math.random()
              }

              that.poster.views[4].type = 'image';
              that.poster.views[4].src = qrcode_url;
              that.$refs.painter.render(that.poster);
            } else {

            }
          }
        });
        // #endif

        // #ifdef H5
        that.$refs.painter.render(this.poster);
        // #endif

      }
    },
    saveImg: function (e) {
    },

    shareBox: function (e) {

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      this.setData({
        shareBoxFlag: 1,
        shareContetnFlag: 1
      });
      // #endif
      // #ifdef MP-WEIXIN
      this.setData({
        PageQRCodeInfo: {
          Path: "",
          IsShare: true,
          IsShareBox: true,
          IsJT: false
        }
      })
      // #endif
    },

    getStoreProdcutList: function () {
      var that = this;
      var params = {
        store_id: this.ProductInfo.store_id
      }
      console.log(params)
      that.$.request({
        url: this.Config.URL.store.product,
        data: params,
        loading: false,
        ajaxCache: {
          timeout: this.Config.CACHE_EXPIRE
        },
        success: function (data, status, msg, code) {
          that.setData({
            store_product_list: data.items,
            store_product_num: data.items.length >= 30 ? (data.items.length + '+') : data.items.length //在售商品
          })
        }
      })
    },
    tplGoToPage: function (e) {
      let that = this;

      if (1 == that.plantformInfo.kefu_type_id) {
        // #ifdef MP-WEIXIN
        return;
        // #endif
      }

      //先判断是否登录
      this.forceUserInfo(function (user) {
        var t = e.currentTarget.dataset;

        that.$.request({
          url: that.Config.URL.user.kefu_config,
          data: {user_id: that.store_info.user_id, store_id: that.store_info.store_id},
          loading: false,
          success: function (rd, r_status, r_msg, code) {
            if (r_status == 200) {
              let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", rd.friend_id, that.skuId);

              that.setData({
                chatUrl: chat_url
              });

              that.$.gopage(chat_url);

            } else {
              that.$.alert(r_msg);
            }
          }
        });
      });


      return;

      switch (parseInt(t.type)) {
        case 1:
          that.$.gopage("/pagesub/product/detail?id=" + t.id);
          break;
        case 2:
          that.$.gopage("/pagesub/product/list?store_category_id=" + (t.id || 0) + "&cname=" + t.name);
          break;
        case 3:
          that.$.gopage("/pagesub/product/list?pname=" + t.keyword);
          break;
        case 4:
          that.$.gopage(t.appurl);
          break;
        case 5:
          that.$.gopage(t.appurl);
          break;
        case 6:
          that.$.gopage(t.appurl);
          break;
        case 7:
          that.$.navigateToMiniProgram({
            appId: t.appid,
            path: t.appurl
          });
          break;
        case 8:
          that.$.gopage("/pagesub/diy-page/diy-page?id=" + t.id);
          break;
        case 9:
          that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(t.appurl) + "&tn=" + t.name + "&tc=" + t.appid + "&tb=" +
              t.keyword);
          break;
        case 10:
          that.$.gopage(
              '/pagesub/webpage/web?u=' +
              encodeURIComponent(t.appurl) +
              '&tn=' +
              t.name +
              '&tc=' +
              t.appid +
              '&tb=' +
              t.keyword
          );
      }
    },
    closeNativeShare: function () {
      var that = this;
      that.setData({
        shareContetnFlag: 0,
        addCartFlag: false
      });

      setTimeout(function () {
        that.setData({
          shareBoxFlag: 0
        })
      }, 1e2)
    },
    scrolltoupper: function (t) {
      this.old.scposition = t.detail.scrollTop;

      t.detail.scrollTop >= this.screenHeight ? this.setData({
        isquicknav: true
      }) : this.setData({
        isquicknav: false
      })
    },
    onMenu: function (t) {
      this.$refs.headerNavMenu.showBoxView = !this.$refs.headerNavMenu.showBoxView
    },
    onShareBox: function (e) {
      let that = this;
      var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this.skuId, this.userInfo
          .user_id);

      $href = that.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', that.Config.SiteUrl, this.proId, this.userInfo.user_id);
      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS

      // #endif

      // #ifdef MP-WEIXIN
      $href = "ub?id=" + this.proId + "&uid=" + this.userInfo.user_id;
      // #endif

      this.setData({
        shareData: {
          shareTitle: this.pname,
          shareText: this.desc,
          href: $href,
          image: this.ProductInfo.productPicList[0].path,
          price: this.number_format(this.ProductInfo.itemSalePrice, 2)
        }
      });

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      this.$refs.shareBoxApp.show();
      // #endif

      //海报
      if (e == 3) {
        // #ifndef APP-PLUS
        this.$refs.shareBoxMp.show();
        // #endif
      } else {
        // #ifdef H5
        if (that.$.ifUniApp()) {
          this.$refs.shareBoxH5.show();
        } else {
          this.$refs.shareBoxMp.show();
        }
        // #endif

        // #ifdef MP-WEIXIN
        this.$refs.shareBoxMp.show();
        // #endif
      }


    },
    scrollbottom: function () {
      if (this.addCartFlag) {
        var e = this;
        e.setData({
          addCartFlag: false
        }), clearTimeout(t);
        var t = setTimeout(function () {
              e.setData({
                type: e.type,
                page: parseInt(e.page) + 1,
                rows: 10
              })
            },
            500)
      }
    },
    // 三级联动选择
    onSelectAddress(e) {
      this.$refs.mpvueCityPicker.open()
    },

    onDistrictConfirm(obj) {
      let disList = obj.value
      let that = this;

      let district_info = that.__('请选择地址')

      if (disList.length == 3) {
        district_info = that.$.sprintf('%s %s %s', disList[0].district_name, disList[1].district_name, disList[2].district_name)
      } else {
        return
      }

      let product_freight_info = this.product_freight_info;
      product_freight_info.district_info = district_info;

      this.setData({
        product_freight_info: product_freight_info
      });

      var params = {
        item_id: this.proId,
        district_id: disList[1].district_id
      };

      //存入本地
      let district_list = [disList[0].district_id, disList[1].district_id, disList[2].district_id]
      uni.setStorageSync('district_list', district_list.toString());

      uni.setStorageSync('district_id', params.district_id);
      that.initProduct(true);
    },
    navigate(href, e) {
      this.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(href));
    }
  }
}
</script>


<style lang="scss">
@import "../../styles/_variables.scss";

.page-body {
  padding: 40rpx;

  button {
    margin: 20rpx 20rpx;
  }

  .m-panel-sp-icon {
    position: absolute;
    right: 20rpx;
    top: 10rpx;

    color: #888;
  }
}

.discuss-evaluate {
  background: #fff;
  margin-top: 10rpx;

  .discuss-evaluate-top {
    position: relative;
    height: 70rpx;
    background: rgba(255, 255, 255, 1);
    margin-top: 24rpx;
    margin-left: 30rpx;
    padding-top: 10rpx;
  }
}

.discuss-item {
  .user-evaluate-center {
    height: 200rpx;
    border-bottom: 1px dotted #ccc;

    .user-text {
      height: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-right: 20rpx;
      text-indent: 1em;
    }

    .user-no-text {
      text-align: center;
    }
  }
}

.m-banner-ad {
  width: 750rpx;
  height: 750rpx;
  position: relative;
  background-color: #fff;
}

.m-banner-ad swiper {
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.m-detail {
  /*min-height: 500rpx;*/
}

.m-info-box {
  font-size: 32rpx;
}

.m-cells {
  margin-top: 20rpx;
  background: transparent;
  border-radius: 12rpx;

  .m-cell {
    background: #ffffff;
    padding: 24rpx 24rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
  }
}

.m-info-box label {
  color: $default-skin-bg;
  display: block;
  font-size: 28rpx;
}

.m-info-price {
  color: $secondary-skin-color;;
  font-size: 48rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 66rpx;

  span {
    padding: 0 8rpx;
  }
}

.m-info-price text {
  font-size: 28rpx;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  //color: #888888;
  line-height: 40rpx;
}

.m-info-delprice {
  color: #888;
  margin-left: 10rpx;
  text-decoration: line-through;
  position: relative;
}

/*优惠券样式 start*/
.m-coupon-list {
  margin-top: 36rpx;
}

.m-coupon-item {
  width: 700rpx;
  height: 192rpx;
  margin: 10rpx auto;
  background: url(https://static.shopsuite.cn/xcxfile/appicon/Coupon_V2.png) no-repeat;
  background-size: contain;
  box-sizing: border-box;
  padding: 12rpx;
}

.m-coupon-info {
  float: left;
  width: 486rpx;
  margin-left: 30rpx;
  margin-top: 9.5rpx;
}

.m-coupon-btn {
  float: left;
  width: 110rpx;
  margin-left: 30rpx;
  line-height: 36rpx;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
}

.btn-coupon {
  display: inline-block;
  width: 28rpx;
}

.btn-coupon-gray {
  //color: #888;
}

.m-coupon-text {
  float: left;
  width: 300rpx;
}

.m-coupon-text label {
  display: inline-block;
  color: #333;
  font-size: 28rpx;
  width: 250rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32rpx;
}

.m-coupon-text text {
  display: inline-block;
  width: 350rpx;
  font-size: 24rpx;
  color: #888;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32rpx;
}

.m-coupon-price {
  float: left;
  height: 132rpx;
  color: $default-skin-bg;
  font-weight: bold;
  line-height: 132rpx;
  width: 180rpx;
  position: relative;
  font-size: 75rpx;
}

.price-content-box {
  position: absolute;
  left: -35rpx;
  text-align: center;
  width: 280rpx;
  font-size: 40rpx;
}

.price-content-box label {
  font-size: 32rpx;
}

/*优惠券样式 end*/

.dis {
  display: flex;
  justify-content: flex-end;
  /*width: 360rpx;*/
  flex: 1;
  float: right;
  line-height: 74rpx;
}

.dis .num {
  font-size: 24rpx;
  font-weight: bold;
  color: #717171;
  padding-right: 20rpx;
  text-align: right;
}

.selled {
  display: flex;
  justify-content: flex-end;
  width: 180rpx;
  float: right;
  line-height: 74rpx;
}

.selled .num {
  font-size: 24rpx;
  color: #717171;
  padding-right: 20rpx;
  text-align: right;
}

.m-info-tip {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #888888;
  //line-height: 60rpx;
}

.m-info-sp {
  font-size: 28rpx;
}

.m-info-sp label {
  margin-left: 20rpx;
}

.m-comment .m-media-box-title {
  font-size: 28rpx;
}

.m-comment .m-media-box-hd {
  border-radius: 100%;
  overflow: hidden;
  vertical-align: top;
}

.m-start label {
  font-size: 24rpx;
}

.m-media-box-info-meta {
  padding-right: 5rpx;
}

.sel {
  color: $default-skin-bg;
  font-size: 24rpx;
}

.m-tiem {
  float: right;
}

.m-panel-hd label {
  float: right;
}

.m-panel-hd text {
  color: $default-skin-bg;
  margin-left: 10rpx;
}

.m-comment .m-media-box-info-meta {
  font-size: 24rpx;
  font-weight: 100;
}

.g-flex-item {
  font-size: 28rpx;
  padding: 10rpx;
  border-top: 1rpx solid #d5d5d5;
  border-right: 1rpx solid #d5d5d5;
}

.m-Packinglist {
  font-size: 28rpx;
  padding: 20rpx;
}

/*底部按钮 start*/
.m-footer-btn {
  width: 94%;
  padding: 0rpx 24rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  text-align: center;
  z-index: 3;

  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 2rpx solid #EEEEEE;

  .iconfont {
    font-size: 20px;
    font-weight: 600;
  }
}

.m-footer-btn-list {
  /*width: 50%;*/
  height: 100%;
  position: relative;
  float: left;
  display: flex;
  flex-direction: row;
}

.m-footer-btn-list::before {
  // content: " ";
  position: absolute;
  left: 0;
  top: -2rpx;
  right: 0;
  height: 2rpx;
  border-bottom: 2rpx solid #d5d5d5;
  color: #CCCCCC;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  // z-index: 3;
}

.m-footer-btn-item {
  position: relative;
  float: left;
  width: 110rpx;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
  padding: 8rpx 0;
  // border-right: 1rpx solid #d5d5d5;
  box-sizing: border-box;
  flex: 1;
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
    height: 120rpx;
    line-height: 120rpx;
  }

  position: absolute;
  z-index: 10;
  height: 120rpx;
  line-height: 120rpx;
  color: #fff;
  font-size: 26rpx;
  width: 100%;
  bottom: 0;
  left: 0;
  width: 100%;
}

.m-footer-btn-item:last-child {
  border: none;
}

.m-footer-btn-icon {
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  margin: 0 auto;
  position: relative;
}

.m-footer-btn-item image {
  width: 40rpx;
  height: 40rpx;
}

.m-footer-btn-item contact-button {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}

.m-footer-btn-main {
  width: 25%;
  // height: 100%;
  float: left;
  background-color: #ff9402;
  color: #fff;

  height: 40px;
  line-height: 40px;
  font-weight: 500;
  font-size: 32rpx;
  flex: 1;


  border-radius: 18rpx;
}

.m-footer-desable {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}

.m-now {
  background-color: #ff0136;
}

/*底部按钮 end*/
/*选择规格遮罩 start*/
.m-panel-sp {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.2);

}

.m-panel-sp-content {
  background-color: #fff;
  position: absolute;
  width: 100%;
  bottom: 0;
  box-shadow: 0px -10rpx 15rpx rgba(0, 0, 0, 0.35);
  border-radius: 20rpx;
}

.m-panel-sp-pinfo {
  height: 170rpx;
  box-sizing: border-box;
  padding: 20rpx;
  position: relative;

  padding-bottom: 0;
}

.m-panel-sp-pimg {
  width: 200rpx;
  height: 200rpx;
  position: absolute;
  top: -50rpx;
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
  float: left;
  margin-left: 216rpx;
  font-size: 28rpx;
  line-height: 40rpx;

  margin-top: 6rpx;
}

.m-panel-sp-pname .m-pprice {
  color: $default-skin-bg;
  font-size: 32rpx;
  line-height: 50rpx;
  font-weight: bold;

  display: inline;
}

.m-panel-sp-icon {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  z-index: 9999;
}

/* .m-panel-sp-listbox{height: 604rpx;} */
.m-panel-sp-listbox-item {
  //border-top: 1rpx solid #d5d5d5;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
}

.m-panel-sp-listbox-item .m-cells-title {
  color: black;
  padding-left: 0;
}

.m-panel-sp-labellist {

}

.m-panel-sp-labellist label {
  display: inline-block;
  font-size: 24rpx;
  padding: 10rpx 15rpx;
  border-radius: 8rpx;
  margin: 10rpx;
  color: #888;
  border: 1rpx solid #d5d5d5;
}

/* for b2b */
.m-panel-sp-labellist1 label {
  display: block;
  font-size: 24rpx;
  padding: 10rpx 15rpx;
  border-radius: 8rpx;
  margin: 10rpx;
  color: #888;
  border: 1rpx solid #d5d5d5;
  float: left;
  /*width: 8%;*/
  text-align: center;
  margin-top: 13px;
  margin-bottom: 25px;
}

.m-panel-sp-sellabel-no {
  /*
  color: #d5d5d5 !important;
  border: 1rpx solid #d5d5d5 !important;
  */
  float: left !important;
  // position: absolute;
  left: 20%;
  top: 9.3%;
}


.uni-numbox {
  // margin-left: 64%;
  display: inline-flex;
  height: 100% !important ;
  width: 100%;
}

.uni-numbox__plus {
  height: 100%;
}

.m-panel-sp-labellist2 {
  display: none;
}

.m-panel-sp-sellabel1 {
  display: none !important;
}

.m-ys {
  float: left;
  height: 35px;
  line-height: 35px;
  overflow: hidden;
  width: 100%;
  border-radius: 5px;
  margin: 5px;
}

/* end for b2b */
.product-info {
  .m-panel-sp-sellabel {
    border: 0 !important;
    color: #888 !important;
    margin: 0 5px;
    padding: 0;

    font-size: 14px;
  }
}

.activity-fixtop {
  padding-top: 1px !important;
}

.m-panel-sp-sellabel {
  color: $default-skin-bg !important;
  border: 1rpx solid $default-skin-bg !important;
}

.m-panel-sp-sellabel-b2b {
  color: #888 !important;
  border: 1px solid #d5d5d5 !important;
}


.m-panel-sp-sellabel-b2b-h {
  color: $default-skin-bg !important;
  border: 1rpx solid $default-skin-bg !important;
}


.m-m-panel-sp-btn {
  height: 80rpx;
  //width: 100%;
  width: 94%;
  position: absolute;
  bottom: 0;
  left: 0;

  background-color: #fff;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  padding: 24rpx;
  display: flex;
}

.m-m-panel-sp-lbtn {
  float: left;
  width: 50%;
  //border-top: 1rpx solid #d5d5d5;
  border: 2rpx solid $default-skin-bg;
  border-right: 0;
  text-align: center;
  border-radius: 9px 0px 0px 9px;


  display: flex;
  line-height: 76rpx;
  height: 76rpx;
}

.m-m-panel-sp-rbtn {
  width: 50%;
  float: left;
  background-color: $default-skin-bg;
  line-height: 80rpx;
  font-size: 32rpx;
  color: #fff;
  text-align: center;
  font-weight: 500;
}

/*选择规格遮罩 end*/
.m-null-product {
  color: #888;
  font-size: 32rpx;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -80rpx;
  margin-top: -76rpx;
}

.m-null-product label {
  font-size: 100rpx;
}

.m-navbar {
  background-color: transparent;
}

.m-navbar-item {
  padding: 20rpx 0;
  font-size: 14px;
}

.m-navbar-item:after {
  border: none;
}

.m-navbar-item.m-navbar-item-on {
  background-color: transparent;
  //background-color: #fff;
  //color: $default-skin-bg;
}

.m-navbar-item.m-navbar-item-on::before {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 6rpx;
  //border-bottom: 6rpx solid $default-skin-bg;
  color: #CCCCCC;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 3;
}

/*拼团*/
.progressBarBox {
  float: right;
  color: #888;
  font-size: 24rpx;
  margin-right: 20rpx;
  font-weight: 200;
  line-height: 64rpx;
}

.progressBarBox label {
  color: #333;
  font-weight: 200;
  font-size: 24rpx;
}

.m-FGB-time {
  display: inline-block;
  background-color: #666666;
  padding: 5rpx;
  color: #fff !important;
  border-radius: 4rpx;
  min-width: 28rpx;
  height: 28rpx;
  line-height: 28rpx;
  text-align: center
}

.m-FGB-time-tip {
  margin: 0 4rpx;
}

.m-fightGroupsBox .m-media-box-bd {
  font-size: 24rpx;
  color: #888;
  padding: 10rpx 30rpx;
  line-height: 40rpx;
}

.u-fg {
  font-size: 32rpx;
  line-height: 40rpx;
  box-sizing: border-box;
  padding: 10rpx;
}

.u-fg view:first-child {
  font-size: 24rpx;
}

.m-fg-btn .m-footer-btn-list {
  width: 30%;
}

.m-fg-btn .m-footer-btn-main {
  width: 35%;
}

.m-fg-comment {
  margin-bottom: 20rpx;
}

.m-fg-comment .m-media-box {
  padding: 24rpx 15rpx;
}

.m-fg-comment .m-media-box-bd {
  line-height: 50rpx;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-media-box-title-tip {
  color: $default-skin-bg;
  font-size: 24rpx !important;
}

.m-media-box-desc-tip {
  color: #333;
  font-size: 24rpx;
}

.m-media-box-bd .u-btn {
  padding: 0;
  margin: 0 20rpx;
  width: 160rpx;
  float: right;
  font-size: 24rpx;
  line-height: 50rpx;
  margin-top: 10rpx;
}

.m-fg-comment .m-media-box-hd {
  margin-right: 10rpx;
  width: 80rpx;
  height: 80rpx;
}

.m-media-box-bd-tip {
  text-align: center;
}

.m-price-tip {
  padding: 5rpx 10rpx;
  color: #fff !important;
  background-color: $default-skin-bg;
  display: inline-block !important;
  font-weight: 200;
  font-size: 24rpx !important;
  position: relative;
  margin-left: 10rpx;
  border-radius: 4rpx;
  top: -10rpx;
}

.m-price-tip::after {
  position: absolute;
  content: "";
  border: solid 10rpx $default-skin-bg;
  border-color: transparent $default-skin-bg transparent transparent;
  left: -15rpx;
  top: 50%;
  margin-top: -10rpx;
}

.progressBarBox-content {
  width: 160rpx;
  height: 15rpx;
  background-color: #d5d5d5;
  border-radius: 20rpx;
}

.progressBarBox-content label {
  height: 15rpx;
  background-color: #ffc001;
  border-radius: 20rpx;
}

.progressBarBox-text {
  text-align: center;
}

.progressBarBox-text text {
  font-size: 24rpx !important;
  font-weight: 200;
}

/*拼团*/
/*当前拼团*/
.currentFG {
  padding: 20rpx;
  background-color: #fff;
  margin-top: 20rpx;
  text-align: center;
}

.currentFG-item {
  display: inline-block;
  width: 100rpx;
  height: 100rpx;
  border-radius: 100%;
  overflow: hidden;
}

.currentFG-item image {
  width: 100%;
  height: 100%;
}

/*当前拼团*/
.u-tap-btn {
  position: fixed;
  right: 20rpx;
  bottom: 150rpx;
  z-index: 3
}

.u-go-home {
  border-radius: 100%;
  width: 80rpx;
  height: 80rpx;
  border: 1px solid #eee;
  font-size: 20rpx;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.35);
  z-index: 2;
  opacity: 0.8;
  line-height: 80rpx;
  margin-bottom: 20rpx;
}

.u-go-home .iconfont {
  font-size: 40rpx;
}

.m-media-list {
  float: left;
  width: 100%;
}

.m-media-list image {
  width: 115rpx;
  height: 115rpx;
  box-sizing: border-box;
  margin: 10rpx;
  border: 1rpx solid #eee;
}

.m-media-box-appmsg {
  align-items: initial;
}

.wxParse-p image {
  vertical-align: top;
}

.video {
  position: absolute;
  bottom: 40rpx;
  left: 44%
}

.seckill {
  display: flex;
  height: 120rpx;
  color: #fff;
  background: linear-gradient(270deg, #DB384C 0%, #FF7495 100%);
  border-radius: 11px 11px 0 0;
  position: relative;
  bottom: -11px;
  padding-bottom: 11px;
}

.seckill-left {
  width: 70%;
  padding-left: 20rpx;
  //background: #ff0136;
  display: flex;
  flex-flow: column;

  margin: auto;

}

.seckill-right {
  width: 35%;
  //background: rgb(254, 234, 233);
  display: flex;
  //align-items: center;
  justify-content: center;
  flex-flow: column;

  text-align: right;
  padding-right: 20rpx;
  margin-top: 10rpx;

  image {
    width: 166rpx;
    height: 44rpx
  }
}

.seckill-left .discountPrice {
  margin-top: 2rpx;

  text.m-info-delprice {
    font-size: 12px;
    color: #fff;
  }
}

.seckill-left .discountPrice text {
  font-size: 56rpx
}

.seckill-left .Price {
  display: flex;
  margin-bottom: 10rpx;
}

.seckill-left .Price image {
  width: 166rpx;
  height: 44rpx
}

.seckill-left .Price view {
  text-decoration: line-through;
  margin-left: 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center
}

.seckill-right .endTime {
  //color: #ff0136;
  margin-bottom: 16rpx;
}

.seckill-right .Time {
  font-size: 12px;
  padding-top: 4rpx;
}

.seckill-right .time {
  //padding: 8rpx 8rpx;
  font-size: 14px;
  border-radius: 10rpx;
  //background: #ff0136
}

.seckill-right .time-tip {
  //color: #ff0136;
  //margin: 0 6rpx
}

// 拼团信息
.groupbooking {
  display: flex;
  height: 140rpx;
  color: #fff;
  background: linear-gradient(270deg, #FF3055 0%, #FF564E 100%);
  height: 160rpx;

  .m-info-price {
    color: $secondary-skin-color;;
    font-size: 48rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;

    span {
      padding: 0 8rpx;
    }
  }

  .m-info-price text {
    font-size: 28rpx;
    font-weight: 300;
  }

  .progressBarBox {
    position: relative;
    bottom: 0rpx;
    left: 140rpx;
  }
}

.groupbooking .label .userLimt {
  background-color: #fff;
  padding: 20rpx 30rpx;
  width: 80rpx;
  height: 22rpx;
  border-radius: 100rpx;
  font-size: 22rpx;
  font-weight: bold;
  display: flex;
  color: $default-skin-bg;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 200rpx;
  bottom: 65rpx;
}

.groupbooking .label {
  color: #fff;
  margin: 10rpx;
}

.groupbooking .endlabel {
  color: #FEBEA1;
}

.groupbooking .m-info-delprice {
  color: #FFB2B2;
  position: relative;
  top: 40rpx;
  right: 180rpx;
  font-size: 24rpx;
}

.groupbooking-name {
  background: #fff;
  height: 100rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.groupbooking-rule {
  background: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  font-size: 30rpx;

  .groupbooking-rule-title {
    padding: 10rpx;
    display: flex;
    align-items: center;
  }

  .red-dot {
    content: "";
    width: 6rpx;
    height: 32rpx;
    background-color: red;
    margin-right: 8px;
  }

  .groupbooking-rule-line {
    border-bottom: 2rpx solid #eee;
  }

  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
  }

  .flex-item {
    text-align: center;
  }

  .arrow {
    display: flex;
    align-items: center;
  }

  .flex-item-img {
    width: 50rpx;
    height: 50rpx;
  }

  .right-arrow {
    width: 40rpx;
    height: 40rpx;
  }
}

/* 店铺信息 */

.goods-detail-store .store_name {
  font-size: 32rpx;
  color: #333;
}

.m-cells::after {
  height: 0;
  border-bottom: 0;
}


.goods-detail-store label {
  font-size: 44rpx;
  float: left;
  line-height: 48rpx;
}

.goods-detail-store label.icon-mall {
  color: #ff6700;
  font-size: 32rpx !important;
  margin: auto 6rpx;
}

.goods-detail-store .store-rate {
  margin: 6rpx 30rpx 0rpx
}

.goods-detail-store .store-rate label {
  display: inline-block;
  width: 33.33%;
  height: 80rpx;
  font-size: 26rpx;
  line-height: 80rpx;
  color: #999999;
  padding: auto 60rpx;
}

.goods-detail-store .store-rate label view {
  display: inline-block;
  vertical-align: middle;
  font-size: 26rpx;
  font-weight: 600
}

.goods-detail-store .store-rate label i {
  display: inline-block;
  vertical-align: middle;
  width: .7rem;
  height: .7rem;
  font-size: .45rem;
  line-height: .7rem;
  font-style: normal;
  text-align: center;
  border-radius: .1rem
}

.goods-detail-store .store-rate label.equal view,
.goods-detail-store .store-rate label.high view {
  margin-left: 4rpx;
  color: #ff6700
}

.goods-detail-store .store-rate label.equal i,
.goods-detail-store .store-rate label.high i {
  color: #FFF;
  background-color: #ff6700
}

.goods-detail-store .store-rate label.low view {
  color: #48CFAE
}

.goods-detail-store .store-rate label.low i {
  color: #FFF;
  background-color: #48CFAE
}


/* share */
.textarea-wrp {
  padding: 0 20rpx;
}

.page-section {
  margin-bottom: 20rpx;
}

.textarea {
  border: 2rpx solid #D8D8D8;
  padding: 10rpx;
  height: 90rpx;
  width: 690rpx;
}

.uni-input {
  border: 2rpx solid #D8D8D8;
  padding: 0 10rpx;
  width: 690rpx;
}

.uni-uploader-body {
  display: flex;
  justify-content: center;
}

radio-group {
  box-sizing: border-box;
  width: 100%;
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
}


.item_disabled {
  background-color: #ddd !important;
  cursor: not-allowed;
}

.m-footer-btn-icon .uni-badge {
  position: absolute;
  z-index: 9;
  margin-left: -4rpx;
  margin-top: -10rpx;
}

/* */
.u-p-opt {
  position: absolute;
  right: 20rpx;
  bottom: 110rpx
}

.navtext {
  margin-bottom: 20rpx;
}

.quicknav {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 1rpx solid #EEE;

  .iconfont {
    text-align: center;
    vertical-align: middle;
    line-height: 80rpx;
    height: 80rpx;
    font-size: 40rpx;
  }

  .iconfont.zc {
    text-align: center;
    vertical-align: middle;
    line-height: 80rpx;
    height: 80rpx;
    font-size: 40rpx;
    color: #7a7a7a;
  }

}

.u-p-opt .navtext:first-child {

}

.u-p-opt .navtext:last-child {
  margin-bottom: 0rpx;
}

/* 修正"app-plus": {
                "titleNView": {
                    "type": "transparent"

                    scroll view 问题
*/
.fix-titlenview-trans {
  height: calc(100% + 88rpx)
}


/* near chain*/
.m-nearbylist label {
  font-size: 26rpx;
}

.list-box {
  background-color: #fff;
  color: #333;
}

.item-box {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.flex-box {
  display: flex;
  align-items: center;
  position: relative;
}

.flex-shop {
  width: 30rpx;
  height: 30rpx;
}

.m-imfo-sp-selext-name {
  margin-left: 25rpx;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.flex-title {
  font-size: 30rpx;
  margin-left: 10rpx;
  max-width: 75%;
  overflow: hidden;
  height: 40rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-postion {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
}

.flex-postion image {
  width: 20rpx;
  height: 26rpx;
}

.flex-postion label {
  font-size: 24rpx;
  color: #9b9b9b;
  margin-left: 10rpx;
}

.m-nearbylist {
  position: absolute;
  width: 100%;
  height: 100%;
}

.flex-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-info view {
  margin: 10rpx 0 0 0;
  font-size: 28rpx;
}

.flex-info-box {
  display: flex;
  align-items: flex-start;
}

.flex-info label {
  display: inline-block;
  vertical-align: top;
  word-wrap: break-word;
  width: 520rpx;
}

.flex-info image {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 10rpx;
}

.flex-info-title {
  flex-basis: 145rpx;
}

.open_ba {
  width: 80%;
  margin: 0 auto
}

.open_dl {
  width: 34%;
  height: 79rpx;
  background: #33cc66;
  border-radius: 20rpx;
  text-align: center;
  color: #fff;
  margin: 79rpx auto 0 auto;
  line-height: 75rpx;
}


.nearbylist-item {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #eee;
  background: white;
}

.nearbylist-item:last-child {
  border: none;
}

.item-info {
  position: relative;
  font-size: 28rpx;
}

.item-name {
  display: inline-block;
  font-size: 30rpx;
}

.item-phone {
  line-height: 45rpx;
  display: flex;
  align-items: center;
}

.item-distance {
  float: right;
  font-size: 26rpx;
  color: #bbb;
}

.item-address {
  position: relative;
  font-size: 26rpx;
  color: #bbb;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-right: 40rpx;
  line-height: 40rpx
}

.item-info::after {
  content: " ";
  display: inline-block;
  height: 12rpx;
  width: 12rpx;
  border-width: 4rpx 4rpx 0 0;
  border-color: #ebebe7;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  top: -4rpx;
  position: absolute;
  top: 72%;
  right: 4rpx;
  padding: 3rpx;
}

.m-nearbylist {
  height: 100%;
  position: absolute
}

.tag-view {
  /* #ifndef APP-PLUS-NVUE */
  display: inline-flex;
  /* #endif */
  flex-direction: column;
  margin: 10rpx 15rpx;
  justify-content: center;
}


.evaluate {
  width: 750rpx;
  height: 380rpx;
  background: rgba(255, 255, 255, 1);
  margin-top: 20rpx;
}


.evaluate-top {
  width: 750rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 1);
  position: absolute;
  margin-top: 24rpx;
  margin-left: 30rpx;
}

.right {
  width: 150rpx;
  height: 24rpx;
  font-size: 26rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: $main-skin-color;

}

.evaluate-right {
  position: absolute;
  margin-top: -52rpx;
  margin-left: 550rpx;
}


.evaluate-bottom {
  width: 750rpx;
  background: rgba(255, 255, 255, 1);
  position: absolute;
  margin-top: 80rpx;
}

.uesr-evaluate {
  width: 600rpx;
  height: 200rpx;
  // background:rgba(244,244,244,1);
  border-radius: 8rpx;
  float: left;
  padding-top: 20rpx;
  padding-left: 30rpx;
}

.uesr-evaluate-center {
  width: 100%;
  height: 200rpx;
  background: rgba(244, 244, 244, 1);
  border-radius: 0rpx 8rpx 8rpx 0rpx;
  float: left;
}

.more-items {

}

.more-items-title {
  width: 100%;
  height: 100rpx;
  background: rgba(244, 244, 244, 1);
}

.uesr-evaluate-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 0rpx 8rpx 8rpx 0rpx;
  background: rgba(255, 255, 255, 1);
  float: left;
}

.center-top {
  width: 360rpx;
  height: 60rpx;
  // background:rgba(255,255,255,1);
  margin: 20rpx 20rpx;
  text-align: left;
}

.user-image {
  width: 60rpx;
  height: 60rpx;
  background: rgba(244, 244, 244, 1);
  border-radius: 50%;
  float: left;
}

.user-name {
  width: 176rpx;
  height: 24rpx;
  font-size: 26rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin: 0 20rpx;
  overflow: hidden
}

.user-text {
  /* width:360rpx; */
  height: 80rpx;
  // background:rgba(255,255,255,1);
  margin-left: 20rpx;
  overflow: hidden;


}

.user-text label {
  width: 360rpx;
  height: 80rpx;
  font-size: 20rpx;
  font-family: Alibaba PuHuiTi;
  line-height: 22rpx;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  word-wrap: break-word;
  word-break: normal;
}

.p-adds {
  width: 750rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 1);
  margin-top: 20rpx;
}

.p-adds-left {
  width: 100rpx;
  height: 100rpx;
  float: left;
}

.p-adds-left label {
  width: 60rpx;
  height: 25rpx;
  font-size: 26rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  position: absolute;
  margin-left: 30rpx;
  margin-top: 30rpx;
}

.p-adds-right {
  width: 600rpx;
  height: 100rpx;
  float: right;
}

.p-adds-right label {
  position: absolute;
  margin-top: 30rpx;
  font-size: 26rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}


.evaluate-top .left {
  width: 228rpx;
  height: 31rpx;
  font-size: 32rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.m-store {
  width: 100%;
  height: 460rpx;
  background: rgba(255, 255, 255, 1);
  margin-top: 20rpx;
}

.m-store-info {
  width: 750rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 1);

  padding: 24rpx;
  background: #FFFFFF;
  border-radius: 12rpx;

  .info-brand {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #888888;
    line-height: 40rpx;
    padding: 20rpx 0;

    label {
      padding: 0 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }
  }

  .m-store-name {
    padding: 0 30rpx;

    .m-name {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 44rpx;
    }

    .m-quantity {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #555555;
      line-height: 40rpx;
      padding: 6rpx 0;
    }
  }

}

.m-store-radi {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, rgba(105, 178, 25, 1), rgba(121, 202, 32, 1));
  border-radius: 50%;
  position: absolute;
  margin: 20rpx 30rpx;

}

.m-store-radi label {
  width: 58rpx;
  height: 28rpx;
  font-size: 30rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  margin: 12rpx;
}

.m-store-items {
  width: 100%;
  height: 380rpx;
  background: rgba(255, 255, 255, 1);
  white-space: normal;
}

.m-store-item {
  width: 210rpx;
  height: 340rpx;
  // background:rgba(244,255,232,1);
  float: left;
  margin-top: 20rpx;
  margin-left: 30rpx;

}

.m-store-item-image {
  width: 210rpx;
  height: 210rpx;
  border-radius: 8rpx;
  background: rgba(242, 242, 242, 1);
}

.m-store-item-name label {
  /* width:150rpx; */
  height: 60rpx;
  font-size: 26rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 60rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.m-store-item-price label {
  width: 100px;
  height: 30px;
  font-size: 20rpx;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  color: #FF5A00;
  text-align: center;
}


.scroll-view_H {
  white-space: nowrap;
  width: 100%;
  background-color: #fff;
  margin-top: 24rpx;
  border-radius: 12rpx;
}

.scroll-view-item {
  height: 300rpx;
  line-height: 300rpx;
  text-align: center;
  font-size: 36rpx;
}

.scroll-view-item_H {
  display: inline-block;
  /* height: 260rpx; */
  // line-height: 300rpx;
  text-align: center;
  font-size: 36rpx;
}

.m-policy {
  background-color: #ffe7d0;
}

.m-imfo-sp-title {
  color: #A5988F;
}

.m-imfo-sp-money {
  color: #ff7300;
}

.bottom-safearea {
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.activity-title {
  height: 96rpx;
  width: 100%;
  line-height: 96rpx;
  /* padding: 5px; */
  text-align: center;
  font-size: 52rpx;
  color: #c0a080;
  display: block;
}

.product-item {
  border: 1px dashed #c5a789;
  height: 500rpx;
  margin-top: 20rpx;
  overflow-y: scroll;
  overflow-x: none;
  padding: 10px;
  border-radius: 8px;
}

.gift-item {
  border: 1px solid #dadadc;
  margin-top: 2px;
}

.gift-rule {
  margin-top: 18rpx;
  font-size: 24rpx;
  margin-bottom: 18rpx;
  color: #c0a080;
}

.scroll-view_H {
  white-space: nowrap;
  width: 100%;
  height: 344rpx;
}

.scroll-view-item {
  height: 300rpx;
  line-height: 300rpx;
  text-align: center;
  font-size: 36rpx;
}

.scroll-view-item_H {
  display: inline-block;
  //width: 640rpx;
  height: 344rpx;
  background: #ffffff;
  opacity: 1;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.product-l-img {
  width: 240rpx;
  height: 240rpx;
  background: rgba(0, 0, 0, 0);
  opacity: 1;
  border-radius: 16rpx 16rpx 0rpx 0rpx;
}

.product-l-price {
  width: 208rpx;
  height: 88rpx;
  background: rgba(255, 255, 255, 1);
  // padding:8rpx 16rpx;
  margin-top: 10px;

  .product_name {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 28rpx;
    color: #002951;
    opacity: 1;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .m-project-tips {
    height: 18rpx;
    font-size: 14rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 18rpx;
    color: #002951;
    opacity: 0.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 4rpx 0rpx;
  }

  .price-new {
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    line-height: 34rpx;
    color: #ff4142;
    opacity: 1;
    margin: 5px 0;
  }

}

.evaluate {

  .scroll-view_H {
    white-space: nowrap;
    width: 100%;
    height: 255rpx;
    // margin-left: 24rpx;
  }

  .scroll-view-item {
    height: 300rpx;
    line-height: 300rpx;
    text-align: center;
    font-size: 36rpx;
  }

  .scroll-view-item_H {
    display: inline-block;
    height: 260rpx !important;
    // line-height: 300rpx;
    // text-align: center;
    font-size: 36rpx;
  }
}

.sgar {
  color: #fff !important;
  font-weight: 400;
  font-size: 20rpx;
  background: #333959;
  padding: 0rpx 15rpx !important;
  border-radius: 5rpx;
  display: inline-block !important;
  margin: 0rpx 10rpx 0rpx 50rpx !important;
}

.m-cell-bd.coupon {
  display: flex;
  align-items: flex-start;
  line-height: 1;

  .m-info-tip {
    white-space: nowrap;
    margin-top: 10rpx;
  }

  .m-coupon-item1 {
    height: initial;
    margin: 0;
    padding: 0;

    .m-coupon-info {
      margin-left: 24rpx;

      width: 560rpx;
    }

    .m-coupon-text {
      width: 100%;

      uni-text {
        width: 100%;
      }
    }
  }
}

.product-info {
  padding: 24rpx;
  padding-bottom: 0;

  .info-content {
    background: #ffffff;
    border-radius: 12rpx;
    border-radius: 11px 11px 0 0;
    padding: 24rpx 0px 24rpx 24rpx;

    .min-quantity {
      background: #a76e38;
      border-radius: 200rpx 0px 0px 200rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 34rpx;
      padding: 10rpx 18rpx;
      right: 23rpx;
      margin-top: 15rpx;
    }

    .m-info-name {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 44rpx;
      display: -webkit-box;
      -webkit-line-clamp: 3; /*设置多少行*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 10rpx 0;
    }

    .m-info-tips {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
      padding: 2rpx 0;
      line-height: 36rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.m-item {
  border-radius: 4rpx;
  border: 1rpx solid #f56605;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f56605;
  line-height: 34rpx;
  padding: 4rpx;
}

.m-footer-btn-main-left {
  background: lighten($default-skin-bg, 6.5%);
  border-radius: 18rpx 0px 0px 18rpx !important;
}

.m-footer-btn-main-right {
  background: $default-skin-bg;

  border-radius: 0px 18rpx 18rpx 0px !important;
}

.m-m-panel-sp-rbtn {
  border-radius: 18rpx 18rpx 18rpx 18rpx;
}

.m-pstock {
  display: inline;
  margin-left: 20rpx;
}

.m-pspec {
  background: #F5F5F5;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 34rpx;
  padding: 10rpx;
  margin-top: 10rpx;

  display: table;
}

.spec-info {
  width: 216rpx;
  height: 290rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  float: left;
  margin-right: 14rpx;
  margin-right: 14rpx;
  margin-bottom: 14rpx;
  border: 1rpx solid #EEEEEE;

  .spec-image {
    width: 194rpx;
    height: 194rpx;
    padding: 14rpx 12rpx 0rpx 14rpx;
  }

  .spec-info-name {

    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 33rpx;
    padding: 4rpx 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 2; // 想要超出三行显示 就把这里改成3就好了

    text-align: center;
  }
}

.spec-checked {
  border: 2rpx solid $default-skin-bg;
  background: rgba(167, 110, 56, 0.1);

}

.m-customized {
  display: flex;
  padding: 46rpx 24rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 40rpx;

  .m-customized-left {
    width: 8%;
    color: #555555;
  }

  .m-customized-center {
    color: #222222;
    padding: 0 28rpx;
    width: 50%;
  }

  .m-customized-right {
    color: #222222;
    width: 30%;
    text-align: right;
  }
}

.m-input-quantity {
  padding: 24rpx;
  display: flex;
  justify-content: space-between;

}

.m-price {
  display: flex;
  justify-content: flex-end;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 40rpx;
  padding: 22rpx 24rpx;
}

.split-line {
  border: 0.5pt solid #EEEEEE;
  width: 100%
}

.split-lines {
  border: 0.5pt solid #EEEEEE;
  width: 360px;
  margin-left: 13px;
  margin-top: 15px;
}

.customized-info {
  display: flex;
  align-items: center;
  padding: 14rpx 24rpx 34rpx 24rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #555555;
  line-height: 40rpx;


  span {
    padding: 0 18rpx;
  }
}

.policy-quantity {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #888888;
  line-height: 36rpx;
}

.popup-content {
  width: 566rpx;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .p-top {
    width: 100%;
    height: 140rpx;
  }

  .close-img {
    position: absolute;
    bottom: -132rpx;
    left: 44%;

    image {
      width: 64rpx;
      height: 64rpx;
    }
  }

  .p-content {
    font-size: 32rpx;
    line-height: 40rpx;
    text-align: center;
    padding: 50rpx 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }

  .p-bottom {
    display: flex;
    justify-content: space-between;
    padding: 0 60rpx;

    .button {
      width: 180rpx;
      height: 80rpx;
      border-radius: 18rpx;
      border: 1rpx solid #a76e38;
      text-align: center;
      line-height: 80rpx;
      margin-top: 15px;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a76e38;
    }

    .button-right {
      background: #a76e38;
      color: #fff;
    }
  }
}

.nav-head-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* #ifdef MP */
  width: 76%;
  /* #endif */
  background: rgba(255, 255, 255, 0);


  .back {
    position: absolute;
    left: 0;
    top: 13rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100rpx;
    height: 64rpx;


    // 返回
    .back-one {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50rpx;
      height: 50rpx;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 100%;

      text {
        display: flex;
        width: 20rpx;
        height: 20rpx;
        border-left: 2rpx solid #FFFFFF;
        border-bottom: 2rpx solid #FFFFFF;
        transform: rotate(45deg);
      }
    }

    .action {
      background-color: transparent;

      text {
        border-color: #555555;
      }
    }
  }

  // 分享更多
  .share {
    position: absolute;
    right: 0;
    top: 13rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100rpx;
    height: 64rpx;


  }


}

.selext-parameter {
  overflow: hidden; //超出的文本隐藏
  display: -webkit-box;
  -webkit-line-clamp: 1; // 超出多少行
  -webkit-box-orient: vertical;
}


.indicator-point {
  position: absolute;
  background: #000000;
  border-radius: 21px;
  opacity: 0.3;
  right: 24rpx;
  bottom: 38rpx;

  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 34rpx;
  padding: 4rpx 20rpx;
}

.ttd::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 2rpx solid #ebebe7 !important;
  color: #ebebe7;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}


/*Grid*/
.spec-box-grids {
  position: relative;
  overflow: hidden;
  clear: both;

  background-color: #ffffff;
  white-space: nowrap;
  width: 534rpx;

  font-size: 14px;
  line-height: 64rpx;
  padding-left: 16rpx;

  .spec-box-grid {
    margin-right: 14rpx;
    display: inline-block;
    text-align: center;

    &.active {
      .spec-box-grid-label {
        color: #c0a080;
        // background-color: pink;
      }
    }
  }

  .spec-box-grid-border {
    border-right: 1rpx solid #d9d9d9;
    border-bottom: 1rpx solid #d9d9d9;
  }

  .spec-box-grid:active {
    background-color: #ececec;
  }

  .spec-box-grid-icon {
    width: 68rpx;
    height: 68rpx;
    margin: 0 auto;

    image {
      display: block;
      width: 100%;
      height: 100%;
    }

  }

  .spec-box-grid-label {
    margin-top: 10rpx;
  }

  .spec-box-grid-label {
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

.spec-box-grids-border {
  border-top: 1rpx solid #d9d9d9;
  border-left: 1rpx solid #d9d9d9;
}

.active {
  background-color: #c0a080;
}

.favorite-share {
  display: flex;
  margin-left: auto;
  text-align: center;
  background: #FFFFFF;
  line-height: 60rpx;
  color: #999;

  .iconfont {
    font-size: 22px;
    color: #999;
    line-height: 24px;
  }

  label:first-child {
    margin-right: 20rpx;
  }

  .highlight {
    color: #DB384C !important;
  }

  margin-top: auto;
  margin-bottom: auto;
}

.icon-share {
  font-weight: 700;
  padding-right: 8rpx;
}

.m-info-price {
  display: flex;
  align-items: center;
  padding-right: 24rpx;
}

.nameBox {
  display: flex;
  padding-right: 24rpx;
}

/* #ifdef MP */
.icon-cart {
  margin-left: -2rpx;
}
/* #endif */

.detail-text {
  line-height: 36px;
  height: 30px;
  margin-right: 12px;

  .text {
    margin-right: 10rpx;
  }
}

.ap {
  color: red;font-size: 16px;font-weight: bold;
  margin:auto 6rpx
}

.activity-intro-box {
  .activity-intro-desc {
    font-size:12px;
    flex:1;
    line-height: 64rpx;
  }
}

// /deep/ .m-panel-sp-listbox {
//   .uni-scroll-view{
//     position: unset;
//   }
// }
</style>