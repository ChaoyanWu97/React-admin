import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './header.less';
import { formateData } from '../../utils/dateUtils';
import { reqWeather } from '../../api/';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions'



function Header(props) {
  const [currentTime, setCurrentTime] = useState(formateData(Date.now()));
  const [weather, setWeather] = useState('');

  const {username} = props.user;
  const title = props.headTitle;

  const logout = () => {
    const { confirm } = Modal;
    confirm({
      // title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗？',
      onOk() {
        props.logout();
      },
    });
  }

  useEffect(()=>{
    // 更新时间
    const timer = setInterval(() => {
      setCurrentTime(formateData(Date.now()))
    }, 1000);
    // console.log('reqtime');
    return ()=>{
      clearInterval(timer);
    };
  },[currentTime,]);

  useEffect(() => {
    // 更新天气
    const getWeather = async () => {
      // console.log('reqweather');
      const responseWeather =  await reqWeather();
      setWeather(responseWeather)
    }
    getWeather();
  }, [weather])

  return (
    <div className='header'>
      <div className='header-top'>
        <span>欢迎，{username}</span>
        <Button type='link' onClick={logout} >退出</Button>
      </div>
      <div className='header-bottom'>
        <div className='header-bottom-left'>{title}</div>
        <div className='header-bottom-right'>
          <span>{currentTime}</span>
          {/* <img src={weather} alt="weather" /> */}
          <span className='header-bottom-right-weather'>{weather}</span>
        </div>
      </div>
    </div>
  )
}


export default connect(
  (state) => ({
    headTitle: state.headTitle,
    user: state.user
  }),
  {logout}
)(Header);