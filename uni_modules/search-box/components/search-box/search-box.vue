<template>
  <view class="input-top">
    <view :class="['input-view']">
      <i class="iconfont zc zc-search1"
         style="line-height: 68rpx;"/>
      <input confirm-type="search" class="input" type="text" :placeholder="__('输入商品名')" @click="onSearch">
      <view class="input-view-right"  @click="onSearch">
        {{ __('搜索') }}
      </view>
    </view>
  </view>
</template>


<script>

export default {
  name: "SearchBox",

  props: {
    backgroundColor: {
      type: String,
      default: '#f7f7f7'
    }
  },
  methods: {
    onSearch() {
      this.$emit('click', {
      })
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../../../../styles/variables";

.zc-search1{
  color: $default-skin-bg;
  margin-left: 10rpx;
  line-height: 66rpx;
}

// 搜索
.input-view {
  display: flex;

  // #ifdef MP-WEIXIN || MP-ALIPAY
  width: 510rpx;
  // #endif

  height: 64rpx;
  border-radius: 34rpx;
  border: 2rpx solid $default-skin-bg;
  margin-left: 24rpx;
  margin-right: 24rpx;

  button {
    width: 108rpx;
    height: 60rpx;
    background: $default-skin-bg;
    border-radius: 29rpx;
  }
}

.uni-input-input {
  line-height: 32rpx;
}

.input{
  height: 66rpx;
  margin-left: 20rpx;
  flex:1;
}

// 右侧搜索按钮
.input-view-right {
  width: 108rpx;
  height: 58rpx;
  line-height: 58rpx;
  padding-top: 2rpx;
  background: $default-skin-bg;
  border-radius: 29rpx;
  font-size: 28rpx;
  text-align: center;


  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  margin: 2rpx 4rpx;
  margin-bottom: 2rpx;
}

// 左侧搜索框
.inco {
  width: 36rpx;
  height: 37rpx;
  color: $default-skin-bg;
  padding: 0rpx 16rpx 22rpx 16rpx;
}

.input-top {
  background-color: #fff;
  /* #ifdef H5 */
  padding-top: 32rpx;
  /* #endif */
  /* #ifndef H5 */
  padding-top: 0rpx;
  /* #endif */

}

.m-product-item {
  background-color: #fff;
}
</style>

