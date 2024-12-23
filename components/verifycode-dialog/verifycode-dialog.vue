<template>
	<view v-if="show" class="codedialog">
		<view class="mask"></view>
		<view class="dialog-view">
			<text class="dialog-close" @click="closeDialog()"></text>
			<view class="dialog-hd">
				<view class="codedialog-maintitle">
					<text>{{__('发送验证码')}}</text>
				</view>
				<view v-if="phone!='' && phone !=null && bindType==1" class="codedialog-subtitle">
					<text>{{sprintf(__('已发送到手机号：%s'), phone)}}</text>
				</view>
				<view v-if="phone!='' && phone !=null && bindType==2" class="codedialog-subtitle">
					<text>{{sprintf(__('已发送到email：%s'), phone)}}</text>
				</view>
			</view>
			<view class="dialog-bd">
				<view class="code-view">
					<view v-for="(code,index) of codeAry" :key="index" class="code-item">{{code.val}}</view>
				</view>
			</view>
			<view class="dialog-ft">
				<view v-if="countdown==60" @click="resend" class="resend">{{__('重新发送')}}</view>
				<view v-if="countdown<60" class="countdown">{{countdown}}s</view>
			</view>
		</view>

		<view class="keyboard">
			<view class="keyboard-line">
				<view data-val="1" @click="bindKeyEvent" class="button-item">1</view>
				<view data-val="2" @click="bindKeyEvent" class="button-item">2</view>
				<view data-val="3" @click="bindKeyEvent" class="button-item">3</view>
			</view>
			<view class="keyboard-line">
				<view data-val="4" @click="bindKeyEvent" class="button-item">4</view>
				<view data-val="5" @click="bindKeyEvent" class="button-item">5</view>
				<view data-val="6" @click="bindKeyEvent" class="button-item">6</view>
			</view>
			<view class="keyboard-line">
				<view data-val="7" @click="bindKeyEvent" class="button-item">7</view>
				<view data-val="8" @click="bindKeyEvent" class="button-item">8</view>
				<view data-val="9" @click="bindKeyEvent" class="button-item">9</view>
			</view>
			<view class="keyboard-line">
				<view data-val="clear" @click="bindKeyEvent" class="button-item">{{__('清空')}}</view>
				<view data-val="0" @click="bindKeyEvent" class="button-item">0</view>
				<view data-val="delete" @click="bindKeyEvent" class="button-item">x</view>
			</view>
		</view>

	</view>
</template>

