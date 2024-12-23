Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
				date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}


class Tools {
	constructor() {}

	/**
	 * 返回文件后缀
	 * @param  {Object} file
	 * @return {String}
	 */
	getFilenameExt(file) {
		const types = file.name.split('.')
		return types[types.length - 1]
	}

	/**
	 * 返回指定范围内的一个整数
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {String}
	 */
	rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	/**
	 * 生成字符串组合
	 * @param  {Number} size
	 * @return {String}
	 */
	randString(size) {
		let result = ''
		let allChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

		size = size || 1

		while (size--) {
			result += allChar.charAt(this.rand(0, allChar.length - 1))
		}

		return result
	}

	/**
	 * 生成文件名
	 * @param  {Object} file
	 * @return {String}
	 */
	randFilename(file) {
		return this.randString(this.rand(10, 100)) + Date.parse(new Date()) + '.' + this.getFilenameExt(file)
	}

	/**
	 * 判断某个元素是否为字符串
	 * @param  {String}  value
	 * @return {Boolean}
	 */
	isString(value) {
		return typeof value === 'string'
	}

	/**
	 * 判断某个元素是否为函数
	 * @param  {Function}  value
	 * @return {Boolean}
	 */
	isFunction(value) {
		return this.type(value) === 'function'
	}

	/**
	 * 判断某个元素是否为数组
	 * @param  {Array}  value
	 * @return {Boolean}
	 */
	isArray(value) {
		return Array.isArray(value)
	}

	/**
	 * 判断某个元素是否为对象
	 * @param  {Obejct}  value
	 * @return {Boolean}
	 */
	isObject(value) {
		return value !== null && typeof value === 'object'
	}

	/**
	 * 判断某个元素是否为数值
	 * @param  {Number}  value
	 * @return {Boolean}
	 */
	isNumber(value) {
		return typeof value === 'number'
	}

	/**
	 * 判断某个元素是否为日期
	 * @param  {Date}  value
	 * @return {Boolean}
	 */
	isDate(value) {
		return this.type(value) === '[object Date]'
	}

	/**
	 * 判断某个元素是否为正则表达式
	 * @param  {RegExp}  value
	 * @return {Boolean}
	 */
	isRegExp(value) {
		return this.type(value) === '[object RegExp]'
	}

	/**
	 * 判断某个元素是否为File对象
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	isFile(obj) {
		return this.type(obj) === '[object File]'
	}

	/**
	 * 判断某个元素是否为FormData对象
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	isFormData(obj) {
		return this.type(obj) === '[object FormData]'
	}

	/**
	 * 判断某个元素是否为Blob对象
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	isBlob(obj) {
		return this.type(obj) === '[object Blob]'
	}

	/**
	 * 判断某个元素是否为布尔值
	 * @param  {boolean}  value
	 * @return {Boolean}
	 */
	isBoolean(value) {
		return typeof value === 'boolean'
	}

	/**
	 * 判断某个元素是否为Promise对象
	 * @param  {Function}  obj
	 * @return {Boolean}
	 */
	isPromiseLike(obj) {
		return obj && this.isFunction(obj.then)
	}

	/**
	 * 判断数组类型
	 * @param  {Array}  value
	 * @return {Boolean}
	 */
	isTypedArray(value) {
		const TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/
		return value && this.isNumber(value.length) && TYPED_ARRAY_REGEXP.test(this.type(value))
	}

	/**
	 * 判断某个元素是否为ArrayBuffer对象
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	isArrayBuffer(obj) {
		return this.type(obj) === '[object ArrayBuffer]'
	}

	/**
	 * 判断某个元素是否为defined
	 * @param  {undefined}  value
	 * @return {Boolean}
	 */
	isDefined(value) {
		return typeof value !== 'undefined'
	}

	/**
	 * 判断某个元素是否为undefined
	 * @param  {undefined}  value
	 * @return {Boolean}
	 */
	isUndefined(value) {
		return typeof value === 'undefined'
	}

	/**
	 * 判断某个元素是否为null
	 * @param  {Null}  value
	 * @return {Boolean}
	 */
	isNull(value) {
		return value === null
	}

