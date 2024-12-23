<template>
	<view class="page">
    <view class="container">

      <view class="headerBox">
        <scroll-view scroll-x class="scrollBox" :scroll-into-view="scrollId" scroll-with-animation="true">
          <view class="box">
            <view class="item" v-for="(item,index) in category" :key="index" @click="change(item.category_id,index)" :class="current==index?'current':''">
              <view>{{item.category_name}}</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="main">
<!--        <view class="searchBox">
          <uni-icons type="search" color="#aaa" size="16"/>
          <input type="text" v-model="keyword" maxlength="20" placeholder="搜索" @input="input">
        </view>-->

        <view class="content" v-for="(item,index) in list" :key="index" @click="jump('/pagesub/article/detail?id='+item.article_id)">
          {{item.article_title}}
          <uni-icons type="arrowthinright" color="#999" size="14"/>
        </view>
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
		data: function() {
			return {
        keyword:'',
        list:[],
        category:[],
        current:0,
        category_id:'',

				isdata: false,
				page: 1,
				size: 10,
				ispage: false,
				flag: true,
				Info: [],
				windowHeight: 0,
				categoryId: 0,
				Title: "",
        scrollId:'',
        time:''
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.__('帮助中心')
			});

			let that = this;
			this.setData({
				categoryId: options.category_id || options.cid
			});

			try {
				var t = that.$.getSystemInfoSync();
				this.setData({
					windowHeight: t.windowHeight
				})
			} catch (n) {
				//console.log(" Do something when catch error")
			}

      this.getArticleCategory();

		},

		methods: {
			...mapMutations([
				'login', 
				'logout', 
				'getPlantformInfo', 
				'forceUserInfo', 
				'getUserInfo'
			]),
      change:function (id,index){
        this.current = index;
        this.categoryId = id;
        this.getArticleList();
      },

      //todo 获取文章分类
      getArticleCategory: function () {
        var that = this;
        var params = {
          category_id: this.categoryId || 0,
        };

        that.$.request({
          url: this.Config.URL.cms.category,
          data: params,
          dataType: 'json',
          ajaxCache: {
            timeout: this.Config.CACHE_EXPIRE
          },
          success: function (data, status, msg, code) {
            that.category = data.items;
            that.setData({
              Title: data.items[0]
            });

            that.categoryId = that.category[0].category_id;
            that.getArticleList();

            that.$.setNavigationBarTitle({
              title: that.Title.category_name || that.__('帮助中心')
            })
          }
        });
      },

      getArticleList: function () {
        var params = {
          page: this.page,
          size: 10,
          sidx: 'article_id',
          sord: 'DESC',
          category_id: this.categoryId || 0
        };

        var that = this;
        that.$.request({
          url: this.Config.URL.cms.lists,
          data: params,
          dataType: 'json',
          ajaxCache: {
            timeout: this.Config.CACHE_EXPIRE
          },
          success: function (data, status, msg, code) {

            if (status == 200) {
              that.list = data.items
            }
            if (status == 200 && data.items.length > 0) {
              for (var r = 0; r < data.items.length; r++) {
                //data.items[r]['article_add_time'] = that.$.formatDateFormatter(data.items[r]['article_add_time'], 'yyyy-MM-dd hh:mm:ss')
              }
              that.setData({
                isdata: true
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
                ispage: false
              });
            }
          }
        });
      },
      scrollbottom: function () {
        if (this.flag) {
          var e = this;
          e.setData({
            flag: false
          });
          clearTimeout(t);
          var t = setTimeout(function () {
            e.setData({
              page: e.page + 1,
              flag: false
            }), e.getArticleList();
          }, 500)
        }
      },
      jump: function (url) {
        this.$.gopage(url)
      }
		}
	}
</script>



<style lang="scss">
.container{
  /*padding: 20rpx 0 0 0;*/
  .headerBox{
   /* background-color:#392d2d;*/
    .scrollBox{
     /* padding: 0 20rpx;*/
      padding:10rpx 0;
      position: fixed;
      box-sizing: border-box;
      display: flex;
      top: 86rpx;
	  /* #ifdef MP-WEIXIN */
	  top:0;
	  /* #endif */
      z-index: 50;
      background-color: #FFFFFF;
      .box{
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        .item{
          min-width: 140rpx;
          font-size: 28rpx;
          color: #333;
          text-align: center;
          height: 76rpx;
          line-height: 76rpx;
        }
        .current{
          color: #e64340 !important;
          font-weight: 700;
        }
      }
    }
  }
  .main{
    background-color: #fff;
    padding: 33rpx 36rpx;
    background-color: #fff;
    margin-top: 116rpx;
    .searchBox{
      height: 74rpx;
      background: #FFFFFF;
      box-shadow: 0 4rpx 33rpx 0 rgba(0,0,0,0.08);
      border-radius: 7rpx;
      border: 1rpx solid rgba(0, 0, 0, 0.07);
      display: flex;
      align-items: center;
      padding: 0 33rpx;
      input{
        font-size: 26rpx;
        margin: 0 0 0 10rpx;
      }
    }
    .title{
      font-size: 25rpx;
      font-weight: bold;
      margin: 47rpx 10rpx 45rpx;
    }
    .content{
      margin: 0 10rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28rpx;
      height: 76rpx;
      border-bottom: 1rpx solid #e5e5e5;
    }
    .content:last-child{
      border: none;
    }
  }
}
</style>