<template>
	<view class="page">
		<store-lists ref="storeLists" :isShowFilter="isShowFilter"></store-lists>
	</view>
</template>

<script>
	
	import storeLists from '@/components/store-lists.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				options: {},
				isShowFilter:true,
			}
		},
		components: {
			storeLists
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('店铺街')
            });

		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.$refs.storeLists.scrollbottom();
		}
	}
</script>



