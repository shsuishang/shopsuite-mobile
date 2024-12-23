<template>
    <scroll-view scroll-y="true" class="m-product-all u-pa" @scrolltolower="scrollbottom" scroll-top="(scposition)" v-if="(isdata)">
		<view  :class="{'m-product-list':1, 'm-listv':false}">
		    <view v-for="(item, i) in tracks_rows" :key="i" class="m-product-item" :data-pid="(item.item_id)" @touchstart="removestart" @touchmove="removeload" @touchend="removeend" :data-id="(item.item_id)">
				<navigator v-if="true" :url="(item.is_virtual?'/pagesub/product/detail':'/pagesub/product/detail') + '?pid=' + (item.item_id)" class="m-product-item" :class="'m-item-c ' + ((item.item_id==T_Id)?'del':'')">
				    <view class="m-product-img product-list">
				        <block v-if="false">
						<view class="flag flag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</view>
						<view class="flag flag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</view>
						<view class="flag flag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</view>
						<view class="flag flag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</view>
				        </block>
						
						<image lazy-load :src="(item.product_image)"  v-if="item.product_image" />
				    </view>
				    <view class="m-product-info1" style="display:flex; flex-flow: column;justify-content: space-between;">
				        <view class="m-product-name2">
							<label>
				                <text class="tag tag-bargain" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_BARGAIN">{{item.activity_type_name}}</text>
				                <text class="tag tag-gift" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GIFT">{{item.activity_type_name}}</text>
				                <text class="tag tag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_LIMITED_DISCOUNT">{{item.activity_type_name}}</text>
								<text class="tag tag-saleoff" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_GROUPBOOKING">{{item.activity_type_name}}</text>
				                <text class="tag tag-reduction" v-if="item.activity_type_id == StateCode.ACTIVITY_TYPE_REDUCTION">{{item.activity_type_name}}</text>
								{{item.product_name}}
							</label>
				        </view>
						<view class="m-product-name2">
							{{item.item_name}}
						</view>
				        <view class="m-product-name2" v-if="false">
							<uni-tag text="产地" type="success" size="small" :inverted="true" class="p-tag"></uni-tag>
							<uni-tag text="距离" type="royal" size="small" :inverted="true" class="p-tag"></uni-tag>
							<uni-tag text="溯源" type="gray" size="small" :inverted="true" class="p-tag"></uni-tag>
				        </view>
				        <view class="m-product-price1">
				            <view class="money">
				                <block v-if="item.item_sale_price">
				                    <label>{{__('￥')}}</label>{{number_format(item.item_sale_price, 2)}}
				                </block>
						
								<block v-if="item.product_unit_points">
									<label style="margin: 0rpx 10rpx;">+</label>{{number_format(item.product_unit_points)}} <label>{{__('积分')}}</label>
								</block>
						
								<block v-if="item.product_unit_sp">
				                    <label style="margin: 0rpx 10rpx;">+</label>{{item.product_unit_sp}} <label>{{__('众宝')}}</label>
								</block>
				            </view>
				            <view class="num" v-if="(item.SaleNum>0)">
				                <text>{{__('已售')}} </text> <label style="color:#db384c;margin-left: 2px;">{{item.SaleNum}}</label>
				            </view>
							<view :class="'c'+1" v-if="false">
							</view>
				        </view>
				    </view>
					<view class="u-del" :data-id="(item.item_id)" @touchstart.stop.prevent @touchmove.stop.prevent @touchend.stop.prevent="cancelBrowser" @click.stop="cancelBrowser">
					    {{__('删除足迹')}}
					</view>
				</navigator>	
		    </view>
		</view>
		
        <view class="m-loading-box">
            <block v-if="(ispage)">
                <view class="u-loadmore">
                    <label class="u-loading"></label>
                    <text class="u-loadmore-tips">{{__('正在加载')}}</text>
                </view>
            </block>
            <block v-else>
                <view class="u-loadmore u-loadmore-line">
                    <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
                </view>
            </block>
        </view>
    </scroll-view>
    <view class="m-nullpage" v-else>
        <view class="m-nullpage-middle">
            <view class="m-null-tip">
                <text>{{__('暂无您的浏览记录')}}</text>
				<label>{{__('可以去看看哪些想要买的')}}</label>
					<navigator url="/pagesub/product/list" hover-class="none" style="margin-top:20rpx;">
						<label class="goguan">{{__('随便逛逛')}}</label>
					</navigator>
            </view>

        </view>
    </view>
</template>