	/**
	 * 判断某个元素是否为有限数
	 * @param  {Number}  value
	 * @return {Boolean}
	 */
	isFinite(value) {
		return typeof value == 'number' && isFinite(value)
	}

	/**
	 * 判断某个元素是否为自然数
	 * @param  {Number}  value
	 * @return {Boolean}
	 */
	isNaN(value) {
		return this.isNumber(value) && value != +value
	}

	/**
	 * 判断某个元素是否为错误类型
	 * @param  {Object}  value
	 * @return {Boolean}
	 */
	isError(value) {
		return this.type(value) === '[object Error]'
	}

	/**
	 * 删除字符串左右两端的空格
	 * @param  {String} str
	 * @return {String}
	 */
	trim(str) {
		return this.isString(str) ? str.trim() : str
	}

	/**
	 * 字符串转义
	 * @param  {String} str
	 * @return {String}
	 */
	escapeForRegexp(str) {
		return str.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08')
	}

	/**
	 * 字符串转对象
	 * @param  {String} str 'key1,key2,...'
	 * @return {Object} in the form of {key1:true, key2:true, ...}
	 */
	makeMap(str) {
		let obj = {},
			items = str.split(',')
		for (let i = 0; i < items.length; i++) {
			obj[items[i]] = !0
		}
		return obj
	}

	/**
	 * 判断数组中是否含有指定元素
	 * @param  {Array} arr
	 * @param  {Objext} obj
	 * @return {Array}
	 */
	includes(arr, obj) {
		return Array.prototype.indexOf.call(arr, obj) != -1
	}

	/**
	 * 数组删除指定的元素，并返回元素的索引值
	 * @param  {Array} array
	 * @param  {String} value
	 * @return {Number}
	 */
	arrayRemove(array, value) {
		let index = array.indexOf(value)
		if (index >= 0) {
			array.splice(index, 1)
		}
		return index
	}

