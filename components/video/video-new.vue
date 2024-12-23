<template>
	<view style="position: relative;"

			@touchmove="ListTouchMove"
			@touchend.stop="ListTouchEnd"
			@touchstart="ListTouchStart">
		<video
			:src="video_url"
			preload
			:show-play-btn="true"
			:controls="false"
			:style="{ height: height, width: width }"
			:loop="true"
			:id="`video_${video_id}`"
			objectFit="fill"
			:enable-progress-gesture="false"
			ref="video_url"
			play-btn-position="center"
			class="video"
			:poster="cover_url"
			@timeupdate="timeupdate"

			@click.stop="clickVideo"
			>
		</video>
		<cover-image class="play" v-if="show_play" src="https://static.shopsuite.cn/xcxfile/appicon/video/play_1.png"
					 @click.stop="clickVideo"></cover-image>
		<cover-view class="cover-view-left">
			<text class="view-left-text">@{{ nickname }}</text>
			<view class="view-left-text-content">
				<text class="text-content-text">{{ video_describe }}</text>
			</view>
		</cover-view>
		<cover-view class="cover-view-right">
			<cover-image :src="cover_url" class="avater cimg" @click.stop="tapAvater"></cover-image>
			<text class="right-follow">+</text>
			<cover-image v-if="is_like" src="https://static.shopsuite.cn/xcxfile/appicon/video/img/axc.png" class="img-left" @click.stop="onUnLike" :data-story_id="video_id"></cover-image>

			<cover-image v-if="!is_like" src="https://static.shopsuite.cn/xcxfile/appicon/video/img/bed.png" class="img-left" @click.stop="onLike" :data-story_id="video_id"></cover-image>


			<text class="right-text">{{ story_like_count }}</text>
			<cover-image src="https://static.shopsuite.cn/xcxfile/appicon/video/img/ay2.png" style="height: 80rpx;" class="img-left" @click.stop="tapMsg"></cover-image>
			<text class="right-text">{{ pinglun }}</text>
			<cover-image src="https://static.shopsuite.cn/xcxfile/appicon/video/img/b6p.png" style="height: 76rpx;" class="img-left" @click.stop="tapShare"></cover-image>
			<text class="right-text">{{ zhuanfa }}</text>
			<cover-image src="https://static.shopsuite.cn/xcxfile/appicon/video/changpian.png" class="musicIcon cimg"></cover-image>
		</cover-view>
		<!-- <cover-view class="progressBar" :animation="animationData" :style="`width:${barWidth}px`"></cover-view> -->
	</view>
</template>

<script>
import {
	mapState,
	mapMutations
} from 'vuex'