<script>

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                tracks_rows: [],
                page: 1,
                ispage: false,
				X_Start: 0,
				X_End: 0,
				T_Id: 0,
                flag: false,
				isdata:false,
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad(options) {
            uni.setNavigationBarTitle({
                title:this.__('我的足迹')
            });
            var that = this;
			that.getUserTracks();
        },

		onShow: function(opt) {
			let that = this;

		},
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

            getUserTracks: function () {
                let that = this;
                var params = {page: this.page,activity_id: -1};

                that.$.request({
                    url: this.Config.URL.user.listBrowser,
                    data: params,
                    success: function (data, status, msg, code) {
							//console.log(data)
							if(status == 200 && data.length >0 ){
								that.setData({
									tracks_rows:that.tracks_rows.concat(data),
									isdata:true
								})
							}else{
								that.setData({
									flag:false
								})
							}
                    }
                });
            },
			
			cancelBrowser: function (obj) {
			
			    var that = this;
			    //console.info('ssss');
			    that.$.showModal({
			        title: "提示",
			        content: "确认要删除吗？",
			        showCancel: true,
			        success: function (n) {
			
			            if (n.confirm) {
			
			                var params = {
			                    item_id: obj.currentTarget.dataset.id
			                };
			
			                that.$.request({
			                    url: that.Config.URL.user.removeBrowser,
			                    data: params,
								method:"POST", 
			                    success: function (data, status, msg, code) {
			                        if (status == 200) {
			                            
			                            that.$.alert("已删除足迹！");
			                        }
			                        that.setData({
			                            tracks_rows: [], page: 1
			                        });
			                        that.getUserTracks()
			                    }
			                });
			            }
			        }
			    })
			},


			Clearingtracks: function(){
				 let that = this;
				 var params = {};
				 that.$.request({
				     url: this.Config.URL.user.removeBrowser,
				     data: params,
				     success: function (data, status, msg, code) {
				 			if(status == 200){
				 				that.setData({
									tracks_rows:[],
				 					isdata:false
				 				})
				 			}
				     }
				 });

			},
			
			removestart: function (e) {
			    this.setData({
			        X_Start: e.touches[0].pageX
			    })
			},
			removeload: function (e) {
			    this.setData({
			        X_End: e.touches[0].pageX
			    })
			},
			removeend: function (e) {
			
			    this.setData({X_End: e.mp.changedTouches[0].pageX});
			    /*
			    this.setData({
			        X_End: e.touches[0].pageX
			    });
			    */
			    this.direction(e.currentTarget.dataset.id)
			},
			direction: function (e) {
			    var t = {xstart: this.X_Start, xend: this.X_End};
			    if (t.xstart > t.xend) {
			        if (t.xstart - t.xend > 100) {
			            this.setData({
			                T_Id: e
			            })
			        }
			    } else {
			        this.setData({
			            T_Id: 0
			        })
			    }
			},

            scrollbottom: function (a) {
                    var e = this;
                    if(e.flag){
						var t = setTimeout(function () {
						    e.setData({page: parseInt(e.page) + 1}), e.getUserTracks()
						}, 500)
					}
            }
        }
    }
</script>

<style lang="scss">
@import "../../styles/_variables";

/* */
.product-list {
  position: relative;
  z-index: 1;
  &:hover {
    z-index: 2;
  }
  .flag {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
    width: 64px;
    height: 20px;
    margin-left: -32px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    color: #fff;
  }
  .flag-reduction {
    background-color: #e50dbb;
    z-index: 8;
  }

  .flag-saleoff {
    background-color: #e53935;
    z-index: 7;
  }

  .flag-postfree {
    background-color: #ffac13;
    z-index: 6;
  }

  .flag-bargain {
    background-color: #ffac13;
    z-index: 4;
  }

  .flag-gift {
    background-color: #2196f3;
    z-index: 3;
  }

  .flag-new {
    background-color: #83c44e;
    z-index: 5;
  }

  .flag-selfsupport {
    background-color: #f44336;
    z-index: 10;

    position: absolute;

    top: 1px;
    right: 5px;
    left: auto;
    width: 40px;
  }
}

.placeholder-class{
	font-size: 25rpx;
}

.button{
	line-height: 2;
	font-size: 34rpx;
}

.uni-common-mt{
	margin-top: 20rpx;
}


.u-pa {
    position: inherit!important;
}

.u-pa .m-product-list
{
	padding:0rpx;
}

.u-pa .m-tab{
	position: relative;
}
.u-del{
	width: 260rpx;
	background-color: $default-skin-bg;
	float: right;
	height: 100%;
	color: #fff;
	font-size: 28rpx;
	text-align: center;
	line-height: 212rpx;
	}
@-webkit-keyframes mdel {
        0% {left: 0;}
        100% {left: -150rpx;}
    }
@keyframes mdel {
        0% {left: 0;}
        100% {left: -150rpx}
    }
.m-product-item{position: relative;overflow: hidden}
.m-item-c{position: absolute;width: 900rpx;}
.del{-webkit-animation: mdel .2s  1;animation: mdel .2s  1;left: -150rpx;}


</style>
