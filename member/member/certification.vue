<template>
    <view class="page">
        <view class="m-cells m-cells-form">

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('真实姓名')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" v-model="user_data.user_realname" :placeholder="__('请输入真实姓名')" @input="inputReName" maxlength="10" />
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="idcard" v-model="user_data.user_idcard" :placeholder="__('请输入身份证号码')" @input="inputICard" maxlength="18" />
				</view>
				<div v-if="(!isCardNo)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</div>
			</view>


            <view class="m-cell">
                <view style="font-size: 20rpx;">{{__('用于保障账号安全，如用于账号找回、冻结等')}}<br/>{{__('温馨提示：请上传原始比例的身份证正反面，请勿裁剪涂改，保证身份信息清晰显示，否则无法通过审核')}}
				
                </view>
            </view>

			<view class="m-cell" style="padding: 3rpx 30rpx">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证正面')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-if="user_data.user_idcard_image_list[0]">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" data-imgindex="0" :src="user_data.user_idcard_image_list[0]" :data-src="user_data.user_idcard_image_list[0]" @click.stop="upImgs"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-else>
								<view class="uni-uploader__input" data-imgindex="0" @click.stop="upImgs"></view>
							</view>
						</view>
					</view>
				</view>
			</view>


			<view class="m-cell" style="padding: 3rpx 30rpx">
				<view class="m-cell-hd"><label class="u-label">{{__('身份证反面')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-if="user_data.user_idcard_image_list[1]">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" data-imgindex="1" :src="user_data.user_idcard_image_list[1]" :data-src="user_data.user_idcard_image_list[1]" @click.stop="upImgs"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-else>
								<view class="uni-uploader__input" data-imgindex="1" @click.stop="upImgs"></view>
							</view>
						</view>
					</view>

				</view>
			</view>

			<view class="btn_box" v-if="user_data.user_is_authentication == 0 || user_data.user_is_authentication == 3"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>
			<view class="btn_box" v-else-if="user_data.user_is_authentication == 1"><button class="u-btn u-btn-default">{{__('已提交待审核')}}</button></view>
			<view class="btn_box" v-else><button class="u-btn u-btn-default">{{__('实名认证已经审核通过')}}</button></view>
        </view>

    </view>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import verifycodeDialog from '../../components/verifycode-dialog/verifycode-dialog.vue';
export default {
    name: 'asset',
    data: function() {
        return {
				user_data: {
                    user_realname: '',
                    user_idcard: '',
					user_is_authentication:0,
                    user_idcard_image_list: []
                },
				isCardNo: true,
        };
    },
		components: {
			verifycodeDialog,
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
    onLoad: async function(options) {
		uni.setNavigationBarTitle({
			title:this.__('实名认证')
		});

		await this.$onLaunched;
	
		var that = this;
        this.Phone = this.userInfo.user_mobile;

		this.user_data = Object.assign({}, this.userInfo);
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
        inputReName: function(e) {
            this.setData({
                //user_realname: e.detail.value
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

        upImgs: function(e) {
            var that = this;
			var i = e.currentTarget.dataset.imgindex;

            that.$.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                success: function(n) {
                    that.$.showLoading();
                    var r = n.tempFilePaths;
                    that.$.uploadFile({
                        url: that.Config.URL.upload,
                        method: "POST",
                        filePath: r[0],
                        name: "upfile",
                        success: function(n) {
                            that.$.hideLoading();

                            var up_res = that.$.parseJSON(n.data);
							
							if (up_res.status == 200)
							{
								var s = up_res.data.file_url;

								let info = Object.assign({}, that.user_data);
								
								info['user_idcard_image_list'][i] = s;
								//that.login(that.user_data);

								that.setData({
									user_data: info
								})
							}
							else
							{
								that.$.confirm(up_res.msg || that.__('发生错误'));
							}

                        },
                        fail: function(e) {
                            that.$.hideLoading()
                        },
                        complete: function(e) {
                            that.$.hideLoading()
                        }
                    })
                },
                fail: function(e) {
                    that.$.hideLoading()
                },
                complete: function(e) {
                    that.$.hideLoading()
                }
            })
        },
        submitdata: function() {
            let that = this;
			if (!that.$.trim(that.user_data.user_realname)) {
				that.$.confirm('请输入用户名');
				return;
			}
			
			if (!that.user_data.user_idcard) {
				that.$.confirm('请输入身份证号码');
				return;
			}
			
			if(!that.$.idcard(that.user_data.user_idcard)){
				that.$.confirm('请输入正确的身份证号码');
				return;
			}
			
			if (!that.user_data.user_idcard_image_list[0]) {
				that.$.confirm('请上传身份证照片正面');
				return;
			}
			
			if (!that.user_data.user_idcard_image_list[1]) {
				that.$.confirm('请上传身份证照片反面');
				return;
			}

                    var params = {
						user_realname: that.user_data.user_realname,
						user_idcard: that.user_data.user_idcard,
						user_idcard_images: that.user_data.user_idcard_image_list.toString().replace("\""),
                    };

                    that.$.request({
                        url: that.Config.URL.account.saveCertificate.replace(/typ=e/, "typ=json"),
                        data: params,
						method: "POST",
                        success: function(data, status, msg, code) {
                            if (status == 200) {
									that.$.showToast({
										title: that.__("成功,待平台审核"),
										success: function() {
											that.login(that.user_data);

											setTimeout(function() {that.$.navigateBack(1)}, 1500);

										}
									})
                            } else {
								that.$.confirm(msg);
                            }
                        }
                    });
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

.uni-uploader__img
{
	width: 320rpx;
	height: 200rpx;
}
</style>
