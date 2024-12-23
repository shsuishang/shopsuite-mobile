<template>
	<view class="popup-layout-wrap " :class="popuplayoutClass" >
		<view class="popup-layout-content" :class="popupContentClass" :style="[{height:height}]">
			<view class="link-address-wrap">
				<view class="link-adress-content">
					<view class="head-wrap">
						<text class="cancel" @click="btn_cancel">{{__('取消')}}</text>
						<text class="confirm" @click="btn_confirm">{{__('确认')}}</text>
					</view>
					<view class="head-selected">
						<text class="selected-txt">{{__('已选择')}}:{{selected_address}}</text>
					</view>
					<view class="operation-wrap">
						<view class="operation-container">
							<view class="operation-content" v-for="(base_items,base_index) of linkAddress_area" :key="base_index">
								<scroll-view
									scroll-y="true"
									class="province"
									show-scrollbar="false">
									<view
										@click="choosefun(base_items.clickfun,items.id)"
										v-model="items.id"
										:key="items.id"
										v-for="(items , index) of base_items.info"
										:class="[index==base_items.current ? 'province-txt-click' : 'province-txt']"
										>
											{{items.name || items.store_category_name}}
											<view class="pic" v-show="index===base_items.current">
												<image src="/static/images/yes.png"></image>
											</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="maskShow" class="popup-layout-mask" @tap="close(maskClick)"></view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import $ from "../../../helpers/util";

	export default{
		data(){
			return{
				newActive:"",
				newTransition:true,
				//省0市1区2
				linkAddress_area:[
					{
						current:null,
						info: [],
						clickfun:'province_txt_click'
					},
					{
						current:null,
						info: [],
						clickfun:'city_txt_click'
					},
					{
						current:null,
						info: [],
						clickfun:'district_txt_click'
					}
				],
				/*请求提交的*/
				submission:{
					province:'',//省
					city:'',//市
					county:'',//区
					town:''//镇
				},
				/*用户选择的地址*/
				user_address:{
					province:'',//省
					city:'',//市
					district:''//区
				},
				selected_address:'',
				category_id:0
			};
		},
		props:{
			/*底部弹窗的属性*/
			active:{
				type:Boolean,
				default:false
			},
			height:{
				type:[String],
				default:"100%"
			},
			//遮盖层显示
			maskShow:{
				type:Boolean,
				default:true
			},
			//遮盖层点击
			maskClick:{
				type:Boolean,
				default:true
			},
			//回掉
			callback:{
				type:Function,
				default:function () {

				}
			},
			//分类类型
			type:{
				type:Number,
				default:1
		     }
		},
		computed:{
				...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
				popuplayoutClass:function(){
					let _class="";
					if(this.newActive){
						_class+="popup-layout-active";
					}
					_class+=" popup-layout-bottom";
					return _class;
				},
				popupContentClass:function () {
					let _class = "";
					if (this.newTransition&&this.transition!=='none') {
						_class+="popup-layout-transition-slider"
					}
					return _class;
				}
		},
		methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
			//显示弹窗
			show:function () {
				//提交的数据置为空
				this.submission={
					province:'',
					city:'',
					county:'',
					town:''
				},

				//请求市数据
				this.getShopCategory("province", (revert)=>{
					this.submission.province='1';
				});

				this.newActive = true;
				let _this = this;
				setTimeout(function () {
					_this.newTransition = false;
				},50)
			},

			//关闭弹窗
			close:function (v) {
				let close = v || true;
				if (close) {
					this.newTransition = true;
					let _this=this;
					setTimeout(function () {
						_this.newActive = false;

					},300)
				}

			},
			//选择点击事件
			choosefun(targetfun,targetid){
				this[targetfun](targetid);
			},
			//省点击选择
			province_txt_click(target){
				//区数据置为空
				this.linkAddress_area[2].info= [];
				//市、区的选择计数置为null
				this.linkAddress_area[1].current=null;
				this.linkAddress_area[2].current=null;
				let province;
				//得到点击的数据，改变样式
				for (let i = 0; i < this.linkAddress_area[0].info.length; i++) {
					if (this.linkAddress_area[0].info[i].id === target) {
						this.linkAddress_area[0].current = i;
						province=this.linkAddress_area[0].info[i].name;
						break;
					}
				}
				//用户选择
				this.user_address={
					province:province,
					city:'',
					district:''
				}
				//请求提交的数据先置为空
				this.submission={
					province:'',
					city:'',
					county:'',
					town:''
				};
				//再赋值
				this.submission.province=target;
				this.submission.category_id=target;
				this.category_id=target;
				this.selected_address=this.user_address.province;

				//请求市数据
				this.getShopCategory("city", (revert)=>{

				});
			},

			//市点击选择
			city_txt_click(target){
				//区的选择计数置为null
				this.linkAddress_area[2].current=null;
				let city;
				//得到点击的数据，改变样式
				for (let i = 0; i < this.linkAddress_area[1].info.length; i++) {
					if (this.linkAddress_area[1].info[i].id === target) {
						this.linkAddress_area[1].current = i;
						city=this.linkAddress_area[1].info[i].name;
						break;
					}
				}
				//得到市
				this.user_address.city=city;
				//把区的信息置为空
				this.user_address.district='';

				this.submission.city=target;
				this.submission.category_id=target;
				this.category_id=target;

				this.selected_address=this.user_address.province+"-"+this.user_address.city;
				//请求区数据
				this.getShopCategory("district", (revert)=>{

				});
			},
			getShopCategory(tag, callback){
				let params = this.submission;
				let that = this;

				let url = that.Config.URL.product.category;

				if (that.type == 1)
				{
				}
				else if (that.type == 2)
				{
					url = that.Config.URL.store.category;
				}

				that.$.request({
					url: url,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200)
						{
								if(tag==="province"){
									console.log("province")
									that.linkAddress_area[0].info=data.items;
									callback(true);//回掉
								}
								if(tag==="city"){
									console.log("city")
									that.linkAddress_area[1].info=data.items;
									callback(true);//回掉
								}
								if(tag==="district"){
									console.log("district")
									that.linkAddress_area[2].info=data.items;
									callback(true);//回掉
								}
						}
					}
				});
			},
			//区点击选择
			district_txt_click(target){
				let district;
				//得到点击的数据，改变样式
				for (let i = 0; i < this.linkAddress_area[2].info.length; i++) {
					if (this.linkAddress_area[2].info[i].id === target) {
						// this.district_current = i;
						this.linkAddress_area[2].current = i;
						district=this.linkAddress_area[2].info[i].name;
						break;
					}
				}
				//得到区信息
				this.user_address.district=district;

				this.category_id=target;

				this.selected_address=this.user_address.province+"-"+this.user_address.city+"-"+this.user_address.district;
			},

			//取消按钮
			btn_cancel:function(){
				this.close();

				//全部置为空
				this.submission={
					province:'',
					city:'',
					county:'',
					town:''
				}
				this.linkAddress_area[1].info= [];
				this.linkAddress_area[2].info= [];
				this.linkAddress_area[0].current=null;
				this.linkAddress_area[1].current=null;
				this.linkAddress_area[2].current=null;
				this.selected_address='';
			},
			//确定按钮
			btn_confirm:function(){
				this.close();
				console.log(this.user_address)
				console.log(this.selected_address)
				//可以使用vuex传值
				//this.$store.commit('commit_address',this.user_address);
				this.$emit('confirmCallback', this.selected_address, this.category_id);
			}
		},
	}
