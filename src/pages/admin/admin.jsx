import React from 'react';
import { Navigate, Route, Routes} from 'react-router-dom';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav';
import Header from '../../components/header/header';
import Home from '../../pages/home/home'
import Category from '../../pages/category/category';
import Product from '../../pages/product/product';
import Role from '../../pages/role/role';
import User from '../../pages/user/user';
import Line from '../../pages/charts/line';
import Bar from '../../pages/charts/bar';
import Pie from '../../pages/charts/pie';
import { connect } from 'react-redux';
import NotFound from '../not-found/not-found';


const { Footer, Sider, Content } = Layout;

function admin(props) {
    const {user} = props;
    // 如果没有存储user ==》 当前user没有登录
    if (!user || !user._id){
        // 自动跳转到登录界面
        return <Navigate to="/login"/>
      }
    return (
        <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
                <Header/>
                <Content style={{margin:20, backgroundColor:'#fff'}}>
                    <Routes>
                        <Route path='/' element={<Navigate to="/home"/>}/>
                        <Route path='home' element={<Home/>}/>
                        <Route path='category' element={<Category/>}/>
                        <Route path='product/*' element={<Product/>}/> 
                        <Route path='role' element={<Role/>}/>
                        <Route path='user' element={<User/>}/>
                        <Route path='bar' element={<Bar/>}/>
                        <Route path='line' element={<Line/>}/>
                        <Route path='pie' element={<Pie/>}/>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </Content>
                <Footer style={{textAlign:'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
            </Layout>
        </Layout>
  )
}

export default connect(
    state => ({user: state.user})
)(admin)
