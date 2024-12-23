<template>
	<view
	class="container"
	:style="{
		'z-index': zIndex
	}">
		<view
		class="tabs-container"
		:style="{
			'position': String(tabsSticky)==='true'?'sticky': 'relative',
			'z-index': Number(zIndex) + 2,
			'background-color': tabs[getSwiperCurrent]?(tabs[getSwiperCurrent].tabsBackgroundColor || tabsBackgroundColor):tabsBackgroundColor
		}">
			<scroll-view
			id="tabs-scroll"
			scroll-x
			:scroll-left="scrollLeft"
			class="tabs-scroll"
			scroll-with-animation>
				<view
				class="tabs-scroll-box"
				:style="{
					'height': tabHeight,
					'line-height': tabHeight
				}">
					<view
					class="tabs-scroll-item"
					:style="{
						'min-width': minWidth,
						'padding': '0 ' + space
					}"
					v-for="(item, index) in tabs"
					:id="preId + index"
					:key="index"
					@tap="tabTap(index)">
						<view class="hide_text"
						:style="{
							'font-size': fontSize
						}">
							{{item.name || item}}
						</view>
						<view class="abs_text"
						:style="{
							'font-size':  getSwiperCurrent===index?activeFontSize:fontSize,
							'color': getSwiperCurrent===index?(tabs[getSwiperCurrent]?(tabs[getSwiperCurrent].activeFontColor || activeFontColor || tabsFontColor):(activeFontColor || tabsFontColor)):tabsFontColor,
							'font-weight': String(activeBold)==='true'?(getSwiperCurrent===index?'bold':'0'):'0'
						}">
							{{item.name || item}}
						</view>
					</view>

					<view
					id="line"
					class="line"
					:style="{
						'height': lineHieght,
						'width': wxsLineWidth + 'px',
						'bottom': lineMarginBottom,
						'background-color': tabs[getSwiperCurrent]?(tabs[getSwiperCurrent].lineColor || lineColor):lineColor
					}">
					</view>
				</view>
			</scroll-view>
		</view>
		<view
		class="swiper-container"
		:style="{
			'z-index': Number(zIndex) + 1,
			'background-color': tabs[getSwiperCurrent]?(tabs[getSwiperCurrent].swiperBackgroundColor||swiperBackgroundColor):swiperBackgroundColor
		}">
			<block v-if="String(hasRefresh) === 'true'">
				<view
				class="refresh-container"
				id="refresh-container"
				@touchstart="QSREFRESHWXS.touchstart"
				@touchmove="QSREFRESHWXS.touchmove"
				@touchend="QSREFRESHWXS.touchend"
				@touchcancel="QSREFRESHWXS.touchend"
				:change:refreshstatus="QSREFRESHWXS.refreshStatusChange"
				:data-refreshdistance="refreshDistance"
				:data-refreshstatus="refreshStatus"
				:data-readyrefresh="readyRefresh"
				:data-refreshshow="refreshShow"
				:refreshstatus="refreshStatus">
					<view
					class="refresh-image-container"
					:class="{'show': (String(refreshShow) == 'true')}"
					:style="{
						'height': refreshDistance + 'px'
					}">
						<image
						id="refreshImage"
						v-if="refreshImage"
						:src="refreshImage"
						mode="scaleToFill"
						class="refresh-image"
						:class="{'isRefreshing': (String(readyRefresh) == 'false')}"
						></image>
						<view class="refreshText" :style="{
							'font-size': refreshTextFontSize,
							'color': refreshTextColor
						}">{{getRefreshStatusText}}</view>
					</view>
					<swiper
					id="swiper"
					class="swiper"
					:style="{
						'height': getSwiperHieght + 'px'
					}"
					:current="getSwiperCurrent"
					@transition="QSTABSWXS.transition"
					:change:tabsInfo="QSTABSWXS.tabsInfoChange"
					:tabsInfo="tabsInfo"
					:data-tabsinfo="tabsInfo"
					:data-current="getCurrent"
					:data-windowwidth="windowWidth"
					:data-linewidth="lineWidth"
					:data-scrollleft="scrollLeft"
					:data-tabsinfochangebl="tabsInfoChangeBl"
					@change="QSTABSWXS.swiperChange"
					@animationfinish="QSTABSWXS.animationfinish">
						<swiper-item
						v-for="(item, index) in tabs"
						:key="index"
						class="swiper-item"
						:style="{
							'background-color': item.swiperItemBackgroundColor || 'rgba(255,255,255,0)'
						}">
							<!-- 需自行增加列表模板并根据传入的type判断, 展示不同的列表模板 -->
							<block v-if="type === 'xxx'">

							</block>
							<block v-else>
								<templateDef
								ref="QSTabsWxsRef"
								:readyRefresh="getCurrent===index?Boolean(readyRefresh):false"
								:show="String(readyRefresh) === 'true'?
								(getCurrent===index):
								(((index-getCurrent)<=1 && (index-getCurrent)>=-1)?
								true:false)"
								:type="type"
								:current="getCurrent"
								:tab="item"
								:index="index"
								@refreshEnd="setRefreshStatus(4)"></templateDef>
							</block>
						</swiper-item>
					</swiper>
				</view>
			</block>
			<block v-else>
				<swiper
				id="swiper"
				class="swiper"
				:style="{
					'height': getSwiperHieght + 'px'
				}"
				:current="getSwiperCurrent"
				@transition="QSTABSWXS.transition"
				:change:tabsInfo="QSTABSWXS.tabsInfoChange"
				:tabsInfo="tabsInfo"
				:data-tabsinfo="tabsInfo"
				:data-current="getCurrent"
				:data-windowwidth="windowWidth"
				:data-linewidth="lineWidth"
				:data-scrollleft="scrollLeft"
				:data-tabsinfochangebl="tabsInfoChangeBl"
				@change="QSTABSWXS.swiperChange"
				@animationfinish="QSTABSWXS.animationfinish">
					<swiper-item
					v-for="(item, index) in tabs"
					:key="index"
					class="swiper-item"
					:style="{
						'background-color': item.swiperItemBackgroundColor || 'rgba(255,255,255,0)'
					}">
						<!-- 需自行增加列表模板并根据传入的type判断, 展示不同的列表模板 -->
						<block v-if="type === 'xxx'">

						</block>
						<block v-else>
							<templateDef
							ref="QSTabsWxsRef"
							:readyRefresh="getCurrent===index?readyRefresh:false"
							:show="String(readyRefresh) === 'true'?
							(getCurrent===index):
							(((index-getCurrent)<=1 && (index-getCurrent)>=-1)?
							true:false)"
							:type="type"
							:current="getCurrent"
							:tab="item"
							:index="index"
							@refreshEnd="setRefreshStatus(4)"></templateDef>
						</block>
					</swiper-item>
				</swiper>
			</block>

		</view>

		<!-- #ifdef MP -->
		<view
		class="disabled"
		:style="{
			'z-index': Number(zIndex) + 3
		}"
		v-if="disabled"
		@touchmove.prevent="_emit('disabledTouchmove')"
		@tap.prevent="_emit('disabledTap')">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<view
		class="disabled"
		:style="{
			'z-index': Number(zIndex) + 3
		}"
		v-if="disabled"
		@touchmove.stop="_emit('disabledTouchmove')"
		@tap.stop="_emit('disabledTap')">
		<!-- #endif -->

		</view>
	</view>