	/**
	 * 判断值是否在数组中
	 * @param  {Array} array
	 * @param  {String} value
	 * @return {Number}
	 */
	inArray(array, value) {
		var i = array.length;
		while (i--) {
			if (array[i] === value) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 日期增加分钟
	 * @param  {Date} date
	 * @param  {Number} minutes
	 * @return {Date}
	 */
	addDateMinutes(date, minutes) {
		date = new Date(date.getTime())
		date.setMinutes(date.getMinutes() + minutes || 0)
		return date
	}

	/**
	 * 对象解析出JSON字符串
	 * @param  {Object} obj
	 * @param  {Number} pretty
	 * @return {Object}
	 */
	toJson(obj, pretty) {
		if (this.isUndefined(obj)) return undefined
		if (!this.isNumber(pretty)) {
			pretty = pretty ? 2 : null
		}
		return JSON.stringify(obj, null, pretty)
	}

	/**
	 * JSON字符串解析成对象
	 * @param  {String} json
	 * @return {Object}
	 */
	fromJson(json) {
		return this.isString(json) ? JSON.parse(json) : json
	}

	/**
	 * 扩展对象
	 * @return {Object}
	 */
	extend() {
		let src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = !1;

		if (typeof target === 'boolean') {
			deep = target
			target = arguments[i] || {}
			i++
		}

		if (typeof target !== 'object' && !this.isFunction(target)) {
			target = {}
		}

		if (i === length) {
			target = this
			i--
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name]
					copy = options[name]

					if (target === copy) {
						continue
					}

					if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = !1
							clone = src && this.isArray(src) ? src : []
						} else {
							clone = src && this.isPlainObject(src) ? src : {}
						}
						target[name] = this.extend(deep, clone, copy)
					} else if (copy !== undefined) {
						target[name] = copy
					}
				}
			}
		}
		return target
	}

	/**
	 * 判断传入的参数是否为纯粹的对象，即直接量{}或new Object()创建的对象
	 * @param  {[type]}  obj [description]
	 * @return {Boolean}     [description]
	 */
	isPlainObject(obj) {
		let getProto = Object.getPrototypeOf
		let class2type = {}
		let toString = class2type.toString
		let hasOwn = class2type.hasOwnProperty
		let fnToString = hasOwn.toString
		let ObjectFunctionString = fnToString.call(Object)
		let proto, Ctor
		if (!obj || this.type(obj) !== '[object Object]') {
			return !1
		}
		proto = getProto(obj)
		if (!proto) {
			return !0
		}
		Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
		return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
	}

	/**
	 * 判断对象是否为空
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	isEmptyObject(obj) {
		for (let i in obj)
			return !1
		return !0
	}

	/**
	 * 判断对象的类型
	 * @param  {Object} obj
	 * @return {String}
	 */
	type(obj) {
		const toString = Object.prototype.toString

		if (obj == null) {
			return obj + ''
		}

		return typeof obj === 'object' || typeof obj === 'function' ? toString.call(obj) || 'object' : typeof obj
	}

	/**
	 * 合并对象并返回一个新的对象，目标对象自身也会改变
	 * @param  {Array} args
	 * @return {Object}
	 */
	merge(...args) {
		return Object.assign(...args)
	}

	/**
	 * 拷贝对象并返回一个新的对象
	 * @param  {Object} obj
	 * @return {Object}
	 */
	clone(obj) {
		if (typeof obj !== 'object' || !obj) {
			return obj
		}
		let copy = {}
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr]
			}
		}
		return copy
	}

	/**
	 * 删除对象上的指定属性并返回一个新的对象
	 * @param  {Object} obj
	 * @param  {Array} keys
	 * @return {[type]}
	 */
	omit(obj, keys) {
		let o = this.clone(obj)
		keys.forEach(key => {
			delete o[key]
		})
		return o
	}

	/**
	 * 返回一个新数组，数组中的元素为指定属性的值
	 * @param  {Array} arr
	 * @param  {String} key
	 * @return {Array}
	 */
	pluck(arr, key) {
		if (typeof arr !== 'object' || arr.length === 0) {
			return []
		}
		if (!key) {
			return arr
		}
		return arr.map(a => a[key])
	}

	/**
	 * 返回序列化的值
	 * @param  {String} value
	 * @return {String}
	 */
	serializeValue(value) {
		if (this.isObject(value)) return this.isDate(value) ? value.toISOString() : this.toJson(value)
		return value
	}

	/**
	 * 编码URI
	 * @param  {String} value
	 * @param  {String} pctEncodeSpaces
	 * @return {String}
	 */
	encodeUriQuery(value, pctEncodeSpaces) {
		return encodeURIComponent(value)
			.replace(/%40/gi, '@')
			.replace(/%3A/gi, ':')
			.replace(/%24/g, '$')
			.replace(/%2C/gi, ',')
			.replace(/%3B/gi, ';')
			.replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
	}

	/**
	 * 对象序列化
	 * @param  {Object} obj
	 * @return {String}
	 */
	paramSerializer(obj) {
		if (!obj) return ''
		let that = this
		let parts = []
		for (let key in obj) {
			const value = obj[key]
			if (value === null || that.isUndefined(value)) return
			if (that.isArray(value)) {
				value.forEach(function(v) {
					parts.push(that.encodeUriQuery(key) + '=' + that.encodeUriQuery(that.serializeValue(v)))
				})
			} else {
				parts.push(that.encodeUriQuery(key) + '=' + that.encodeUriQuery(that.serializeValue(value)))
			}
		}
		return parts.join('&')
	}

	/**
	 * 拼接URL
	 * @param  {String} obj
	 * @param  {Object} obj
	 * @return {String}
	 */
	buildUrl(url, obj) {
		const serializedParams = this.paramSerializer(obj)
		if (serializedParams.length > 0) {
			url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
		}
		return url
	}


	stringToHex(e) {
		if (e === "") {
			return "";
		}
		var t = [];
		for (var n = 0; n < e.length; n++) {
			t.push(e.charCodeAt(n).toString(16));
		}
		return t.join("")
	}

	hexToString(e) {
		var t = e.trim(),
			n = t,
			r = n.length;
		if (r % 2 !== 0) {
			return uni.showToast({
				title: "Illegal Format ASCII Code!"
			}), "";
		}
		var i, s = [];
		for (var o = 0; o < r; o += 2) {
			i = parseInt(n.substr(o, 2), 16), s.push(String.fromCharCode(i));
		}
		return s.join("")
	}

	merge() {
		if (arguments.length > 0) {
			var e = arguments[0];
			for (var t = 1; t < arguments.length; t++) {
				var n = arguments[t];
				for (var r in n) {
					n[r] != undefined && (e[r] = n[r])
				}
			}
			return e
		}
		return undefined
	}

	isNull(e) {
		return e == undefined || e == "undefined" || e == null || e == ""
	}

	parseJSON(e) {
		try {
			return JSON.parse(e)
		} catch (t) {
			return undefined
		}
	}

	/*
    dateFormatter(val, format) {
    	typeof format == 'undefined' ?  format='Y-M-D' : null
        return this.selfFormatTime(val, format);
    }

    datetimeFormatter(val, format) {
        typeof format == 'undefined' ?  format='Y-M-D h:m:s' : null
        return this.selfFormatTime(val, format);
    }

    datetimeShortFormatter(val, format) {
        typeof format == 'undefined' ?  format='Y-M-D h:m' : null
        return this.selfFormatTime(val, format);
    }
	*/

	dateFormatter(val, format) {
		typeof format == 'undefined' ? format = 'yyyy-MM-dd' : null
		return new Date(parseInt(val) * 1000).format(format);
	}

	formatDateTime(inputTime) { //时间戳 转 YY-mm-dd HH:ii:ss
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}

	datetimeFormatter(val, format) {
		typeof format == 'undefined' ? format = 'yyyy-MM-dd hh:mm:ss' : null
		return new Date(parseInt(val) * 1000).format(format);
	}
	
	formatDateFormatter(val, format) {
		typeof format == 'undefined' ? format = 'yyyy-MM-dd hh:mm:ss' : null
		return new Date(val).format(format);
	}

	datetimeShortFormatter(val, format) {
		typeof format == 'undefined' ? format = 'yyyy-MM-dd hh:mm' : null
		return new Date(parseInt(val) * 1000).format(format);
	}

	strtotime(time_str) {
		var timestamp2 = Date.parse(new Date(time_str.replace(/-/g, "/")));
		timestamp2 = timestamp2 / 1000;
		return timestamp2;
	}

	//数据转化
	formatNumber(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}

	/**
	 * 时间戳转化为年 月 日 时 分 秒
	 * number: 传入时间戳
	 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
	 */
	selfFormatTime(number, format) {

		var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
		var returnArr = [];

		var date = new Date(number * 1000);
		returnArr.push(date.getFullYear());
		returnArr.push(this.formatNumber(date.getMonth() + 1));
		returnArr.push(this.formatNumber(date.getDate()));

		returnArr.push(this.formatNumber(date.getHours()));
		returnArr.push(this.formatNumber(date.getMinutes()));
		returnArr.push(this.formatNumber(date.getSeconds()));

		for (var i in returnArr) {
			format = format.replace(formateArr[i], returnArr[i]);
		}

		return format;
	}

	FormatTime(e) {
		e = e.replace(/-/g, "/");
		var t = (new Date).getTime(),
			e = (new Date(e)).getTime();
		e = e > t ? e : t;
		if (!(e <= t)) {
			var n = e - t,
				r = Math.floor(n / 1e3 / 60 / 60 / 24) + 1,
				i = Math.floor(n / 1e3 / 60 / 60 % 24),
				s = Math.floor(n / 1e3 / 60 % 60),
				o = Math.floor(n / 1e3 % 60);
			return {
				day: this.doubleNum(r),
				hour: this.doubleNum(i),
				min: this.doubleNum(s),
				sec: this.doubleNum(o)
			}
		}
		clearInterval()
	}

	Formattime(e, t) {
		e = e.replace(/-/g, "/");
		var n = (new Date).getTime(),
			e = (new Date(e)).getTime();
		e = e > n ? e : n;
		if (!(e <= n)) {
			var r = e - n,
				i = Math.floor(r / 1e3 / 60 / 60),
				s = Math.floor(r / 1e3 / 60 % 60),
				o = Math.floor(r / 1e3 % 60);
			return {
				hour: this.doubleNum(i),
				min: this.doubleNum(s),
				sec: this.doubleNum(o)
			}
		}
		clearInterval(t)
	}

	Formattime1(e, t) {
		var n = (new Date).getTime(),
			e = e;
		if (!(e <= n)) {
			var r = e - n,
				i = Math.floor(r / 1e3 / 60 / 60),
				s = Math.floor(r / 1e3 / 60 % 60),
				o = Math.floor(r / 1e3 % 60);
			return {
				hour: this.doubleNum(i),
				min: this.doubleNum(s),
				sec: this.doubleNum(o)
			}
		}
		clearInterval(t)
	}
	
	Formattime2(e, t) {
		var n = (new Date).getTime(),
			e = e;
		e = e > n ? e : n;
		if (!(e <= n)) {
			var r = e - n,
				i = Math.floor(r / 1e3 / 60 / 60),
				s = Math.floor(r / 1e3 / 60 % 60),
				o = Math.floor(r / 1e3 % 60);
			return {
				hour: this.doubleNum(i),
				min: this.doubleNum(s),
				sec: this.doubleNum(o)
			}
		}
		clearInterval(t)
	}

	doubleNum(e) {
		return e < 10 ? "0" + e : e + ""
	}





	/**
	 * 验证电子邮箱格式
	 */
	email(value) {
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
	}
	/**
	 * 验证手机格式
	 */
	tel(value, intl) {

		if (typeof intl == 'undefined')
		{
			return /^1[23456789]\d{9}$/.test(value)
		}
		else if ('+86' == intl)
		{
			return /^1[23456789]\d{9}$/.test(value)
		}
		else
		{
			//全球手机号判断
			return /^\d+$/.test(value)
		}
	}
	/**
	 * 验证URL格式
	 */
	url(value) {
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
	}
	/**
	 * 验证日期格式
	 */
	date(value) {
		return !/Invalid|NaN/.test(new Date(value).toString())
	}
	/**
	 * 验证ISO类型的日期格式
	 */
	dateISO(value) {
		return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
	}
	/**
	 * 验证十进制数字
	 */
	number(value) {
		return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
	}
	/**
	 * 验证整数
	 */
	digits(value) {
		return /^\d+$/.test(value)
	}
	/**
	 * 验证身份证号码
	 */
	idcard(value) {
		return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
	}
	/**
	 * 验证两个输入框的内容是否相同
	 */
	equalTo(value, param) {
		return value === that.scope.detail.value[param]
	}
	/**
	 * 验证是否包含某个值
	 */
	contains(value, param) {
		return value.indexOf(param) >= 0
	}
	/**
	 * 验证最小长度
	 */
	minlength(value, param) {
		return value.length >= param
	}
	/**
	 * 验证最大长度
	 */
	maxlength(value, param) {
		return value.length <= param
	}
	/**
	 * 验证一个长度范围[min, max]
	 */
	rangelength(value, param) {
		return (value.length >= param[0] && value.length <= param[1])
	}
	/**
	 * 验证最小值
	 */
	min(value, param) {
		return value >= param
	}
	/**
	 * 验证最大值
	 */
	max(value, param) {
		return value <= param
	}
	/**
	 * 验证一个值范围[min, max]
	 */
	range(value, param) {
		return (value >= param[0] && value <= param[1])
	}

	/**
	 * 需要登录
	 */
	toLogin(force) {
		if ('undefined' == typeof force || !force)
		{
			uni.navigateTo({
				url: '/pagesub/login/login'
			})
		}
		else
		{
			uni.reLaunch({
				url: '/pagesub/login/login'
			});
		}
	}

	/**
	 * 登录注册后
	 */
	toActive() {
	}
	
	
	/**
	 * @description 判断是否为json
	 * @param value
	 * @returns {boolean}
	 */
	isJson(value) {
	  if (typeof value === 'string') {
	    const obj = JSON.parse(value)
	    return !!(typeof obj === 'object' && obj)
	  }
	  
	  return false
	}

}

export default Tools
