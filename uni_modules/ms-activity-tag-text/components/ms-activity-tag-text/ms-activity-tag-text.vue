<template>
  <view class="type-name-box" v-if="tagNameMap[typeId]!='undefined'">
    {{ tagNameMap[typeId] }}
  </view>
</template>


<script>

/*
{
  "1101":"加价购",
  "1102":"满赠",
  "1103":"显示折扣",
  "1104":"优惠套装",
  "1105":"优惠券",
  "1106":"砸金蛋",
  "1107":"满减",
  "1140":"折上折",
  "1131":"市场活动",
  "1132":"组合套餐",
  "1121":"幸运大抽奖",
  "1122":"秒杀",
  "1123":"拼团",
  "1124":"砍价",
  "1125":"一元购",
  "1135":"阶梯价",
  "1133":"多件折",
}
*/

export default {
  name: "MsActivityTagText",
  data() {
    return {
      tagList: {
        "1101": "tag-info",
        "1102": "tag-info",
        "1103": "tag-info",
        "1104": "tag-info",
        "1105": "tag-info",
        "1106": "tag-info",
        "1107": "tag-info",
        "1140": "tag-info",
        "1131": "tag-info",
        "1132": "tag-info",
        "1121": "tag-info",
        "1122": "tag-info",
        "1123": "tag-info",
        "1124": "tag-info",
        "1125": "tag-info",
        "1135": "tag-info",
        "1133": "tag-info"
      },
      tagNameMap: {}
    }
  },
  props: {
    typeId: {
      type: [String, Number],
      default:
          0
    }
  },
  mounted() {
    this.tagNameMap = {
      "1101": this.__('加价购'),
      "1102": this.__('满赠'),
      "1103": this.__('限时折扣'),
      "1104": this.__('优惠套装'),
      "1105": this.__('优惠券'),
      "1106": this.__('砸金蛋'),
      "1107": this.__('满减'),
      "1140": this.__('折上折'),
      "1131": this.__('市场活动'),
      "1132": this.__('组合套餐'),
      "1121": this.__('幸运大抽奖'),
      "1122": this.__('秒杀'),
      "1123": this.__('拼团'),
      "1124": this.__('砍价'),
      "1125": this.__('一元购'),
      "1135": this.__('阶梯价'),
      "1133": this.__('多件折')
    }
  },
  methods: {
    onSearch() {
      this.$emi__('click', {})
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../../../../styles/variables";

.type-name-box {
  display: inline;
}

</style>

