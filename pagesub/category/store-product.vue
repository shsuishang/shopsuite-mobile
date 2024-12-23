<template>
	<view class="page">
		<status-bar></status-bar>
		<view class="m-category" v-if="isShow == false">
			<navigator url="/pagesub/search/search" class="u-search-box">
				<view class="u-search-cont">
					<icon type="search" size="14"></icon>
					<text>{{__('搜索商品')}}</text>
				</view>
			</navigator>
			<view v-if="Category.length > 0">
				<scroll-view class="m-category-l" scroll-y="true">
					<block v-for="(item, i) in Category" :key="i">
						<view
							:class="[
								'm-category-l-item',
								item.id == fid ? 'm-category-l-select' : ''
							]"
							:data-id="item.id"
							@click="ckCategoryitem"
						>
							{{ item.store_product_cat_name }}
						</view>
					</block>
					<view class="m-category-l-item"></view>
				</scroll-view>
				<scroll-view class="m-category-r" scroll-y="true">
					<view class="g-grids">
						<navigator
							v-for="(item, index) in CategoryTwo"
							hover-class="none"
							:key="index"
							:url="
								'/pagesub/product/list?store_category_id=' +
									item.id +
									'&cname=' +
									item.store_product_cat_name
							"
							class="g-grid"
						>
							<view class="g-grid-icon">
								<image
									class="m-cell-default-icon"
									:src="item.store_product_cat_image"
								/>
							</view>
							<p class="g-grid-label">{{ item.store_product_cat_name }}</p>
						</navigator>
					</view>
				</scroll-view>
			</view>
			<view v-else class="m-nullpage">
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('请尽快去商城后后台完善内容哦')}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="m-category" v-if="isShow">
			<navigator url="/pagesub/search/search" class="u-search-box">
				<view class="u-search-cont">
					<icon type="search" size="14"></icon>
					<text>{{__('搜索商品')}}</text>
				</view>
			</navigator>
			<scroll-view class="scroll" scroll-y="true" v-if="Info.length > 0">
				<block v-for="(items, index) in Info" :key="index">
					<view class="category" v-if="items.items && items.items.length > 0">
						<view class="title">
							-
							<label style="margin:0 10rpx">{{ items.store_product_cat_name }}</label>
							-
						</view>
						<view class="categoryTwo">
							<navigator
								:url="
									'/pagesub/product/detail?id=' +
										item.id +
										'&cname=' +
										item.store_product_cat_name
								"
								hover-class="none"
								class="c-product"
								v-for="(item, idx) in items.items"
								:key="idx"
							>
								<view class="c-product-img">
									<image :src="item.product_image" />
								</view>
								<p class="c-product-name g-grid-label">
									{{ item.product_name }}
								</p>
							</navigator>
						</view>
					</view>
				</block>
				<view style="height:100rpx"></view>
			</scroll-view>
			<view v-else class="m-nullpage">
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('请尽快去商城后后台完善内容哦')}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import statusBar from '../../components/status-bar.vue';
import { mapState, mapMutations } from 'vuex';

