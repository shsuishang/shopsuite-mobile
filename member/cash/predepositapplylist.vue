<template>
    <view class="page">
        <scroll-view class="m-scrollBox" v-if="(CaseDetailList.length>0)" scroll-y="true" @scrolltolower="scrollbottom">
            <view class="m-panel m-panel-access m-comment ">
                <view class="m-panel-bd">
                    <view v-for="(item, index) in CaseDetailList"  :key="index" class="m-media-box m-media-box-appmsg">
                        <view class="m-media-box-bd">
                            <label class="m-media-box-title">{{item.withdraw_desc}}</label>
                            <label class="m-media-box-num">
                                <text>{{__('￥')}}{{item.withdraw_amount}}</text>
                                <text class="tag">{{item.withdraw_state==1 ? __('通过') : (item.withdraw_state==0 ? __('审核中') :  __('驳回'))}}</text>
                            </label>
                            <view class="m-media-box-info">
                                <view class="m-media-box-info-meta m-tiem">{{__('时间：')}}{{item.withdraw_time}}</view>
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
        <view class="m-nullcontent" v-else>
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <text>{{__('亲~什么都没有')}}</text>
                    <text>{{__('赶快去分享商品，赚取收益吧!')}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		name: "predeposit",
		data: function() {
			return {
                tapindex: 1, page: 1, ispage: true, flag: true, CaseDetailList: []
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('提现明细')
            });

            this.setData({CaseDetailList: []}), this.InitData()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            InitData: function () {
                var params = {page: this.page},
                    that = this;
                that.$.request({
                    url: this.Config.URL.pay.consume_withdraw,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200) {
                            if (data.page >= data.total) {
                                that.setData({
                                    CaseDetailList: that.CaseDetailList.concat(data.items),
                                    flag: false,
                                    ispage: false
                                })
                            } else {
                                that.setData({
                                    CaseDetailList: that.CaseDetailList.concat(data.items),
                                    flag: true,
                                    ispage: true
                                })
                            }
                        } else {
                            that.setData({flag: false, ispage: false})
                        }
                    }
                });
            },
            scrollbottom: function () {
                if (this.flag)
                {
                    var e = this;
                    e.setData({flag: false}), clearTimeout(t);
                    var t = setTimeout(function () {
                            e.setData({page: parseInt(e.page) + 1}), e.InitData()
                        },
                        500)
                }
            },
            allTypes: function () {
                this.setData({
                    tapindex: 1,
                    page: 1,
                    ChangeType: 0,
                    ispage: true,
                    flag: true,
                    CaseDetailList: []
                }), this.InitData()
            },
            expenditure: function () {
                this.setData({
                    tapindex: 2,
                    page: 1,
                    ChangeType: 1,
                    ispage: true,
                    flag: true,
                    CaseDetailList: []
                }), this.InitData()
            },
            income: function () {
                this.setData({
                    tapindex: 3,
                    page: 1,
                    ChangeType: 2,
                    ispage: true,
                    flag: true,
                    CaseDetailList: []
                }), this.InitData()
            }
		}
	}
</script>


<style lang="scss">
    @import "../../styles/_variables";

    .m-media-box-thumb{border-radius: 100%;overflow: hidden;}
    .m-media-box-num{float: right;font-size: 32rpx;}
    .m-media-box-num text{color:$default-skin-bg;}
    .m-media-box-info{-webkit-box-flex:2;-webkit-flex:2;flex:2;}
    .m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;}
    .m-scrollBox{position: absolute;box-sizing: border-box;width: 100%;height: 100%; }
    .m-panel{margin-top:-4rpx;}
    .m-num{float: right;color: $default-skin-bg}
    .m-panel-hd label{color: $default-skin-bg;font-size: 28rpx;margin-left: 20rpx;}
    .m-media-box{padding-top:20rpx;padding-bottom: 20rpx;line-height: 40rpx;}
    .m-media-box-info{margin-top:5rpx;}
    .m-media-box-title{font-size: 28rpx;}
</style>
