<template>
	<view>
		<!-- 弹出层 -->
		<view :class="['sel-popup', isShow ? 'sel-open' : '', animation ? 'sel-animation' : '']">
			<view class="sel-box">
				<view class="sel-top">
					<view class="sel-top-left" @click="getResult('cancel')">取消</view>
					<view :class="confirmClass" @click="getResult('confirm')">确定</view>
				</view>
				<view class="sel-title">
					<view class="sel-title-item" v-for="(i, e) in tabList" :key="e" @click="checkTab(e)">
						<view v-if="tabId >= e" :id="'se-' + e"
							:class="tabId == e ? ' sel-title-item-true' : 'sel-title-item-false'">
							{{ checkArr[e] ? checkArr[e].district_name : i.title }}
						</view>
					</view>
				</view>
				<scroll-view class="sel-scroll-view_H" scroll-y="true">
					<view class="sel-scroll-view-box" v-if="checkBox.length && checkBox[tabId]">
						<view class="sel-scroll-view-list" v-for="(item, index) in checkBox[tabId]" :key="index"
							@click="check(index)"
							:class="checkArr[tabId] ? item.district_name == checkArr[tabId].district_name ? 'sel-scroll-view-item-true' : 'sel-scroll-view-item' : 'sel-scroll-view-item'">
							{{ item.district_name }}
						</view>
					</view>
					<view class="sel-scroll-view-noBox" v-else>
						<image :src="noDataImg"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>
				<view v-show="safeArea" class="sel-temp"></view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view v-show="isShow" class="sel-mask" @click="isMask ? close() : ''"></view>
	</view>
</template>

<script>
	import noData from '../../static/noData.png'
	export default {
		props: {
			//是否开启动画
			animation: {
				type: Boolean,
				default: true,
			},
			//是否点击阴影关闭
			isMask: {
				type: Boolean,
				default: true,
			},
			//是否开启安全条
			safeArea: {
				type: Boolean,
				default: true,
			},
      pickerValueDefault: {
        type: Array,
        default: [0, 0, 0],
      },
		},
		computed: {
			confirmClass() {
				return this.checkArr.length == this.tabList.length ? 'sel-top-right-check' : 'sel-top-right';
			},
		},
		data() {
			return {
				isShow: false,
				checkBox: [],
				noDataImg: '',
				cityList: [],
				tabId: 0, //计算当前顶部滑块id
				checkArr: [],
				id: 0, //通tabId，他们2的区别是，id先赋值，tabId在数据请求成功后才会赋值
				tabList: [{
						title: '选择所在省',
						id: 0,
					},
					{
						title: '选择所在市',
						id: 1,
					},
					{
						title: '选择所在县',
						id: 2,
					}
				],
			};
		},
		mounted() {
			this.noDataImg = noData
		},
    created() {
      // this.$nextTick(() => {
      //   this.init();
      // })
    },
    watch: {
      pickerValueDefault: {
        async handler(newVal) {
          await  this.init();

          for (let idx = 0; idx < 3; idx++) {
            for (let i = 0; i < this.checkBox[this.id].length; i++) {
              if (this.checkBox[this.id][i].district_id == newVal[this.id]) {
                await this.check(i);
              }
            }
          }

          this.getResult('confirm')
        },
        deep: true
      },
    },
		methods: {
      async init() {
				// 初始化数据
				this.id = 0;
				this.tabId = 0;
				this.checkBox = [];
				this.checkArr = [];

        await  this.$store.dispatch(`getDistrictTree`, (districtTree) => {
          this.cityList = districtTree
        })

				this.getData();
			},
			open() {
				this.isShow = true;
				this.init();
			},
			close() {
				this.isShow = false;
			},
			async check(index) {
				this.$set(this.checkArr, this.id, this.checkBox[this.id][index]);
				if (this.id < this.tabList.length - 1) this.id = this.id + 1;
				await this.getData(); //同步请求
				if (this.tabId < this.tabList.length - 1) this.tabId = this.tabId + 1;
			},

			checkTab(e) {
				if (e == this.id) return;
				this.id = e;
				this.tabId = e;
				this.checkArr = this.checkArr.splice(0, e);
			},

			getResult(event) {
				if (event == 'confirm') {
					if (this.checkArr.length != this.tabList.length) return;
					let result = this.checkArr;
					this.$emit('change', {
						value: result
					});
				}
				this.close();
			},

			async getData() {
				// 加载数据
				if (this.checkArr.length == this.tabList.length) return;
				// 模拟数据
				let list = [];
				uni.showLoading({
					title: '加载中...'
				});
				if (this.checkArr.length) {
					var id = this.checkArr?.[this.id - 1]?.district_id
					let idList = this.checkBox?.[this.id - 1]?.find(item => {
						return item.district_id == id;
					})
					idList?.children.map(e => {
						list.push(e);
					});
					uni.hideLoading();
					this.$set(this.checkBox, this.id, list)
				} else {
					this.cityList.map(e => {
						list.push(e);
					});
					uni.hideLoading();
					this.$set(this.checkBox, this.id, list)
				}
				//接口请求数据实例--------------
				// let params = {
				// 	code: this.checkArr && this.checkArr.length > 0 ? this.checkArr[this.checkArr.length - 1]
				// 		.code : ''
				// };
				// await getData(params).then(res => {
				// 	if (res.code == 200) {
				// 		this.$set(this.checkBox, this.id, res.data);
				// 	} else {
				// 		this.$set(this.checkBox, this.id, []);
				// 	}
				// 	uni.hideLoading()
				// })
			},
		},
	};
