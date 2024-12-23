<template>
    <view class="page">
        <scroll-view scroll-y="true" class="m-product-all u-pa" @scrolltolower="scrollbottom" scroll-top="(scposition)" v-if="(isdata)">
            <view class="m-product-list">
                <view v-for="(item, index) in PInfo"  :key="index" class="m-product-item" :data-sid="(item.store_id)"  bindtouchstart="removestart" bindtouchmove="removeload" bindtouchend="removeend" :data-id="(item.store_id)" :data-store_type="(item.store_type)" @click="gotoProduct">
                    <view :class="'m-item-c ' + ((item.store_id==T_Id)?'del':'')">
                        <view class="m-product-img">
                            <image lazy-load :src="(item.store_logo)" />
                        </view>
                        <view class="m-product-info">
                            <view class="m-product-name">
                                <label>{{item.store_name}}</label>
                            </view>
                        </view>
                        <view class="u-del" :data-id="(item.store_id)" @click.stop="cancelCollection">
                            {{__('取消收藏')}}
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
        <navigator url="/pages/index/index" open-type="switchTab" class="m-nullpage" v-else>
            <view class="m-nullpage-middle">
                <label class="iconfont icon-meiyougengduo"></label>
                <view class="m-null-tip">
                    <text>{{__('什么都没有')}}</text>
                    <text class="m-null-tipck" style="margin-top:20rpx">{{__('马上去选几件中意的商品')}}</text>
                </view>
            </view>
        </navigator>
    </view>
</template>


<script>

    import $ from "../../helpers/util";
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        name: "asset",
        data: function() {
            return {
                isdata: true,
                PInfo: [],
                X_Start: 0,
                X_End: 0,
                T_Id: 0,
                page: 1,
                ispage: true,
                flag: true,
                rows: 8
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function(options) {
            var that = this;
			
		
			uni.setNavigationBarTitle({
				title:this.__('店铺收藏')
			});
				
            this.GetCollectionList(function () {
                that.setData({
                    isdata: that.PInfo.length == 0 ? false : true
                })
            })
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            cancelCollection: function (obj) {

                var that = this;

                that.$.showModal({
                    title: that.__('提示'),
                    content: that.__('确认要取消这个店铺吗？'),
                    showCancel: true,
                    success: function (n) {

                        if (n.confirm) {

                            var params = {
                                store_id: obj.currentTarget.dataset.id
                            };

                            that.$.request({
                                url: this.Config.URL.user.wish_store_remove,
                                data: params,
                                success: function (data, status, msg, code) {
                                    if (status == 200) {
                                        that.setData({
                                            isCollection: false
                                        });
                                        that.$.alert(that.__("已取消收藏！"));
                                    }
                                    that.setData({
                                        PInfo: [], page: 1
                                    });
                                    that.GetCollectionList()
                                }
                            });
                        }
                    }
                })
            },
            GetCollectionList: function (callback) {
                this.setData({
                    flag: false
                });
                var params = {
                        page: this.page,
                        rows: this.rows
                    },
                    that = this;
                that.$.request({
                    url: this.Config.URL.user.wish_store_lists,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            if (data.page >= data.total) {
                                that.setData({
                                    PInfo: that.PInfo.concat(data.items),
                                    flag: false,
                                    ispage: false
                                })
                            } else {
                                that.setData({
                                    PInfo: that.PInfo.concat(data.items),
                                    flag: true, ispage: true
                                })
                            }
                        } else {
                            that.setData({
                                flag: false,
                                ispage: false
                            })
                        }
                        callback && callback();
                    }
                });
            },
            scrollbottom: function (e) {
                if (this.flag)
                {
                    var that = this;
                    that.setData({flag: false}), clearTimeout(n);
                    var n = setTimeout(function () {
                        that.setData({
                            page: parseInt(that.page) + 1
                        }), that.GetCollectionList()
                    }, 500)
                }
            },
            gotoProduct: function (e) {
                // 商品页面，虚拟商品和实物商品同页面
                // var url = that.$.createUrl("/pagesub/product/detail", {pid:e.currentTarget.dataset.pid});

                // that.$.redirectTo(url);

				if(e.currentTarget.dataset.store_type == 3){
					this.$.gopage('/pages/index/rura_store?store_id='+e.currentTarget.dataset.id)
				}else{
					this.$.gopage('/pagesub/index/store?store_id='+e.currentTarget.dataset.id)
				}

            },
            removestart: function (e) {
                this.setData({
                    X_Start: e.changedTouches[0].clientX
                })
            },
            removeload: function (e) {
                this.setData({
                    X_End: e.changedTouches[0].clientX
                })
            },
            removeend: function (e) {
                this.setData({
                    X_End: e.changedTouches[0].clientX
                });
                this.direction(e.currentTarget.dataset.id)
            },
            direction: function (e) {
                var t = {xstart: this.X_Start, xend: this.X_End};
                if (t.xstart > t.xend) {
                    if (t.xstart - t.xend > 100) {
                        this.setData({
                            T_Id: e
                        })
                    }
                } else {
                    this.setData({
                        T_Id: 0
                    })
                }
            }
        }
    };
</script>


<style lang="scss">
    @import "../../styles/_variables";

    .m-product-item{position: relative;overflow: hidden}
    .u-del{width: 150rpx;background-color: $default-skin-bg;float: right;height: 100%;color: #fff;font-size: 28rpx;text-align: center;line-height: 212rpx;}
    .m-item-c{position: absolute;height: 100%;width: 900rpx;}
    .del{-webkit-animation: mdel .2s  1;animation: mdel .2s  1;left: -150rpx;}
    .m-addCart{float: right;color: #888;font-size: 38rpx !important;margin-right: 40rpx;}
    @-webkit-keyframes mdel {
        0% {left: 0;}
        100% {left: -150rpx;}
    }
    @keyframes mdel {
        0% {left: 0;}
        100% {left: -150rpx}
    }
    .u-pa .m-product-list {padding: 0;}
</style>
