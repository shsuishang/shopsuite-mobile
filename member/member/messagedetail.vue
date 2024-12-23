<template>
	<view>
		<view class="article-meta">
			<text class="article-author">{{article_row.message_kind==2 ? article_row.user_other_nickname : article_row.user_nickname}}</text>
			<text class="article-text">{{__('发送于')}}</text>
			<text class="article-time">{{article_row.message_time_str}}</text>


      <!-- #ifdef MP-WEIXIN -->
      <view class="link_kfu">
        <!-- #ifdef MP-WEIXIN -->
        <block v-if="1==plantformInfo.kefu_type_id">
          <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
        </block>
        <!-- #endif -->

        <uni-icons type="chat" size="20" style="margin-left: 16rpx;color: gray;" @click="tochat(article_row.user_other_id)" />
      </view>
      <!-- #endif -->

		</view>
		<view class="article-content cke_editable">
			<u-parse :content="htmlString + ' '" @navigate="navigate"  @preview="preview" :imageProp="{lazyLoad:true}"></u-parse>
		</view>
	</view>
</template>

<script>

	import dateUtil from "../../helpers/util_date";
	import uParse from '@/components/u-parse/u-parse.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				message_id: 0,
				article_row: {},
				htmlString: "",
			}
		},
		components: {
			uParse
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),

		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('消息详情')
			});

			this.message_id = decodeURIComponent(options.message_id);
			this.getDetail();

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setMsgNum']),
			getDetail() {
				let that = this;
				var params = {
					message_id: this.message_id
				};

				that.$.request({
					url: this.Config.URL.user.msg_get,
					data: params,
					dataType: 'json',
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: (data, status) => {
						if (status == 200) {
							let tmp = data.message_content + '';
							//this.htmlString = tmp.replace(/\\/g, "").replace(/<img/g, "<img style=\"display:none;\"");
							this.htmlString = tmp;

							data['message_time_str'] = dateUtil.dateUtils.format(that.$.formatDateFormatter(data['message_time']));


							this.setData({
								article_row: data
							})

							if (this.hasLogin)
							{
								this.checkNewMsg();
							}
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
				// #ifdef APP-PLUS
				var $href = that.$.sprintf('%s/tmpl/article_show.html?article_id=%d&FX=%d', this.Config.WapSiteUrl, this.Id, this.userInfo
					.user_id);

				$href = that.$.sprintf('%s/h5/pagesub/article/detail?id=%d&uid=%d', that.Config.SiteUrl, this.Id, this.userInfo.user_id);
				// #endif
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

				this.$refs.shareBoxApp.show()
			},
			tochat(id){
				uni.navigateTo({
					url:"/im/chat/chat?uid=" + id
				})
			},
			preview(src, e) {
			  // do something
			},
			navigate(href, e) {
			  // do something
			  console.info(href);
			  console.info(e);

			  //this.$.gopage(href);
			},
			checkNewMsg:function(){
				if (this.hasLogin)
				{
				}
				else
				{
					return ;
				}

				// 统计一下未读的消息
				var that = this;
				var params = {
					recently_flag:1
				} ;
				//领取操作
				that.$.request({
					url: that.Config.URL.user.msg_count,
					loading: false,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setMsgNum(data.num);
						}
						else
						{
							//that.setMsgNum(0);
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/components/u-parse/u-parse.css");
	
	.banner {
		height: 360rpx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: white;
		z-index: 11;
	}

	.article-meta {
		padding: 20rpx 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26rpx;
		line-height: 50rpx;
		margin: 0 20rpx;
	}

	.article-author,
	.article-time {
		font-size: 30rpx;
	}

	.article-content {
		padding: 0 30rpx;
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}

	/*
Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/

.cke_editable {
  font-size: 26rpx;
  line-height: 2;
  /* Fix for missing scrollbars with RTL texts. (#10488) */
  word-wrap: break-word;

  blockquote {
    font-style: italic;
    font-family: Georgia, Times, "Times New Roman", serif;
    padding: 4rpx 0;
    border-style: solid;
    border-color: #ccc;
    border-width: 0;
  }


  a {
    color: #0782C1;
  }

  ol, ul, dl {
    /* IE7: reset rtl list margin. (#7334) */
    /* *margin-right: 0px; */
    /* Preserved spaces for list items with text direction different than the list. (#6249,#8049)*/

    margin-left: 0px;
  }

  ul{
    display: block !important;
    list-style-type: disc !important;

    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 80rpx;
    li{
      display: list-item!important;
      list-style: disc!important;;
    }
  }
  ol{
    display: block !important;
    list-style-type: decimal !important;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 80rpx;

    li{
      display: list-item !important;
      list-style-type: inherit !important;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    line-height: 1.2;
  }

  hr {
    border: 0px;
    border-top: 1px solid #ccc;
  }

  img {
    &.right {
      border: 1px solid #ccc;
      float: right;
      margin-left: 15px;
      padding: 5px;
    }
    &.left {
      border: 1px solid #ccc;
      float: left;
      margin-right: 15px;
      padding: 5px;
    }
  }

  pre {
    white-space: pre-wrap;
    /* CSS 2.1 */
    word-wrap: break-word;
    /* IE7 */
    -moz-tab-size: 4;
    tab-size: 4;
  }

  .marker {
    background-color: Yellow;
  }

  span[lang] {
    font-style: italic;
  }

  figure {
    text-align: center;
    outline: solid 1px #ccc;
    background: rgba(0, 0, 0, 0.05);
    padding: 10px;
    margin: 10px 20px;
    display: inline-block;
    > figcaption {
      text-align: center;
      display: block;
      /* For IE8 */
    }
  }

  a > img {
    padding: 1px;
    margin: 1px;
    border: none;
    outline: 1px solid #0782C1;
  }

  /* Widget Styles */

  .code-featured {
    border: 5px solid red;
  }

  .math-featured {
    padding: 20px;
    box-shadow: 0 0 2px rgba(200, 0, 0, 1);
    background-color: rgba(255, 0, 0, 0.05);
    margin: 10px;
  }

  .image-clean {
    border: 0;
    background: none;
    padding: 0;
    > figcaption {
      font-size: .9em;
      text-align: right;
    }
  }

  .image-grayscale {
    background-color: white;
    color: #666;
    img {
      filter: grayscale(100%);
    }
  }

  img.image-grayscale {
    filter: grayscale(100%);
  }

  .embed-240p {
    max-width: 426px;
    max-height: 240px;
    margin: 0 auto;
  }

  .embed-360p {
    max-width: 640px;
    max-height: 360px;
    margin: 0 auto;
  }

  .embed-480p {
    max-width: 854px;
    max-height: 480px;
    margin: 0 auto;
  }

  .embed-720p {
    max-width: 1280px;
    max-height: 720px;
    margin: 0 auto;
  }

  .embed-1080p {
    max-width: 1920px;
    max-height: 1080px;
    margin: 0 auto;
  }
}

.cke_contents_ltr blockquote {
  padding-left: 20px;
  padding-right: 8px;
  border-left-width: 5px;
}

.cke_contents_rtl blockquote {
  padding-left: 8px;
  padding-right: 20px;
  border-right-width: 5px;
}

.link_kfu {
  position: relative;
  text-align: center;
  margin-top: 0rpx;
  height: 50rpx;
  line-height: 50rpx;

  .kfu_txt {
    margin-left: 20rpx;
  }
}

.link_kfu contact-button {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>
