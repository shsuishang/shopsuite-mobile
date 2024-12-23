<template>
	<view class="page">
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('收款方式')}}</label></view>
				<view class="m-cell-bd">
					 <picker @change="bindPickerChange" :value="index" :range="banklists" range-key="bank_remark">
					           <view class="">{{banklists[index] ? banklists[index]['bank_name'] : __('请选择收款方式')}}</view>
					  </picker>
				</view>

			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('姓名')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(user_bank_card_name)" :placeholder="__('输入收款人姓名')" maxlength="20" @input="inputReName" />
				</view>
				<view v-if="(!isName)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('收款账号')}}</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(user_bank_card_code)" :placeholder="__('输入银行卡号或支付宝账号')" @input="inputbankAccount" />
				</view>
				<view v-if="(!isbankAccount)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('银行名称')}}</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(user_bank_card_address)" :placeholder="__('如选择微信/支付宝该项不填')" @input="inputbankName" />
				</view>
				<view v-if="(!isbankName)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('手机号码')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="number" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" :value="user_bank_card_mobile" />
				</view>
				<view v-if="(!isUserMobile)" class="m-cell-ft">
					<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</view>
			</view>

		</view>




		<button class="u-btn u-btn-default" @click="submitInfo" style="margin-top:50rpx;">{{__('保存')}}</button>

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
                options:{},
				user_id: 0,
				user_bank_card_name: "",
				user_bank_card_address: "",
				user_idcard: "",
				isName: true,
				isCardNo: true,
				user_bank_card_code: "",
				BankName: "",
				isbankAccount: true,
				isbankName: true,
				banklists: [],
				index: 0,
				user_bank_card_mobile:"",
				isUserMobile: true,
				bank_name: "",
				bank_id: 0,
				id: 0,
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('收款账号')
			});



			let that = this;

            that.setData({
                options: options,
            });

			this.forceUserInfo(function(user) {

			});

			this.load()

			if(options.ud_id)
			{
				that.setData({
					id: options.ud_id
				});
			}

		},
		onShow: function(opt) {
			let that = this;

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			load: function()
			{
				var that =this;
				var params = {
				}
				that.$.request({
					url: this.Config.URL.pay.list_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						that.setData({
							banklists: data.bank_list
						})

						that.getUserBank()
					}
				})
			},

			getUserBank: function() {
				var that =this;
				var params = {
					user_bank_id: that.id
				}
				that.$.request({
					url: this.Config.URL.pay.get_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						if(status == 200)
						{
							that.setData({
								bank_id: data.bank_id,
								bank_name: data.bank_name,
								user_bank_card_name: data.user_bank_card_name,
								user_bank_card_address: data.user_bank_card_address,
								user_bank_card_mobile: data.user_bank_card_mobile,
								user_bank_card_code: data.user_bank_card_code
							})
							
							
							for (var r = 0; r < that.banklists.length; r++) {
								if (that.banklists[r]['bank_id']  == data.bank_id)
								{
									that.index = r;
									break;
								}
							
							}
						}
					}
				})
			},

			inputphone: function(e) {
				let that = this;
				this.setData({
					user_bank_card_mobile: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isUserMobile: false
				}) : /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
					isUserMobile: true
				}) : this.setData({
					isUserMobile: false
				})
			},

			inputReName: function(e) {
				this.setData({
					user_bank_card_name: e.detail.value
				})
			},

			inputbankAccount: function(e) {
				var that = this;
				if(this.banklists[this.index]['bank_name'] == '微信' || this.banklists[this.index]['bank_name'] == '支付宝')
				{
					this.setData({
						user_bank_card_code: e.detail.value
					});
					if (e.detail.value != '') {
						this.setData({
							isbankAccount: true
						})
					} else {
						this.setData({
							isbankAccount: false
						})
					}
				}
				else
				{
					this.setData({
						user_bank_card_code: e.detail.value
					});
					if ( e.detail.value && /^\d{5,25}$/.test(e.detail.value)) {
						this.setData({
							isbankAccount: true
						})
					} else {
						this.setData({
							isbankAccount: false
						})
					}
				}
			
			},
			inputbankName: function(e) {
				this.setData({
					user_bank_card_address: e.detail.value
				})
			},

			inputICard: function(e) {
				let that = this;
				if (that.$.isNull(e.detail.value)) {
					this.setData({
						isCardNo: true,
						user_idcard: e.detail.value
					});
					return
				}
				this.IdentityCodeValid(e.detail.value) ? this.setData({
					isCardNo: true
				}) : this.setData({
					isCardNo: false
				}), this.setData({
					user_idcard: e.detail.value
				})
			},


			bindPickerChange: function(e) {
				let that = this;
				var r = e.target.value
				this.index = r
				this.bank_id = that.banklists[r].bank_id
				this.bank_name = that.banklists[r].bank_name


			},

			submitInfo: function(e) {
				let that = this;


					this.update();




				/*
				if (!that.$.isNull(this.user_idcard) && !this.isCardNo) {
					return;
				}
				*/
				/*
				        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.user_email))
				        {
				            this.setData({isUserEmail: false});
				            return
				        }*/

				/*
				if (!that.$.isNull(this.user_mobile)) {
					this.update();
				} else if (that.$.isNull(this.user_mobile)) {
					this.setData({
						isUserMobile: false
					});
				} else if (!/^1[23456789]\d{9}$/.test(this.user_mobile)) {
					this.setData({
						isUserMobile: false
					});
				} else if (this.user_mobile == this.userInfo.user_mobile) {
					that.$.confirm("你已经绑定过该手机！");
				} else if (that.$.isNull(this.mobile_code)) {
					this.setData({
						isCode: false
					});
				} else {}
				*/
			},

			update: function() {
				var that = this;
				
				if(this.banklists[this.index]['bank_name'] == '微信' || this.banklists[this.index]['bank_name'] == '支付宝')
				{
					this.user_bank_card_code ? this.setData({
						isbankAccount: true
					}) : this.setData({
						isbankAccount: false
					}) 
				}
				else
				{
					  /^\d{5,25}$/.test(this.user_bank_card_code) ? this.setData({
						isbankAccount: true
					}) : this.setData({
						isbankAccount: false
					}) 
				}

				this.user_bank_card_address ? that.$.isNull(this.user_bank_card_address) ? this.setData({
					isbankName: false
				}) : this.setData({
					isbankName: true
				}) : this.setData({
					isbankName: true
				}); that.$.isNull(this.user_bank_card_name) ? this.setData({
						isName: false
					}) : this.setData({
						isName: true
					});


				if(this.isbankName && this.isName  && this.isbankAccount)
				{
					var params = {
						bank_name: this.bank_name ? this.bank_name : that.banklists[0]['bank_name'],
						bank_id: this.bank_id ? this.bank_id : that.banklists[0]['bank_id'],
						user_bank_card_address: this.user_bank_card_address,
						user_bank_card_code: this.user_bank_card_code,
						user_bank_card_name: this.user_bank_card_name,
						user_bank_card_mobile: this.user_bank_card_mobile,
					};

					if(that.id)
					{
						var url = this.Config.URL.pay.edit_user_bank
						params.user_bank_id = that.id
					}
					else
					{
						var url = this.Config.URL.pay.add_user_bank
					}



					that.$.request({
						url: url,
						data: params,
						method:"POST", 
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.showToast({
									title: that.__("更新成功!"),
									success: function() {
										//this.userInfo = data;
					// 					that.userInfo.user_bankaccount = params.BankAccount;
					// 					that.userInfo.user_bankname = params.BankName;
					// 					that.userInfo.user_realname = params.user_realname;
					// 					that.userInfo.user_idcard = params.user_idcard;

					// 					that.login(that.userInfo);

										that.$.navigateBack(1)
									}
								})
							} else {
								that.$.confirm(msg);
							}
						}
					});
				}
			},

			IdentityCodeValid: function(e) {
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
				if (!e || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(
						e)) {
					n = false;
				} else if (!t[e.substr(0, 2)]) {
					n = false;
				} else if (e.length == 18) {
					e = e.split("");
					var r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
						i = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
						s = 0,
						o = 0,
						u = 0;
					for (var a = 0; a < 17; a++) {
						o = e[a], u = r[a], s += o * u;
					}
					var f = i[s % 11];
					i[s % 11] != e[17].toUpperCase() && (n = false)
				}
				return n
			},



		}
	};
</script>

<style lang="scss">
	@import "../../styles/_variables";

	.m-cell-bd label {
		color: #888;
	}

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

	.uni-uploader__file {
		width:120rpx;
		height:120rpx;
		.uni-uploader__img {
			width:100%;
			height:100%;
			border-radius: 50%;
		}
	}
</style>
