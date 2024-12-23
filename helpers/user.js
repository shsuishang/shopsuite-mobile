// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '{}';
    }
	
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
	
	userInfo = Object.assign(users, userInfo);

    uni.setStorageSync(USERS_KEY, JSON.stringify(userInfo));
}

export default {
    getUsers,
    addUser
}
