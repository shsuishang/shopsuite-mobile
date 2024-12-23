<template>
	<view>
		<view class="sign_conent_box">
			<view class="sign_conent">
				<view class="sign_conent_title">
					{{__('本月你已连续签到')}}
					<span class="sign_conent_title_span">{{ signDays || 0 }}</span>
          {{__('天')}}
				</view>
				<view class="sign_list_aligns">
					<scroll-view class="scroll-view_H" scroll-x="true">
						<view class="scroll_view_items" v-for="(item, index) in signs" :key="index">
							<!--  -->
							<view class="scroll_view_itemsv">
								<view class="scroll_view_item">
									<view class="scroll_view_item_img_box">
										<image src="https://static.shopsuite.cn/xcxfile/appicon/images/sign_bg.png" class="scroll_view_item_img"
											mode=""></image>
										<view class="scroll_view_item_top">{{ item.value_str }}</view>
										<!-- <view class="scroll_view_item_bottom">一张</view> -->
									</view>
									<view class="scroll_view_item_tips">{{__('签到')}}{{ item.days }}{{__('天')}}</view>
								</view>
								<view class="scroll_xian" v-show="index !== signs.length - 1"></view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="!isSign" class="sign_conent_btn" @click="cksigin">{{__('今日签到')}}</view>
				<view v-else class="is_sign_conent_btn">{{__('已签到')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			is_sign: {
			    type: Number,
			    default: 0
			},
			continue_sign_days: {
				type: Number,
				default: 0
			},
			sign_list: {
				type: Array,
				default: () => []
			}
		},
		watch: {
			is_sign: function(val, oldVal) {
				this.isSign = val
			},
			continue_sign_days: function(val) {
				this.signDays = val
			},
			sign_list: function(val) {
				this.signs = val
			}
		},
		data() {
			return {
				signDays :0,
				isSign :0,
				signs : [],
			};
		},
		methods: {
			cksigin() {
				this.$emit('click', '');
			}
		}
	};
</script>

<style lang="scss">
  @import "../../../styles/_variables";
	.sign_conent_box {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 50rpx;

		.sign_conent {
			width: 686rpx;
			background: white;
			border-radius: 20rpx;
			padding: 40rpx 32rpx;
			box-sizing: border-box;

			.sign_conent_title {
				width: 100%;
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;

				.sign_conent_title_span {
					color: $default-skin-bg !important;
				}
			}

			.sign_list_aligns {
				width: 100%;
				padding: 48rpx 0 64rpx 0;
				box-sizing: border-box;

				.scroll-view_H {
					width: 100%;
					display: flex;
					white-space: nowrap;

					.scroll_view_items {
						display: inline-block;
					}

					.scroll_view_itemsv {
						display: flex;
					}

					.scroll_view_item {
						.scroll_view_item_img_box {
							width: 108rpx;
							height: 108rpx;
							position: relative;

							.scroll_view_item_top {
								font-size: 20rpx;
								color: #bf8d46;
								font-weight: bold;
								position: absolute;
								top: 32rpx;
								width: 100%;
								text-align: center;
								z-index: 1;
							}

							.scroll_view_item_bottom {
								font-size: 12rpx;
								color: #ffe29d;
								position: absolute;
								bottom: 18rpx;
								left: 42rpx;
								z-index: 2;
							}
						}

						.scroll_view_item_tips {
							width: 108rpx;
							text-align: center;
							font-size: 26rpx;
							padding-top: 16rpx;
							color: #333333;
						}

						.scroll_view_item_img {
							width: 108rpx;
							height: 108rpx;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 0;
						}
					}

					.scroll_xian {
						width: 64rpx;
						height: 2rpx;
						background: #ffe4d9;
						margin-top: 52rpx;
					}
				}
			}

			.sign_conent_btn {
				width: 100%;
				border-radius: 45rpx;
				background: linear-gradient(270deg, #fcae3a 0%, #f15d25 100%);
				color: #ffffff;
				text-align: center;
				padding: 22rpx 0;
				font-size: 32rpx;
			}

			.is_sign_conent_btn {
				width: 100%;
				border-radius: 45rpx;
				background: $default-skin-bg-disabled;
				color: #ffffff;
				text-align: center;
				padding: 22rpx 0;
				font-size: 32rpx;
			}
		}
	}
</style>
