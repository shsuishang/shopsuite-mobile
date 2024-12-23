<template>
	 <view class="wf-page">
		<!--    left    -->
		<view>
			<view id="left" v-if="leftList.length">
				<view v-for="(item,index) in leftList" :key="index" 
				class="wf-item"  @tap="itemTap(item)">
					<WaterfallsFlowItem :item="item" />
				</view>
			</view>
		</view>


		<!--    right    -->
		<view>
			<view id="right" v-if="rightList.length">
				<view v-for="(item,index) in rightList" :key="index" 
				class="wf-item" @tap="itemTap(item)">
					<WaterfallsFlowItem :item="item" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import WaterfallsFlowItem from '../WaterfallsFlowItem/WaterfallsFlowItem.vue'
	
	export default {
		components:{
			WaterfallsFlowItem
		},
		props:{
			// 瀑布流列表
			wfList:{
				type:Array,
				require:true
			},
			updateNum:{
				type:Number,
				default:10
			}
		},
		data() {
			return {
				allList:[],       // 全部列表
				leftList:[],      // 左边列表
				rightList:[],     // 右边列表
				mark:0,           // 列表标记
				boxHeight:[],     // 下标0和1分别为左列和右列高度
			};
		},
		watch:{
			async wfList(){
				if(this.wfList.length === 0 ||
					(this.wfList.length === this.updateNum && this.wfList.length <= this.allList.length)){
					this.allList = [];
					this.leftList = [];
					this.rightList = [];
					this.boxHeight = [];
					this.mark = 0;
				}
	
				if(this.wfList.length){
					this.allList = this.wfList;
					await this.waterFall()
				}
			},
			async mark(){
				const len = this.allList.length;
				if(this.mark < len && this.mark !== 0){
					await this.waterFall();
				}
			}
		},
		methods:{
			async waterFall(){
				const i = this.mark;
				if(i === 0){
					this.leftList.push(this.allList[i]);
					await this.getViewHeight(0);
				}else if(i === 1){
					this.rightList.push(this.allList[i]);
					await this.getViewHeight(1);
				}else {
					const leftOrRight = this.boxHeight[0] > this.boxHeight[1] ? 1 : 0;
					if(leftOrRight){this.rightList.push(this.allList[i])}
					else{this.leftList.push(this.allList[i])}
					await this.getViewHeight(leftOrRight);
				}
			},
			async getViewHeight(leftOrRight){
				const query = uni.createSelectorQuery().in(this);
				const id = leftOrRight ? '#right' : '#left';
				await setTimeout(()=>{
					query.select(id).boundingClientRect(res=>{
						this.boxHeight[leftOrRight] = res.height;
						this.mark = this.mark + 1;
					}).exec();
				},50)
			},
			itemTap(item){
				this.$emit('itemTap',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$page-padding:10px;
	$grid-gap:10px;
	
	.wf-page{
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: $grid-gap;
		padding: 10px $page-padding;
	}
	
	.wf-item{
	   width: calc((100vw - 2 * #{$page-padding} - #{$grid-gap}) / 2);
	   padding-bottom: $grid-gap;
	}
</style>
