<template>
	<view >

		<view class="m-tips" style="margin:0rpx 0;" v-if="titleText">
			<view class="m-tips-str" :style="'line-height: 100rpx;height: 100rpx;font-size: 32rpx;font-weight: 500;color:' + titleColor">{{titleText}}</view>
		</view>
		<view class="m-tips" style="margin:0rpx 0;color:#000000" v-if="titleText">
			<!-- table切换start -->
			<scroll-view class="scroll-view_S" scroll-x show-scrollbar="false" :style="{backgroundColor:bgColor}">
				<view class="scroll-view-item_S"  >
					<label :class="['m-navbar-item', tapindex==0?'m-navbar-item-on':'']" style="padding:0;" :data-id="0" @click="setTab">{{__('推荐')}}</label>
				</view>
				<view class="scroll-view-item_S"  v-for="(items,index) in store_category_lists" :key="index">
					<label :class="['m-navbar-item', tapindex==items.id?'m-navbar-item-on':'']" style="padding:0;" :data-id="items.id" @click="setTab">{{items.store_category_name}}</label>
				</view>
			</scroll-view>
			<!-- table切换end -->
			<!-- 全部订单start -->
		</view>
		<view v-if="loadComplete">
			<block v-if="(tapindex >= 0)">
				<HMfilterDropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" :updateMenuName="false" :scrollTop="hight" @confirm="confirm" v-if="isShowFilter"  :style="isFilterTop0 ? '' : 'position: inherit;'"></HMfilterDropdown>
				<block v-if="isdata && !issshow">
					<scroll-view class="order-list" scroll-y="true" @scrolltolower="scrollbottom" :style="isShowFilter&&isFilterTop0 ? 'padding-top:100rpx' :'padding-top:20rpx'">
						<view class="list">
							<view class="row"  v-for="(item,index) in Info" :key="index" >
								<navigator class="order-info" :url="'/pagesub/index/store?store_id=' + (item.store_id)   + '&d=' + (item.distance)">
									<view class="left">
										<image :src="item.store_logo"></image>
									</view>
									<view class="right">
										<view class="name">
											<label class="store-name">{{item.store_name}}</label>
											<label style="display: flex;"  @click.stop="gotomap"  :data-address="(item.store_address)"
							 :data-name="(item.store_name)" :data-lat="(item.store_latitude)" :data-lng="(item.store_longitude)"><image style="width:20rpx;height:26rpx;line-height: 26rpx;" src='https://static.shopsuite.cn/xcxfile/appicon/img/location.png'></image><label class="u-font" style="line-height: 26rpx;">{{item.distance}}</label></label>
										</view>
										<view class='flex-info-box'  style="display: flex;align-items:center;">
											<image src="../static/images/xing.png" style="width:26rpx;height:26rpx;"></image>
											<label class="u-font evaluation-rate">{{sprintf(__('%s分'), item.store_evaluation_rate)}}</label>
											<label class="u-font">{{sprintf(__('销量 %s'), item.store_sales_num)}}</label>

											<label class="u-font" v-if="(item.store_category_name)">{{sprintf(__('主营： %s'), item.store_category_name)}}</label>
										</view>

									</view>
								</navigator>
								<view class='flex-info-box'  style="display: flex;align-items:center;padding:20rpx 0;" v-if="(item.activity_rows)">
									<label class="u-activity" v-for="(row,ii) in item.activity_rows"  :key="ii" v-if="(ii < 3)">{{row.activity_title}}</label>
								</view>


								<view class="product-item" v-if="(item.products.length > 0)">
									<navigator :url="'/pagesub/product/detail?id=' + (val.item_id)" class="item-s" v-for="(val,ii) in item.products" :key="ii">
										<view class="p-image">
											<view style="position:absolute;">
												<label class="flag flag-reduction" v-if="val.activity_type_id">{{val.activity_type_name}}</label>
											</view>

											<image :src="val.product_image" style="float:left;"></image>
										</view>
										<view class="p-bottom">
											<view class="p-name">{{val.product_name}}</view>
											<view class="p-price">
												<label class="p-left">{{__('￥')}}{{val.item_unit_price}}</label>
											</view>
										</view>

									</navigator>
								</view>
							</view>
							<view class="m-loading-box uni-list-cell"   v-if="isShowLoading">
								<block v-if="ispage">
									<view class="u-loadmore">
										<label class="u-loading"></label><text class="u-loadmore-tips">{{__('正在加载')}}</text>
									</view>
								</block>
								<block v-if="!ispage">
									<view class="u-loadmore u-loadmore-line"><text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text></view>
								</block>
							</view>
						</view>
					</scroll-view>
				</block>
			</block>

			<block v-else>
				<block v-if="isdata && !issshow">
					<scroll-view class="order-list" scroll-y="true" @scrolltolower="scrollbottom" :style="isShowFilter ? '' :'padding-top:20rpx'">
						<view class="list">
							<view class="row"  v-for="(item,index) in Info" :key="index" >
								<navigator class="order-info" :url="'/pagesub/index/store?store_id=' + (item.store_id)">
									<view class="left">
										<image :src="item.store_logo"></image>
									</view>
									<view class="right">
										<view class="name">
											<label class="store-name">{{item.store_name}}</label>
											<label style="display: flex;"><image style="width:20rpx;height:26rpx;line-height: 26rpx;" src='https://static.shopsuite.cn/xcxfile/appicon/img/location.png'></image><label class="u-font" style="line-height: 26rpx;">{{item.distance}}</label></label>
										</view>
										<view class='flex-info-box'  style="display: flex;align-items:center;">
											<image src="../static/images/xing.png" style="width:26rpx;height:26rpx;"></image>
											<label class="u-font evaluation-rate">{{sprintf(__('%s分'), item.store_evaluation_rate)}}</label>
											<label class="u-font">{{sprintf(__('销量 %s'), item.store_sales_num)}}</label>
										</view>
										<view class='flex-info-box'  style="display: flex;align-items:center;" v-if="(item.activity_rows)">
											<label class="u-activity" v-for="(row,ii) in item.activity_rows"  :key="ii" v-if="(ii < 3)">{{row.activity_title}}</label>
										</view>

										<view class="price-number" @click.stop="gotomap"  :data-address="(item.store_address)"
							 :data-name="(item.store_name)" :data-lat="(item.store_latitude)" :data-lng="(item.store_longitude)">
											<view class="price" v-if="(item.store_category_name)">{{sprintf(__('主营： %s'), item.store_category_name)}}</view>
										</view>
									</view>
								</navigator>

							</view>
							<view class="m-loading-box uni-list-cell"  v-if="isShowLoading">
								<block v-if="ispage">
									<view class="u-loadmore">
										<label class="u-loading"></label><text class="u-loadmore-tips">{{__('正在加载')}}</text>
									</view>
								</block>
								<block v-if="!ispage">
									<view class="u-loadmore u-loadmore-line"><text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text></view>
								</block>
							</view>
						</view>
					</scroll-view>
				</block>
			</block>

			<view class="m-nullcontent" v-if="!isdata">
				<view class="m-nullpage-middle"><label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip"><text>{{__('亲~什么都没有')}}</text><text>{{__('附近没什么商家店铺!')}}</text></view>
				</view>
			</view>
		</view>
		<view v-if="isdata && issshow" class='open_ba'>
			<view style="width: 200rpx;margin: 71px auto 25px auto;wxcs_style_margin: 143rpx auto 50rpx auto;auto: 50rpx auto;">
				<image src='https://static.shopsuite.cn/xcxfile/appicon/img/ditulogo.png' style="width: 200rpx;height: 200rpx;"></image>
			</view>
			<view style="font-size: 28rpx;">{{__('无法获取到您的定位，请开启地理位置权限，将根据你的位置展示附近商家店铺。')}}</view><button style="width: 34%;height: 79rpx;background: #33cc66;margin: 39px auto 0 auto;wxcs_style_margin: 79rpx auto 0 auto;color: #fff;line-height: 80rpx;text-align: center;"
			 open-type="openSetting" @opensetting="handler">{{__('去开启')}}</button>
		</view>
	</view>
