<template name="shoptheme3">
	<view class="m-food-adlist">
		<view v-if="(commonTPL.AdContent.F1ProductContents.length>0)">
			<navigator v-for="(item, i) in commonTPL.AdContent.F1ProductContents"  :key="i" :url="'/pagesub/product/detail?is_store_flag=' + (commonTPL.isStoreFlag) + '&pid=' + (item.ProductContentID)" class="m-food-aditem">
				<image class="m-food-ad-img" mode="aspectFill" :src="(item.ImagePath)" />
				<view class="m-food-info">
					<view class="m-food-info-price">
						{{__('￥')}}
						<label>{{item.Price}}</label>
					</view>
					<view class="m-food-info-name">
						{{item.ProductName}}
					</view>
				</view>
				<view class="m-food-ad-icon">
					<image src="/static/images/cart_select.png" />
				</view>
			</navigator>
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
		name: "shoptheme3",
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
                        post: {store_id: 0, orderby: 1, sort: 2, isnew: false, curpage: 1},
                        formdate: "",
                        pageId: 0
                    }
				},
			},
		},
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	@import '../../styles/layout.scss';
	@import '../../styles/store_themes.scss';
	@import '../../styles/store_tpl.scss';
</style>