</script>

<style>
	/deep/ ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}
</style>
<style lang="scss" scoped>
  @import "../../../../styles/_variables";

	/* 弹出层默认样式 */
	.sel-popup {
		width: 100%;
		position: fixed;
		bottom: -100%;
		z-index: 999;
	}

	/* 点击按钮是将盒子 bottom 值归零即可实现弹出效果,
	同理，如需更改弹出方向只需将bottom改成top、left、right即可
	(默认样式的方向也需一起更改哦) */
	.sel-open {
		bottom: 0px !important;
	}

	.sel-animation {
		transition: all 0.25s linear;
	}

	/* 遮罩层样式 */
	.sel-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 998;
	}

	.sel-box {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #ffff;
		border-radius: 48rpx 48rpx 0 0;
	}

	.sel-temp {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.sel-top {
		height: 88rpx;
		line-height: 88rpx;
		display: flex;
		justify-content: space-between;
		margin: 28rpx 32rpx 0rpx 32rpx;
	}

	.sel-top-left {
		font-size: 30rpx;
		color: #999;
		height: 68rpx;
		line-height: 68rpx;
	}

	.sel-top-right {
		height: 68rpx;
		color: #000;
		line-height: 68rpx;
		font-size: 30rpx;
	}

	.sel-top-right-check {
		height: 68rpx;
		color: $default-skin-bg;
		line-height: 68rpx;
		font-size: 30rpx;
	}

	.sel-title {
		height: 96rpx;
		line-height: 96rpx;
		background-color: #ffffff;
		display: grid;
		grid-template-columns: repeat(3, 33.33333%);
		border-bottom: solid #f0f0f0 1rpx;
		border-top: solid #f0f0f0 1rpx;
	}

	.sel-scroll-view_H {
		white-space: nowrap;
		width: 100%;
		height: 500rpx;
		line-height: 100rpx;
		background-color: #ffffff;
	}

	.sel-title-item {
		margin: 0 22rpx;
		font-size: 34rpx;
		text-align: center;
		color: #333333;
	}

	.sel-title-item-false {
		font-size: 30rpx;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.sel-title-item-true {
		font-size: 30rpx;
		font-weight: 700;
		color: $default-skin-bg;
	}

	.sel-scroll-view-box {
		display: grid;
		grid-template-columns: repeat(4, 25%);
		padding: 10rpx 10rpx;

		.sel-scroll-view-list {
			margin: 10rpx;
			background: #f3f3f3;
			height: 72rpx;
			border-radius: 8rpx;
			line-height: 72rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 13px;
			color: #333333;
		}
	}

	.sel-scroll-view-noBox {
		width: 100%;
		height: 400rpx;

		image {
			width: 240rpx;
			height: 200rpx;
			margin: 0 255rpx;
			margin-top: 32rpx;
		}

		.text {
			width: 100%;
			text-align: center;
			color: #888;
		}
	}

	.sel-scroll-view-item {
		display: inline-block;
		padding: 0 8rpx;
		text-align: center;
		border-radius: 16rpx;
		font-size: 24rpx;
		margin: 24rpx;
		height: 48rpx;
		line-height: 48rpx;
	}

	.sel-scroll-view-item-true {
		display: inline-block;
		padding: 0 8rpx;
		text-align: center;
		border-radius: 16rpx;
		margin: 24rpx;
		font-size: 24rpx;
		background-color: $default-skin-bg !important;
		color: #ffffff !important;
		height: 48rpx;
		line-height: 48rpx;
	}
</style>