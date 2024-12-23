<template>
	<view 
	class="container"
	:style="{
		'background-color': hasRefreshContainerBackgroundColor
	}">
		<scroll-view 
		:scroll-y="scrollY"
		class="QS-tabs-wxs-list-refresh-scroll-view"
		:style="{
			'height': hasRefreshContainerheight
		}">
			<view 
			class="QS-tabs-wxs-list-refresh-scroll-view-item"
			@touchstart="setFreeze(true)">
				<slot name="pre"></slot>
			</view>
			<view 
			class="QS-tabs-wxs-list-refresh-scroll-view-item"
			@touchmove.stop="voidFn" 
			@touchstart="setFreeze(false)">
				<QSTabsWxsList 
				ref="QSTabsWxsList"
				hasRefresh
				:minWidth="minWidth"
				:space="space"
				:tabHeight="tabHeight"
				:height="height"
				:lineWidth="lineWidth"
				:lineHieght="lineHieght"
				:lineColor="lineColor"
				:lineMarginBottom="lineMarginBottom"
				:defCurrent="defCurrent"
				:autoCenter="autoCenter"
				:tapTabRefresh="tapTabRefresh"
				:fontSize="fontSize"
				:activeFontSize="activeFontSize"
				:swiperBackgroundColor="swiperBackgroundColor"
				:tabsBackgroundColor="tabsBackgroundColor"
				:tabsFontColor="tabsFontColor"
				:activeFontColor="activeFontColor"
				:activeBold="activeBold"
				:initFnName="initFnName"
				:type="type"
				:zIndex="zIndex"
				:tabsSticky="tabsSticky"
				:refreshImage="refreshImage"
				:refreshDistance="refreshDistance"
				:beforRefreshText="beforRefreshText"
				:releaseRefreshText="releaseRefreshText"
				:isRefreshingText="isRefreshingText"
				:completeRefreshText="completeRefreshText"
				:refreshTextColor="refreshTextColor"
				:refreshTextFontSize="refreshTextFontSize"
				@disabledTouchmove="_emit('disabledTouchmove')"
				@disabledTap="_emit('disabledTap')"
				@setRefreshContainerBgColor="setHasRefreshContainerBackgroundColor">
				</QSTabsWxsList>
			</view>
			<view 
			class="QS-tabs-wxs-list-refresh-scroll-view-item"
			@touchstart="setFreeze(true)">
				<slot name="pos"></slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import QSTabsWxsList from './QS-tabs-wxs-list.vue';
	import publicProps from './js/publicProps.js';
	export default {
		components: {
			QSTabsWxsList
		},
		props: {
			...publicProps,
			hasRefreshContainerheight: {
				type: String,
				default: '100vh'
			}
		},
		data() {
			return {
				scrollY: true,
				hasRefreshContainerBackgroundColor: 'white'
			}
		},
		methods: {
			setFreeze(bl) {
				if(this.scrollY!==bl) this.scrollY = bl;
			},
			setTabs(arr) {
				this.$refs.QSTabsWxsList.setTabs(arr);
			},
			setDisabled(bl) {
				this.$refs.QSTabsWxsList.setDisabled(bl);
			},
			setHasRefreshContainerBackgroundColor(bgColor) {
				this.hasRefreshContainerBackgroundColor = bgColor;
			},
			_emit(name) {
				this.$emit(name);
			},
			voidFn() {}
		}
	}
</script>

<style scoped>
	.container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		transition-property: background-color;
		transition-duration: .3s;
	}
	.QS-tabs-wxs-list-refresh-scroll-view{
		position: relative;
		width: 100%;
		min-height: 200rpx;
		box-sizing: border-box;
	}
	.QS-tabs-wxs-list-refresh-scroll-view-item{
		width: 100%;
		box-sizing: border-box;
	}
</style>
