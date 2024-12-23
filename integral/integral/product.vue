<template>
	<view class="page">
		<block v-if="(isdata)">
			<header-nav-menu ref="headerNavMenu" :menu="nav_nemu"></header-nav-menu>
			<scroll-view class='u-pa1 fix-titlenview-trans' scroll-y="true" :scroll-top="scposition" @scroll="scrolltoupper">
				<view class="m-banner-ad">
					<swiper indicator-dots="true" autoplay="true" interval="3000" duration="300">
						<swiper-item v-for="(item, ii) in ProductInfo.productPicList"  :key="ii">
							<image lazy-load class="slide-image" mode="aspectFill" :src="(item.Path)"  :data-src="(item.Path)" @click="previewProductImg" />
						</swiper-item>
					</swiper>
                    <navigator v-if="(ProductInfo.product_video)" :url="ProductInfo.pv_url" class="video">
                        <image lazy-load src="/static/images/play.png" style="width:100rpx;height:100rpx"></image>
                    </navigator>

                    <view class="u-p-opt">
                        <view style='position:relative'>
                            <view :class="'navtext'" @click="PDCollection" :data-id="(ProductInfo.item_id)">
                                <view class="quicknav">
                                	<view :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?' highlight ':'']"></view>
                                </view>
                            </view>

                            <view :class="'navtext'" @click="addToWestore" :data-id="(ProductInfo.item_id)" v-if="Config.PLANTFORM_FX_WESTORE_ENABLE">
                                <view class="quicknav">
                                	<view :class="['iconfont zc zc-add']"></view>
                                </view>
                            </view>
                        </view>
                    </view>
				</view>

				<view class="seckill" v-if="(ProductInfo.IsShowCountdown || ProductInfo.is_pa)">
					<view class="seckill-left">
						<view class="discountPrice">{{__('￥')}}
							<text>{{number_format(ProductInfo.ShowPrice, 2)}}</text>
						</view>
						<view class="Price" v-if="(ProductInfo.MarketPrice)">
							<image lazy-load src="/static/images/seckill.png"></image>
							<view>{{__('￥')}}
								<text>{{number_format(ProductInfo.MarketPrice, 2)}}</text>
							</view>
						</view>
					</view>
					<view class="seckill-right">
						<view class="endTime ellipsis">{{__('距结束还剩')}}</view>
						<view class="Time">
							<text class="time">{{hours}}</text>
							<text class="time-tip">:</text>
							<text class="time">{{minutes}}</text>
							<text class="time-tip">:</text>
							<text class="time">{{seconds}}</text>
						</view>
					</view>
				</view>

				<view class="m-cells" style="margin-top:0rpx" v-if="(ProductInfo.IsShowCountdown)">
					<view class="m-cell m-info-box">
						<view class="m-cell-bd">
							<text>{{ProductInfo.ProductName}}</text>
							<label>{{ProductInfo.ProductTips || " "}}</label>
						</view>
						<view class="dis" style="" v-if="(ProductInfo.is_virtual && ProductInfo.SalesNum)">
							<view class="num">
								{{__('已服务')}}
								<label style="color:red">{{ProductInfo.SalesNum}}</label>{{__('人次')}}
							</view>
						</view>
					</view>
					<view v-if="(ProductInfo.SpecLst.length>0)" class="m-cell m-cell-access m-info-sp" @click="ckselectsp">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('已选')}}</text>
							<label class="m-imfo-sp-selext m-panel-sp-labellist">
								<block v-for="(items, i) in ProductInfo.SpecLst"  :key="i">
									<!-- #ifdef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="i + '_' + ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel" style="margin: 0;margin-left:10rpx;padding: 0 8rpx;">{{item.Name}}</label>
									</block>
									<!-- #endif -->
									<!-- #ifndef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel" style="margin: 0;margin-left:10rpx;padding: 0 8rpx;">{{item.Name}}</label>
									</block>
									<!-- #endif -->
								</block>
							</label>
						</view>
						<view class="m-cell-ft"></view>
					</view>
				</view>


				<view class="m-cells" style="margin-top:0rpx" v-if="(ProductInfo.IsShowCountdown==false)">
					<view class="m-cell m-info-box">
						<view class="m-cell-bd">
							<text>{{ProductInfo.ProductName}}</text>
							<label>{{ProductInfo.ProductTips || " "}}</label>
							<view class="m-info-price">
								<block v-if="ProductInfo.ShowPrice">
									<text>{{__('￥')}}</text>{{number_format(ProductInfo.ShowPrice, 2)}}
									<text class="m-info-delprice" v-if="(ProductInfo.activityType=='GROUPBOOKING')">
										{{__('￥')}}{{number_format(ProductInfo.ItemSalePrice, 2)}}
									</text>
								</block>

								<text class="m-info-delprice" v-if="(ProductInfo.MarketPrice) && !(ProductInfo.activityType=='GROUPBOOKING')">{{__('￥')}}{{number_format(ProductInfo.MarketPrice, 2)}}</text>

								<block v-if="ProductInfo.item_unit_points">
									<text style="margin-left: 20rpx;">+ <text style="font-size:32rpx">{{ProductInfo.item_unit_points}}</text>{{__('积分')}}</text>
								</block>


								<block v-if="plantformInfo.product_salenum_flag">
								<view class="dis" style="" v-if="(ProductInfo.is_virtual && ProductInfo.analytics_row && ProductInfo.analytics_row.product_sale_num>0)">
									<view class="num">{{__('已服务')}}<text style="color:red">{{ProductInfo.analytics_row.product_sale_num || 0}}</text> {{__('人次')}}</view>
								</view>
								<view class="dis" v-if="(!ProductInfo.is_virtual && ProductInfo.analytics_row && ProductInfo.analytics_row.product_sale_num>0)">
									<view class="num">{{__('已售')}}<text style="color:red">{{ProductInfo.analytics_row.product_sale_num || 0}}</text> {{__('')}}</view>
								</view>
								</block>
							</view>
						</view>
					</view>
					<view v-if="(ProductInfo.SpecLst.length>0)" class="m-cell m-cell-access m-info-sp" @click="ckselectsp">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('已选')}}</text>
							<label class="m-imfo-sp-selext m-panel-sp-labellist">
								<block v-for="(items, i) in ProductInfo.SpecLst"  :key="i">
									<!-- #ifdef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="i + '_' + ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel" style="margin: 0;margin-left:10rpx;padding: 0 8rpx;">{{item.Name}}</label>
									</block>
									<!-- #endif -->
									<!-- #ifndef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel" style="margin: 0;margin-left:10rpx;padding: 0 8rpx;">{{item.Name}}</label>
									</block>
									<!-- #endif -->
								</block>
							</label>
						</view>
						<view class="m-cell-ft"></view>
					</view>


					<view v-if="false" class="m-cell m-cell-access m-info-sp" @click="onSelectAddress">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('产地')}}</text>
							<label class="m-imfo-sp-selext">
								  南京
							</label>

							<label class="m-imfo-sp-selext" style="float: right;">
								  溯源
							</label>
						</view>
						<view class="m-cell-ft"></view>
					</view>

					<view class="m-cell m-cell-access m-info-sp" @click="onSelectAddress" v-if="!(ProductInfo.is_virtual)">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('送至')}}</text>
							<label class="m-imfo-sp-selext">
								  {{product_freight_info.district_info}}
							</label>

							<label class="m-imfo-sp-selext">
								  {{product_freight_info.if_store_cn}}
							</label>

							<label class="m-imfo-sp-selext">
								{{product_freight_info.if_freight_label || ''}}
							</label>
						</view>
						<view class="m-cell-ft"></view>
					</view>
					<view class="m-policy"  v-if="(wholesale_policy_rows.length > 0)">
						<view class="m-cell-bd" style="padding:20rpx 30rpx;display:flex;flex-wrap: nowrap;">
							<view class="m-imfo-sp-title" style="width:50%;">
								  {{__('价格')}}
							</view>

							<view class="m-imfo-sp-title">
								 {{__('起批量')}}
							</view>
						</view>
						<view class="m-cell-bd" style="padding:20rpx 30rpx;display:flex;flex-wrap: nowrap;" v-for="(row,ii) in wholesale_policy_rows" :key="ii">
							<label class="m-imfo-sp-money" style="width:50%;">
								  <span>{{__('￥')}}</span>{{row.policy_wholesale_price}}
							</label>

							<label class="m-imfo-sp-selext">
								  {{row.item_quantity_str}}
							</label>
						</view>
					</view>

					<view v-if="true" class="m-cell m-cell-access m-info-sp">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('服务')}}</text>
							<label class="m-imfo-sp-selext">
								{{sprintf(__('由 %s 销售和发货，并提供售后服务'), store_info.store_name)}}
							</label>
							<view style="margin-left:56rpx;" v-if="ProductInfo.contractlist.length > 0">
								<label style="margin-left: 16rpx;margin-right: 0rpx;font-size: 12px;" v-for="(ct, ci) in ProductInfo.contractlist" :key="ci">
									<image lazy-load :src="(ct.contract_type_icon)" style="margin-right: 6rpx;width: 30rpx;height: 30rpx;vertical-align: middle;" />{{ct.contract_type_name}}
								</label>
							</view>
						</view>
					</view>
				</view>

				<!--评论-->
				<view class="evaluate" v-if="ProductInfo.last_comment_rows.length > 0 ">
					<view class="evaluate-top">
						<label class="left">{{__('用户评价')}}({{ProductInfo.analytics_row ? ProductInfo.analytics_row.product_evaluation_num : 0}})</label>
						<navigator :url="'/pagesub/product/commentlist?id=' + (proId)" class="evaluate-right">
							<label class="right">{{__('全部评价')}}</label>
								<image style="width:16rpx;height:28rpx;position: absolute;margin-left:20rpx;margin-top:10rpx;" src="https://static.shopsuite.cn/xcxfile/appicon/goto.png" />
						</navigator>
					</view>
					<view class="evaluate-bottom" >
						<scroll-view scroll-x="true" class="scroll-view_H"  style="background:rgba(255,255,255,1);">
							   <view  class="scroll-view-item_H" v-for="(item, i) in ProductInfo.last_comment_rows" :key="i">
									<view class="uesr-evaluate">
										<view class="uesr-evaluate-center">
											<view class="center-top">
												<view class="user-image"><image style="width:100%;height:100%;border-radius:50%;" :src="(item.user_avatar)" /></view>
												<label class="user-name">{{item.user_name}}</label>
											</view>
											<view class="user-text"><label>{{item.comment_content || __('无评论')}}</label></view>
										</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>

				<!--店铺信息-->
				<view class="m-store" v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag)">
					<view class="m-store-info">
						<view class="m-store-radi"><image :src="store_info.store_logo" style="width: 100%;height: 100%;"></view>
						<label style="height:29rpx;font-size:30rpx;font-family:Alibaba PuHuiTi;font-weight:500;color:rgba(51,51,51,1);position: absolute;margin-top:14rpx;margin-left:139rpx">{{store_info.store_name}}</label>
						<label style="width:200rpx;height:23rpx;font-size:24rpx;font-family:Alibaba PuHuiTi;font-weight:400;color:rgba(102,102,102,1);position: absolute;margin-top:60rpx;margin-left:139rpx">{{sprintf(__('在售商品%s件'), store_product_num)}}</label>
						<navigator :url="'/pagesub/index/store' + '?store_id=' + (ProductInfo.store_id)" hover-class="none" class="evaluate-right" style="position: absolute;margin-top:32rpx;margin-left:589rpx">
							<label class="right">{{__('进店看看')}}</label>
								<image style="width:16rpx;height:28rpx;position: absolute;margin-left:20rpx;margin-top:10rpx;" src="https://static.shopsuite.cn/xcxfile/appicon/goto.png" />
						</navigator>
					</view>

					<scroll-view class="scroll-view_H" scroll-x="true" style="height:390rpx" >
						<navigator :url="(store_info.store_type==3?'/pagesub/product/details':'/pagesub/product/detail') + '?pid=' + (item.item_id)"  v-for="(item,i) in store_product_list" :key="i" hover-class="none" class="scroll-view-item_H" style="width:210rpx;height:340rpx;margin-left:30rpx;margin-top:20rpx;">
							<view class="m-store-item-image"><image :src="item.product_image" style="width: 100%;height: 100%;"></view>
							<view class="m-store-item-name"><label class="ellipsis">{{item.product_name}}</label></view>

							<view class="m-store-item-price"><label >{{__('￥')}}{{sprintf(__('%.2f'), number_format(item.item_unit_price, 2))}}</label></view>
						</navigator>
					</scroll-view >
				</view>

				<!--店铺信息-->
				<view class="m-panel m-panel-access goods-detail-store" v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag) && false">
					<navigator redirect="true" :url="'/pagesub/index/store?store_id=' + (ProductInfo.store_id)">
						<view class="m-panel-hd store_name" style="height: 44rpx;">
							<label class="iconfont icon-store"></label>
							<label class="icon-mall" v-if="(store_info.store_is_selfsupport)">{{__('自营')}}</label>
							<label class="icon-mall" style="color:#333;">{{store_info.store_name}}</label>
						</view>
						<view class="m-panel-bd" style="clear: both;"> <!-- v-if="(!store_info.store_is_selfsupport)"  -->
							<view class="store-rate">
								<label class="equal" style="width: 33%;">{{__('描述相符')}}
									<view style="padding-left: 10rpx;">{{store_info.store_credit.store_desccredit.credit}}</view>
									<!--<i></i>-->
								</label>
								<label class="equal" style="width: 33%;text-align: center;">{{__('服务态度')}}
									<view style="padding-left: 10rpx;">{{store_info.store_credit.store_servicecredit.credit || '--'}}</view>
									<!--<i></i>-->
								</label>
								<label class="equal" style="width: 33%;text-align: right;">{{__('发货速度')}}
									<view style="padding-left: 10rpx;">{{store_info.store_credit.store_deliverycredit.credit || '--'}}</view>
									<!--<i></i>-->
								</label>
							</view>

							<view class="item-more"></view>
						</view>
					</navigator>
				</view>


				<!--评论-->
				<view :class="'m-panel m-panel-access m-comment ' + ((ProductInfo.analytics_row && ProductInfo.analytics_row.product_evaluation_num>0)?'':'hide')" v-if="false">
					<view class="m-panel-hd">{{__('评价')}}（{{ProductInfo.analytics_row ? ProductInfo.analytics_row.product_evaluation_num : 0}}）
						<label v-if="(ProductInfo.analytics_row && ProductInfo.analytics_row.evaluation_percent)">{{__('好评度')}}
							<text>{{ProductInfo.analytics_row.evaluation_percent}}%</text>
						</label>
					</view>
					<view class="m-panel-bd">
						<view class="m-media-box m-media-box-appmsg" v-if="(ProductInfo.last_comment_row)">
							<view class="m-media-box-hd">
								<image lazy-load class="m-media-box-thumb" :src="(ProductInfo.last_comment_row.user_avatar)" />
							</view>
							<view class="m-media-box-bd">
								<label class="m-media-box-title">{{ProductInfo.last_comment_row.user_nickname}}</label>
								<view class="m-media-box-desc">
									<view style="margin-bottom:10rpx;">
										<label style="margin-right:10rpx;font-size:20rpx;">
											{{ProductInfo.last_comment_row.item_name}}
										</label>
									</view>
									<label v-if="(ProductInfo.last_comment_row.comment_content!=null)">
										{{ProductInfo.last_comment_row.comment_content}}
									</label>
								</view>

								<view class="m-media-box-info">
									<view class="m-media-box-info-meta m-start" v-for="(itemIndex, i) in [1, 2, 3, 4, 5]"
									 :key="i">
										<label :class="'iconfont icon-start ' + ((itemIndex<=ProductInfo.last_comment_row.comment_scores)?'sel':'')"
										 :data-index="(itemIndex)" :data-type="1"></label>
									</view>
									<view class="m-media-box-info-meta m-tiem">{{ProductInfo.last_comment_row.comment_time}}</view>
									<view class="m-media-list">
										<image lazy-load v-for="(item, ii) in ProductInfo.last_comment_row.comment_image"  :key="ii"
										 :src="(item)" @click="ImgTap"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="m-panel-ft" v-if="(ProductInfo.analytics_row && ProductInfo.analytics_row.product_evaluation_num>1)">
						<navigator :url="'/pagesub/product/commentlist?id=' + (proId)" class="m-cell m-cell-access m-cell-link">
							<view class="m-cell-bd">{{__('查看全部评论')}}</view>
							<text class="m-cell-ft"></text>
						</navigator>
					</view>
				</view>

				<block v-if="false">
				<!--问答-->
				<view :class="'m-panel m-panel-access m-comment'" v-if="(faq_rows.length>0)" :data-product_id="proId" @click="listFaq">
					<view class="m-cell m-cell-access m-info-sp">
						<view class="m-cell-bd">
							<text class="m-info-tip">{{__('问大家')}}（{{ProductInfo.analytics_row ? ProductInfo.analytics_row.product_ask_num : 0}}）</text>
						</view>
						<view class="m-cell-ft">{{__('查看全部')}}</view>
					</view>
					<view class="m-panel-bd">
						<view class="m-media-box m-media-box-appmsg" style="padding-top: 20rpx;padding-bottom: 20rpx;"  v-for="(faq_row, idx) in faq_rows" :key="idx">
							<view class="m-media-box-bd">
								<view class="m-media-box-desc">
									<label style="padding:6rpx;font-size:20rpx;background-color: #ff6700;color: #fff;">
										{{__('问')}}
									</label>
									<label style="margin-left:10rpx;font-size:20rpx;">
										{{faq_row.story_title}}
									</label>
									<label style="float: right;">
										{{sprintf(__('%d 个回答'), faq_row.story_comment_count)}}
									</label>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view :class="'m-panel m-panel-access m-comment'" v-else>
					<view class="m-panel-hd">{{__('暂无问答')}}
					</view>
					<view class="m-panel-bd">
						<view class="m-media-box m-media-box-appmsg" style="padding-top: 16rpx;padding-bottom: 16rpx;">
							<view class="m-media-box-bd">
								<view class="m-media-box-desc">
										<label style="padding:6rpx;font-size:20rpx;background-color: #ff6700;color: #fff;">
											{{__('问大家')}}
										</label>
										<label style="margin-left:10rpx;font-size:20rpx;">
											{{__('宝贝好不好，问过已买过的人')}}
										</label>
										<navigator :url="'/community/community/post?pid=' + proId" class="u-link-btn" style="padding: 5px 10px;border: 1px solid #DB384C;font-size: 11px;color: #DB384C;border-radius: 25px;float: right;">{{__('去提问')}}</navigator>
								</view>
							</view>
						</view>
					</view>
				</view>
				</block>


				<view>
					<view class="m-panel m-panel-access m-detail">
						<view class="m-tab">
							<view class="m-navbar">
								<view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" v-if="(ProductInfo.product_detail)"
								 @click="picDetail">
									{{__('商品详情')}}
								</view>
								<view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')" v-if="(ProductInfo.product_extension)"
								 @click="spcParam">
									{{__('规格参数')}}
								</view>
								<view :class="'m-navbar-item ' + (tapindex==3?'m-navbar-item-on':'')" v-if="(ProductInfo.product_param)" @click="packingList">
									{{__('包装清单')}}
								</view>
								<block v-else>
								</block>
								<view :class="'m-navbar-item ' + (tapindex==5?'m-navbar-item-on':'')" v-if="(ProductInfo.product_service)"
								 @click="showServiceTab">
									{{__('售后服务')}}
								</view>
							</view>
						</view>
						<view :class="'m-RichText ' + (tapindex==1?'':'hide')" v-if="ProductInfo.product_detail">
							<wxParse :content="ProductInfo.product_detail"  :imageProp="{lazyLoad:true, mode:'widthFix'}"  />
						</view>
						<view :class="'m-RichText ' + (tapindex==2?'':'hide')"  v-if="ProductInfo.product_extension">
							<wxParse :content="ProductInfo.product_extension"  :imageProp="{lazyLoad:true, mode:'widthFix'}" />
						</view>
						<view :class="'m-RichText ' + 'm-Packinglist ' + (tapindex==3?'':'hide')"  v-if="ProductInfo.product_param">
							<wxParse :content="ProductInfo.product_param"  :imageProp="{lazyLoad:true, mode:'widthFix'}" />
						</view>
							<view :class="' m-Packinglist ' + (tapindex==5?'':'hide')"   v-if="ProductInfo.product_service">
							<rich-text type="text" :nodes="(ProductInfo.product_service)" />
						</view>
					</view>
					<view class="m-tips" v-if="(!IsChannel)">
						<view class="m-tips-logo">
							<image lazy-load mode="aspectFit" src="/static/images/logo_tech.png"></image>
						</view>
						<view class="m-tips-str">{{__('商城套件系统提供技术支持')}} {{versionNumber}}</view>
					</view>
				</view>

				<view class="u-cleanbox"></view>
			</scroll-view>
			
			
			<view class="m-footer-btn bottom-safearea" :class="ProductInfo.is_virtual ? 'm-fg-btn' : ''" v-if="(ProductInfo.activityType!='GROUPBOOKING')">
			
				<block v-if="(ProductInfo.is_virtual)">
					<view class="m-footer-btn-list">
						<view class="m-footer-btn-item" style="width: 50%;" :data-id="(proId)" :data-name="(store_info.store_name)"
						 :data-keyword="(ProductInfo.keyWord)" :data-appid="(AppId)" :data-appurl="(chatUrl)" v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag)">
							<navigator redirect="true" :url="'/pagesub/index/store?store_id=' + (ProductInfo.store_id)" class="u-go-home1">
								<view class="m-footer-btn-icon">
									<!--<contact-button size="27" type="default-dark" session-from="weapp">
			                </contact-button>-->
									<label class="iconfont icon-store "></label>
								</view>
								<text>{{__('店铺')}}</text>
							</navigator>
						</view>
						<view class="m-footer-btn-item" style="width: 50%;" @click="PDCollection" :data-id="(ProductInfo.item_id)">
							<view class="m-footer-btn-icon">
								<label :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?' highlight ':'']"></label>
							</view>
							<text>{{isCollection?__('已收藏'):__('收藏')}}</text>
						</view>
						<view class="m-footer-btn-item" :data-id="(ProductInfo.item_id)" :data-name="(store_info.store_name)"
							  :data-keyword="(ProductInfo.keyWord)" :data-appid="(AppId)" :data-appurl="(chatUrl)" :data-type="10" @click="tplGoToPage"
							  v-if="(chatUrl)"  style="width: 50%;">
							<view class="m-footer-btn-icon">
								<!--<contact-button size="27" type="default-dark" session-from="weapp">
			            </contact-button>-->
								<label class="iconfont icon-more "></label>
							</view>
							<text>{{__('客服')}}</text>
						</view>
					</view>
					<block v-if="(!ProductInfo.IfStore)">
						<view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
							{{__('立即预约')}}
						</view>
						<view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
							{{__('库存不足')}}
						</view>
					</block>
					<block v-else-if="(ProductInfo.Status=='offline'||ProductInfo.Pstatus=='offline'||ProductInfo.IsDelete)">
						<view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
							{{__('立即预约')}}
						</view>
						<view class="m-footer-btn-main m-footer-desable" style="width: 70%;">
							{{__('商品已下架')}}
						</view>
					</block>
					<block v-else>
						<view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main m-now" style="width: 70%;" @click="ckselectsp1">
							{{__('立即预约')}}
						</view>
						<view v-else class="m-footer-btn-main m-now" style="width: 70%;" @click.stop="buynow">
							{{__('立即预约')}}
						</view>
						<!--<view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main" @click="ckselectsp">
			      {{__('加入购物车')}}
			    </view>
			    <view v-else class="m-footer-btn-main" @click.stop="addCart">
			      {{__('加入购物车')}}
			    </view>-->
					</block>
				</block>
				<block v-else>
					<view class="m-footer-btn-list">
						<view class="m-footer-btn-item" :data-id="(proId)" :data-name="(store_info.store_name)" :data-keyword="(ProductInfo.keyWord)"
						 :data-appid="(AppId)" :data-appurl="(chatUrl)" v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag)">
							<navigator redirect="true" :url="'/pagesub/index/store?store_id=' + (ProductInfo.store_id)" class="u-go-home1">
								<view class="m-footer-btn-icon">
									<!--<contact-button size="27" type="default-dark" session-from="weapp">
			                </contact-button>-->
									<label class="iconfont icon-store "></label>
								</view>
								<text>{{__('店铺')}}</text>
							</navigator>
						</view>
						<view class="m-footer-btn-item" @click="PDCollection" :data-id="(ProductInfo.item_id)"  v-if="(!chatUrl)">
							<view class="m-footer-btn-icon">
								<label :class="['iconfont', isCollection?'icon-favoritesfilling':'icon-favorite', isCollection?'highlight ':'']"></label>
							</view>
							<text>{{isCollection?__('已收藏'):__('收藏')}}</text>
						</view>
			
						<view class="m-footer-btn-item" :data-id="(proId)" :data-name="(store_info.store_name)" :data-keyword="(ProductInfo.keyWord)"
							  :data-appid="(AppId)" :data-appurl="(chatUrl)" :data-type="10" @click="tplGoToPage" v-if="(chatUrl)">
							<view class="m-footer-btn-icon">
								<!--<contact-button size="27" type="default-dark" session-from="weapp">
			            </contact-button>-->
								<label class="iconfont icon-more "></label>
							</view>
							<text>{{__('客服')}}</text>
						</view>
						<view data-url="/pages/cart/cart" class="m-footer-btn-item" @click="goTabBar">
							<view class="m-footer-btn-icon">
								<label class="iconfont icon-cart "></label>
								<uni-badge v-if="cartNum>0" :text="cartNum + ''" type="danger"></uni-badge>
							</view>
							<text>{{__('购物车')}}</text>
						</view>
					</view>
					<block v-if="(!ProductInfo.IfStore)">
						<view class="m-footer-btn-main m-footer-desable">
							{{__('立即购买')}}
						</view>
						<view class="m-footer-btn-main m-footer-desable">
							{{__('库存不足')}}
						</view>
					</block>
					<block v-else-if="(ProductInfo.Status=='offline'||ProductInfo.Pstatus=='offline'||ProductInfo.IsDelete)">
						<view class="m-footer-btn-main m-footer-desable">
							{{__('立即购买')}}
						</view>
						<view class="m-footer-btn-main m-footer-desable">
							{{__('商品已下架')}}
						</view>
					</block>
					<block v-else>
						<view class="m-footer-btn-main" @click="ckselectsp">
							{{__('加入购物车')}}
						</view>
						<!-- <view v-else class="m-footer-btn-main" @click.stop="addCart">
			      {{__('加入购物车')}}
			    </view> -->
						<view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main m-now" @click="ckselectsp1">
							{{__('立即购买')}}
						</view>
						<view v-else class="m-footer-btn-main m-now" @click.stop="ckselectsp1"> <!-- 不需要选择数量使用： buynow -->
							{{__('立即购买')}}
						</view>
					</block>
				</block>
			</view>
			
			<view class="m-footer-btn m-fg-btn bottom-safearea" v-if="(ProductInfo.activityType=='GROUPBOOKING')">
				<view class="m-footer-btn-list">
					<view class="m-footer-btn-item" style="width: 50%;" :data-id="(proId)" :data-name="(store_info.store_name)"
					 :data-keyword="(ProductInfo.keyWord)" :data-appid="(AppId)" :data-appurl="(chatUrl)" v-if="(Config.MULTISHOP_ENABLE && !if_saas_status && !isStoreFlag)">
						<navigator redirect="true" :url="'/pagesub/index/store?store_id=' + (ProductInfo.store_id)" class="u-go-home1">
							<view class="m-footer-btn-icon">
								<!--<contact-button size="27" type="default-dark" session-from="weapp">
			            </contact-button>-->
								<label class="iconfont icon-store "></label>
							</view>
							<text>{{__('店铺')}}</text>
						</navigator>
					</view>
					<view class="m-footer-btn-item" style="width: 50%;" @click="PDCollection" :data-id="(proId)"  v-if="(!chatUrl)">
						<view class="m-footer-btn-icon">
							<label :class="'iconfont ' + (isCollection?'icon-favoritesfilling':'icon-favorite') + (isCollection?' highlight ':'')"></label>
						</view>
						<text>{{isCollection?__('已收藏'):__('收藏')}}</text>
					</view>
					<view class="m-footer-btn-item" style="width: 50%;" :data-id="(proId)" :data-name="(store_info.store_name)" :data-keyword="(ProductInfo.keyWord)"
						  :data-appid="(AppId)" :data-appurl="(chatUrl)" :data-type="10" @click="tplGoToPage" v-if="(chatUrl)">
						<view class="m-footer-btn-icon">
							<!--<contact-button size="27" type="default-dark" session-from="weapp">
			        </contact-button>-->
							<label class="iconfont icon-more "></label>
						</view>
						<text>{{__('客服')}}</text>
					</view>
				</view>
				<block v-if="(!ProductInfo.IfStore||ProductInfo.Status=='offline'||ProductInfo.Pstatus=='offline'||ProductInfo.IsDelete)">
					<view class="m-footer-btn-main m-footer-desable u-fg">
						<view>{{__('￥')}}{{number_format(ProductInfo.ItemSalePrice, 2)}}</view>
						<view>{{__('普通购买')}}</view>
					</view>
					<view class="m-footer-btn-main m-footer-desable u-fg">
						<view>{{__('￥')}}{{number_format(ProductInfo.ShowPrice, 2)}}</view>
						<view v-if="(!is_join)">{{__('立即开团')}}</view>
						<view v-else>{{__('立即参团')}}</view>
					</view>
				</block>
				<block v-else>
					<!-- <view class="m-footer-btn-main m-now u-fg" @click.stop="ILObuynow">
			  <view>{{__('￥')}}{{number_format(ProductInfo.ItemSalePrice, 2)}}</view>
			  <view>{{__('普通购买')}}</view>
			</view> -->
					<view class="m-footer-btn-main m-now u-fg" @click="ckselectsp" :data-type="1">
						<view>{{__('￥')}}{{number_format(ProductInfo.ItemSalePrice, 2)}}</view>
						<view>{{__('普通购买')}}</view>
					</view>
					<view v-if="(ProductInfo.SpecLst.length>0)" class="m-footer-btn-main u-fg" @click="ckselectsp">
						<view>{{__('￥')}}{{number_format(ProductInfo.ShowPrice, 2)}}</view>
						<view v-if="(!is_join)">{{__('立即开团')}}</view>
						<view v-else>{{__('立即参团')}}</view>
					</view>
					<view v-else class="m-footer-btn-main u-fg" @click.stop="immediatelyOffered">
						<view>{{__('￥')}}{{number_format(ProductInfo.ShowPrice, 2)}}</view>
						<view v-if="(!is_join)">{{__('立即开团')}}</view>
						<view v-else>{{__('立即参团')}}</view>
					</view>
				</block>
			</view>
			
			<view :class="'m-panel-sp ' + (selectsp==0?'hide':'') " @click.stop="closesp">
				<view :class="'m-panel-sp-content ' + (selectct==0?'bounceOutDown animated':'bounceInUp animated')" @click.stop>
					<view class="m-panel-sp-pinfo">
						<view class="m-panel-sp-pimg">
							<image lazy-load :src="(selectimg||ProductInfo.productPicList[0].Path)" />
						</view>
						<view class="m-panel-sp-pname">
							<view class="m-pprice" v-if="(ProductInfo.activityType=='GROUPBOOKING'&&isModified)">
								{{__('￥')}}{{number_format(ProductInfo.ItemSalePrice, 2)}}
							</view>
							<view class="m-pprice" v-if="(ProductInfo.activityType!='GROUPBOOKING')">
			
								<block v-if="ProductInfo.ShowPrice">
									{{__('￥')}}{{number_format(ProductInfo.ShowPrice, 2)}}
								</block>
			
								<block v-if="ProductInfo.item_unit_points">
									<text style="margin-left: 20rpx;font-size: 22rpx;">+ <text style="font-size:26rpx">{{ProductInfo.item_unit_points}}</text>{{__('积分')}}</text>
								</block>
			
								<block v-if="ProductInfo.item_unit_sp">
									<text style="margin-left: 20rpx;font-size: 22rpx;">+ <text style="font-size:26rpx">{{ProductInfo.item_unit_sp}}</text>{{__('众宝')}}</text>
								</block>
			
							</view>
							<view class="m-pprice" v-if="(ProductInfo.activityType=='GROUPBOOKING'&&!isModified)">
								{{__('￥')}}{{number_format(ProductInfo.ShowPrice, 2)}}
							</view>
			
							<view class="m-pstock">{{sprintf(__('库存%s件'), ProductInfo.IfStore ? ProductInfo.item_quantity : 0)}}</view>
							<view v-if="(ProductInfo.SpecLst.length)" class="m-pstock">{{__('已选择：')}}
								<block v-for="(items, i) in ProductInfo.SpecLst"  :key="i">
									<!-- #ifdef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="i + '_' + ii">
										<span v-if="(item.IsChecked)" style="margin-left: 4rpx;">{{item.Name}}</span>
									</block>
									<!-- #endif -->
									<!-- #ifndef H5 -->
									<block v-for="(item, ii) in items.svLst"  :key="ii">
										<span v-if="(item.IsChecked)" style="margin-left: 4rpx;">{{item.Name}}</span>
									</block>
									<!-- #endif -->
								</block>
							</view>
						</view>
						<view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closesp"></view>
					</view>
					<scroll-view class="m-panel-sp-listbox" scroll-y="true">
						<block v-if="b2bFlag && ProductInfo.product_spec.length>0">
							<view class="m-panel-sp-listbox-item">
								<block v-if="(ProductInfo.product_spec[0])">
									<text>{{ ProductInfo.product_spec[0].name }}：</text>
									<block v-for="(items, key1) in ProductInfo.product_spec[0].item" :key="key1">
										<view class="m-panel-sp-labellist1">
											<!-- {{key1}}
											{{ProductInfo.product_spec[0].item}}
											{{typeof(ProductInfo.item_spec[key1])}}  :data-unit_id="ProductInfo.item_spec[key1].id"-->
											<label :class="items.select ? 'm-panel-sp-sellabel' : 'm-panel-sp-sellabel-no'" @click="selectS(items, key1, items.name, $event)" :data-ckid="items.select ? ProductInfo.SpecLst[0].svLst[key1].Id : items.id" :data-unit_id="1" :data-spid="items.id"  :data-enable="(ProductInfo.spec_item_map[items.id])">{{items.name}}</label><!-- ckid-颜色id  unitid-规格id  spid 规格商品id-->
										</view>
										<view class="m-panel-sp-labellist" :class="items.select ? 'm-panel-sp-labellist' : 'm-panel-sp-labellist2'">
										</view>
									</block>
								</block>
								<block v-for="(item, ii) in product_uniqid" :key="ii">
									<label :class="item[6] == color ? 'm-panel-sp-sellabel m-ys' : 'm-panel-sp-sellabel1 m-ys'" style="width:94%;float:left;height:50rpx;line-height:50rpx;overflow:hidden;padding-left:10rpx;">
										{{ item[4] }}
										<view class="u-cart-num" style="margin-top:-6rpx;float:right">
											<view class="example-body" style="height:100%">
												<uni-number-box :min="0" :max="item[5]" :value="numberValue" :id="ii" @change="changes($event, ii)" />
											</view>
										</view>
										<text style="float:right">{{ sprintf(__('库存%s件'), item[5] ? item[5] : 0) }}</text>
									</label>
								</block>
							</view>
						</block>
						<block v-for="(items, key1) in ProductInfo.SpecLst"  :key="key1" v-else>
							<view class="m-panel-sp-listbox-item">
								<view class="m-cells-title">{{items.Name}}</view>
								<view class="m-panel-sp-labellist">
									<text>{{ProductInfo.product_spec[key1].name}}：</text>
									<!-- #ifdef H5 -->
									<block v-for="(item, ii) in items.svLst" :key="key1 + '_' + ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel">{{item.Name}}</label>
										<label v-else :data-ckid="(items.ckid)" :data-unit_id="(items.unit_id)" :data-spid="(item.Id)" :data-enable="(ProductInfo.spec_item_map[item.Id])"
										 :class="(ProductInfo.spec_item_map[item.Id] ? ' ' : 'item_disabled')" @click.stop="selectSpec">{{item.Name}}
										</label>
									</block>
									<!-- #endif -->
									<!-- #ifndef H5 -->
									<block v-for="(item, ii) in items.svLst" :key="ii">
										<label v-if="(item.IsChecked)" class="m-panel-sp-sellabel">{{item.Name}}</label>
										<label v-else :data-ckid="(items.ckid)" :data-unit_id="(items.unit_id)" :data-spid="(item.Id)" :data-enable="(ProductInfo.spec_item_map[item.Id])"
										 :class="(ProductInfo.spec_item_map[item.Id] ? ' ' : 'item_disabled')" @click.stop="selectSpec">{{item.Name}}
										</label>
									</block>
									<!-- #endif -->
								</view>
							</view>
						</block>
			
						<!-- <view style="height:96rpx;width:100%;"></view> -->
					</scroll-view>
					<view style="height:100rpx"></view>
					<view class="m-m-panel-sp-btn">
						<view class="m-pprice" style="width:50%;float:left;height:100rpx;line-height:100rpx;text-align:center" v-if="b2bFlag && ProductInfo.product_spec.length>0">
							{{ __('￥') }}{{ number_format(price, 2) }}&nbsp;&nbsp;&nbsp;&nbsp;{{__('数量:')}} {{quantity}}
						</view>
						<view class="m-m-panel-sp-lbtn" :style="(ProductInfo.activityType=='GROUPBOOKING'&&isModified==false?'display:none':'')" v-else>
							<view class="u-cart-num" style="margin-top:21rpx">
								<view class="u-num-btn" @click.stop="sub">-</view>
								<input type="number" v-model="numval" @blur="writenum" />
								<view class="u-num-btn" @click.stop="add">+</view>
							</view>
						</view>
						<view class="m-m-panel-sp-rbtn" style="width:100%" @click.stop="immediatelyOffered" v-if="(ProductInfo.activityType=='GROUPBOOKING'&&isModified==false&&!is_join)">
							{{__('立即开团')}}
						</view>
						<view class="m-m-panel-sp-rbtn" style="width:100%" @click.stop="immediatelyOffered" v-if="(ProductInfo.activityType=='GROUPBOOKING'&&isModified==false&&is_join)">
							{{__('立即参团')}}
						</view>
			
			
						<block v-if="(ProductInfo.is_virtual)">
							<view class="m-m-panel-sp-rbtn" @click.stop="buynow" v-if="(flag&&ProductInfo.activityType!='GROUPBOOKING')">
								{{__('立即预约')}}
							</view>
						</block>
						<block v-else>
							<view class="m-m-panel-sp-rbtn" @click.stop="addCart" v-if="(flag&&ProductInfo.activityType!='GROUPBOOKING')">
								{{__('加入购物车')}}
							</view>
						</block>
						<view class="m-m-panel-sp-rbtn" @click.stop="buynow" v-if="(flag1&&ProductInfo.activityType!='GROUPBOOKING')">
							<label v-if="(ProductInfo.is_virtual)">{{__('立即预约')}}</label>
							<label v-else>{{__('立即购买')}}</label>
						</view>
						<view class="m-m-panel-sp-rbtn" @click.stop="ILObuynow" v-if="(ProductInfo.activityType=='GROUPBOOKING'&&isModified)">{{__('立即购买')}}
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="m-nullpage" v-else>
			<view class="m-nullpage-middle" v-if="loaded">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('什么都没有！')}}</text>
				</view>
			</view>
			<view class="m-nullpage-middle" v-else>
				<loading></loading>
			</view>
		</view>

		<view :class="'m-panel-sp ' + (shareBoxFlag==0?'hide':'') " @click.stop="closeNativeShare">
			<view :class="'m-panel-sp-content ' + (shareContetnFlag==0?'bounceOutDown animated':'bounceInUp animated')"
			 @click.stop>
				<view class="page-body">
					<!-- #ifdef APP-PLUS -->
					<view class="btn-area" v-if="providerList.length > 0">
						<block v-for="(value,index) in providerList" :key="index">
							<button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'" @tap="share(value)">{{value.name}}</button>
						</block>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view class="btn-area">
						<button type="primary" open-type="share">{{__('分享')}}</button>
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
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
					  @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>

		<quick-nav @onReturnTop="onReturnTop" @onShareBox="onShareBox" :isquicknav="isquicknav"></quick-nav>
	</view>
