<template>
	<view class='keyboard' @click.stop='_handleKeyPress'>
	    <view class='key-row'>
	        <view class='key-cell cell_b' data-num='7'>7</view>
	        <view class='key-cell cell_b' data-num='8'>8</view>
	        <view class='key-cell cell_b' data-num='9'>9</view>
			<view class='key-cell cell_b' data-num='-1'></view>
	    </view>
	    <view class='key-row'>
	        <view class='key-cell cell_b' data-num='4'>4</view>
	        <view class='key-cell cell_b' data-num='5'>5</view>
	        <view class='key-cell cell_b' data-num='6'>6</view>
	        <view class='key-cell cell_b' data-num='-1'></view>
	    </view>
	    <view class='key-row'>
	        <view class='key-cell cell_b' data-num='1'>1</view>
	        <view class='key-cell cell_b' data-num='2'>2</view>
	        <view class='key-cell cell_b' data-num='3'>3</view>
	        <view class='key-cell cell_b' data-num='-1'></view>
	    </view>
		<view class="key-zero-and-point">
		<view class="a cell_b zero"  data-num='0'>0</view>
		<view class="a cell_b point"  data-num='.'>.</view>
		 </view>

		<view  @touchstart="touchstart" @touchend="touchend" data-num='D' class="key-confirm2">
			<text data-num='D'>C</text>
		</view>

	    <view class='key-confirm' :style="{'background':btnColor}" data-num='S'>
			<view data-num='S' class="">
				<view data-num='S' class="title">{{title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"keyBoard",
		props:{
			title:{
				default:'确认',
				type:String
			},
			btnColor:{
				default:'green',
			}
		},
		data(){
			return {
				money:'',
				Cdel:'',
				Time:''
			}
		},

		watch:{
			money(val){
				this.$emit('update:money',val);

			}
		},

		methods : {
			touchstart(){
				 this.Time=setInterval(()=>{
						//console.log(this.money);
						if(this.money==''){
							clearInterval();
						}
						this.money = this.money.substring(0,this.money.length - 1);
					},200)
			},
			touchend(){
				clearInterval(this.Time);
			},
			//处理按键
			_handleKeyPress(e) {
				// //console.log('点击传e',e.target.dataset.num);
				let num = e.target.dataset.num;
				//不同按键处理逻辑
				// -1 代表无效按键，直接返回
				if (num == -1) return false;
				switch (String(num)) {
					//小数点
					case '.':
						this._handleDecimalPoint();
						break;
					//删除键
					case 'D':
						this._handleDeleteKey();
						break;
					//清空键
					case 'C':
						this._handleClearKey();
						break;
					//确认键
					case 'S':
						this._handleConfirmKey();
						break;
					default:
						this._handleNumberKey(num);
						break;
				}
			},
			//处理小数点函数
			_handleDecimalPoint() {
				//如果包含小数点，直接返回
				if (this.money.indexOf('.') > -1) return false;
				//如果小数点是第一位，补0
				if (!this.money.length)
					this.money = '0.';
				//如果不是，添加一个小数点
				else
					this.money = this.money + '.';
			},
			//处理删除键
			_handleDeleteKey() {
				let S = this.money;
				//如果没有输入，直接返回
				if (!S.length) return false;
				//否则删除最后一个
				this.money = S.substring(0, S.length - 1);
			},

			//处理清空键
			_handleClearKey() {
				this.money = '';
			},

			//处理数字
			_handleNumberKey(num) {
				if(this.money.length==10){
					return
				}
				let S = this.money;
				//如果有小数点且小数点位数不小于2
				if ( S.indexOf('.') > -1 && S.substring(S.indexOf('.') + 1).length < 2)
					this.money = S + num;
				//没有小数点
				if (!(S.indexOf('.') > -1)) {
					//如果第一位是0，只能输入小数点
					if (num == 0 && S.length == 0)
						this.money = '0.';
					else {
						if (S.length && Number(S.charAt(0)) === 0) return;
						this.money = S + num;
					}
				}
			},

			//提交
			_handleConfirmKey() {
				let S = this.money;
				//未输入
				if (!S.length||S==0){
					 uni.showToast({
								      title: '请输入正确的数值',
								       icon:'none',
								       duration: 1000
								     });
					return false;
				}
				//将 8. 这种转换成 8.00
				if (S.indexOf('.') > -1 && S.indexOf('.') == (S.length - 1))
					S = Number(S.substring(0, S.length - 1)).toFixed(2);
				//保留两位
				S = Number(S).toFixed(2);
				this.$emit('confirmEvent',S);    //提交参数
			}
		}
	}
</script>

<style lang="less" scoped>
	.cell_b{
		border-right: 1px solid #d5d5d6;
		border-bottom: 1px solid #d5d5d6;
	}

    .key-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .keyboard {
		flex: 1;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 40vh;
        width: 100%;

		background: #FFFFFF;
    }
    .keyboard .key-row {
        display: flex;
        display: -webkit-flex;
        position: relative;
        height: 10vh;
        line-height: 10vh;


    }

    .keyboard .key-cell {
        flex: 1;
        -webkit-box-flex: 1;
		font-size: 60rpx;

		display: flex;
		justify-content: center;
		align-items: center;
    }

    .keyboard .key-confirm {
        position: absolute;
        text-align: center;
        height: 30vh;
        width: 25%;
        line-height: 30vh;
		color: #FFFFFF;
        z-index: 5;
        right: 0;
        bottom: 0;

		display:flex;
		justify-content: center;
		align-items: center;
    }

	.keyboard .key-confirm2 {
	    position: absolute;
	    height: 10vh;
	    width: 25%;
	    line-height: 10vh;
	    z-index: 9999;
	    right: 0;
		top: 0;


		display: flex;
		justify-content: center;
		align-items: center;
	}
	.key-zero-and-point{
		 display: flex;height: 10vh;justify-content: center;align-items: center;width:75%;font-size: 60rpx;
		 .zero{
			  display: flex;justify-content: center;align-items: center;width: 66.66%;font-size: 60rpx;text-align: center;height: 100%;
		 }
		 .point{
			  display: flex;justify-content: center;align-items: center;width: 33.33%;font-size: 60rpx;text-align: center;height: 100%;
		 }
	}
 .key-cell:active{
	            color: white;
	            background: black;  //黑色
	            opacity: 0.1;    //这里重要，就是通过这个透明度来设置
	        }
.a:active,.key-confirm2:active{
				            color: white;
				            background: black;  //黑色
				            opacity: 0.1;    //这里重要，就是通过这个透明度来设置
				        }
</style>
