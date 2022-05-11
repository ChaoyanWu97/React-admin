/**
 * 能发Ajax异步请求的函数模块
 * 封装axios库
 * @param {string} url
 * @param {Object} data
 * @param {string} method
 * @return {Promise}
 */
import { message } from 'antd';
// In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with require() use the following approach:
const axios = require('axios').default;

export default function ajax (url, data={}, method='GET'){
    return new Promise((resolve, reject) => {
        let promise  = null;
        if (method === 'GET') {
            promise = axios.get(url, {params: data});
        } else {
            promise = axios.post(url, data);
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            // 如果请求出错了，不调用reject(),而是提示异常信息
            message.error('请求出错：'+ error.message)
        })
    })
} 



// 请求登录接口
// ajax('/login', {username, password}, 'POST').then()
// 添加用户
// ajax('/manage/user/add', {username, password, phone:'152XXX01'}, 'POST')
