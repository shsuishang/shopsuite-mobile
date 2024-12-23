<template>
	<view class="container">

    <view class="banner" v-if="article_row.article_image">
			<image class="banner-img" :src="article_row.article_image"></image>
		</view>

    <view class="main">
      <view class="title">{{article_row.article_title}}</view>
      <view class="article-meta">
        <text class="article-author">{{article_row.user_nickname}}</text>
        <text class="article-text"> {{__('发表于')}} </text>
        <text class="article-time">{{article_row.article_add_time}}</text>
      </view>
      <view v-html="htmlString" class="helpContent"/>
    </view>

		<share-box-mp :PageQRCodeInfo="PageQRCodeInfo" @cancelShare="cancelShare" @showCodeImg="showCodeImg" @shareQRCode="shareQRCode"
		 @saveImg="saveImg"></share-box-mp>
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->

	</view>
</template>

<script>
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'

	//#ifdef H5
	import shareBoxH5 from '../../components/share-box-h5.vue'
	//#endif

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				Id: 0,
				article_row: {},
				htmlString: "<div>loading....<div>",

				PageQRCodeInfo: {
					Path: "",
					IsShare: !1,
					IsShareBox: !1,
					IsJT: !1
				},
        shareData:{}
			}
		},
		components: {
			shareBoxMp,
			shareBoxApp,
			//#ifdef H5
			shareBoxH5
			//#endif
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onShareAppMessage() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				title: this.article_row.article_title,
				path: "/pagesub/article/detail?id=" + this.Id + "&uid=" + this.userInfo.user_id
			}
		},
		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function () {
			return {
				title: this.article_row.article_title,
				query: {
					uid: this.userInfo.user_id,
					id: this.Id
				}
			}
		},

		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('资讯详情')
			});

			this.setData({
				options: options
			})

			this.Id = decodeURIComponent(options.id);
			this.getDetail();

		},

		onBackPress() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif


			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
				return true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
		},
		onUnload() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif

			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},
		onNavigationBarButtonTap(e) {
			var that = this;

			if (e.index === 0) {
				that.onShareBox(e);
				/*
				that.setData({
					shareBoxFlag: 1,
					shareContetnFlag: 1
				})
				*/
			} else {
				uni.showToast({
					title: "你点了收藏按钮",
					icon: "none"
				})
			}
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getDetail() {
				let that = this;
				var params = {
					article_id: this.Id
				};
				that.$.request({
					url: this.Config.URL.cms.get,
					data: params,
					dataType: 'json',
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: (data, status) => {
						if (status == 200) {
							this.htmlString = data.article_content.replace(/\\/g, "");

              var list = this.htmlString
              list.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                if(capture.indexOf('http')==-1){
                  list=list.replace(match,"<img  style='width:100%;height:auto;display:block' src='https:"+capture+"'/>")
                }else{
                  list=list.replace(match,"<img  style='width:100%;height:auto;display:block' src='"+capture+"'/>")
                }
              });
              this.htmlString = list

							this.setData({
								article_row: data
							})


							that.$.setNavigationBarTitle({
								title: data.article_title
							})

							setTimeout(function() {
								//初始化微信分享
								let $title = data.article_title;
								let $desc = '';
								let $link =  that.$.sprintf('%s/h5/pagesub/article/detail?id=%s', that.Config.SiteUrl, that.Id);
								let $img_url = data.article_image;

								//初始化微信分享
								that.$.wxShare($title, $desc, $link, $img_url)
							}, 100);

						}
					},
					fail: () => {
						//console.log('fail');
					}
				})
			},
			onShareBox: function(e) {
				let that = this;
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容

				var $href = that.$.sprintf('%s/tmpl/article_show.html?article_id=%d&FX=%d', this.Config.WapSiteUrl, this.Id, this.userInfo
					.user_id);

				$href = that.$.sprintf('%s/h5/pagesub/article/detail?id=%d&uid=%d', that.Config.SiteUrl, this.Id, this.userInfo.user_id);

				// #ifdef MP-WEIXIN
				var $href = "/pagesub/article/detail?id=" + this.Id + "&uid=" + this.userInfo.user_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.article_row.article_title,
						shareText: this.article_row.article_title,
						href: $href,
						image: this.article_row.article_image
					}
				});

				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				// #endif


				// #ifdef MP-WEIXIN
				this.$refs.shareBoxMp.show();
				// #endif

				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif
			}
		}
	}
</script>

<style lang="scss">
page{
  background-color: #fff !important;
}
.container{
  .banner{
    .banner-img{width: 100%;}
  }
  .main{
    margin:0 30rpx;
    padding: 20rpx 0;
    font-size: 28rpx;
    .title{
      font-size: 30rpx;
      font-weight: 700;
    }
    .article-meta{
      color: #8c8c8c;
      font-size: 28rpx;
      text-align: right;
      padding-bottom: 10rpx;
    }
  }
}
</style>
