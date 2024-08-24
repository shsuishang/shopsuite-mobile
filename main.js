// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import './styles/zerocons.css'
import store from './store'

import Lang from './config/lang'
Vue.prototype.Lang = Lang

import Config from './config/config'
import Statecode from './config/statecode'
import $ from "./helpers/util";
import Socket from './helpers/useSocket.js';
import apiconfig from './helpers/apiconfig.js'

import analytics from './helpers/analytics'
Vue.prototype.$report = analytics.report;

import statusBar from './components/status-bar.vue'
import loading from '@/components/loading.vue'

// #ifdef H5
import $cookies from './helpers/vue-cookies';
// #endif

import './helpers/ican-H5Api'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$ = $
Vue.prototype.cf = Config
Vue.prototype.__ = Lang.__
Vue.prototype.sprintf = $.sprintf
Vue.prototype.number_format = $.number_format
Vue.prototype.mf = $.mf
Vue.prototype.statecode = Statecode
//Vue.prototype.$mysocket = mysocket;
Vue.prototype.$Socket = Socket;
Vue.prototype.$apiconfig = apiconfig;

Vue.prototype.resetLang = function() {
	if (Config.tabBar.list instanceof Array || true) {
		for (var r = 0; r < Config.tabBar.list.length; r++) {
			uni.setTabBarItem({
				index: r,
				text: Lang.__(Config.tabBar.list[r].text)
			})
		}
	}
}

Vue.prototype.setData = function(params) {
	for (let x in params) {
		if (x == 'options') {
			if (params[x].uid) {
				uni.setStorageSync('source_user_id', params[x].uid);

				if ($.source_data.source_type == this.statecode.SOURCE_TYPE_H5) {
					$cookies.set('fxid', params[x].uid);
				}
			}

			//单品存储, 下单时候本地存储判断是否有分享者，加入标记后存入数据库
			if (params[x].uid && params[x].pid) {
				//读取默认数据
				let fx_item_row = {}
				let fx_item_str = uni.getStorageSync('source_item_id');

				if (fx_item_str) {
					fx_item_row = JSON.parse(fx_item_str);
				}

				let time = parseInt(Date.parse(new Date()) / 100)

				let new_item = {}
				new_item[params[x].pid] = {
					u: params[x].uid,
					t: time
				};

				Object.assign(fx_item_row, new_item);
				uni.setStorageSync('source_item_id', JSON.stringify(fx_item_row));

				if ($.source_data.source_type == this.statecode.SOURCE_TYPE_H5) {
					//$cookies.set('fx_item_id', JSON.stringify(fx_item_row));
				}
			}

			if (params[x].sid) {
				uni.setStorageSync('source_store_id', params[x].sid);

				if ($.source_data.source_type == this.statecode.SOURCE_TYPE_H5) {
					$cookies.set('stid', params[x].sid);
				}
			}

			if (params[x].uid && params[x].ukey) {
				var id = $.setStorageSync('uid', params[x].uid);
				var key = $.setStorageSync('ukey', params[x].ukey);

				// #ifdef H5
				$cookies.set('uid', params[x].uid);
				$cookies.set('ukey', params[x].ukey);
				// #endif
			}

			if (params[x].source_ucc_code) {
				uni.setStorageSync('source_ucc_code', params[x].source_ucc_code);
			}

			if (params[x].aid) {
				uni.setStorageSync('activity_id', params[x].aid);

				if ($.source_data.source_type == this.statecode.SOURCE_TYPE_H5) {
					$cookies.set('activity_id', params[x].aid);
				}
			}
		}

		//this.$set(this, x, params[x]);
		this[x] = params[x];
	}

	//this.$forceUpdate();
}

Vue.component('status-bar', statusBar)
Vue.component('loading', loading)

App.mpType = 'app'

// #ifdef APP-PLUS
//重写toast方法如果内容为 ‘再按一次退出应用’ 就隐藏应用，其他正常toast
if (plus.os.name.toLowerCase() === 'android') {
	plus.nativeUI.toast = (function(str) {
		if (str == '再按一次退出应用') {
			uni.showToast({
				title: Lang.__('再按一次退出应用'),
				icon: 'none',
			})
			return false;
		} else {
			uni.showToast({
				title: str,
				icon: 'none',
			})
		}
	});
}
// #endif

import audio from './helpers/audio/index.js'
Vue.prototype.$audio = audio

Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})

const app = new Vue({
	store,
	...App
})

app.$mount()

// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import uView from '@/uni_modules/uview-ui';
Vue.use(uView);
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif