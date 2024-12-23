import api from '@/components/xuan-linkAddress/api.js';

export default {
	/*
	*_this:全局this
	* data:数据(参数)
	* callback:回掉
	*/
	get_linkAddress: function(_this,tag,data,callback) {
		//请求
		api.get_linkAddress_api(data).then((res) => {
			let revert=res.data.data;
			console.log(revert)
			if(res.data.code==1){
				if(tag==="province"){
					console.log("province")
					_this.linkAddress_area[0].info=revert;
					callback(true);//回掉
				}
				if(tag==="city"){
					console.log("city")
					_this.linkAddress_area[1].info=revert;
					callback(true);//回掉
				}
				if(tag==="district"){
					console.log("district")
					_this.linkAddress_area[2].info=revert;
					callback(true);//回掉
				}
			}
		});
	}
}
