<template>
	<view class="feedback-page">
		<view class="list-block" v-if="feedbackCategoryList && feedbackCategoryList.length">
			<view class="feedback-category-item" v-for="(item, index) in feedbackCategoryList" :key="index">
				<view class="feedback-category">
					<!-- <view class="category-image">
						<image src=""></image>
					</view> -->
					<view class="category-text more-icon">
						{{ item.feedback_type_name }}
					</view>
				</view>
				<view class="feedback-category-sub-list" v-if="item.rows && item.rows.length">
					<navigator :url="'/member/member/feedback-add?id=' + item1.feedback_category_id" class="feedback-category-sub-item" v-for="(item1, ii) in item.rows" :key="ii">
						{{ item1.feedback_category_name }}
					</navigator>
				</view>
			</view>
		</view>

		<view class="feedback-list">
			<view class="list-header">
				{{__('反馈列表')}}
			</view>
			<view class="list-block">
				<view class="feedback-list-item" v-for="(item, index) in feebbackList" :key="index">
					<view class="hjs-feedback-title">
						{{ item.feedback_question }}
					</view>
					<view class="feedback-detail">
						{{__('回复')}}：<block v-if="(item.feedback_question_answer)">{{ item.feedback_question_answer }}</block>
						<block v-else>{{ __('暂未回复') }}</block>
					</view>
					<view class="feedback-time">
						{{__('时间')}}：{{ item.feedback_question_time }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				categoryLists:[],
				flag: true,
				ispage: true,
				isdata: true,
				feedbackCategoryList: [],
				feebbackList:[],
				Id: 1
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),

		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('反馈列表')
			});

			if(options.isdistri)
			{
				this.setData({
					Id:1
				})

			}
			else
			{
				this.setData({
					Id:2
				})
			}

			this.getcategory()
			// this.getlist()
		},

		onShow: function(options) {
			this.setData({
				flag: true,
				ispage: true,
				isdata: true,
				feebbackList: []
			})
			this.getlist()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getlist: function() {
				var that =this;
				var params = {

				}
				that.$.request({
				    url: this.Config.URL.user.feedback_lists,
				    data: params,
				    // ajaxCache: {
				    //     timeout: this.Config.CACHE_EXPIRE
				    // },
				    success: function(data, status, msg, code) {

				      if (200 == status && data.items.length > 0) {
						  for (var r = 0; r < data.items.length; r++) {
							  data.items[r]['feedback_question_time'] = that.$.formatDateFormatter(data.items[r]['feedback_question_time'], 'yyyy-MM-dd hh:mm:ss')
						  }
				      	if (data.page >= data.total) {
				      		that.setData({
				      			flag: false,
				      			ispage: false,
				      			feebbackList: that.feebbackList.concat(data.items),
				      		})
				      	} else {
				      		that.setData({
				      			flag: true,
				      			ispage: true,
				      			feebbackList: that.feebbackList.concat(data.items),
				      		})
				      	}

				      	that.setData({
				      		isdata: true
				      	})

				      } else {
				      	that.setData({
				      		flag: false,
				      		ispage: false,
				      		isdata: false
				      	})
				      }
				    }
				});
			},

			getcategory: function() {
				var that =this;
				var params = {
					feedback_type_genus: this.Id,
				}
				that.$.request({
				    url: this.Config.URL.user.feedback_category,
				    data: params,
				    // ajaxCache: {
				    //     timeout: this.Config.CACHE_EXPIRE
				    // },
				    success: function(data, status, msg, code) {
				       that.setData({
						   feedbackCategoryList:data
					   })

				    }
				});
			},
		}
	}
</script>

<style scoped lang="scss">
.feedback-category-item{
	background: #fff;
	display: flex;
	margin-bottom: 10px;
	min-height: 92px;
}
.feedback-category{
	width: 33%;
	border-right: 1px solid #eee;
	display: flex;
	overflow: hidden;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.category-image{
	width: 30px;
	height: 30px;
	border-radius: 50%;
	overflow: hidden;
	image{
		width: 100%;
		height: 100%;
	}
}
.category-text{
	color: #212121;
	margin-top: 5px;
}
.feedback-category-sub-list{
	display: flex;
	flex-wrap: wrap;
	flex: 1;
}
.feedback-category-sub-item{
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #eee;
	border-left: none;
	border-top: 0;
	font-size: 12px;
	min-height: 46px;
	box-sizing: border-box;
}
.more-icon{
	display: flex;
	align-items: center;
	justify-content: center;
	&::after{
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		border: 1px solid currentColor;
		border-left: none;
		border-bottom: none;
		margin-left: 5px;
		transform: rotate(45deg);
	}
}
.feedback-list{
	background-color: #fff;
	.list-header{
		line-height: 50px;
		padding: 0 10px;
		font-weight: bold;
		border-bottom: 1px solid #eee;
	}
	.feedback-list-item{
		padding: 0 10px 10px;
		margin: 10px 0;
		border-bottom: 1px solid #eee;
	}
	.hjs-feedback-title{
		font-size: 18px;
		color: #333;
		margin-bottom: 5px;
	}
	.feedback-detail{
		line-height: 1.4;
		margin-bottom: 10px;
	}
	.feedback-time{
		color: #aaa;
		font-size: 12px;
	}
}
</style>
