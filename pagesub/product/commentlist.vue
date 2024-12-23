<template>
	<view class="page"><view class="m-tab">
		<view class="m-navbar">
			<view :class="['m-navbar-item', (TapIndex==1?'m-navbar-item-on':'')]" @click="picDetail">
				{{__('好评')}}（{{PraiseNum}}）
			</view>
			<view :class="['m-navbar-item', (TapIndex==2?'m-navbar-item-on':'')]" @click="spcParam">
				{{__('中评')}}（{{SatisfiedNum}}）
			</view>
			<view :class="['m-navbar-item', (TapIndex==3?'m-navbar-item-on':'')]" @click="packingList">
				{{__('差评')}}（{{BadNum}}）
			</view>
		</view>
	</view>
		<scroll-view scroll-y="true" class="m-panel-bd scroll-box" @scrolltolower="scrollPage">
			<view class="m-media-box m-media-box-appmsg" v-for="(item, index) in CommentList"  :key="index">
				<view class="m-media-box-hd">
					<image lazy-load class="m-media-box-thumb" :src="(item.user_avatar)" />
				</view>
				<view class="m-media-box-bd">
					<label class="m-media-box-title">{{item.user_name}}</label>
					<view class="m-media-box-desc">
						<view style="margin-bottom:10rpx;">
							<label  style="margin-right:10rpx;font-size:20rpx;">
								{{item.item_name}}
							</label>
						</view>
						<label v-if="(item.comment_content!=null)" >{{item.comment_content}}</label>
					</view>
					<view class="m-media-box-info">
						<view class="m-media-box-info-meta m-start" v-for="(itemIndex, ii) in [1, 2, 3, 4, 5]"  :key="ii">
							<label :class="'iconfont icon-start ' + (itemIndex<=item.comment_scores)?'sel':''" :data-index="(itemIndex)" :data-type="1" @click="ServiceStart"></label>
						</view>
						<view class="m-media-list">
							<image lazy-load :data-id="(item.comment_id)" v-for="(items, ii) in item.comment_images"  :key="ii" :src="(items)" @click="ImgTap"></image>
						</view>
						<view class="m-media-box-info-meta m-tiem">{{item.comment_time}}</view>
						
						<view class="zihuifu_box"  v-if="item.comment_reply_num>0">
						    <block v-for="(reply_items, indexs) in item.comment_reply" :key="indexs">
						        <view class='z_title_box'>
						            <view class='z_box_touxiang'>
						                <image class='z_box_touxiang'
						                       :src='reply_items.user_avatar'></image>
						            </view>
						            <view class='zihuifu_name uni-ellipsis'>
						                <span>{{reply_items.user_nickname}}</span>
						            </view>
						        </view>
						        <view class='zihuifu_text'>{{reply_items.comment_reply_content}}</view>
						        <view class='neirong_time'>
						            <view class='z_neirong_time_time'>
						                <span>{{reply_items.comment_reply_time}}</span>
						            </view>
						        </view>
						    </block>
						</view>
					</view>
					<view v-if="item.comment_reply_list">
						<view v-for="(replyRow, r) in item.comment_reply_list" :key="r" class="m-reply">
							<view>
								{{replyRow.user_name}}<label style="color: #888;margin-left: 5rpx;">{{__('回复：')}}</label>{{replyRow.comment_reply_content}}
							</view>
							<view style="color: #CECECE;font-size: 24rpx;text-align: right;">
								{{replyRow.comment_reply_time}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="m-loading-box">
				<block v-if="(ispage)">
					<view class="u-loadmore">
						<label class="u-loading"></label>
						<text class="u-loadmore-tips">{{__('正在加载')}}</text>
					</view>
				</block>
				<block v-else>
					<view class="u-loadmore u-loadmore-line">
						<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				isStoreFlag: 0,
				viewtype: 1,
                CommentList: [],
                TapIndex:1,
				pdlist: [],
				fglist: [],
				sort: 2,
				flag: true,
				sku: '',
				ispage: true,
				scposition: "",
				istop: false,
				isdata: false,
				isVirtual: false,
				post: {sidx: 'product_sale_num', sord: 'DESC', isnew: false, keywords: "", store_category_ids: 0, curpage: 1, store_id:null},
                PraiseNum: 0,
                SatisfiedNum: 0,
                BadNum: 0,
				pageIndex: 1,
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('评价列表')
			});

			this.setData({sku: options.id});
			this.initData();
		},
		methods: {

			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			picDetail: function () {
				this.setData({TapIndex: 1, pageIndex: 1, flag: true, ispage: true, CommentList: []}), this.initData()
			},
			spcParam: function () {
				this.setData({TapIndex: 2, pageIndex: 1, flag: true, ispage: true, CommentList: []}), this.initData()
			},
			packingList: function () {
				this.setData({TapIndex: 3, pageIndex: 1, flag: true, ispage: true, CommentList: []}), this.initData()
			},
			initData: function () {
				var that = this;
                var params = {
					item_id: this.sku,

					comment_type: this.TapIndex,
					page: this.pageIndex,
					rows: this.rows,
				};
				that.$.request({
					url: this.Config.URL.product.product_comment,
					data: params,
					success: function (data, status, msg, code) {
						if (status == 200) {
							that.setData({
								PraiseNum: data.good,
								SatisfiedNum: data.satisfied,
								BadNum: data.bad
							});
							if (data.page * data.size >= data.records) {
								that.setData({
									flag: false,
									ispage: false,
									CommentList: that.CommentList.concat(data.items)
								})
							} else {
								that.setData({
									flag: true,
									ispage: true,
									CommentList: that.CommentList.concat(data.items)
								})
							}
						}
					}
				});

				/*
                that.$.xsr(that.$.makeUrl(api.getProductCommentList, params), function (t) {
                    //console.log("商品评论列表：", t), that.setData({
                        PraiseNum: t.Info.PraiseNum,
                        SatisfiedNum: t.Info.SatisfiedNum,
                        BadNum: t.Info.BadNum
                    }), t.Info != null ? t.Info.ProductCommentList.length < 10 ? that.setData({
                        flag: false,
                        ispage: false,
                        CommentList: that.CommentList.concat(t.Info.ProductCommentList)
                    }) : that.setData({
                        flag: true,
                        CommentList: that.CommentList.concat(t.Info.ProductCommentList)
                    }) : that.setData({flag: false, ispage: false})
                })
                */
			},
			scrollPage: function (e) {
				if (this.flag)
				{
					this.setData({flag: false});
					var t = this;
					clearTimeout(n);
					var n = setTimeout(function () {
								t.setData({pageIndex: parseInt(t.pageIndex) + 1}), t.initData()
							},
							500)
				}
			},
			ImgTap: function (e) {
				var that = this, n = [];
				for (var r in this.CommentList)
				{
					if (this.CommentList[r].comment_id == e.target.dataset.id)
					{
						for (var i in this.CommentList[r].comment_images)
						{
							n.push(this.CommentList[r].comment_images[i]);
						}
					}
				}
				var s = e.target.dataset.src;
				that.$.previewImage({current: s, urls: n})
			}
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar-item {padding: 20rpx 0;font-size: 24rpx;}
	.m-navbar-item:after {border: none;}
	.m-navbar-item.m-navbar-item-on {background-color: #fff;color: $default-skin-bg;}
	.m-navbar-item.m-navbar-item-on::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6rpx;border-bottom: 6rpx solid $default-skin-bg;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}
	.m-tips{margin: 40rpx auto;}
	.m-tab{position: fixed;top: var(--window-top);left: 0;width: 100%;z-index: 10;background-color: #fff;}
	.scroll-box{position: absolute;width: 100%;height: 100%;padding-top: 80rpx;box-sizing: border-box;background-color: #f8f8f8 !important;}
	.m-start label{font-size: 24rpx;}
	.m-media-box-info-meta{padding-right: 5rpx;}
	.sel{color: $default-skin-bg;font-size: 24rpx}
	.m-tiem{float: right;}
	.m-panel-hd label{float: right;}
	.m-panel-hd text{color: $default-skin-bg;margin-left: 10rpx;}
	.m-comment .m-media-box-info-meta{font-size: 24rpx;font-weight: 100;}
	.m-comment .m-media-box-hd{border-radius: 100%;overflow: hidden;vertical-align:top; }
	.m-media-list{float: left;width: 100%;}
	.m-media-list image{width: 115rpx;height: 115rpx;box-sizing: border-box;margin: 10rpx;border: 1rpx solid #eee;}
	.m-panel-bd{background-color: #fff;}
	.m-media-box-appmsg{align-items:initial;background-color: #fff;}
	.m-media-box-thumb{border-radius: 100%;}
	.m-media-box-desc{display: block; }
  .zihuifu_box {
        background-color: #f4f8fb;
        padding: 16rpx 0 16rpx 25rpx;
        font-size: 30rpx;
		clear:both;
    }

    .zihuifu_dengr {
        color: #4e4f51;
    }

    .gonghuifu {
        color: #387fd1;
    }

    .z_box_touxiang {
        width: 47rpx;
        height: 47rpx;
        border-radius: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .z_title_box {
        display: flex;
        align-items: center;
    }

    .zihuifu_name {
        font-size: 24rpx;
        color: #333;
        display: inline-block;
        padding: 0 10rpx;

        width: 500rpx;

        span {
            padding: 0 3rpx;
        }
    }

    .zihuifu_text {
        font-size: 26rpx;
        color: #3a3b3d;
        line-height: 50rpx;
        padding-left: 60rpx;
    }
	
	.neirong_time {
	    display: flex;
	    padding: 0rpx 0;
	}
	
	.z_neirong_time_time {
	    width: 388rpx;
	    font-size: 24rpx;
	    color: #7e7e7e;
	    display: flex;
	    align-items: center;
	    padding-left: 60rpx;
	}
	.m-reply {
		box-sizing: border-box;
		padding-top: 20rpx;
		background-color: #fff;
	}
</style>
