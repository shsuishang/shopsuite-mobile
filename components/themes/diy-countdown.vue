<template name="diy-countdown">
	<view style="
  margin-left: 12px;
  display: flex;
  font-size: 12px;
  align-items: center;">
		<view class="cttitle">{{timeText}}</view>
		<view class="time-box" v-if="flag">
		    <text v-if="days>0 && !showType">{{days}}</text>
		    <label v-if="days>0 && !showType">{{__('天')}}</label>
		    <text>{{hours}}</text>
		    <label>:</label>
		    <text>{{minutes}}</text>
		    <label>:</label>
		    <text>{{seconds}}</text>
		</view>
	</view>
</template>
<script>
    export default {
        name: "diy-countdown",
        props: {
            startTime: {
                type: String,
                default: ""
            },
            endTime: {
                type: String,
                default: ""
            },
            showType: {
                type: Number,
                value: 0
            }
        },
        data()
        {
            return {
                flag: true, timeText: "", days: 0, hours: 0, minutes: 0, seconds: 0, setTime:null
            }
        },
        created: function (e) {
            var t = this;
            setTimeout(this.start, 200);
        },
        beforeDestroy()
        {
            clearInterval(this.setTime)
        },
        methods: {
            start: function () {
                var t = this;
                this.setTime = setInterval(function () {
                    var e = t.timeFormat();
                    t.setData({flag: e.flag});
                    t.setData({
                        timeText: e.timeText,
                        days: e.days,
                        hours: e.hours>99 ? '99+' : e.hours,
                        minutes: e.minutes,
                        seconds: e.seconds
                    })
                }, 1e3)
            },
            timeFormat: function () {
                var stime = Date.parse(new Date(this.startTime.replace(/-/g, "/"))),
                    etime = Date.parse(new Date(this.endTime.replace(/-/g, "/"))), ctime = Date.parse(new Date), dtime = etime - stime,
                    count_row = {flag: true, timeText: this.__("已结束"), days: 0, hours: 0, minutes: 0, seconds: 0};

                ////console.info('dtime --------------------------');
                ////console.info(dtime);
                if (ctime < stime ? (count_row.timeText = this.__("距开始"), dtime = stime - ctime) : etime < ctime ? (count_row.timeText = this.__("已结束"), count_row.days = "00", count_row.hours = "00", count_row.minutes = "00", count_row.seconds = "00", count_row.flag = false) : (count_row.timeText = this.__("距结束"), dtime = etime - ctime), count_row.flag)
                {
                    var i = Math.floor(dtime / 864e5), n = dtime % 864e5, o = Math.floor(n / 36e5);
                    this.showType && (o = 24 * i + o);
                    var m = n % 36e5, d = Math.floor(m / 6e4), u = m % 6e4, h = Math.round(u / 1e3);
                    count_row.days = 10 <= i ? i : "0" + i, count_row.hours = 10 <= o ? o : "0" + o, count_row.minutes = 10 <= d ? d : "0" + d, count_row.seconds = 10 <= h ? h : "0" + h
                }
                return count_row
            }
        }
    }
</script>


<style lang="scss">
    @import "../../styles/_variables";


/*标题*/

.head-title {
  clear: both;
  box-sizing: border-box;
  height: 80rpx;
  background-color: #fff;
  padding: 20rpx 16rpx;
  display: flex;
  line-height: 40rpx;
  align-items: center;
  position: relative;

  image {
    height: 36rpx;
    max-width: 36rpx;
  }

}

.title-label {
  font-size: 32rpx;
  font-weight: bold;;
  color: #282F40;
  margin-left: 8rpx;
  max-width: 180rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-linke {
  color: #9b9b9b;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  position: absolute;
  right: 24rpx;

  .icon-right {
    font-size: 16rpx;
    margin-left: 8rpx;
  }

}

.countdown-box {
  margin-left: 12px;
  display: flex;
  font-size: 12px;
  align-items: center;
}

.time-box text{
  width: 50rpx;
  height: 40rpx;
  line-height: 40rpx;
}

.time1 text {
	width: 50rpx;
	height: 40rpx;
	line-height: 40rpx;
	display: inline-block;
	background-color: #f1f1f1;
	color: #db384c;
	text-align: center;
	border-radius: 2px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.time2 text {
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  background-color: #db384c;
  color: #fff;
  text-align: center;
  border-radius: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.countdown-box label {
  display: inline-block;
  padding: 0 4rpx;
  color: #9b9b9b;
}

.time-box {
	margin-left: 10rpx;
	display: flex;
	align-items: center;
	font-size: 12px;

	line-height: 44rpx;
	height: 44rpx;
}

.cttitle {
	font-size: 24rpx;
	line-height: 44rpx;
	height: 44rpx;
	color: #9b9b9b;
	word-break: keep-all;
}

/*标题*/
</style>

