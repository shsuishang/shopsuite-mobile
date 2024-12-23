<template>
	<view class="page" v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
    <!-- #ifdef APP-PLUS -->
    <status-bar :backgroundColor="BgConfig.BackgroundObj.bgColor"></status-bar>
    <!-- #endif -->

		<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>

		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->
	</view>
</template>


<style lang="scss">
@import '../../styles/_variables.scss';

@import '../../styles/layout.scss';

.page {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	min-height: 100%;
	/* background-size: cover !important; */
	background-position: top center !important;
}
</style>

<script>
import statusBar from '../../components/status-bar.vue';

// #ifdef APP-PLUS
import shareBoxApp from '../../components/share-box-app.vue'
// #endif

import diy from '../../components/themes/diy.vue'
import wxParse from '@/components/u-parse/u-parse.vue'
import diyCountdown from '../../components/themes/diy-countdown'
import { mapState, mapMutations } from 'vuex';

export default {
	/**
	 * 页面的初始数据
	 */
	data: function() {
		return {
			options: {},
			PageData: {},
			PageContent: [],
			BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
			PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
			loadPageFlag: false,
			shareImg: '',
			shareTitle: '',
			indexArray: [],
			page_id: 0,
			pageId: 0,
			PageNav: {},
			formdate: '',
			refresh: true,
			w: 0, //windowWidth
			chatUrl : '',
		
			shareData:{}
		};
	},

	components: {
		statusBar,
		diy,
		wxParse,
		diyCountdown,
		// #ifdef APP-PLUS
		shareBoxApp
		// #endif
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
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title:this.__('专题页面')
		});

		var that = this;

		var w = that.$.getSystemInfoSync().windowWidth;

		that.setData({
			w: w,
			options: options
		});

		this.getUserInfo(
			function(user) {
				that.setData({
					page_id: options.id
				});

				that.getPageInfo(false);
			}
		);
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
		this.refresh ||
			this.setData({
				refresh: true
			});
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {
		// 离开页面，注销事件
		var that = this;
		this.notice.removeNotification('RefreshProduct', that);

		// #ifdef APP-PLUS
		if (this.$refs.shareBoxApp.showBoxView) {
			this.$refs.shareBoxApp.cancel();
		}
		// #endif
	},

	onBackPress() {
		// #ifdef APP-PLUS
		if (this.$refs.shareBoxApp.showBoxView) {
			this.$refs.shareBoxApp.cancel();
			return true;
		}
		// #endif
	},
	onNavigationBarButtonTap(e) {
		var that = this;

		if (e.index === 0) {
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
	onPullDownRefresh: function() {
		this.setData({
			indexArray: []
		});
		this.getPageInfo(true);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},

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
			path: '/pagesub/diy-page/diy-page?id=' + this.page_id + '&uid=' + this.userInfo.user_id
		};
	},

	/**
	 * 用户点击右上角分享朋友圈
	 */
	onShareTimeline: function () {
		return {
			title: this.shareTitle,
			query: {
				uid: this.userInfo.user_id,
				id: this.page_id
			},
			imageUrl: this.shareImg,
		}
	},

	/**
	 * 页面滚动触发事件的处理函数
	 */
	onPageScroll: function() {},

	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		getPageInfo: function(force_refresh) {
			var that = this,
				params = {
					page_id: that.page_id
				};

			that.$.request({
				url: this.Config.URL.getMobilePage,
				data: params,
				ajaxCache: {
					timeout: this.Config.CACHE_EXPIRE,
                    forceRefresh: force_refresh
				},
				success: function(data, status, msg, code) {
					that.$.stopPullDownRefresh();

					if (200 == status)
					{

						that.setData({
							loadPageFlag: true,
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
							PageNav: that.$.parseJSON(data.page_nav),
							shareImg: data.page_share_image,
							shareTitle: data.page_share_title || data.page_name
						});

						if (that.PageNav.window.navigationBarTextStyle == 'black')
						{
							that.PageNav.window.navigationBarTextStyle = '#000000'
						}

						if (that.PageNav.window.navigationBarTextStyle == 'white')
						{
							that.PageNav.window.navigationBarTextStyle = '#ffffff'
						}

						that.$.setNavigationBarColor({
							frontColor: that.PageNav.window.navigationBarTextStyle,
							backgroundColor: that.PageNav.window.navigationBarBackgroundColor
						})

						that.$.setNavigationBarTitle({
							title: data.page_name
						});
						for (var n in that.PageContent) {
							//that.PageContent[n].eltmType == 2 && WxParse.wxParse("word" + n, "html", that.PageContent[n].eltm2.words, that)
						}

						if (that.hasLogin && data.im_enable)
						{
							/*
                            var perm_id = that.$.getStorageSync('uid');
                            var perm_key = that.$.getStorageSync('ukey');

                            let chat_url = that.$.sprintf("/im/chat/chat?uid=%s", that.StoreInfo.im_user_id);

                            that.setData({
                                chatUrl: chat_url
                            });
                            */
						}



						//初始化微信分享
						let $title = that.shareTitle;
						let $desc = that.shareTitle || that.plantformInfo.site_meta_description;
						let $link = '';
						let $img_url = that.shareImg || that.plantformInfo.logo;

						//初始化微信分享
						that.$.wxShare($title, $desc, $link, $img_url)
					}
				}
			});
		},
		onShareBox: function(e) {
			let that = this;
			var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this.skuid, this.userInfo.user_id);

			$href = that.$.sprintf('%s/h5/pagesub/diy-page/diy-page?id=%d&uid=%d', that.Config.SiteUrl, this.page_id, this.userInfo.user_id);
			// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			// #ifdef APP-PLUS
			// #endif

			// #ifdef MP-WEIXIN
			$href = '/pagesub/diy-page/diy-page?id=' + this.page_id + '&uid=' + this.userInfo.user_id
			// #endif

			
			this.setData({
				shareData: {
					shareTitle: this.shareTitle,
					shareText: this.shareTitle,
					href: $href,
					image: this.shareImg
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
		}
	}
};
</script>
