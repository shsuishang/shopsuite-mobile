<template>
	<view class="page">
		<scroll-view scroll-y="true" v-if="(Info.length>0)" @scrolltolower="scrollbottom" :style="'width:100%;height:' + (windowHeight) + 'px'">
			<view class="uni-list1">
				<navigator :url="'/pagesub/article/detail?id=' + (items.article_id)" v-for="(items, index) in Info"
				  :key="index">
					<view class="banner" v-if="index == 0">
						<image class="banner-img" :src="Info[0].article_image"></image>
						<view class="banner-title">{{Info[0].article_title}}</view>
					</view>
					<view class="uni-list-cell " hover-class="uni-list-cell-hover" v-else>
						<view class="uni-media-list">
							<image class="uni-media-list-logo" :src="items.article_image"></image>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{items.article_title}}</view>
								<view class="uni-media-list-text-bottom">
									<text class="m-badge">{{items.category_name}}</text>
									<text>{{items.article_add_time}}</text>
								</view>
							</view>
						</view>
					</view>
				</navigator>
			</view>
			<view class="m-loading-box">
				<block v-if="(ispage)">
					<view class="u-loadmore">
						<label class="u-loading"></label>
						<text class="u-loadmore-tips">{{__('正在加载')}}</text>
					</view>
				</block>
				<block v-else>
					<view class="u-loadmore u-loadmore-line">
						<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
					</view>
				</block>
			</view>
		</scroll-view>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				isdata: false,
				page: 1,
				rows: 10,
				ispage: false,
				flag: true,
				Info: [],
				windowHeight: 0,
				categoryId: 0,
				Title: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('资讯分类')
			});

			let that = this;
			this.setData({
				categoryId: options.category_id || options.cid
			});
			try {
				var t = that.$.getSystemInfoSync();
				this.setData({
					windowHeight: t.windowHeight
				})
			} catch (n) {
				console.log(" Do something when catch error")
			}

			this.getArticleList();

			// this.getArticleCategory();

		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getArticleCategory: function() {
				var that = this;
				if (this.categoryId) {
					var params = {
						category_id: this.categoryId || 0
					};


					that.$.request({
						url: this.Config.URL.cms.category,
						data: params,
						dataType: 'json',
						ajaxCache: {
							timeout: this.Config.CACHE_EXPIRE
						},
						success: function(data, status, msg, code) {
							that.setData({
								Title: data.items[0]
							});

							that.$.setNavigationBarTitle({
								title: that.Title.category_name || "企业资讯"
							})
						}
					});
				} else {
					that.$.setNavigationBarTitle({
						title: "企业资讯"
					})
				}
			},

			getArticleList: function() {
				var params = {
					// 暂时放平台咨询
					//store_id: this.shopInfo.store_id,
					page: this.page,
					rows: 10,
					sidx: 'article_id',
					sord: 'DESC',
					category_id: this.categoryId || 0
				};

				var that = this;
				that.$.request({
					url: this.Config.URL.cms.lists,
					data: params,
					dataType: 'json',
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								isdata: true
							});
							if (data.page >= data.total) {
								that.setData({
									flag: false,
									ispage: false,
									Info: that.Info.concat(data.items)
								})
							} else {
								that.setData({
									flag: true,
									ispage: true,
									Info: that.Info.concat(data.items)
								})
							}

						} else {
							that.setData({
								flag: false,
								ispage: false
							});
						}
					}
				});
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: false
					});
					clearTimeout(t);
					var t = setTimeout(function() {
						e.setData({
							page: e.page + 1,
							flag: false
						}), e.getArticleList();
					}, 500)
				}
			}
		}

	}
</script>



<style lang="scss">
    /*
	@import "../../styles/_variables";

	.m-activity-item {
		width: 100%;
		height: 240rpx;
		margin-bottom: 10rpx;
		background: white;
	}

	.m-activity-img {
		padding: 20rpx;
		width: 260rpx;
		height: 200rpx;
		float: left;
	}

	.m-activity-info {
		width: 450rpx;
		height: 100%;
		float: left;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		justify-content: space-between
	}

	.m-activity-name {
		font-size: 16px;
		margin-bottom: 40rpx;
		margin-top: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.gray {
		font-size: 35rpx;
		display: inline-block;
		color: #888;
	}

	.m-activity-time {
		margin-left: 10rpx;
		margin-right: 30rpx;
		font-size: 26rpx;
		color: #888;
	}

    */


	.banner {
		height: 360rpx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		width: 180rpx;
		height: 140rpx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74rpx;
		font-size: 28rpx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.m-badge {
		border: 2rpx solid #FFFFFF;
		background-color: #ffc0cb;
		color: #bb0000;
		padding:6rpx 12rpx;
		border-radius:12rpx;
		font-size:20rpx;
		opacity:0.5;

	}
</style>
