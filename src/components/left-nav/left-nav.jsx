import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import './left-nav.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig' ;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const getMenuNodes = (items) =>{
    return items.map(item => 
        item.children
        ? getItem(item.name, item.id, item.icon, getMenuNodes(item.children))
        : getItem(item.name, item.id, item.icon)      
    );
};
const items = getMenuNodes(menuList);
  
export default function LeftNav() {
    const navigate = useNavigate();
    const location = useLocation(); 
    let pathname = location.pathname;

    const father = menuList.filter(item => 
        item.children 
        && item.children.some(child => child.id === pathname)
    );
    const fatherPath = father.length ? father[0].id : null;

    const onClick = (e) => {
        // console.log('click ', e);
        const key = e.key;
        pathname = e.key;
        console.log(pathname);
        
        for (let i=0; i<menuList.length; i++){
            if (!menuList[i].children){
                if (key === menuList[i].id){
                    navigate(menuList[i].id);
                    break;
                }
            }else{
                for (let j=0; j<menuList[i].children.length; j++){
                    if (key === menuList[i].children[j].id){
                        navigate(menuList[i].children[j].id);
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
 