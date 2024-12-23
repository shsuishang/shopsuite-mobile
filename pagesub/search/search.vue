<template>
	<view class="page">
		<zy-search :is-focus="false" :theme="themeClass" :show-want="true" :speechEngine="speechEngine"
		:hot-list="hot_list" :search-his-list="search_his_list" :suggest-text="suggest_text"  @getSearchText="getSearchText"></zy-search>
	</view>
</template>

<script>
	import zySearch from '../components/zy-search/zy-search.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		components: {
			zySearch
		},
		data() {
			return {
				themeClass: 'circle',
				speechEngine: 'baidu', //语音识别引擎

				search_his_list: [],
				hot_list: [],
				suggest_text: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('搜索')
			});
		
			var that = this;
		
			that.$.request({
				url: this.Config.URL.search_hot_info,
				success: function(data, status, msg, code) {
					that.setData({
						hot_list: data.search_hot_words,
						search_his_list: data.search_history_words,
						suggest_text: data.suggest_search_words.default_search_words
					});
				}
			});
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getSearchText(e) {
				var that = this;
				that.$.isNull(e) ? that.$.confirm("请输入您要搜索的关键词!") : that.$.golevelToTabBar(that, "../../" + that.route,
					"/pagesub/product/list?pname=" + e)
			}
		},
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";
	
	.page{
		background-color: #fff;
		padding: 30rpx;
	}
</style>
