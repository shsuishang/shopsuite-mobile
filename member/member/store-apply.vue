<template>
    <view class="page">
        <view class="m-cells m-cells-form">
            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('入驻类型')}}</label></view>
                <view class="m-cell-bd">
                    <picker mode="selector" @change="selectStoreType" :value="index" :range="store_type"
                            range-key="name" style="float:right">
                        <label style="padding:0 40rpx;">{{store_type[index].name}}</label>
                    </picker>
                </view>
            </view>
            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('店铺名称')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.store_name" :placeholder="__('请输入店铺名称')"/>
                </view>
                <div v-if="!(store_row.store_name)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>

            <view class="m-cell" v-if="false">
                <view class="m-cell-hd"><label class="u-label">{{__('经营类目')}}</label></view>
                <view class="m-cell-bd">
                    <picker mode="selector" @change="selectStoreCategory" :value="store_category_index"
                            :range="store_category_rows" range-key="store_category_name" style="float:right">
                        <label style="padding:0 40rpx;">{{store_category_rows[store_category_index].store_category_name}}</label>
                    </picker>
                </view>
            </view>

            <view class="m-cell" @click="chooseCategory">
                <view class="m-cell-hd"><label class="u-label">{{__('经营类目')}}</label></view>
                <view class="m-cell-bd">
                    <label>{{store_row.store_category_text}}</label>
                </view>
                <view v-if="(!store_row.store_category_id)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('公司名称')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.company_name" :placeholder="__('请输入公司名称')"/>
                </view>
                <div v-if="!(store_row.company_name)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>


            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('开户银行')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.bank_name" :placeholder="__('……银行……分行……支行')"/>
                </view>
                <div v-if="!(store_row.bank_name)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>


            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('银行账户')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.bank_account_number"
                           :placeholder="__('请输入银行账户')"/>
                </view>
                <div v-if="!(store_row.bank_account_number)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>


            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('联系人')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.contacts_name" :placeholder="__('请输入联系人')"/>
                </view>
                <div v-if="!(store_row.contacts_name)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>


            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('联系手机')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.contacts_phone" :placeholder="__('请输入联系手机')"/>
                </view>
                <div v-if="!(store_row.contacts_phone)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('企业地址')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" type="text" v-model="store_row.company_address"
                           :placeholder="__('请输入企业地址')"/>
                </view>
                <div v-if="!(store_row.company_address)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </div>
            </view>


            <view class="m-cell" @click="onSelectAddress">
				<view class="m-cell-hd"><label class="u-label">{{__('省/市/区')}}</label></view>
                <view class="m-cell-bd">
                    <label>{{store_row.company_area}}</label>
                </view>
                <view v-if="(!store_row.store_district_id)" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view>
            </view>

            <view class="m-cell" style="padding: 2rpx 30rpx">
                <view class="m-cell-hd"><label class="u-label">{{__('营业执照')}}</label></view>
                <view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
                    <view class="uni-uploader-body">
                        <view class="uni-uploader__files">
                            <block v-if="store_row.business_license_electronic">
                                <view class="uni-uploader__file">
                                    <image class="uni-uploader__img" :src="store_row.business_license_electronic"
                                           :data-src="store_row.business_license_electronic"
                                           @click.stop="upImgs"></image>
                                </view>
                            </block>
                            <view class="uni-uploader__input-box" v-else>
                                <view class="uni-uploader__input" @click.stop="upImgs"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>


			<view class="m-cell" style="padding: 2rpx 30rpx">
			    <view class="m-cell-hd"><label class="u-label">{{__('其它证件')}}</label></view>
			    <view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
			        <view class="uni-uploader-body">
			            <view class="uni-uploader__files">
							<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="Config.URL.upload_file" :heaer="header" :showProcess="true" :attachmentList.sync="attachmentList" @uploadSuccess="uploadSuccess" :styleObj="{'width':'208rpx', 'height':'208rpx', margin:'10rpx'}"></Attachment>
			            </view>
			        </view>
			    </view>
			</view>
        </view>


        <button class="u-btn u-btn-default" @click="submitinfo">{{__('保存')}}</button>

        <!-- 分类选择 -->
        <storeCategory
                ref="storeCategory"
                :height="height"
                :type="2"
                @confirmCallback="confirmCallback"
        >
        </storeCategory>


		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
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

    .m-icon-warn {
        color: red;
    }
