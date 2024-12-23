
import Config from '../config/config'

export function checkUpdater(currentId, updaterPage) {
    uni.request({
        url: Config.URL.update_app,
        method: 'GET',
        data: {
			"appid": plus.runtime.appid,
			"version": plus.runtime.version,
			"os": plus.os.name.toLowerCase()
        },
        success: res => {
            if (res.statusCode === 200) {
                const response = res.data
                const latestId = response.data.version
                const method = parseInt(response.data.force)
                if (!latestId) {
                    console.log('当前没有发行版本')
                } else if (currentId != latestId && method === 1) {
                    console.log('确认强制更新，正在取得地址')
                    //  如果需要背地（静默）热更新，获取下载地址
                    uni.request({
                        url: 'https://www.easy-mock.com/mock/5c95e1ac8e241c358386bc16/pure-updater/version/info',
                        method: 'GET',
                        data: {
                          search: 'latestInfo'
                        },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                console.log('地址请求成功')
                                const response = res.data
                                const iosLink = response.latest.info.iosLink
                                const androidLink = response.latest.info.androidLink
                                let downloadLink = ''
                                let ready = false
                                // 判断系统类型
                                if (plus.os.name.toLowerCase() === 'android') {
                                    console.log('安卓系统')
                                    if (androidLink && androidLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
                                        console.log('发现下载地址')
                                        // 安卓：创建下载任务
                                        if (androidLink.match(RegExp(/.wgt/))) {
                                            console.log('确认wgt热更新包')
                                            downloadLink = androidLink
                                            ready = true
                                        } else {
                                            console.log('安卓推荐.wgt强制更新，.apk的强制更新请您自行修改程序')
                                        }
                                    } else {
                                        console.log('下载地址是空的，无法继续')
                                    }
                                } else {
                                    console.log('苹果系统')
                                    if (iosLink && iosLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
                                        console.log('发现下载地址')
                                        // 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
                                        if (iosLink.match(RegExp(/.wgt/))) {
                                            console.log('确认wgt热更新包')
                                            downloadLink = iosLink
                                            ready = true
                                        } else {
                                            console.log('苹果只支持.wgt强制更新')
                                        }
                                    } else {
                                        console.log('下载地址是空的，无法继续')
                                    }
                                }
                                if (ready) {
                                    console.log('任务开始')
                                    let downloadTask = uni.downloadFile({
                                        url: downloadLink,
                                        success: (res) => {
                                            if (res.statusCode === 200) {
                                                // 保存下载的安装包
                                                console.log('保存安装包')
                                                uni.saveFile({
                                                    tempFilePath: res.tempFilePath,
                                                    success: (res) => {
                                                        const packgePath = res.savedFilePath
                                                        // 保存更新记录到stroage，下次启动app时安装更新
                                                        uni.setStorage({
                                                            key: 'updated',
                                                            data: {
                                                                completed: false,
                                                                packgePath: packgePath
                                                            },
                                                            success: () => {
                                                                console.log('成功保存记录')
                                                            }
                                                        }) 
                                                        // 任务完成，关闭下载任务
                                                        console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新')
                                                        downloadTask.abort()
                                                        downloadTask = null
                                                    }
                                                })
                                            }
                                        }
                                    })
                                } else {
                                    console.log('下载地址未准备，无法开启下载任务')
                                }             
                            }
                        }
                    })
                } else if (currentId != latestId) {
                    console.log('检测到更新')
                    uni.showModal({
                        title: '发现新版本',
                        content: '有新版本可用 (版本id:' + latestId + ')，请问您是否更新？',
                        success: (res) => {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url: updaterPage
                                })										
                            } else if (res.cancel) {
                                console.log('取消')
                            }
                        }
                    })
                } else {
                    console.log('现在是最新版本')
                }      
            }
        }
    })
}