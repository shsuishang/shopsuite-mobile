<template>
	<view style="background-color: #e8e8e8;">
			<view  :class="{'m-product-list':1, 'm-listv':1}" >
				<navigator :url="'/pagesub/product/list?brand_id=' + (options.brand_id) + '&cname=' + (options.brand_name)" hover-class="uni-list-cell-hover">
					<view class="media-image-left ">
						<view class="media-title ">
							{{options.brand_name}}
						</view>
						<view class="image-section image-section-left">
							<image class="image-list" :src="options.brand_image"></image>
						</view>
					</view>
				</navigator>
				<block v-for="(item, i) in options.items" :key="i">
						<navigator :url="'/pagesub/product/detail?id=' + (item.item_id)" class="m-product-item" hover-class="uni-list-cell-hover">

							<view class="m-product-img product-list">
								<image lazy-load :src="(item.product_image)"  v-if="item.product_image" />
							</view>
							<view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;">
								<view class="m-product-name2">
									<label>{{item.product_name}}</label>
								</view>
								<view class="m-product-price1">
									<view class="money">
										<block v-if="item.product_unit_price">
											<label>{{__('￥')}}</label><label>{{item.product_unit_price}}</label>
										</block>

										<block v-if="item.product_unit_points">
											<label style="margin: 0rpx 10rpx;">+</label><label>{{number_format(item.product_unit_points)}}</label> <label>{{__('积分')}}</label>
										</block>

										<block v-if="item.product_unit_sp">
											<label style="margin: 0rpx 10rpx;">+</label><label>{{item.product_unit_sp}}</label> <label>{{__('众宝')}}</label>
										</block>
									</view>
									<view class="num" v-if="(item.SaleNum>0)">
										<text>{{__('已售')}} </text> <label style="color:#db384c">{{item.SaleNum}}</label>
									</view>
								</view>
							</view>
						</navigator>
				</block>
			</view>
	</view>
</template>

<script>
	export default {
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			close(e) {
				this.$emit('close');
			},
			bindClick() {
				this.$emit('click');
			}
		}
	}
</script>


<style lang="scss">
	@import "../../../styles/_variables";

	view {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}


	.m-product-list{
	    display: inline-block;
		position: relative;    overflow: visible;
	}


	.m-listv .m-product-item{
		width: 220rpx;
		margin:0;
		margin-top: 120rpx;
		padding-left: 6px;
		margin-left:1rpx;
		height: 356rpx;
		margin-bottom: 1rpx;
	}

	.m-listv{
		margin: 20rpx!important;
		margin-top: 120rpx!important;
		border-width: 1rpx;
		border-style: solid;
		border-color: #c8c7cc;
		padding: 0!important;

		background-color: #fff;
		min-height: 300rpx;
	}

	.m-listv .m-product-img {
		width: 200rpx;
		height: 200rpx;
		padding: 0;
	}


	.m-product-img {
		float: left;
		text-align: center;
		width: 200rpx;
		height: 200rpx;

		image {
			box-sizing: border-box;
			padding: 0rpx!important;
			
			
			width: 200rpx;
			height: 200rpx;
		}
	}

	.m-product-price1 {
		font-size: 32rpx;
		color: $default-skin-bg;
		line-height: 40rpx;

		label {
			font-size: 24rpx;
		}
	}

  	.m-product-name2 {
  		font-size: 28rpx;
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
  		width: 240rpx;
  		box-sizing: border-box;
  		padding: 0 20rpx;
  		overflow: hidden;
  		text-overflow: ellipsis;
  		display: -webkit-box;
  		-webkit-box-orient: vertical;
  	}

	.m-listv .m-product-info1{
		height: 200rpx;
		width: 100%;
	}

	/*全部商品 end*/
	.m-product-price1 {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.num {
		font-size: 24rpx;
		color: #717171;
		padding-right: 20rpx;
		/*margin-left:260rpx; */
	}

	.money{
		display: inline-block;
	}

	.media-image-left {
		flex-direction: row-reverse;
		position: absolute;
		z-index: 9999999;

		top: -50px;
	}

	.media-title {
		font-size: 32rpx;
		color: #555555;

		margin-top: 140rpx;
		margin-left: 20rpx;
		line-height: 40rpx;
		height: 40rpx;
		width: 440rpx;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis!important;
	}

	.image-section {
		flex-direction: row;
		justify-content: space-between;
		padding-left: 12rpx;
	}

	.image-section-right {
		margin-top: 0rpx;
		margin-left: 10rpx;
		width: 200rpx;
		height: 200rpx;
	}

	.image-section-left {
		margin-top: 0rpx;
		margin-right: 10rpx;
		width: 200rpx;
		height: 200rpx;
	}

	.image-list {
		width: 200rpx;
		height: 200rpx;
	}
</style>
