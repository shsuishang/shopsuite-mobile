<template>
    <view class="page">

        <scroll-view class="m-product-all" scroll-y="true" @scrolltolower="scrollbottom" style="width:100%;height:100%;position: absolute;">
            <view class="header">
                <view class="num">{{resource.user_points}}<label style="font-size:34rpx">分</label></view>
                <navigator url="/pages/index/index" open-type="switchTab" class="goshop">去赚积分</navigator>
            </view>
            <view class="detail">
                <view class="detail-left">
                    <text class="highlight">积分明细</text>
                </view>
            </view>
            <view v-if="(list.length>0)"  class="m-orderlist" >
                <view class="detail" v-for="(items, index) in list"  :key="index">
                    <view class="detail-left">
                        <text>{{items.points_type_desc}}</text>
                        <view class="time" style="margin-top:20rpx">{{items.points_log_time}}</view>
                    </view>

                    <view class="detail-right">{{items.desc}}
                        <label class="money add pprice" v-if="(items.points_log_points > 0)">+{{items.points_log_points}}</label>
                        <label class="money add pprice" v-else >-{{items.points_log_points}}</label>
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
            </view>
            <view redirect="true" class="m-nullpage" v-else style="top:20%">
                <view class="m-nullpage-middle">
                    <view class="m-null-tip">
                        <text>亲~您还没有积分哦</text>
                    </view>
                </view>
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
        data: function() {
            return {
                resource: "", list: [], tapindex: 1, page: 1, ispage: false, flag: true, windowHeight: 0
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('积分明细')
            });


            let that = this;
            try
            {
                var sysInfo = that.$.getSystemInfoSync();
                this.setData({
                    windowHeight: sysInfo.windowHeight
                })
            }
            catch (n)
            {
                //console.log("Do something when catch error")
            }

            that.setData({resource: that.userInfo})

            this.getPointLists()
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            getPointLists: function () {
                var that = this, params = {user_id: this.userInfo.user_id, page: this.page};

                that.$.request({
                    url: this.Config.URL.user.points,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (200 == status) {
                            if (data.page >= data.total) {
                                that.setData({
                                    flag: false,
                                    ispage: false,
                                    list: that.list.concat(data.items)
                                })
                            } else {
                                that.setData({
                                    flag: true,
                                    ispage: true,
                                    list: that.list.concat(data.items)
                                })
                            }
                        } else {
                            that.setData({
                                flag: false,
                                ispage: false
                            })
                        }
                    }
                });

            },
            scrollbottom: function () {
                if (this.flag)
                {
                    var that = this;
                    that.setData({flag: false}), clearTimeout(t);
                    var t = setTimeout(function () {
                        that.setData({page: that.page + 1}), that.getPointLists()
                    }, 500)
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "../../styles/_variables";

    .header{
        width: 100%;
        height: 340rpx;
        background: $default-skin-bg;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center
    }
    .num{
        font-size: 108rpx;
        color: #fff;
        margin-left: 40rpx
    }
    .goshop{
        font-size: 24rpx;
        color: #fff;
        margin-top: 10rpx;
        border: 1px solid #fff;
        border-radius: 20rpx;
        padding: 6rpx 16rpx;
    }
    /* .detail{
      display: flex;
      justify-content: space-between;
      padding: 24rpx 30rpx;
      align-items: center;
      border-bottom:1px solid #d9d9d9;
      background: #fff;
      font-size: 28rpx
    } */
    .detail {font-size: 28rpx;padding: 24rpx 30rpx;position: relative;display: -webkit-box;display: -webkit-flex;display: flex;-webkit-box-align: center;-webkit-align-items: center;align-items: center;justify-content: space-between;background: #fff}
    .detail::before {content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-bottom: 1px solid #ebebe7;color: #ebebe7;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}
    .detail-left{
        color: #333;
    }
    .detail-left view{
        margin-top: 10rpx;
    }
    .detail-right{
        color: #505050
    }
</style>
