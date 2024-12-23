<template>
	<view class="page">
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('收款方式')}}</label></view>
				<view class="m-cell-bd">
					<picker @change="bindBankIdChange" :value="index" :range="bank_list">
					                        <view class="uni-input">{{bank_list[index]}}</view>
					                    </picker>
				</view>
			</view>

			<view class="m-cell" v-if="show_bank_flag">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('开户支行')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_bank_card_address" :placeholder="__('如选择微信/支付宝该项不填')"/>
				</view>
			</view>


			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('收款账号')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_bank_card_code" :placeholder="__('请输入收款账号')"/>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('收款姓名')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_bank_card_name" :placeholder="__('请输入收款姓名')"/>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('预留手机')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_bank_card_mobile" :placeholder="__('预留手机')" @input="inputphone"/>
				</view>
				<div v-if="(!mobile_flag)" class="m-cell-ft">
					<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</div>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('是否默认')}}</label></view>
				<view class="m-cell-bd">
					<switch type="switch" :checked="(user_bank_default?true:false)" @change="ckDefault" />
				</view>
			</view>
		</view>

		<button class="u-btn u-btn-default" @click="submitinfo">{{__('保存')}}</button>
	</view>
</template>

<style lang="scss">
	@import "../../styles/_variables";

	.btn_box {
		padding: 20rpx;
	}

	.m-cell-bd switch {
		float: right;
	}

	.m-cell-hd {
		width: 180rpx;
	}

	.m-select-box-msk {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
	}

	.m-select-box {
		position: absolute;
		width: 100%;
		height: 300px;
		background-color: #fff;
		left: 0;
		bottom: 0;
	}

	.u-select {
		width: 100%;
		height: 300px;
		text-align: center;
	}

	.u-select .m-cell-bd {
		width: 100%;
		line-height: 50px;
		font-size: 28rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.u-select .m-cell-bd label {
		width: 100%;
	}

	.m-select-content {
		position: relative
	}

	.m-close-panel {
		height: 60rpx;
		border-bottom: 1rpx solid #dfdfdf;
		font-size: 24rpx;
		text-align: right;
		color: #73AE1F;
		line-height: 60rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.m-cell-select-before .m-cell-bd {
		padding: 0;
	}

	.m-icon-warn
	{
		color:red;
	}
</style>

<script>

    import {
        mapState,
        mapMutations
    } from 'vuex'


    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				options: {},
				user_bank_id: 0,

				bank_id: 0,
				bank_name: '',
				user_bank_card_address: '',
				user_bank_card_code: '',
				user_bank_card_name: '',
				user_bank_card_mobile: '',
				user_bank_default: false,

				index: 0,
				bank_list:[],
				bank_info:[],


				show_bank_flag: true,
				mobile_flag: true,
				issub: false,

				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF'
			}
		},
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('账号管理')
			});

			var that = this;
			this.setData({
				issub: options.issub,
				user_bank_id: options.user_bank_id || 0,
				options: options
			});

			var params = {};

			that.$.request({
				url: that.Config.URL.pay.list_user_bank,
				data: params,
				success: function(data, status, msg, code) {
					if (200 == status) {

						let tmp = [];

						for (let i in data.bank_list) {
							tmp[i] = data.bank_list[i].bank_name;
						}

						that.setData({
							bank_info: data.bank_list,
							bank_list: tmp
						});


						if (data.bank_list.length > 0)
						{
							that.setData({
								bank_id: that.bank_info[0].bank_id,
								bank_name: that.bank_info[0].bank_name,
							})
						}

						if (that.bank_id == 1018 || that.bank_id == 1019)
						{
							that.setData({
								show_bank_flag: false
							})
						}
						else
						{
							that.setData({
								show_bank_flag: true
							})
						}


						if (options.user_bank_id > 0) {
							that.$.setNavigationBarTitle({
								title: "修改账号"
							});
							var params = {
								user_bank_id: options.user_bank_id
							};
							that.$.request({
								url: this.Config.URL.pay.get_user_bank,
								data: params,
								success: function(data, status, msg, code) {
									if (200 == status) {
										that.setData({
											user_bank_row: data,

											user_bank_id: data.user_bank_id,
											bank_id: data.bank_id,
											bank_name: data.bank_name,
											user_bank_card_address: data.user_bank_card_address,
											user_bank_card_code: data.user_bank_card_code,
											user_bank_card_name: data.user_bank_card_name,
											user_bank_card_mobile: data.user_bank_card_mobile
										});
									}
								}
							});
						}
						else
						{
						}
					}
			    }
			});



		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			bindBankIdChange: function(e) {
				//console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value


				this.setData({
					bank_id: this.bank_info[this.index].bank_id,
					bank_name: this.bank_info[this.index].bank_name,
				})

				if (this.bank_id == 1018 || this.bank_id == 1019)
				{
					this.setData({
						show_bank_flag: false
					})
				}
				else
				{
					this.setData({
						show_bank_flag: true
					})
				}
			},
			inputud_name: function(e) {
				this.setData({
					ud_name: e.detail.value
				})
			},
			inputdetail: function(e) {
				return this.setData({
					detail: e.detail.value
				}), e.detail.value
			},
			inputphone: function(e) {
				this.setData({
					user_bank_card_mobile: e.detail.value
				}), /^1[23456789]\d{9}$/.test(e.detail.value) ? this.setData({
					mobile_flag: true
				}) : this.setData({
					mobile_flag: false
				})
			},
			ckDefault: function(e) {
				this.setData({
					user_bank_default: e.detail.value
				})
			},
			submitinfo: function() {
				var that = this;

				if (that.$.isNull(that.ud_name)) return;
				if (that.$.isNull(that.detail)) return;
				if (that.$.isNull(that.phone)) return;
				if (!that.mobile_flag) return;
				if (that.selectedCityId <= 0) {
					that.$.alert("请选择省市区！");
					return
				}

				var params = {
					user_bank_id: that.user_bank_id ? that.user_bank_id : 0,
					ud_name: that.ud_name,
					ud_province_id: that.selectedProId,
					ud_city_id: that.selectedCityId,
					ud_county_id: that.selectedCountyId,
					ud_province: that.selectedPro,
					ud_city: that.selectedCity,
					ud_county: that.selectedCounty,
					ud_address: that.detail,
					ud_is_default: that.isDefault ? 1 : 0,
					ud_mobile: that.phone
				}

				var options = that.options;

				if (that.user_bank_id) {
					that.$.request({
						url: this.Config.URL.pay.edit_user_bank,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200)
                            {
                                that.$.showToast({
                                    title: "修改成功",
                                    icon: "success",
                                    duration: 2e3,
                                    success: function() {
                                        //
                                        if (options.issub) {
                                            that.$.navigateBack(1, function() {
                                                options.user_bank_id = data.user_bank_id;
                                                that.notice.postNotificationName("RefreshOrder", options)
                                            })
                                        } else {
                                            that.$.navigateBack(1, function() {
                                                that.notice.postNotificationName("RefreshAddress", 1)
                                            })
                                        }
                                    }
                                })
                            }
                            else
                            {
                                that.$.alert(msg)
                            }
						}
					});
				} else {
					params.user_bank_id = this.user_bank_id;
					var options = that.options;
					that.$.request({
						url: this.Config.URL.pay.add_user_bank,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200)
							{
                                that.$.showToast({
                                	title: "修改成功",
                                	icon: "success",
                                	duration: 2e3,
                                	success: function() {
                                		if (options.issub) {
                                			that.$.navigateBack(1, function() {
                                				options.user_bank_id = data.user_bank_id;
                                				that.notice.postNotificationName("RefreshOrder", options)
                                			})
                                		} else {
                                			that.$.navigateBack(1, function() {
                                				that.notice.postNotificationName("RefreshAddress", 1)
                                			})
                                		}
                                	}
                                })
                            }
                            else
                            {
                                that.$.alert(msg)
                            }
						}
					});
				}

			},
			bindChange: function(e) {
				if (e.detail.value[0] != this.value[0]) {
					this.setData({
						value: [e.detail.value[0], 0, 0]
					});
				} else {
					if (e.detail.value[1] != this.value[1]) {
						this.setData({
							value: [e.detail.value[0], e.detail.value[1], 0]
						});
					} else {
						this.setData({
							value: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
						});
					}
				}

                //this.seladress(this.value[0], this.value[1], this.value[2]);

				this.setData({
					Pindex: this.value[0],
					selectedProId: this.Province.pid[this.value[0]],
					selectedCityId: this.City.cid[this.value[1]],
					selectedCountyId: this.District.did[this.value[2]],
					selectedPro: this.Province.pname[this.value[0]],
					selectedCity: this.City.cname[this.value[1]],
					selectedCounty: this.District.dname[this.value[2]],
				});
			}
		}
	};
</script>
