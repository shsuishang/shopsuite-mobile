<template>
    <view class="page">
        <view class="m-panel-bd">
            <view class="m-media-box m-media-box-small-appmsg">
                <view :class="{'m-cells':1, iconBoxLattice:1}">
                    <block v-for="(item, i) in PersonalCenterList.list" :key="i">
                        <view v-if="(item.id==3 && item.isShow)" data-url="/member/order/list?kind_id=1202" class="m-cell m-cell-access"
                              @click="goTabBar">
                            <view class="m-cell-hd " :style="{color:(item.color)}">
                                <label class="iconfont icon-time"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('我的预约')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </view>
                        <navigator v-if="(item.id==6 && item.isShow&&isMembership)" url="/member/member/task" class="m-cell m-cell-access">
                            <view class="m-cell-hd" :style="{color:item.color}">
                                <label class="iconfont icon-zuanshi"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <label>{{__('会员中心')}}</label>
                                <label style="color:#717171;margin-right:8rpx;float:right;" v-if="(PersonalCenterList.type!=2)">{{sprintf(__('你有%s积分'), UserInfo.user_points)}}</label>
                            </view>
                            <text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="(item.id==7 && item.isShow)" url="/member/member/favorites" class="m-cell m-cell-access">
                            <view class="m-cell-hd" :style="{color:(item.color)}">
                                <label class="iconfont icon-liwu"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('商品收藏')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </navigator>
                        <view v-if="(item.id==8 && item.isShow)" @click="selectAddress" class="m-cell m-cell-access">
                            <view class="m-cell-hd" :style="{color:(item.color)}">
                                <label class="iconfont icon-shouhuodizhi "></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('收货地址')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </view>
                        <navigator v-if="(item.id==9 && item.isShow&&isAbtVendor)" url="../about-store/about-store" class="m-cell m-cell-access">
                            <view class="m-cell-hd " :style="{color:(item.color)}">
                                <label class="iconfont icon-store"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('关于商家')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </navigator>
                        <navigator v-if="(item.id==10 && item.isShow)" url="/member/member/feedback" class="m-cell m-cell-access">
                            <view class="m-cell-hd " :style="{color:(item.color)}">
                                <label class="iconfont icon-yonghufankui1"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('用户反馈')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </navigator>

                        <navigator v-if="(item.id==12 && item.isShow)" url="/integratShop/integralPage/integralPage" class="m-cell m-cell-access">
                            <view class="m-cell-hd " style="color:#db384c">
                                <label class="iconfont icon-jifenshangcheng-"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <p>{{__('积分商城')}}</p>
                            </view>
                            <text class="m-cell-ft"></text>
                        </navigator>

                        <view v-if="(item.id==11 && item.isShow)" class="m-cell m-cell-access" @click="cleanCache">
                            <view class="m-cell-hd " :style="{color:item.color}">
                                <label class="iconfont zc zc-qingchuhuancun"></label>
                            </view>
                            <view class="m-cell-bd m-cell-primary">
                                <label>{{__('清除缓存')}}</label>
                                <label style="color:#717171;margin-right:8rpx;float:right;"  v-if="(PersonalCenterList.type!=2)">{{currentSize}}KB</label>
                            </view>
                            <text class="m-cell-ft"></text>
                        </view>
                    </block>
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
        name: "asset",
        data: function() {
            return {
                message: "",
                signMsg: "",
                UserInfo: "",
                flag: false,
                flag1: false,
                isSign: true
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('')
            });

            var that = this;


            this.forceUserInfo(function(user) {
                that.setData({
                    UserInfo: user
                });
                that.load();
            });

        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            load: function() {
                var that = this,
                    params = {
                        user_id: this.userInfo.user_id,
                    };

                that.$.request({
                    url: this.Config.URL.user.signState,
                    data: params,
                    success: function(data, status, msg, code) {
                        that.setData({
                            isSign: data.state == 250 ? 1 : 0
                        })
                    }
                });


                that.setData({
                    message: this.userInfo
                })
                /*
                that.getUserData(function(user_data) {
                    that.getUserResource(function(resource) {
                        resource['user_level_name'] = user_data.member_info.user_level_name
                        resource['user'] = user_data

                        if (that.$.isNull(resource.user_growth)) {
                            resource.user_growth = 0;
                        }

                        that.setData({
                            message: resource
                        })
                    });
                });
                */

            },

            click: function() {
                var that = this,
                    param = {
                        user_id: this.userInfo.user_id,
                        store_id: this.shopInfo.store_id
                    };

                that.$.request({
                    url: this.Config.URL.user.signIn,
                    data: param,
                    success: function(data, status, msg, code) {

                        that.setData({
                            flag: !that.$.isNull(data)
                        });
                        that.setData({
                            signMsg: msg
                        });
                        if (200 == status) {
                            that.setData({
                                flag: true
                            });
                            setTimeout(function() {
                                that.setData({
                                    flag: false
                                })
                            }, 2e3)
                        } else {
                            that.setData({
                                flag1: true
                            });
                            setTimeout(function() {
                                that.setData({
                                    flag1: false
                                })
                            }, 2e3);
                        }

                        that.load()
                    }
                });
            }

        }
    };
</script>


