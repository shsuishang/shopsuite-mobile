<template>
  <view class="page">
    <uni-nav-bar class="top-nav" :border="false" leftWidth="40rpx" rightWidth="0rpx" height="68rpx" :statusBar="true"
                 @clickLeft="back" style="position: relative;">
      <block slot="left">
        <image style="width: 11px;height: 18px;vertical-align:middle;margin-left: 6px;" lazy-load
               src="data:image/png;base64,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"/>
      </block>

      <view class="input-view">
        <i class="iconfont zc zc-search1"
           style="line-height: 66rpx;"/>
        <uni-easyinput
            prefixIconColor="#A76E38"
            :inputBorder="false"
            :autoHeight="true"
            :styles="styles"
            :value="searchText"
            :placeholder="placeholder"
            @clear="clearSearch"
            @change="searchStart"
        ></uni-easyinput>
      </view>
      <block slot="right"></block>
    </uni-nav-bar>
  </view>
</template>

<script>
export default {
  props: {
    searchText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keywords:"",
      styles: {
        color: '#000000',
        borderColor: '#A76E38',
        borderRadius: '34rpx',
        height: '64rpx'
      },
      placeholderStyle: {
        color: '#000000'
      }
    };
  },

  created() {
    this.keywords = this.searchText
  },
  methods: {
    searchStart: function (val) {
      //触发搜索
      let _this = this;

      _this.$emit('change', val);
      /*
      if (_this.searchText == '') {
        uni.showToast({
          title: _this.__('请输入关键字'),
          icon: 'none',
          duration: 1000
        });
      } else {
        _this.$emit('change', _this.searchText);
      }
       */
    },
    clearSearch: function () {
      let _this = this;
      _this.$emit('change', "");
    },

    back: function () {
      if (getCurrentPages().length > 1) {
        this.$.navigateBack(1, function () {
        });
      } else {
        //回到首页
        this.$.gopage("/pages/index/index")
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.page{
  position: fixed;
  top: 0;
  z-index: 6;
  background: #fff;
  width: 100%;
}

.zc-search1{
  color: $default-skin-bg;
  margin-left: 10rpx;
  line-height: 66rpx;
}

// 搜索
.input-view {
  display: flex;

  width: 100%;

  // #ifdef MP-WEIXIN || MP-ALIPAY
  width: 420rpx;
  // #endif

  height: 62rpx;
  border-radius: 34rpx;
  border: 2rpx solid $default-skin-bg;
  margin-left: 24rpx;
  margin-right: 24rpx;

  button {
    width: 108rpx;
    height: 58rpx;
    background: $default-skin-bg;
    border-radius: 29rpx;
  }
}

.top-nav {
  background-color: #fff;
  height: 44px;
  line-height: 44px;
}
</style>
