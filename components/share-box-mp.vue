<template name="share-box-mp">
	<view :class="['shareMsk', isShare?'':'hide']">
		<view :class="['sharebox', isShareBox?'bounceInUp animated':'bounceOutDown animated']">
			<view class='shareList g-flex '>
                <!-- #ifdef MP-WEIXIN -->
				<view class='shareItem g-flex-item'>
					<view class='shareBtn'>
						<button open-type="share" style='line-height:0' hover-class="none">
							<image src='https://static.shopsuite.cn/xcxfile/appicon/images/friend.png' style='width:100rpx;height:100rpx;margin-bottom:6rpx'></image>
						</button>
						<label>{{__('分享给朋友')}}</label>
					</view>
				</view>
                <!-- #endif -->
				<view class='shareItem g-flex-item'>
					<view class='shareBtn' @click='shareQRCode'>
						<image src='https://static.shopsuite.cn/xcxfile/appicon/images/allfriend.png' style='width:100rpx;height:100rpx'></image>
						<label>{{__('生成海报')}}</label>
					</view>
				</view>
			</view>
			<view class='cancelShare' @click='cancelShare'>{{__('取消')}}</view>
		</view>
		<view :class="['shareCodeImg', IsJT?'':'hide']">
			<uni-icons  class="uni-icon uni-icon-clear mp-clean-icon hide"  type="clear" size="20" @click='cancelShare' v-if="false"/>
			<view class="uni-icon uni-icon-clear mp-clean-icon" @click='cancelShare'></view>
			<view  @click='showCodeImg'>
				<image mode="widthFix" :src='path'></image>
			</view>
      <!-- #ifdef MP-WEIXIN || H5 -->
			<label>{{__('查看海报，长按保存到相册')}}</label>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
			<button type="primary" size="mini" @click="saveImg">{{__('保存图片')}}</button>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN || H5 -->
      <button type="primary" size="mini" @click="saveImg">{{__('查看海报')}}</button>
      <!-- #endif -->
		</view>
	</view>
</template>


<script>

	export default {
		name: "share-box-mp",
		props: {
			shareDataDefault: {
				type: Object,
				default() {
					return {
						shareTitle: '',
						shareText: '',
						href: '',
						image: '',
						price: 0
					}
				},
			},
		},
		data(){
			return {
				IsJT:false,
				path:"",
				isShare:false,
				isShareBox:false
			}
		},
        methods: {
			cancel() {
				this.isShareBox = false;
				this.isShare = false;
				this.$emit('onCancel');
			},
			show() {
				this.isShareBox = true;
				this.isShare = true;
			},

			cancelShare: function() {
				this.isShareBox = false;
				this.isShare = false;
				this.IsJT = false;

				this.$emit('cancelShare')
			},
			shareQRCode: function(e) {
				console.log('33333333333333333');
				var that = this;
        that.setData({
          isShare: true,
          isShareBox: false,
          IsJT: true
        });

				this.$emit('shareQRCode');
			},
			saveImg: function(e) {
				var that = this;

        //#ifdef H5
        this.showCodeImg();
        //#endif

        //#ifdef MP-WEIXIN
        this.showCodeImg();
        //#endif

        // #ifdef APP-PLUS
        that.$.showLoading('保存中...');
        uni.saveImageToPhotosAlbum({
          filePath: this.path,
          success: function (res) {
            that.setData({
              path: "",
              isShare: !1,
              isShareBox: !1,
              IsJT: !1
            });
            that.$.hideLoading()
            that.$.alert('保存成功,分享给好友吧！')
          }
        });
        // #endif

				this.$emit('saveImg')
			},showCodeImg: function () {
        let that = this;
        that.$.previewImage({
          current: that.path,
          urls: [that.path]
        });
        this.$emit('showCodeImg');
      }
    }
	}
</script>


<style lang="scss">
	.mp-clean-icon{
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		color: #999999;
	}
</style>

