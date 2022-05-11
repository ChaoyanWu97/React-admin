import React from 'react';
import {  Input, Tree } from 'antd';
import menuList from '../../config/menuConfig';

// 添加角色的form组件
export default function AuthForm(props) {

  const {role} = props;

  const getTreeNodes = (menuList) => 
    menuList.map(menu => {
      const obj = {
        title: menu.name,
        key: menu.id,
      }
      if (menu.children && menu.children.length>0 && menu.children[0]) {
        obj.children = getTreeNodes(menu.children)
      }
      return obj;
    })
  const treeData = [{title:'平台权限', key:'all', children: getTreeNodes(menuList)}];

  
  return (
    <>
      <Input value={role.name} disabled style={{marginBottom: 30}}></Input>

      <Tree
        checkable
        defaultExpandAll
        // defaultSelectedKeys={menus}
        // onSelect={onSelect}
        checkedKeys={props.menus}
        onCheck={props.onCheck}
        treeData={treeData}
      />
    </>
    
    
  )
}


