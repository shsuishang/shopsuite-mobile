<template name="share-box-app">
	<block></block>
</template>

<script>
	export default {
        name: "share-box-app",
        props: {
            shareDataDefault: {
                type: Object,
                default() {
                    return {
                        shareTitle: '',
                        shareText: '',
                        href: '',
                        image: ''
                    }
                },
            },
        },
		data(){
			return {
                showBoxView:false,
                shareType:0
			}
		},
		created() {
            uni.getProvider({
                service: "share",
                success: (e) => {
                    //console.log("success", e);
                    let data = []
                    for (let i = 0; i < e.provider.length; i++) {
                        switch (e.provider[i]) {
                            case 'weixin':
                                data.push({
                                    name: '分享到微信好友',
                                    id: 'weixin',
                                    sort: 0
                                })
                                data.push({
                                    name: '分享到微信朋友圈',
                                    id: 'weixin',
                                    type: 'WXSenceTimeline',
                                    sort: 1
                                })
                                break;
                            case 'sinaweibo':
                                data.push({
                                    name: '分享到新浪微博',
                                    id: 'sinaweibo',
                                    sort: 2
                                })
                                break;
                            case 'qq':
                                data.push({
                                    name: '分享到QQ',
                                    id: 'qq',
                                    sort: 3
                                })
                                break;
                            default:
                                break;
                        }
                    }
                    this.providerList = data.sort((x, y) => {
                        return x.sort - y.sort
                    });
                },
                fail: (e) => {
                    //console.log("获取登录通道失败", e);
                    uni.showModal({
                        content: "获取登录通道失败",
                        showCancel: false
                    })
                }
            });
		},
		methods:{

            share() {
				var that = this;

				//that.cf.LANG_ENABLE
				if (that.cf.LANG_ENABLE)
				{

					let content = this.shareDataDefault.shareTitle + "\n" + this.shareDataDefault.href + "\n";

					// #ifdef APP-PLUS
					//plus.runtime.openURL( schema );

					const downloadTask = uni.downloadFile({
						url: this.shareDataDefault.image,
						success: (res) => {
							console.info(res)
							if (res.statusCode === 200) {
								console.log('下载成功');
								let tmp_img = res.tempFilePath;

								//粘贴板数据
								//uni.setClipboardData({ data:content, success:function(data){}, fail:function(err){}, complete:function(res){} })

								//let msg = {type:"web", title:content, content:content,  href:this.shareDataDefault.href, pictures:[tmp_img]};
								let msg = {type:"image/*", title:content, content:content,  pictures:[tmp_img],  href:this.shareDataDefault.href};

								console.info(this.shareDataDefault.image)

								plus.share.sendWithSystem(msg, function(){
									console.log('分享成功');
								}, function(e){
									console.log('分享失败：'+JSON.stringify(e));
								});

								/*
                                let text_msg = {title:this.pname, content:this.desc || this.pname}

                                plus.share.sendWithSystem(text_msg, function(){
                                   console.log('分享成功');


                                }, function(e){
                                   console.log('分享失败：'+JSON.stringify(e));
                                });
                                */

							}
						}
					});
					// #endif

					return ;
				}

                if (this.providerList.length === 0) {
                    uni.showModal({
                        title: '当前环境无分享渠道!',
                        showCancel: false
                    })
                    return;
                }

                let itemList = this.providerList.map(function (value) {
                    return value.name
                })

                var that = this;

                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {

						//分享为微信小程序
						if (false && this.providerList[res.tapIndex].id == 'weixin' && this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSceneSession')
						{
							let mp_path = this.shareDataDefault.href.replace(that.cf.SiteUrl + "/h5", '');

							uni.share({
								provider: this.providerList[res.tapIndex].id,
								scene: "WXSceneSession",
								type: 5,
								imageUrl : this.shareDataDefault.image,
								title : this.shareDataDefault.shareTitle,

								miniProgram: {
									id: 'gh_d40b73e6ed8f',
									path: mp_path,
									type: 0,
									webUrl: this.shareDataDefault.href
								},
								success: (res) => {
									//console.log(this.imageUrl),
											//console.log("success:" + JSON.stringify(res));

									this.$emit('onShared');

								},
								fail: (e) => {
									uni.showModal({
										//content: e.errMsg,
										content: '用户取消',
										showCancel:false
									})
								}
							});
						}
						else
						{

							let share_type = 'qq'==this.providerList[res.tapIndex].id ? 2 : this.shareType;

							uni.share({
								provider: this.providerList[res.tapIndex].id,
								scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : "WXSceneSession",
								type: share_type,

								summary : this.shareDataDefault.shareText,
								imageUrl : this.shareDataDefault.image,
								title : this.shareDataDefault.shareTitle,
								href : this.shareDataDefault.href,

								success: (res) => {
									//console.log("success:" + JSON.stringify(res));
									this.$emit('onShared');
								},
								fail: (e) => {
									uni.showModal({
										//content: e.errMsg,
										content: '用户取消',
										showCancel:false
									})
								}
							});
						}
                    }
                })
            },

			save(){
				uni.showActionSheet({
					itemList:['保存图片到相册'],
					success: () => {
						plus.gallery.save('https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png', function() {
							uni.showToast({
								title:'保存成功',
								icon:'none'
							})
						}, function() {
							uni.showToast({
								title:'保存失败，请重试！',
								icon:'none'
							})
						});
					}
				})
			},

            cancel() {
                this.showBoxView = false;

                this.$emit('onCancel');
            },
            show() {
                this.share();
            }
		}
	}
</script>

<style lang="scss">
</style>
