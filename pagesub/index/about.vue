<template>
  <view class="body">
    <view class="header member-top">
      <view class="header-top hide">
        <image
            :src="plantformInfo.site_pc_logo || 'https://www.suteshop.com/site/static/src/default/images/landing/bbc.jpg'"></image>
      </view>
      <view class="header-bottom">
        <text>{{ plantformInfo.site_name }}</text>
      </view>
      <view class="logo">
        <image :src="plantformInfo.site_mobile_logo"></image>
      </view>
    </view>
    <view style="padding: 10px;">
      <view class="introduce">
        <!--<view class="title">店铺介绍</view>-->
        <view class="text">{{ plantformInfo.site_meta_description || "" }}</view>
      </view>
      <view class="message">
        <view class="peoplename aboutUs">
          <view>{{ __('公司名称') }}：</view>
          <label>{{ plantformInfo.site_company_name }}</label>
        </view>
        <view class="tel aboutUs" bindtap="call">
          <view>{{ __('联系方式') }}：</view>
          <image src="https://static.shopsuite.cn/xcxfile/appicon/images/call.png"
                 style="width:30rpx;height:30rpx;margin-right:10rpx"></image>
          <label
              style="color:#17abe3">{{ plantformInfo.site_tel }}</label>
        </view>
        <view class="address aboutUs">
          <view>{{ __('公司地址') }}：</view>
          <label>{{ plantformInfo.site_address }}</label>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
import {mapMutations, mapState} from 'vuex';

