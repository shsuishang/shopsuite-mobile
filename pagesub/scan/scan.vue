<template>
    <view>
        <web-view :src="url" @message="handleMessage"></web-view>
    </view>
</template>


<script>

    // #ifdef H5
    window.scan_code = null;
    // #endif

    // #ifndef H5
    var scan_code = null;
    // #endif

	import {
		mapState,
		mapMutations
	} from 'vuex'


    export default {
		data() {
			return {
				cTimer: null,
				url: 'about:blank'
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('扫描')
            });

            var _this = this;
			//let url = _this.Config.fileBasePath + '/h5/hybrid/html/scanbox.html'
      let url = '/hybrid/html/scanbox.html'

			this.setData({url:url})


			if (_this.cTimer == null) {
				_this.cTimer = setInterval(function() {
					if (scan_code)
					{
						_this.notice.postNotificationName("ScanCode", scan_code)
						clearInterval(_this.cTimer);
						_this.cTimer = null;

						scan_code = null;

						uni.navigateBack();
					}
				}, 1000)
			}
		},
		onUnload: function() {
            //移除通知
            // 离开页面，注销事件
            var that = this
            this.notice.removeNotification("ScanCode", that);
        },
        methods: {
            handleMessage(evt) {
                //console.log('接收到的消息：' + JSON.stringify(evt.detail.data));
				this.notice.postNotificationName("ScanCode", evt.detail.data)
            }
        }
    }
</script>

<style lang="scss">
	@import "../../styles/_variables";
</style>
