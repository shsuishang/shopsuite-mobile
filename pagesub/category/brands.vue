<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
			 :id="'tab_' + tab.id" :data-current="index" @click="tapTab">{{tab.brand_name}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab,index1) in newsitems" :key="index1">
				<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
					<block v-for="(newsitem, index2) in tab.items" :key="index2">
						<brand-product :options="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></brand-product>
					</block>
					<view class="uni-tab-bar-loading">
						{{tab.loadingText || __('加载中....')}}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>

	import brandProduct from './tab-nvue/brandproduct.vue';

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			brandProduct
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: [],
				tabBars: [{
					name: '关注',
					id: 'guanzhu'
				}, {
					name: '推荐',
					id: 'tuijian'
				}, {
					name: '体育',
					id: 'tiyu'
				}, {
					name: '热点',
					id: 'redian'
				}, {
					name: '财经',
					id: 'caijing'
				}, {
					name: '娱乐',
					id: 'yule'
				}, {
					name: '军事',
					id: 'junshi'
				}, {
					name: '历史',
					id: 'lishi'
				}, {
					name: '本地',
					id: 'bendi'
				}]
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad() {
			uni.setNavigationBarTitle({
				title:this.__('推荐品牌')
			});
			var that = this;

			that.$.request({
				url: that.Config.URL.product.list_brands,
				loading: false,
				/* ajaxCache: {
					timeout: that.Config.CACHE_EXPIRE
				}, */
				success(data) {
					that.setData({
						tabBars: data
					})

					let ary = [];
					for (let i = 0, length = that.tabBars.length; i < length; i++) {
						ary.push({items:[]});
					}

					that.newsitems = ary;

					that.loadBrandsAndProduncts(0)
				}
			});
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/template/tabbar/detail/detail?title=' + e.title
				});
			},
			close(index1, index2) {
				uni.showModal({
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

				let brand_id = this.tabBars[this.tabIndex].brand_id;
				this.loadBrandsAndProduncts(brand_id, this.newsitems[e].page+1);
			},
			loadBrandsAndProduncts(brand_id, page) {
				var that = this;
				let params = {};
				params.brand_id = brand_id;
				params.page = page;

				that.$.request({
					url: that.Config.URL.product.list_brands_products,
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
				let index = e.target.current;
				if (this.newsitems[index].items.length === 0) {
					let brand_id = this.tabBars[index].brand_id;
					this.loadBrandsAndProduncts(brand_id, 1);
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
				let tabIndex = e.target.dataset.current;
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
	page{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	
	.uni-tab-bar {  
	  width: 100%;  
	  /* #ifdef H5 */  
	  height: calc(100vh - 88rpx - 100rpx);  
	  /* #endif */  
	  /* #ifdef APP-PLUS */  
	  height: 100vh;  
	  /* #endif */  
	  
	  height: 100vh;  
	}
	
	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}

</style>