</template>

<script>
	function getNowFormatDate() {
		var e = new Date,
			t = "-",
			n = e.getMonth() + 1,
			r = e.getDate();
		n >= 1 && n <= 9 && (n = "0" + n), r >= 0 && r <= 9 && (r = "0" + r);
		var i = e.getFullYear() + t + n + t + r;
		return i
	}

    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

	import wxParse from '@/components/u-parse/u-parse.vue'

	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'
	import shareBoxH5 from '../../components/share-box-h5.vue'

	import quickNav from '../../components/quick-nav.vue'
	import headerNavMenu from '../../components/header-nav-menu.vue'

	import uniBadge from '../../components/uni-badge.vue';
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import loading from '@/components/loading.vue'

	var intervalDate;
	var intervalPt;
	var intervalCt;
	var intervalTimeAct;

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				numberValue: 0,
				b2bFlag:0,
				proIds: [],
				product_uniqid: [],
				ss:[
					"ss1",
					"ss2",
					"ss3",
					"ss4",
					"ss5"
				],
				color:'',
				price: 0,
				quantity:0,

				options: {},
				isMore: false,
				selectsp: 0,
				selectct: 0,
				proId: 0,
				CommentImgList: [],
				splist: [],
				splistStr: [],
				numval: 1,
				stock: 1,
				inputval: 1,
				skuid: 0,
				selectimg: "",
				pname: "",
				desc: "",
				isCollection: false,
				MEID: 0,
				activity_id: 0,
				gb_id: null,
				eventId: 0,
				Parameters: [],
				isdata: false,
				loaded: false,
				tapindex: 1,
				IsChannel: true,
				FGInfo: {},
				GB_rows: [],
				isAll: false,
				Time: {},
				ProductInfo: {productPicList:[], last_comment_row:{}, last_comment_rows:[], analytics_row:{}, contractlist:[]},
				store_product_list:[],
				store_product_num:0,
				faq_rows:[],
				store_info: {},
				Coupons: [],
				isCancelSuccess: true,
				isCancel: true,
				CouponAmount: 0,
				user_is_new: 0,
				flag: false, //{{__('加入购物车')}}标记
				flag1: false, //{{__('立即购买')}}标记
				isVoucher: false,
				virtual_flag: false,
				versionNumber: "",
				CashData: {},
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
				VoucherList: [],

				AppId: '',
				chatUrl: '',

				is_join: false,

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


				Id:0,
				needed_point:0,


				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				product_freight_info:{content: "无货",
									district_info: "上海市/上海市",
									if_store: false},

				latitude: '',
				longitude: '',
				url:'',
				is_chain:0
			}
		},
		metaInfo () {
			return {
			  meta: [
				{name: 'og:url', content: this.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', this.Config.SiteUrl, this.proId, this.userInfo.user_id) },
				{name: 'og:type', content: "article" },
				{name: 'og:title', content: this.pname },
				{name: 'og:description', content: this.desc || this.pname },
				{name: 'og:image', content: this.ProductInfo.productPicList.length ? this.ProductInfo.productPicList[0].Path : '' },
			  ],

			  title : this.pname
			}
		},
		components: {
			shareBoxMp,
			shareBoxApp,
			shareBoxH5,
			quickNav,
			uniBadge,
			mpvueCityPicker,
			wxParse,
			uniTag,
			uniNumberBox,
			loading,
			headerNavMenu
		},
		computed:{
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'cartNum']),
			nav_nemu:function(){
				return [
					{url:'/pages/index/index', type:'switchTab', icon:'zc-dianpu', name:this.__('首页')},
					{url:'/member/member/message', type:'navigate', icon:'zc-zaixian-im', name:this.__('消息')},
					{url:'/member/member/favorites', type:'navigate', icon:'zc-shoucang11', name:this.__('我的关注')},
					{url:'/member/member/browse', type:'navigate', icon:'zc-zuji', name:this.__('浏览记录')},
				];
			},
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('商品详情')
			});

			var that = this;

			if (options.scene) {
				var scene = decodeURIComponent(options.scene);
				var opts = {};

				opts = that.$.parse_str(scene);

				options = Object.assign(options, opts);
			}

			that.$.getSystemInfo({
				success: function(t) {
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

			/*
			this.setData({
				versionNumber: this.plantformInfo.versionNumber
			});
			*/
			var n = {
				productId: options.pid
			};
			that.InitData(options);
		},
		onShareAppMessage() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				imageUrl: this.ProductInfo.productPicList[0].Path,
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
				imageUrl: this.ProductInfo.productPicList[0].Path,
			}
		},
		onBackPress() {

			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
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
				this.$refs.mpvueCityPicker.pickerCancel()
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
			}
			else if (e.index === 1) {
				that.onShareBox(e);
			}  else {
				uni.showToast({
					title: "你点了收藏按钮",
					icon: "none"
				})
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.InitProduct(true);
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum']),
			InitData: function(options) {
				var that = this;
				this.setData({
					proId: options.pid,
					splistStr: [],
					gb_id: parseInt(options.gb_id),
					is_join: (!that.$.isNull(options.gb_id) && options.gb_id != 0) ? true : false
				});

				that.$.isNull(this.userInfo) ? this.getUserInfo(function(user) {
					that.InitProduct(false);
					that.setData({
						IsChannel: this.shopInfo.IsChannel
					});
					that.setData({
						user_is_new: 0,
						CouponAmount: 10
					})
				}) : that.InitProduct(false);
			},

			gotomap: function(e) {
				var that = this;

				that.$.openLocation({
					latitude: parseFloat(e.currentTarget.dataset.lat),
					longitude: parseFloat(e.currentTarget.dataset.lng),
					name: e.currentTarget.dataset.name,
					address: e.currentTarget.dataset.address,
					scale: 28
				})
			},

			gopage:function(e){
				var that = this;

					this.$.gotopage('/chain/chain/index?chain_id=' + e.currentTarget.dataset.chain_id)

			},

			call: function(e) {
				let that = this;
				that.$.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.phone
				})
			},

			InitProduct: function(force_refresh) {
				if (typeof force_refresh == 'undefined')
				{
					force_refresh = true;
				}

				var that = this;


				//存入本地
				let district_id = uni.getStorageSync('district_id');


				var params = {
					item_id: that.proId,
					gb_id: that.gb_id,
					comment_flag: 1 //如果有，则读取一条评论
				};

				if (district_id)
				{
					params.district_id = district_id;
				}

				that.$.request({
					url: this.Config.URL.product.item,
					data: params,
					loading: false,
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE,
                        forceRefresh: force_refresh
					},

					success: function(data, status, msg, code) {
						if (200 == status) {
							that.$report('fb_mobile_content_view', data.item_row);

							that.setData({
								product_freight_info: data.product_freight_info
							});

							data.item_row.ProductName = data.item_row.product_item_name;
							data.item_row.ProductTips = data.item_row.product_tips;
							data.item_row.MarketPrice = Math.max(data.item_row.item_unit_price, data.item_row.item_sale_price, data.item_row.item_market_price);
							data.item_row.ItemSalePrice = data.item_row.item_unit_price;
							data.item_row.ShowPrice = data.item_row.item_sale_price;

							if (data.item_row.MarketPrice <= data.item_row.ItemSalePrice)
							{
								data.item_row.MarketPrice = 0
							}

							data.item_row.IfStore = data.product_freight_info.if_store;
							data.item_row.IsShowCountdown = that.StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT == data.item_row.activity_type_id ?
								true : false;
							data.item_row.activityType = that.StateCode.ACTIVITY_TYPE_GROUPBOOKING == data.item_row.activity_type_id ?
								'GROUPBOOKING' : false;
							data.item_row.productPicList = [];

                            data.item_row.pv_url = '/pagesub/video/video?pid=' + data.item_row.product_id + '&url=' + encodeURIComponent(data.item_row.product_video) + '&title=' + encodeURIComponent(data.item_row.product_name)

							for (var i = 0; i < data.item_row.item_image_row.length; i++) {
								data.item_row.productPicList[i] = {};
								data.item_row.productPicList[i].Path = data.item_row.item_image_row[i];
								data.item_row.productPicList[i].Video = false;
							}
							data.item_row.SpecLst = [];

							//for b2b
							data.item_row.Ids = [];

							for(var t in data.item_row.product_spec){
								for(var s in data.item_row.product_spec[t].item){
									if(data.item_row.product_spec[t].item[s].select == 1){
										that.setData({
											color: data.item_row.product_spec[0].item[0].name,
										});
									}
								}
							}

							for (var n in data.item_row.product_spec) {
								data.item_row.SpecLst[n] = {};
								data.item_row.SpecLst[n].svLst = [];
								data.item_row.SpecLst[n].unit_id = data.item_row.product_spec[n].id;

								 //for b2b
								data.item_row.Ids[n] = {};
								data.item_row.Ids[n].info = [];
								data.item_row.Ids[n].id = data.item_row.product_spec[n].id;

								for (var r in data.item_row.product_spec[n].item) {
									data.item_row.SpecLst[n].svLst[r] = {};
									data.item_row.SpecLst[n].svLst[r].Id = data.item_row.product_spec[n].item[r].id;
									data.item_row.SpecLst[n].svLst[r].Name = data.item_row.product_spec[n].item[r].name;
									data.item_row.Ids[n].info[r] = data.item_row.product_spec[n].item[r].id; //for b2b
									if (data.item_row.item_spec[n].item.id == data.item_row.product_spec[n].item[r].id) {
										data.item_row.SpecLst[n].svLst[r].IsChecked = true;
									} else {
										data.item_row.SpecLst[n].svLst[r].IsChecked = false;
									}
									if (!that.selectimg && data.item_row.product_spec_image_row[data.item_row.product_spec[n].item[r].id]) {
										data.item_row.SpecLst[n].svLst[r].imagePath = data.item_row.product_spec_image_row[data.item_row.product_spec[
											n].item[r].id];
									} else {
										//data.item_row.SpecLst[n].svLst[r].imagePath = data.item_row.product_image;
										data.item_row.SpecLst[n].svLst[r].imagePath = data.item_row.product_image || data.item_row.product_spec_image_row[data.item_row.product_spec[n].item[r].id];
									}
								}
							}


							if (data.item_row.SpecLst.length > 0) {
								for (var n in data.item_row.SpecLst) {
									for (var r in data.item_row.SpecLst[n].svLst) {
										data.item_row.SpecLst[n].svLst[r].IsChecked &&
											(data.item_row.SpecLst[n].ckid = data.item_row.SpecLst[n].svLst[r].Id,
												that.splist.push(data.item_row.SpecLst[n].svLst[r].Id), that.splistStr.push(data.item_row.SpecLst[n].svLst[
													r].Name),
												that.setData({
													selectimg: data.item_row.SpecLst[n].svLst[r].imagePath
												}));

										data.item_row.product_spec[n].item[r].IsChecked &&
											(data.item_row.product_spec[n].ckid = data.item_row.product_spec[n].item[r].id, that.splist.push(data.item_row
												.product_spec[n].item[r].id), that.splistStr.push(data.item_row.product_spec[n].item[r].name), that.setData({
												selectimg: data.item_row.product_spec[n].item[r].imagePath
											}));
									}
								}
							} else {
								that.setData({
									selectimg: data.item_row.product_image
								});
							}

							var perm_id = that.$.getStorageSync('uid');
							var perm_key = that.$.getStorageSync('ukey');
							that.$.setNavigationBarTitle({
								title: data.item_row.product_item_name
							});


							//data.item_row.product_detail = '<style>img{max-width:100%!important;height:auto;}</style>' + data.item_row.product_detail;
							//data.item_row.product_detail = data.item_row.product_detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')

							data.item_row.product_detail && (data.item_row.product_detail = data.item_row.product_detail.replace(new RegExp(
								'<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
							data.item_row.product_param && (data.item_row.product_param = data.item_row.product_param.replace(new RegExp(
								'<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
							data.item_row.product_extension && (data.item_row.product_extension = data.item_row.product_extension.replace(
								new RegExp('<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));
							data.item_row.product_service && (data.item_row.product_service = data.item_row.product_service.replace(new RegExp(
								'<img ', "gm"), '<img style="max-width:100%;height:auto;display: flex;" '));


							let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", data.store_info.user_id, data.item_row.item_id);
							that.setData({
								chatUrl: chat_url
							});

							if (true)
							{
								/*
								that.$.request({
									url: that.Config.URL.user.kefu_config,
									data: {user_id: data.store_info.user_id, store_id:data.store_info.store_id},
									loading: false,
									success: function(rd, r_status, r_msg, code) {
										if (r_status == 200) {
											let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", rd.friend_id, data.item_row.item_id);
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
							}
							else
							{
							}


							that.setData({
								ProductInfo: data.item_row,
								product_uniqid: data.item_row.product_uniqid,
								store_info: data.store_info,
								isCollection: data.is_favorite > 0 ? true : false,
								skuid: data.item_row.item_id,
								Parameters: data.item_row.product_param,
								desc: data.item_row.ProductTips,
								pname: data.item_row.product_item_name,
								stock: data.item_row.item_quantity
							});

							/*
              							var i = data.item_row.product_detail;
              							i = i.replace(/&amp;nbsp;/g, "");
              							//WxParse.wxParse("pinfo", "html", i, that);

              							var p = data.item_row.product_param;
              							p = p.replace(/&amp;nbsp;/g, "");
              							//WxParse.wxParse("product_param", "html", p, that);

              							var c = data.item_row.product_extension;
              							c = c.replace(/&amp;nbsp;/g, "");
              							WxParse.wxParse("product_extension", "html", c, that);

              							var s = data.item_row.product_service;
              							s = s.replace(/&amp;nbsp;/g, "");
              							//WxParse.wxParse("Services", "html", s, that);
              							*/


							that.setData({
								isdata: true
							});

					

							//读取帮助信息
							//that.getFaq(data.item_row.product_id);
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
							let $link =  that.$.sprintf('%s/h5/pagesub/product/detail?id=%s', that.Config.SiteUrl, that.proId);
							let $img_url = that.ProductInfo.productPicList[0].Path;

							//初始化微信分享
							that.$.wxShare($title, $desc, $link, $img_url)

							that.getStoreProdcutList();
						}

						that.setData({
							loaded: true
						});


						that.$.stopPullDownRefresh()
					},
					complete: function (res, status) {
					}
				});
			},

			getFaq: function(product_id){
				let that = this;

				let faq_params = {
					product_id:product_id,
					rows:2,
				}
				that.$.request({
					url: this.Config.URL.sns.story_lists,
					data: faq_params,
                    loading: false,/*
                    ajaxCache: {
                        timeout: Config.CACHE_EXPIRE
                    }, */
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.faq_rows = data.items;

							if ('analytics_row' in (that.ProductInfo))
							{
								if (that.ProductInfo.analytics_row && 'product_ask_num' in (that.ProductInfo.analytics_row))
								{
									that.ProductInfo.analytics_row.product_ask_num = data.records;
								}
							}
						}
					}
				});
			},

			listFaq: function(e)
			{
				this.gopage(this.sprintf('/community/community/list?pid=%s', e.currentTarget.dataset.product_id));
			},

			ckselectsp: function(e) {
				this.setData({
					//change: e.currentTarget.offsetLeft,
					selectsp: 1,
					selectct: 1,
					flag: true,
					flag1: false
				}), e.currentTarget.dataset.type == 1 ? this.setData({
					isModified: true
				}) : this.setData({
					isModified: false
				})
			},
			ckselectsp1: function(e) {
				this.setData({
					//change: e.currentTarget.offsetLeft,
					selectsp: 1,
					selectct: 1,
					flag1: true,
					flag: false
				})
			},
			closesp: function(e) {
				var that = this;
				that.setData({
					selectct: 0,
					/*flag: false*/
				});

				setTimeout(function() {
						that.setData({
							selectsp: 0
						})
					},
					1e2)
			},

			selectSpec: function(e) {
				let that = this;
				if (!e.target.dataset.enable) {
					return;
				}

				/*
				this.setData({
					flag1: true,
					flag: false
				})
        */

				/*$(self).addClass("current").siblings().removeClass("current");
				//拼接属性
				var curEle = $(".spec").find("a.current");
				var curSpec = [];
				that.$.each(curEle, function (i, v)
				{
				    // convert to int type then sort
				    curSpec.push(parseInt($(v).attr("specs_value_id")) || 0);
				});
				var spec_string = curSpec.sort(function (a, b)
				{
				    return a - b;
				}).join("-");
				//获取商品ID
				window.item_id = myData.product_uniqid[spec_string][0];
				get_detail(window.item_id);*/
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

				uniqid = spec_ids.sort(function(a, b) {
					return a - b;
				}).join("-");

				var item_id = that.ProductInfo.product_uniqid[uniqid][0];

				if (that.b2bFlag)
				{
				  return;
				}

				that.setData({
					proId: item_id
				})

				that.InitProduct(false);

				/*
				that.$.xsr(that.$.makeUrl(api.GetProductlistSpc, params), function (t) {
				    that.$.isNull(t.Info[0].activityType) || t.Info[0].activityType == "GROUPBOOKING" && t.Info[0].activity_id > 0 && that.findOffered(t.Info[0].activity_id);
				    for (var n in t.Info[0].SpecLst) for (var r in t.Info[0].SpecLst[n].svLst) t.Info[0].SpecLst[n].svLst[r].IsChecked && (t.Info[0].SpecLst[n].ckid = t.Info[0].SpecLst[n].svLst[r].Id, that.splist.push(t.Info[0].SpecLst[n].svLst[r].Id), that.splistStr.push(t.Info[0].SpecLst[n].svLst[r].Name)), t.Info[0].SpecLst[n].svLst[r].Id == e.target.dataset.spid && that.setData({selectimg: t.Info[0].SpecLst[n].svLst[r].imagePath});
				    that.$.setNavigationBarTitle({title: t.Info[0].SalesName}), that.setData({
				        ProductInfo: t.Info[0],
				        skuid: t.Info[0].item_id,
				        pname: t.Info[0].ProductName,
				        Parameters: t.Info[0].ProductParameters ? that.Grouping(t.Info[0].ProductParameters) : [],
				        stock: t.Info[0].Stock
				    })
				})
				*/
			},
			sub: function() {
				this.unifiedNum(2)
			},
			add: function() {
				this.unifiedNum(1)
			},
			writenum: function(e) {
				this.setData({
					inputval: e.detail.value
				}), this.unifiedNum(3)
			},
			unifiedNum: function(e) {
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
			addCart: function() {
				var that = this;

				if (that.b2bFlag)
				{
					that.addCartBat();
					return;
				}

				var params = {
					item_id: that.proId,
					proName: that.pname,
					cart_quantity: that.numval,
					activity_id: that.ProductInfo.activity_id,

					SKU_Id: that.skuid
				};

				if (that.stock <= 0) {
					that.$.alert("亲~商品没有库存啦！");
					return
				}

				that.$.request({
					url: this.Config.URL.cart.add,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							//that.notice.postNotificationName("RefreshProduct", true);
							that.$report('fb_mobile_add_to_cart', data);

							//
							that.notice.postNotificationName("RefreshCart", parseInt(that.numval));

							that.setCartNum({
								type: 'add',
								num: parseInt(that.numval)
							});

							that.$.alert(that.__('添加购物车成功'));

							that.setData({
								numval: 1,
								inputval: 1
							})

						}

						that.setData({
							selectct: 0
						});

						setTimeout(function() {
							that.setData({
								selectsp: 0
							})
						}, 1e3);
					}
				});
			},

			//for b2b
			//商品数量
			changes(e, id) {
				console.log(e, id);
				var that = this;
				var t = that.product_uniqid[id][0];
				that.proIds[id] = {
					item_id: t,
					quantity: e
				};
				this.setprice();
			},

			//计算价格
			setprice: function() {
				var that = this;
				var price = 0;
				var quantity = 0;
				for (var i in that.proIds) {
					price = price + that.proIds[i].quantity * that.product_uniqid[i][1];
					quantity += that.proIds[i].quantity;
				}
				console.log(quantity)
				this.setData({
					price: price,
					quantity:quantity
				});
			},
			selectS: function(e, k, d,evnet) {
				var that = this;
				that.setData({
					color:d
				})
				if (e.select == 1) {
					return true;
				}
				// evnet.target.dataset.unit_id = 1002;
				var p = that.ProductInfo.product_spec[0].item;
				for (var l = 0; l < p.length; l++) {
					if (p[l].select == 1) {
						p[l].select = 0;
					}
				}

				e.select = 1;
				// this.setData({
				// 	proId: items.id
				// });
				that.selectSpec(evnet);
			},

			addCartBat: function() {
				var that = this;
				var pat = [];
				if(that.ProductInfo.SpecLst.length>0)
				{
					for (var i in that.proIds) {
						if (that.proIds[i].quantity > 0) {
							pat.push(that.proIds[i]);
						}
					}

					if (pat.length <= 0) {
						that.$.alert('亲~请选择商品！');
						return;
					}
				}
				else
				{
					pat = [
						{item_id: that.options.pid,quantity: 1}
					]
				}

				var params = {
					par: JSON.stringify(pat),
					prd: that.options.pid
				};
				that.$.request({
					url: this.Config.URL.cart.batchadd,
					data: params,
					success: function(data, status, msg, code) {
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

						setTimeout(function() {
							that.setData({
								selectsp: 0
							});
						}, 1e3);
					}
				});
			},

			PDCollection: function(e) {
				var that = this;
				if (this.isCollection) {
					var params = {
						item_id: e.currentTarget.dataset.id
					};

					that.$.request({
						url: this.Config.URL.user.removeWishItem,
						data: params,
						success: function(data, status, msg, code) {

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
						success: function(data, status, msg, code) {
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

            addToWestore: function(e) {
            	var that = this;

                var params = {
                    item_id: e.currentTarget.dataset.id,
                    store_id:this.store_info.store_id,
                    product_id:this.ProductInfo.product_id
                };

                that.$.request({
                    url: this.Config.URL.user.direct_store_add,
                    data: params,
                    success: function(data, status, msg, code) {

                        if(status == 200)
                        {
                            that.$.alert(msg);
                        }
                        else
                        {
                            that.$.alert(msg);
                        }
                    }
                });

            },
			picDetail: function() {
				this.setData({
					tapindex: 1
				})
			},
			spcParam: function() {
				this.setData({
					tapindex: 2
				})
			},

			packingList: function() {
				this.setData({
					tapindex: 3
				})
			},

			showFightGroup: function() {
				this.setData({
					tapindex: 4
				})
			},

			showServiceTab: function() {
				this.setData({
					tapindex: 5
				})
			},

			Grouping: function(e) {
				var t = {},
					n = [];
				for (var r = 0; r < e.length; r++) {
					var i = e[r];
					if (!t[i.ParameterGroupId]) n.push({
						ParameterGroupId: i.ParameterGroupId,
						name: i.ParameterGroupName,
						data: [i]
					}), t[i.ParameterGroupId] = i;
					else
						for (var s = 0; s < n.length; s++) {
							var o = n[s];
							if (o.ParameterGroupId == i.ParameterGroupId) {
								o.push(i);
								break
							}
						}
				}
				return n
			},
			//单规格，不需要选规格，默认购买一个。
			buynow: function(e) {
				var that = this;
				var params = {
					item_id: that.proId,
					proName: that.pname,
					cart_quantity: that.numval,
					activity_id: that.ProductInfo.activity_id,

					SKU_Id: that.skuid
				};

				//for b2b
				if(that.b2bFlag && that.ProductInfo.SpecLst.length>0)
				{
					var pat = [];
					for (var i in that.proIds) {
						if (that.proIds[i].quantity > 0) {
							var t = that.proIds[i].item_id + '|' + that.proIds[i].quantity + "|0";
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
					}),this.setData({
						selectct: 0
					});
				}
				else
				{
					that.$.navigateTo({
						url: "/pagesub/checkout/checkout?ifcart=0&cart_id=" + params.item_id + "|" + params.cart_quantity + "|0"
					}), this.setData({
						selectct: 0
					});
				}

				var n = this;
				setTimeout(function() {
							n.setData({
								selectsp: 0
							})
						},
						1e3)
			},
			ILObuynow: function(e) {
				let that = this;
				var t = {
					Amount: this.numval,
					ProductId: this.proId,
					item_id: this.skuid,
					AddTime: getNowFormatDate(),
					orderType: 0,
					isFightGroup: "1",
					ProductSaleName: this.pname,

					speStr: JSON.stringify(this.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
				};
				that.$.navigateTo({
					url: "/pagesub/checkout/checkout?ifcart=0&cart_id=" + this.proId + "|" + this.numval + "|0"
				})
			},
			immediatelyOffered: function() {
				var that = this;
				var e = {
					Amount: 1,
					ProductId: this.proId,
					orderType: 1,
					activity_id: this.MEID,
					isOwner: "true",
					isFightGroup: "2",
					item_id: this.skuid,
					AddTime: getNowFormatDate(),
					ownGroupId: 0,
					ProductSaleName: this.pname,

					speStr: JSON.stringify(this.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
				};

				//console.info("/pagesub/checkout/checkout?single_activity=1&ifcart=0&cart_id=" + that.proId + "|" + 1 + "&activity_id=" + this.activity_id + "&gb_id=" + this.gb_id);
				that.$.navigateTo({
					url: "/pagesub/checkout/checkout?single_activity=1&ifcart=0&cart_id=" + that.proId + "|" + 1  + "|0" + "&activity_id=" + this
						.activity_id + "&gb_id=" + this.gb_id,
					success: function() {
						//console.info('success');
					},
					fail: function() {
						//console.info('fail');
					},
					complete: function() {
						//console.info('complete');
					}
				})
			},
			groupBuying: function(e) {
				var that = this,
					gb_id = e.currentTarget.dataset.gb_id;
				that.$.navigateTo({
					url: "/pagesub/checkout/checkout?single_activity=1&ifcart=0&cart_id=" + that.proId + "|" + 1  + "|0" + "&activity_id=" + that.activity_id +
						"&gb_id=" + gb_id
				})

			},
			findOffered: function(activity_id) {
				var that = this;
				var params = {
					activity_id: activity_id,
					rows: 4
				}

                that.setData({
                	GB_rows: []
                })

				that.$.request({
					url: this.Config.URL.user.listsGroupbooking,
					data: params,
					loading: false,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {

							intervalDate = setInterval(function() {
								data.items.forEach(function(e) {
									e.Time = {};
									e.end_diff_time = (new Date(e.gb_endtime.replace(/-/g, "/"))).getTime() - (new Date).getTime();
									var n = e.end_diff_time - 1e3;

									if (n < 0) {
										e.Time.days = "00";
										e.Time.hour = "00";
										e.Time.min = "00";
										e.Time.sec = "00";
									} else {
										e.Time.days = that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60 / 24));
										e.Time.hour = that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60 % 24));
										e.Time.min = that.$.doubleNum(Math.floor(n / 1e3 / 60 % 60));
										e.Time.sec = that.$.doubleNum(Math.floor(n / 1e3 % 60));
									}
									// e.Time = that.$.FormatTime(e.activity_endtime)
								});
								that.setData({
									GB_rows: data.items
								})
							}, 1e3)
						} else {
							that.setData({
								/*flag: false,*/
								ispage: false
							})
						}
					}
				});
				/* 拼团 that.$.xsr(that.$.makeUrl(fgapi.GetGoingGroupEventByEventId, {EventId: e}), function (e) {
				    e.Info.length > 0 && (intervalDate = setInterval(function () {
				            e.Info.forEach(function (e) {
				                e.Time = that.$.FormatTime(e.EventEndTimeStr)
				            }), that.setData({GB_rows: e.Info})
				        },
				        1e3))
				})*/
			},
			lookall: function() {
				this.isAll ? this.setData({
					isAll: false
				}) : this.setData({
					isAll: true
				})
			},
			userFGType: function(e, t) {
				let that = this;
				var n = {
					OwnGroupId: e
				};

			},
		
			cancel: function() {
				this.setData({
					isCancel: false
				})
			},
			cancelsuccess: function() {
				this.setData({
					isCancelSuccess: true
				})
			},
			doReceive: function(e) {
				var that = this;
				if (e.currentTarget.dataset.isreceive == -1) {
					return;
				}
				that.setData({
					Id: e.currentTarget.dataset.id,
					needed_point: e.currentTarget.dataset.point
				});
				that.getUserReceiveCoupon();
			},
	
			ImgTap: function(e) {
				var that = this,
					n = [];
				for (var r in this.ProductInfo.last_comment_row.comment_image) n.push(this.ProductInfo.last_comment_row.comment_image[r]);
				var i = e.target.dataset.src;
				that.$.previewImage({
					current: i,
					urls: n
				})
			},
			previewProductImg: function(e) {
				var that = this,
					n = [];
				for (var r in this.ProductInfo.productPicList)
				{
					n.push(this.ProductInfo.productPicList[r].Path);
				}

				var i = e.target.dataset.src;

				that.$.previewImage({
					current: i,
					urls: n
				})
			},

			goTabBar: function(e) {
				var that = this;
				that.$.goToTabBar(that, e.currentTarget.dataset.url)
			},

			cancelShare: function(e) {
			},
			showCodeImg: function(e) {
			},
			shareQRCode: function(e) {
			},
			saveImg: function(e) {
			},

			shareBox: function(e) {

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

			getStoreProdcutList:function(){
				var that = this;
				var params={
					store_id:this.ProductInfo.store_id
				}
				console.log(params)
				that.$.request({
					url:this.Config.URL.store.product,
					data:params,
					loading: false,
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success:function(data, status, msg, code){
						that.setData({
							store_product_list:data.items,
							store_product_num:data.items.length>=30 ? (data.items.length + '+') : data.items.length //在售商品
						})
					}
				})
			},
			outertouch: function() {
				this.setData({
					virtual_flag: true
				})
			},
			innertouch: function() {
				this.setData({
					virtual_flag: false
				})
			},
			tplGoToPage: function(e) {
				let that = this;

				//先判断是否登录
				this.forceUserInfo(function(user) {
					var t = e.currentTarget.dataset;
					//that.$.gopage(t.appurl);

					that.$.request({
						url: that.Config.URL.user.kefu_config,
						data: {user_id: that.store_info.user_id, store_id:that.store_info.store_id},
						loading: false,
						success: function(rd, r_status, r_msg, code) {
							if (r_status == 200) {
								let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&item_id=%s", rd.friend_id, that.skuid);

								that.setData({
									chatUrl: chat_url
				});

								that.$.gopage(chat_url);

							}
							else
							{
								that.$.alert(r_msg);
							}
						}
					});
				});


				return ;

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
			closeNativeShare: function() {
				var that = this;
				that.setData({
					shareContetnFlag: 0,
					flag: false
				});

				setTimeout(function() {
					that.setData({
						shareBoxFlag: 0
					})
				}, 1e2)
			},
			scrolltoupper: function(t) {
				this.old.scposition = t.detail.scrollTop;

				t.detail.scrollTop >= this.screenHeight ? this.setData({
					isquicknav: true
				}) : this.setData({
					isquicknav: false
				})
			},
			onMenu: function(t) {
				this.$refs.headerNavMenu.showBoxView = !this.$refs.headerNavMenu.showBoxView
			},
			onShareBox: function(e) {
				let that = this;
				var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this.skuid, this.userInfo
						.user_id);

				$href = that.$.sprintf('%s/h5/pagesub/product/detail?id=%d&uid=%d', that.Config.SiteUrl, this.proId, this.userInfo.user_id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS

				// #endif

				// #ifdef MP-WEIXIN
				$href = "/pagesub/product/detail?id=" + this.proId + "&uid=" + this.userInfo.user_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.pname,
						shareText: this.desc,
						href: $href,
						image: this.ProductInfo.productPicList[0].Path,
						price: this.number_format(this.ProductInfo.ItemSalePrice, 2)
					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				//海报
				if (e == 3)
				{
					// #ifndef APP-PLUS
					this.$refs.shareBoxMp.show();
					// #endif
				}
				else
				{
					// #ifdef H5
					if (that.$.ifUniApp())
					{
						this.$refs.shareBoxH5.show();
					}
					else
					{
						this.$refs.shareBoxMp.show();
					}
					// #endif
				}




			},
			onReturnTop: function() {
				let that = this;
				// 清除上一次的定时器
				if (that.timer !== null) {
					clearInterval(that.timer);
				}
				that.setData({
					scposition: this.old.scposition
				})

				that.timer = setInterval(function(){
					let speed = that.scposition / 4;
					speed = Math.ceil(speed);
					if(that.scposition <= 0 || !that.scposition){
						clearInterval(that.timer);
					}
					that.scposition = that.scposition - speed
				}, 30);
			},

			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: false
					}), clearTimeout(t);
					var t = setTimeout(function() {
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
				this.$refs.mpvueCityPicker.show()
			},

			onCancel(e) {
				//console.log(e)
			},

			onConfirm(e) {
				let that = this;

				let district_info = that.$.isNull(e.label.toString()) ? that.__('请选择地址') : e.label.toString();
				let product_freight_info = this.product_freight_info;
				product_freight_info.district_info = district_info;


				let item_row = this.ProductInfo;


                this.setData({
                    product_freight_info: product_freight_info
                });

				var params = {
					item_id: this.proId,
					district_id:e.value[1]
				};

				//

				//存入本地
				uni.setStorageSync('district_id', params.district_id);

				that.$.request({
					url: this.Config.URL.product.shipping_district,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {

							item_row.IfStore = data.product_freight_info.if_store

							that.setData({
								product_freight_info: data.product_freight_info,
								ProductInfo:item_row
							})
						}
					}
				});
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
		}
	}

	.m-banner-ad {
		width: 750rpx;
		height: 750rpx;
		position: relative
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
	}

	.m-info-box label {
		color: $default-skin-bg;
		display: block;
		font-size: 28rpx;
	}

	.m-info-price {
		color: $default-skin-bg;
		font-size: 36rpx;
		font-weight: bold;
		padding-top: 10rpx;
	}

	.m-info-price text {
		font-size: 24rpx;
	}

	.m-info-delprice {
		color: #888;
		margin-left: 10rpx;
		font-weight: 100;
		text-decoration: line-through;
		position: relative;
	}

	/*优惠券样式 start*/
	.m-coupon-list {
		margin-top: 36rpx
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
		width: 485rpx;
		margin-left: 30rpx;
		margin-top: 9.5rpx;
	}

	.m-coupon-btn {
		float: left;
		width: 110rpx;
		margin-left: 30rpx;
		line-height: 35rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
	}

	.btn-coupon {
		display: inline-block;
		width: 28rpx;
	}

	.btn-coupon-gray {
		color: #888;
	}

	.m-coupon-text {
		float: left;
		width: 300rpx;
	}

	.m-coupon-text label {
		display: inline-block;
		color: #333;
		font-size: 28rpx;
		width: 350rpx;
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
		width: 180rpx;float:right;padding-top: 10rpx;line-height: 74rpx;
	}

	.dis .num {
		font-size: 24rpx;
		color: #717171;
		padding-right: 20rpx;
		text-align: right;
	}

	.m-info-tip {
		color: #888;
	}

	.m-info-sp {
		font-size: 28rpx;
	}

	.m-info-sp label {
		margin-left: 20rpx;
	}

	.m-comment .m-media-box-title {
		font-size: 28rpx
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
		font-size: 24rpx
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
		border-right: 1rpx solid #d5d5d5
	}

	.m-Packinglist {
		font-size: 28rpx;
		padding: 20rpx;
	}

	/*底部按钮 start*/
	.m-footer-btn {
		height: 100rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: center;
		z-index: 3;

		display: flex;
		flex-direction: row;
	}

	.m-footer-btn-list {
		/*width: 50%;*/
		height: 100%;
		position: relative;
		float: left;
		display: flex;
		flex-direction: row;
		flex:1;
	}

	.m-footer-btn-list::before {
		content: " ";
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
		z-index: 3;
	}

	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 126rpx;
		font-size: 24rpx;
		color: #888;
		line-height: 40rpx;
		padding: 15rpx 0;
		border-right: 1rpx solid #d5d5d5;
		box-sizing: border-box;
		flex:1;
	}

	.m-footer-btn-item::last-child {
		border: none;
	}

	.m-footer-btn-icon {
		width: 40rpx;
		height: 40rpx;
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
		height: 100%;
		float: left;
		background-color: #ff9402;
		color: #fff;
		line-height: 100rpx;
		font-size: 32rpx;
		flex:1;
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
		height: 196rpx;
		box-sizing: border-box;
		padding: 20rpx;
		position: relative;
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
	}

	.m-panel-sp-pname .m-pprice {
		color: $default-skin-bg;
		font-size: 32rpx;
		line-height: 50rpx;
		font-weight: bold;
	}

	.m-panel-sp-icon {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
	}

	/* .m-panel-sp-listbox{height: 604rpx;} */
	.m-panel-sp-listbox-item {
		border-top: 1rpx solid #d5d5d5;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
	}

	.m-panel-sp-listbox-item .m-cells-title {
		color: black;
		padding-left: 0;
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
		width: 8%;
		text-align: center;
		margin-top:13px;
		margin-bottom:25px;
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
		height: 60rpx;
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
	.m-ys{
		float: left;
		height: 35px;
		line-height: 35px;
		overflow: hidden;
		width: 100%;
		border-radius: 5px;
		margin: 5px;
	}
	/* end for b2b */

	.m-panel-sp-sellabel {
		color: $default-skin-bg !important;
		border: 1rpx solid $default-skin-bg !important;
	}

	.m-m-panel-sp-btn {
		height: 100rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
	}

	.m-m-panel-sp-lbtn {
		float: left;
		width: 50%;
		border-top: 1rpx solid #d5d5d5;
		text-align: center;
	}

	.m-m-panel-sp-rbtn {
		width: 50%;
		float: left;
		background-color: $default-skin-bg;
		line-height: 100rpx;
		color: #fff;
		text-align: center
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
		margin-left: 15rpx;
		border-radius: 4rpx;
		top: -5rpx;
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
		height: 134rpx;
		color: #fff;
	}

	.seckill-left {
		width: 60%;
		padding-left: 40rpx;
		background: #ff0136;
		display: flex;
		flex-flow: column
	}

	.seckill-right {
		width: 40%;
		background: rgb(254, 234, 233);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column
	}

	.seckill-left .discountPrice {
		margin-top: 2rpx
	}

	.seckill-left .discountPrice text {
		font-size: 48rpx
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
		color: #ff0136;
		font-size: 28rpx;
		margin-bottom: 16rpx;
	}

	.seckill-right .Time {
		margin-bottom: 10rpx
	}

	.seckill-right .time {
		padding: 8rpx 12rpx;
		font-size: 32rpx;
		border-radius: 10rpx;
		background: #ff0136
	}

	.seckill-right .time-tip {
		color: #ff0136;
		margin: 0 6rpx
	}

	/* 店铺信息 */

	.goods-detail-store .store_name {
		font-size: 32rpx;
		color: #333;
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
	}

    /* */
    .u-p-opt{
        position: absolute;
    	right: 20rpx;
    	bottom: 20rpx
    }

    .navtext{
        margin-bottom:20rpx;
    }

    .quicknav {
    	width: 80rpx;
    	height: 80rpx;
    	border-radius: 50%;
        border: 1rpx solid #EEE;

        .iconfont{
            text-align: center;
            vertical-align: middle;
            line-height: 80rpx;
            height: 80rpx;
            font-size: 40rpx;
        }

        .iconfont.zc{
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
   .fix-titlenview-trans
   {
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
   	width:750rpx;
   	height:320rpx;
   	background:rgba(255,255,255,1);
   	margin-top:20rpx;
   }


   .evaluate-top {
   	width:750rpx;
   	height:80rpx;
   	background:rgba(255,255,255,1);
   	position: absolute;
   	margin-top:24rpx;
   	margin-left:30rpx;
   }

   .right {
   	width:150rpx;
   	height:24rpx;
   	font-size:26rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:$main-skin-color;

   }

   .evaluate-right {
   	position: absolute;
   	margin-top:-52rpx;
   	margin-left:550rpx;
   }


   .evaluate-bottom {
   	width:750rpx;
   	background:rgba(255,255,255,1);
   	position: absolute;
   	margin-top:80rpx;
   }

   .uesr-evaluate {
   	width:600rpx;
   	height:200rpx;
   	// background:rgba(244,244,244,1);
   	border-radius:8rpx;
   	float:left;
   	padding-top:20rpx;
   	padding-left:30rpx;
   }

   .uesr-evaluate-center {
   	width:100%;
   	height:200rpx;
   	background:rgba(244,244,244,1);
   	border-radius:0rpx 8rpx 8rpx 0rpx;
   	float:left;
   }

   .more-items {

   }

   .more-items-title {
   	width:100%;
   	height:100rpx;
   	background:rgba(244,244,244,1);
   }

   .uesr-evaluate-image {
   	width:200rpx;
   	height:200rpx;
   	border-radius:0rpx 8rpx 8rpx 0rpx;
   	background:rgba(255,255,255,1);
   	float:left;
   }

   .center-top {
   	width:360rpx;
   	height:60rpx;
   	// background:rgba(255,255,255,1);
   	margin:20rpx 20rpx;
	text-align: left;
   }

   .user-image {
   	width:60rpx;
   	height:60rpx;
   	background:rgba(244,244,244,1);
   	border-radius:50%;
   	float:left;
   }

   .user-name {
   	width:176rpx;
   	height:24rpx;
   	font-size:26rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:rgba(153,153,153,1);
   	margin:0 20rpx;
   	overflow:hidden
   }

   .user-text {
   	/* width:360rpx; */
   	height:80rpx;
   	// background:rgba(255,255,255,1);
   	margin-left:20rpx;
   	overflow:hidden;


   }

   .user-text label {
   	width:360rpx;
   	height:80rpx;
   	font-size:20rpx;
   	font-family:Alibaba PuHuiTi;
   	line-height:22rpx;
   	font-weight:400;
   	color:rgba(51,51,51,1);
   	word-wrap: break-word;
   	word-break: normal;
   }

   .p-adds {
   	width:750rpx;
   	height:100rpx;
   	background:rgba(255,255,255,1);
   	margin-top:20rpx;
   }

   .p-adds-left {
   	width:100rpx;
   	height:100rpx;
   	float:left;
   }
   .p-adds-left label {
   	width:60rpx;
   	height:25rpx;
   	font-size:26rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:rgba(153,153,153,1);
   	position: absolute;
   	margin-left:30rpx;
   	margin-top:30rpx;
   }

   .p-adds-right {
   	width:600rpx;
   	height:100rpx;
   	float:right;
   }

   .p-adds-right label {
   	position: absolute;
   	margin-top:30rpx;
   	font-size:26rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:rgba(51,51,51,1);
   }


   .evaluate-top .left {
   	width:228rpx;
   	height:31rpx;
   	font-size:32rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:500;
   	color:rgba(51,51,51,1);
   }

   .m-store {
   	width:100%;
   	height:460rpx;
   	background:rgba(255,255,255,1);
   	margin-top:20rpx;
   }

   .m-store-info {
   	width:750rpx;
   	height:120rpx;
   	background:rgba(255,255,255,1);

   }

   .m-store-radi {
   	width:80rpx;
   	height:80rpx;
   	background:linear-gradient(45deg,rgba(105,178,25,1),rgba(121,202,32,1));
   	border-radius:50%;
   	position: absolute;
   	margin:20rpx 30rpx;

   }

   .m-store-radi label {
   	width:58rpx;
   	height:28rpx;
   	font-size:30rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:500;
   	color:rgba(255,255,255,1);
   	position: absolute;
   	margin:12rpx;
   }

   .m-store-items {
   	width:100%;
   	height:380rpx;
   	background:rgba(255,255,255,1);
   	white-space:normal;
   }

   .m-store-item {
   	width:210rpx;
   	height:340rpx;
   	// background:rgba(244,255,232,1);
   	float:left;
   	margin-top:20rpx;
   	margin-left:30rpx;

   }

   .m-store-item-image {
   	width:210rpx;
   	height:210rpx;
   	border-radius:8rpx;
   	background:rgba(242,242,242,1);
   }

   .m-store-item-name label {
   	/* width:150rpx; */
   	height:60rpx;
   	font-size:26rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:rgba(51,51,51,1);
   	line-height:60rpx;
   	display:-webkit-box;
   	-webkit-box-orient:vertical;
   	-webkit-line-clamp:1;
   	overflow:hidden;
   }

   .m-store-item-price label{
   	width:100px;
   	height:30px;
   	font-size:20rpx;
   	font-family:Alibaba PuHuiTi;
   	font-weight:400;
   	color:#FF5A00;
   	text-align: center;
   }


   .scroll-view_H {
   	white-space: nowrap;
   	width: 100%;
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

   .bottom-safearea{
		padding-bottom: 0;
	    padding-bottom: constant(safe-area-inset-bottom);
	    padding-bottom: env(safe-area-inset-bottom);
   }

</style>
