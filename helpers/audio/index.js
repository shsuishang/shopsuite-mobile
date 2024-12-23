import ZAudio from "./zaudio.js"

let audio = new ZAudio({
	continuePlay: false, //续播
	autoPlay: false, //自动播放 部分浏览器不支持
});

audio.setAudio(uni.getStorageSync('PLAY_LIST'))

export default audio
