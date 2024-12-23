<template>
	<view class="loading-box"  :style="'height: ' + h + 'px'">
		<view class="loading"></view>
	</view>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {
		h:0
	};
  },
  created() {
	  var that = this;
	  that.h = that.$.getSystemInfoSync().windowHeight;
  }
};
</script>

<style scoped="true">
	
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

	
.loading {
  position: relative;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: peachpuff;
  -webkit-animation: loading 1.5s infinite linear;
  animation: loading 1.5s infinite linear;
}
.loading:after {
  content: "";
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  border-top: 10rpx solid coral;
  border-bottom: 10rpx solid coral;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-radius: 50%;
  top: -20rpx;
  left: -20rpx;
}

@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loading {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
