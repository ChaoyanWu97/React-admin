import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import './left-nav.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig' ;
import { connect } from 'react-redux';
import {setHeadTitle} from '../../redux/actions';


  
function LeftNav(props) {
    const navigate = useNavigate();
    const location = useLocation(); 
    let pathname = location.pathname;

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    
    const hasAuth = (item) => {
    
        const {id, isPublic} = item;
        const {menus} = props.user.role;
        const {username} = props.user;

        // 1. 如果当前用户是admin
        // 2. 如果当前item是公开的 
        // 3. 当前用户有此item的权限: id有没有在menus中
        if (username === 'admin' || isPublic || menus.indexOf(id)!==-1){
            return true;
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.id) !== -1)
        }
        return false;    
    }
    const getMenuNodes = (items) =>{
        return items.reduce((pre, item) =>{
            
            if (hasAuth(item)) {

                if (!item.children) {
                    if (pathname.indexOf(item.id) === 0){
                        props.setHeadTitle(item.name)
                    }
                }

                const menuNode = item.children
                ? getItem(item.name, item.id, item.icon, getMenuNodes(item.children))
                : getItem(item.name, item.id, item.icon) 
                pre.push(menuNode);
            }
            return pre;
            
        } ,[]);
    };
    const items = getMenuNodes(menuList);

    const father = menuList.filter(item => 
        item.children 
        && item.children.some(child => child.id === pathname)
    );
    const fatherPath = father.length ? father[0].id : null;

    const onClick = (e) => {
        const key = e.key;
        pathname = e.key;
        
        for (let i=0; i<menuList.length; i++){
            if (!menuList[i].children){
                if (key === menuList[i].id){
                    navigate(menuList[i].id);
                    props.setHeadTitle(menuList[i].name)
                    break;
                }
            }else{
                for (let j=0; j<menuList[i].children.length; j++){
                    if (key === menuList[i].children[j].id){
                        navigate(menuList[i].children[j].id);
                        props.setHeadTitle(menuList[i].children[j].name)
                        break;
                    }
                }
            }
        }
    };
    
    return (
        <div className='left-nav'>
            <Link to='/' className='left-nav-header'>
                <img src={logo} alt="logo" />
                <h1>义百后台</h1>
            </Link>
            <br />
            <br />
            <Menu
                theme='dark'
                onClick={onClick}
                mode="inline"
                items={items}
                defaultOpenKeys={[fatherPath]}
                defaultSelectedKeys={[pathname]}
            />
        </div>
    )
}

export default connect(
    state => ({
        user: state.user
    }),
    {setHeadTitle}
)(LeftNav)
 