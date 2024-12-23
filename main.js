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


Vue.prototype.setData = function(params) {
	for (let x in params) {
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