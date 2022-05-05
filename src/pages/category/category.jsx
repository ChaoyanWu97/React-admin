import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { reqAddCategory, reqCategory, reqUpdateCategory } from '../../api';
import AddForm from './add_form';
import UpdateForm from './update_form';

let curCategory = {name:''};
let getform = null;
let added = false;
export default function Category() {
  const [loading, setLoading] = useState(false); // 在获取数据中
  const [parentId, setParentId] = useState('0'); // 需要显示当前分类列表的父类id
  const [parentName, setParentName] = useState('') // 需要显示当前分类列表的父类名称
  const [subCategories, setSubCategories] = useState([]); // 二级分类列表
  const [categories, setCategories] = useState([]); // 一级分类列表
  const [isModalVisible, setIsModalVisible] = useState(0); // 标识添加/修改的确认框是否显示,0: 都不显示, 1: 显示添加, 2显示修改

  // 请求获取一级或二级分类列表
  const getCategory = async (parentId) => {
    setLoading(true);
    const result = await reqCategory(parentId);
    setLoading(false);
    if (result.status === 0) {
      // 取出分类数组(可能是一级/二级)
      const categories = result.data;
      if (parentId === '0') {
        setCategories(categories);
      }else setSubCategories(categories);
    } else {
      message.error('获取分类列表失败');
    }
  };
  // 显示二级分类列表
  const showSubCategories = (category) => {
    const {name, _id} = category;
    setParentId(_id);
    setParentName(name);
    // console.log(name, _id);
  };
  // 显示一级分类列表
  const showCategories = () => {
    setParentId('0');
  }
  
  // 显示添加的确认框   
  const showAdd = () => {
    setIsModalVisible(1);
  }
  // 添加分类
  const addCategory = () => {
    // 触发表单验证
    getform.validateFields().then(async (values) => {
      // 隐藏对话框
      setIsModalVisible(0);
      // 获取parentId，categoryName发送添加分类请求
        // 收集数据
        const {parentId:add_parentId, categoryName} = values;
        // 提交添加分类请求
        const result = await reqAddCategory(add_parentId, categoryName);
        if (result.status === 0) {
          added = true;
          if (parentId === add_parentId){
            // 更新分类列表
            getCategory(parentId);
          } 
        }
      // 清除input框中的输入数据
      getform.resetFields();
    }).catch(error => {
      message.error(error.errorFields[0].errors);
    })
  };

  // 显示确认更新对话框
  const showUpdate = (category) => {
    curCategory = category ;
    setIsModalVisible(2);
  }
  // 更新分类
  const updateCategory =  () => {
    // 触发表单验证，只有通过了才处理
    getform.validateFields().then(async (values) => {
      // 1、隐藏确认框
      setIsModalVisible(0);
      // 2、发请求更新分类
      const categoryId = curCategory._id;
      const {categoryName} = values;
      const result = await reqUpdateCategory(categoryId, categoryName)
      if (result.status === 0) {
        // 3、重新显示列表
        getCategory(curCategory.parentId);
      }   
    }).catch(error => {
      message.error(error.errorFields[0].errors);
    })   
  };
  
  // 点击取消添加的回调
  const handleCancelAdd = () => {
    //添加：
    getform.setFieldsValue({categoryName:''});
    // 隐藏确认框
    setIsModalVisible(0);
  };

    // 点击取消修改的回调
  const handleCancelUpdate = () => {  
    //更新：
    getform.setFieldsValue({categoryName: curCategory.name});
    // 隐藏确认框
    setIsModalVisible(0);
  };

  // card左侧侧标题
  const title = parentId==='0'  ? '一级分类列表' 
    :  (
      <>
        <Button type='link' onClick={showCategories}>一级分类列表</Button> 
        <ArrowRightOutlined style={{marginRight:10}}/> 
        {parentName}
      </>
    ) ;
  //  card右侧
  const extra = (
    <Button type="primary" onClick={showAdd} icon={<PlusOutlined/> }>
      添加
    </Button>
  )
  // 设置table的列
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name', // dataIndex 和 dataSource 中的属性对应
    },
    {
      title: '操作',
      width: 300,
      render: (category) => (
        <Space size="middle">
          <Button  type='link' onClick={() => showUpdate(category)}>修改分类</Button>
          {parentId === '0' 
          ? <Button  type='link' onClick={() => showSubCategories(category)} >查看子分类</Button> 
          : null}
        </Space>
      ),
    },
  ];

  useEffect(()=>{
    // 查看一级列表时，不需要更新的情况：
    // 不是第一次请求，且没有添加：
    if (parentId === '0' && categories.length && !added) return;
    // 查看二级列表时，不需要更新的情况
    // 不是第一次请求，状态中保存的分类列表和要查看的列表父类相同，且父类没有被添加新项
    if (parentId !== '0'){
      if (subCategories.length && subCategories[0].parentId === parentId && !added){
        return;
      }
    }
    getCategory(parentId);
    added = false;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  return (
    <Card title={title} extra={extra} >
      <Table 
        dataSource={parentId === '0' ? categories : subCategories} 
        columns={columns} 
        bordered
        rowKey='_id'
        loading={loading}
        pagination={{ 
          defaultPageSize:5,
          hideOnSinglePage:true,
          showQuickJumper:true,
         }}
      />
      <Modal title="添加分类" 
        visible={isModalVisible === 1} 
        onOk={addCategory} 
        onCancel={handleCancelAdd}>
        <AddForm
          categories={categories}
          parentId={parentId}
          setForm={(form) => {getform = form}}
        />
      </Modal>
      <Modal 
        title="修改分类" 
        visible={isModalVisible === 2} 
        onOk={updateCategory} 
        onCancel={handleCancelUpdate}>
        <UpdateForm 
          categoryName={curCategory.name} 
          setForm={(form) => {getform = form}}
        />
      </Modal>
    </Card>
  )
}
