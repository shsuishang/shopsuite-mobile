<template>
	<view class="page">
		<view class="m-tab">
			<view class="m-navbar1">
				<view :class="['m-navbar-item', (tapindex==2?'m-navbar-item-on':'')]" @click="toBePaid" v-if="(isECashCard)">
					{{__('余额提现')}}
				</view>
			</view>
		</view>
		<view :class="(tapindex==2?'':'hide')">
			<view class="topbg">
				<view class="topinfo">
					<view>
						<label>{{canUseCardCashAmount}}</label>
					</view>
					<view>{{__('可提现余额')}}(￥)</view>
				</view>
			</view>
			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('提现金额')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(Price)" :placeholder="__('输入提现金额(需要大于:') + plantform_fx_withdraw_min_amount + ')'" maxlength="6" @input="onInputPrice" />
					</view>
					<view v-if="(!isPrice)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell" hidden="true">
					<view class="m-cell-hd">
						<label class="u-label">{{__('微信号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(WXCode)" :placeholder="__('输入微信号')" maxlength="20" @input="onInputWXcode" />
					</view>
					<view v-if="(!isWXcode)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('收款方式')}}</label>
					</view>
					<!-- <view class="m-cell-bd">
						<input class="u-input" type="text" :value="(BankName)" placeholder="请选择收款方式" @input="inputbankName" />
					</view> -->
					<view class="m-cell-bd">
						 <picker @change="bindPickerChange" :value="index" :range="banklists" range-key="user_bank_card_address">
						           <view class="uni-input">{{banklists[index] ? banklists[index]['user_bank_card_address'] : __('请选择收款方式')}}</view>
						  </picker>
					</view>
					<view v-if="(!isbankName)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('真实姓名')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(UserRealName)" :placeholder="__('输入真实姓名')" maxlength="20" @input="inputName" />
					</view>
					<view v-if="(!isName)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('手机号码')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(UserPhone)" :placeholder="__('输入手机号码')" maxlength="11" @input="onInputPhone" />
					</view>
					<view v-if="(!isPhone)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell" hidden="true">
					<view class="m-cell-hd">
						<label class="u-label">{{__('支付宝账号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" :value="(AlipayAccount)" :placeholder="__('输入支付宝账号(选填)')" @input="inputalipayAccount" />
					</view>
					<view v-if="(!isalipayAccount)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('银行名称')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(BankName)" :placeholder="__('如：上海农业银行七宝支行')" @input="inputbankName" />
					</view>
					<view v-if="(!isbankName)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('银行卡号')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(BankAccount)" :placeholder="__('输入银行卡号')" @input="inputbankAccount" />
					</view>
					<view v-if="(!isbankAccount)" class="m-cell-ft">
						<icon class="m-icon-warn" type="warn"></icon>
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('备注')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="(withdraw_desc)" :placeholder="__('输入备注(选填)')" @input="inputWithdrawDescAccount" />
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd">
						<label class="u-label">{{__('支付密码')}}</label>
					</view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" password="true" :value="(password)" :placeholder="__('输入支付密码')" @input="inputPasswordAccount" />
					</view>
				</view>
			</view>

			<view class="m-text-box">
				<view>
					<label class="iconfont icon-14052218"></label>{{__('提现规则')}}
				</view>
				<view>
					<view>
						{{__('提示:每月的')}} <label style="color:red;padding-left:10rpx;">{{withdraw_monthday}}</label> {{__('可以申请提现，最低提现额度')}}<label style="color:red;padding-left:10rpx;">{{plantform_fx_withdraw_min_amount}}</label>，{{__('商家营收余额需要买家确认收货后')}} <label style="color:red;padding-left:10rpx;">{{withdraw_received_day}}</label> {{__('天才可以申请提现')}}。
					</view>
				</view>
			</view>
			<view class="btn_box">
				<button class="u-btn u-btn-default" @click="ApplyToCash">{{__('申请提现')}}</button>
			</view>
		</view>

		<!-- 弹出层 -->
		<uni-popup ref="popup" type="center">
			<view class="uni-banner" style="background:#FFFFFF;"  v-if="loaded">
				<view :style="'height: ' + h + 'px; width:700uxp;padding:50rpx;'">
					<scroll-view scroll-y="true"  :style="'height: ' + h + 'px; '">
							<wxParse :content="protocol_text"  />
					</scroll-view>
				</view>
				<view style="height:50px;text-align: center;">
			        <view class="button-sp-area">
			            <button class="mini-btn" type="default" size="mini" @tap="disagree">{{__('不同意')}}</button>

			            <button class="mini-btn" type="warn" size="mini" style="margin-left: 100rpx;" @tap="agree">{{__('同意')}}</button>
			        </view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"

	import wxParse from '@/components/u-parse/u-parse.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		name: "predeposit",
		data: function() {
			return {
				TotalPrice: 0,
				canUseCardCashAmount: 0,
				Price: "",
				WXCode: "",
				UserPhone: "",
				inputPrice: "",
				UserRealName: "",
				AlipayAccount: "",
				BankAccount: "",
				BankName: "",
				isPrice: true,
				inputWXcode: "",
				isWXcode: true,
				inputPhone: "",
				ValidDays: 0,
				isPhone: true,
				isName: true,
				isalipayAccount: true,
				isbankAccount: true,
				isbankName: true,
				tapindex: 2,
				CashType: 0,
				isShow: true,
				AllowWithdraw: true,
				password: '',

				isECashCard: true,
				isMemDist: true,


				withdraw_desc:'',
				protocol_text:'',
				loaded:false,
				h:0,
				banklists: [],
				index: 9999,


				plantform_fx_withdraw_min_amount: '',
				withdraw_fee_rate: '',
				withdraw_received_day: '',
				withdraw_min_amount: '',
				withdraw_monthday: ''
			}
		},
		components: {
			wxParse,
			uniPopup
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('提现申请')
			});


			var params = {},
				that = this;
			that.$.request({
				url: this.Config.URL.pay.asset,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							TotalPrice: 0, // 
							canUseCardCashAmount: data.user_money, //余额
							ValidDays: '',
							AlipayAccount: '', //'AlipayAccount',
							BankAccount: '', //'BankAccount',
							BankName: '', //'BankName',
							UserPhone: '', //'UserPhone',
							UserRealName: '', //'UserRealName',
							WXCode: '', //'WXCode',
							AllowWithdraw: '', //'AllowWithdraw'
						});
						data.user_money > 0 ? that.setData({
							isShow: true
						}) : that.setData({
							isShow: false
						})
					}
				}
			});

			if (options.tapindex) {
				this.setData({
					tapindex: options.tapindex
				})
			} else {}

			this.setData({
				isECashCard: false,
				isMemDist: false
			})


			var h = this.$.getSystemInfoSync().windowHeight;

			this.setData({
				h: h-50-50 - 100
			})

			this.getProtocal();	
			this.load();


			this.getPlantformInfo(function (plantformInfo) {
				that.setData({
					plantform_fx_withdraw_min_amount: plantformInfo.plantform_fx_withdraw_min_amount,
					withdraw_fee_rate: plantformInfo.withdraw_fee_rate,
					withdraw_received_day: plantformInfo.withdraw_received_day,
					withdraw_min_amount: plantformInfo.withdraw_min_amount,
					withdraw_monthday: plantformInfo.withdraw_monthday
				})
			});
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			load: function()
			{
				var that =this;
				var params = {}
				that.$.request({
					url: this.Config.URL.pay.list_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						if(data.items.length > 0)
						{
							
						that.setData({
							banklists: data.items,
							
						})
					  }
					  
					}
				})
			},

			onInputPrice: function(e) {
				let that = this;
				this.setData({
					Price: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isPrice: false
				}) : this.setData({
					isPrice: true
				})
			},
			toBePaid: function() {
				this.setData({
					tapindex: 2,
					CashType: 1
				})
			},
			onInputWXcode: function(e) {
				let that = this;
				this.setData({
					WXCode: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isWXcode: false
				}) : this.setData({
					isWXcode: true
				})
			},
			onInputPhone: function(e) {
				let that = this;
				this.setData({
					UserPhone: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isPhone: false
				}) : /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
					isPhone: true
				}) : this.setData({
					isPhone: false
				})
			},
			inputWithdrawDescAccount: function(e) {
				this.setData({
					withdraw_desc: e.detail.value
				})
			},
			inputName: function(e) {
				let that = this;
				this.setData({
					UserRealName: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isName: false
				}) : this.setData({
					isName: true
				})
			},
			inputalipayAccount: function(e) {
				this.setData({
					AlipayAccount: e.detail.value
				}), e.detail.value ? /^0?(13[0-9]|15[012356789]|18[0123456789]|14[0123456789]|17[0123456789])[0-9]{8}$/.test(e.detail
					.value) ? this.setData({
					isalipayAccount: true
				}) : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e.detail.value) ? this.setData({
					isalipayAccount: true
				}) : this.setData({
					isalipayAccount: false
				}) : this.setData({
					isalipayAccount: true
				})
			},
			
			bindPickerChange: function(e) {
				let that = this;
				var r = e.target.value
				this.index = r
				this.UserRealName = that.banklists[r].user_bank_card_name
				this.UserPhone = that.banklists[r].user_bank_card_mobile
				this.BankAccount = that.banklists[r].user_bank_card_code
				this.BankName = that.banklists[r].bank_name
					
			},
			inputPasswordAccount: function(e) {
				this.setData({
					password: e.detail.value
				})
			},
			inputbankName: function(e) {
				this.setData({
					BankName: e.detail.value
				})
			},
			inputbankAccount: function(e) {
				this.setData({
					BankAccount: e.detail.value
				}), e.detail.value ? /^\d{15,20}$/.test(e.detail.value) ? this.setData({
					isbankAccount: true
				}) : this.setData({
					isbankAccount: false
				}) : this.setData({
					isalipayAccount: true
				})
			},
			ApplyToCash: function() {
				let that = this;

				if (this.CashType == 0)
				{
					if (that.$.isNull(this.Price))
					{
						this.setData({
							isPrice: false
						})
					}
					else
					{
						if (parseInt(this.Price) < this.plantform_fx_withdraw_min_amount)
						{
							this.setData({
								isPrice: false
							}), that.$.alert(that.__("亲~提现金额必须大于") + this.plantform_fx_withdraw_min_amount + that.__("才能提现哟！"))
						}
						else
						{
							this.setData({
								isPrice: true
							})
						}
					}
				}


				that.$.isNull(this.WXCode) ? this.setData({
						isWXcode: false
					}) : this.setData({
						isWXcode: true
					}), that.$.isNull(this.UserPhone) ? this.setData({
						isPhone: false
					}) : /^1[23456789]\d{9}$/.test(this.UserPhone) ? this.setData({
						isPhone: true
					}) : this.setData({
						isPhone: false
					}), that.$.isNull(this.UserRealName) ? this.setData({
						isName: false
					}) : this.setData({
						isName: true
					}), this.AlipayAccount ? /^0?(13[0-9]|15[012356789]|18[0123456789]|14[0123456789]|17[0123456789])[0-9]{8}$/.test(
						this.AlipayAccount) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.AlipayAccount) ||
					this.setData({
						isalipayAccount: false
					}) : this.setData({
						isalipayAccount: true
					}), this.BankAccount ? /^\d{15,20}$/.test(this.BankAccount) ? this.setData({
						isbankAccount: true
					}) : this.setData({
						isbankAccount: false
					}) : this.setData({
						isbankAccount: true
					}), this.BankAccount ? that.$.isNull(this.BankName) ? this.setData({
						isbankName: false
					}) : this.setData({
						isbankName: true
					}) : this.setData({
						isbankName: true
					});
				if (this.isPhone && this.isName && this.isbankAccount && this.isalipayAccount && this.isbankName) {
					var params = {
						withdraw_amount: this.Price,
						//WXCode: this.WXCode,
						withdraw_mobile: this.UserPhone,
						//nickName: this.userInfo.NickName,
						withdraw_account_no: this.BankAccount,
						//AlipayAccount: this.AlipayAccount,
						withdraw_account_name: this.UserRealName,
						withdraw_bank: this.BankName,
						withdraw_desc: this.withdraw_desc,
						password: this.password,
					};
					that.$.request({
						url: this.Config.URL.pay.consume_withdraw_add,
						data: params,
						success: function(data, status, msg, code) {
							if (200 == status) {
								(that.$.alert(that.__("已申请提现！")), setTimeout(function() {
									that.$.navigateBack(1, function() {})
								}, 2e3))
							} else {
								that.$.showModal(msg)
							}
						}
					});
				}
			},
			getProtocal: function() {
				let that = this;

				that.$.request({
				    url: that.cf.URL.protocol,
				    data: {protocols_key:'withdraw_protocols_description'},
				    success: function (data, status, msg, code) {

						if (data.state)
						{

						}
						else
						{
							that.protocol_text = data.document;
							that.loaded = true;
							that.$refs.popup.open()
						}
				    }
				});
			},
			disagree: function() {
				let that = this;
				uni.showModal({
					title: '',
					content: that.__('十分抱歉，若您不同意此协议，我们将无法为您提现'),
					cancelText:that.__('返回'),
					confirmText:that.__('我再想想'),
					success: function (res) {
						if (res.confirm) {
						} else if (res.cancel) {
							uni.navigateBack({
								delta:1
							})
						}
					}
				});
			},

			agree: function() {
				let that = this;

				that.$.request({
				    url: that.cf.URL.protocol,
				    data: {protocols_key:'withdraw_protocols_description', state:1},
				    success: function (data, status, msg, code) {
						that.$refs.popup.close()
				    }
				});
			}
		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar1 {
		background: $default-skin-bg;
		color: #fff;
		display: flex
	}

	.m-navbar-item {
		padding: 20rpx 0;
		font-size: 24rpx;
	}

	.m-navbar-item:after {
		border: none;
	}

	.m-navbar-item.m-navbar-item-on {
		color: #fff;
		background: $default-skin-bg;
		border-bottom: 2rpx solid #fff;
	}

	/* .m-navbar-item.m-navbar-item-on::before {background: $default-skin-bg;content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 6rpx;border-bottom: 6rpx solid #fff;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;} */
	/* .m-tab{position: fixed;width: 100%;top: var(--window-top);z-index: 2;} */
	.topbg {
		background-color: $default-skin-bg;
		padding-bottom: 40rpx
	}

	.topinfo {
		display: inline-block;
		width: 100%;
		text-align: center;
		color: white;
		font-size: 14px;
		margin-top: 56rpx;
		position: relative;
	}

	.topinfo label {
		font-size: 56px;
	}

	.m-text-box {
		font-size: 24rpx;
		box-sizing: border-box;
		padding: 20rpx;
		color: #888;
		line-height: 40rpx;
	}

	.m-text-box label {
		padding-right: 10rpx;
	}

	.m-btn-box {
		padding-bottom: 40rpx;
	}

	.m-btn-box-two {
		display: flex;
		justify-content: space-around;
	}

	.m-btn-box-two .u-btn {
		width: 45%;
	}

	.m-cell {
		padding: 15rpx 30rpx;
	}
</style>
