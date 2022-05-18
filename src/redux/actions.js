import { reqLogin } from "../api";
import storageUtils from "../utils/storageUtils";
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from "./action-type";



/**
 * 设置头部标题的同步action
 */
export const setHeadTitle = (title) => ({
     type: SET_HEAD_TITLE,
     data: title,
})

/**
 * 登录成功，接收用户的同步action
 */
export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    data: user,
})

/**
 * 登录失败，显示错误信息的action
 */
export const showErrorMsg = (msg) => ({
    type: SHOW_ERROR_MSG,
    data: msg,
})

/**
 * 退出登录的同步action
 */
export const logout = () => {
    storageUtils.removeUser();
    return {type: RESET_USER};
}
/**
 * 登录的异步action
 */
export const login = (username, password) => {
    return async (dispatch) => {
        const result = await reqLogin(username, password) // {status: 0, data: user} {status: 1, msg: 'xxx'}
        if (result.status === 0) {
            const user = result.data;
            storageUtils.saveUser(user);
            dispatch(receiveUser(user));
        }else {
            const {msg} = result;
            dispatch(showErrorMsg(msg))
        }
    }
}