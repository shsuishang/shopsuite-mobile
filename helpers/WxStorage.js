class WxStorage {
    constructor() {
    }

    setItem(k, v) {
        try {
            uni.setStorageSync(k, v)
        } catch (e) {
        }
    }

    getItem(k) {
        try {
            var value = uni.getStorageSync(k)
            if (value) {
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        }

        return value;
    }

    removeItem(k) {
        try {
            uni.removeStorageSync(k)
        } catch (e) {
            // Do something when catch error
        }
    }

    clear() {
        try {
            uni.clearStorageSync()
        } catch (e) {
            // Do something when catch error
            console.error('error uni.clearStorageSyn')
        }
    }

    key() {
        try {
            var res = uni.getStorageInfoSync()
            console.log(res.keys)
            console.log(res.currentSize)
            console.log(res.limitSize)
        } catch (e) {
            // Do something when catch error
        }

        return res.keys;
    }

    info() {
        try {
            var res = uni.getStorageInfoSync()
        } catch (e) {
            // Do something when catch error
			console.error('erro getStorageInfoSync')
        }

        return res;
    }
}

export default WxStorage
