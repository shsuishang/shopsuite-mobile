<template>
    <view class="page">
        <view class="m-cells m-cells-form">
            <view class="m-cell" v-if="isSet">
                <view class="m-cell-hd"><label class="u-label">{{__('原支付密码')}}</label></view>
                <view class="m-cell-bd"><input class="u-input" v-model="old_pay_password" :password="showPassword" :placeholder="__('请输入原支付密码')"/></view>
                <view class="uni-icon uni-icon-eye m-cell-ft"  style="width: 100rpx;text-align: left;"  :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
                <view v-if="!old_pay_password" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('支付密码')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" v-model="pay_password"  :placeholder="__('请输入支付密码')" :password="showPassword" />
                </view>

				<view class="uni-icon uni-icon-eye m-cell-ft"  style="width: 100rpx;text-align: left;"  :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
                <view v-if="!pay_password" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>
            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('确认密码')}}</label></view>
                <view class="m-cell-bd"><input class="u-input" v-model="pay_password2" :password="showPassword" :placeholder="__('请再次输入支付密码')"/></view>
                <view class="uni-icon uni-icon-eye m-cell-ft"  style="width: 100rpx;text-align: left;"  :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
                <view v-if="!pay_password2" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>
            <view class="m-cell m-cell-vcode" v-if="false">
                <view class="m-cell-hd"><label class="u-label">{{__('验证码')}}</label></view>
                <view class="m-cell-bd"><input class="u-input" type="number" :placeholder="__('请输入验证码')" maxlength="6" @input="inputcode" /></view>
                <view v-if="!isCode" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
                <view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{btntext}}</view>
                <view v-else class="m-vcode-btn">{{btntext}}</view>
            </view>
        </view>
        <view class="btn_box"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>
    </view>
</template>


<script>

import { mapState, mapMutations } from 'vuex';

export default {
    name: 'asset',
    data: function() {
        return {
            old_pay_password: '',
            pay_password: '',
            pay_password2: '',
            isSet: false,
            showPassword: true,

            Phone: '',
            Code: '',
            btntext: this.__('发送'),
            isSend: true,
            isPhone: true,
            sendTime: 120,
            isCode: true
        };
    },
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    onLoad: function(options) {
        uni.setNavigationBarTitle({
            title:this.__('支付密码')
        });

        var that = this;
        this.Phone == this.userInfo.user_mobile;

        this.refreshData();
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
        refreshData: function(e) {
            let that = this;
            that.$.request({
                url: this.Config.URL.pay.get_pay_passwd,
                data: {},
                success: function(data, status, msg, code) {
                    if (status == 200) {
                        that.isSet = true;
                    } else {
                        that.isSet = false;
                    }
                }
            });
        },
        inputphone: function(e) {
            let that = this;
            this.setData({
                Phone: e.detail.value
            });

            if (that.$.isNull(e.detail.value)) {
                this.setData({
                    isPhone: false
                });
            } else {
                /^1[34578]\d{9}$/.test(e.detail.value)
                    ? this.setData({
                          isPhone: true
                      })
                    : this.setData({
                          isPhone: false
                      });
            }
        },
        inputcode: function(e) {
            let that = this;
            this.setData({
                Code: e.detail.value
            }),
                that.$.isNull(e.detail.value)
                    ? this.setData({
                          isCode: false
                      })
                    : this.setData({
                          isCode: true
                      });
        },
        sendmessage: function() {
            let that = this;
            if (that.$.isNull(this.Phone)) {
                this.setData({
                    isPhone: false
                });
            } else if (/^1[2345789]\d{9}$/.test(this.Phone)) {
                if (this.Phone == this.userInfo.user_mobile) that.$.confirm('你已经绑定过该手机！');
                else if (this.isSend) {
                    this.setData({
                        isSend: false
                    });

                    var t = this.sendTime;
                    var params = {
                        mobile: this.Phone
                    };
                    that.$.request({
                        url: this.Config.URL.sendMobileVerifyCode,
                        data: params,
                        success: function(data, status, msg, code) {
                            if (status == 200) {
                                var r = setInterval(function() {
                                    t > 0
                                        ? that.setData({
                                              btntext: t-- + 's'
                                          })
                                        : (that.setData({
                                              isSend: true,
                                              sendTime: 120,
                                              btntext: that.__('重新发送')
                                          }),
                                          clearInterval(r));
                                }, 1e3);
                            } else {
                                that.setData({
                                    isSend: true
                                }),
                                    that.$.alert(msg);
                            }
                        }
                    });
                }
            } else {
                this.setData({
                    isPhone: false
                });
            }
        },
        submitdata: function() {
            let that = this;
			if (!this.pay_password) {
				that.$.confirm('请输入支付密码');
				return;
			}
			if (!this.pay_password2) {
				that.$.confirm('请输入支付密码');
				return;
			}
			if(this.pay_password != this.pay_password2)
			{
				that.$.confirm(that.__('两次输入密码不一致！'));
				return;
			}
            var params = {
                old_pay_password: this.old_pay_password,
                new_pay_password: this.pay_password,
                pay_password: this.pay_password
            };

            that.$.request({
                url: this.Config.URL.pay.change_paypasswd,
                data: params,
				method:"POST", 
                success: function(data, status, msg, code) {
                    if (status == 200) {
                        that.$.showModal('支付密码设置成功！', function() {
                            that.$.backpage(1);
                        });
                    } else {
                        that.$.confirm(msg);
                    }
                }
            });
        },
        changePassword: function() {
            this.showPassword = !this.showPassword;
        }
    }
};
</script>


<style lang="scss">
@import '../../styles/_variables.scss';
.m-cell-vcode {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
}

.m-vcode-img {
    width: 216rpx;
    height: 88rpx;
}

.btn_box {
    padding: 20rpx;
}

.m-code {
    right: 210rpx;
}

.m-vcode-btn {
    width: 150rpx;
    text-align: center;
}
</style>
