import Config from '../config/config'
import StateCode from '../config/statecode'
import $ from '../helpers/util'
import Lang from '../config/lang'


export default {

	onLikeStore: function(store_id, callback) {
		var that = this
		var params = {
			store_id: store_id,
		};

		$.request({
			url: Config.URL.user.wish_store_add,
			data: params,
			success: function(data, status, msg, code) {
				if (status == 200) {
					$.alert(Lang.__("已关注！"))
					callback && callback(true)
				}
				else
				{
					$.alert(msg)
					callback && callback(false)
				}
			}
		})

		return true;
	},

	onUnlikeStore: function(store_id, callback) {
		var that = this
		var params = {
			store_id: store_id,
		};

		$.request({
			url: Config.URL.user.wish_store_remove,
			data: params,
			success: function(data, status, msg, code) {
				if (status == 200) {
					$.alert(Lang.__("已取消关注！"))
					callback && callback(true)
				}
				else
				{
					$.alert(msg)
					callback && callback(false)
				}
			}
		})
	},
}