export default {
	props: {
		video_id: {
			type: Number,
			default: 0
		},
		user_id: {
			type: Number,
			default: 0
		},
		nickname: {
			type: String,
			default: ''
		},
		video_describe: {
			type: String,
			default: ''
		},
		cover_url: {
			type: String,
			default: ''
		},
		video_url: {
			type: String,
			default: ''
		},
		dianzan: {
			type: Number,
			default: 0
		},
		is_dianzan: {
			type: Boolean,
			default: false
		},
		pinglun: {
			type: Number,
			default: 0
		},
		zhuanfa: {
			type: Number,
			default: 0
		},
		play: {
			type: Boolean,
			default: false
		},
		index: {
			type: Number,
			default: 0
		},
		cur_index: {
			type: Number,
			default: 0
		},
		height: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			time: 0,
			duration: 10,
			barWidth:0,
			animationData: {},
			times:null,
			show_play:false,


			is_like: false,
			story_like_count: 0,
		};
	},
	created() {
		this.is_like = this.is_dianzan;
		this.story_like_count = this.dianzan;
	},
	computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
	methods: {
		...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
		ListTouchStart(e) {
			//console.log(1, e);
			this.$emit('ListTouchStart', e);
		},
		ListTouchMove(e) {
			//console.log(2, e);
			this.$emit('ListTouchMove', e);
		},
		ListTouchEnd(e) {
			//console.log(3, e);
			this.$emit('ListTouchEnd', e);
		},

		timeupdate(event) {
			let t_w = parseInt(this.width);
			this.duration = event.detail.duration;
			this.time = event.detail.currentTime;
			let width = (this.time / this.duration) * t_w;
			let w = 0;
			// //console.log(t_w);
			// //console.log(width);
			// //console.log(this.barWidth);
			// if(width > this.barWidth){
			// 	w = (width - this.barWidth) /20;
			// 	//#ifndef APP-PLUS-NVUE
			// 	w = (width - this.barWidth) /5;
			// 	//#endif
			// }
			// if(this.barWidth >= t_w || width >= t_w || (this.barWidth >= 300 && width <= 150)){
			// 	this.barWidth = 0;
			// 	clearInterval(this.times);
			// 	//console.log('播放完毕');
			// }else{
			// 	clearInterval(this.times);
			// 	this.times = setInterval(()=>{
			// 		this.barWidth += w;
			// 	},50)
			// }
		},
		tapAvater(){
			this.$.gopage('/community/community/userspace?uid=' + this.user_id);
			//uni.showToast({icon: "success", title: "仅供演示", duration: 2e3})
		},
		tapLove(){
			uni.showToast({icon: "success", title: "仅供演示", duration: 2e3})
		},
		tapMsg(){
			uni.showToast({icon: "success", title: "仅供演示", duration: 2e3})
		},
		tapShare(){
			uni.showToast({icon: "success", title: "仅供演示", duration: 2e3})
		},
		clickVideo(e) {
			//console.log('单视频点击事件');
			this.$emit('clickVideo', e);
		},
		videoPlay() {
			if (this.play) {
				//console.log('播放视频',`video_${this.video_id}`);
				this.videoCtx = uni.createVideoContext(`video_${this.video_id}`, this);
				this.videoCtx.play();
				this.show_play = false;
			} else {
				//console.log('暂停视频',`video_${this.video_id}`);
				this.videoCtx = uni.createVideoContext(`video_${this.video_id}`, this);
				this.videoCtx.pause();
				this.show_play = true;
			}
		},


		onLike: function (a) {
		    let that = this;
		    that.forceUserInfo(function(user) {
		        that.doLike(a.currentTarget.dataset.story_id)
		    });
		},
		doLike: function (story_id) {
		    var that = this, params = {
		        story_id: story_id
		    };

		    that.$.request({
		        url: this.Config.URL.sns.story_like_add,
		        data: params,
		        success: function (data, status, msg, code) {
		            if (200 == status) {
		                that.is_like = true;
						that.story_like_count ++
		            } else {
		            }
		        }
		    });
		},
		onUnLike: function (a) {
		    let that = this;
		    that.forceUserInfo(function(user) {
		        that.canceldianzan(a.currentTarget.dataset.story_id)
		    });
		},
		canceldianzan: function (story_id) {
		    var that = this, params = {
		        story_id: story_id
		    };

		    that.$.request({
		        url: this.Config.URL.sns.story_like_remove,
		        data: params,
		        success: function (data, status, msg, code) {
		            if (200 == status) {
		                //修正当前记录数据
						that.is_like = false;
						that.story_like_count --
		            } else {
		            }
		        }
		    });
		},

	},
	watch: {
		play(newVal, oldVal) {
			//console.info('watch play:');
			//console.info(newVal, oldVal);
			this.videoPlay();
		}
	}
};
</script>

<style lang="scss">
.video {
	width: 100%;
	height: 100%;
	position: relative;
}
.play{
	position: absolute;
	width: 150rpx;
	height: 150rpx;
	left: 300rpx;
	top: 510rpx;
	opacity: 0.5;
}
.progressBar {
	border-radius: 2rpx;
	height: 4rpx;
	background-color: #FF4500;
	z-index: 999999;
	position: absolute;
	bottom: 68rpx;
	/* #ifndef APP-PLUS-NVUE */
	bottom: 0rpx;
	/* #endif */
}

.cover-view-left {
	position: absolute;
	margin-left: 20rpx;
	width: 580rpx;
	bottom: 100rpx;
	z-index: 9999;
	font-size: 14px;
	color: #ffffff;
	/* #ifndef APP-PLUS-NVUE */
	bottom: 30rpx;
	/* #endif */
}
.left-text {
	font-size: 14px;
	color: #ffffff;
}

.cover-view-right {
	position: absolute;
	bottom: 40px;
	right: 30rpx;
	z-index: 9999;
	text-align: center;
	/* #ifndef APP-PLUS-NVUE */
	bottom: 0rpx;
	/* #endif */
}

.avater {
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: #ffffff;
}

.cimg {
	height: 90rpx;
	width: 90rpx;
	margin-bottom: 50rpx;
}

.img-left {
	width: 80rpx;
	height: 66rpx;
	padding-left: 4px;
}
.right-follow {
	position: absolute;
	z-index: 100;
	top: 75rpx;
	left: 28rpx;
	color: #ffffff;
	font-size: 16px;
	width: 34rpx;
	height: 34rpx;
	background-color: #f12f5b;
	text-align: center;
	line-height: 34rpx;
	border-radius: 17rpx;
}

.right-text {
	color: #ffffff;
	font-size: 11px;
	text-align: center;
	margin-bottom: 40rpx;
}
.musicIcon {
	margin-top: 40rpx;
	/* #ifndef APP-PLUS-NVUE */
	animation: rotating 3s linear infinite;
	/* #endif */
}
@keyframes rotating {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
.view-left-text-content {
	flex: 1;
}
.view-left-text {
	color: #ffffff;
	font-size: 18px;
	margin-bottom: 10rpx;
	font-weight: bold;
}
.text-content-text {
	color: #ffffff;
	font-size: 16px;
	line-height: 50rpx;
	height: 100rpx;
	overflow: hidden;
}
</style>
