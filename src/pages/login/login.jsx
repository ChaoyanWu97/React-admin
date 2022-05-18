import React from 'react';
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./login.less";
import logo from '../../assets/images/logo.png';
import {login} from '../../redux/actions'
import { MAXLEN_PASSWORD, MAXLEN_USERNAME, MINLEN_PASSWORD, MINLEN_USERNAME } from '../../config/constants';


function Login(props) {


    // 提交表单且数据验证成功后回调事件
    const  onFinish = async (values) => {
        const {username, password} = values; 
        props.login(username, password);
    };

    // 提交表单且数据验证失败后回调事件
    const onFinishFailed = (errorInfo) => {
        console.log('表单数据校验失败' + errorInfo);
    };

    // 如果用户已经登录，跳转到后台管理界面
    const {user} = props;
    if (user && user._id) {
        return < Navigate to = "/" />
    }

    return (
        <div className='login'>
        <header className='login-header'>
            <img src={logo} alt="logo" />
            <h1>后台管理系统</h1>
        </header>
        <section className='login-content'>
            <div className={user.errMsg ? 'error-msg show' : 'error-msg'} >{user.errMsg}</div>
            <h2>用户登录</h2>
            <Form name="normal_login" className="login-form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item name="username" validateFirst={true}
                    rules={[
                        {
                            pattern: /^[\w_]+$/, message: '用户名必须由英文，数字或下划线组成!',
                        },
                        {
                            required: true, whitespace: true,
                            message: `请输入用户名！`,
                        },{
                            type: 'string',
                            min: MINLEN_USERNAME,
                            max: MAXLEN_USERNAME,
                            message: `请输入长度为${MINLEN_USERNAME}~${MAXLEN_USERNAME}位的用户名!`,
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item  name="password" 
                    rules={[{
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.reject(new Error('请输入密码！'));
                            } else if (value.length < MINLEN_PASSWORD || value.length > MAXLEN_PASSWORD){
                                return Promise.reject(new Error(`请输入长度为${MINLEN_PASSWORD}~${MAXLEN_PASSWORD}位的用户名!`));
                            }else if (!/^[\w_]+$/.test(value)){
                                return Promise.reject(new Error(`密码必须由英文，数字或下划线组成!`));
                            }else return Promise.resolve();
                    }}]}
                >
                    <Input prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password" placeholder="Password"  />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </section>
        </div>
    )
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)
