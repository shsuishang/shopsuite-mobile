<template>
  <view class="canvas-img-code">
    <canvas v-if="verifyKey==''" :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas"
            @error="canvasIdErrorCallback"></canvas>
    <image v-if="verifyKey!=''" :src="url" :style="{width:width+'px',height:height+'px'}"></image>
  </view>
</template>

<script>
import {mapState} from 'vuex';

export default {
  props: {
    verifyKey: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      width: 75,
      height: 45,
      url: ""
    }
  },
  computed: mapState([
    'Config'
  ]),
  watch: {
    verifyKey(val) {
      this.url = this.Config.URL.verifyCode + '?verify_key=' + val
    },
  },
  mounted: function () {
    this.url = `${this.Config.URL.verifyCode}?verify_key=${this.verifyKey}&timestamp=${new Date().getTime()}&bg=#f8f8f8`
  },
  methods: {
    init: function () {
      this.url = `${this.Config.URL.verifyCode}?verify_key=${this.verifyKey}&timestamp=${new Date().getTime()}&bg=#f8f8f8`

      //console.log('start');
      var context = uni.createCanvasContext('imgcanvas', this), w = this.width, h = this.height;
      context.setFillStyle("#f8f8f8");
      context.setLineWidth(5);
      context.fillRect(0, 0, w, h);
      var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          str = '';
      for (var i = 0; i < 4; i++) {
        var c = pool[this.rn(0, pool.length)];//随机的字
        var deg = this.rn(-30, 30);//字体的旋转角度
        context.setFontSize(18);
        context.setTextBaseline("top");
        context.setFillStyle(this.rc(80, 150));
        context.save();
        context.translate(18 * i + 15, parseInt(h / 1.5));
        context.rotate(deg * Math.PI / 180);
        context.fillText(c, -15 + 5, -15);
        context.restore();
        str += c;
      }

      uni.setStorage({
        key: 'imgcode',
        data: str,
      });

      for (var i = 0; i < 40; i++) {
        context.beginPath();
        context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
        context.closePath();
        context.setFillStyle(this.rc(150, 200));
        context.fill();
      }

      context.draw();
      //console.log('end');
    },
    rc: function (min, max) {
      var r = this.rn(min, max);
      var g = this.rn(min, max);
      var b = this.rn(min, max);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    rn: function (max, min) {
      return parseInt(Math.random() * (max - min)) + min;
    },
    refresh: function () {
      this.init();
    },
    canvasIdErrorCallback: function (e) {
      console.error(e.detail.errMsg)
    }
  }
}
</script>

<style lang="scss">
.canvas-img-code {
  display: inline-block;
  background-color: #f8f8f8;
  height: 45px;
}
</style>