export default {
	data: function() {
		return { fid: 0, Category: [], CategoryTwo: [], Info: [], isShow: true, store_id:0 };
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
	components: {
		statusBar
	},
	onReady() {
		var that = this;

		var param = {
				store_id: that.Config.storeId,
				category: 'ShopCategory.ShowMode'
			};

		1 == 1
			? that.setData({ isShow: true })
			: that.setData({ isShow: false });

		if (this.isShow) {
			this.GetShopProductCategoryInfoTile();
		} else {
			this.GetCategoryList();
		}
	},

	onShow: function() {
		this.showCartNum();
	},

	methods: {
		...mapMutations([
			'login',
			'logout',
			'getPlantformInfo',
			'forceUserInfo',
			'getUserInfo',
			'showCartNum'
		]),
		ckCategoryitem: function(e) {
		var that = this;
			this.setData({
				store_id: that.Config.storeId,
				fid: e.currentTarget.dataset.id
			}),
				this.GetCategoryList();
		},

		//显示样式1
		GetCategoryList: function() {
			var that = this,
				param = {
					store_id: that.Config.storeId,
					store_product_cat_id: this.fid,
					recursive: 0
				};

			that.$.request({
				url: that.Config.URL.store.product_category,
				data: param,
				success: function(data, status, msg, code) {
					param.store_product_cat_id == 0
						? (that.setData({ Category: data.items }),
						  data.items.length > 0 &&
								(that.setData({ fid: data.items[0].store_product_cat_id }),
								that.GetCategoryList()))
						: that.setData({ CategoryTwo: data.items });
				}
			});
		},

		//显示样式2
		GetShopProductCategoryInfoTile: function() {
			var that = this,
				param = {
					store_id: that.Config.storeId,
					ttt: that.Config.storeId
				};

			that.$.request({
				url: that.Config.URL.store.product_category,
				data: param,
				success: function(data, status, msg, code) {
					data.items.length > 0 && that.setData({ Info: data.leaf });
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

page {
	position: fixed;
}
.m-category {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.m-category-l {
	width: 160rpx;
	height: 100%;
	position: absolute;
	left: 0;
	z-index: 2;
}
.m-category-l-item {
	font-size: 24rpx;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
	background-color: #fff;
	box-sizing: border-box;
	border-bottom: 1px solid #eee;
	border-right: 1px solid #eee;
	position: relative;
}
.m-category-l-item:last-child {
	background-color: #f8f8f8;
	border: none;
}
.m-category-l-select {
	background-color: #f8f8f8;
	border-right: none;
	color: $default-skin-bg;
}
.m-category-l-select::after {
	content: '';
	width: 6rpx;
	position: absolute;
	left: 0;
	top: 0;
	height: 104rpx;
	background-color: $default-skin-bg;
	margin-top: -2rpx;
}
.m-category-r {
	width: 590rpx;
	height: 100%;
	box-sizing: border-box;
	padding: 0 20rpx;
	position: absolute;
	left: 160rpx;
	padding-bottom: 120rpx;
}
.m-category-banner {
	width: 100%;
	height: 180rpx;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
}
.m-category-banner image {
	width: 100%;
	height: 100%;
}
.g-grids {
	margin: 20rpx 0;
}
.g-grids::after {
	border: none;
}
.g-grids::before {
	border: none;
}
.g-grid {
	padding: 20rpx 10rpx 10rpx 10rpx;
	background-color: #fff;
}
.g-grid::after {
	border-color: #f8f8f8;
}
.g-grid::before {
	border-color: #f8f8f8;
}
.g-grid-icon {
	width: 130rpx;
	height: 130rpx;
}
.g-grid-label {
	font-size: 24rpx;
	line-height: 50rpx;
	color: #888;
}

.u-search-box {
	background-color: #efeff4;
	padding: 20rpx;
}
.u-search-cont {
	width: 100%;
	background-color: #fff;
	border-radius: 4rpx;
	text-align: center;
	padding: 10rpx 0;
}
.u-search-box icon {
	display: inline-block;
	vertical-align: middle;
	margin-right: 10rpx;
	font-size: 28rpx;
}
.u-search-box text {
	font-size: 28rpx;
	color: #d5d5d5;
}
.category {
	background: #fff;
	margin-bottom: 20rpx;
}
.scroll {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	z-index: 2;
}
.title {
	width: 100%;
	text-align: center;
	padding: 60rpx 0;
}
.categoryTwo {
	width: 100%;
	overflow: hidden;
}
.c-product {
	width: 25%;
	height: 200rpx;
	/* display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column; */
	padding-bottom: 50rpx;
	float: left;
}
.c-product-img {
	text-align: center;
}
.c-product-img image {
	width: 140rpx;
	height: 140rpx;
}
.c-product-name {
	font-size: 24rpx;
	margin-top: 10rpx;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