</template>

<script>
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		props: {


			options: {
				type: Object,
				default () {
					return {
					}
				},
			},

			optionStr: {
				type: String,
				default: '{}'
			},

			isShowFilter: {
				type: [Boolean, Number],
				default: false
			},

			isFilterTop0: {
				type: Boolean,
				default: true
			},

			viewtype: {
				type: Number,
				default: 1
			},

			titleText: {
				type: String,
				default: ''
			},

			titleColor: {
				type: String,
				default: '#bfbfbf'
			},

			bgColor: {
				type: String,
				default: '#f8f8f8'
			},

			maxNumber: {
				type: Number,
				default: 100
			},

			isShowLoading: {
				type: [Boolean, Number],
				default: true
			},
			uniId:
			{
				type: String,
				default () {
					return 'guessyoulike'
				}
			}
		},
		data() {
			return {
				page: 1,
				ispage: true,
				flag: true,
				Info: [],
				latitude: 0,
				longitude: 0,
				isdata: false,
				issshow: 0,
				store_id: null,
				rows: 10,

				hight:2850,
				scrollTop:0,

				store_category_lists:[],
				tapindex:0,



				post: {
				  latitude: 0,
				  longitude: 0,
				  distance: 0,
				  store_category_id: 0,
				  sidx: 'store_sales_num',
				  sord: 'DESC',
				  store_type: 1,
				  store_id: null
				},

				filterDropdownValue:[],
				filterData:[],
				loadComplete: false // 没有加载数据前不显示的对应内容
			}
		},
		components: {
			'HMfilterDropdown':HMfilterDropdown
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		created() {
            uni.setNavigationBarTitle({
                title:this.__('店铺街')
            });

			var that = this;

			setTimeout(()=>{
				that.$.getLocation({
					type: "wgs84",
					success: function(response) {
						that.setData({
							latitude: response.latitude,
							longitude: response.longitude
						});

						console.info("手机定位:");
						console.info(JSON.stringify(response))

						that.getNearbylist();
					},
					fail: function() {
						console.info("手机定位失败");
						that.setData({
							// options: options,
							isdata: true
						});

						that.$.confirm(that.__("手机定位失败"));

						that.getNearbylist();
					},
					complete: function (err) {
					}
				});

				that.$.request({
					url: this.Config.URL.store.lists_store_category,
					data: {},
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
									that.store_category_lists = data.items;
						} else {
						}
					}
				});


				that.$.request({
					url: this.Config.URL.filter_opt,
					data: {},
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
									that.filterData = data;
						} else {
						}
					}
				});
			}, 400)

			uni.$on('diy-scrollbottom', function (data) {
				console.log('Store 监听到事件来自 update ，携带参数 uniId 为：' + data.uniId);
				console.info(that.uniId);
				if (data.uniId == that.uniId)
				{
					console.log('Store 监听到 scrollbottom');
					console.info(that.$refs)
					that.scrollbottom();
				}
			})
		},

		mounted(){
            /*
			var that = this;
			var query = uni.createSelectorQuery().in(this);
			query.select('.m-tips').boundingClientRect(data => {
			  console.log("得到布局位置信息" + JSON.stringify(data));
			  console.log("节点离页面顶部的距离为" + data.top);
			  that.setData({
				  scrollTop: 0,
			  })
			}).exec();
            */
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			//接收菜单结果
			confirm(e){
				console.info(e);
				console.info(this.filterData)

				var that = this;
				var post = this.post;

				e.value.forEach(function(v, k){

					if(that.filterData[k].type == "hierarchy")
					{
						var index = that.filterData[k].sub[e.index[k][0]]['index'];
						console.info(k, ' - ', index)
						console.info(v)
						switch (k) {
							case 0:
								switch (index) {
									case 'store_category_id':
										post.store_category_id = e.value[k][0];
										break;
								}
								break;
							case 1:
								switch (index) {
									case 'store_sales_num':
										post.sidx = 'store_sales_num';
										post.sord = e.value[k][0];
										break;
									case 'store_evaluation_rate':
										post.sidx = 'store_evaluation_rate';
										post.sord = e.value[k][0];
										break;
									case 'store_distance':
										post.sidx = 'distance';
										post.sord = e.value[k][0];
										break;
									case 'store_deliverycredit':
										post.sidx = 'store_deliverycredit';
										post.sord = e.value[k][0];
										break;
									default:
										break;
								}
								break;
							case 2:
								switch (index) {
									case 'near':
										post.distance = e.value[k][1];
										break;
								}
								break;
							case 3:
								switch (index) {
									case 'store_category_id':
										post.store_category_id = e.value[k][0];
										break;
								}
								break;
						}
					}
					else
					{
						e.value[k].forEach(function(ee,ii){
							var index = that.filterData[k].sub[ii]['index'];

							switch (index) {
								case 'contract_type_ids':
									post.contract_type_ids = JSON.stringify(e.value[k][ii]);
									break;
								case 'activity_type_ids':
									post.activity_type_ids = JSON.stringify(e.value[k][ii]);
									break;
								case 'price':
									post.price= e.value[k][ii];
									break;
								default:
									post = post;
									break;
							}
						})

					}

				})


				console.info(post)

				this.setData({
					Info: [],
					page:1,
					ispage: true,
					post: post
				});

				this.getNearbylist();

			},
			getNearbylist: function() {
				var post = this.post;
				var that = this;

				var params = {
					lat: that.latitude,
					lng: that.longitude,
					page: that.page,
					rows: that.rows,
					sidx: post.sidx,
					sord: post.sord,
					store_type: 1,
					distance: post.distance,
					store_category_id: post.store_category_id ? post.store_category_id : '',
				};

				that.$.request({
					url: this.Config.URL.store.lists,
					data: params,
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
							for (let i = 0; i < data.items.length; i++) {
								data.items[i]['distance'] = that.$.distanceFormat(data.items[i]['distance']);

								let coord = that.$.bMapTransQQMap(data.items[i]['store_longitude'], data.items[i]['store_latitude']);
								data.items[i]['store_longitude'] = coord.lng;
								data.items[i]['store_latitude'] = coord.lat;
							}
							that.setData({
								isdata: true,
								loadComplete: true,
							});
							if (data.page >= data.total) {
								that.setData({
									flag: false,
									ispage: false,
									Info: that.Info.concat(data.items)
								})
							} else {
								that.setData({
									flag: true,
									ispage: true,
									Info: that.Info.concat(data.items)
								})
							}

						} else {
							that.setData({
								flag: false,
								ispage: false,
								loadComplete: true
							});
						}
					},
					fail: function(data) {
						that.setData({
							loadComplete: true
						});
						that.$.alert("网络异常请重试！");
					}
				});
			},

			setTab: function (e) {
				console.log(e)
				this.setData({
					tapindex:e.target.dataset.id,
				})
				var post = this.post;

				post.store_category_id = e.target.dataset.id
				this.setData({
					Info: [],
					page:1,
					ispage: true,
					post: post
				});

				this.getNearbylist();
			},
			gotomap: function(e) {
				var that = this;
				if (that.options.issub) {
					that.backCheckout(e.currentTarget.dataset);
				} else {
					that.$.openLocation({
						latitude: parseFloat(e.currentTarget.dataset.lat),
						longitude: parseFloat(e.currentTarget.dataset.lng),
						name: e.currentTarget.dataset.name,
						address: e.currentTarget.dataset.address,
						scale: 28
					})
				}
			},
			backCheckout: function(data) {
				let that = this;
				var options = this.options;

				//存入本地
				uni.setStorageSync('distributor_id', data.id);
				uni.setStorageSync('distributor_name', data.name);
				var params = {};
				var info_list = this.Info;
				for (var r = 0; r < info_list.length; r++) {
					info_list[r].chain_id == data.chain_id;
					params = info_list[r];
				}

				options.store_row = params;

				that.$.navigateBack(1, function() {
					that.notice.postNotificationName("RefreshStoreName", options)
				})
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: false
					}), clearTimeout(t);
					var t = setTimeout(function() {
							e.setData({
								page: parseInt(e.page) + 1,
								rows: 10
							}), e.getNearbylist()
						},
						500)
				}
			},
			selectAddress: function(e) {
				var params = {},
					info_list = this.Info;
				for (var r = 0; r < info_list.length; r++) info_list[r].chain_id == e.currentTarget.dataset.chain_id && (params =
					info_list[r]);
				var that = this;
				that.$.navigateBack(1, function() {
					var e = {
						chain_id: that.chain_id,
						spinfo: that.spid,
						ChainInfo: params
					};
					that.notice.postNotificationName("RefreshStoreName", e)
				})
			},
			call: function(e) {
				let that = this;
				that.$.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.phone
				})
			}
		}

	}
