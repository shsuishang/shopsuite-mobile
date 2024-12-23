<template>
	<view class="uni-tab-bar"  v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor" v-if="false"></status-bar>
		<uni-nav-bar :leftFlag="!!Config.SUBSITE_ENABLE || !!Config.LANG_ENABLE" :rightFlag="rightFlag"  :statusBar="true" :fixed="true" :border="false" :color="PageNav.window.navigationBarTextStyle" :backgroundColor="PageNav.window.navigationBarBackgroundColor" :background-color="PageNav.window.navigationBarBackgroundColor" right-icon="scan" right-width="120"  @clickRight="scan">
			<view class="input-view">
				<uni-icons type="search" size="22" color="#666666" style="line-height: 60rpx;"/>
				<input confirm-type="search" class="input" type="text" :placeholder="__('输入搜索关键词')" @click="onSearch">
			</view>
			<block slot="right">
				<view style="padding-right: 14rpx;line-height: 80rpx;opacity: 1;position:relative;" @click.stop="$.gopage('/member/member/message')">
					<uni-icons type="chat" :color="PageNav.window.navigationBarTextStyle" size="24" :style="'padding-bottom:2px;color:' + PageNav.window.navigationBarTextStyle" />
					<view  class="msg-num" v-if="newMsgNum>0">{{newMsgNum}}</view>
				</view>
			</block>
		</uni-nav-bar>
		<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft" :style="'background: ' + PageNav.window.navigationBarBackgroundColor +';border: 0;'">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
				  :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
				  	<view class="pt20"  :style="'color:' + PageNav.window.navigationBarTextStyle">{{tab.category_alias || tab.category_name || "　"}}</view>
				  	<view class="bg-main" :style="tabIndex==index ? '' : ''"></view>
			</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab, index1) in newsitems" :key="index1">
				<scroll-view class="list" scroll-y  @scrolltolower="scrolltolower('pageIndex-'+index1)" >
					<diy :BgConfig="tab.BgConfig"  :PageContent="tab.PageContent" :pageId="tab.pageId" :PageNav="tab.PageNav" :loadPageFlag="tab.loadPageFlag"  :StoreInfo="ChatInfo"  :hideDiy="hideDiy"  :uniId="'pageIndex-'+index1"></diy>

					<view class="uni-tab-bar-loading" v-if="!(tab.loadPageFlag)">
						{{tab.loadingText || __('加载中....')}}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

		<view class="uni-mask" v-if="bannerShow"></view>
		<!-- 弹出层 -->

		<view v-for="(item, index) in popUps" :key="index">
			<view :class="['msk']" @tap="onPopClose(index)" v-if="item.pop_up_enable">
				<view class="msk_box">
					<image :src="item.pop_up_image" style='width:100%'   mode="widthFix"  @tap="onPopClick(index)"></image>
					<view class="msk_box_info" style='right:16%;top:40%;'>
					</view>
					<view class="btn_cancel" @tap="onPopClose(index)">✕</view>
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>

	import statusBar from '../../components/status-bar.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'

	import diy from '../../components/themes/diy.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			statusBar,
			uniNavBar,
			diy
		},
		data() {
			return {
				options:{},
				pageId: '',
				loadPageFlag: false,
				CouponAmount: 0,
				user_is_new: 1,
				PageContent: [],
				BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
				PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
				loadPageFlag: false,
				hideDiy: false,
				ChatInfo: {},
				shareImg: "",
				shareTitle: "",
				refresh: true,

				pageId: 0,
				w: 0, //windowWidth
				chatUrl:'',

				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: [],
				tabBars: [],

				city: '全中国',
				showSubsiteFlag:true,
				rightFlag:true,

				showPopFlag:false,
				pop_up_image:'',
				pop_up_url:'',
				popUps:[],


				bannerShow:false,
				current_currency:86,
				current_lang:"zh-CN",
				current_img:"https://static.shopsuite.cn/shopsuite/flags/square/5322affbc4d56.png",
				current_label:"中文"
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});
			//console.info(this.userInfo);

		   //#ifdef MP
		   this.rightFlag = false;
		   //#endif

			var that = this;


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

			that.getPlantformInfo(function(plantform) {
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
							ary.push({loadPageFlag:false});
						}

						that.newsitems = ary;

						that.loadBrandsAndProduncts(that.tabIndex, 0, 1, false)
					}
				});

			})

			that.notice.addNotification("RefreshSubsite", that.RefreshSubsite, that);
			that.notice.addNotification("ScanCode", that.onScanCode, that);

			//
			that.setData({
				city:that.$.getStorageSync('site_name') ? that.$.getStorageSync('site_name') : that.__('全国站')
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			//
		},


		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			//that.$.isNull(that.plantformInfo) || uni.setNavigationBarTitle({title: that.plantformInfo.site_name});
			//this.refresh || this.setData({refresh: true})

			this.showCartNum();

			// #ifdef APP-PLUS
			if (this.pageId > 0)
			{
				this.hideDiy = false;
			}
			// #endif

		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			// #ifdef APP-PLUS
			this.hideDiy = true;
			// #endif
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			//that.notice.removeNotification("RefreshProduct", that);
			that.notice.removeNotification("RefreshStoreName", that);
			that.notice.removeNotification("RefreshOrderChain", that);
			that.notice.removeNotification("RefreshSubsite", that);
			that.notice.removeNotification("ScanCode", that);
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.initData(true)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
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
		onPageScroll: function() {},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),


			//初始化数据
			initData: function(force_refresh) {
				var that = this;
				var param = {};

				// #ifndef APP-PLUS
				that.$.setNavigationBarTitle({title: that.plantformInfo.site_name});
				// #endif

				//
				let $title = that.plantformInfo.site_name;
				let $desc = '' || this.plantformInfo.site_meta_description;
				let $link =  that.$.sprintf('%s/h5/pages/index/index', that.Config.SiteUrl);
				let $img_url = this.shareImg || this.plantformInfo.logo;

				//初始化微信分享

				that.$.wxShare($title, $desc, $link, $img_url)

				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].category_id, 1, force_refresh)
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
							this.newsitems[index1].items.splice(index2, 1);
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
				if (this.newsitems[e].total <= this.newsitems[e].page) {
					this.newsitems[e].loadingText = '没有更多了';
					return;
				}

				let category_id = this.tabBars[this.tabIndex].category_id;
				this.loadBrandsAndProduncts(this.tabIndex, category_id, this.newsitems[e].page+1, false);
			},
			loadBrandsAndProduncts(index, category_id, page, force_refresh) {
				var that = this;
				let params = {};
				params.category_id = category_id;
				params.page = page;
				params.page_type = 'page_index';

				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE,
						forceRefresh: force_refresh
					},
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh()


						let tmp = that.newsitems[index];
						tmp = {
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
							PageNav: that.$.parseJSON(data.page_nav),
							shareImg: data.page_share_image,
							shareTitle: data.page_share_title
						}

						tmp.loadPageFlag = true
						tmp.page = data.page;

						//console.info(tmp.PageNav.window.navigationBarTextStyle);
						//console.info(tmp.PageNav.window.navigationBarBackgroundColor);

						if (tmp.PageNav.window.navigationBarTextStyle == 'black')
						{
							tmp.PageNav.window.navigationBarTextStyle = '#000000'
						}

						if (tmp.PageNav.window.navigationBarTextStyle == 'white')
						{
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

						that.$set(that.newsitems, index, tmp);

						that.setData({
							pageId: tmp.pageId,
							PageContent: tmp.PageContent,
							BgConfig: tmp.BgConfig,
							PageNav: tmp.PageNav,
							shareImg: tmp.shareImg,
							shareTitle: tmp.shareTitle,
							loadPageFlag:true
						});


						that.setData({
							ChatInfo: {
								im_enable:data.im_enable,
								im_user_id:data.im_user_id,
								puid:data.puid
							},
							popUps:data.pop_ups
						});
					}
				});
			},
			async changeTab(e) {
				let that  = this;
				let index = e.target.current;
				//this.tabIndex = index;

				if (!this.newsitems[index].loadPageFlag) {
					let category_id = this.tabBars[index].category_id;
					this.loadBrandsAndProduncts(index, category_id, 1, false);
				}
				else
				{
					let tmp = that.newsitems[index];


					//console.info(tmp.PageNav.window.navigationBarTextStyle);
					//console.info(tmp.PageNav.window.navigationBarBackgroundColor);

					if (tmp.PageNav.window.navigationBarTextStyle == 'black')
					{
						tmp.PageNav.window.navigationBarTextStyle = '#000000'
					}

					if (tmp.PageNav.window.navigationBarTextStyle == 'white')
					{
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
				let that  = this;

				let tabIndex = e.currentTarget.dataset.current;
				if (!this.newsitems[tabIndex].loadPageFlag)
				{

				}
				else
				{
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


			RefreshStoreName: function(e) {
				//console.info(e);

				let refresh = false;

				if (e.store_row.store_id != this.$.getStorageSync('store_id'))
				{
					refresh = true;
				}

				this.setData({city:e.store_row.store_name});

				this.$.setStorageSync('store_id', e.store_row.store_id);
				this.$.setStorageSync('store_name', e.store_row.store_name);

				// #ifdef H5
				$cookies.set('store_id', e.store_row.store_id);
				// #endif

				if (refresh)
				{
					//刷新首页
					this.setData({
						indexArray: []
					});

					this.initData(true)
				}
			},

			RefreshOrderChain: function(e) {
				//console.info(e);
				//console.info(e.chain_name);

				let refresh = false;

				if (e.chain_id != this.$.getStorageSync('chain_id'))
				{
					refresh = true;
				}

				this.setData({city:e.ChainInfo.chain_name});

				this.$.setStorageSync('chain_id', e.chain_id);
				this.$.setStorageSync('chain_name', e.ChainInfo.chain_name);

				// #ifdef H5
				$cookies.set('chain_id', e.chain_id);
				// #endif

				if (refresh)
				{
					//刷新首页
					this.setData({
						indexArray: []
					});

					this.initData(true)
				}
			},

			RefreshSubsite: function(e) {
				//console.info(e.subsite_id);
				//console.info(e.subsite_name);

				let refresh = false;

				if (e.subsite_id != this.$.getStorageSync('site_id'))
				{
					refresh = true;
				}

				this.setData({city:e.subsite_name});

				this.$.setStorageSync('site_id', e.subsite_id);
				this.$.setStorageSync('site_name', e.subsite_name);

				// #ifdef H5
				$cookies.set('site_id', e.subsite_id);
				// #endif

				if (refresh)
				{
					this.initData(true)
				}
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
			innertouch: function() {},
			userReceiveCoupon: function() {
				var params = {
						CouponIds: "",
						user_is_new: this.user_is_new
				};

				var that = this;

				//领取操作
				that.$.request({
					url: that.Config.URL.user.voucher_add,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								isCancelSuccess: false,
								Coupons: data.items
							})
						} else {
							that.$.confirm(msg)
						}
					}
				});
			},
			
			onPopClose: function (index) {
				this.popUps[index].pop_up_enable = false;
				// this.setData({showPopFlag: false})
			},
			onPopClick: function () {
				// this.$.gopage(this.indexPopUrl)
				this.$.gopage(this.popUps[index].pop_up_url)
			},

			confirm() {
			},

			onSearch(e) {
				let that = this;
				that.$.gopage("/pagesub/search/search");
			},
			scan:function(e){
				let that = this;

				//#ifdef H5
				that.$.gopage('/pagesub/scan/scan');
				//#endif

				//#ifndef H5

				that.$.scanCode({
					success: function(e) {
						//console.info(e.result);
						that.onScanCode(e.result);
						//

						return
						var t = e.result.split("=");
						t.length > 2 || t.length < 2 ? that.$.alert(that.__("无法识别")) : t[0] == "productId" ? that.$.isNull(t[1]) ? that.$.alert(that.__("无法识别")) : that.$.navigateTo(
							"/pagesub/product/detail?id=" + t[1]) : t[0] == "eventId" ? that.$.isNull(t[1]) ? that.$.alert(that.__("无法识别")) : that.$.navigateTo(
							"../activitycheckin/activitycheckin?eventId=" + t[1]) : that.$.alert(that.__("无法识别"))
					},
					fail: function(e) {
						that.$.alert(that.__("无法识别"))
					}
				})
				//#endif

			},
			onScanCode:function(e){
				//console.info('sss')
				//console.info(e)
				let that = this;

				that.$.gopage(
						'/pagesub/webpage/web?u=' +
						encodeURIComponent(e)
				);
			},

			closeBanner: function() {
				this.bannerShow = false;
			},

			onCurrencyChange: function(e) {
				var that = this;
				that.setData({
					current_currency:e.detail.value
				})
			},


			scrolltolower:function(index){
				uni.$emit('diy-scrollbottom', {uniId:index})
			}
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
		margin-bottom:var(--window-bottom);
	}


	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left: 16rpx;
		white-space: nowrap;
	}

	.input-view {
		width: 92%;
		display: flex;
		background-color: #e7e7e7;
		height: 88rpx;
		border-radius: 30rpx;
		padding: 0 4%;
		flex-wrap: nowrap;
		margin: 14rpx 0;
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


	.uni-swiper-tab {

		line-height: 70rpx;
		height: 76rpx;

		.swiper-tab-list{

			line-height: 70rpx;
			height: 70rpx;

			.bg-main{
				bottom: 8rpx;
			}

			.pt20{
				padding-top:0rpx;
			}
		}
	}

	.msg-num{
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
		transform: translate(40%,-20%);
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
</style>
