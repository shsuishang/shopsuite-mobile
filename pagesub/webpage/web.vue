<template>
	<view class="">
		<web-view :src="url" class="webview" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<style lang="scss">
@import '../../styles/_variables.scss';

.status_bar {
    height: var(--status-bar-height);
    width: 100%;
}
.top_view {
    height: var(--status-bar-height);
    width: 100%;
    position: fixed;
    top: 0;
}
</style>

<script>
import { mapState, mapMutations } from 'vuex';

var wv;//计划创建的webview

export default {
    data: function() {
        return {
			options: {},
            url: '',
            webviewStyles: {
                progress: {
                    color: '#FF3333'
                }
            }
        };
    },
    components: {
    },
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    onLoad: function(options) {
		uni.setNavigationBarTitle({
			title:this.__('')
		});

		let that = this;
		that.setData({ options: options });

		try {
			const res = uni.getSystemInfoSync();

			// #ifdef APP-PLUS
			/*
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({top:res.statusBarHeight, height:res.windowHeight-res.statusBarHeight})

				that.initData(options);

			}, 1000); //如果是页面初始化调用时，需要延时一下
			*/

		   that.initData(options);
			// #endif


			// #ifndef APP-PLUS
			that.initData(options);
			// #endif


		} catch (e) {
			// error
			that.initData(options);
		}
    },

    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		initData: function(options) {
			let that = this;

			/*
					 setTimeout(function() {
						that.$.setNavigationBarTitle({ title: options.tn });
					}, 400);

					that.$.setNavigationBarColor({
						frontColor: options.tc == 'white' ? '#ffffff' : '#000000',
						backgroundColor: options.tb
					});
			*/

			that.forceUserInfo(function(user) {
			    var id = that.$.getStorageSync('uid');
			    var key = that.$.getStorageSync('ukey');
			    var perm_data = {};

			    //修正 opts 数据, 默认数据
			    if (id && key) {
			        perm_data = { perm_id: id, perm_key: key };
			    }

			    var url = decodeURIComponent(options.u);

			    if (url.indexOf('?') != -1) {
			        url = that.$.sprintf('%s&uid=%s&ukey=%s', url, id, encodeURIComponent(key));
			    } else {
			        url = that.$.sprintf('%s?uid=%s&ukey=%s', url, id, encodeURIComponent(key));
			    }

			    that.setData({ url: url });
			});
		},
    }
};
</script>
