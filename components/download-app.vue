<template>
	<view v-if="isH5" :class="{ 'uni-navbar--fixed': fixed}" :style="{ 'background-color': backgroundColor }">
		<view class="download-pannel" :style="{ color: color,backgroundColor: backgroundColor, display:'block'}">
			<view class="pannel-bg">
				<image style="width: 100%;height: 100rpx;"
					   src="http://static.shopsuite.cn/app/guider_bg.png">
			</view>
			<view class="download-close J_ping" @click="closeDownload"><image style="width: 32rpx;height: 32rpx;"
																							 src="http://static.shopsuite.cn/app/guider_close.png">
			</view>
			<view class="download-logo"><image
					:src="plantformInfo.logo">
			</view>
			<view class="download-txt">
					<span class="download-content">
						<em style="" class="content-up">{{__('打开')}}{{plantformInfo.site_name}}APP</em>
						<em style="" class="content-down">{{plantformInfo.promotion}}</em>
					</span>
			</view>
			<view class="download-action" @click="downloadApp"><span
					style="" class="font-large">{{__('立即打开')}}</span></view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	//import vcallapp from "../helpers/vcallapp";
	
	export default {
		name: "downloadApp",
		data() {
			return {
				isH5: false,
				
				callappInfo:{
					trackUrl:'baidu1.com',
					deeplinkurl:'baidu2.com',
					staturl:'baidu3.com',
					landurl:'baidu4.com',
				}
			}
		},
		props: {
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
			setTimeout(()=>{
				if (this.plantformInfo.donwload_app_enable)
				{
					// #ifdef H5
					this.isH5 = true;
					// #endif

					// #ifndef H5
					this.isH5 = false;
					// #endif
				}
			}, 200);
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum']),
		methods: {
			downloadApp: function() {
				window.location.href = this.cf.AppDownloadUrl;
				/* vcallapp(this.callappInfo); */
			},
			closeDownload: function() {
				this.isH5 = false;
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import "../styles/_variables.scss";

	.download-pannel {
		height: 100rpx;
		width: 100%;
		line-height: 100rpx;
		position: relative;
		font-size: 0;
		overflow: hidden;

		.pannel-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 4;

			image {
				width: 100%;
				height: 100%;
			}
		}

		view[class^="download-"] {
			position: relative;
			z-index: 5;
			float: left;
			overflow: hidden;
		}

		.download-close {
			width: 32rpx;
			height: 100rpx;
			line-height: 100rpx;
			display: inline-block;
			margin-left: 2.5%;

			image {
				width: 100%;
				height: auto;
			}
		}

		.download-logo {
			width: 70rpx;
			height: 100rpx;
			line-height: 100rpx;
			margin-left: 5%;
			margin-right: 2.5%;

			image {
				width: 70rpx;
				height: 70rpx;
			}
		}

		.download-txt {
			display: inline-block;
			width: 40%;
			height: 100%;
			line-height: 100rpx;
		}

		.font-large {
			font-size: 15px;
		}

		.download-action {
			display: inline-block;
			height: 100%;
			line-height: 100rpx;
			width: 31.88%;
			float: right !important;
			text-align: center;
			font-size: 13px;
			color: #fff;
		}

		.download-content {
			font-size: 12px;
			display: block;
			position: relative;

			.content-up {
				color: #fff;
				font-weight: 500;
				position: absolute;
				top: -9px;
			}

			.content-down {
				color: #999;
				position: absolute;
				top: 9px;
			}
		}

		em {
			font-style: normal;
		}

		view, image {
			vertical-align: middle;
		}
	}

	.download-noBg {
		background-color: #232326;

		.download-action {
			background-color: #cd2525;
		}

		.pannel-bg {
			display: none;
		}
	}

	.download-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
	}
</style>
