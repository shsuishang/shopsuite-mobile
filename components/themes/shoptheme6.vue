<template name="shoptheme6">
	<view v-if="commonTplData !== null">
		<!--第六套模板 start-->
		<view class="content" :style="{height:(commonTplData.windowHeight) + 'px'}">
			<scroll-view class="category" scroll-y="true" :style="{height:(commonTplData.windowHeight) + 'px'}">
				<view :class="['category-item', commonTplData.cid==item.store_product_cat_id?'category-item-select':'']" v-for="(item, i) in commonTplData.smallCategory"
				 :key="i" @click="ckallPD6" :data-id="(item.store_product_cat_id)" :data-name="(item.name)">
					{{item.name}}
					<view class="car-num" style="top: unset;margin-top: -84rpx;" v-if="(item.user_cart_quantity !== undefined && item.user_cart_quantity > 0)">{{item.user_cart_quantity ? item.user_cart_quantity : ""}}</view>
				 </view>
				 
				<view style="height:200rpx;"></view>
			</scroll-view>
			
			<scroll-view class="body" scroll-y="true" v-if="(commonTplData.pdlist.length > 0)" @scrolltolower="scrollbottom" :style="{height:commonTplData.windowHeight + 'px'}">
				<view class="body-title">{{commonTplData.categoryname}}</view>
				<view class="body-item" v-for="(item, index) in commonTplData.pdlist" :key="index" :url="'/pagesub/product/detail?is_store_flag='+(commonTplData.isStoreFlag) + '&pid=' + (item.id)"
				 hover-class="none">
					<navigator :url="'/pagesub/product/detail?is_store_flag='+(commonTplData.isStoreFlag) + '&pid=' + (item.id)" hover-class="none">
						<image :src="(item.ProductPic)"></image>
					</navigator>

					<view class="body-item-info">
						<navigator class="item-info-title" :url="'/pagesub/product/detail?is_store_flag='+(commonTplData.isStoreFlag) + '&pid=' + (item.id)"
						 hover-class="none">{{item.productName}}</navigator>
						<view class="item-info-salenum">{{sprintf(__('已售：%s'), item.SaleNum)}}</view>
						<view class="item-info-price">
							<label>{{__('￥')}}</label>{{number_format(item.ItemSalePrice, 2)}}
							<view class="item-num-box" style="bottom:0;right:0;font-weight: normal;height:50rpx;">
								<label class="item-num-over" v-if="(item.Stock == 0)">{{__('已售空')}}</label>
								<block v-else>
									<block v-if="(!item.HasManualSku)">
										<view @click.stop="subCart" :data-num="(item.user_cart_quantity)" :data-stock="(item.Stock)" :data-spuid="(item.id ? item.id : 0)"
										 :data-pname="(item.item_name ? item.item_name : '')" :data-skuid="(item.DefaultProductSkuId)" :data-index="(index)"
										 v-if="(item.user_cart_quantity>0)" class="iconfont icon-jian " style="font-size:50rpx;"></view>
										<text class="item-num-add" v-if="(item.user_cart_quantity>0)">{{item.user_cart_quantity>99?'99+':item.user_cart_quantity}}</text>
										<view @click.stop="addCart" :data-num="(item.user_cart_quantity)" :data-stock="(item.Stock)" :data-spuid="(item.id ? item.id : 0)"
										 :data-pname="(item.item_name ? item.item_name : '')" :data-skuid="(item.DefaultProductSkuId)" :data-index="(index)" :data-is_virtual="(item.is_virtual)"
										 class="iconfont icon-add " style="font-size:50rpx;position:relative;bottom:5rpx;"></view>
									</block>
									<label class="item-num-choose" @click.stop="chooseProduct" :data-item_id="(item.item_id)" :data-index="(index)"
									 v-else>{{__('选规格')}}
										<view class="car-num" v-if="(item.user_cart_quantity>0)" style="right:-10rpx;top:-15rpx;">{{item.user_cart_quantity>99?'99+':item.user_cart_quantity}}</view>
									</label>
								</block>

							</view>
						</view>
					</view>
				</view>

				<view class="m-loading-box">
					<block v-if="(commonTplData.ispage)">
						<view class="u-loadmore">
							<label class="u-loading"></label>
							<text class="u-loadmore-tips">{{__('正在加载')}}</text>
						</view>
					</block>
					<block v-else>
						<view class="u-loadmore u-loadmore-line">
							<text class="u-loadmore-tips" style="background:white;">{{__('没有更多数据啦！')}}</text>
						</view>
					</block>
				</view>
				<view style="height:200rpx;"></view>
			</scroll-view>
			<view class="m-nullcontent" style="flex:4;width:80%;" v-else>
				<view class="m-nullpage-middle" v-if="loadProductComplete">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('暂时没有商品哦')}}</text>
					</view>
				</view>
			</view>
			
		</view>
		<view class="window " v-if="(!commonTplData.click6)">
			<view class="window-top" @click.stop="cancelwindow">
				<view :class="['top-content', !commonTplData.click6?'animated slideInUp':'']"  @click.stop.prevent="doNothing">
					<view class="window-clear">
						<label @click="delAll" class="delAll">{{__('清空购物车')}}</label>
						<label class="iconfont icon-delete" @click="delAll"></label>
					</view>
					<view class="top-scrollbox">
						<block v-for="(item, i) in commonTplData.cartlist.items[0].items" :key="i">
							<view class="window-scroll-item" v-if="(item.cart_select)">
								<label class="window-item-title" v-if="(!item.item_spec_name)">{{item.product_name}}</label>
								<view class="window-item-title-sp" v-else>
									<view class="sp-name">{{item.product_name}}</view>
									<view class="sp-content">{{item.item_spec_name}}</view>
								</view>
								<label class="window-item-price">{{__('￥')}}{{item.item_sale_price}}</label>
								<view class="item-num-box">
									<view @click.stop="sub" :data-num="item.cart_quantity" :data-stock="item.item_quantity"
									 :data-cid="item.cart_id" :data-spuid="item.product_id" :data-skuid="item.item_id" class="iconfont icon-jian icon" style="font-size:45rpx;"></view>
									<text class="item-num-add">{{item.cart_quantity>99?'99+':item.cart_quantity}}</text>
									<view @click.stop="add" :data-num="item.cart_quantity" :data-stock="item.item_quantity"
									 :data-cid="item.cart_id" :data-spuid="item.product_id" :data-skuid="item.item_id" class="iconfont icon-add icon" style="font-size:45rpx;position:relative;bottom:5rpx;"></view>

								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="window-bottom"></view>
		</view>
		<view class="car" @click.stop="shoppingcarclicked" v-if="(commonTplData.isdata)">
			<view :class="'iconfont icon-gouwucheover car-img  ' + (commonTplData.cartlist.Total>0?'red':'gray')"></view>
			<view class="car-num" v-if="(commonTplData.cartlist.Total>0)">{{commonTplData.cartlist.Total>99?'99+':commonTplData.cartlist.Total}}
			</view>
		</view>
		<view class="bottom-bar" v-if="(commonTplData.isdata)" @click.stop.prevent="doNothing">
			<view class="bar-left" @click.stop="shoppingcarclicked">
				<view class="price-box" v-if="(commonTplData.cartlist.Total>0)">
					<view class="price-money">
						<label>{{__('￥')}}</label>{{commonTplData.cartlist.TotalPrice}}</view>
					<view class="price-delivery">{{__('不含运费')}}</view>
				</view>
				<text class="text-null" v-else>{{__('购物车为空')}}</text>
			</view>
			<view :class="'bar-right ' + (commonTplData.cartlist.Total>0?'bar-right-red':'bar-right-gray')" @click.stop="submitOrder">{{__('结算')}}
				{{commonTplData.cartlist.Total>0?'(':''}}{{commonTplData.cartlist.Total>0?(commonTplData.cartlist.Total>99?'99+':commonTplData.cartlist.Total):''}}{{commonTplData.cartlist.Total>0?')':''}}
			</view>
		</view>

		<view class="msk1" v-if="(commonTplData.addCar)" style="z-index:20;" @click.stop="closeaddcar">
			<view class="m-sp-box" @click.stop="innertouch">
				<view class="m-sp-top">
					<view class="u-close-sp" @click.stop="closeaddcar">✕</view>
					<view class="m-sp-title">{{commonTplData.ProductInfo.SalesName}}</view>
					<view class="m-sp-body" v-for="(items, i) in commonTplData.ProductInfo.product_spec"  :key="i">
						<view>{{items.name}}：</view>
						<view class="m-sp-unit">
							<view v-for="(item, ii) in items.item"  :key="ii" :class="['m-sp-choose',  item.select?'sp-choose-item-checked':'']">
								<label class="sp-choose-item " :data-specid="(items.specid)" :data-spuid="(item.id)" @click.stop="selectsp">{{item.name}}</label>
							</view>
						</view>
					</view>
				</view>

				<view class="m-sp-bottom">
					<label class="sp-bottom-price">{{__('￥')}}{{commonTplData.ProductInfo.item_sale_price}}</label> <label class="sp-bottom-des">(
						<block v-for="(items, i) in commonTplData.ProductInfo.product_spec"  :key="i">
							<block v-for="(item, ii) in items.item"  :key="ii">
								<block v-if="(item.select)">{{item.name}} </block>
							</block>
						</block>
						)</label>
					<view class="item-num-box" style="bottom:0;right:30rpx;font-weight: normal;height:100rpx;">
						<block>
							<view @click.stop="subCartSp" v-if="(commonTplData.count>0)" :data-stock="(commonTplData.ProductInfo.item_quantity)"
							 :data-spuid="(commonTplData.ProductInfo.product_id ? commonTplData.ProductInfo.product_id : 0)" :data-pname="(commonTplData.ProductInfo.SalesName2 ? commonTplData.ProductInfo.SalesName2 : '')"
							 :data-skuid="(commonTplData.ProductInfo.item_id)" class="iconfont icon-jian " style="font-size:50rpx;"></view>
							<text class="item-num-add" v-if="(commonTplData.count>0)">{{commonTplData.count>99?'99+':commonTplData.count}}</text>
							<view @click.stop="addCartSp" :data-stock="(commonTplData.ProductInfo.item_quantity)" :data-spuid="(commonTplData.ProductInfo.product_id ? commonTplData.ProductInfo.product_id : 0)"
							 :data-pname="(commonTplData.ProductInfo.SalesName2 ? commonTplData.ProductInfo.SalesName2 : '')" :data-skuid="(commonTplData.ProductInfo.item_id)"
							 class="iconfont icon-add " style="font-size:50rpx;position:relative;bottom:5rpx;"></view>
						</block>
					</view>
				</view>
			</view>

		</view>
		<!--第六套模板 start-->
	</view>
