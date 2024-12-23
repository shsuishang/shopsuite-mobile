<template>
	<view class="nav-head-box">
		<!-- 分享更多 -->
		<view class="share-more">
			<view class="mroe-list" v-if="showBoxView">
				<navigator class="list"  v-for="(item, index) in menu" :key="index"  :url="item.url" :open-type="item.type">
					<view class="icon">
						<text :class="['zc', item.icon]"></text>
					</view>
					<view class="title">
						<text>{{item.name}}</text>
					</view>
				</navigator>
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
		name: "headerNavMenu",
		data() {
			return {
				showBoxView:false
			}
		},
		props: {
			menu: {
				type: Array,
				default: []
			},
			fixed: {
				type: [Boolean, String],
				default: false
			},
			color: {
				type: String,
				default: "#000000"
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			}
		},
		created() {
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum']),
		methods: {

		}
	}
</script>


<style lang="scss" scoped>
	@import "../styles/_variables.scss";


	.nav-head-box{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		background:rgba(255,255,255,0);
		/* #ifdef APP-PLUS */
		height: calc(100rpx + var(--status-bar-height));
		/* #endif */
		/* #ifdef MP */
		height: 200rpx;
		/* #endif */
		.back{
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100rpx;
			height: 100%;
			/* #ifdef APP-PLUS */
			padding-top: 50rpx;
			/* #endif */
			/* #ifdef MP */
			padding-top: 100rpx;
			/* #endif */
			// 返回
			.back-one{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 50rpx;
				height: 50rpx;
				background-color: rgba(0,0,0,0.3);
				border-radius: 100%;
				text{
					display: flex;
					width: 20rpx;
					height: 20rpx;
					border-left: 2rpx solid #FFFFFF;
					border-bottom: 2rpx solid #FFFFFF;
					transform: rotate(45deg);
				}
			}
			.action{
				background-color: transparent;
				text{
					border-color: #555555;
				}
			}
		}
		// tab切换
		.head-tab{
			display: flex;
			align-items: center;
			height: 100%;
			/* #ifdef APP-PLUS */
			padding-top: 50rpx;
			/* #endif */
			/* #ifdef MP */
			padding-top: 100rpx;
			/* #endif */
			.tab{
				position: relative;
				margin: 0 20rpx;
				padding: 0 10rpx;
				text{
					color: #555555;
					font-size: 26rpx;
				}
			}
			.action{
				text{
					color: #212121;
					font-size: 28rpx;
				}
				.line{
					position: absolute;
					left: 0;
					bottom: -10rpx;
					width: 100%;
					height: 6rpx;
					background: linear-gradient(to right, #fe3b0f, rgba(255,255,255,0.3));
				}
			}
		}
		// 分享更多
		.share-more{
			position: absolute;
			right: 0;
			top: 0;

			/* #ifdef APP-PLUS */
			padding-top: 50rpx;
			/* #endif */
			/* #ifdef MP */
			padding-top: 100rpx;
			/* #endif */
			.share-more-one{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 20rpx;
				height: 100%;
				.list{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 50rpx;
					height: 50rpx;
					background-color: rgba(0,0,0,0.3);
					border-radius: 100%;
					text{
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
			}
			.action{
				.list{
					background-color: transparent;
					text{
						color: #555555;
					}
				}
			}
			.mroe-list{
				position: fixed;
				right: 20rpx;
				top: 100rpx;
				/* #ifdef MP */
				top: 180rpx;
				/* #endif */
				width: 200rpx;
				background-color: rgba(0,0,0,0.6);
				color: #fff;
				border-radius: 10rpx;
				.list{
					display: flex;
					align-items: center;
					width: 90%;
					height: 80rpx;
					margin: 0 auto;
					border-bottom: 2rpx solid #C8C7CC;
					padding: 0 4%;
					.icon{
						display: flex;
						align-items: center;
						width: 60rpx;
						text{
							font-size: 34rpx;
						}
					}
					.title{
						display: flex;
						align-items: center;
						text{
							font-size: 26rpx;
						}
					}
				}
			}
		}
		
		[class^="zc-"]:before, [class*=" zc-"]:before{
			font-size: 18px;
		}
	}
</style>