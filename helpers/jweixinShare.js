/*
    微信支付方法(uni-app h5)适用
    获取微信加签信息
    @param{data}:获取的微信加签
    @param{res}:成功回调
    @param{fail}:失败回调

    @warn:因为package为严格模式下的保留字，不能用作变量.
    @use

        wPay({
            appId,
            timeStamp,
            nonceStr,
            signature,
            package,
            paySign
        },res=>{
            console.log('调用成功!');
        },fail=>{
            console.log('调用失败!');
        })
*/
import __config from '../config/config'
import wx from './jweixin'



function initWxShareReady(data, $title, $desc, $link, $img_url, url)
{
    let [appId, timestamp, nonceStr, signature, packages, paySign] = [data.appId, data.timestamp, data.nonceStr, data.signature,
        data.package, data.paySign
    ];

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见附录1
        href: $link,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    });

    wx.ready(function () {
		$link = url;

        if($img_url.indexOf("https") == 0 || $img_url.indexOf("http"))
        {
            $img_url = $img_url;
        }
        else
        {
            if(__config.HTTPS)
            {
                $img_url = "http:" + $img_url;
            }
            else
            {
                $img_url = "https:" + $img_url;
            }
        }

        wx.onMenuShareTimeline({
            title: $title, //分享标题
            desc: $desc, //分享描述
            link: $link, //分享链接
            imgUrl: $img_url, //分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareAppMessage({
            title: $title, //分享标题
            desc: $desc, //分享描述
            link: $link, //分享链接
            imgUrl: $img_url, //分享图标
            type: 'link',
            dataUrl: '',
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareQQ({
            title: $title, //分享标题
            desc: $desc, //分享描述
            link: $link, //分享链接
            imgUrl: $img_url, //分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareWeibo({
            title: $title, //分享标题
            desc: $desc, //分享描述
            link: $link, //分享链接
            imgUrl: $img_url, //分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareQZone({
            title: $title, //分享标题
            desc: $desc, //分享描述
            link: $link, //分享链接
            imgUrl: $img_url, //分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

    });

    wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        /*alert("config信息验证失败");*/
    });
}


export default initWxShareReady;