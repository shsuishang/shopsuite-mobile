"use strict";
import _app from './config.js';
const statusObj = {
	getMore: {
		text: '获取更多',
		code: 1
	},
	noMore: {
		text: '没有更多了',
		code: 2
	},
	loading: {
		text: '数据加载中',
		code: 3
	},
	noData: {
		text: '暂无数据',
		code: 4
	},
	errFail: {
		text: '数据错误',
		code: 5
	},
	errCatch: {
		text: '加载数据失败, 点击重试',
		code: 6
	}
}
function doPageDemand(obj) {	//分页加载获取数据方法, 页面使用call绑定this使用
	_app.log('进入getAndSetPageData方法');
	let _this = this;
	let {
		getDataFn,	//获取数据的方法
		success, //接口访问成功回调
		successEnd, //成功回调结束时
		fail,	//接口访问失败回调
		
		sendDataName,	//携带数据字段名称
		pageNumName,	//携带数据中的页数字段名称
		pageSizeName,	//携带数据中的条数字段名称
		
		checkLastPageMode,	//判断是否是最后一页的逻辑标识, 用于逻辑判断, 目前默认有两个参数 size: 判断条数, page: 判断页数, 默认为size
		newDatafields,	//接口访问成功后获取列表数据字段名称, 可用. 链式获取
		dataLastPageName,	//接口访问成功后数据中的最大页数字段名称, 可用. 链式获取
		sizeName,	//接口访问成功后数据中条数字段名称, 可用. 链式获取
		
		setName,	//页面中列表数据字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		statusTextName,	//页面中列表状态字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		lastPageName,	//页面中最后一页字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		waitingName,	//页面中获取数据等待字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		
		refresh,	//刷新标识, 若为true则会将携带数据中的页数重置为1
		force,	//强制标识, 若为true则会忽略等待标识为true时的跳过操作
		doEvent,	//进入状态判断标识, 若为true则会进入判断列表status而进行相应操作
		
		noDataText,	//访问接口后若数据长度为0则可自定义为空时文字
		refreshClear	//刷新时是否清空数据
	} = obj;
	waitingName = waitingName || 'getting';
	if (_this[waitingName] && !force) return; //节流
	if (doEvent) {	//判断列表状态
		if(_this[statusTextName].code !== undefined) {
			switch (_this[statusTextName].code) {
				case 1:
					break;
				case 6:
					break;
				default:
					return;
					break;
			}
		}
	} 
	
	//初始化默认值
	sendDataName = sendDataName || 'sendData';
	setName = setName || 'list';
	newDatafields = newDatafields || 'list';
	dataLastPageName = dataLastPageName || 'lastPage';
	lastPageName = lastPageName || dataLastPageName;
	statusTextName = statusTextName || 'statusText';
	pageNumName = pageNumName || 'pageNum';
	pageSizeName = pageSizeName || 'pageSize';
	sizeName = sizeName || 'size';
	checkLastPageMode = checkLastPageMode || 'lastPage';

	if (refresh) {	//刷新, 重置为第一页
		_this[sendDataName][pageNumName] = 1;
		_this[lastPageName] = undefined;	//重置最后一页状态
		
		if(refreshClear) {	//刷新是否清空数据
			_this[setName] = [];
		}
	}
	
	//浅拷贝携带数据对象
	const sendData = { ..._this[sendDataName]
	};
	_app.log('sendData: ' + JSON.stringify(sendData));
	_app.log('_this[lastPageName]:' + _this[lastPageName]);
	// 当前最后一页
	let lastPage = _this[lastPageName];
	_app.log('lastPage:' + lastPage);
	// 获取携带数据中的页数
	const sendDataPageNum = Number(sendData[pageNumName]);
	// 判断是否为最后一页
	if (typeof(lastPage) === 'number' && lastPage >= 0) {
		_app.log('sendData[pageNumName]:' + sendDataPageNum);
		if (sendDataPageNum > lastPage) {
			_this[statusTextName] = getStatus('noMore');
			return;
		}
	}
	let status;	//声明 列表状态变量
	// 改变状态为 访问接口中
	_this[statusTextName] = getStatus('loading');
	// 等待标识
	_this[waitingName] = true;
	_app.log('准备访问接口:' + JSON.stringify(sendData));
	// 访问接口
	getDataFn({ ...sendData
	}).then(res => {
		if(success && typeof success == 'function') success(res);
		_app.log('page.js获取数据成功:' + JSON.stringify(res));
		// 获取列表数据
		const newList = getField(res, newDatafields);
		// 判断是否存在并判断长度
		const bl = (newList && newList.length > 0);
		// 判断是否是第一页
		if (sendDataPageNum === 1) {
			// 第一页
			if (bl) {
				// 存在数据, 直接赋值
				_this[setName] = newList;
				_app.log('pageJS: 赋值了: setName:' + setName + ' ,newDatafields:' + newDatafields + ' ,data:' + JSON.stringify(newList))
			} else {
				// 不存在设置为空数组
				_this[setName] = [];
			}
		} else {
			// 不是第一页
			if (bl) {
				// 存在数据, 使用concat新增数据
				_this[setName] = _this[setName].concat(newList);
			}
		}
		// 获取数据中的最后一页
		let dataLastPageNum = getField(res, dataLastPageName);
		if (dataLastPageNum !== undefined) {
			dataLastPageNum = Number(dataLastPageNum);
			// 获取数据中的条数
			const sizeNum = Number(getField(res, sizeName));
			// 获取最后一页
			let lastPageNum;
			switch (checkLastPageMode) {
				case 'size':
					lastPageNum = Math.ceil(sizeNum / Number(sendData[pageSizeName]));
					break;
				case 'page':
					lastPageNum = dataLastPageNum;
					break;
				default:
					if (res[sizeName] !== undefined) {
						lastPageNum = Math.ceil(sizeNum / Number(sendData[pageSizeName]));
					} else {
						lastPageNum = dataLastPageNum;
					}
					break;
			}
			_app.log('lastPageNum:' + lastPageNum);
			// 赋值最后一页
			_this[lastPageName] = lastPageNum;
			_app.log('_this[lastPageName]:' + _this[lastPageName]);
			
			// 判断最后一页与是否存在数据, 赋值相应状态
			if (sendDataPageNum <= 1 && lastPageNum <= 1 && !bl) {	//第一页并无数据
				_app.log('noDataText:' + noDataText);
				status = getStatus('noData', noDataText||'');
				_app.log('没有数据,status:' + JSON.stringify(status));
			} else if (sendDataPageNum < lastPageNum) {	//可获取更多
				status = getStatus('getMore');
			} else {	//没有更多了
				status = getStatus('noMore');
			}
		} else {
			status = getStatus('errFail');
		}
		// 页面携带数据页数加1
		++_this[sendDataName][pageNumName];
		// 赋值状态
		_this[statusTextName] = status;
		// 重置等待标识
		_this[waitingName] = false;
		if(successEnd && typeof successEnd == 'function') successEnd(res);
	}).catch(err => {
		_app.log('pageJS异常:' + JSON.stringify(err));
		// 获取数据异常,可点击重新加载
		_this[statusTextName] = { ...statusObj.errCatch
		};
		// 重置等待标识
		_this[waitingName] = false;
		if (fail && typeof fail === 'function') fail(err);
	})
}

function getStatus(type, text) {
	const obj = {...statusObj[type]};
	obj.text = text||obj.text||'';
	return obj;
}

function getField(data, fields, pattern) { //递归获取指定字段数据
  if (!fields) return data;
	var arr = fields.split('.');
	var key = arr.shift();
	var value = data[key];

	if(value==null){
		return value;
	}else if(arr.length==0){
		if(!pattern)return value;
		var type = Object.prototype.toString.call(value).replace('[object ','').replace(']','');
		if(pattern===true){
			return type;
		}else if(!pattern){
			return value;
		}else{
			return type==pattern;
		}
	}

	var result = getField(value,arr.join('.'),pattern);
	return result;
}

module.exports = {
	doPageDemand
}