<script>
/*
保存按钮 - 根据手机号发送验证码 - 填写验证码后直接提交

属性：
    show 控制对话框是否显示
    len 验证码长度，默认为4，最大值为6
    autoCountdown 弹出后是否自动倒计时
    phone 提示发送的手机号(可不填)

事件： change(res)
    res.type 对话框事件类型   1  用户输入验证码完毕    0  重新发送    -1 对话框被关闭
    res.code 返回的验证码
    res.resendCall 用户点击重新发送后(res.type等于0时),需调用此函数来重新执行倒计时
*/
	import $ from "../../helpers/util";
	import {mapMutations, mapState} from 'vuex'
	export default {
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		props: {
			show: {
				type: Boolean,
				default: false
			},
			autoCountdown: {
				type: Boolean,
				default: true
			},
			phone: {
				type: String,
				default: ""
			},
			user_intl: {
				type: String,
				default: "+86"
			},
			len: {
				type: Number,
				default: 6
			},
			bindType: {
				type: Number,
				default: 1
			}
		},
		data: function () {
			return {
				codeAry: [{
					"val": ""
				}, {
					"val": ""
				}, {
					"val": ""
				}, {
					"val": ""
				}],
				currItem: 0,
				countdown: 60,
				cTimer: null,
				callResult: {
					type:0,
					code:null
				},
				suspend:false,
				pre_phone: '' //上次发送的号码

			};
		},
		watch:{
			show:function(){
				if(this.show){
					if(!this.suspend || this.pre_phone != this.phone){
						this.init();
					}
				}else{
					if(!this.suspend){
						this.clearTimer();
					}
					this.clearCode();
				}
			}
		},
		methods: {
			init: function() {
                var that = this;
				let url = this.Config.URL.sendMobileVerifyCode;
				var params = {};

                if (that.pre_phone != that.phone || (that.cTimer == null && that.show))
                {
					if (that.bindType == 2)
					{
						url = that.cf.URL.verify.email;
					}
					else
					{
						url = this.Config.URL.sendMobileVerifyCode;
					}
					
                    //this.$set(this, 'countdown', 59);
                    that.$.request({
                        url: url,
                        data: {mobile:that.phone, email:that.phone},
                        success: function (data, status, msg, code) {
                            that.pre_phone = that.phone;

                            if (status == 200)
                            {
                                uni.showToast({
                                    icon: 'none',
                                    title: that.__('已发送重置验证码到注册手机，请注意查收。'),
                                    duration: 3000
                                });
                            }
                            else
                            {
                                uni.showToast({
                                    icon: 'none',
                                    title: that.__('短信发送失败，请尝试。'),
                                    duration: 3000
                                });

                                that.clearTimer();
                            }
                        }
                    });
                }

				var codeAry = [];
				for (var i = 0; i < this.len; i++) {
					codeAry.push({
						val: ""
					})
				}

				this.codeAry = codeAry;
				this.currItem = 0;
				if (this.autoCountdown) {
					this.startTimer();
				}
			},
			bindKeyEvent: function(e) {
				var _this = this;
				var val = e.currentTarget.dataset.val;
				switch (val) {
					case "clear":
						_this.clearCode();
						break;
					case "delete":
						_this.deleteCode();
						break;
					default:
						_this.inputVal(val);
						break;
				}
			},
			inputVal: function(val) {
				if (this.currItem < this.len) {
					this.codeAry[this.currItem].val = val;
					this.currItem++;
				}
				if (this.currItem == this.len) {
					this.execuCall(1);
				}
			},
			clearCode: function() {
				this.init();
			},
			deleteCode: function() {
				if (this.currItem > 0) {
					this.codeAry[this.currItem - 1].val = "";
					this.currItem--;
				}
			},
			closeDialog: function() {
				this.execuCall(-1);
			},
			startTimer: function() {
				var _this = this;
				if (_this.cTimer == null) {
					_this.cTimer = setInterval(function() {
						_this.countdown--;
						if (_this.countdown == 0) {
							_this.clearTimer();
						}
					}, 1000)
				}
			},
			clearTimer: function() {
				var _this = this;
				clearInterval(_this.cTimer);
				_this.cTimer = null;
				_this.countdown = 60;
			},
			getCodeValue:function(){
				var codeStr = "";
				this.codeAry.forEach(function(code){
					codeStr+=code.val;
				})
				return codeStr;
			},
			execuCall:function(type){
				this.callResult.type = type;
				if(type == 1){
					this.callResult.code = this.getCodeValue();
					this.clearTimer();
				}else{
					this.suspend = true;
					this.callResult.code = null;
				}
				this.$emit("change", this.callResult);
			},
			resend:function(){
				var _this = this;
				_this.callResult.code = null;
				_this.callResult.type = 0;
				_this.callResult.resendCall =function(){
					_this.init();
				}
				_this.$emit("change", _this.callResult);

			}

		}
	}
</script>

<style scoped>
	.button-item:active {
		background: #d4d4d4;
	}

	.button-item+.button-item {
		border-left: 0.1px solid #d4d4d4;
	}

	.button-item {
		flex: 1;
		padding: 14px 0px;
        text-align: center;
	}

	.keyboard-line+.keyboard-line {
		border-top: 0.1px solid #d4d4d4;
	}

	.keyboard-line {
		display: flex;
	}

	.keyboard {
		background: #fff;
		position: absolute;
		z-index: 999;
		width: 100%;
		left: 0;
		bottom: 0;
		font-size: 17px;
	}

	.dialog-close {
		color: #999;
		height: 20px;
		width: 20px;
		font-size: 15px;
		top: 5px;
		left: 5px;
		position: absolute;
	}


	.dialog-close:before {
		content: "\2716";
	}

	.countdown {
		color: #666;
		font-size: 16px;
	}

	.resend {
		color: #007aff;
		font-size: 16px;
	}

	.dialog-ft {
		margin-top: 10px;
	}

	.code-view {
		display: table;
		text-align: center;
		margin: 0 auto;
		border-collapse: separate;
		border-spacing: 10px 5px;
	}

	.code-item+.code-item {
		margin-left: 5px;
	}

	.code-item {
		display: table-cell;
		border-bottom: 1px solid #999;
		max-width: 35px;
		min-width: 35px;
		padding-bottom: 2px;
		height: 30px;
	}

	.dialog-bd {
		margin-top: 5px;
	}

	.codedialog-subtitle {
		margin-top: 5px;
		padding: 5px 0px;
		font-size: 15px;
		line-height: 1.4;
		word-wrap: break-word;
		word-break: break-all;
		color: #999;
	}

	.dialog-view {
		position: fixed;
		z-index: 999;
		width: 70%;
		max-width: 300px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -120%);
		background-color: #fff;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
		padding: 20px 10px;
	}

	.mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
	}

	/*
	.codedialog * {
		box-sizing: border-box;
	}
*/
	.codedialog {
		z-index: 999;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		box-sizing: border-box;
	}
</style>
