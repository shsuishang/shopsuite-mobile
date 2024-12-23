<template>
	<view class="page">
		<view class="m-cells m-cells-form">
			<view class="m-cell m-cell-select-before">
				<view class="m-cell-hd"><label for="" class="u-label">{{__('抬头类型')}}</label></view>
				<view class="m-cell-bd">
					<radio-group class="uni-flex" name="invoice_is_company"  @change="onInvoiceType">
							<radio value="0" :checked="invoice_is_company==0"/> {{__('个人')}}
							<radio value="1" :checked="invoice_is_company==1" style="margin-left: 10px;"/>{{__('企业')}}
					</radio-group>
				</view>
			</view>
			<view v-if="invoice_is_company == 1" class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('发票类型')}}</label></view>
				<view class="m-cell-bd">
					 <picker @change="bindPickerChange" :value="index" :range="invoice_type_row" range-key="name">
						<view class="uni-input">{{invoice_type_row[index].name}}</view>
					 </picker>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label for="" class="u-label">{{0==invoice_is_company ? __('个人名称') : __('单位名称')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="invoice_title" :placeholder="__('请输入发票抬头')" />
				</view>
				<div v-if="(invoice_title=='')" class="m-cell-ft">
					<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</div>
			</view>
			<view v-if="invoice_is_company == 1">
				<view class="m-cell" >
					<view class="m-cell-hd"><label for="" class="u-label" style="width: 150%;">{{__('纳税人识别号')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" v-model="invoice_company_code" :placeholder="__('请输入纳税人识别号')" />
					</view>
					<div v-if="(invoice_company_code=='')" class="m-cell-ft">
						<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
					</div>
				</view>

				<block v-if="invoice_type == 2">
					<view class="m-cell">
						<view class="m-cell-hd"><label for="" class="u-label">{{__('注册地址')}}</label></view>
						<view class="m-cell-bd">
							<input class="u-input" type="text" v-model="invoice_address" :placeholder="__('请输入注册地址')"/>
						</view>
					</view>
					<view class="m-cell">
						<view class="m-cell-hd"><label for="" class="u-label">{{__('注册电话')}}</label></view>
						<view class="m-cell-bd">
							<input class="u-input" type="number" v-model="invoice_phone" :placeholder="__('请输入注册电话')"/>
						</view>
					</view>
					<view class="m-cell">
						<view class="m-cell-hd"><label for="" class="u-label">{{__('开户银行')}}</label></view>
						<view class="m-cell-bd">
							<input class="u-input" type="text" v-model="invoice_bankname" :placeholder="__('请输入开户银行')"/>
						</view>
					</view>
					<view class="m-cell">
						<view class="m-cell-hd"><label for="" class="u-label">{{__('银行账号')}}</label></view>
						<view class="m-cell-bd">
							<input class="u-input" type="text" v-model="invoice_bankaccount" :placeholder="__('请输入银行账号')"/>
						</view>
					</view>
				</block>
			</view>

			<block>
				<view v-if="false" class="m-cell">
					<view class="m-cell-hd"><label for="" class="u-label">{{__('收票人手机')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" v-model="invoice_contact_mobile" :placeholder="__('收票人手机')" />
					</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd"><label for="" class="u-label">{{__('收票人邮箱')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" v-model="invoice_contact_email" :placeholder="__('收票人邮箱')" />
					</view>
				</view>
			</block>
		</view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
				 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>

		<view v-if="(isShow)" class="m-select-box-msk" @click="closead">
			<view class="m-select-box" @click.stop="notap">
				<view class="m-close-panel"><label @click.stop="closead">{{__('关闭')}}</label></view>
				<view class="m-select-content">
					<picker-view indicator-style="height:50px" class="u-select" value="(value)" @change="bindChange">
						<picker-view-column>
							<view class="m-cell-bd" v-for="(item, i) in Province.pname" :key="i"><label>{{item}}</label></view>
						</picker-view-column>
						<picker-view-column>
							<view class="m-cell-bd" v-for="(item, i) in City.cname" :key="i"><label>{{item}}</label></view>
						</picker-view-column>
						<picker-view-column>
							<view class="m-cell-bd" v-for="(item, i) in District.dname" :key="i"><label>{{item}}</label></view>
						</picker-view-column>
					</picker-view>
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

  .uni-input{
    padding-left: 0px;
  }

  .m-cell{
    line-height: 60rpx;
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
				company_type:'1',
				invoice_row:{},

				user_invoice_id:0,
				invoice_title:'',
				invoice_company_code:'',
				invoice_content:'',
				invoice_type:1,
				invoice_is_company:0,
				invoice_address:'',
				invoice_phone:'',
				invoice_bankname:'',
				invoice_bankaccount:'',
				invoice_contact_mobile:'',
				invoice_contact_email:'',

				Province: {},
				City: {},
				District: {},
				selectedProId: 0,
				selectedCityId: 0,
				selectedCountyId: 0,
				selectedPro: '',
				selectedCity: '',
				selectedCounty: '',


				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				title: 'picker',
				isShow:0,

				seladstr: "",
				options:{},
				invoice_type_row: [], //{name:'增值税专用发票', id:2}
				index:0
			}
		},
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			this.setData({
				options: options,
				user_invoice_id:options.user_invoice_id || 0,
				invoice_type:options.invoice_type || 1
			});

			that.$.setNavigationBarTitle({
				title: that.__("新增发票地址")
			});

			this.invoice_type_row = [{name: this.__('普通发票'), id:1}, {name:'增值税专用发票', id:2}];  

			if (options.user_invoice_id > 0) {
				that.$.setNavigationBarTitle({
					title: that.__("修改发票地址")
				});
				var params = {
					invoice_type: options.invoice_type,
					user_invoice_id:options.user_invoice_id,
				};
				that.$.request({
					url: this.Config.URL.user.invoice_get,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.setData({
								invoice_row: data,
								invoice_company_code: data.invoice_company_code,
								invoice_address: data.invoice_address,
								company_phone: data.company_phone,

								invoice_content: data.invoice_content,
								invoice_phone: data.invoice_phone,
								invoice_bankname: data.invoice_bankname,
								invoice_bankaccount: data.invoice_bankaccount,
								invoice_is_electronic: data.invoice_is_electronic,
								invoice_contact_mobile: data.invoice_contact_mobile,
								invoice_contact_email: data.invoice_contact_email,
								invoice_is_company: data.invoice_is_company,		
								invoice_title: data.invoice_title,
								invoice_type:data.invoice_type,
								index: data.invoice_type == 1 ? 0 : 1,
							});
						}
					}
				});
			}else{

			}
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

			submitinfo: function() {
				var that = this;

				/*
				if( that.is_change != 2 )
				{
					if (that.$.isNull(that.ud_name)) return;
						if (that.$.isNull(that.detail)) return;
						if (that.$.isNull(that.phone)) return;
						if (!that.isre) return;
						if (that.selectedCityId <= 0 ) {
							that.$.alert("请选择省市区！");
							return
						}
				}
				*/
			   
			   if (!this.invoice_title) {
				   that.$.alert("请输入发票抬头！");
				   return;
			   }

				var params = {
					user_invoice_id: that.user_invoice_id ? that.user_invoice_id : 0,
					invoice_title               : that.invoice_title           ,
					invoice_company_code        : that.invoice_company_code    ,
					invoice_content             : that.invoice_content         ,
					invoice_type                : that.invoice_type            ,
					invoice_is_electronic                : that.invoice_is_electronic,
					invoice_is_company			:that.invoice_is_company,
					invoice_address             : that.invoice_address         ,
					invoice_phone               : that.invoice_phone           ,
					invoice_bankname            : that.invoice_bankname        ,
					invoice_bankaccount         : that.invoice_bankaccount     ,
					invoice_contact_mobile      : that.invoice_contact_mobile  ,
					invoice_contact_email       : that.invoice_contact_email
				}

				// console.log(params);return;
				var options = that.options;
				if(that.user_invoice_id){
					that.$.request({
						url: this.Config.URL.user.invoice_edit,
						data: params,
						method:"POST", 
						success: function(data, status, msg, code) {
							if (200 == status) {
								that.$.showToast({
									title: that.__("修改成功"),
									icon: "success",
									duration: 5000,
									success: function() {
										if (options.issub) {
											that.$.navigateBack(1, function() {
												options.user_invoice_id = data.user_invoice_id;

												data['invoice_header'] = that.sprintf('%s - %s', data.invoice_type==1 ? that.__('普通发票') : that.__('增值税专用发票'), data.invoice_title);
												that.notice.postNotificationName("Refreshinvoice", data)
											})
										} else {
											that.$.navigateBack(1, function() {
												that.notice.postNotificationName("RefreshInvoiceList", 1)
											})
										}
									}
								})
							}else{
								that.$.showToast({
									title: msg,
									icon: "error",
									error: function() {

									}
								})
							}
						}
					})
				}else{
					that.$.request({
						url: this.Config.URL.user.invoice_add,
						data: params,
						method:"POST", 
						success: function(data, status, msg, code) {
							if (200 == status) {
								that.$.showToast({
									title: that.__("新增成功"),
									icon: "success",
									duration: 2e3,
									success: function() {
										//
										if (options.issub) {
											that.$.navigateBack(1, function() {
												options.user_invoice_id = data.user_invoice_id;

												data['invoice_header'] = that.sprintf('%s - %s', data.invoice_type==1 ? that.__('普通发票') : that.__('增值税专用发票'), data.invoice_title);
												that.notice.postNotificationName("Refreshinvoice", data)
											})
										} else {
											that.$.navigateBack(1, function() {
												that.notice.postNotificationName("RefreshInvoiceList", data)
											})
										}
									}
								})
							}else{
								that.$.showToast({
									title: msg,
									icon: "error",
									error: function() {

									}
								})
							}
						}
					})
				}
			},
			onInvoiceType:function(e){
				this.invoice_is_company = e.target.value
				var that = this;
			},
			bindPickerChange:function(e){
				this.index = e.target.value
				var that = this;
				this.invoice_type = this.invoice_type_row[this.index].id;
				/*
				if(that.invoice_type == 0 && e.target.value == 0)
				{
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
				*/
			},

			showbox() {
				/*
				this.setData({
				    isShow: true
				})
				*/
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				let that = this;
			    //console.info(e);
			    //console.info(JSON.stringify(e));
				this.pickerText = JSON.stringify(e)

			    this.setData({
			        Pindex: this.cityCode,
			        selectedProId: e.value[0],
			        selectedCityId: e.value[1],
			        selectedCountyId: e.value[2],
			        selectedPro: e.label[0],
			        selectedCity: e.label[1],
			        selectedCounty: e.label[2],
			        seladstr: that.$.isNull(e.label.toString()) ? that.__("请选择地址") : e.label.toString()
			    });
			}

		}
	};
</script>
