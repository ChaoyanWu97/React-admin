import {
    AppstoreOutlined,
    PieChartOutlined,
    DesktopOutlined,
  } from '@ant-design/icons';

const menuList = [
    {name:'首页', id:'/home', icon:<PieChartOutlined />, isPublic: true},
    {name:'商品', id:'/goods', icon: <AppstoreOutlined />, children:[
        {name:'品类管理', id:'/category', icon: <DesktopOutlined /> ,  },
        {name:'商品管理', id:'/product',  icon: <DesktopOutlined />, },
    ]},
    {name:'用户管理', id:'/user', icon: <DesktopOutlined />},
    {name:'角色管理', id:'/role', icon: <DesktopOutlined />},
    {name:'图形图表', id:'/char', icon: <AppstoreOutlined />, children:[
        {name:'柱形图', id:'/bar', },
        {name:'折线图', id:'/line', },
        {name:'饼图', id:'/pie', },
    ]},
];
export default menuList;