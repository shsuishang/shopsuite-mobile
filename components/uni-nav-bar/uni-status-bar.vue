<template>
	<view :style="{ height: statusBarHeight }" class="uni-status-bar">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: 20
			}
		},
		mounted() {
      let h = uni.getSystemInfoSync().statusBarHeight;

      if (h >= 7) {
        this.statusBarHeight = (h-2) + 'px'
      } else {
        this.statusBarHeight = h + 'px'
      }
		}
	}
</script>

<style lang="scss" >
	.uni-status-bar {
		// width: 750rpx;
		height: 20px;
		// height: var(--status-bar-height);
	}
</style>
