<template name="status-bar" :style="{'background-color':backgroundColor}">
    <block>
	<view class="status_bar">
		<view class="top_view" :style="{'background-color':backgroundColor}"></view>
	</view>
    </block>
</template>


<script>

	export default {
		name: "status-bar",
		
		props: {
			backgroundColor: {
				type: String,
				default: '#f7f7f7'
			}
		}
	}
</script>



<style lang="scss">
	.status_bar {
    /* #ifdef MP || APP */
    height: calc(var(--status-bar-height) + 15px + 2px);
    /* #endif */
    /* #ifndef MP || APP */
    height: calc(var(--status-bar-height) - 0px);
    /* #endif */
		width: 100%;
	}
	.top_view{
    /* #ifdef MP || APP */
    height: calc(var(--status-bar-height) + 15px + 2px);
    /* #endif */
    /* #ifndef MP || APP */
    height: calc(var(--status-bar-height) - 0px);
    /* #endif */
		width: 100%;
		position: fixed;
		z-index: 9999;
		top: 0;
	}
</style>

