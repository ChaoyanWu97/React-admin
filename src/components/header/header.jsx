import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import weather from './weather.jpg';
import './header.less';
import { formateData } from '../../utils/dateUtils';
import { reqWeather } from '../../api/';
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig';
import storageUtils from '../../utils/storageUtils';



export default function Header() {
  const [currentTime, setCurrentTime] = useState(formateData(Date.now()));
  const [weather, setWeather] = useState('');
  const username = memoryUtils.user.username;

  const navigate = useNavigate();
  
  const location = useLocation(); 
  const {pathname} = location;

  

  const getTitle = (pathname, menuList) => {
    for (const item of menuList){
      if (pathname.indexOf(item.id) === 0) return item.name;
      if (item.children) {
        const name = getTitle(pathname, item.children)
        if (name) return name;
      }
    }
  }
  // eslint-disable-next-line
  const title = useMemo(()=>getTitle(pathname, menuList), [pathname]);


  const logout = () => {
    const { confirm } = Modal;
    confirm({
      // title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗？',
      onOk() {
        // 删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};
        // 跳转到login页面
        navigate('/login', {
          replace: true,
        })
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