</template>

<script>

	import $ from "../../helpers/util";
	// 仅仅作为初始化数据结构使用
	var thatProm = {
		isStoreFlag: 1,
		ProductInfo: {},
		addCar: false,
		count: 0,
		windowHeight: 0,
		categoryname: "",
		click6: true,
		cid: 0,
		cartlist: {},
		isdata: false,
		select_cart_ids: [],
		tapindex: 1,
		viewtype: 0,
		shopInfo: {},
		pdlist: [],
		sort: 2,
		ispage: true,
		flag: true,
		distance: 0,
		istop: false,
		TemplateKey: "",
		smallCategory: [],
		loadStoreCategoryComplete: false, // 当前选中的店铺分类信息是否加载完成
		currentCategoryId: 0, // 当前选中的店铺分类ID
		currentCategoryName: '', // 当前选中的店铺分类名称
		AdContent: {},
		post: {
			store_id: 0,
			orderby: 1,
			sort: 2,
			isnew: false,
			curpage: 1
		},
		formdate: "",
		pageId: 0
	};

	export default {
		name: "shoptheme6",
		props: {
			commonTPL: {
				type: Object,
				default () {
					return {
						isStoreFlag: 1,
						ProductInfo: {},
						addCar: false,
						count: 0,
						windowHeight: 0,
						categoryname: "",
						click6: true,
						cid: 0,
						cartlist: {},
						isdata: false,
						select_cart_ids: [],
						tapindex: 1,
						viewtype: 0,
						shopInfo: {},
						pdlist: [],
						sort: 2,
						ispage: true,
						flag: true,
						distance: 0,
						istop: false,
						TemplateKey: "",
						smallCategory: [],
						loadStoreCategoryComplete: false, // 当前选中的店铺分类信息是否加载完成
						currentCategoryId: 0, // 当前选中的店铺分类ID
						currentCategoryName: '', // 当前选中的店铺分类名称
						AdContent: {},
						post: {
							store_id: 0,
							chain_id: 0,
							orderby: 1,
							sort: 2,
							isnew: false,
							curpage: 1
						},
						formdate: "",
						pageId: 0
					}
				},
			}
		},
		data() {
			return {
                commonTplData: null,
                pid: '',
                spuid: '',
                skuid: '',
                index: 0,
                formdate:'',
				iddata:true,
				splist: [],
				splistStr: [],
				loadProductComplete: false,
            }
		},
		created: function() {
			this.commonTplData = this.commonTPL;
			console.info(this.commonTplData)
			
			this.initData();
		},
		methods: {
			initData: function() {
				// 默认显示购物车
				// this.getCartList();
				this.GetPlistTakeAway();
			},
			//根据分类读取产品
			GetPlistTakeAway: function() {
				var that = this;
				
				that.$set(that.commonTplData, 'flag', false)
				
				that.$set(that.commonTplData, 'post', Object.assign({}, that.commonTplData.post, {
					"isnew": that.commonTplData.post.isnew ? 1 : 0,
					"user_cart_quantity": that.commonTplData.TemplateKey === "shop6" ? 1 : 0
				}));
				that.setData({
					'loadProductComplete': false
				})
				
				let url = that.cf.URL.store.product;
				
				if (that.commonTplData.isChainFlag)
				{
					url = that.cf.URL.store.listsChainProduct;
				}
				

				$.request({
					url: url,
					data: that.commonTplData.post,
					success: function(data, status, msg, code) {
						for (var i = 0; i < data.items.length; i++) {
							data.items[i]['id'] = data.items[i]['item_id'];
							data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
							data.items[i]['productName'] = data.items[i]['product_name'];
							data.items[i]['SalesName'] = data.items[i]['product_name'];
							data.items[i]['ProductPic'] = data.items[i]['product_image'];
							data.items[i]['ItemSalePrice'] = data.items[i]['item_unit_price'];
							data.items[i]['SaleNum'] = data.items[i]['product_sale_num'];
							data.items[i]['Stock'] = data.items[i]['product_quantity'];
							data.items[i]['HasManualSku'] = data.items[i]['item_color'].length > 1;
							data.items[i]['DefaultProductSkuId'] = data.items[i]['item_id'];
							//data.items[i]['user_cart_quantity'] = 1;
						}

						if (data.items.length > 0) {
							if (that.commonTplData.post.curpage == 1 && data.items.length < 10) {
								
								that.$set(that.commonTplData, 'flag', false);
								that.$set(that.commonTplData, 'ispage', false);
							} else {
								that.$set(that.commonTplData, 'flag', true);
								that.$set(that.commonTplData, 'ispage', true);
							}
							that.$set(that.commonTplData, 'pdlist', that.commonTplData.pdlist.concat(data.items));
						} else {
							that.$set(that.commonTplData, 'flag', false)
							that.$set(that.commonTplData, 'ispage', false)
						}
						
						that.setData({
							'loadProductComplete': true
						})
					}
				});


				that.getCartList()
			},
			
			reloadCategoryProduct : function() {
				let that = this;
				
				this.$set(this.commonTplData, 'pdlist', []);
				this.GetPlistTakeAway()
			},
			
			ckallPD6: function(e) {
				let that = this;
				this.$set(this.commonTplData, 'pdlist', []);

				var t;
				if (that.commonTplData.tapindex == 2 ) {
					t = false
				} else {
					that.$set(that.commonTplData, 'tapindex', 3)
					t = true
				}

				that.$set(that.commonTplData, 'categoryname', e.target.dataset.name);
				that.$set(that.commonTplData, 'currentCategoryName', e.target.dataset.name);
				that.$set(that.commonTplData, 'cid', e.target.dataset.id);
				that.$set(that.commonTplData, 'currentCategoryId', e.target.dataset.id);

				that.commonTplData.post = {
					store_category_ids: e.target.dataset.id,
					store_id: that.commonTplData.shopInfo.store_id,
					chain_id: that.commonTplData.shopInfo.chain_id,
					orderby: 1,
					sort: 2,
					isnew: t,
					curpage: 1
				};

				this.GetPlistTakeAway()
			},

			shoppingcarclicked: function() {
				let that = this;
				
				if (that.commonTplData.cartlist.Total > 0) {
					that.$set(that.commonTplData, 'click6', !that.commonTplData.click6);
				}
			},
			
			cancelwindow: function() {
				let that = this;
				that.$set(that.commonTplData, 'click6', true);
			},
			doNothing: function() {
			},

			//读取购物车数据
			requestCartList: function() {
				let that = this;
				var params = {
						store_id: that.commonTplData.shopInfo.store_id,
						chain_id: that.commonTplData.shopInfo.chain_id
					};
				return new Promise((res) => {
					//发送购物车请求
					that.$.request({
						url: that.cf.URL.cart.lists,
						data: params,
						loading: false,
						success: function(data, status, msg, code) {
							that.$set(that.commonTplData, 'isdata', data.total_quantity > 0 ? true : false);
							if (data.items.length > 0)
							{
								data = that.ckalllength(data);
								
								that.$set(that.commonTplData, 'cartlist', Object.assign({}, data, {
									"Total": data.items[0].totalSelGoods,
									"TotalPrice": data.order_money_amount,
								}));
							} else {
								that.$set(that.commonTplData, 'cartlist', Object.assign({}, data, {
									"Total": 0,
									"TotalPrice": 0,
								}));
								that.$set(that.commonTplData, 'click6', true);
							}
							
							that.updateSmallCategoryCartData(that.commonTplData.smallCategory, data.store_category_data)
							
							res({data:data, status:status, msg:msg, code:code});
						},
						fail: (err, status) => {
							res({data:err, status:status});
						}
					});
				})
			},
			
			updateSmallCategoryCartData: function (smallCategory, store_category_data) {
				let obj = {};
				let that = this;
				store_category_data.forEach(i => {
					obj[i.store_product_cat_id] = i;
				});
				
				smallCategory.map(ii => {
					let ucq = 0;
					
					if (typeof obj[ii.store_product_cat_id] == 'undefined')
					{
						ucq = 0;
					}
					else
					{
						if (typeof obj[ii.store_product_cat_id]['user_cart_quantity'] == 'undefined')
						{
							ucq = 0;
						}
					}
					
					return Object.assign(ii, {'user_cart_quantity' : ucq});
				});
				
				that.$set(that.commonTplData, 'smallCategory', smallCategory)
			},
			
			
			getCartList:async function (){
				var that = this;
				await that.requestCartList();
			},
			ckalllength: function(data) {
				var that = this,
					selected_ids = [];
				var total_sel = 0;
			
				//循环所有店铺
				if (!that.$.isNull(data.items) && data.items.length > 0) {
					var total = 0;
			
					for (var store_item_index in data.items) {
						var cart_items = data.items[store_item_index].items,
							s = cart_items.length;
						var i = 0;
			
						for (var item in cart_items) {
							//按照item计算 i
							if (cart_items[item].cart_select && cart_items[item].is_on_sale) {
								i = i + cart_items[item].cart_quantity;
							}
						}
			
						total = total + i;
					}
			
					data.Total = total;
				} else {
					data.Total = 0;
				}
				return data;
			},
			
			sub: function(e) {
				let that = this;
				var t = {
					btntype: 2,
					numval: e.currentTarget.dataset.num,
					CID: e.currentTarget.dataset.cid,
					stock: e.currentTarget.dataset.stock,
					skuid: e.currentTarget.dataset.skuid,
					spuid: e.currentTarget.dataset.spuid
				};
				this.unifiedNum(t)
			},
			
			add: function(e) {
				let that = this;
				var t = {
					btntype: 1,
					numval: e.currentTarget.dataset.num,
					CID: e.currentTarget.dataset.cid,
					stock: e.currentTarget.dataset.stock,
					skuid: e.currentTarget.dataset.skuid,
					spuid: e.currentTarget.dataset.spuid
				};
				this.unifiedNum(t)
			},
			
			unifiedNum: function(e) {
				let that = this;
				var num_obj = {
					value: parseInt(e.numval),
					stock: parseInt(e.stock)
				};

				e.btntype == 1 && (num_obj.value = num_obj.value + 1);
				e.btntype == 2 && (num_obj.value = num_obj.value - 1);

				num_obj.value > num_obj.stock && (num_obj.value = num_obj.stock);
				num_obj.value <= 0 && (num_obj.value = 0);

				var param = {
						store_id: that.commonTplData.shopInfo.store_id,
						chain_id: that.commonTplData.shopInfo.chain_id,
						cart_id: e.CID,
						cart_quantity: num_obj.value
					};

				//发送购物车请求
				$.request({
					url: that.cf.URL.cart.quantity,
					data: param,
					success: function(data) {
						let product_info = that.searchFromMultArray(that.commonTplData.pdlist, e.spuid, 'product_id');
						
						if (Object.keys(product_info).length >= 1) {
							let item_info = that.searchFromMultArray(product_info.data['item_color'], e.skuid, 'item_id');
							
							that.updateComminTplCartData(that.commonTplData.pdlist, product_info.index, item_info.index, e.btntype)
						}
						
						that.getCartList();
					}
				});
			},
			
			subCart: function(e) {
				let that = this;
				var t = {
					cart_quantity: -1,
					item_id: e.currentTarget.dataset.skuid,
					productName: e.currentTarget.dataset.pname,
					productSkuId: e.currentTarget.dataset.skuid,
					store_id: that.commonTplData.shopInfo.store_id,
					chain_id: that.commonTplData.shopInfo.chain_id,
					btntype: 2,
					index: e.currentTarget.dataset.index,
					is_item: false,
					item_index: -1
				};
				if (e.currentTarget.dataset.num === '1') {
					this.removeItems(e, e.currentTarget.dataset.skuid);
				} else {
					this.doAddCart(t)
				}
				
			},
			
			subCartSp: function(e) {
				let that = this;
				
				let skuInfo = that.searchFromMultArray(that.commonTplData.pdlist[this.index]['item_color'], e.currentTarget.dataset.skuid, 'item_id');
				
				var t = {
					cart_quantity: -1,
					item_id: e.currentTarget.dataset.skuid,
					productName: e.currentTarget.dataset.pname,
					productSkuId: e.currentTarget.dataset.skuid,
					store_id: that.commonTplData.shopInfo.store_id,
					chain_id: that.commonTplData.shopInfo.chain_id,
					btntype: 2,
					index: this.index,
					is_item: true,
					item_index: skuInfo.index
				};
				
				this.doAddCart(t)
			},
			
			addCart: function(e) {
				let that = this;
				var t = {
					cart_quantity: 1,
					item_id: e.currentTarget.dataset.skuid,
					productName: e.currentTarget.dataset.pname,
					productSkuId: e.currentTarget.dataset.skuid,
					store_id: that.commonTplData.shopInfo.store_id,
					chain_id: that.commonTplData.shopInfo.chain_id,
					btntype: 1,
					index: e.currentTarget.dataset.index,
					is_item: false,
					item_index: -1
				};
				if (e.currentTarget.dataset.stock == that.commonTplData.pdlist[t.index].user_cart_quantity) {
					$.alert("没有库存啦");
					return
				}
				
				if (e.currentTarget.dataset.is_virtual)
				{
					that.$.navigateTo({
						url: "/pagesub/checkout/checkout?ifcart=0&cart_id=" + t.item_id + "|" + t.cart_quantity + "|" + 0 + "&chain_id=" + t.chain_id
					})
				}
				else
				{
					this.doAddCart(t)
				}
			},
			
			addCartSp: function(e) {
				let that = this;

				let skuInfo = that.searchFromMultArray(that.commonTplData.pdlist[this.index]['item_color'], e.currentTarget.dataset.skuid, 'item_id');
				
				var t = {
					cart_quantity: 1,
					item_id: e.currentTarget.dataset.skuid,
					productName: e.currentTarget.dataset.pname,
					productSkuId: e.currentTarget.dataset.skuid,
					store_id: that.commonTplData.shopInfo.store_id,
					chain_id: that.commonTplData.shopInfo.chain_id,
					btntype: 1,
					index: this.index,
					is_item: true,
					item_index: skuInfo.index
				};
				
				if (e.currentTarget.dataset.stock <= skuInfo.data.user_cart_quantity) {
					$.alert("没有库存啦");
					return
				}
				this.doAddCart(t)
			},
			searchFromMultArray: function(rows, item_id, search_key = 'item_id') {
				let row = {};
				for (const key in rows) {
					if (rows[key][search_key] ==  item_id) {
						row.data = rows[key];
						row.index = key;
						break;
					}
				}
				return row;
			},
			doAddCart: function(params) {
				var that = this;
				if (that.commonTplData.pdlist[params.index].user_cart_quantity == 0 && params.btntype == 2) {
					return;
				}

				if (that.stock <= 0) {
					$.alert("亲~商品没有库存啦！");
					return
				}

				$.request({
					url: that.cf.URL.cart.add,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.updateComminTplCartData(that.commonTplData.pdlist, params.index, params.item_index, params.btntype)
							that.getCartList();
						} else {
							$.alert(msg)
						}
					}
				});
			},
			updateComminTplCartData: function (comData, index, item_index, btn_type) {
				let that = this;
				if (btn_type == 1) {
					comData[index].user_cart_quantity++;
				}
				if (btn_type == 2) {
					comData[index].user_cart_quantity--;
				}
				
				// 多规格
				if (item_index != -1) {
					if (btn_type == 1) {
						comData[index].item_color[item_index].user_cart_quantity++;
					}
					if (btn_type == 2) {
						comData[index].item_color[item_index].user_cart_quantity--;
					}
					that.$set(that.commonTplData, 'count', comData[index].item_color[item_index].user_cart_quantity);
				}
				
				that.$set(that.commonTplData, 'pdlist', comData);
			},
			
			removeItems: function(e, item_id) {
				var that = this;
				let tmp = that.commonTplData.pdlist;
				$.showModal({
					title: "提示",
					content: "确认要删除这个商品吗？",
					success: function(n) {
						if (n.confirm) {
							var param = {
								item_id: item_id
							};
							$.request({
								url: that.cf.URL.cart.removeItems,
								data: param,
								success: function(data) {
									that.getCartList();
									for (var r = 0; r < that.commonTplData.pdlist.length; r++) {
										if (that.commonTplData.pdlist[r].id == e.target.dataset.spuid) {
											tmp[r].user_cart_quantity = 0;
											that.$set(that.commonTplData, 'pdlist', tmp);
											break
										}
									}
								}
							});
						}
					}
				})
			},
			
			delCart: function(e) {
				var params = {
						cart_id: e.CID
					};
				var that = this;
				
				if (that.commonTplData.cartlist.Total == 1) {
					that.$set(that.commonTplData, 'click6', true);
				}
				let tmp = that.commonTplData.pdlist;
				
				$.showModal({
					title: "提示",
					content: "确认要删除这个商品吗？",
					success: function(n) {
						if (n.confirm) {
							var param = {
								cart_id: e.currentTarget.dataset.id
							};
							$.request({
								url: that.cf.URL.cart.remove,
								data: param,
								success: function(data) {
									that.getCartList();
									for (var r = 0; r < that.commonTplData.pdlist.length; r++) {
										if (that.commonTplData.pdlist[r].id == e.target.dataset.spuid) {
											tmp[r].user_cart_quantity = tmp[r].user_cart_quantity - 1;
											that.$set(that.commonTplData, 'pdlist', tmp);
											break
										}
									}
								}
							});
						}
					}
				})
			},
			
			delAll: function() {
				let that = this;
				this.clearCart();
				var params = {
					cart_id: that.commonTplData.select_cart_ids.toString()
				};
					
				let tmp = that.commonTplData.pdlist;
				that.commonTplData.select_cart_ids.length <= 0 ? $.confirm("请选择需要删除的商品！") : $.confirm("是否删除选中商品？", function(t) {
						if (t.confirm) {
							var param = {
								cart_id: that.commonTplData.select_cart_ids.toString()
							};
							$.request({
								url: that.cf.URL.cart.remove,
								data: param,
								success: function(data) {
									that.getCartList()

									for (var n in that.commonTplData.pdlist) {
										tmp[n].user_cart_quantity = 0;
										that.$set(that.commonTplData, 'pdlist', tmp);
									}
									that.$set(that.commonTplData, 'count', 0);
								}
							});
						}
					},true)
			},
			
			clearCart: function() {
				let that = this;
				var ids = [],
					n = that.commonTplData.cartlist.items[0].items;
				for (var r in n) {
					n[r].cart_select && ids.push(n[r].cart_id);
				}

				that.$set(that.commonTplData, 'select_cart_ids', ids);
				that.$set(that.commonTplData, 'click6', true);
			},
			
			submitOrder: function() {
				let that = this;
				
				let url = "/pagesub/checkout/checkout?checked_store=" + that.commonTplData.post.store_id;
				if (that.commonTplData.isChainFlag)
				{
					url = "/pagesub/checkout/checkout?chain_id=" + that.commonTplData.post.chain_id;
				}
				
				
				that.commonTplData.cartlist.Total > 0 ? $.navigateTo({
					url: url
				}) : $.showModal({
					title: "提示",
					content: "请选择需要结算商品！",
					showCancel: false
				})
			},
			
			selectsp: function(e) {
				var t = {
						spuid: e.target.dataset.spuid,
						specid: e.target.dataset.specid
					},
					spec_ids = [],
					r = this.splist;
					
				for (var i in r) {
					r[i] == t.specid ? spec_ids.push(parseInt(t.spuid)) : spec_ids.push(parseInt(r[i]));
				}

				this.setData({
					splist: [],
					splistStr: []
				});
				let that = this;

				var uniqid = spec_ids.join('-');
				var item_id = that.commonTplData.ProductInfo.product_uniqid[uniqid][0];

				var params = {
					item_id: item_id,
					eventId: this.eventId
				};

				//读取商品规格信息
				$.request({
					url: that.cf.URL.product.quick,
					data: params,
					success: function(data, status) {
						if (status != 200) {
							that.setData({
								isdata: false
							});
						} else {
							if (data.item_row.product_spec.length > 0) {
								for (var n in data.item_row.product_spec) {
									for (var r in data.item_row.product_spec[n].item) {
										data.item_row.product_spec[n].item[r].select && (data.item_row.product_spec[n].specid = data.item_row.product_spec[
											n].item[r].id, that.splist.push(data.item_row.product_spec[n].item[r].id), that.splistStr.push(data.item_row
											.product_spec[n].item[r].name));
									}
								}
							}
							that.$set(that.commonTplData, 'ProductInfo', data.item_row);
							
							let product_info = that.searchFromMultArray(that.commonTplData.pdlist, data.item_row.product_id, 'product_id')
							
							let item_info = that.searchFromMultArray(product_info.data['item_color'], params.item_id, 'item_id');
							that.$set(that.commonTplData, 'count', item_info.data.user_cart_quantity);
						}
					}
				});
			},
			
			chooseProduct: function(e) {
				var that = this;
				
                this.setData({
					pid: e.target.dataset.item_id,
					skuid: e.target.dataset.item_id,
					index: e.target.dataset.index
				});
				
				var params = {
					item_id: e.target.dataset.item_id
				};

				this.setData({
					splist: [],
					splistStr: []
				});

				//读取商品规格信息
				$.request({
					url: that.cf.URL.product.quick,
					data: params,
					success: function(data, status) {
						if (status != 200) {
							that.setData({
								isdata: false
							});
						} else {
							if (data.item_row.product_spec.length > 0) {
								for (var n in data.item_row.product_spec) {
									for (var r in data.item_row.product_spec[n].item) {
										data.item_row.product_spec[n].item[r].select && (data.item_row.product_spec[n].specid = data.item_row.product_spec[
											n].item[r].id, that.splist.push(data.item_row.product_spec[n].item[r].id), that.splistStr.push(data.item_row
											.product_spec[n].item[r].name));
									}
								}
							}
							that.$set(that.commonTplData, 'ProductInfo', data.item_row);
							that.$set(that.commonTplData, 'addCar', true);
							
							let product_row = that.commonTplData.pdlist[e.target.dataset.index]
							let item_info = that.searchFromMultArray(product_row['item_color'], e.target.dataset.item_id, 'item_id');
							that.$set(that.commonTplData, 'count', item_info.data.user_cart_quantity);
						}
					},
					fail: function(data) {
						that.$.alert("网络错误，请重试！")
					}
				});
			},
			
			closeaddcar: function() {
				let that = this;
				that.$set(that.commonTplData, 'addCar', false);
			},
			
			searchcarcount: function(e) {
				let that = this;
				if (!$.isNull(that.commonTplData.cartlist.items)) {
					that.$set(that.commonTplData, 'count', 0);
					for (var t = 0; t < that.commonTplData.cartlist.items[0].items.length; t++) {
						if (that.commonTplData.cartlist.items[0].items[t].item_id == e) {
							that.$set(that.commonTplData, 'count', that.commonTplData.cartlist.items[0].items[t].Amount);
						}
					}
				}
			},
			
			callTel: function(e) {
				$.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.tel,
					success: function(e) {},
					fail: function(e) {}
				})
			},
			
			scrollbottom: function(e) {
				let that = this;
				if (that.commonTplData.flag) {
					that.setData({
						flag: false
					}), clearTimeout(n);
					var n = setTimeout(function() {
							that.$set(that.commonTplData, 'post', Object.assign({}, that.commonTplData.post, {curpage: that.commonTplData.post.curpage + 1}));
							 that.commonTplData.TemplateKey == "shop6" ? that.GetPlistTakeAway() : that.GetPlist()
						},500)
				}

			},
			
			tplGoToPage: function(e) {
				var t = e.currentTarget.dataset;
				switch (parseInt(t.type)) {
					case 1:
						$.navigateTo("/pagesub/product/detail?id=" + t.id);
						break;
					case 2:
						$.navigateTo("/pagesub/product/list?store_category_id==" + (t.id || 0) + "&cname=" + t.name);
						break;
					case 3:
						$.navigateTo("/pagesub/product/list?pname=" + t.keyword);
						break;
					case 4:
						$.navigateTo(t.appurl);
						break;
					case 5:
						$.navigateTo(t.appurl);
						break;
					case 6:
						$.navigateTo(t.appurl);
						break;
					case 7:
						$.navigateToMiniProgram({
							appId: t.appid,
							path: t.appurl || ""
						});
						break;
					case 8:
						$.navigateTo("/pagesub/diy-page/diy-page?id=" + t.id);
						break;
					case 9:
						$.navigateTo("/pagesub/webpage/webpage?u=" + encodeURIComponent(t.appurl) + "&tn=" + t.name + "&tc=" + t.appid +
							"&tb=" + t.keyword)
				}
			},
			
			bindDateChange: function(e) {
				let that = this;
				this.setData({
					formdate: e.detail.value
				})

			},
			
			formSubmit: function(e) {
				var t = this,
					n = [];
				for (var r = 0; r < t.PageContent.length; r++) {
					if (t.PageContent[r].eltmType == 13) {
						var i = t.PageContent[r].eltm13.data;
						for (var s = 0; s < i.length; s++) {
							var o = e.detail.value[i[s].id],
								u = i[s].isFillIn,
								a = i[s].labelText,
								f = i[s].id,
								l = {},
								c = true;
							if (i[s].type == 2) {
								if (u) {
									if (!!$.isNull(t.formdate)) {
										return $.confirm(i[s].placeholderText), c = false, false;
									}
									o = t.formdate, c = true
								} else {
									c = true;
								}
							} else if (u) {
								if (!!$.isNull(o)) {
									return $.confirm(i[s].placeholderText), c = false, false;
								}
								if (i[s].isVerification > 0) {
									if (i[s].isVerification == 1) {
										if (!/^1[23456789]\d{9}$/.test(o)) {
											return $.confirm("请输入正确的手机号码！"), c = false, false;
										}
										c = true
									}
									if (i[s].isVerification == 2) {
										if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(o)) {
											return $.confirm("请输入正确的邮箱地址！"), c = false, false;
										}
										c = true
									}
								} else {
									c = true
								}
							} else {
								if (!$.isNull(o)) {
									if (i[s].isVerification > 0) {
										if (i[s].isVerification == 1) {
											if (!/^1[23456789]\d{9}$/.test(o)) {
												return $.confirm("请输入正确的手机号码！"), c = false, false;
											}
											c = true
										}
										if (i[s].isVerification == 2) {
											if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(o)) {
												return $.confirm("请输入正确的邮箱地址！"), c = false, false;
											}
											c = true
										}
									} else {
										c = true;
									}
								}
								c = true
							}
							c && (l.id = f, l.key = a, l.value = o, n.push(l))
						}
					}
				}
				var h = {


					SubmitInfo: JSON.stringify(n),
					PageId: t.pageId
				};
				/* ??? $.xsr($.makeUrl(api.SubmitFormData, h), function (e) {
				    e.Code == 0 ? $.alert("提交信息成功！") : $.confirm("你已经提交信息，请勿重复提交！")
				})*/
			},
            
			innertouch: function() {}
		}
	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

	@import '../../styles/layout.scss';
	@import '../../styles/store_themes.scss';
	@import '../../styles/store_tpl.scss';
</style>