export default {
  data() {
    return {};
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
  async onLoad(options) {
    await this.$onLaunched;
    let that = this;

    uni.setNavigationBarTitle({
      title: this.__('关于我们')
    });

    this.getPlantformInfo(function (plantformInfo) {
    });
  },
  onNavigationBarButtonTap(e) {
    var that = this;

    if (e.index === 0) {
      that.onShareBox();
      /*
  that.setData({
    shareBoxFlag: 1,
    shareContetnFlag: 1
  })
  */
    } else {
      uni.showToast({
        title: '你点了收藏按钮',
        icon: 'none'
      });
    }
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    call: function () {
      this.$.makePhoneCall({
        phoneNumber: this.data.plantformInfo.LegalNumber
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/_variables.scss';

.body {
  background: #f8f8f8;
}

.header {
  width: 100%;
  height: 400rpx;
  background: #ffffff;
  border-bottom: 2rpx solid #d9d9d9;
}

.header-top {
  width: 100%;
  height: 250rpx;
}

.header-top image {
  width: 100%;
  height: 250rpx;
}

.header-bottom {
  height: 150rpx;
  display: flex;
  justify-content: center;
  font-size: 32rpx;
  color: #000;
}

.header-bottom text {
  margin-top: 90rpx;
}

.logo {
  width: 150rpx;
  height: 150rpx;
  position: absolute;
  top: 180rpx;
  left: 300rpx;
}

.logo image {
  width: 100%;
  height: 150rpx;
}

.introduce {
  background: #ffffff;
  margin-top: 30rpx;
  padding: 20rpx;
}

.introduce .title {
  font-size: 28rpx;
  color: #000;
}

.introduce .text {
  font-size: 28rpx;
  color: #717171;
  margin-top: 10rpx;
}

.message {
  background: #ffffff;
  padding: 20rpx 20rpx 0 20rpx;
  margin-top: 30rpx;
}

.message .title {
  padding-bottom: 20rpx;
  font-size: 28rpx;
  color: #000;
}

.message .aboutUs {
  font-size: 28rpx;
  padding: 20rpx 0;
  color: #333;
  display: flex;
}

.message .aboutUs view {
  width: 160rpx;
}

.message .aboutUs label {
  color: #717171;
  flex:1;
}


.member-top {
  -webkit-animation: changeBg 20s infinite;
  animation: changeBg 20s infinite;
  background-color: #ff6700;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZ4AAADhBAMAAAAKUc6cAAAAD1BMVEX///////9MaXH////////RWIOUAAAABXRSTlMiEQAzRBQVqpYAAAlZSURBVHhezNpRkpswDAZged0DyOQCDSdwxnuAzmzuf6aGJuEvGEsWIpvVSx8AO59/YWCnNN7qNy1qvFfqqFGu9LIq96p+OE3TMi1qGG91TskLqsdgCvd/iMIhnrzpoWV96ByUJR6a6p+GvKK4EVB4eM6VBxwXqEpnWR7PqdSgj4bnAo4HtB6FqjrCk1eeejsoF+N93OEBJ+ZDQFzqgIZNTyyXZKuho914Hh0eF6jUAY1bnlhKTseAtpptfQu7Gw7jhU1P2eFJWrshHszvDIirgAZ4Fhz0W38pHnDg8QZU1gGNG5640zOI7Ybh62fgAQ2X592t2q8LPG7QxnMH02sBMY52BjTOnnG5fmVXDwjthuHhkQOqjusBfWx5CjzugM6NeEpRPLhAySgioGlzg4eX86Vd1fSQ7AkCRwEhIBpmDzaEhzenfdXwsOYROAqIZ8/EgeeM6bAdeDuu/n1x00MaR2+5ezrwjPz/dGlvae2me8DRQRh+Wkl45oYraDd/QIhH9QThJRxosdaekTBbaD4NVJAYDxZM8BDtAg1rz2/p7sES9weUDB612/QXo7Vn5Pbmxt2jpjoe1j0kxYOyeUZucSzLNAjxqB7g7QENlWdkKpnkdHRQj4eaHiJ3QFS1SM2xrxPazeJhIndA8KTNMq7TUL2KGjyklMlzFjjGjjsnyZNpXYjHERA8QjxsH/c8jNX1igd2f0AkxmMZV7++0W4Euysg3cPyuHrx2zyGeAyeVHtyy0N0RMORIR6Uw0N1YTJXQEaPv+Ei4qk9dJDH0m6o3R4SPf6GI0s8/obLrUXnN3jcDYd4BI+v4cjQbu4dLpLebs53OJIfpv6G0xfeEA/Rfg/7PX0rj5OcnvT0JLsnHAYKlngovN0DUOBXedBwpN4+fg/+PCS025s9lIyg1pjB4FHnvXuSw2OrjdeEB7dcv/IhnlY8/ALP+qsbD9PP662y2zNMnvRdHp49AN2d8TrV1yGes+yx35gkxQNPwShTPAjI4Uk3TzrWw81jvPLMJ/IUDwJybazw+j24TIgnwvM8kX9dH/XzPMLBFSdjt/58evKLPKSU1lMk7wbw0M/2sHCU7/Gg4Lk+688P8+Cw/PBBQMHuCfxdHuEw4kEZPahv8nBjThwslYde7cHk2eqhfg8azrAfOD3FOCaLXrTbmzyxiKM348mP6zQPbiD6hfeDV+ZTTGMynv8tT2l4qPv2id/uITwq6xFXle8e7n4fjSXbPVjNbPHMUy4DiiWLHsL3gh7PvAR7PFEKKIgerGK8Lf1F9VBU7x78Iocn93t44ZlPKdO66x6ikkmtstvD8Jhvn6meZp48X0HziOX3YHqv5zR5rpqH+zjxdZ6QpH5Dw50+J89F9HQHhCusHtxAHg8d64leD7U9qcsTJo/SbwEXv86D+V0eTjxxvkLr/cDkwRV7PbEU+8fCwpOmfP7I72+dDRcdHjScEI/kmd2nKZ4f44luT6JCyvdCZ8Phil0epvZTO0ieuPDo33M6yO9BQFo8KEyMbbHv7wfweNsNHv//DsHM8IgfdHkx1hs9/eeLf69ansG+dtM9SeXoniA0XF4N1uEhu0cPKBj8IayHA2g9mLPddE+ycRILHgwHTrUBap5s9ugB2fyB6uHAWY2menCF2YMZQurlJJY9Cb8NYfd65nj+cndvuY3DMBRAL+ENkO0K7BWM0f3vbYCZD6KoI4rio2r57xgnV46lKGaWPbrXxrNf7vPYw+Ow2fAg7BEG9FQgMWvoEeNanPFIyCMg8ZUrAceWoA63kEdsz9g00nq2Nf5z4h67XPtaxpp94IG+XL9HJoYULew70Xd5WD3GDmvyj1IgtSBjR98HomIPAAskzjLiKfX8m1ONPSSJIIp77JY+98BDCx4OxSPxBh6DN5qYJArSOSTVet6tx9eZSUgSQCSinAXP3HA99Hnv7Hr8wawseqBFU/1VMgTWbZchax6eXo1meuwf0tGaB/B7SDYqDDnAj/bgd3nwezz+TiTqkU09cHlkdw8eK+l+2u9hp0fnO3t6/FP0+HDjIz1eWPFYAd3hno5U4YHTo+u5eI/XAg8vrQgZlNFC9M73BFa4CQ0Q0z2M56rksHoo39Mfz6GeO9vTG48ON+8ngr1zg/Z41KPl0Gi5PVJ8+WiRQ6NFhqc1nnenB0/1wpP7RCb5PfeiBw5P4KtNyvcwLJB6eI7uOGWfB7MeCnCA9OuHMQfCKZLCEWe67PMAcyBcz3Y/p8Lj7xSJ6xTOu3i0ku+njDkQrks4zhH/Sxy++Q4G9cnzEFDKpo3jA+EOeuhzPiIcnRcMTpK0XmAbpB4Rdzj2yaYH3B+JevDFwwGNCFY87FvOwQhIPbFanzAdGk/UgzRPZL1xKCc64KjBM3XXp6S+UZmeeA+YuId+nIe7PIwdAir29AfU4EGjB2keYIsBR9me/oD6PaC+gBI9TRFxh4cxU1QfEKV52kTc66kfeROes80DqgVleTpBvJUHpQFRmacfpJ4rfoLeEVfu6Qb1e0bdBqQMRPJW6TmePVQGItF+xLmeYTsVKQKR5Hj4FeejcCr3/LLaz7vRg5K5tkiWRwZP9A4Cyo2IEj38wgPDk/vYoXrO7IDMbl7Zlezhp3gOvCyq9VwSLSOebs+ZB1IPBrW1R0Ek6sF3eN70/38SCqIeo7tssecs/UKp36MBNS0efoqHN/AEB9y5Vz7BgPTdcAVE1Z5z7fivR2/iuQKcTyDexHMtcbScAdV7zpVL5+nwTTzXSjhPCfEmnmtNo7WD5297d4ycMBAEUdS+gXZusP/+h7SzDWzRBPojoVIXCSTUq54dNhIkUNaszPdB4v369RGqPx+zn3ktD+xXMde7CLqOhzxYZNB2HQ9kTS7oIp48WjnpBPV7crLn+x6etSNP8dS7nsezXdPzeDjRw+PJOer/YB9PLY+7EO7vGR/nGf0eFA839Wztx+c8z7A9/gHyPcieTRm3fg8jFaRwSvdsSj39npke8qWE5fEL8jmlehbI5/ieuQ/ahhRED/8/0uj3paVUzxwrwo5u9zC6g+uZzZwKHreg48UEj1rQ8RWW7iF897EggscsSDhkFTwiqIw1SPCIE2fs9QoeEQQCiODxQMovFcHjgZS7RAWPthTKuUwQPFZF0nWP4BFjiBA87g9wzcARPBqpXpeH4NFMFccR0dM/jYXo6ReB5+kXgeXpNxW7+QGaJMQFymoTmAAAAABJRU5ErkJggg==');
  background-size: cover;
  text-align: center;
  width: 100%;
  /*height: 11rem;*/

  overflow: hidden;
  height: 400rpx; /* 320 */

  color: #fff;
  position: relative;
  z-index: 1;
}

@-webkit-keyframes changeBg {
  0% {
    background-color: #ff6700;
  }

  90% {
    background-color: #ff6700;
  }

  10% {
    background-color: #fb6e52;
  }

  20% {
    background-color: #ffce55;
  }

  30% {
    background-color: #a0d468;
  }

  40% {
    background-color: #48cfae;
  }

  50% {
    background-color: #4fc0e8;
  }

  60% {
    background-color: #5d9cec;
  }

  70% {
    background-color: #ac92ed;
  }

  80% {
    background-color: #ec87bf;
  }
}

@keyframes changeBg {
  0% {
    background-color: #ff6700;
  }

  90% {
    background-color: #ff6700;
  }

  10% {
    background-color: #fb6e52;
  }

  20% {
    background-color: #ffce55;
  }

  30% {
    background-color: #a0d468;
  }

  40% {
    background-color: #48cfae;
  }

  50% {
    background-color: #4fc0e8;
  }

  60% {
    background-color: #5d9cec;
  }

  70% {
    background-color: #ac92ed;
  }

  80% {
    background-color: #ec87bf;
  }
}

</style>
