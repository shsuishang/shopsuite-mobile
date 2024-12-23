
'use strict';

/**
 * 下载图片的模块 
 * @version 1.1.0
 * @author xfl <541151284@qq.com>
 */
class  Downloader{
    Downloader = Downloader;
    
	/**
	 * 开始下载图片
	 * @public
	 * @param {String} url 图片的url
	 * @param {String} [name] 下载后图片的名字
	 * @returns {Promise}  [err, res]
	 * @example
	 * 
	    let promise = downloader.load(url, imgName);  
		promise.then(([err, res])=>{    
			console.log(err, res);  // err 和 res 只会有一个存在，另一个为null  
		});
	 */
    async load(url, name){
		url = url.trim();
		
		name = this.getName(url, name); //重新计算存储的文件名及扩展名
		
		let err, res;
		if( !this.isRemoteUrl(url) ){ 
			// #ifdef APP-PLUS || MP
				[err, res] = [null, {tempFilePath: url}];
			// #endif
		}else{
			//在web端时，downloadFile的作用只是 确定当前的资源和网络，可能会拿到一些下载失败的信息
			[err, res] = await uni.downloadFile({url: url});
			if(err){ //h5下载图片的跨域在这一步就能知道
				return [err, null];
			}else if(res.statusCode !== 200){ //可能是404
				res.errMsg = "downloadFile:fail";
				return [res, null];
			}
		}
        
        // #ifdef H5
		try{
			//如果这里传入 url，则会在另一个窗口打开图片，而不是下载
		    this.webDownloadImg(res.tempFilePath, name);
		}catch(e){
			e.errMsg = e.errMsg || e.message || '';
		    return [e, null];
		}
        // #endif

        // #ifdef MP-ALIPAY
        return [{errMsg: 'plat not support download!'}, null];  //在支付宝小程序中，不支持saveImageToPhotosAlbum，需要使用其它的方式实现下载
        // #endif
        
        // #ifdef APP-PLUS || MP
        [err, res] =  await  uni.saveImageToPhotosAlbum({filePath: res.tempFilePath});
        if( err ){
            return [err, null];
        }
		// #endif
		
		return [null, res];
    }
	
	/**
	 * 计算文件名及扩展名
	 * @public
	 * @param {String} url 一个url, 当没有传入文件名时，可以尝试从这个url中去获取文件名
	 * @param {String} [name] 文件名 或 文件名.扩展名
	 * @param {String} [ext]  扩展名
	 * @returns {String}  文件名.扩展名
	 * @example
	 * 
	 * 1. getName('aaa/bbbb.txt');
	 * //=> bbbb.txt
	 * 
	 * 2. getName('aaa/bbbb.txt', 'uuuuu');
	 * //=> uuuuu.txt
	 * 
	 * 3. getName('aaa/bbbb.txt', 'uuuuu', '.js');
	 * //=> uuuuu.js
	 * 
	 * 4. getName('aaa/bbbb.txt', 'uuuuu.kkk', '.js');
	 * //=> uuuuu.js
	 * 
	 * 5. getName('aaa/bbbb.txt', 'uuuuu.kkk');
	 * //=> uuuuu.kkk
	*/
	getName(url, name, ext){
		let arr = url.match(/(([\w\d_\-]+)(\.[\w\d_]+))$/); //默认取地址中的文件名
		
		//取出 url 中的文件名和扩展名
		let defaultName = '__default', defaultExt = '.png';
		if(arr){
			defaultName = arr[1] || defaultName;
			defaultExt = arr[3] || defaultExt;
		}
		
		//取出传入的 name 中的文件名和扩展名
		arr = name.match(/\.[\w\d_]+$/);
		if(arr){
			ext = ext || arr[0];
			name = name.replace(/\.[\w\d_]+$/, '');  //去掉name中的扩展名
		}
		
		ext = ext || defaultExt;
		name = name || defaultName;
		
		return name + ext;
	}
	
	
	/**
	 * 是否是远程地址
	 * @public
	 * @param {String} url 需要判断的url
	 * @returns {Boolean} 
	*/
	isRemoteUrl(url){
		return !!url.match(/^https?:\/\//i);
	}
	
	 /**
	  * 在web端通过a标签来下载文件
	  * 注意，在浏览器中用户可能设置了阻止下载文件，此时代码也会正常执行完成，但其实是没有真正地下载文件的。
	  * 如果不存在这样的资源，则默认会下载本网页(html文件)
	  * @public
	  * @param {String} url 要下载的图片地址
	  * @param {String} [name=''] 下载后图片的名字
	  */
    webDownloadImg(url, name = ''){  //网页中的图片下载
        const body = document.getElementsByTagName('body')[0];
        const aEle = document.createElement('a');
		aEle.setAttribute('download', name);
		aEle.style.display = 'none';
        aEle.href =  url;
        aEle.target = '_blank';
        
        body.appendChild(aEle);
        aEle.dispatchEvent( new MouseEvent('click') );  // 模拟鼠标click点击事件
        document.body.removeChild(aEle);
    }
	
	/**
	 * 以单例模式 获取实例对象 
	 * @static
	 * @public
	 */
	static getInstance(){
		if(!this.__hasInstance){
			this.__hasInstance = new this();
		}
		return this.__hasInstance;
	}
}

export default Downloader.getInstance();
