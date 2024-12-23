<template>
	<view class="page" v-if="loadPageFlag" :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor))}">
		<status-bar :backgroundColor="BgConfig.BackgroundObj.bgColor"></status-bar>

		<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag"></diy>

		<guess-you-like ref="guessYouLike" :options="options"></guess-you-like>
	</view>
</template>


<style lang="scss">
	@import "../../styles/_variables.scss";

	@import '../../styles/layout.scss';

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
</style>

<script>
	import statusBar from '../../components/status-bar.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'

	import diy from '../../components/themes/diy.vue'
	import guessYouLike from '@/components/product-list.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		/**
		 * 页面的初始数据
		 */
		data: function() {
			return {
				options:{},
				pageId: '',
				loadPageFlag: false,
				PageContent: [],
				BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
				PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
				shareImg: "",
				shareTitle: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			diy,
			statusBar,
			uniNavBar,
			guessYouLike
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;

			if (options.scene) {
				var scene = decodeURIComponent(options.scene);
				var opts = {};

				opts = that.$.parse_str(scene);

				options = Object.assign(options, opts);
			}

			that.setData({
				options: options
			})

			that.initData(false);
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
			this.$refs.guessYouLike.scrollbottom();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImg,
				path: this.sprintf("/pagesub/product/tag?tag_id=%s&uid=%s", this.options.tag_id, this.userInfo.user_id)
			}
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
					params = {};

					let site_id = that.$.getStorageSync('site_id');

					if (site_id)
					{
						params['site_id'] = site_id;
					}


				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE,
                        forceRefresh: force_refresh
					},
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh()
						that.setData({
							loadPageFlag: true
						});

						that.setData({
							pageId: data.page_id,
							PageContent: that.$.parseJSON(data.page_code),
							BgConfig: that.$.parseJSON(data.page_config),
                            PageNav: that.$.parseJSON(data.page_nav),
							shareImg: data.page_share_image,
							shareTitle: data.page_share_title
						});

                       // #ifndef APP-PLUS
                        that.$.setNavigationBarColor({
                        	frontColor: that.PageNav.window.navigationBarTextStyle == 'white'
                        			? '#ffffff'
                        			: '#000000',
                        	backgroundColor: that.PageNav.window.navigationBarBackgroundColor
                        });
                       // #endif

						if (data.page_name)
						{
							that.$.setNavigationBarTitle({
								title: data.page_name
							});
						}

						//
						let $title = data.page_name;
						let $desc = '';
						let $link =  that.$.sprintf("%s/h5/pagesub/product/tag?tag_id=%s&uid=%s", that.Config.SiteUrl, that.options.tag_id, that.userInfo.user_id);
						let $img_url = that.shareImg;

						//初始化微信分享
						that.$.wxShare($title, $desc, $link, $img_url)
					}
				});
			},

			//初始化数据
			initData: function(force_refresh) {
				var that = this;
				var param = {};

				that.getDivModel(force_refresh)
			},

			search() {
				uni.showToast({
					title: '搜索'
				})
			},
			onSearch(e) {
				let that = this;
				that.$.gopage("/pagesub/search/search");
			}
		}
	}
</script>
