<script>
	import Vue from 'vue'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import Lang from './config/lang'

	export default {
		data() {
			return {
				options: {}
			}
		},
		computed: mapState([
			'Config',
			'StateCode',
			'notice',
			'plantformInfo',
			'shopInfo',
			'userInfo',
			'hasLogin',
			'forcedLoginState'
		]),
		onLaunch: async function(req) {
			let that = this;

			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.statusBar = e.statusBarHeight

					// #ifndef MP
					if (e.platform == 'android') {
						Vue.prototype.customBar = e.statusBarHeight + 50
					} else {
						Vue.prototype.customBar = e.statusBarHeight + 45
					}
					// #endif

					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()

					Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif

					// #ifdef MP-ALIPAY
					Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight
					// #endif
				}
			})

			try {
				if (uni.getStorageSync('selang')) {

				} else {
					const res = uni.getSystemInfoSync();

					//如果不在允许的语言内，可重置
					uni.setStorageSync('selang', res.language);
				}
			} catch (e) {
				// error
			}

			this.__('首页');
			this.__('分类');
			this.__('发现');
			this.__('购物车');
			this.__('我的');

			console.info(11)
			await that.reloadLang();
			console.info(21)
			that.resetLang();

			await this.$store.dispatch(`getUserInfo`, function(userInfo) {
				//that.$isResolve()
			})

			await this.$store.dispatch(`getSysInfo`, function(plantformInfo) {
				that.$isResolve()
			})

			if (this.hasLogin) {
				await this.$store.dispatch(`getCartList`, function(cartList) {})

				this.checkNewMsg();

				var a = setInterval(() => {
					this.checkNewMsg();
				}, 1e3 * 60);
			}
		},
		onShow: function() {
			console.log('App Show')
			let that = this;

			setTimeout(() => {
				this.getPlantformInfo(function(plantformInfo) {
					if (that.hasLogin && that.userInfo.im && that.plantformInfo.chat_global) {
						that.$Socket.connectserver(that.userInfo.im);
					}
				});
			}, 300);
		},
		onHide: function() {},

		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum', 'reloadUserResource', 'setMsgNum']),
			reloadLang: async function(e) {
				var that = this;
				await that.$.request({
					url: this.Config.URL.listTranslateLang,
					data: {},
					loading: false,
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						data = data || {}
						console.info(20)
						const opt = data.opt || {};
						that.Lang.data = opt;

						const lang = data.lang || {};
						for (var key in lang) {
							let tmp_lang = key.replace('_', '-');

							that.Lang.G[tmp_lang] = Object.assign(that.Lang.G[tmp_lang] || {}, lang[key])
						}

						that.resetLang();
					}
				});
			},
			checkNewMsg: function() {
				if (this.hasLogin) {} else {
					return;
				}

				let pages = getCurrentPages();
				let curPage = pages[pages.length - 1];

				if (curPage) {
					console.info(curPage.route);
					if ('pagesub/webpage/web' == curPage.route) {
						return;
					}

					if (this.$.inArray(['pagesub/webpage/web', 'pagesub/uLive/subnvue/live', 'pagesub/uLive/subnvue/push'], curPage.route)) {
						return;
					}
				}

				// 统计一下未读的消息
				var that = this;
				var params = {
					recently_flag: true
				};
				//领取操作
				that.$.request({
					url: that.Config.URL.user.msg_count,
					loading: false,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setMsgNum(data.num);
							if (data.num > 0) {
								if ((!data.msg_row) || (data.msg_row && 1 == data.msg_row.message_type)) {
									/*
									uni.showModal({
										title: '提示',
										content: '您有系统消息未读',
										success: function (res) {
											if (res.confirm) {
												that.$.gopage('/member/member/message')

												console.log('用户点击确定');
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
									*/
								} else {
									uni.showModal({
										title: that.$.sprintf('%s', data.msg_row.user_other_nickname),
										content: that.$.sprintf('发来消息， 是否接入聊天？'),
										success: function(res) {
											if (res.confirm) {
												//设置所有当前用户消息为已读
												if (data.msg_row.user_other_id) {
													//领取操作
													let tmp_params = {
														user_other_id: data.msg_row.user_other_id
													}
													that.$.request({
														method: "POST",
														url: that.Config.URL.user.msg_set_read,
														data: tmp_params,
														success: function(tmp_data, tmp_status, tmp_msg, tmp_code) {
															if (tmp_status == 200) {
																var perm_id = that.$.getStorageSync('uid');
																var perm_key = that.$.getStorageSync('ukey');
																var name = data.msg_row.user_other_nickname;
																var user_other_id = data.msg_row.user_other_id;

																var appurl = that.$.sprintf(
																	"/im/chat/chat?uid=%s", user_other_id)
																that.$.gopage(appurl);
															}
														}
													})
												}

											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});

								}
							}
						} else {
							that.setMsgNum(0);
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./styles/_variables.scss";

	/*@include base(350);*/
	@import "./styles/animate.min.css";

	@import "./styles/iconfont.css";
	@import "./styles/zerocons.css";

	@import "./styles/colorui/icon.css";

	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './styles/uni.css';


	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	/* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: $body-bg !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.m-cells::after {
		border: none !important;
	}


	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}

	/* #endif */
	/* #endif*/

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

	.m-RichText {
		box-sizing: border-box;
		clear: both;
		width: 100%;
		overflow: hidden;
		word-break: break-word;

		img {
			max-width: 100% !important;
		}

		rich-text {
			max-width: 100% !important;
		}
	}

	/*页面重置样式 start*/
	page {
		background-color: $body-bg;
		font-family: PingFangSC-Regular, PingFang SC, -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
		height: 100%;
		font-size: 28rpx;
		line-height: 1.8;
	}

	.page-container {
		padding: 20rpx;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/*页面重置样式 start*/
	/*buttom start*/


	.u-btn {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding: 0 28rpx;
		box-sizing: border-box;
		font-size: 16px;
		text-align: center;
		line-height: 2.55555556;
	}

	.default-color {
		color: $default-skin-bg;
	}

	.main-color {
		color: $main-skin-color;
	}

	.u-btn-default {
		background-color: $default-skin-bg;
		color: #fff;
		margin: 20rpx 20rpx;
		border-radius: 10rpx;
	}

	.u-btn-secondary {
		background-color: #fff;
		color: $default-skin-bg;
		border: 2rpx solid $default-skin-bg;
		margin: 20rpx 20rpx;
		border-radius: 10rpx;
	}


	.btn-gray {
		background: #b0b0b0;
		border-color: #b0b0b0;
		color: #fff;

		&:hover {
			background-color: #757575;
			border-color: #757575;
			color: #fff;
		}
	}

	.btn-primary {
		background: $default-skin-bg;
		border-color: $default-skin-bg;
		color: #fff;

		&:hover {
			background-color: #f25807;
			border-color: #f25807;
			color: #fff;
		}
	}

	.btn-green {
		background: #83c44e;
		border-color: #83c44e;
		color: #fff;

		&:hover {
			background-color: #71b639;
			border-color: #71b639;
			color: #fff;
		}
	}

	.btn-orange {
		background: #ffac13;
		border-color: #ffac13;
		color: #fff;

		&:hover {
			background-color: #ff920f;
			border-color: #ff920f;
			color: #fff;
		}
	}

	.btn-gold {
		background: #ffd600;
		border-color: #ffd600;
		color: #fff;

		&:hover {
			background-color: #fec517;
			border-color: #fec517;
			color: #fff;
		}
	}

	.btn-ocean {
		background: #2196f3;
		border-color: #2196f3;
		color: #fff;

		&:hover {
			background-color: #0c80dc;
			border-color: #0c80dc;
			color: #fff;
		}
	}

	.btn-blue {
		background: #545ad0;
		border-color: #545ad0;
		color: #fff;

		&:hover {
			background-color: #494fc5;
			border-color: #494fc5;
			color: #fff;
		}
	}

	.btn-red {
		background: #e53935;
		border-color: #e53935;
		color: #fff;

		&:hover {
			background-color: #e42a27;
			border-color: #e42a27;
			color: #fff;
		}
	}

	.btn-purple {
		background: #a31daf;
		border-color: #a31daf;
		color: #fff;

		&:hover {
			background-color: #9715a2;
			border-color: #9715a2;
			color: #fff;
		}
	}

	.btn-pink {
		background: #f93e7a;
		border-color: #f93e7a;
		color: #fff;

		&:hover {
			background-color: #e9306c;
			border-color: #e9306c;
			color: #fff;
		}
	}

	.btn-cyan {
		background: #00c0a5;
		border-color: #00c0a5;
		color: #fff;

		&:hover {
			background-color: #03b3ad;
			border-color: #03b3ad;
			color: #fff;
		}
	}

	.btn-line-gray {
		border-color: #b0b0b0;
		background: #fff;
		color: #757575;

		&:hover {
			color: #fff;
			background-color: #757575;
			border-color: #757575;
		}
	}

	.btn-line-primary {
		border-color: $btn-primary-border;
		background: #fff;
		color: $btn-primary-bg;

		border: 2rpx solid $btn-primary-border;
		margin: 20rpx 40rpx;
		border-radius: 8rpx;

		&:hover {
			/*    color: #fff;
    background-color: darken($btn-primary-bg, 10%);
    border-color:  darken($btn-primary-border, 12%);*/
		}
	}

	.btn-line-green {
		border-color: #83c44e;
		background: #fff;
		color: #83c44e;

		&:hover {
			color: #fff;
			background-color: #71b639;
			border-color: #71b639;
		}
	}

	.btn-line-orange {
		border-color: #ffac13;
		background: #fff;
		color: #ffac13;

		&:hover {
			color: #fff;
			background-color: #ff920f;
			border-color: #ff920f;
		}
	}

	.btn-line-gold {
		border-color: #ffd600;
		background: #fff;
		color: #ffd600;

		&:hover {
			color: #fff;
			background-color: #fec517;
			border-color: #fec517;
		}
	}

	.btn-line-ocean {
		border-color: #2196f3;
		background: #fff;
		color: #2196f3;

		&:hover {
			color: #fff;
			background-color: #0c80dc;
			border-color: #0c80dc;
		}
	}

	.btn-line-blue {
		border-color: #545ad0;
		background: #fff;
		color: #545ad0;

		&:hover {
			color: #fff;
			background-color: #494fc5;
			border-color: #494fc5;
		}
	}

	.btn-line-red {
		border-color: #e53935;
		background: #fff;
		color: #e53935;

		&:hover {
			color: #fff;
			background-color: #e42a27;
			border-color: #e42a27;
		}
	}

	.btn-line-purple {
		border-color: #a31daf;
		background: #fff;
		color: #a31daf;

		&:hover {
			color: #fff;
			background-color: #9715a2;
			border-color: #9715a2;
		}
	}

	.btn-line-pink {
		border-color: #f93e7a;
		background: #fff;
		color: #f93e7a;

		&:hover {
			color: #fff;
			background-color: #e9306c;
			border-color: #e9306c;
		}
	}

	.btn-line-cyan {
		border-color: #00c0a5;
		background: #fff;
		color: #00c0a5;

		&:hover {
			color: #fff;
			background-color: #03b3ad;
			border-color: #03b3ad;
		}
	}

	.u-btn-default:active {
		background-color: $default-skin-bg-active;
	}

	.u-btn-disabled {
		background-color: $default-skin-bg-disabled;
		color: $default-skin-text-color-disabled;
		margin: 20rpx 40rpx;
		border-radius: 8rpx;
	}

	.u-link-btn {
		display: inline-block;
		padding: 10rpx;
		border: 1px solid $default-skin-bg;
		font-size: 28rpx;
		color: $default-skin-bg;
		border-radius: 12rpx;
	}

	/*
form button {
  background-color: #fff;
}
*/

	/*buttom end*/
	/*单选列表样式 start*/

	.m-check-label {
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}

	.m-check {
		position: absolute;
		left: -9999em;
	}

	.m-icon-checked {
		display: inline-block;
		vertical-align: middle;
		font: normal normal normal 14px/1 "weui";
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
	}

	.m-check-label {
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

		&:active {
			background-color: #ECECEC;
		}
	}

	.m-cells-checkbox .m-cell-hd {
		padding-right: 12rpx;
	}

	/*单选列表样式 end*/
	/*列表布局 start*/

	.m-cells-title {
		color: #888;
		font-size: 14px;
		margin-top: 20rpx;
		margin-bottom: 8rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.m-cells {
		background-color: #FFFFFF;
		line-height: 1.41176471;
		font-size: 17px;
		overflow: hidden;
		position: relative;

		border-radius: 12rpx;
		/*
		&::before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
		*/

		&::after {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
	}


	.m-cells-tips {
		margin-top: .3em;
		color: #999999;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 14px;
	}

	.m-cell {
		padding: 20rpx 30rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		line-height: 60rpx;

		/*
		&::before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			left: 30rpx;
		}
		*/
	}

	.m-cell-bd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	.m-cell-ft {
		text-align: right;
		color: #999999;
	}

	.m-cell-link {
		color: #586C94;
		font-size: 14px;
	}

	.m-cell-access .m-cell-ft {
		/*
  &:after {
    content: " ";
    display: inline-block;
    height: 12rpx;
    width: 12rpx;
    width: 14rpx !important;
    height: 24rpx !important;
    border-style: none !important;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAAXNSR0IArs4c6QAAAfVJREFUOE+NlMFrU0EQxr95LyKC/lWxwUIPgexuEQ9FFJRCKbUXUbyI4qFFDyIeigfxEB+LyUtyCNSTnvQQvVSESlSwQg8VStNowiaMbNiE1byX17k83s789pudmV2SUj4AsMLMcbfbvdJsNvs4gZGUsgPgrIvdBlDUWv/JYkkI8ZCI1rzANwAWtNbHs2ACYFUfAVj1At8ZY+bjOD5Mgy04MnfWm17gh8FgUKhWq7+S4AlonUqpO8x81wvcATCntd7/H/4HdPA6M2/YI7jg3eFwmK9UKns+PAVapxBimYgeAwhc8DcAea21/Y4sEXTwZSLaAhDaf2beC8MwH0XR7kzQOkul0sUgCJ4DOOWE9oMgmIuiaCdVcZySUqrIzC8BnHZrB2EYFjJBl/Y8Eb0CcMbBX08ESikXAbzwUv6cCSqllpj52bhIAH7aCs8ElVLXmfmJ15bvrqfpqUopbwDYHLeMmb8YY/K1Wu1HajuklLcB3PMm5ROA8/7oTaUqhLhPRLc86GMulyuUy+WD1JFLuJvvjTEXkq7XWJGUUk+Z+Zq369t+v79Qr9ftCzFl9hKHttxEtOR5X/d6vWKj0fidBI2Ko5TaYuark6knanQ6HZn1aFnFIwDnRrsQ6Xa7fanVapk0pYmAEGKdiFaJKGbmNa31MAuy/r9SDskpsE/LwAAAAABJRU5ErkJggg==');
    background-size: 14rpx 24rpx;
    background-repeat: no-repeat;

    position: relative;
    top: -4rpx;
    position: absolute;
    top: 50%;
    margin-top: -5rpx;
  }
  */

		&:after {
			content: " ";
			display: inline-block;
			height: 12rpx;
			width: 12rpx;
			border-width: 4rpx 4rpx 0 0;
			border-color: #999999;
			border-style: solid;
			-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
			transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
			position: relative;
			top: -4rpx;
			position: absolute;
			top: 50%;
			margin-top: -5rpx;
			/*right: 4rpx;*/
		}


		padding-right: 13px;
		position: relative;
	}


	.m-cell-default-icon {
		width: 40rpx;
		height: 40rpx;
		vertical-align: middle;
		margin-right: 10rpx;
	}

	/*列表布局 end*/
	/*from 表单 start*/

	.m-cells-form {
		font-size: 14px;
	}

	.u-label {
		display: block;
		width: 210rpx;
		word-wrap: break-word;
		word-break: break-all;
	}

	.u-input {
		width: 100%;
		border: 0;
		outline: 0;
		-webkit-appearance: none;
		background-color: transparent;
		font-size: inherit;
		display: flex;
		margin: auto;
	}

	.m-input label {
		color: #888;
	}

	.m-vcode-btn {
		display: inline-block;
		height: 88rpx;
		margin-left: 10rpx;
		padding: 0 0.6em 0 0.7em;
		border-left: 1px solid #E5E5E5;
		line-height: 88rpx;
		vertical-align: middle;
		font-size: 16px;
		color: #3CC51F;
	}

	.m-cell-vcode {
		padding-top: 0;
		padding-right: 0;
		padding-bottom: 0;
	}

	.m-vcode-img {
		margin-left: 10rpx;
		height: 88rpx;
		width: 216rpx;
		vertical-align: middle;
	}

	/*.m-cell-warn {color: #E64340;}*/

	.m-icon-warn {
		position: absolute;
		top: 50%;
		right: 20rpx;
		margin-top: -23rpx;
	}

	/*from 表单 end*/
	/*switch start*/

	.u-switch {
		-webkit-appearance: none;
		appearance: none;
		position: relative;
		width: 52px;
		height: 32px;
		border: 1px solid #DFDFDF;
		outline: 0;
		border-radius: 16px;
		box-sizing: border-box;
		background-color: #DFDFDF;
		/* #ifndef APP-PLUS-NVUE */
		-webkit-transition: background-color 0.1s, border 0.1s;
		transition: background-color 0.1s, border 0.1s;
		/* #endif */

		&::before {
			content: " ";
			position: absolute;
			top: 0;
			left: 0;
			width: 50px;
			height: 30px;
			border-radius: 15px;
			background-color: #FDFDFD;
			/* #ifndef APP-PLUS-NVUE */
			-webkit-transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
			transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
			transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
			transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1), -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
			/* #endif */
		}

		&::after {
			content: " ";
			position: absolute;
			top: 0;
			left: 0;
			width: 30px;
			height: 30px;
			border-radius: 15px;
			background-color: #FFFFFF;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
			/* #ifndef APP-PLUS-NVUE */
			-webkit-transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
			transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
			transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
			transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35), -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
			/* #endif */
		}
	}

	.u-switch-checked {
		border-color: #04BE02;
		background-color: #04BE02;

		&:before {
			-webkit-transform: scale(0);
			transform: scale(0);
		}

		&:after {
			-webkit-transform: translateX(20px);
			transform: translateX(20px);
		}
	}

	/*switch end*/
	/*textarea start*/

	.u-textarea {
		display: block;
		border: 0;
		width: 100%;
		height: 100rpx;
		font-size: 1em;
		line-height: inherit;
	}

	.u-textarea-counter {
		color: #B2B2B2;
		text-align: right;
	}

	.u-cell-warn .u-textarea-counter {
		color: #E64340;
	}

	/*textarea end*/
	/*select start*/

	.m-cell-select {
		padding: 0 30rpx;

		.u-select {
			padding-right: 30px;
		}

		.m-cell-bd::after {
			content: " ";
			display: inline-block;
			height: 12rpx;
			width: 12rpx;
			border-width: 4rpx 4rpx 0 0;
			border-color: #ebebe7;
			border-style: solid;
			-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
			transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
			position: relative;
			top: -2px;
			position: absolute;
			top: 50%;
			right: 30rpx;
			margin-top: -6rpx;
		}
	}

	.u-select {
		-webkit-appearance: none;
		border: 0;
		outline: 0;
		background-color: transparent;
		width: 100%;
		font-size: inherit;
		height: 88rpx;
		line-height: 88rpx;
		position: relative;
		z-index: 1;
		padding-left: 30rpx;
	}

	.m-cell-select-before {
		padding-right: 30rpx;

		.u-select {
			width: 210rpx;
			box-sizing: border-box;
		}

		.m-cell-bd {
			position: relative;

			&:after {
				content: " ";
				position: absolute;
				right: 0;
				top: 0;
				width: 1px;
				bottom: 0;
				border-right: 1px solid #ebebe7;
				color: #ebebe7;
				-webkit-transform-origin: 100% 0;
				transform-origin: 100% 0;
				-webkit-transform: scaleX(0.5);
				transform: scaleX(0.5);
			}

			&:before {
				content: " ";
				display: inline-block;
				height: 6px;
				width: 6px;
				border-width: 2px 2px 0 0;
				border-color: #ebebe7;
				border-style: solid;
				-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				position: relative;
				top: -2px;
				position: absolute;
				top: 50%;
				right: 15px;
				margin-top: -3px;
			}

			padding-left: 15px;

			&:after {
				display: none;
			}
		}
	}

	.m-cell-select-after {
		padding-left: 15px;

		.u-select {
			padding-left: 0;
		}
	}

	/*select end*/
	/*flex 布局 start*/

	.g-flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.g-flex-item {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	/*flex 布局 end*/
	/*grid 布局 start*/

	.g-grids {
		position: relative;
		overflow: hidden;

		&:before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}

		&:after {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			width: 1px;
			bottom: 0;
			border-left: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleX(0.5);
			transform: scaleX(0.5);
		}
	}

	.g-grid {
		position: relative;
		float: left;
		padding: 20px 10px;
		width: 33.33333333%;
		box-sizing: border-box;

		&:before {
			content: " ";
			position: absolute;
			right: 0;
			top: 0;
			width: 1px;
			bottom: 0;
			border-right: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 100% 0;
			transform-origin: 100% 0;
			-webkit-transform: scaleX(0.5);
			transform: scaleX(0.5);
		}

		&:after {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #ebebe7;
			color: #ebebe7;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
	}

	/*.g-grid:active {background-color: #ECECEC;}*/

	.g-grid-icon {
		width: 56rpx;
		height: 56rpx;
		margin: 0 auto;

		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.g-grid-label {
		display: block;
		text-align: center;
		color: #000000;
		font-size: 14px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	/*grid 布局 end*/
	/*loading start*/
	.m-loading-box {
		margin-top: 40rpx;
	}

	.u-loadmore {
		width: 65%;
		margin: 1.5em auto;
		line-height: 1.6em;
		font-size: 14px;
		text-align: center;

		padding-bottom: 40rpx;
	}

	.u-loadmore-tips {
		display: inline-block;
		vertical-align: middle;

		margin-left: 10rpx;
	}

	.u-loadmore-line {
		border-top: 1px solid #E5E5E5;
		margin-top: 50rpx;

		.u-loadmore-tips {
			position: relative;
			top: -0.9em;
			padding: 0 .55em;
			background-color: #f8f8f8;
			color: #999999;
		}

		padding-bottom: 40rpx;
	}

	.u-loadmore-dot .u-loadmore-tips {
		padding: 0 .16em;

		&:before {
			content: " ";
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: #E5E5E5;
			display: inline-block;
			position: relative;
			vertical-align: 0;
			top: -0.16em;
		}
	}

	.u-loading {
		width: 34rpx;
		height: 34rpx;
		display: inline-block;
		vertical-align: middle;
		//background: transparent url(data:image/gif;base64,R0lGODlhDgAOAKIAAP///+/v797e3r29vTHOAP///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAFACwAAAAADgAOAAADK1i6APuwwRWCkmWMV63UG2ct2mQ+QipM4KCuUHvOJRnaWwk+dX/Hv1PtkQAAIfkEBQcABQAsAAAAAAwACAAAAxpYuhH7zEEhVFMAKFpv1lu1ZFCpDOhgFqlqJgAh+QQFBwAFACwCAAAADAAIAAADGlhaIvurwTKGkiUEVa3UG2ct2mSeCqAC5wokACH5BAUHAAUALAYAAAAIAAwAAAMaOFPc2m4VIdijFVLIe/gBBIYdBADdiXInkwAAIfkEBQcABQAsBgACAAgADAAAAxtYWjOrzb32qhVYvKztC8ECAAUYFqMCKmnVPgkAIfkEBQcABQAsAgAGAAwACAAAAxtYujo+jD0YawGACbFwDkGxcVdWgMpWoZbCMgkAIfkEBQcABQAsAAAGAAwACAAAAxoICtXei71JawhvDHexEIW2FVfzNRp1ViboJAAh+QQJBwAFACwAAAAADgAOAAADH1i63P4KAMjkpPHiHXrA3reNiyBs5jkMkKmsI7zJTAIAOw==) no-repeat;
		background: transparent url(data:image/gif;base64,R0lGODlhDgAOAKIAAP///+/v797e3r29vTHOAP///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAFACwAAAAADgAOAAADK1i6APuwwRWCkmWMV63UG2ct2mQ+QipM4KCuUHvOJRnaWwk+dX/Hv1PtkQAAIfkEBQcABQAsAAAAAAwACAAAAxpYuhH7zEEhVFMAKFpv1lu1ZFCpDOhgFqlqJgAh+QQFBwAFACwCAAAADAAIAAADGlhaIvurwTKGkiUEVa3UG2ct2mSeCqAC5wokACH5BAUHAAUALAYAAAAIAAwAAAMaOFPc2m4VIdijFVLIe/gBBIYdBADdiXInkwAAIfkEBQcABQAsBgACAAgADAAAAxtYWjOrzb32qhVYvKztC8ECAAUYFqMCKmnVPgkAIfkEBQcABQAsAgAGAAwACAAAAxtYujo+jD0YawGACbFwDkGxcVdWgMpWoZbCMgkAIfkEBQcABQAsAAAGAAwACAAAAxoICtXei71JawhvDHexEIW2FVfzNRp1ViboJAAh+QQJBwAFACwAAAAADgAOAAADH1i63P4KAMjkpPHiHXrA3reNiyBs5jkMkKmsI7zJTAIAOw==) no-repeat;
		background-size: 100%;
	}

	/*Panel start*/

	.m-panel {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		position: relative;
		border-radius: 18rpx;
		overflow: hidden;

		&:before {
			// content: "";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}

		&:after {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
	}

	.m-panel-hd {
		padding: 10px 15px 10px;
		font-size: 13px;
		position: relative;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #555555;
		line-height: 40rpx;

		&:after {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			left: 15px;
		}
	}

	.m-media-box {
		padding: 15px;
		position: relative;

		&:before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			left: 15px;
		}

		&:first-child:before {
			display: none;
		}

		color: #000000;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}

	/*.m-media-box:active {background-color: #ECECEC;}*/

	.m-media-box-title {
		font-weight: 400;
		font-size: 17px;
		width: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
		word-wrap: break-word;
		word-break: break-all;

		/*
        margin-top: 2px;
        margin-bottom: 5px;
        width: 560rpx;
        */
	}

	.m-media-box-desc {
		color: #999999;
		font-size: 13px;
		line-height: 1.2;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.m-media-box-info {
		margin-top: 15px;
		padding-bottom: 5px;
		font-size: 13px;
		color: #CECECE;
		line-height: 1em;
		list-style: none;
		overflow: hidden;
	}

	.m-media-box-info-meta {
		float: left;
		padding-right: 1em;
		font-size: 12px;
	}

	.m-media-box-info-meta-extra {
		padding-left: 1em;
		border-left: 1px solid #CECECE;
	}

	.m-media-box-text .m-media-box-title {
		margin-bottom: 8px;
	}

	.m-media-box-appmsg {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;

		.m-media-box-hd {
			margin-right: .8em;
			width: 80rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
		}

		.m-media-box-thumb {
			width: 100%;
			max-height: 100%;
			vertical-align: top;
		}

		.m-media-box-bd {
			-webkit-box-flex: 1;
			-webkit-flex: 1;
			flex: 1;
			min-width: 0;
		}
	}

	.m-media-box-small-appmsg {
		padding: 0;

		.weui-cells {
			margin-top: 0;

			&:before {
				display: none;
			}
		}
	}

	/*Panel end*/
	/*nvabar start*/

	.m-navbar {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		background-color: #fff;
		position: relative;

		&:after {
			// content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #CCCCCC;
			color: #CCCCCC;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			z-index: 3;
		}
	}

	.m-navbar-item {
		position: relative;
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;


		padding: 20rpx 0;
		height: calc(var(--window-top) - 40rpx - 4rpx);
		line-height: calc(var(--window-top) - 40rpx - 4rpx);


		text-align: center;
		font-size: 28rpx;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		z-index: 2;

		&.m-navbar-item-on {
			background-color: #eaeaea;
		}

		&:after {
			// content: " ";
			position: absolute;
			right: 0;
			top: 0;
			width: 1px;
			bottom: 0;
			border-right: 1px solid #CCCCCC;
			color: #CCCCCC;
			-webkit-transform-origin: 100% 0;
			transform-origin: 100% 0;
			-webkit-transform: scaleX(0.5);
			transform: scaleX(0.5);
		}

		&:last-child:after {
			display: none;
		}
	}

	/*.m-navbar-item:active {background-color: #ededed;}*/
	.m-navbar-item {
		height: 48rpx;
		line-height: 48rpx;
	}

	/*nvabar end*/
	/*返回顶部&视图切换 start*/

	/*nvabar end*/
	/*返回顶部&视图切换 start*/

	.u-top {
		position: fixed;
		width: 80rpx;
		z-index: 100;
		opacity: 0.9;
	}

	.u-top-default {
		position: fixed;
		width: 80rpx;
		right: 20rpx;
		bottom: 20rpx;
		z-index: 100;
	}

	.u-top1 {}

	.u-top1 button {
		background-color: transparent;
		padding: 0;
	}

	.u-view {
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff;
		margin: 10rpx 0;
		border-radius: 100%;
		overflow: hidden;
		border: 1px solid #eee;
		text-align: center;
	}

	.u-back {
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff;
		border-radius: 100%;
		overflow: hidden;
		border: 1px solid #eee;
		text-align: center;
		font-size: 32rpx;
	}

	/*返回顶部&视图切换 end*/

	/*  */
	.movableAreaIM {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素

		.movableView {
			pointer-events: auto; //可以点击
			width: 80rpx;
			height: 80rpx;
		}
	}

	/* 快捷导航 end  */
	.movableArea {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100% - 188rpx);
		margin-top: 88rpx;
		margin-bottom: 100rpx;
		z-index: 98;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素

		.movableView {
			pointer-events: auto; //可以点击
			width: 80rpx;
			height: 80rpx;
		}
	}

	/*商品列表*/

	.m-product-list {
		background-color: f8f8f8 !important;
	}

	.m-product-item {
		height: 200rpx;
		/*height: 260rpx;*/
		/*overflow: hidden;*/
		background-color: #fff;
		position: relative;
		/* margin-top: 10rpx; */
		display: flex;
		padding: 10rpx;
		border-radius: 4rpx;
	}

	.m-product-item:before {
		content: "";
		border: none;
	}

	.m-product-item:after {
		// content: ' ';
		// position: absolute;
		// left: 0;
		// bottom: 0;
		// right: 0;
		// height: 1px;
		// border-bottom: 1px solid #ebebe7;
		// color: #ebebe7;
		// /*transform-origin: 0 100%;*/
		// transform: scaleY(0.5);
	}

	.m-product-item:first-child::before {
		content: "";
		border: none;
	}

	.m-product-item:last-child::after {
		content: "";
		border: none;
	}

	.m-product-img {
		width: 200rpx;
		height: 200rpx;
		background: #fff;
		border-radius: 12rpx;
		float: left;
		text-align: center;

		image {
			width: 200rpx;
			height: 200rpx;
			box-sizing: border-box;
			// border-radius: 12rpx;
			/*padding: 20rpx;*/
			padding: 10rpx;

			border-radius: 12rpx;
		}
	}

	.m-product-info {
		//height: 210rpx;
		width: 538rpx;
		float: left;
		box-sizing: border-box;
		padding: 20rpx 0;
		position: relative;

		padding: 10rpx 26rpx;
		padding: 10rpx 20rpx 10rpx 10rpx;

		display: flex;
		flex-flow: column;
		justify-content: space-between;
		/*
		&::before {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1rpx;
			border-bottom: 1rpx solid #d5d5d5;
			color: #CCCCCC;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			z-index: 3;
		}
		*/
	}

	.m-product-item:last-child .m-product-info::before {
		// content: "";
		// border: none;
	}

	.m-product-name {
		font-size: 28rpx;
		line-height: 40rpx;
		// height: 130rpx;
		box-sizing: border-box;
		/*padding-right: 20rpx;*/
		position: relative;


		label {
			height: auto;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #222222;

		}
	}

	/*.m-product-name label{overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp:2;}*/

	.m-product-price {
		font-size: 32rpx;
		line-height: 52rpx !important;
		color: $secondary-skin-color;

		label {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: $secondary-skin-color;

		}
	}

	.m-listv {
		padding: 0 4rpx 0 16rpx;
		overflow: hidden;

		.m-product-item {
			margin: 10rpx;
			overflow: hidden;
			float: left;
			width: 342rpx;
			height: 530rpx;
			background: #FFFFFF;
			border-radius: 18rpx;

			/*box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);*/
			display: block;
			padding: 0;
		}

		.m-product-item:before {
			content: "";
			border: none;
		}

		.m-product-item:after {
			content: "";
			border: none;
		}

		.m-product-img {
			width: 342rpx;
			height: 342rpx;

			image {
				width: 342rpx;
				height: 342rpx;
				box-sizing: border-box;
				padding: 0;
			}
		}

		.m-product-name {
			width: 345rpx;
			height: 100rpx;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
		}

		.m-product-price {
			padding: 0 20rpx;
		}
	}

	.m-min-name {
		font-size: 24rpx;
		color: #888;
		display: block;
	}

	.m-product-info1 {
		/*height: 210rpx;
		width: 538rpx;*/
		width: 100%;
		box-sizing: border-box;
		padding: 10rpx;


		/*
		&::before {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1rpx;
			border-bottom: 1rpx solid #d5d5d5;
			color: #CCCCCC;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			z-index: 3;
		}
		*/
	}

	.m-product-name1 {
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

	.m-product-price1 {
		font-size: 32rpx;
		color: $secondary-skin-color;
		/*line-height: 40rpx;*/

		label {
			font-size: 24rpx;
		}


		.c1 {
			position: relative;
			width: 40rpx;
			height: 40rpx;
			background: url(https://static.shopsuite.cn/xcxfile/appicon/pc1.png) center no-repeat;
			background-size: cover;
		}

		.c2 {
			position: relative;
			width: 50rpx;
			height: 50rpx;
			background: url(https://static.shopsuite.cn/xcxfile/appicon/pc2.png) center no-repeat;
			background-size: cover;
		}

		.c3 {
			position: relative;
			text-align: center;
			width: 100rpx;
			height: 60rpx;
			margin-right: -30rpx;
			margin-top: 6rpx;
			color: #fff;
			font-size: 24rpx;
			line-height: 50rpx;
			background: url(https://static.shopsuite.cn/xcxfile/appicon/pc3.png) center no-repeat;
			background-size: cover;
		}

		.c4 {
			position: relative;
			text-align: center;
			padding: 4rpx 20rpx;
			border-radius: 4rpx;
			color: #fff;
			font-size: 24rpx;
			background-color: #db384c;
		}
	}

	.m-listv {
		padding: 0 10rpx;
		overflow: hidden;

		.m-product-name1 {
			width: 345rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.m-product-price1 {
			padding-top: 18rpx;
			display: flex;
			justify-content: space-between;
		}

		.num {
			display: inline-block;
			line-height: 56rpx;
			// margin-right: 20rpx;
			vertical-align: middle;
		}

		.introduce {
			width: 300rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			font-size: 12px;
			color: #717171;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.m-product-info1 {
			height: 188rpx;
			width: 312rpx;
			padding: 18rpx 12rpx 18rpx 18rpx;
		}

		.m-product-info {
			height: auto;
			padding: 20rpx 0;
		}
	}

	/*商品别表*/
	/*意向车加减按钮 start*/

	.u-cart-num:after {
		content: ' ';
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 200%;
		height: 200%;
		border: 1rpx solid #DDDDDD;
		border-radius: 24rpx;
		color: #e5e5e5;
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);

	}

	.u-cart-num {
		display: inline-block;
		border: 0rpx solid #e5e5e5;
		width: 178rpx;
		height: 52rpx;
		line-height: 54rpx;
		box-sizing: border-box;
		margin-top: 15rpx;
		text-align: center;
	}

	.u-num-btn {
		float: left;
		width: 56rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #222222;
		height: 56rpx;
	}

	.thin-border-right {
		height: auto;
		line-height: 44rpx;
		border-right: 0rpx solid #DDDDDD;
		border-left: 0rpx solid #DDDDDD;
		position: relative;
	}

	.thin-border-right:after {
		content: ' ';
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 190%;
		height: 190%;
		border-right: 1rpx solid #DDDDDD;
		color: #e5e5e5;
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
	}

	.thin-border-left {
		height: auto;
		line-height: 44rpx;
		border-right: 0rpx solid #DDDDDD;
		border-left: 0rpx solid #DDDDDD;
		position: relative;
	}

	.thin-border-left:before {
		content: ' ';
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 190%;
		height: 190%;
		border-left: 1rpx solid #DDDDDD;
		color: #e5e5e5;
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
	}

	.u-cart-num input {
		float: left;
		width: 56rpx;
		height: 56rpx;
		border-left: 0rpx solid #e5e5e5;
		border-right: 0rpx solid #e5e5e5;
		font-size: 28rpx;
		color: #999999;


		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #222222;
		line-height: 40rpx;
	}

	/*意向车加减按钮 end*/
	/*公共界面属性 start*/

	.hide {
		display: none;
	}

	/*公共界面属性 end*/
	/*清除浮动菜单 start*/

	.u-cleanbox {
		height: 130rpx;
	}

	/*清除浮动菜单 end*/
	/*设置页面高度 start*/

	.u-pa {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 5;
		height: 100%;


		.m-tab {
			position: fixed;
			width: 100%;
			top: 0;
			left: 0;
			z-index: 6;
		}

		.m-product-list {
			/*padding-top: 100rpx;*/
			padding: 0 10rpx;
		}
	}

	.u-pa1 {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: $body-bg;
	}


	/*设置页面高度 end*/
	/*空页面 start*/

	.m-nullpage {
		/*position: absolute;*/
		position: relative;

		display: table;
		width: 100%;
		overflow: hidden;
		/*height: 100%;*/
		height: 720rpx;
		text-align: center;
		color: #bfbfbf;

		.m-nullpage-middle {
			display: table-cell;
			vertical-align: middle;
			/*margin-top: -30rpx;*/

			label {
				font-size: 32rpx;
				line-height: 20rpx;
				position: relative;
				/*top: -90rpx;*/
			}

			.iconfont {
				font-size: 128rpx;
			}

		}

		.m-null-tip {
			/*margin-top: -110rpx;*/

			text {
				display: block;
				font-size: 32rpx;
			}
		}
	}

	.m-null-tipck {
		color: $default-skin-bg;
	}

	.m-nullcontent {
		position: relative;
		display: table;
		width: 100%;
		overflow: hidden;
		text-align: center;
		color: #bfbfbf;
		margin-top: 260rpx;

		.m-nullpage-middle {
			display: table-cell;
			vertical-align: middle;

			label {
				font-size: 32rpx;
				position: relative;
				line-height: 90rpx;
			}

			.iconfont {
				font-size: 128rpx;
			}

		}

		.m-null-tip {
			margin-top: -40rpx;

			text {
				display: block;
				font-size: 32rpx;
			}
		}
	}

	/*空页面 end*/
	/*技术支持 start*/

	.m-tips {
		font-size: 24rpx;
		text-align: center;
		color: #bfbfbf;
		margin-top: 6px;
	}

	.m-tips-logo image {
		width: 80rpx;
		height: 80rpx;
	}

	/*技术支持 end*/

	/*首页新人红包弹窗*/

	.msk {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.msk_box {
		position: absolute;
		top: 20%;
		left: 50%;
		margin-left: -320rpx;
		width: 640rpx;
	}

	.msk_box_info {
		color: #fff;
		position: absolute;
		right: 100rpx;
		top: 200rpx;
		width: 220rpx;
		text-align: center;

		label {
			font-size: 90rpx;
			font-family: 'Century Gothic';
			font-weight: bold;
		}
	}

	.btn_receivenow {
		position: absolute;
		width: 225rpx;
		height: 70rpx;
		bottom: 88rpx;
		left: 212rpx;
	}

	.btn_cancel {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 0;
		right: 15rpx;
		border-radius: 100%;
		background-color: #FB3842;
		color: white;
		text-align: center;
		font-size: 28rpx;
		line-height: 40rpx;
		border: 5rpx solid #F19047;
	}

	/*首页新人红包弹窗*/

	/*首页新人领取成功弹窗*/

	.msk1 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/*.m-coupon-box{position: absolute;left: 50%;top: 50%;margin-top: -500rpx;margin-left:-280rpx;}*/
	/*
	.m-coupon-box {
		position: relative;
		bottom: 100rpx;
	}

	.m-coupon-box-top {
		width: 600rpx;
		height: 200rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/Coupon_box.png) top no-repeat;
		background-size: cover;
		margin-bottom: -80rpx;
	}

	.m-coupon-box-bottom {
		width: 600rpx;
		height: 280rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/Coupon_box.png) bottom no-repeat;
		background-size: cover;
		margin-top: -70rpx;
	}

	.m-coupon-box-content {
		width: 496rpx;
		max-height: 590rpx;
		margin: 0 0 0 48rpx;
		background-color: #ffde6a;
		position: relative;
		z-index: 5;
	}

	.m-coupon-box-title {
		text-align: center;
		color: #f54981;
		font-size: 30rpx;
	}

	.m-coupon-box-item {
		width: 448rpx;
		height: 136rpx;
		background-color: #fff;
		margin: 10rpx auto;
		border-radius: 4rpx;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.35);
	}

	.m-coupon-box-list {
		max-height: 500rpx;
		position: relative;
		overflow-y: scroll;
	}

	.m-coupon-box-content::after {
		content: "";
		position: absolute;
		width: 100%;
		height: 40rpx;
		background: -webkit-linear-gradient(bottom, rgba(255, 222, 106, 1), rgba(255, 222, 106, 0));
		bottom: 0;
		left: 0;
	}

	.m-coupon-box-item {
		box-sizing: border-box;
		padding: 10rpx 30rpx;

		label {
			display: inline-block;
			color: $default-skin-bg;
			width: 100%;
			font-size: 32rpx;
			font-weight: bold;
		}

		text {
			font-size: 24rpx;
			line-height: 35rpx;
			display: inline-block;
		}
	}

	.m-coupon-box-tip {
		font-size: 24rpx;
		color: #888;
		line-height: 40rpx;
	}
	*/

	.m-coupon-box {
		position: relative;
	}

	.m-coupon-box-top {
		width: 600rpx;
		height: 220rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/redbag_double.png) top no-repeat;
		background-size: cover;
	}

	.m-coupon-box-top2 {
		width: 600rpx;
		height: 220rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/redbag_double2.png) top no-repeat;
		background-size: cover;
	}

	.m-coupon-box-bottom {
		width: 600rpx;
		height: 120rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/redbag_double.png) bottom no-repeat;
		background-size: cover;
	}

	.m-coupon-box-content {
		width: 600rpx;
		max-height: 400rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/redbag_double.png) center no-repeat;
		background-size: cover;
	}

	.m-coupon-box-title {
		text-align: center;
		color: #f54981;
		font-size: 30rpx;
	}

	.m-coupon-box-item {
		width: 460rpx;
		height: 170rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/coupon_muti.png) no-repeat;
		margin: 10rpx auto;
		background-size: contain;
	}

	.m-coupon-box-list {
		max-height: 460rpx;
		position: relative;
		overflow-y: scroll;
	}

	.m-coupon-box-item {
		box-sizing: border-box;
		padding: 10rpx 30rpx;
		display: flex;
	}

	.m-coupon-box-item-left {
		width: 26%;
		font-size: 40rpx;
		color: rgb(191, 14, 36);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.m-coupon-box-item-right {
		width: 64%;
		margin-left: 10%;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;

		label {
			font-size: 28rpx;
			color: rgb(191, 14, 36);
		}

		text {
			font-size: 24rpx;
			color: #999;
			margin-top: 8rpx;
		}
	}

	.m-coupon-box-tip {
		font-size: 28rpx;
		color: #888;
		line-height: 40rpx;
	}

	/*关闭按钮*/

	.u-close-btn {
		width: 40rpx;
		height: 40rpx;
		border-radius: 100%;
		background-color: black;
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -20rpx;
		bottom: -100rpx;
		color: white;
		text-align: center;
		font-size: 24rpx;
		line-height: 40rpx;
	}

	/*首页新人领取成功弹窗*/
	/*分享弹窗 start*/

	.shareMsk {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 99;
	}

	.sharebox {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		height: 400rpx;
		background-color: #fff;
	}

	.shareList {
		height: 300rpx;
		background-color: #f8f8f8;
		justify-content: center;
		align-items: center;
	}

	.shareItem {
		text-align: center;
		vertical-align: middle;
		border: none !important;
	}

	.shareBtn {
		display: inline-block;
		text-align: center;
	}

	.shareItem {
		.iconfont {
			font-size: 40rpx;
			width: 100rpx;
			height: 100rpx;
			background-color: #fff;
			line-height: 105rpx;
			border-radius: 100rpx;
			display: inline-block;
			position: relative;

			button {
				position: absolute;
				left: 0;
				top: 0;
				opacity: 0;
				width: 100rpx;
				height: 100rpx;
			}
		}

		label {
			font-size: 24rpx;
			display: block;
			margin-top: 20rpx;
		}
	}

	.cancelShare {
		height: 100rpx;
		font-size: 32rpx;
		color: #333;
		text-align: center;
		line-height: 100rpx;
	}

	.shareCodeImg {
		position: fixed;
		width: 500rpx;
		height: 1000rpx;
		background-color: #fff;
		z-index: 100;
		border-radius: 8rpx;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
		padding-top: 70rpx;
		left: 50%;
		top: 50%;
		margin-left: -250rpx;
		margin-top: -500rpx;

		image {
			width: 420rpx;
			margin: 0 auto;
			display: inline-block;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
			border-radius: 8rpx;
		}

		icon {
			position: absolute;
			right: 8rpx;
			top: 8rpx;
		}

		.mp-clean-icon {
			position: absolute;
			right: 15rpx;
			top: 10rpx;
		}

		label {
			font-size: 24rpx;
			display: block;
			margin: 20rpx;
			color: #888;
		}

		button {
			width: 400rpx;
			margin: 0 auto;
		}
	}

	/*分享弹窗 end*/
	button::after {
		border: none
	}

	.close_msk {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
	}

	.m-product-name2 {
		font-size: 24rpx;

		/*padding-right: 20rpx;*/
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;

		.p-tag {
			margin-right: 4rpx;
			line-height: calc(30rpx) !important;
			height: 30rpx !important;
		}
	}

	.m-listv .m-product-name2 {
		width: 312rpx;
		height: 80rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #222222;
		line-height: 40rpx;

	}

	.icon-activity {
		display: block;
		width: 160rpx;
		height: 160rpx;
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAADwCAYAAACXDeNDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFODkyRDE4RTJFRjYxMUU1OEEyMUMwNjg5NTYyNEYxRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFODkyRDE4RjJFRjYxMUU1OEEyMUMwNjg5NTYyNEYxRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU4OTJEMThDMkVGNjExRTU4QTIxQzA2ODk1NjI0RjFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU4OTJEMThEMkVGNjExRTU4QTIxQzA2ODk1NjI0RjFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bk99YQAAB/9JREFUeNrsnT+O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") no-repeat;
		text-indent: -9999px;
	}

	.icon-activity-postfree {
		background-position: 0 -80px;
	}

	.icon-activity-coupons {
		background-position: 0 0;
	}

	.icon-activity-reduction {
		background-position: 0 -160px;
	}

	/* 活动标签 */
	.u-tuan-label {
		padding: 5rpx;
		background-color: #DB384C;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #fff;
		margin-right: 5rpx
	}

	.tag {
		display: inline-block;
		/*width: 60px;*/
		height: 18px;
		line-height: 18px;
		text-align: center;
		color: #fff;
		font-size: 12px;
		vertical-align: top;
		margin-right: 4rpx;
	}

	.tag-orange {
		background-color: #EB536D;
	}

	.tag-blue {
		background-color: #2196f3;
	}

	.tag-red {
		background-color: #e53935;
	}

	.tag-green {
		background-color: #83c44e;
	}

	.tag-openbuy {
		width: auto;
		padding: 0 10px;
	}


	.tag-reduction {
		background-color: #e50dbb;
		z-index: 8;
	}

	.tag-saleoff {
		background-color: #e53935;
		z-index: 7;
	}

	.tag-postfree {
		background-color: #ffac13;
		z-index: 6;
	}

	.tag-bargain {
		background-color: #ffac13;
		z-index: 4;
	}

	.tag-gift {
		background-color: #2196f3;
		z-index: 3;
	}

	.tag-new {
		background-color: #83c44e;
		z-index: 5;
	}

	.tag-selfsupport {
		background-color: #f44336;
		z-index: 10;

		position: absolute;

		top: 1px;
		right: 5px;
		left: auto;
		width: 40px;
	}

	.money {
		font-weight: bold;

		&.add {
			color: $default-skin-bg;
		}

		&.reduce {
			color: #36BC9B;
		}
	}

	.wxParse {
		.img {
			/*width: 750rpx!important;*/
		}

		.chatimg {
			float: left;
			max-height: 50px !important;
			max-width: 50px !important;
			margin-right: 5px;
		}


		.single-img {
			max-height: 220px !important;
			max-width: 220px !important;
			margin-right: 0px;
		}

		.chat-bubble-box {
			min-width: 460rpx;
		}
	}

	.bubble {
		.wxParse .a {
			color: #666;
		}
	}

	.active {
		color: $default-skin-bg;
	}

	.highlight {
		color: $default-skin-bg;
	}


	.highlight12 {
		color: $default-skin-bg;
		font-size: 24rpx;
	}

	.highlight-link {
		color: $default-skin-bg;
		border-bottom: 1px solid $default-skin-bg;
		font-size: 32rpx;
	}

	.text-overflow {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}


	/*  细边框 */
	.tbl::after {
		content: " ";
		position: absolute;
		border-left: 1px solid #ebebe7;
		left: 0;
		top: 0;
		width: 1px;
		height: 100%;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleX(0.5);
	}

	.tbr::after {
		content: " ";
		position: absolute;
		border-right: 1px solid #ebebe7;
		left: 0;
		top: 0;
		width: 1px;
		height: 100%;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleX(0.5);
	}

	.tbb:after {
		content: " ";
		position: absolute;
		border-bottom: 1px solid #ebebe7;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
		color: #ebebe7;
	}


	.tbt:after {
		content: " ";
		position: absolute;
		border-top: 1px solid #ebebe7;
		left: 0;
		right: 0;
		top: 0;
		height: 1px;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
		color: #ebebe7;
	}


	.tb:after {
		content: ' ';
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 200%;
		height: 200%;
		border: 1rpx solid #ebebe7;
		color: #ebebe7;
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
	}


	/* 快捷导航 */
	.u-tap-btn {
		position: fixed;
		right: 20rpx;
		bottom: 100rpx;
		z-index: 999
	}

	.u-go-home {
		border-radius: 100%;
		width: 80rpx;
		height: 80rpx;
		border: 1px solid #eee;
		font-size: 20rpx;
		text-align: center;
		background-color: #fff;
		box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.35);
		z-index: 2;
		opacity: 0.8;
		line-height: 80rpx;
		margin-bottom: 20rpx;
	}

	.u-go-home .iconfont {
		font-size: 36rpx;
	}

	.zhezhaoceng {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		animation: opacity 500ms;
		animation-fill-mode: forwards
	}

	.zhezhaoceng1 {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -999;
		animation: opacity1 500ms;
		animation-fill-mode: forwards
	}

	@keyframes opacity {
		from {
			background: rgba(0, 0, 0, 0);
		}

		to {
			background: rgba(0, 0, 0, 0.4);
		}
	}

	@keyframes opacity1 {
		from {
			background: rgba(0, 0, 0, 0.4);
		}

		to {
			background: rgba(0, 0, 0, 0);
		}
	}

	.quicknav {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.u-top .quicknav:first-child {}

	.u-top .quicknav:last-child {}

	.u-top1 .navtext:last-child {}

	/* .navtext{display: flex;align-items: center;justify-content: space-between;animation:mymove 500ms;animation-fill-mode: forwards} @keyframes mymove { from {margin-bottom:0px;} to {margin-bottom: 20rpx;} } .navtext1{display: flex;align-items: center;justify-content: space-between;animation:mymove1 500ms;animation-fill-mode: forwards} @keyframes mymove1 { from {margin-bottom:20rpx;} to {margin-bottom: 0rpx;} } */
	.u-top1 .navtext:nth-child(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		right: 0;
		animation: mymove1 500ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext:nth-child(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		right: 0;
		animation: mymove2 500ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext:nth-child(3) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		right: 0;
		animation: mymove3 500ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext:nth-child(4) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		right: 0;
		animation: mymove4 500ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext1:nth-child(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 10rpx;
		right: 0;
		animation: mymove5 400ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext1:nth-child(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 10rpx;
		right: 0;
		animation: mymove6 400ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext1:nth-child(3) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 10rpx;
		right: 0;
		animation: mymove7 400ms;
		animation-fill-mode: forwards
	}

	.u-top1 .navtext1:nth-child(4) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 10rpx;
		right: 0;
		animation: mymove8 400ms;
		animation-fill-mode: forwards
	}

	@keyframes mymove1 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 420rpx;
			opacity: 1
		}
	}

	@keyframes mymove2 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 320rpx;
			opacity: 1
		}
	}

	@keyframes mymove3 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 220rpx;
			opacity: 1
		}
	}

	@keyframes mymove4 {
		from {
			bottom: 0rpx;
			opacity: 0
		}

		to {
			bottom: 120rpx;
			opacity: 1
		}
	}

	@keyframes mymove5 {
		from {
			bottom: 420rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
		}
	}

	@keyframes mymove6 {
		from {
			bottom: 320rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	@keyframes mymove7 {
		from {
			bottom: 220rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	@keyframes mymove8 {
		from {
			bottom: 120rpx;
			opacity: 1
		}

		to {
			bottom: 10rpx;
			opacity: 0
		}
	}

	.navtext text {
		font-size: 24rpx;
		color: #fff;
		text-align: right;
		min-width: 120rpx;
		margin-right: 20rpx
	}


	.navtext1 text {
		font-size: 24rpx;
		color: #fff;
		text-align: right;
		min-width: 120rpx;
		margin-right: 20rpx
	}

	.u-tuan-label {
		padding: 5rpx 8rpx;
		background-color: #DB384C;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #fff;
		margin-right: 8rpx;
	}

	/* 快捷导航 end  */


	.m-icon-warn {
		color: red;
	}

	.text-auto-w {
		text-align: justify !important;
		text-justify: distribute-all-lines !important;
		text-align-last: justify !important;
		-moz-text-align-last: justify !important;
		-webkit-text-align-last: justify !important;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-break: break-word
	}

	.placeholder-class {
		font-size: 25rpx;
		color: #9e9e9e;
	}


	/*  通用控件  开始 */

	.flex {
		display: flex;
	}

	.flex.space {
		justify-content: space-between;
	}

	.flex.center {
		justify-content: center;
	}

	.flex.alcenter {
		align-items: center;
	}

	.flex.alend {
		align-items: flex-end
	}

	.flex.start {
		justify-content: flex-start;
	}

	.flex.end {
		justify-content: flex-end;
	}

	.flex.wrap {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.flex .col1 {
		width: 100%;
	}

	.flex .col2 {
		width: 50%;
	}

	.flex .col3 {
		width: 33.33%;
	}

	.flex .col4 {
		width: 25%;
	}

	.flex .col5 {
		width: 20%;
	}

	.ft12 {
		font-size: 24rpx;
	}

	.ft14 {
		font-size: 28rpx;
	}

	.ft16 {
		font-size: 32rpx;
	}

	.ft18 {
		font-size: 36rpx;
	}

	.ft20 {
		font-size: 40rpx;
	}

	.ft22 {
		font-size: 44rpx;
	}

	.ft24 {
		font-size: 48rpx;
	}

	.ft28 {
		font-size: 56rpx;
	}

	.ft32 {
		font-size: 64rpx;
	}

	.ft36 {
		font-size: 72rpx;
	}

	.ft40 {
		font-size: 80rpx;
	}

	.ft50 {
		font-size: 100rpx;
	}

	.ft80 {
		font-size: 160rpx;
	}

	.text-over {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.text-over2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.text-over3 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.text-center {
		text-align: center;
	}

	.text-right {
		text-align: right;
	}

	.text-line {
		text-decoration: line-through;
	}

	.text-w {
		color: #FFFFFF;
	}

	.text-main {
		color: #333333;
	}

	.text-default {
		color: #000000;
	}

	.text-info {
		color: #666666;
	}

	.text-placeholder {
		color: #CCCCCC;
	}

	.text-notice {
		color: #999999;
	}

	.text-price {
		color: #FF6D00;
	}

	.text-load-more {
		color: #ADAEB3;
	}

	.text-theme {
		color: #FF6D00
	}

	.text-sign {
		color: #FF4F4E;
	}

	.text-yellow {
		color: #FF9B20;
	}

	.text-plus {
		color: #F2D591;
	}

	.bg-w {
		background: #FFFFFF;
	}

	.bg-default {
		background: #F7F7F7;
	}

	.bg-main {
		background: #FF6D00;
	}

	.bg-yellow {
		background: #FFB70E;
	}

	.bg-info {
		background: #F0F0F0;
	}

	.bg-invite {
		background: #C79A2F;
	}


	/*TAG*/
	.tag {
		padding: 4rpx 10rpx;
		border-radius: 16rpx;
		display: inline-flex;
	}

	.tag-hot {
		background: #FFEAE5;
		color: #FF3300;
		font-size: 24rpx;
	}

	.tag-new {
		background: #E7F9F4;
		color: #14C993;
		font-size: 24rpx;
	}

	.tag-info {
		background: #F0F0F0;
		color: #333333;
		font-size: 24rpx;
	}

	.tag-tj {
		background: #FCE7F3;
		color: #E3108A;
		font-size: 24rpx;
	}

	.tag-hot image,
	.tag-new image,
	.tag-tj image {
		width: 24rpx;
		height: 24rpx;
	}

	.tag-type {
		width: 160rpx;
		height: 64rpx;
		border-radius: 8rpx;
		line-height: 64rpx;
		text-align: center;
	}

	.tag-sf {
		padding: 0 16rpx;
		height: 40rpx;
		border-radius: 20rpx;
		color: #FFFFFF;
	}

	.tag-zk {
		height: 28rpx;
		color: #FFFFFF;
		background: #FF6D00;
		padding: 0 4rpx;
		line-height: 28rpx;
		display: inline-block;
		position: relative;
	}

	.tag-zk:before {
		content: '';
		position: absolute;
		left: -12rpx;
		width: 0;
		height: 0;
		border-bottom: 14rpx solid transparent;
		border-top: 14rpx solid transparent;
		border-right: 14rpx solid #FF6D00;
	}

	.tag-top {
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
		background: #FF6D00;
		color: #FFFFFF;
		font-size: 24rpx;
	}

	.tag-new-ad {
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
		background: #FFFFFF;
		color: #FF6D00;
		border: 2rpx solid #FF6D00;
		font-size: 24rpx;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.mt15 {
		margin-top: 15rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.mt40 {
		margin-top: 40rpx;
	}

	.mt50 {
		margin-top: 50rpx;
	}

	.mt60 {
		margin-top: 60rpx;
	}

	.mt80 {
		margin-top: 80rpx;
	}

	.mt240 {
		margin-top: 240rpx;
	}

	.mb10 {
		margin-bottom: 10rpx;
	}

	.mb15 {
		margin-bottom: 15rpx;
	}

	.mb20 {
		margin-bottom: 20rpx;
	}

	.mb30 {
		margin-bottom: 30rpx;
	}

	.mb40 {
		margin-bottom: 40rpx;
	}

	.mb50 {
		margin-bottom: 50rpx;
	}

	.mb60 {
		margin-bottom: 60rpx;
	}

	.ml10 {
		margin-left: 10rpx;
	}

	.ml15 {
		margin-left: 15rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.ml30 {
		margin-left: 30rpx;
	}

	.ml40 {
		margin-left: 40rpx;
	}

	.ml50 {
		margin-left: 50rpx;
	}

	.ml60 {
		margin-left: 60rpx;
	}

	.mr10 {
		margin-right: 10rpx;
	}

	.mr15 {
		margin-right: 15rpx;
	}

	.mr20 {
		margin-right: 20rpx;
	}

	.mr30 {
		margin-right: 30rpx;
	}

	.mr40 {
		margin-right: 40rpx;
	}

	.mr50 {
		margin-right: 50rpx;
	}

	.mr60 {
		margin-right: 60rpx;
	}

	/**一般PADDING需要用到的值,其他的不通用的单独设置**/
	.pt10 {
		padding-top: 10rpx;
	}

	.pt20 {
		padding-top: 20rpx;
	}

	.pt30 {
		padding-top: 30rpx;
	}

	.pt40 {
		padding-top: 40rpx;
	}

	.pt60 {
		padding-top: 60rpx;
	}

	.pt90 {
		padding-top: 90rpx;
	}

	.pt100 {
		padding-top: 100rpx;
	}

	.pt120 {
		padding-top: 120rpx;
	}

	.pt160 {
		padding-top: 160rpx;
	}

	.pd20 {
		padding: 20rpx;
	}

	.pd30 {
		padding: 30rpx;
	}

	.pd40 {
		padding: 40rpx;
	}

	.plr30 {
		padding: 0rpx 30rpx;
	}

	.plr40 {
		padding: 0rpx 40rpx;
	}

	.plr60 {
		padding: 0rpx 60rpx;
	}

	.pr30 {
		padding-right: 30rpx;
	}

	.pl20 {
		padding-left: 20rpx;
	}

	.pl30 {
		padding-left: 30rpx;
	}

	.pl50 {
		padding-left: 50rpx;
	}

	.pb20 {
		padding-bottom: 20rpx;
	}

	.pb30 {
		padding-bottom: 30rpx;
	}

	.pb40 {
		padding-bottom: 40rpx;
	}

	/*圆角通用的设置*/
	.bdr8 {
		border-radius: 8rpx;
	}

	.bdr16 {
		border-radius: 16rpx;
	}

	.bdr32 {
		border-radius: 32rpx;
	}

	/*投影设置*/

	.box-shadow {
		box-shadow: 0rpx 8rpx 32rpx 0rpx rgba(0, 0, 0, 0.08);
	}

	.box-shadow-top {
		box-shadow: 0rpx -4rpx 12rpx 0rpx rgba(0, 0, 0, 0.04);
	}

	.box-shadow-bottom {
		box-shadow: 0rpx 4px 8rpx 0rpx rgba(0, 0, 0, 0.06);
	}

	/*缩小*/
	.scale6 {
		transform: scale(.6);
	}

	.scale8 {
		transform: scale(.8);
	}

	/*字体加粗*/
	.ftw400 {
		font-weight: 400;
	}

	.ftw500 {
		font-weight: 500;
	}

	.ftw600 {
		font-weight: 600;
	}

	.uni-swiper-tab {
		height: 100rpx;
		white-space: nowrap;

		.swiper-tab-list {
			display: inline-block;
			width: 120rpx;
			margin-right: 10rpx;
			height: 100rpx;
			font-size: 28rpx;
			position: relative;
			color: #333333;

			.text {
				font-weight: 400;
				font-size: 28rpx;
			}

			&.active {
				color: #000000;

				.text {
					font-weight: 700;
					font-size: 28rpx;
				}

				.bg-main {
					position: relative;
					bottom: 8rpx;
					width: 96%;
					height: 8rpx;
					border-radius: 4rpx;
					/* left: calc(50% - 20rpx); */
					vertical-align: middle;
					margin: auto auto;
				}
			}
		}
	}

	uni-tabbar .uni-tabbar__reddot {
		background-color: #F56605
	}


	.movableArea {
		left: -15px;
		top: -15px;
	}


	.m-min-name {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		color: #888;

		border-radius: 6px;
		background-color: #f5f5f5;
		padding: 0 4px;
		width: fit-content;
		font-size: 12px;
		margin-top: 10rpx;
	}

	.mcs {
		font-size: 12px;
		color: $default-skin-bg;
	}
</style>