<template name="shoptheme5">
	<view></view>
</template>

<script>

	import $ from "../../helpers/util";

	export default {
		name: "shoptheme5",
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
