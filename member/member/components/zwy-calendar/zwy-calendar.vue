<template>
	<view class="calendar-box">
		<!-- <view class="month">
			<view @click="lastMonth">上月</view>
			<view>{{year}}年{{month}}月</view>
			<view @click="nextMonth">下月</view>
			<picker v-if="checkDate" class="picker" mode="date" fields="month" @change="changeDate" />
		</view> -->
		<view class="week">
			<view :style="'color:'+(weeks==weeked?bgweek:'')+';'" v-for="(weeks, i) in weekArr" :key="i">{{weeks}}</view>
		</view>
		<view class="day">
			<view :class="[{'textNone': isOpen && Math.floor((1+parseInt(localDateIndex))/7) !== Math.floor((index)/7)},{'checkday':days.date==''},{'choose':days.date==localDate}]"
				:style="'background:'+(days.date==localDate?bgday:'')+';'" v-for="(days,index) in dayArr" :key="index"
				@click="signToday(days,index)">
				{{days.day}}
				<view :class="[{'circle':days.flag},{'repair':days.day<day},{'sign':days.day==day}]"></view>
			</view>
		</view>
		<view v-if="btnVisible" class="btn-toggle" @click="toggleHandle">{{ isOpen ? '展开' : '收起' }}</view>
	</view>
</template>

<script>
	export default {
		props: {
			lang: {
				type: String,
				default: 'zh'
			},
			type: {
				type: String,
				default: 'calendar'
			},
			checkDate: {
				type: Boolean,
				default: false
			},
			bgweek: {
				type: String,
				default: '#FF8F22'
			},
			bgday: {
				type: String,
				default: '#FF8F22'
			},
			signDayArr: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				weeked: '', // 今天周几
				dayArr: [],
				localDate: '', // 今天日期
				localDateIndex: 1, // 以1为开始的所有
				day: new Date().getDate(), // 当前日
				year: new Date().getFullYear(), // 当前年
				month: new Date().getMonth() + 1, // 当前月
				weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 每周
				isOpen: true, //是否需要打开
				btnVisible: true, //按钮是否需要显示
				sign_day_arr: [] 
			}
		},
		watch: {
		     signDayArr: function(val, oldVal) {
		         this.sign_day_arr = val
				 this.renderDate()
		     }
		},
		mounted() {
			let that = this;
			// 初始日期
			that.initDate();
			// 今天日期
			that.localDate = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(that.day);
			that.renderDate();
		},
		methods: {
			renderDate() {
				let that = this;
				
				// 今天周几
				that.weeked = that.weekArr[new Date().getDay()];
				// 签到功能
				if (that.type != 'calendar') {
					for (let i in that.dayArr) {
						if (that.in_array(that.dayArr[i].date, that.sign_day_arr)) {
							that.$set(that.dayArr[i], 'flag', true);
						} else {
							that.$set(that.dayArr[i], 'flag', false);
						}
						
						if (that.dayArr[i].date == that.localDate) {
							that.localDateIndex = i
						}
					}
				}
			},
			// 选择年月
			changeDate(e) {
				let that = this;
				that.year = parseInt(e.detail.value.split('-')[0]);
				that.month = parseInt(e.detail.value.split('-')[1]);
				that.initDate();
			},
			in_array(search, array) {
				for (var i in array) {
					if (array[i] == search) {
						return true;
					}
				}
				return false;
			},
			toggleHandle() {
				this.isOpen = !this.isOpen;
			},
			// 点击签到
			signToday(obj, index) {
				return
				let that = this;
				// 指定签到类型可访问
				if (that.type == 'calendar') return;
				// 限制本月可进行签到
				if ((new Date().getMonth() + 1) != parseInt(obj.date.split('-')[1])) return;
				// 禁用非本月点击签到且限制签到日期小于等于本日
				if (obj.date != '' && obj.day <= that.day) {
					// 开启已签到提醒
					if (that.dayArr[index].flag) {
						uni.showToast({
							title: '已签到',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: that.day > obj.day ? '补签成功' : '签到成功',
							icon: 'success'
						});
						that.$set(that.dayArr[index], 'flag', true);
						that.$emit('change', obj.date);
					}
				}
			},
			// 初始化日期
			initDate() {
				let that = this;
				that.dayArr = [];
				// 当前月总天数
				let totalDay = new Date(that.year, that.month, 0).getDate();
				// 遍历总天数将日期逐个添加至数组
				for (let i = 1; i <= totalDay; i++) {
					// 得到需补充天数
					let value = (new Date(that.year, that.month - 1, i)).getDay();
					// 补充前面空白日期
					if (i == 1 && value != 0) that.addBefore(value);
					// 添加本月日期
					let obj = {};
					obj.date = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(i);
					obj.day = i;
					that.dayArr.push(obj);
					// 补充后面空白日期
					if (i == totalDay && value != 6) that.addAfter(value);
				}
			},
			// 补充前面空白日期
			addBefore(value) {
				let that = this;
				let totalDay = new Date(that.year, that.month - 1, 0).getDate();
				for (let i = 0; i < value; i++) {
					let obj = {};
					obj.date = '';
					obj.day = totalDay - (value - i) + 1;
					that.dayArr.push(obj);
				}
			},
			// 补充后空白日期
			addAfter(value) {
				let that = this;
				for (let i = 0; i < (6 - value); i++) {
					let obj = {};
					obj.date = '';
					obj.day = i + 1;
					that.dayArr.push(obj);
				}
			},
			// 格式化日期位数
			formatNum(num) {
				return num < 10 ? ('0' + num) : num;
			},
			// 上一个月
			lastMonth() {
				let that = this;
				if (that.month == 1) {
					that.year -= 1;
					that.month = 12;
				} else {
					that.month -= 1;
				}
				that.initDate();
			},
			// 下一个月
			nextMonth() {
				let that = this;
				if (that.month == 12) {
					that.year += 1;
					that.month = 1;
				} else {
					that.month += 1;
				}
				that.initDate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.calendar-box {
		width: 100%;
		flex-direction: column;
		justify-content: center;
	}

	.calendar-box,
	.month,
	.week,
	.day {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.month,
	.week,
	.day {
		width: 700rpx;
	}

	.month {
		margin: 30rpx 0;
		position: relative;
	}

	.picker {
		width: 160rpx;
		height: 40rpx;
		position: absolute;
		top: 20rpx;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.day {
		flex-wrap: wrap;
	}

	.week>view,
	.day>view {
		width: 100rpx;
		height: 100rpx;
		text-align: center;
		position: relative;
		line-height: 100rpx;
	}

	.checkday {
		color: #999;
	}

	.choose {
		color: #FFFFFF;
		border-radius: 50%;
	}

	.circle {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.sign {
		background-color: #0089fe;
	}

	.repair {
		background-color: #f4a01a;
	}
	
	.textNone {
		display: none;
	}
	.textOpen {
		display: block;
	}
	.btn-toggle {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #dbdbdb;
		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 10rpx;
		}
		.translate {
			transform: rotate(180deg);
		}
	}
</style>
