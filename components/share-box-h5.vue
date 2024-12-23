<template name="share-box-h5">
	<block></block>
</template>

<script>
export default {
	name: 'share-box-h5',
	props: {
		shareDataDefault: {
			type: Object,
			default() {
				return {
					shareTitle: '',
					shareText: '',
					href: '',
					image: ''
				};
			}
		}
	},
	data() {
		return {
			showBoxView: false,
			shareType: 0,
			shareObj: null
		};
	},
	created() {
		let that = this;
		//H5分享， 主要因为组件方式不行
		if (/uni-app/i.test(navigator.userAgent)) {
			//1. 初始化加载分享模块
			plus.share.getServices(
				function(res) {
					//[{"id":"sinaweibo","description":"新浪微博","authenticated":false,"accessToken":"","nativeClient":true},{"id":"qq","description":"QQ","authenticated":false,"accessToken":"","nativeClient":true},{"id":"weixin","description":"微信","authenticated":true,"accessToken":"","nativeClient":true}]
					that.shareObj = res;

					//console.log(JSON.stringify(res));
					let data = [];

					if (res && res.length) {
						for (let i = 0; i < res.length; i++) {
							switch (res[i]['id']) {
								case 'weixin':
									data.push({
										name: '分享到微信好友',
										id: 'weixin',
										type:'WXSceneSession',
										sort: 0
									});
									data.push({
										name: '分享到微信朋友圈',
										id: 'weixin',
										type: 'WXSenceTimeline',
										sort: 1
									});
									break;
								case 'sinaweibo':
									data.push({
										name: '分享到新浪微博',
										id: 'sinaweibo',
										sort: 2
									});
									break;
								case 'qq':
									data.push({
										name: '分享到QQ',
										id: 'qq',
										sort: 3
									});
									break;
								default:
									break;
							}
						}

						that.providerList = data.sort((x, y) => {
							return x.sort - y.sort;
						});
					}
				},

				function(e) {
					//alert( "获取分享服务列表失败："+e.message );
					uni.showModal({
						content: '获取分享通道失败',
						showCancel: false
					});
				}
			);
		}
	},
	methods: {
		share() {
			if (this.providerList.length === 0) {
				uni.showModal({
					title: '当前环境无分享渠道!',
					showCancel: false
				});
				return;
			}

			let itemList = this.providerList.map(function(value) {
				return value.name;
			});

			var that = this;

			uni.showActionSheet({
				itemList: itemList,
				success: res => {
					function share() {
						if (that.shareObj == null) {
							plus.nativeUI.toast('分享组件加载中，请稍候！');
							return false;
						}
						//微信分享
						//1、判断微信分享模块是否存在
						var wxShareObj = null;

						for (var k in that.shareObj) {
							if (that.shareObj[k].id == that.providerList[res.tapIndex].id) {
								wxShareObj = that.shareObj[k];
								break;
							}
						}

						if (wxShareObj == null) {
							plus.nativeUI.toast('微信分享组件启动失败！');
							return false;
						}

						//2、分享
						let share_data = {
								title: that.shareDataDefault.shareTitle,
								href: that.shareDataDefault.href,
								thumbs: [that.shareDataDefault.image],
								extra: {
									scene: that.providerList[res.tapIndex].type && that.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession'
								}
							};

							if (that.shareDataDefault.shareText)
							{
								share_data['content'] = that.shareDataDefault.shareText;
							}

						wxShareObj.send(
							share_data,
							function() {
								plus.nativeUI.toast('分享成功！');
								that.$emit('onShared');
							},
							function(e) {
								plus.nativeUI.toast('分享失败：' + e.message);
							}
						);
					}

					share();

					/*
					uni.share({
						provider: this.providerList[res.tapIndex].id,
						scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession',
						type: this.shareType,

						summary: this.shareDataDefault.shareText,
						imageUrl: this.shareDataDefault.image,
						title: this.shareDataDefault.shareTitle,
						href: this.shareDataDefault.href,

						success: res => {
							//console.log('success:' + JSON.stringify(res));
						},
						fail: e => {
							uni.showModal({
								//content: e.errMsg,
								content: '用户取消',
								showCancel: false
							});
						}
					});
					*/
				}
			});
		},

		save() {
			uni.showActionSheet({
				itemList: ['保存图片到相册'],
				success: () => {
					plus.gallery.save(
						'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png',
						function() {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							});
						},
						function() {
							uni.showToast({
								title: '保存失败，请重试！',
								icon: 'none'
							});
						}
					);
				}
			});
		},

		cancel() {
			this.showBoxView = false;
			this.$emit('onCancel');
		},
		show() {
			this.share();
		}
	}
};
</script>

<style lang="scss"></style>
