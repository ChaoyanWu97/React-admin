import React, {  useEffect, useState } from 'react';
import { Button, Card, message, Space, Table, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { formateData } from '../../utils/dateUtils';
/**
 * 角色管理
 */

let form;
export default function Role() {

  const [roles, setRoles] = useState([]); // 所有角色列表
  const [role, setRole] = useState({}); // 选中的role
  const [menus, setMenus] = useState([]) // 选中role的权限数组
  const [isModalVisible, setIsModalVisible] = useState(0); // 标识创建/设置权限的确认框是否显示,0: 都不显示, 1: 显示添加, 2显示修改

  const navigate = useNavigate();

  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      setRoles(result.data);
    } else {
      message.error('获取角色列表失败');
    }
  }

  // 确认添加角色的回调
  const addRole = () => {
    // 触发表单验证
    form.validateFields().then(async (values) => {
      // 隐藏对话框
      setIsModalVisible(0);
      // 获取roleName发送添加分类请求
      // 收集数据
      const {roleName} = values;
      // 提交添加分类请求
      const result = await reqAddRole(roleName);
      console.log(result);
      if (result.status === 0) {
        // 更新角色列表
        const newRole = result.data;
        setRoles([...roles, newRole])
      }
      // 清除input框中的输入数据
      form.resetFields();
    }).catch(error => {
      message.error(error.errorFields[0].errors);
    })
  }

  // 设置角色权限的回调 
  const updateRole = async () => {
    setIsModalVisible(0);
    // 得到最新的menus
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    // 发送请求
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {};
        storageUtils.removeUser();
        navigate('/login', {replace: true});
        message.success('当前用户角色权限已修改，重新登录');

      } else {
        message.success('成功修改角色权限');
        const newRole = result.data;
        setRole(newRole);
        const newRoles = roles.map(role => role._id === newRole._id
          ? newRole : role )
        setRoles(newRoles)
      }

    }
  }

  // Card的title
  const title = (
    <Space>
      <Button type='primary' onClick={()=>setIsModalVisible(1)}>创建角色</Button>
      <Button type='primary' onClick={()=>setIsModalVisible(2)} disabled={!role._id}>设置角色权限</Button>
    </Space>
  )  
  
  // Table的columns
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: formateData,
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: formateData,
    },
    {
      title: '授权人',
      dataIndex: 'auth_name',
    },
  ];


  // 选择某个radio的回调
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const role = selectedRows[0];
    const menus = role.menus || [];
    setRole(role)
    setMenus([...menus])
  }
  
  // Table的单选框
  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    getCheckboxProps: (record) => record,
    selectedRowKeys: [role._id]
  }

  // 点击Table某一行的回调
  const onRow = (role) => 
    ({onClick: () => {
      setRole(role)
      const menus = role.menus || [];
      setMenus([...menus]);
    }})

  // 取消设置角色权限的回调
  const handleCancleUpdate = () => {
    setIsModalVisible(0);
    setMenus([...role.menus]);
  }

  // 选择树形控件的某个checkbox的回调
  const handleCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    setMenus(checkedKeys)
  }

  
  useEffect(()=>{
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Card
      title={title}
    >
      <Table 
        bordered
        rowKey='_id' // dataSource中的_id,作为key
        dataSource={roles}
        columns={columns}
        rowSelection={rowSelection}
        onRow={onRow}
      />
      <Modal title="添加角色" 
        visible={isModalVisible === 1} 
        onOk={addRole} 
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(0);
        }}>
        <AddForm
          setForm={(getForm) => form=getForm}
        />
      </Modal>
      <Modal title="设置角色权限" 
        visible={isModalVisible === 2} 
        onOk={updateRole} 
        onCancel={handleCancleUpdate}>
        <AuthForm
          role={role}
          onCheck={handleCheck}
          menus={menus}
        />
      </Modal>
    </Card>
  )
}
