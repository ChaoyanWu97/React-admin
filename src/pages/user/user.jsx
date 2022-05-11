import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal, Space, Table, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PAGE_SIZE } from '../../config/constants';
import { formateData } from '../../utils/dateUtils';
import { reqUsers, reqDeleteUser, reqAddUser, reqUpdateUser } from "../../api";
import AddOrUpdate from "./add-or-update";

/**
 * 用户管理
 */
export default function User() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const roleNames = useRef('');
  const form = useRef(null);
  const isUpdate = useRef(false);
  const selectedUser = useRef(null)

  // 根据roles数组，生成所有包含角色名的对象（属性名：role的id值，属性值role的name）
  const initRoleNames = (roles) => {
    roleNames.current = roles.reduce((pre, role)=>{
      pre[role._id] = role.name;
      return pre;
    }, {});
  }

  // 获取用户列表
  const getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const {users, roles} = result.data;
      initRoleNames(roles)
      setUsers(users);
      setRoles(roles);
    }
  }

  // 删除用户
  const deleteUser = async (user) => {
    const {confirm} = Modal;
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定删除用户“${user.username}”吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success('成功删除用户');
          // 获取新的用户列表
          getUsers();
        }
      },
    })
  }

  // 显示修改用户的modal
  const showUpdate = (user) => {
    setIsModalVisible(true);
    selectedUser.current = user;
  }
  // 显示创建用户的modal
  const showAdd = () => {
    setIsModalVisible(true);
    selectedUser.current = null;
  }

  // 添加或更新用户
  const addOrUpdate = async () => {

    setIsModalVisible(false);

    const user = form.current.getFieldsValue();

    if (selectedUser.current) { // 修改用户
      user._id = selectedUser.current._id;
      const result = await reqUpdateUser(user);
      if (result.status === 0) {
        message.success('修改用户成功');
        const newUsers = users.map(u => u._id === user._id ? result.data : u);
        setUsers(newUsers);
        // getUsers()
      } 
    } else { // 创建用户
      const result = await reqAddUser(user);
      if (result.status === 0) {
        message.success('添加用户成功');
        setUsers([...users, result.data]);
        // getUsers()
      } 

    }
    
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: formateData,
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: role_id => roleNames.current[role_id]
    },
    {
      title: '操作',
      render: (user) => (
        <Space>
          <Button type='link' onClick={()=>showUpdate(user)}>修改</Button>
          <Button type='link' onClick={()=>deleteUser(user)}>删除</Button>
        </Space>
      )
    },
  ]

  useEffect(()=>{
    getUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const title = <Button type='primary' onClick={showAdd}>创建用户</Button>
  return (
    <Card
      title={title}
    >
      <Table
        bordered
        rowKey='_id'
        columns={columns}
        dataSource={users}
        pagination={{defaultPageSize: PAGE_SIZE}}
      />
      <Modal title={isUpdate.current?'修改用户':'创建用户'}
        visible={isModalVisible}
        onOk={addOrUpdate}
        onCancel={()=>{
          setIsModalVisible(false)
        }}
      >
        <AddOrUpdate
          setForm={getForm => form.current = getForm}
          roles={roles}
          user={selectedUser.current || {}}
        />
      </Modal>
    </Card>
  )
}
