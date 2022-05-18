import { combineReducers } from 'redux';
import storageUtils from '../utils/storageUtils'
import { RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG } from './action-type';

/**
 * 管理头部标题
 */
const initHeadTitle = ''
function headTitle(state = initHeadTitle, action){
     switch (action.type) {
         case SET_HEAD_TITLE: 
            return action.data
         default:
             return state
     }
}

/**
 * 管理当前登录用户
 */
const initUser = storageUtils.getUser()
function user(state = initUser, action){
    switch (action.type) {
        case RECEIVE_USER:
            return action.data;
        case SHOW_ERROR_MSG:
            const errMsg = action.data;
            return {...state, errMsg};
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/**
 * state结构：
 * {
       headTitle: 'XXX'
        user: {}
 * }
 */

export default combineReducers({
    headTitle,
    user,
});