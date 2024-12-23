<template name="shoptheme4">
	<view class="m-supermarket-ad ">
		<view v-if="(commonTPL.AdContent.F1ProductContents.length>0)">
			<view class="m-product-list m-listv">
				<navigator v-for="(item, i) in commonTPL.AdContent.F1ProductContents"  :key="i" :url="'/pagesub/product/detail?is_store_flag=' + (commonTPL.isStoreFlag) + '&pid=' + (item.ProductContentID)"
				 class="m-product-item">
					<view class="m-product-img">
						<image :src="(item.ImagePath)" mode="aspectFill" />
					</view>
					<view class="m-product-info">
						<view class="m-product-name">
							<label>{{item.ProductName}}</label>
						</view>
						<view class="m-product-price">

									<block v-if="item.Price">
										<label>{{__('￥')}}</label>{{item.Price}}
									</block>

									<block v-if="item.product_unit_points">
										<label style="margin: 0rpx 10rpx;">+</label><label style="font-size:32rpx">{{number_format(item.product_unit_points)}}</label> <label>{{__('积分')}}</label>
									</block>

									<block v-if="item.product_unit_sp">
										<label style="margin: 0rpx 10rpx;">+</label><label style="font-size:32rpx">{{item.product_unit_sp}}</label> <label>{{__('众宝')}}</label>
									</block>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle">
				<label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('暂时没有商品哦')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

	import $ from "../../helpers/util";

	export default {
		name: "shoptheme4",
		props: {
			commonTPL: {
				type: Object,
				default () {
					return {
						isStoreFlag: 1,
						ProductInfo: {},
						addCar: false,
						count: 0,
						windowHeight: 0,
						categoryname: "",
						click6: true,
						cid: 0,
						cartlist: {},
						isdata: false,
						select_cart_ids: [],
						tapindex: 1,
						viewtype: 0,
						shopInfo: {},
						pdlist: [],
						sort: 2,
						ispage: true,
						flag: true,
						distance: 0,
						istop: false,
						TemplateKey: "",
						smallCategory: {},
						AdContent: {},
						post: {
							store_id: 0,
							orderby: 1,
							sort: 2,
							isnew: false,
							curpage: 1
						},
						formdate: "",
						pageId: 0
					}
				},
			},
		},
		data() {
			return {}
		},
		created: function() {},
		methods: {}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	@import '../../styles/layout.scss';
	@import '../../styles/store_themes.scss';
	@import '../../styles/store_tpl.scss';
</style>
