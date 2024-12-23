<template>
    <view class="page">
        <view class="m-cells m-cells-form">

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('申请类型')}}</label></view>
				<view class="m-cell-bd" v-if="typeList.length > 0">
					<picker mode="selector"  :range="typeList" range-key="user_type_name" :value="index"  @change="bindTypeChange">
						<label>{{typeList[index].user_type_name}}</label>
					</picker>
				</view>
			</view>

			<block v-if="user_info.user_certification == 1">

				<view class="btn_box" v-if="user_info.user_certified_member != 1">
					<button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button>
				</view>
				<view class="btn_box" v-else><button class="u-btn u-btn-default">{{__('认证已通过')}}</button></view>
			</block>
			<block v-else>
				<view class="btn_box"><button class="u-btn u-btn-default">{{__('请先进行实名认证')}}</button></view>
			</block>

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
				user_info: {},
				typeList: [],
				index: 0,

				user_type_id: 0,
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
    onLoad: function(options) {
		uni.setNavigationBarTitle({
			title:this.__('认证会员')
		});

		var that = this;
        this.Phone = this.userInfo.user_mobile;

		this.user_data = Object.assign({}, this.userInfo);

		this.initData();
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		initData:function(){
			let that = this;

			that.$.request({
				url: that.Config.URL.account.typeList.replace(/typ=e/, "typ=json"),
				data: {},
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							typeList: data.items,
							user_info: data.user_info,
						})

						that.user_type_id = that.user_info.type_id;

						for (let i = 0; i < that.typeList.length; i++) {
							if (that.typeList[i].user_type_id == that.user_type_id)
							{
								that.index = i;
								break;
							}
						}
					} else {
					}
				},
			})
		},

		bindTypeChange: function(e) {
			this.index = e.detail.value
			this.user_type_id = this.typeList[this.index].user_type_id

		},



        submitdata: function() {
            let that = this;

                    var params = {
						type_id: that.user_type_id,
                    };

                    that.$.request({
                        url: that.Config.URL.account.certified_member.replace(/typ=e/, "typ=json"),
                        data: params,
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