</script>



<style lang="scss">
	@import "../styles/_variables";

	.list-box {
		background-color: #fff;
		color: #333;
	}

	.item-box {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.flex-box {
		display: flex;
		align-items: center;
		position: relative;
	}

	.flex-shop {
		width: 120rpx;
		height: 120rpx;
	}

	.flex-title {
		font-size: 30rpx;
		margin-left: 10rpx;
		max-width: 75%;
		overflow: hidden;
		height: 40rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.flex-postion {
		display: flex;
		align-items: center;
		position: absolute;
		right: 0;
	}

	.flex-postion image {
		width: 20rpx;
		height: 26rpx;
	}

	.flex-postion label {
		font-size: 24rpx;
		color: #9b9b9b;
		margin-left: 10rpx;
	}

	.m-nearbylist {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.flex-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.flex-info view {
		margin: 10rpx 0 0 0;
		font-size: 28rpx;
	}

	.flex-info-box {
		display: flex;
		align-items: flex-start;
	}

	.flex-info label {
		display: inline-block;
		vertical-align: top;
		word-wrap: break-word;
		width: 520rpx;
	}

	.flex-info image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 10rpx;
	}

	.flex-info-title {
		flex-basis: 145rpx;
	}

	.open_ba {
		width: 80%;
		margin: 0 auto
	}

	.open_dl {
		width: 34%;
		height: 79rpx;
		background: #33cc66;
		border-radius: 20rpx;
		text-align: center;
		color: #fff;
		margin: 79rpx auto 0 auto;
		line-height: 75rpx;
	}



	.nearbylist-item {
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #eee;
		background: white;
	}

	.nearbylist-item:last-child {
		border: none;
	}

	.item-info {
		position: relative;
		font-size: 28rpx;
	}

	.item-name {
		display: inline-block;
		font-size: 30rpx;
	}

	.item-phone {
		line-height: 45rpx;
		display: flex;
		align-items: center;
	}

	.item-distance {
		float: right;
		font-size: 26rpx;
		color: #bbb;
	}

	.item-address {
		position: relative;
		font-size: 26rpx;
		color: #bbb;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		margin-right: 40rpx;
		line-height: 40rpx
	}

	.item-info::after {
		content: " ";
		display: inline-block;
		height: 12rpx;
		width: 12rpx;
		border-width: 4rpx 4rpx 0 0;
		border-color: #C8C8CD;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		top: -4rpx;
		position: absolute;
		top: 72%;
		right: 4rpx;
		padding: 3rpx;
	}

	.m-nearbylist {
		height: 100%;
		position: absolute
	}



    .uni-media-list-logo {
    	width: 140rpx;
    	height: 140rpx;
    }

    .uni-media-list-body {
    	height: auto;
    	justify-content: space-around;
    }

    .uni-media-list-text-top {
    	height: 74rpx;
    	font-size: 28rpx;
    	overflow: hidden;
    }

    .uni-media-list-text-bottom {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    }

    .uni-media-list-text-bottom text {
        width: 400rpx;
    }
	.uni-media-list-text-bottom image {
		width: 20rpx;
		height: 26rpx;
	}

	.uni-media-list-text-bottom label {
		font-size: 24rpx;
		color: #9b9b9b;
		margin-left: 10rpx;
	}

    .uni-list-cell
    {
        position: auto;
    }

	.m-nearbylist{
		top:88rpx;
	}

	.order-list{
		// margin-top: 80rpx;
		background-color: #f5f5f5;

		width: 100%;
		.list{
			width: 100%;
			margin: 0 auto;
			.onorder{
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;
				image{
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}
				.text{
					width: 100%;
					height: 60rpx;
					font-size: 28rpx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.row{
				width: calc(100% - 40rpx);
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				background-color: #fff;
				margin-bottom: 30rpx;
				.type{
					font-size: 26rpx;
					color: #ec652f;
					height: 50rpx;
					display: flex;
					align-items: center;
				}
				.order-info{
					width: 100%;
					height:100rpx;
					padding:10rpx 0;
					display: flex;
					.left{
						flex-shrink: 0;
						width: 13vw;
						height: 13vw;
						image{
							width: 13vw;
							height: 13vw;
							border-radius: 10rpx;
						}
					}
					.right{
						width: 100%;
						position: relative;
						padding: 0 18rpx 0;
						.name{
							width: 100%;
							height:50rpx;
							font-size: 28rpx;
							// display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
							display: flex;
							justify-content: space-between;

						}
						.spec{
							color: #a7a7a7;
							font-size: 22rpx;

						}
						.price-number{
							position: absolute;
							// bottom: 0;
							width: 100%;
							display: flex;
							justify-content: space-between;
							font-size: 22rpx;
							color: #333;
							display: flex;
							align-items: flex-end;
							.price{
								font-size: 24rpx;
								margin-right: 5rpx;
							}

						}
					}
				}
				.detail{
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60rpx;
					font-size: 26rpx;
					.sum{
						padding: 0 8rpx;
						display: flex;
						align-items: flex-end;
						.price{
							font-size: 30rpx;
						}
					}

				}
				.btns{
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					view{
						min-width: 120rpx;
						height: 50rpx;
						padding: 0 20rpx;
						border-radius: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						margin-left: 20rpx;
					}
					.default{
						border: solid 1rpx #ccc;
						color: #666;
					}
					.pay{
						border: solid 1rpx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}

	.u-font {
		font-size: 24rpx;
		color:#bfbfbf;
		padding:0 10rpx;
		margin-top:4rpx;
	}

	.evaluation-rate {
		color:#FFB400;
	}

	.store-name {
		width:290rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		font-weight: bold;
	}

	.u-activity {
		padding:0 6rpx;
		border: solid 2rpx #ec652f;
		border-radius:8%;
		font-size: 16rpx;
		color:#ec652f;
		text-align: center;
		// max-width:150rpx;
		margin:0 10rpx;
	}

	.product-item {
		width:100%;
		height:260rpx;
		margin-top:20rpx;

		display: flex;
		justify-content: space-between;
	}

	.item-s {
		width:31%;
		height:100%;
		border-radius: 10rpx;
		// padding:10rpx 0;

		.p-bottom {
			// position: relative;
			bottom:70rpx;
			padding:10rpx;
		}
		.p-image {
			width: 27vw;
			height: 25vw;
			image {
				width: 27vw;
				height: 25vw;
				border-radius: 10rpx;
			}

			.flag {
			  position: relative;
			  z-index: 2;
			  width: 50px;
			  height: 20px;
			  // top:10px;
			  left: 21px;
			  font-size: 10px;
			  line-height: 20px;
			  text-align: center;
			  color: #fff;
			}
			.flag-reduction {
			  background-color: #e50dbb;
			  z-index: 8;
			  float:left;
			}
		}

		.p-name {
			// width:150rpx;
			// height:45rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			font-size: 20rpx;
			// color:#f5f5f5;
			line-height: 1;
		}

		.p-price {
			// width:150rpx;
			// height:45rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			.p-left {
				font-size: 24rpx;
				color: #DB384C;
				// color:#f5f5f5;
			}

			.p-right {
				font-size: 20rpx;
				color:#bfbfbf;
				margin-left:10rpx;
				text-decoration:line-through;
			}
		}
	}

	.scroll-view_S{
		  width: 100%;
		  height:100rpx;
		  background:rgba(245,245,245,1);
		  white-space: nowrap;
		  // position: absolute;
		  // top:calc(var(--status-bar-height) + 82rpx);
		}

		.scroll-view-item_S{
			  // width: 90rpx;
			  height: 60rpx;
			  display: inline-block;
			  padding:20rpx;
			  line-height: 60rpx;

			}

		.nav-text {
			width:100%;
			height:24rpx;
			font-size:16rpx;
			// font-family:HelveticaNeue;
			color:rgba(51,51,51,1);
			line-height:24rpx;
			text-align:center;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.m-navbar-item {
			padding: 20rpx 0;
			font-size: 24rpx;
		}

		.m-navbar-item:after {
			border: none;
		}

		.m-navbar-item.m-navbar-item-on {
			background-color: #f5f5f5;
			font-weight:bold;
			// color: $default-skin-bg;
			font-size: 30rpx;
		}

		.m-navbar-item.m-navbar-item-on::before {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height:
					6rpx;
			border-bottom: 6rpx solid $default-skin-bg;
			color: #CCCCCC;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
			z-index: 3;
		}


</style>