</script>

<style lang="scss">
	popup-layout-wrap{
		position: absolute;
	}
	.popup-layout-wrap{
		position: fixed;
		z-index: 998;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		display: none;
		&.popup-layout-active{
			display: flex;
		}
		&.popup-layout-bottom{
			align-items: flex-end;
			.popup-layout-transition-slider{
				transform: translate3d(0,100%,0);
			}
		}
		.popup-layout-content{
			background-color: #fff;
			z-index: 2;
			height: 100%;
			width: 100%;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			transform: translate3d(0,0,0) scale(1);
			opacity: 1;
			transition: transform .3s ease-in-out,opacity .3s ease-in-out;
			&.popup-layout-transition-fade{
				transform: translate3d(0,0,0) scale(0.3);
				opacity: 0;
			}
		}
		.popup-layout-mask{
			position: absolute;
			transition:all 1s ;
			z-index: 1;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			height: 100%;
			width: 100%;
			background-color: rgba(#000, 0.6);
		}
	}
	/***省市区选择器***/
	.link-address-wrap{
		height: 100%;
		width: 100%;
		background: #fff;
	}
	.link-address-wrap .link-adress-content{
		margin:8px 10px 10px 10px;
		.head-wrap{
			padding-bottom: 5px;
			display: flex;
			flex-direction: row;
			position: relative;
			.cancel{
				color: #999;
			}
			.confirm{
				position: absolute;
				right: 0px;
			}
		}
		.head-selected{
			text-align: center;
			color: #ccc;
			font-size: 17px;
		}
		.operation-wrap{
			.operation-container{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.operation-content{
					display: flex;
					flex-direction: column;
					width: 33.333%;
					.province{
						//scroll-view区域的固定高度
						height: 420rpx;
						font-size: 17px;
						.province-txt{
							margin: 18px 12px;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.province-txt-click{
							margin: 18px 12px;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							color: red;
							font-size: 20px;
							display: flex;
							flex-direction: row;
							.pic{
								padding-left: 15rpx;
								width: 30rpx;
								height: 30rpx;
								display: flex;
								justify-content: center;
								text-align: center;
								margin: auto 0;
								image{
									width: 100%;
									height: auto;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
