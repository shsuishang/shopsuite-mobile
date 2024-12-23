<template>
    <view>
		<!-- 商品分类 -->
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeDrawer()" >
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="onecategorys">
						{{__('一级分类')}}
					</view>
					<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']">
						{{__('二级分类')}}
					</view>
					<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']">
						{{__('三级分类')}}
					</view>
				</view>
			</view>
			<scroll-view scroll-y="true" style="height: 100%">
				<view class="m-cells" style="padding:20rpx 20rpx;" v-for="(category,ii) in categorys" :key="ii">
					<view class="m-cell m-cell-access m-info-sp" :data-category_id="category.category_id" :data-category_name="category.category_name"  @click="getCate">
						<view class="m-cell-bd">
							<view  class="m-order-title">
								<label class="m-ber-n">{{category.category_name}}</label>
								<label>
									<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
								</label>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</uni-drawer>
    </view>
</template>


<script>
import uniDrawer from '@/components/uni-drawer.vue';
import { mapState, mapMutations } from 'vuex';

export default {
		props: {
			rightDrawerVisible: {
				type: Boolean,
				default: false
			}
		},
    data() {
        return {
			index:0,
			tapindex: 1,
			deep:0,
			categorys:[]
        };
    },

    components: {
        uniDrawer
    },
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    created() {
        var that = this;

        this.GetPlist(function() {
            that.pdlist.length == 0 ? that.setData({ isdata: false }) : that.setData({ isdata: true });
        });
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		onecategorys: function(){
			this.setData({
				deep:1,
				category_id:0,
				tapindex:1
			})
			this.getcategorys()
		},
		getCate: function(e){
			var that = this;
			switch (that.tapindex) {
				case 1:
					that.setData({
						deep:that.tapindex,
						category_id:e.currentTarget.dataset.category_id,
						onecategory:e.currentTarget.dataset.category_name,
						tapindex:2
					})
					that.getcategorys()
					break;
				case 2:
					that.setData({
						deep:that.tapindex,
						category_id:e.currentTarget.dataset.category_id,
						twocategory:e.currentTarget.dataset.category_name,
						tapindex:3
					})
					that.getcategorys()
					break;
				case 3:
					that.setData({
						threecategory:e.currentTarget.dataset.category_name,
						category_id:e.currentTarget.dataset.category_id,
						tapindex:1,
						deep:1,
						rightDrawerVisible:false
					})
					that.commodity_name = that.onecategory + '>' + that.twocategory + '>' + that.threecategory
					break;
			}
		},

		getcategorys: function(e){
			var that = this;
			var	params = {
				deep:that.deep
			};

			if(that.category_id !== 0){
				params.category_id= that.category_id

			}
			that.$.request({
				url: that.Config.URL.product.category,
				data: params,
				success: function(data, status, msg, code) {
					if(status ==  200){
						that.setData({
							categorys:data.items
						})
					}
				}
			})
		}
	}
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables.scss';

/*全部商品 start*/
.m-navbar-item {
    padding: 20rpx 0;
    font-size: 28rpx;
    i {
        font-size: 0rpx;
        line-height: 0;
        vertical-align: middle;
        display: inline-block;
        width: 0rpx;
        height: 0rpx;
        margin-left: 9.375rpx;
        border-width: 9.375rpx;
        border-color: #aaa transparent transparent transparent;
        border-style: solid dashed dashed dashed;
    }
}
.m-navbar-item:after {
    border: none;
}
.m-navbar-item.m-navbar-item-on {
    background-color: #fff;
    color: $default-skin-bg;
    i {
        border-color: $default-skin-bg transparent transparent;
    }
}
.m-navbar-item.m-navbar-item-on::before {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 6rpx;
    border-bottom: 6rpx solid $default-skin-bg;
    color: #cccccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 3;
}
.m-sort {
    position: relative;
}
.m-sort image {
    width: 24rpx;
    height: 24rpx;
    position: absolute;
    /*top: 50%;*/
    margin-top: 10rpx;
    margin-left: 2rpx;
}
/*全部商品 end*/
.m-product-price1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.num {
    font-size: 24rpx;
    color: #717171;
    padding-right: 20rpx;
    /*margin-left:260rpx; */
}

.u-pa .m-tab {
    top: var(--window-top);
}
.u-pa .m-tab-top {
    top: 0;
}

.filter-box {
    top: var(--window-top);
}

.filter-box-top {
    top: 0;
}

.tag-view {
    margin: 10rpx 20rpx;
    display: inline-block;
}

.uni-numbox-value {
    border: 2rpx solid #cccccc;
    background-color: #ffffff;
    width: 150rpx;
	height: 48rpx;
    text-align: center;
    display: inline-block;
}
.uni-dot {
    width: 30rpx;
    height: 100%;
    text-align: center;
    display: inline-block;
    line-height: 44rpx;
    height: 44rpx;
}

.uni-padding-wrap {
    overflow: hidden;
    max-width: 400rpx;
}




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
	padding-top:0rpx;
}

.u-pa .m-tab{
	position: relative;
}
</style>