<style lang="scss">

    @import "../../styles/_variables.scss";

    .member-top {
        -webkit-animation: changeBg 20s infinite;
        animation: changeBg 20s infinite;
        background-color: #ff6700;
        background-image: url("data:image/png;base64,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");
        background-size: cover;
        text-align: center;
        width: 100%;
        /*height: 11rem;*/

        overflow: hidden;
        height: 320rpx;

        color: #fff;
        position: relative;
        z-index: 1;
    }

    @-webkit-keyframes changeBg {
        0% {
            background-color: #ff6700
        }

        90% {
            background-color: #ff6700
        }

        10% {
            background-color: #FB6E52
        }

        20% {
            background-color: #FFCE55
        }

        30% {
            background-color: #A0D468
        }

        40% {
            background-color: #48CFAE
        }

        50% {
            background-color: #4FC0E8
        }

        60% {
            background-color: #5D9CEC
        }

        70% {
            background-color: #AC92ED
        }

        80% {
            background-color: #EC87BF
        }
    }

    @keyframes changeBg {
        0% {
            background-color: #ff6700
        }

        90% {
            background-color: #ff6700
        }

        10% {
            background-color: #FB6E52
        }

        20% {
            background-color: #FFCE55
        }

        30% {
            background-color: #A0D468
        }

        40% {
            background-color: #48CFAE
        }

        50% {
            background-color: #4FC0E8
        }

        60% {
            background-color: #5D9CEC
        }

        70% {
            background-color: #AC92ED
        }

        80% {
            background-color: #EC87BF
        }
    }

    .m-banner-img {
        width: 100%;
        /*height: 200rpx;*/
        vertical-align: top;
        position: relative;
    }

    .m-user-info {
        position: absolute;
        top: 115rpx;
        width: 140rpx;
        height: 140rpx;
        text-align: center;
        left: 50%;
        margin-left: -70rpx;
        z-index: 3;
        color: #666;
    }

    .m-user-info image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 120rpx;
        border: 1px solid #fff;
        vertical-align: middle;
        box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);
    }

    .m-user-info text {
        line-height: 70rpx;
        display: block;
        font-size: 28rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
        font-weight: bold;
    }

    .m-user-info .Phone {
        width: 140rpx;
        height: 140rpx;
        border-radius: 120rpx;
        border: 1px solid #fff;
        vertical-align: middle;
        box-shadow: 0px 2rpx 15rpx rgba(0, 0, 0, 0.35);
        overflow: hidden;
    }

    .m-user-info .NickName {
        line-height: 70rpx;
        display: block;
        font-size: 28rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .member-order-tab {
        font-size: 12px;
        text-align: center;
        background: rgba(0, 0, 0, .1);
        line-height: 20px;
        /*box-shadow: 0px 0rpx 10rpx rgba(0, 0, 0, 0.35);*/

        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .i-type {
        font-size: 40rpx;
    }

    .m-cell-hd {
        text-align: center;
        line-height: 56rpx;
    }

    .member-order-tab .g-flex-item {
        padding: 28rpx 0 20rpx 0;
    }

    .member-order-tab .g-flex-item:active {
        background-color: #ececec;
    }

    .my_od {
        border-left: 1px solid #dfdfdf;
    }

    .all_order {
        position: relative;
        display: block;
    }

    .m-panel-bd {
        margin-top: 40rpx;
    }

    .m-panel-bd label {
        vertical-align: middle;
        font-size: 50rpx;
        margin: 0rpx 10rpx;
    }

    .m-cell-primary {
        font-size: 14px;
        margin-top: 10rpx;

        label {
            font-size: 14px;
        }
    }

    .m-animate-img {
        width: 100%;
        height: 250rpx;
        overflow: hidden;
        -webkit-animation: imageAnimation 15s linear infinite alternate;
        animation: imageAnimation 15s linear infinite alternate;
        webkit-backface-visibility: hidden;
        -webkit-filter: blur(5px);
        filter: blur(5px);
        margin-top: -20px;
    }

    .m-animate-warp {
        overflow: hidden;
        height: 200rpx;
        -webkit-animation: imageAnimation 15s linear infinite alternate;
        animation: imageAnimation 15s linear infinite alternate;
    }

    @-webkit-keyframes imageAnimation {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 0 100%;
        }
    }

    @keyframes imageAnimation {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 0 100%;
        }
    }

    .iconBoxLattice .m-cell {
        display: inline-block;
        width: 25%;
        box-sizing: border-box;
        text-align: center;
        border-right: 1rpx solid #f8f8f8;
        border-bottom: 1rpx solid #f8f8f8;
    }

    .iconBoxLattice .m-cell .iconfont {
        font-size: 60rpx;
    }

    .iconBoxLattice .m-cell::before {
        border: none;
    }

    .iconBoxLattice .m-cell p {
        font-size: 24rpx;
    }

    .iconBoxLattice .m-cell image {
        display: inline-block !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 60rpx !important;
        height: 60rpx !important;
    }

    .iconBoxLattice .m-cell-ft {
        display: none;
    }


    .msk {
        position: fixed;
        top: 0;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .model {
        width: 80%;
        height: 290rpx;
        background: #fff;
        border-radius: 6rpx;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0
    }

    .hint {
        height: 200rpx;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .hint::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        border-bottom: 1px solid #e5e5e5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
    }

    .hint .title {
        font-size: 36rpx;
    }

    .hint .content {
        width: 80%;
        color: #999999;
        font-size: 30rpx;
        margin-top: 20rpx
    }

    .operation {
        height: 90rpx;
        display: flex;
        align-items: center
    }

    .cancel,
    .success {
        flex: 1;
        background: #fff;
        height: 90rpx;
        font-size: 36rpx
    }

    button::after {
        line-height: none
    }

    .cancel {
        position: relative;
        text-align: center;
        line-height: 90rpx
    }

    .success {
        color: #3cc51f;
        padding: 0
    }

    .cancel::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        border-right: 2px solid #e5e5e5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
    }
</style>
