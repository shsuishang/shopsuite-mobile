<template>
	<view class="uni-tab-bar">

		<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft" style="background: #f8f8f8;border: 0;">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
				  :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
				  	<view class="pt20">{{tab.category_name}}</view>
				  	<view class="bg-main"></view>
			</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab, index1) in newsitems" :key="index1">
				<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)" v-if="0!=tabIndex">
					<view  :class="{'m-product-list':1, 'm-listv':1}" >
						<block v-for="(newsitem, index2) in tab.items" :key="index2">
							<product-list :options="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></product-list>
						</block>

						<view class="uni-tab-bar-loading">
							{{tab.loadingText || __('加载中....')}}
						</view>
					</view>
				</scroll-view>
				<diy :BgConfig="BgConfig"  :PageContent="PageContent" :pageId="pageId" :PageNav="PageNav" :loadPageFlag="loadPageFlag" v-else></diy>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>

	import diy from '../../components/themes/diy.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			diy
		},
		data() {
			return {

					options:{},
					pageId: '',
					loadPageFlag: false,
					PageContent: [],
					BgConfig: {BackgroundObj:{type:1, bgColor:'#ffffff' ,"pathColor":"#f8f8f8","path":""}},
					PageNav:{window:{"navigationBarBackgroundColor":"#ffffff","navigationBarTextStyle":"black","navigationBarTitleText":"","backgroundColor":"#f8f8f8","backgroundTextStyle":"dark"}},
					shareImg: "",
					shareTitle: "",
					refresh: true,

				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: [],
				tabBars: []
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});
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
			that.$.request({
				url: that.Config.URL.product.category,
				loading: false,
				/* ajaxCache: {
					timeout: that.Config.CACHE_EXPIRE
				}, */
				success(data) {
					let tmp = data.items;
					tmp.unshift({'id':0, category_name:'首页'});

					that.setData({
						tabBars: tmp
					})

					let ary = [];
					for (let i = 0, length = that.tabBars.length; i < length; i++) {
						ary.push({items:[]});
					}

					that.newsitems = ary;

						that.loadBrandsAndProduncts(that.tabIndex, 0, 1)
				}
			});


			that.initData(false);
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			//初始化数据，获取店铺分类
			initData: function(force_refresh) {
				var that = this;

				that.getDivModel(force_refresh)
			},

			//读取diy内容
			getDivModel: function(force_refresh) {
				var that = this,
					params = {page_type:'page_index'};

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
					}
				});
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
				this.loadBrandsAndProduncts(this.tabIndex, category_id, this.newsitems[e].page+1);
			},
			loadBrandsAndProduncts(index, category_id, page, force_refresh) {
				var that = this;
				let params = {};
				params.category_id = category_id;
				params.page = page;

				that.$.request({
					url: that.Config.URL.product.lists,
					loading: false,
					/* ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE
					}, */
					data: params,
					success(data) {
						if (data.page > 1)
						{
							let tmp = that.newsitems[that.tabIndex];
							tmp.items = tmp.items.concat(data.items)
							tmp.page = data.page;

							if (data.page >= data.total)
							{
								tmp.loadingText = that.__('没有更多了');
							}
							else
							{
								tmp.loadingText = that.__('加载中....');
							}

							//console.info(tmp);

							that.$set(that.newsitems, that.tabIndex, tmp);
						}
						else
						{

							if (data.page >= data.total)
							{
								data.loadingText = that.__('没有更多了');
							}
							else
							{
								data.loadingText = that.__('加载中....');
							}

							that.$set(that.newsitems, that.tabIndex, data);
						}
					}
				});
			},
			async changeTab(e) {
				let that  = this;
				let index = e.target.current;
				if (this.newsitems[index].items.length === 0) {
					let category_id = this.tabBars[index].category_id;
					this.loadBrandsAndProduncts(index, category_id, 1);
				}
                 if (this.tabIndex === index) {
                    return;
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
				if (this.newsitems[tabIndex].items.length === 0) {}
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			}
		}
	}
</script>

<style lang="scss">
	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}

</style>
