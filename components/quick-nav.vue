<template name="quick-nav">
	<view :class="[animation ? '' : 'zhezhaoceng']" >
		<movable-area class="movableArea">
			<movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
				<view class="u-top1"  v-if="isnav">
					<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_nav_c.png?a=1' class="quicknav" @click='nav'></image>
					<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_gotop.png' :class="[!isquicknav ?'hide':'quicknav']" @click="returnTop"></image>
				</view>
				<view v-else @click='outnav'>
					<view class="u-top1">
						<navigator :class="[animation ? 'navtext1' : 'navtext']" url='/pages/index/member' open-type='switchTab'><text>{{__('个人中心')}}</text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_usercenter.png' class='quicknav'></image>
						</navigator>
					
						<navigator :class="[animation ? 'navtext1' : 'navtext']" url='/member/member/favorites'><text>{{__('我的收藏')}}</text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_my_favor.png' class='quicknav'></image>
						</navigator>
						<!-- #ifndef H5 -->
						<view :class="[animation ? 'navtext1' : 'navtext']" @click='shareBox'><text>{{__('分享')}}</text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_share.png' class='quicknav'></image>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view :class="[animation ? 'navtext1' : 'navtext']" @click='shareBoxPoster'><text>{{__('生成海报')}}</text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_share.png' class='quicknav'></image>
						</view>
						<!-- #endif -->
						<navigator :class="[animation ? 'navtext1' : 'navtext']" url='/pages/index/index' open-type='switchTab'>
							<text>{{__('首页')}}</text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/gray/nav_home.png' class='quicknav'></image>
						</navigator>
						<view class='open-nav'><text></text>
							<image src='https://static.shopsuite.cn/xcxfile/appicon/nav/black/nav_icon_close.png' class='quicknav'></image>
						</view>
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		name: "quick-nav",
		props: {
			isquicknav: {
				type: Boolean,
				default: false
			},
			
		},
		data() {
			return {
				isnav: true,
				animation: true,
				initX: '690',
				initY: '1336',
			}
		},
		
		mounted() {
			let view = uni.createSelectorQuery().in(this).select(".movableArea");
			let that = this;
			
			view.fields({
			  size: true,
			  scrollOffset: true
			}, data => {
				if (data) {
					that.setData({
						initX: data.width,
						initY: data.height - 100,
					});
				}
			}).exec();
		},
		
		methods: {
			shareBox: function() {
				this.$emit('onShareBox', 3);
			},
      
			shareBoxPoster: function() {
				this.$emit('onShareBox', 3);
			},
			
			returnTop: function() {
				this.$emit('onReturnTop');
			},
			doNothing: function() {
			},
			nav: function() {
				this.setData({
					isnav: false,
					animation: false
				})
			},
			outnav: function() {
				var that = this;
				this.setData({
					animation: true
				});
				
				setTimeout(function() {
					that.setData({
						isnav: true
					})
				}, 250)
			}
		}
	}
</script>


<style lang="scss">
	@import "../styles/_variables.scss";

	/* 快捷导航 */
	.u-tap-btn {
		position: fixed;
		right: 20rpx;
		bottom: 100rpx;
		z-index: 999
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
		font-size: 36rpx;
	}

	.zhezhaoceng {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		animation: opacity 500ms;
		animation-fill-mode: forwards
	}

	@keyframes opacity {
		from {
			background: rgba(0, 0, 0, 0);
		}

		to {
			background: rgba(0, 0, 0, 0.4);
		}
	}

	@keyframes opacity1 {
		from {
			background: rgba(0, 0, 0, 0.4);
		}

		to {
			background: rgba(0, 0, 0, 0);
		}
	}

	.quicknav {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}


	@keyframes mymove1 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 420rpx;
			opacity: 1
		}
	}

	@keyframes mymove2 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 320rpx;
			opacity: 1
		}
	}

	@keyframes mymove3 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 220rpx;
			opacity: 1
		}
	}

	@keyframes mymove4 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 120rpx;
			opacity: 1
		}
	}

	@keyframes mymove5 {
		from {
			bottom: 420rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
		}
	}

	@keyframes mymove6 {
		from {
			bottom: 320rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	@keyframes mymove7 {
		from {
			bottom: 220rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	@keyframes mymove8 {
		from {
			bottom: 120rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	.navtext text {
		font-size: 24rpx;
		color: #fff;
		text-align: right;
		min-width: 120rpx;
		margin-right: 20rpx
	}

	.navtext1 text {
		font-size: 24rpx;
		color: #fff;
		text-align: right;
		min-width: 120rpx;
		margin-right: 20rpx
	}

	.u-tuan-label {
		padding: 5rpx 8rpx;
		background-color: #DB384C;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #fff;
		margin-right: 8rpx;
	}

	.m-product-name2 {
		font-size: 24rpx;
		box-sizing: border-box;
		padding-right: 20rpx;
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.m-listv .m-product-name2 {
		width: 345rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
</style>