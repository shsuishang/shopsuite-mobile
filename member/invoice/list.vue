<template>
	<view class="page">
		<view v-if="(isdata)" class="m-ad-list">			
			<view v-for="(item, i) in invoice_list" @click="selectInvoice"  :key="i" class="m-ad-item" :data-id="(item.user_invoice_id)"  :data-invoice_category="(item.invoice_category)"  :data-invoice_type="(item.invoice_type)"  :data-user_invoice_id="(item.user_invoice_id)" :data-invoice_title="(item.invoice_title)" @longpress="modify">
				<view class="m-ad-l"  :data-sel="user_invoice_id" :data-user_invoice_id="(item.user_invoice_id)">
          <text v-if="!item.invoice_is_company" class="c-label">({{__("个人")}})</text><text v-if="item.invoice_is_company" class="p-label">({{__("单位")}})</text>
					<view class="m-ad-i-top">
            <text>{{item.invoice_title}}</text><label>{{item.invoice_company_code}}</label>
					</view>
					<view class="m-ad-i-bot">
						<label v-if="(item.invoice_is_default)" class="m-ad-icon">{{__('默认')}}</label>
					</view>
				</view>
				<view class="m-ad-edit tbl">
					<label :data-user_invoice_id="(item.user_invoice_id)"   :data-invoice_type="(item.invoice_type)" @click.stop="editInvoice" class="iconfont icon-edit"></label>
					<label class="iconfont icon-delete" :data-user_invoice_id="(item.user_invoice_id)" :user_invoice_id="(item.user_invoice_id)" @click.stop="removeInvoice"></label>
				</view>
			</view>
			<button class="u-btn u-btn-default" @click="addInvoice" style="margin-top:50rpx;">{{__('添加发票')}}</button>
			<button class="u-btn u-btn-secondary" @click="selectInvoice" style="margin-top:50rpx;" v-if="options.issub">{{__('不开发票')}}</button>
		</view>
		<view class="m-nullpage" v-else @click="addInvoice">
			<view class="m-nullpage-middle">
				<label class="iconfont icon-dizhi"></label>
				<view class="m-null-tip">
					<text>{{__('您尚未添加发票信息?')}}</text>
					<text class="m-null-tipck">{{__('马上去添加发票信息')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>


<style lang="scss">
	@import "../../styles/_variables";

    .m-ad-item:after {
        content: " ";
        position: absolute;
        border-bottom: 1px solid #C8C8CD;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
        color: #C8C8CD;
    }

	.m-ad-item {
		background-color: #fff;
		padding: 24rpx 20rpx 24rpx 30rpx;
		position: relative;
		/*border-bottom: 1px solid #d5d5d5;*/
	}

	.m-ad-l {
		width: 70%;
		display: inline-block;
	}

	.m-ad-i-top {
		font-size: 16px;
		line-height: 50rpx;
	}

	.m-ad-i-top text {
		margin-right: 20rpx;
	}

	.m-ad-i-bot {
		font-size: 14px;
		color: #888;
		line-height: 20px;
		margin-top: 10rpx;
	}


	.m-ad-icon {
		font-size: 12px;
		padding: 4rpx 8rpx;
		background-color: $default-skin-bg;
		color: #fff;
		border-radius: 8rpx;
		margin-right: 8rpx;
		text-align: center;
	}

	.m-ad-edit {
		position: absolute;
		right: 20rpx;
		top: 50%;
		width: 80rpx;
		height: 100rpx;
		margin-top: -50rpx;
		padding-left: 40rpx;
	}

	.m-ad-edit label {
		width: 40rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 35rpx;
		display: block;
		vertical-align: middle;
		text-align: center;
		color: #888888;
	}
  .c-label{
    font-size: 12px;
    color:red;
  }
  .p-label
  {
    font-size: 12px;
    color:green;
  }
</style>

<script>
	import $ from "../../helpers/util";
    import {
        mapState,
        mapMutations
    } from 'vuex'


	export default {
		data() {
			return {
				options:{},
				invoice_list: [],
				isdata: false,
				spid: "",
				user_invoice_id: 0,
				invoice_type:0,
				invoice_header:'',
				is_show:0,
				cart_id:0,
				user_invoice_id:0,
			}
		},
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('发票地址')
			});
			
			this.setData({
				user_invoice_id: options.user_invoice_id || 0,
				invoice_type:options.invoice_type || 0,
				spid: options.spid || "",
				options: options,
				isdata: false,
				cart_id:options.cart_id
			});

			var that = this;
            this.listInvoice();

            that.notice.addNotification("RefreshInvoiceList", that.RefreshMethod, that);
			
			if(that.cart_id){
				that.setData({
					is_show:1
				});
			}
		},
		onShow: function() {
		},
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshInvoiceList", that);
		},
        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
            this.listInvoice();
        },
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			RefreshMethod: function() {
                //console.info('.........RefreshMethod');
				this.listInvoice()
			},
					
			listInvoice: function() {
				var that = this;
				var params = {};

                that.setData({
                    isdata: false,
                    invoice_list: []
                });

				that.$.request({
					url: that.Config.URL.user.invoice_lists,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.items.length > 0) {
							    //that.invoice_list = data.items;
                                that.setData({
                                    isdata: true,
                                    invoice_list: data.items
                                });

							} else {								
								that.setData({
									isdata: false
								});
							}
						}

                        uni.stopPullDownRefresh()
                    }
				});
			},
            modify: function(e) {
				var that = this;
                e.currentTarget.dataset.user_invoice_id;
                let itemList = ['删除']
                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {
                        if (res.tapIndex == 0)
                        {
                            that.editInvoice(e);
                        }
                        else
                        {
                            that.removeInvoice(e);
                        }
                    }
                })

			},
			editInvoice: function(obj) {
				var that = this;
				var options = this.options;
				options.user_invoice_id = obj.currentTarget.dataset.user_invoice_id;
				options.invoice_type = obj.currentTarget.dataset.invoice_type;
				
				if (this.options.issub) {
					that.$.redirectTo({
						url: that.$.createUrl("/member/invoice/manage", options)
					});
				} else {
					that.$.navigateTo({
						url: that.$.createUrl("/member/invoice/manage", options)
					});
				}
			},

			addInvoice: function() {
				var that = this;
				//var options = that.options;

				if (that.options.issub)
				{
					var options = { issub: 1 };
				}
				else
				{
					var options = {};
				}

				if (this.options.issub) {
					that.$.redirectTo({
						url: that.$.createUrl("/member/invoice/manage", options)
					});
				} else {
					that.$.navigateTo({
						url: that.$.createUrl("/member/invoice/manage", options)
					});
				}
			},

			selectInvoice: function (obj) {
					var that = this;
				
					if (this.options.cart_id) {
						this.setData({
							user_invoice_id: obj.currentTarget.dataset.id,
							invoice_type: obj.currentTarget.dataset.invoice_type,
							invoice_header: that.sprintf('%s - %s', obj.currentTarget.dataset.invoice_type==1 ? this.__('普通发票') : this.__('增值税专用发票'), obj.currentTarget.dataset.invoice_title, obj.currentTarget.dataset.invoice_title)
						});
						
						this.goback();
					}
					
				},
			
			removeInvoice: function(e) {
				var that = this;
				that.$.showModal({
					title: "提示",
					content: "确认删除这个发票地址吗？",
					showCancel: true,
					success: function(n) {
						if (n.confirm) {
							var params = {
								user_invoice_id: e.currentTarget.dataset.user_invoice_id,
							};
							that.$.request({
								url: that.Config.URL.user.invoice_remove,
								data: params,
								method:"POST", 
								success: function(data, status, msg, code) {
									if (200 == status) {
										that.$.showToast({
											title: "删除成功！"
										});

                                        that.notice.postNotificationName("RefreshOrder", 0);
                                        that.listInvoice();
									}
								}
							});
						}
					}
				})
			},
			goback: function () {
				var that = this;
				
				$.navigateBack(1, function () {
					var params = that.options;
			
					params.user_invoice_id = that.user_invoice_id;
					params.invoice_type = that.invoice_type;
					params.invoice_header = that.invoice_header;
					that.notice.postNotificationName("Refreshinvoice", params)
				})
			}
		}
	};
</script>
