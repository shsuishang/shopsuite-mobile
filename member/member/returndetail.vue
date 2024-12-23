<template>
	<view class="page-container">
		<view class="m-cells">
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('服务单号')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{returnData.return_id}}</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('申请时间')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{returnData.return_add_time}}</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('退货备注')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" style="width:70%;">{{returnData.return_buyer_message}}</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('申请金额')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{sprintf(__('￥%s'), returnData.submit_return_refund_amount)}}
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('退款金额')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{sprintf(__('￥%s'), returnData.return_refund_amount)}}
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('联系方式')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{returnData.return_tel}}</view>
			</view>
		</view>
		<view class="m-product-all m-cells">
			<view class="m-product-list">
				<block v-for="(item, i) in returnData.items" :key="i">
					<navigator :url="'/pagesub/product/detail?is_store_flag=0&pid=' + (item.item_id)"
						class="m-product-item">
						<view class="m-product-img">
							<image lazy-load :src="(item.order_item_image)" mode="aspectFill" />
						</view>
						<view class="m-product-info">
							<view class="m-product-name">
								<label>{{item.product_name}}</label>
								<label class="m-min-name"
								       style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1"
								>
								  {{ item.item_name ? item.item_name : "" }}
								</label>
							</view>
							<view class="m-product-price">
								<block v-if="item.return_item_subtotal">
									<label>{{__('￥')}}</label>{{item.return_item_subtotal}}
								</block>

								<text style="float: right;margin-right: 60rpx;">x{{item.return_item_num}}</text>



							</view>

						</view>
					</navigator>
					<view v-if="item.return_item_image_list && item.return_item_image_list.length">
						<view class="" style="padding:0 30rpx;margin-top:20rpx;">
							{{__('退货凭证')}}
						</view>
						<view class="return-image">
							<image  :src="img_src" v-for="(img_src, ii) in item.return_item_image_list" :key="ii"
								:data-index="ii" :data-img="img_src" @click="previewImg" />
						</view>
					</view>
				</block>
			</view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="link_kfu" @click="goKefu">
        <!-- #ifdef MP-WEIXIN -->
        <block v-if="1==plantformInfo.kefu_type_id">
          <contact-button size="27" type="default-dark" session-from="weapp">
			  
		  </contact-button>
        </block>
        <!-- #endif -->

        <label class="iconfont icon-more"></label>
        <text class="kfu_txt">{{__('联系客服')}}</text>
      </view>
      <!-- #endif -->

			<view
				v-if="false && returnData.return_is_paid == 0 && returnData.return_state_id != StateCode.RETURN_PROCESS_FINISH && returnData.return_state_id != StateCode.RETURN_PROCESS_REFUSED && returnData.return_state_id != StateCode.RETURN_PROCESS_CANCEL">
				<navigator href="javascript:void(0);" :data-return_id="return_id" class="btn-l confirm-refund"
					@click="confirm">{{__('确认收款')}}<em></em></navigator>
			</view>
			<button class="btn-cancel"
				v-if="returnData.return_state_id == StateCode.RETURN_PROCESS_CHECK && returnData.return_is_paid == 0"
				type="primary" :loading="loading" :data-return_id="return_id" @click="cancel">{{__('取消退单')}}</button>
			<navigator
				v-if="false && returnData.return_state_id == StateCode.RETURN_PROCESS_REFUSED && returnData.return_is_paid == 0"
				href="javascript:void(0);" class="btn-l cancel-return" @click="cancel">{{__('再次申请')}}</navigator>
		</view>
		<view class="m-cells">
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('商家退款处理')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" style="color:#DB384C;">
					<label v-for="(states, index) in plantformInfo.return_state_list"  :key="index">
						<label v-if="states.value == returnData.return_state_id">
							{{states.label}}
						</label>
					</label>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('是否退货')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" v-if="(returnData.return_flag == 1)">{{ __("退货") }}</view>
				<view class="m-cell-ft m-order-typetxt" v-else-if="(returnData.return_flag == 2)">{{ __("取消订单") }}
				</view>
				<view class="m-cell-ft m-order-typetxt" v-else>{{ __("不退货") }}</view>

			</view>

			<block v-if="(isShow && returnData.return_flag)">
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('退货地址')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt" style="width:70%;">{{returnData.return_addr}} </view>
				</view>
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('联系人')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{returnData.return_contact_name}}</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('联系方式')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{returnData.return_tel}}</view>
				</view>
			</block>
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('商家备注')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" style="width:70%;">{{returnData.return_store_message}}</view>
			</view>
			<view class="m-cell"
				v-if="(returnData.return_state_id == StateCode.RETURN_PROCESS_RECEIVED && returnData.return_flag == 1)">
				<view class="m-cell-bd">
					<text>{{baseFormData.return_tracking_number ? baseFormData.return_tracking_number : __('请输入退货物流信息')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" @click="showPopup"><uni-icons type="compose"
						size="24"></uni-icons></view>
			</view>
			<block
				v-if="(returnData.return_state_id == StateCode.RETURN_PROCESS_FINISH || returnData.return_state_id == StateCode.RETURN_PROCESS_REFUND || returnData.return_state_id == StateCode.RETURN_PROCESS_RECEIPT_CONFIRMATION) && returnData.return_flag == 1">
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{baseFormData.return_tracking_name}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{baseFormData.return_tracking_number }}</view>
				</view>
			</block>
			<view class="m-cell" v-if="(returnData.return_state_id == StateCode.RETURN_PROCESS_FINISH)">
				<view class="m-cell-bd">
					<text>{{__('退款状态')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{returnData.return_is_paid ? __('已退款') : __('退款中')}}</view>
			</view>
			<!-- <block v-if="returnData.plantform_return_state_id != StateCode.PLANTFORM_RETURN_STATE_WAITING">
				<h3 class="sstouch-default-list-tit">{{__('商城退款审核')}}</h3>
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('平台确认')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt"
						v-if="returnData.plantform_return_state_id == StateCode.PLANTFORM_RETURN_STATE_WAITING">
						{{__('待处理')}}</view>
					<view class="m-cell-ft m-order-typetxt"
						v-if="returnData.plantform_return_state_id == StateCode.PLANTFORM_RETURN_STATE_AGREE">
						{{__('处理中')}}</view>
					<view class="m-cell-ft m-order-typetxt"
						v-if="returnData.plantform_return_state_id == StateCode.PLANTFORM_RETURN_PROCESS_FINISH">
						{{__('已完成')}}</view>
				</view>
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('平台备注')}}</text>
					</view>
					<view class="m-cell-ft m-order-typetxt">{{returnData.return_platform_message}}</view>
				</view>
			</block> -->

			<view v-if="returnData.detail_array">
				<h3 class="sstouch-default-list-tit">{{__('退款详细')}}</h3>
				<ul class="sstouch-default-list">
					<view>
						<h4>{{__('支付方式')}}</h4>
						<label class="num">{{returnData.detail_array.refund_code}}</label>
					</view>
					<view>
						<h4>{{__('在线退款金额')}}</h4>
						<label class="num">{{returnData.detail_array.pay_amount}}</label>
					</view>
					<view>
						<h4>{{__('账户余额返还金额')}}</h4>
						<label class="num">{{returnData.detail_array.pd_amount}}</label>
					</view>
					<view>
						<h4>{{__('充值卡返还金额')}}</h4>
						<label class="num">{{returnData.detail_array.rcb_amount}}</label>
					</view>
				</ul>
			</view>



		</view>
		<uni-popup type="bottom" ref="pinglun">
			<view class="from-view">
				<uni-forms ref="baseForm" :modelValue="baseFormData" :rules="rules" label-width="120">
					<uni-forms-item :label="__('退货单物流名称')" required name="express_id">
						<uni-data-select v-model="baseFormData.express_id" :localdata="expressList"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item :label="__('退货单物流单号')" required name="return_tracking_number">
						<uni-easyinput v-model="baseFormData.return_tracking_number" :placeholder="__('请输入退货单物流单号')" />
					</uni-forms-item>
				</uni-forms>
				<button type="primary" @click="confirmLogistics('baseForm')">提交</button>

			</view>

		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniPopup from '../../components/uni-popup/uni-popup.vue';
	export default {
		data() {
			return {
				returnData: {
					"return_id": "",
					"service_type_id": 2,
					"order_id": "",
					"return_refund_amount": 1,
					"store_id": 1001,
					"buyer_user_id": 10001,
					"return_add_time": "2019-06-14 15:26:26",
					"return_year": 0,
					"return_month": 0,
					"return_day": 0,
					"return_reason_id": 0,
					"return_buyer_message": "",
					"return_addr_contacter": "",
					"return_tel": "",
					"return_addr": "",
					"return_post_code": 0,
					"express_id": 0,
					"return_tracking_number": "",
					"plantform_return_state_id": 3180,
					"return_state_id": 3105,
					"return_is_paid": 0,
					"return_flag": 1,
					"return_type": 1,
					"return_order_lock": 1,
					"return_item_state_id": 2030,
					"return_store_time": "0000-00-00 00:00:00",
					"return_store_message": "",
					"return_commision_fee": 0,
					"return_finish_time": "0000-00-00 00:00:00",
					"return_platform_message": "",
					"return_is_settlemented": 0,
					"return_settlement_time": 0,
					"id": "FX-20190614-00062",
					"buyer_user_name": " ",
					"submit_return_refund_amount": 1,
					"order_item_ids": {},
					"return_reason_name": null,
					"items": [],
					"return_state_name": "",
					"plantform_return_state_name": ""
				},
				return_id: '',
				return_tracking_number: '',
				express_id: '',
				loadComplete: false,
				showPlantform: false,
				loading: false,
				isShow: false,
				baseFormData: {
					return_tracking_number: '',
					express_id: '',
				},
				// 校验规则
				rules: {
					return_tracking_number: {
						rules: [{
							required: true,
							errorMessage: this.__('不能为空')
						}]
					},
					express_id: {
						rules: [{
							required: true,
							errorMessage: this.__('不能为空')
						}]
					},
				},
				value: 0,
				expressList: [],
			}
		},
		components: {
			uniPopup
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    async onLoad(options) {
      await this.$onLaunched;

			uni.setNavigationBarTitle({
				title: this.__('退货详情')
			});

			var that = this;

			that.setData({
				return_id: options.return_id
			})

			that.getReturn(options);
			that.getExpressList();
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			showPopup: function() {
				this.$refs.pinglun.open('bottom')
			},
			goKefu: function(e) {
				let that = this;
				
				if (1 == that.plantformInfo.kefu_type_id) {
          // #ifdef MP-WEIXIN
          return;
          // #endif
				}
				
				//先判断是否登录
				this.forceUserInfo(function(user) {
					var t = e.currentTarget.dataset;
					that.$.request({
						url: that.Config.URL.user.kefu_config,
						data: {user_id: that.returnData.buyer_user_id, store_id:that.returnData.store_id},
						loading: false,
						success: function(rd, r_status, r_msg, code) {
							if (r_status == 200) {
								let chat_url = that.$.sprintf("/im/chat/chat?uid=%s&order_id=%s", rd.friend_id, that.returnData.order_id);
			
								that.$.gopage(chat_url);
							}
							else
							{
								that.$.alert(r_msg);
							}
						}
					});
				});
			
				return ;
			},
			/*
			 * 读取商品数据
			 */
			getReturn: function(options) {

				var that = this;
				let params = {
					return_id: that.return_id
				}


				that.$.request({
					url: this.Config.URL.user.return_get,
					data: params,
					success: function(data, status, msg, code) {
						data.return_add_time = that.$.formatDateFormatter(data.return_add_time, 'yyyy-MM-dd hh:mm:ss')
						that.setData({
							returnData: data,
							baseFormData: {
								return_tracking_number: data.return_tracking_number,
								express_id: data.express_id,
							},
							loadComplete: true,
							showPlantform: data.plantform_return_state_id != that.StateCode
								.PLANTFORM_RETURN_STATE_WAITING
						})
						
						if ((data.return_state_id == that.StateCode.RETURN_PROCESS_SUBMIT || data
								.return_state_id == that.StateCode.RETURN_PROCESS_CHECK || data
								.return_state_id == that.StateCode.RETURN_PROCESS_CANCEL ||  data
								.return_state_id == that.StateCode.PLANTFORM_RETURN_STATE_WAITING ) ) {
							that.isShow = false;
						} else {
							that.isShow = true;
						}
					}
				});
			},
			confirm: function() {
				let that = this;

				that.$.request({
					url: this.Config.URL.user.return_confirm_refund,
					data: {
						return_id: that.return_id
					},
					success: function(data, status, msg, code) {
						that.$.gopage("/member/member/returnlist");
					}
				});
			},
			cancel: function() {
				let that = this;

				that.$.request({
					url: this.Config.URL.user.return_cancel,
					data: {
						return_id: that.return_id
					},
					method:"POST", 
					success: function(data, status, msg, code) {
						that.$.gopage("/member/member/returnlist");
					}
				});
			},

			inputreturn_tracking_number: function(e) {
				this.setData({
					return_tracking_number: e.detail.value
				})
			},

			previewImg: function(e) {
				var that = this,
					n = [];
				var index = e.target.dataset.index;
				n = this.returnData.items[index].return_item_image_list;
				var i = e.target.dataset.src;
				that.$.previewImage({
					current: i,
					urls: n
				})
			},

			confirmLogistics: function(ref) {
				let that = this;
				this.$refs[ref].validate().then(res => {
					console.log('success', res);
					var params = {
						return_id: that.return_id,
						return_tracking_number: that.baseFormData.return_tracking_number,
						express_id: that.baseFormData.express_id,
						return_item_state_id: 2040,
					}
					that.$.request({
						url: that.Config.URL.user.return_tracking,
						data: params,
						method:"POST", 
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.returnData.express_id = that.express_id,
									that.returnData.return_tracking_number = that.return_tracking_number,

									that.$.alert(that.__('操作成功'))
								that.$refs.pinglun.close();
							} else {
								that.$.alert(that.__('操作失败'))
							}

						}
					});
				}).catch(err => {
					console.log('err', err);
				})
			},
			getExpressList: function(e) {
				var that = this;
				that.$.request({
					url: that.Config.URL.seller.express_logistics_lists,
					data: {},
					loading: false,
					success: function(data, status, msg, code) {
						let myrange = []
						data.forEach((val, index) => {
							myrange.push({
								value: val.express_id,   // 选项id
								text: val.express_name   // 选项名称
							})
						})
						that.expressList = myrange;
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";

	.m-cells {
		font-size: 28rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
	}

	.link_kfu {
		position: relative;
		text-align: center;
		background-color: #fff;
		margin-top: 20rpx;
		height: 80rpx;
		line-height: 80rpx;

		.kfu_txt {
			margin-left: 20rpx;
		}
	}

	.m-product-name {
		font-size: 24rpx;
	}

	.m-product-img {
		image {
			padding: 20rpx;
		}
	}

	.return-image {
		display: flex;
		flex-wrap: wrap;
		padding:30rpx;
		background-color: #fff;

		image {
			width: 120rpx;
			height: 120rpx;
			padding: 0 10rpx;
		}
	}

	.btn-cancel {
		margin-top: 30rpx;
		background-color: $default-skin-bg;
    margin:20rpx;
	}

	.handle-info {
		margin-top: 30rpx;
		background-color: #fff;
	}

	.from-view {
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		padding: 30rpx;
	}
  .link_kfu contact-button {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
</style>