<template>
	<view class="uni-select-cy">
		<view class="uni-select-cy-select" :class="{ active: active }" @click.stop="handleSelect">
			<!-- 禁用mask -->
			<view class="uni-disabled" v-if="disabled"></view>
			<!-- 清空 -->
			<view class="close-icon close-postion" v-if="realValue.length && !active && !disabled && showClearIcon">
				<text @click.stop="handleRemove(null)"></text>
			</view>
			<!-- 显示框 -->
			<view class="uni-select-multiple" v-show="realValue.length">
				<view class="uni-select-multiple-item" v-for="(item, index) in realValue" :key="index">
					<view class="uni-select-multiple-item-row">
						{{ item }}
					</view>
					<view class="close-icon" v-if="showValueClear"><text @click.stop="handleRemove(index)"></text>
					</view>
				</view>
			</view>
			<!-- 为空时的显示文案 -->
			<view v-if="realValue.length == 0&&showplaceholder" style="width: 100%; font-size: 12px;">{{ placeholder }}</view>
			<!-- 禁用图标 -->
			<view class="uni-select-cy-icon" :class="{ disabled: disabled }"><text></text></view>
		</view>
		<!-- 下拉选项 -->
		<scroll-view class="uni-select-cy-options" :scroll-y="true" v-show="active" @scrolltolower="scrolltolower">
			<template>
				<view class="uni-select-cy-item" :class="{ active: realValue.includes(item[svalue]) }"
					v-for="(item, index) in options" :key="index" @click.stop="handleChange(index, item)">
					{{ item[slabel] }}
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'select-cy',
		props: {
			//是否显示全部清空按钮
			showClearIcon: {
				type: Boolean,
				default: false
			},
			//是否显示单个删除
			showValueClear: {
				type: Boolean,
				default: true
			},
			zindex: {
				type: Number,
				default: 1
			},
			//禁用组件
			disabled: {
				type: Boolean,
				default: false
			},
			options: {
				type: Array,
				default () {
					return [];
				}
			},
			value: {
				type: Array,
				default () {
					return [];
				}
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			showplaceholder: {
				type: Boolean,
				default: true
			},
			slabel: {
				type: String,
				default: 'label'
			},
			svalue: {
				type: String,
				default: 'value'
			},
			// 是否开启分页
			isPaging:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				active: false, //组件是否激活，
				changevalue: [], //搜索框同步
				realValue: []
			};
		},
		watch:{
			value(){
				//初始化
				this.init();
			}
		},
		methods: {
			close() {
				this.active = false
			},
			init() {
				if (this.value.length > 0) {
					this.changevalue = this.options.map(item => {
						this.value.forEach(i => {
							if (item[this.svalue] == i[this.svalue]) {
								return item;
							}
						});
					});
					this.realValue = this.value;
				} else {
					this.changevalue = [];
					this.realValue = [];
				}
			},
			scrolltolower(){
				if(this.isPaging){
					this.$emit('scrolltolower')
				}
				
			},
			//点击展示选项
			handleSelect() {
				if (this.disabled) return;
				this.active = !this.active;
			},
			//移除数据
			handleRemove(index) {
				if (index === null) {
					this.realValue = [];
					this.changevalue = [];
				} else {
					this.realValue.splice(index, 1);
					this.changevalue.splice(index, 1);
				}
				this.$emit('change', this.changevalue, this.realValue);
			},
			//点击组件列
			handleChange(index, item) {
				let arrIndex = this.realValue.indexOf(item[this.svalue]);
				if (arrIndex > -1) {
					this.changevalue.splice(arrIndex, 1);
					this.realValue.splice(arrIndex, 1);
				} else {
					this.changevalue.push(item);
					this.realValue.push(item[this.svalue]);
				}
				console.log(this.realValue, 'this.realValue')
				this.$emit('change', this.changevalue, this.realValue);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-select-cy {
		position: relative;
		// z-index: 1;

		.uni-select-mask {
			width: 100%;
			height: 100%;
		}

		/* 删除按钮样式*/
		.close-icon {
			height: 100%;
			width: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 3;
			cursor: pointer;

			text {
				position: relative;
				background: #fff;
				width: 13px;
				height: 13px;
				border-radius: 50%;
				border: 1px solid #bbb;

				&::before,
				&::after {
					content: "";
					position: absolute;
					left: 20%;
					top: 50%;
					height: 1px;
					width: 60%;
					transform: rotate(45deg);
					background-color: #bbb;
				}

				&::after {
					transform: rotate(-45deg);
				}

			}
		}

		//所有清空的定位
		.close-postion {
			position: absolute;
			right: 35px;
			top: 0;
			height: 100%;
			width: 15px;
		}

		/* 多选盒子 */
		.uni-select-multiple {
			overflow-x: auto;
			display: flex;
			flex: 1;
			width: 0;
			flex-wrap: nowrap;
			.uni-select-multiple-item {
				background: #bbb;
				margin-right: 5rpx;
				padding: 2rpx 4rpx;
				border-radius: 4rpx;
				color: #fff;
				display: flex;
				flex: 0 0 140rpx;
			
				.uni-select-multiple-item-row{
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		// select部分
		.uni-select-cy-select {
			user-select: none;
			position: relative;
			z-index: 3;
			height: 36px;
			padding: 0 30px 0 10px;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid rgb(229, 229, 229);
			display: flex;
			align-items: center;
			font-size: 14px;
			color: #999;
			flex-wrap: nowrap;
			.uni-disabled {
				position: absolute;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 19;
				cursor: no-drop;
				background: rgba(255, 255, 255, .5);
			}


			.uni-select-cy-input {
				font-size: 14px;
				color: #999;
				display: block;
				width: 96%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				line-height: 30px;
				box-sizing: border-box;

				&.active {
					color: #333;
				}

			}

			.uni-select-cy-icon {
				cursor: pointer;
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
				width: 30px;
				display: flex;
				align-items: center;
				justify-content: center;

				&::before {
					content: "";
					width: 1px;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					background-color: #e5e5e5;
				}

				text {
					display: block;
					width: 0;
					height: 0;
					border-width: 12rpx 12rpx 0;
					border-style: solid;
					border-color: #bbb transparent transparent;
					transition: .3s;
				}

				&.disabled {
					cursor: no-drop;

					text {
						width: 20rpx;
						height: 20rpx;
						border: 2px solid #ff0000;
						border-radius: 50%;
						transition: .3s;
						position: relative;
						z-index: 999;

						&::after {
							content: "";
							position: absolute;
							top: 50%;
							left: 0;
							width: 100%;
							height: 2px;
							margin-top: -1px;
							background-color: #ff0000;
							transform: rotate(45deg);

						}
					}
				}
			}

			&.active .uni-select-cy-icon {
				text {
					transform: rotate(180deg);
				}
			}
		}

		// options部分
		.uni-select-cy-options {
			user-select: none;
			position: absolute;
			top: calc(100% + 5px);
			left: 0;
			width: 100%;
			height: 500rpx;
			border-radius: 4px;
			border: 1px solid rgb(229, 229, 229);
			background: #fff;
			padding: 5px 0;
			box-sizing: border-box;
			z-index: 9;

			.uni-select-cy-item {
				padding: 0 10px;
				box-sizing: border-box;
				cursor: pointer;
				line-height: 2.5;
				transition: .3s;
				font-size: 14px;

				&.active {
					color: #409eff;

					background-color: #f5f7fa;
          &:hover {
						color: #409eff;
						background-color: #f5f7fa;
					}
				}

				&:hover {
					background-color: #f5f5f5;
				}
			}
		}
	}
</style>
