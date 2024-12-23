<template>
	<div class="mpvue-picker">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<div class="mpvue-picker__hd" catchtouchmove="true">
				<div class="mpvue-picker__action" @click="pickerCancel">{{__('取消')}}</div>
				<div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">{{__('确定')}}</div>
			</div>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
				<block>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
				</block>
			</picker-view>
		</div>
	</div>
</template>

<script>


	export default {
		data() {
			return {
				pickerValue: [0, 0, 0],
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				/* 是否显示控件 */
				showPicker: false,


				provinceData : [],
				cityData : [],
				areaData : [],
			};
		},
		created() {
			this.init()
		},
		props: {
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0, 0, 0]
				}
			},
			/* 主题色 */
			themeColor: String
		},
		watch: {
			pickerValueDefault() {
				this.init();
			}
		},
		methods: {
			init() {
				let that = this;
				//todo ajax 读取地区数据
				that.$.request({
					url: that.cf.URL.getAppDistrict,
					data: {},
					loading: false,
                    ajaxCache: {
                        timeout: this.cf.CACHE_EXPIRE
                    },
					success: function(data, status, msg, code) {
						if (status == 200)
						{
							that.provinceData = data.provinceData;
							that.cityData = data.cityData;
							that.areaData = data.areaData;

							that.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理


							that.provinceDataList = data.provinceData;
							that.cityDataList = data.cityData[that.pickerValueDefault[0]];


							that.areaDataList = data.areaData[that.pickerValueDefault[0]][that.pickerValueDefault[1]];
							that.pickerValue = that.pickerValueDefault;
						}
						else
						{
							that.$.alert(that.__("Failure!"));
						}
					}
				});
			},
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			showPickerView() {
				this.showPicker = true;
			},

			handPickValueDefault() {
				let that = this;

        /*
				//索引才是， 修正数据。

				for (let i = 0; i < provinceData; i++) {
					if (provinceData[i].value == this.pickerValueDefault[0]) {
						this.pickerValueDefault[0] = i;
						break;
					}
				}


				for (let i = 0; i < that.cityData[this.pickerValueDefault[0]]; i++) {
					if (cityData[this.pickerValueDefault[0]][i].value == this.pickerValueDefault[1]) {
						this.pickerValueDefault[1] = i;
						break;
					}
				}

				for (let i = 0; i < that.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]]; i++) {
					if (areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]][i].value == this.pickerValueDefault[2]) {
						this.pickerValueDefault[2] = i;
						break;
					}
				}
        */

				if (this.pickerValueDefault !== [0, 0, 0]) {
					if (this.pickerValueDefault[0] > that.provinceData.length - 1) {
						this.pickerValueDefault[0] = that.provinceData.length - 1;
					}
					if (this.pickerValueDefault[1] > that.cityData[this.pickerValueDefault[0]].length - 1) {
						this.pickerValueDefault[1] = that.cityData[this.pickerValueDefault[0]].length - 1;
					}
					if (this.pickerValueDefault[2] > that.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
						this.pickerValueDefault[2] = that.areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
					}
				}
			},
			pickerChange(e) {
				let that = this;
				let changePickerValue = e.mp.detail.value;
				if (this.pickerValue[0] !== changePickerValue[0]) {
					// 第一级发生滚动
					this.cityDataList = that.cityData[changePickerValue[0]];
					this.areaDataList = that.areaData[changePickerValue[0]][0];
					changePickerValue[1] = 0;
					changePickerValue[2] = 0;
				} else if (this.pickerValue[1] !== changePickerValue[1]) {
					// 第二级滚动
					this.areaDataList =
							that.areaData[changePickerValue[0]][changePickerValue[1]];
					changePickerValue[2] = 0;
				}
				this.pickerValue = changePickerValue;
				this._$emit('onChange');
			},
			_$emit(emitName) {
				let pickObj = {
					label: this._getLabel(),
					value: this._getVale(),
					cityCode: this._getCityCode()
				};
				this.$emit(emitName, pickObj);
			},
			_getLabel() {
				let pcikerLabel = [this.provinceDataList[this.pickerValue[0]].label, this.cityDataList[this.pickerValue[1]].label,
					this.areaDataList[this.pickerValue[2]].label
				];

				return pcikerLabel;
			},
			_getVale() {
				let pcikerValue = [this.provinceDataList[this.pickerValue[0]].value, this.cityDataList[this.pickerValue[1]].value,
					this.areaDataList[this.pickerValue[2]].value
				];

				return pcikerValue;
			},
			_getCityCode() {
				return this.areaDataList[this.pickerValue[2]].value;
			}
		}
	};
</script>

<style lang="scss">
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