</template>

<script lang="wxs" module="QSTABSWXS" src="./wxs/QS-tabs-wxs.wxs"></script>
<script lang="wxs" module="QSREFRESHWXS" src="./wxs/QS-refresh-wxs.wxs"></script>

<script>
	import _app from './js/config.js';
	import templateDef from './components/QS-tabs-wxs-template-def.vue';
	import publicProps from './js/publicProps.js';
	const {windowWidth} = uni.getSystemInfoSync();
	export default {
		components: {
			templateDef
		},
		props: publicProps,
		data() {
			return {
				preId: 'QSTabsWxsID_',
				refPre: 'QSTabsWxsRef',
				tabs: [],
				tabsData: [],
				tabsInfo: [],
				windowWidth,
				current: 0,
				swiperCurrent: 0,
				scrollLeft: 0,
				count: 0,
				initStatus: [],
				tabsHeight: 44,
				wxsLineWidth: 0,
				tabsInfoChangeBl: false,
				disabled: false,
				refreshStatus: 1,
				// #ifndef H5
				readyRefresh: false,
				refreshShow: false,
				// #endif
				// #ifdef H5
				readyRefresh: 'false',
				refreshShow: 'false',
				// #endif
			}
		},
		computed: {
			getCurrent() {
				return this.current>this.tabs.length?this.tabs.length:this.current;
			},
			getSwiperCurrent() {
				return this.swiperCurrent>this.tabs.length?this.tabs.length:this.swiperCurrent;
			},
			getSwiperHieght() {
				return Number(this.height) - Number(this.tabsHeight);
			},
			getRefreshStatusText() {
				switch (this.refreshStatus){
					case 1:
						return this.beforRefreshText;
						break;
					case 2:
						return this.releaseRefreshText;
						break;
					case 3:
						return this.isRefreshingText;
						break;
					case 4:
						return this.completeRefreshText;
						break;
					case 5:
						return this.completeRefreshText;
						break;
				}
			}
		},
		methods: {
			setRefreshStatus(status) {
				if(status === this.refreshStatus) return;
				this.refreshStatus = status;
				// //console.log(status);
				switch (status){
					case 2:
						// #ifndef H5
						uni.vibrateShort();
						// #endif
						break;
					case 3:
						this._doInit({refresh: true});
						break;
					case 5:
						setTimeout(()=>{
							this.setRefreshStatus(1);
							this.refreshShow = false;
						}, 1000);
						break;
				}
			},
			setRefreshShow(obj) {
				// #ifndef H5
				this.refreshShow = obj.refreshShow;
				// #endif
				// #ifdef H5
				this.refreshShow = String(obj.refreshShow);
				// #endif
			},
			setReadyRefresh(obj) {
				// #ifndef H5
				this.readyRefresh = obj.readyRefresh;
				// #endif
				// #ifdef H5
				this.readyRefresh = String(obj.readyRefresh);
				// #endif
				// this.$set(this, 'readyRefresh', obj.readyRefresh);
			},
			setDisabled(bl) {
				this.disabled = bl;
			},
			setWxsLineWidth(lineWidth) {
				_app.log('触发了设置线条宽度:' + lineWidth);
				this.wxsLineWidth = lineWidth;
			},
			getTabsHeight() {
				let view = uni.createSelectorQuery().in(this);
				view.select('.tabs-container').boundingClientRect();
				view.exec(res=>{
					_app.log('tabs高度:' + JSON.stringify(res));
					this.tabsHeight = res[0].height;
				})
			},
			getTabsInfo(returnPromise) {
				let view = uni.createSelectorQuery().in(this);
				let scroll = uni.createSelectorQuery().in(this);
				scroll.select('#tabs-scroll').fields({ scrollOffset: true });
				for (let i = 0; i < this.tabs.length; i++) {
					view.select('#' + this.preId + i).boundingClientRect();
				}
				const fn = (cb) => {
					// _app.log('fn执行');
					scroll.exec((data)=>{
						_app.log('scroll布局信息:' + JSON.stringify(data));
						view.exec((res) => {
							_app.log('tabs布局信息:' + JSON.stringify(res));
							const arr = [];
							for (let i = 0; i < res.length; i++) {
								const item = res[i];
								if(item) {
									item.left += data[0].scrollLeft;
									// #ifdef H5
									arr.push(JSON.stringify(item));
									// #endif
									// #ifndef H5
									arr.push(item);
									// #endif
								}
							}
							this.tabsInfoChangeBl = true;
							// #ifdef H5
							this.tabsInfo = JSON.stringify(arr);
							// #endif
							// #ifndef H5
							this.tabsInfo = arr;
							// #endif
							// _app.log('tabsInfo:' + JSON.stringify(arr));
							if(cb && typeof cb === 'function') cb(arr);
						})
					})
				}
				if(returnPromise) {
					return new Promise((resolve, reject)=>{
						setTimeout(()=>{
							fn((arr)=>{
								resolve(arr);
							});
						}, 200)
					})
				}
				fn();
			},
			setTabs(arr) {
				const fn = ()=>{
					this.tabs = arr;
					this.initStatus = new Array(arr.length);
					this.$nextTick(()=>{	//H5需要nextTick后能拿到布局信息
						setTimeout(()=>{	//QQ小程序需要setTimeout后能拿到布局信息
							this.getTabsInfo();
							_app.log('初始化');
							const defCurrent = this._getDefCurrent();
							_app.log('defCurrent:' + defCurrent);
							this.swiperCurrent = defCurrent;
							this.setHasRefreshContainerBackgroundColor(defCurrent);
							this._doInit({index: defCurrent, init: true});
							this.getTabsHeight();
						}, 0)
					})
				}
				if(this.count++ === 0) {
					fn();
				}else{
					this.tabs = [];
					this.current = 0;
					this.swiperCurrent = 0;
					this.$nextTick(()=>{
						setTimeout(fn, 0);
					})
				}
			},
			setHasRefreshContainerBackgroundColor(index) {
				const tab = this.tabs[index];
				if(tab && tab.hasRefreshContainerBackgroundColor) {
					this.$emit('setRefreshContainerBgColor', tab.hasRefreshContainerBackgroundColor);
				}
			},
			_doInit({index, init, tap, slide, refresh} = {}) {
				try{
					index = index !== undefined? index: this.current;
					if(!refresh) {
						const bl_status = this.initStatus[index] === true;
						if(this.initStatus[index] === true) {
							if(slide || init) return;
							if(tap && !(String(this.tapTabRefresh) === 'true')) {
								return;
							}else if (!(this.current === index)) {
								return;
							}else{
								refresh = true;
							}
						}
					}

					const ref = this.$refs[this.refPre][index];
					if(ref) {
						const initFn = ref[this.initFnName];
						if(initFn && typeof initFn === 'function') {
							_app.log('执行了组件内的init函数');
							this.initStatus[index] = true;
							initFn(refresh);
						}else{
							//console.log(this.initFnName + 'not a function');
						}
					}else{
						//console.log('not find ref or init function');
					}
				}catch(e){
					//TODO handle the exception
					//console.log('_doInit方法异常:' + JSON.stringify(e));
				}
			},
			_getDefCurrent() {
				const defCurrent = Number(this.defCurrent);
				const endCurrent = this.tabs.length-1;
				return defCurrent>endCurrent?endCurrent:defCurrent;
			},
			setCurrent(obj) {	//由wxs内部触发animationinish事件
				const current = Number(obj.current);
				if(this.swiperCurrent !== current) {
					this.swiperCurrent = current;
				}
				if(this.current !== current){
					this.current = current;
					this._doInit({index: current, slide: true});
				}
			},
			setSwiperCurrent(obj) {
				const current = Number(obj.current);
				this.swiperCurrent = current;
				this.setHasRefreshContainerBackgroundColor(current);
			},
			tabTap(index) {
				this.swiperCurrent = index;
				this._doInit({index, tap: true});
			},
			setScrollLeft(obj) {
				_app.log('setScrollLeft:' + JSON.stringify(obj));
				if((!(String(this.autoCenter) === 'true')) && !Boolean(obj.tabsChange)) return;
				this.scrollLeft = Number(obj.scrollLeft);
			},
			setTabsInfoChangeBl() {
				this.tabsInfoChangeBl = false;
			},
			_emit(name) {
				this.$emit(name);
			},
			voidFn() {}
		}
	}
</script>

<style scoped>
	@import url("css/QS-tabs-wxs-list.css");
	@import url("css/QS-refresh-image-isrefreshing.css");
</style>