</style>

<script>

    import {mapMutations, mapState} from 'vuex'


    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
    import $ from "../../helpers/util";
	import Attachment from './jin-attachment/jin-attachment.vue';
    import storeCategory from './shop/category.vue';

    export default {
        components: {
            mpvueCityPicker,
            storeCategory,
			Attachment
        },
        data()
        {
            return {
                options: {},

                height: '500px',

                index: 0,
                store_type: [],
                //store_category_index: 0,
                //store_category_rows: [{store_category_id: 1001, store_category_name: '请选择经营类目'}],

                store_row: {
                    store_name: '',
                    store_o2o_flag: 0,
                    store_category_id: 0,
                    store_category_text:'请选择经营类目',
                    company_name: '',
                    bank_name: '',
                    bank_account_number: '',
                    contacts_name: '',
                    contacts_phone: '',

					store_district_id: '',
					company_area:'请选择地址',

                    company_address: '',
                    business_license_electronic: '',
					company_other_files:[]
                },

                cityPickerValueDefault: [0, 0, 0],
                themeColor: '#007AFF',
				header: {
					// 如果需要header，请上传
				},

				attachmentList: [
				]

            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function (options) {
            uni.setNavigationBarTitle({
                title: this.__('商家入驻')
            });


            this.store_type = [{id: 0, name: this.__('线上网店商家')}, {id: 1, name: this.__('线下门店商家')}];
            this.store_row['store_category_text'] = this.__('请选择经营类目');
            this.store_row['company_area'] = this.__('请选择地址');


            var that = this;
            this.setData({
                options: options
            });

            this.forceUserInfo((user) => {
                if (user)
                {
                    /*
					if (user.user_level_id <= 1001)
					{
						that.$.showModal("只有店主才可激活店铺");
						setTimeout(function () {
							that.$.navigateBack(1, function () {
							})
						}, 2e3)

						return;
					}
                    */

                    let params = {}
                    $.request({
                        url: this.Config.URL.user.joinIn.replace(/typ=e/, "typ=json"),
                        data: params,
                        success: function (data, status, msg, code) {
                            if (200 == status)
                            {
                                that.store_row.store_category_id = data.store.store_category_id

                                that.store_category_rows = []
                                for (var p in data.store_category_rows)
                                {
                                    that.store_category_rows.push(data.store_category_rows[p])

                                    if (data.store.store_category_id == data.store_category_rows[p].store_category_id)
                                    {
                                        that.store_category_index = that.store_category_rows.length - 1;
										that.store_row.store_category_id = that.store_category_rows[that.store_category_index].store_category_id
										that.store_row.store_category_text = that.store_category_rows[that.store_category_index].store_category_name
                                    }
                                }

                                that.store_row.store_name = data.store.store_name || ''
                                that.store_row.store_district_id = data.store.store_district_id || ''
                                that.store_row.store_area = data.store.store_area || ''
                                that.store_row.store_o2o_flag = data.store.store_o2o_flag || 0
								that.index = data.store.store_o2o_flag || 0

                                if (data.company)
                                {
                                    that.store_row.company_name = data.company.company_name || ''
                                    that.store_row.company_area = data.company.company_area || ''
                                    that.store_row.store_area = data.store.store_area || data.company.company_area || ''
                                    //that.store_row.bank_account_name = data.company.bank_account_name || ''
                                    that.store_row.bank_name = data.company.bank_name || ''
                                    that.store_row.bank_account_number = data.company.bank_account_number || ''
                                    that.store_row.contacts_name = data.company.contacts_name || ''
                                    that.store_row.contacts_phone = data.company.contacts_phone || ''
                                    that.store_row.company_address = data.company.company_address || ''
                                    that.store_row.business_license_electronic = data.company.business_license_electronic || ''

									that.store_row.company_other_files = data.company.company_other_files || []
                                }

								that.attachmentList = []
								if (that.store_row)
								{
									for(var idx in that.store_row.company_other_files)
									{
										let tmp = {};

										tmp.url = that.store_row.company_other_files[idx]
										tmp.fileName = that.store_row.company_other_files[idx]
										tmp.type = that.$.isImg(tmp.url) ? 'image' : 'file'

										that.attachmentList.push(tmp);
									}
								}
                            }
                            else
                            {
                            }
                        },
                    });
                }
            });
        },
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
        onUnload()
        {
        },

        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			uploadSuccess(result) {
				if(result.statusCode == 200) {
					//上传成功的回调处理
					uni.showToast({
						title: this.__('上传成功'),
						icon: 'none'
					});
				}else{
					uni.showToast({
						title: this.__('上传失败'),
						icon: 'none'
					});
				}

				console.info(this.attachmentList)
			},
            selectStoreType: function (e) {
                this.index = e.detail.value;
                this.store_row.store_o2o_flag = e.detail.value;
            },
            selectStoreCategory: function (e) {
                this.store_category_index = e.detail.value;
                this.store_row.store_category_id = this.store_category_rows[this.store_category_index].store_category_id;
            },
            submitinfo: function () {
                var that = this;

                if (that.store_row.business_license_electronic == '')
                {
                    that.$.alert(that.__('请上传营业执照'))
                    return;
                }


                for (var p in this.store_row)
                {
                    if (this.store_row[p] === '')
                    {
                        //that.$.alert(p + '---')

                        that.$.alert(that.__('请填写完整资料！'))

                        return;
                    }
                }


                let params = this.store_row;
				params.company_other_files = []


				for (let i = 0; i < that.attachmentList.length; i++) {
				    params.company_other_files.push(that.attachmentList[i].url);
				 }


                that.$.request({
                    url: this.Config.URL.store.add,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
							that.$.showModal(that.__('申请成功,待审核'));
							setTimeout(function () {
								that.$.navigateBack(1, function () {
								})
							}, 2e3)
                        }
                        else
                        {
                            that.$.alert(msg)
                        }
                    }
                });


            },

            upImgs: function (e) {
                var that = this;

                that.$.chooseImage({
                    count: 1,
                    sizeType: ["compressed"],
                    success: function (n) {
                        that.$.showLoading();
                        var r = n.tempFilePaths;
                        that.$.uploadFile({
                            url: that.Config.URL.upload,
                            method: "POST",
                            filePath: r[0],
                            name: "upfile",
                            success: function (n) {
                                that.$.hideLoading();

                                var up_res = that.$.parseJSON(n.data);

                                if (up_res.status == 200)
                                {
                                    var s = up_res.data.file_url;

                                    that.store_row.business_license_electronic = s
                                    that.$forceUpdate();
                                }
                                else
                                {
                                    that.$.confirm(up_res.msg || that.__('发生错误'));
                                }
                            },
                            fail: function (e) {
                                that.$.hideLoading()
                            },
                            complete: function (e) {
                                that.$.hideLoading()
                            }
                        })
                    },
                    fail: function (e) {
                        that.$.hideLoading()
                    },
                    complete: function (e) {
                        that.$.hideLoading()
                    }
                })
            },
            chooseCategory: function(e) {
                let that = this;

                this.height = '550rpx';
                this.$refs.storeCategory.show();
            },
            //回调
            confirmCallback: function(store_category_text, store_category_id) {
                console.log(store_category_text);
                console.log(store_category_id);

				this.store_row.store_category_id = store_category_id;
				this.store_row.store_category_text = store_category_text;
            },

			// 三级联动选择
			onSelectAddress(e) {
				this.$refs.mpvueCityPicker.show()
			},

			onCancel(e) {
				//console.log(e)
			},

			onConfirm(e) {
				let that = this;

				let district_info = that.$.isNull(e.label.toString()) ? that.__('请选择地址') : e.label.toString();
				this.store_row['company_area'] = district_info;
				this.store_row['store_area'] = district_info;
				this.store_row['store_district_id'] = that.sprintf('%d/%d/%d', e.value[0], e.value[1], e.value[2]);
			}
        }
    };
</script>
