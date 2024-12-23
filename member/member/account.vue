<template>
	<view class="page">
	</view>
</template>


<style lang="scss">

</style>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
                Id: 0,
                user_nickname: "",
                user_realname: "",
                user_idcard: "",
                isCardNo: true,
                user_email: "",
                user_birthday: "",
                isUserEmail: true,
                user_mobile: "",
                mobile_code: "",
                btntext: "发送",
                isSend: true,
                isUserMobile: true,
                sendTime: 120,
                isCode: true
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});

			let that = this;
            this.setData({
                Id: this.userInfo.user_id,
                user_account: that.$.isNull(this.userInfo.user_account) ? "" : this.userInfo.user_account,
                user_nickname: that.$.isNull(this.userInfo.user_nickname) ? "" : this.userInfo.user_nickname,
                user_realname: that.$.isNull(this.userInfo.user_realname) ? "" : this.userInfo.user_realname,
                user_idcard: that.$.isNull(this.userInfo.user_idcard) ? "" : this.userInfo.user_idcard,
                user_email: that.$.isNull(this.userInfo.user_email) ? "" : this.userInfo.user_email,
                user_birthday: that.$.isNull(this.userInfo.user_birthday) ? that.__("请选择生日日期") : this.userInfo.user_birthday,
                user_mobile: that.$.isNull(this.userInfo.user_mobile) ? "" : this.userInfo.user_mobile
            })
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            bindDateChange: function (e) {
                this.setData({user_birthday: e.detail.value})
            },
            inputReName: function (e) {
                this.setData({user_realname: e.detail.value})
            },
            inputICard: function (e) {
				let that = this;
                if (that.$.isNull(e.detail.value))
                {
                    this.setData({isCardNo: true, user_idcard: e.detail.value});
                    return
                }
                this.IdentityCodeValid(e.detail.value) ? this.setData({isCardNo: true}) : this.setData({isCardNo: false}), this.setData({user_idcard: e.detail.value})
            },
            inputuser_email: function (e) {
				let that = this;
                this.setData({user_email: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isUserEmail: false}) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({isUserEmail: true}) : this.setData({isUserEmail: false})
            },
            submitInfo: function (e) {
				let that = this;
                if (!that.$.isNull(this.user_idcard) && !this.isCardNo)
                {
                    return;
                }/*
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.user_email))
        {
            this.setData({isUserEmail: false});
            return
        }*/
                if (!that.$.isNull(this.user_mobile))
                {
                    this.update();
                }
                else if (that.$.isNull(this.user_mobile))
                {
                    this.setData({isUserMobile: false});
                }
                else if (!/^1[23456789]\d{9}$/.test(this.user_mobile))
                {
                    this.setData({isUserMobile: false});
                }
                else if (this.user_mobile == this.userInfo.user_mobile)
                {
                    that.$.confirm(that.__("你已经绑定过该手机！"));
                }
                else if (that.$.isNull(this.mobile_code))
                {
                    this.setData({isCode: false});
                }
                else
                {
                }
            },
            update: function () {
				let that = this;
                var params = {
                    Id: this.Id,
                    user_realname: this.user_realname,
                    user_idcard: this.user_idcard,
                    user_email: this.user_email,
                    user_birthday: this.user_birthday,
                    user_mobile: this.user_mobile,
                    code: this.mobile_code,
                };

                params.user_birthday == that.__("请选择生日日期") && (params.user_birthday = "");

                that.$.request({
                    url: this.Config.URL.account.edit_user_info,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.showToast({
                                title: that.__("更新成功!"), success: function () {
                                    //this.userInfo = data;
                                    this.userInfo.user_realname = params.user_realname;
                                    this.userInfo.user_idcard = params.user_idcard;
                                    this.userInfo.user_email = params.user_email;
                                    this.userInfo.user_birthday = params.user_birthday;
                                    this.userInfo.user_mobile = params.user_mobile;
                                    that.$.navigateBack(1)
                                }
                            })
                        }
                        else
                        {
                            that.$.confirm(msg);
                        }
                    }
                });
            },
            IdentityCodeValid: function (e) {
                var t = {
                        11: "北京",
                        12: "天津",
                        13: "河北",
                        14: "山西",
                        15: "内蒙古",
                        21: "辽宁",
                        22: "吉林",
                        23: "黑龙江 ",
                        31: "上海",
                        32: "江苏",
                        33: "浙江",
                        34: "安徽",
                        35: "福建",
                        36: "江西",
                        37: "山东",
                        41: "河南",
                        42: "湖北 ",
                        43: "湖南",
                        44: "广东",
                        45: "广西",
                        46: "海南",
                        50: "重庆",
                        51: "四川",
                        52: "贵州",
                        53: "云南",
                        54: "西藏 ",
                        61: "陕西",
                        62: "甘肃",
                        63: "青海",
                        64: "宁夏",
                        65: "新疆",
                        71: "台湾",
                        81: "香港",
                        82: "澳门",
                        91: "国外 "
                    },
                    n = true;
                if (!e || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(e))
                {
                    n = false;
                }
                else if (!t[e.substr(0, 2)])
                {
                    n = false;
                }
                else if (e.length == 18)
                {
                    e = e.split("");
                    var r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], i = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
                        s = 0, o = 0, u = 0;
                    for (var a = 0; a < 17; a++)
                    {
                        o = e[a], u = r[a], s += o * u;
                    }
                    var f = i[s % 11];
                    i[s % 11] != e[17].toUpperCase() && (n = false)
                }
                return n
            },
            inputphone: function (e) {
				let that = this;
                this.setData({user_mobile: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isUserMobile: false}) : /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({isUserMobile: true}) : this.setData({isUserMobile: false})
            },
            inputcode: function (e) {
				let that = this;
                this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: false}) : this.setData({isCode: true})
            },
            sendmessage: function () {
				let that = this;
                if (that.$.isNull(this.user_mobile))
                {
                    this.setData({isUserMobile: false});
                }
                else if (!/^1[23456789]\d{9}$/.test(this.user_mobile))
                {
                    this.setData({isUserMobile: false});
                }
                else if (this.user_mobile == this.userInfo.user_mobile)
                {
                    that.$.confirm("你已经绑定过该手机！");
                }
                else if (this.isSend)
                {
                    this.setData({isSend: false});
                    var t = this.sendTime;
                    var params = {
                        mobile: this.user_mobile
                    };
                    that.$.request({
                        url: this.Config.URL.sendMobileVerifyCode,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (status == 200)
                            {
                                var r = setInterval(function () {
                                    t > 0 ? that.setData({btntext: t-- + "s"}) : (that.setData({
                                        isSend: true,
                                        sendTime: 120,
                                        btntext: that.__("重新发送")
                                    }), clearInterval(r))
                                }, 1e3);
                            }
                            else
                            {
                                that.setData({isSend: true}), that.$.alert(msg)
                            }
                        }
                    });
                }
            }
		}
	};
</script>
