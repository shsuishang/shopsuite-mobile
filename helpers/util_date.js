
import Lang from '../config/lang'

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

let UNITS = {};

UNITS[Lang.__('年')] = 31557600000;
UNITS[Lang.__('月')] = 2629800000;
UNITS[Lang.__('天')] = 86400000;
UNITS[Lang.__('小时')] = 3600000;
UNITS[Lang.__('分钟')] = 60000;
UNITS[Lang.__('秒')] = 1000;

var dateUtils = {
	UNITS: UNITS,

	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + Lang.__('前');
				break;
			}
		}
		return humanize || Lang.__('刚刚');
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < 86400000) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		
		return date.format('yyyy-MM-dd hh:mm');;
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

export default {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils
}