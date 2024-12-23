<template>
    <web-view :src="url"  :webview-styles="webviewStyles"></web-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

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

		setTimeout(function() {
			options.tn || that.$.setNavigationBarTitle({ title: options.tn });
		}, 400);

		if (options.tc && options.tb)
		{
			that.$.setNavigationBarColor({
				frontColor: options.tc == 'white' ? '#ffffff' : '#000000',
				backgroundColor: options.tb
			});
		}

		var id = that.$.getStorageSync('uid');
		var key = that.$.getStorageSync('ukey');
		
		var perm_data = {};

		//修正 opts 数据, 默认数据
		if (id && key) {
			perm_data = { perm_id: id, perm_key: key };
		}

		var url = decodeURIComponent(options.u);
		

		//console.info(url);
		if (url.indexOf('?') != -1) {
			url = that.$.sprintf('%s&uid=%s&ukey=%s&perm_key=%s', url, id, encodeURIComponent(key), encodeURIComponent(key));
		} else {
			url = that.$.sprintf('%s?uid=%s&ukey=%s&perm_key=%s', url, id, encodeURIComponent(key), encodeURIComponent(key));
		}
		this.setData({ url: url });
	},

	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo'])
	}
};
</script>
