import { Button, Card, Input, message, Select, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { reqProducts, reqSearchProducts, reqSwitchProductStatus } from '../../api';
import {PAGE_SIZE} from '../../config/constants'
import { useNavigate } from 'react-router-dom';
/**
 * Product的默认子路由组件
 */
// let columns = null;
let curPage = 1;
export default function ProductHome() {
  const [products, setProdusts] = useState([]); // 商品数组
  const [total, setTotal] = useState(0); // 商品总数
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState(''); // 搜索关键字
  const [searchType, setSearchType] = useState('productName'); // 搜索类型（按名称/描述搜索）

  const navigate = useNavigate();

  // 获取指定页码的列表数据显示
  const getProduct  = async (pageNum=1) => {
    setLoading(true);
    let result = null;
    if (searchName) { // 若搜索关键字有值, 提交搜索分页请求
      result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchType, searchName});
    } else{ // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE, );
    }
    setLoading(false);
    if (result.status === 0) {
      const {total, list} = result.data;
      setTotal(total);
      setProdusts(list);
      // console.log('setState');
    }
  }

  const switchProductStatus = async (product) => {
    const {status, _id} = product;
    const result = await reqSwitchProductStatus(_id,  status===1 ? 2 : 1);
    if (result.status === 0) {
      message.success('更新商品状态成功');
      // 获取当前页的列表数据
      getProduct(curPage);
    } 
  }

  // 初始化table的列的数组
  const initColums = () => {
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => `￥${price}`,
      },
      {
        width: 100,
        title: '状态',
        dataIndex: 'status',
        render: (status, product) => (
          <span>
            <div>{status === 1 ? '在售' : '已下架'}</div>
            <Button 
              type='primary' 
              onClick={ () => switchProductStatus(product) }
            >
              {status === 1 ? '下架' : '上架'}
            </Button>
          </span>
        ),
      },
      {
        width: 100,
        title: '操作',
        render: (product) => (
          <span>
            <Button onClick={()=> navigate('/product/detail', {state: product})} type='link'>详情</Button>
            <Button onClick={()=> navigate('/product/addupdate', {state: product})}  type='link'>修改</Button>
          </span>
        ),
      }, 
    ];
    return columns;
  }




  useEffect(() => {
    if (products.length) return;
    getProduct(curPage)
    // console.log('useEffect requst');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]) // 只有首次render后执行

  const {Option} = Select;
  const title = (
    <Space>
      <Select value={searchType} style={{width: 150}} onChange={value => setSearchType(value)}>
        <Option value='productName'>按名称搜索</Option>
        <Option value='productDesc'>按描述搜索</Option>
      </Select>
      <Input placeholder='关键字'  style={{width: 150}} value={searchName}
        onChange={e => {setSearchName(e.target.value)}}
      />
      <Button onClick={()=>getProduct()} type='primary'>搜索</Button>
    </Space>
  );
  const extra = (
    <Button type='primary' onClick={() => navigate('/product/addupdate')}> 
      <PlusOutlined/> 
      添加商品 
    </Button>
  )


  return (
    <Card title={title} extra={extra} bordered={false} >
      <Table 
        bordered
        dataSource={products} columns={initColums()} 
        rowKey='_id'
        loading={loading}
        pagination={{
          total, 
          defaultCurrent:curPage,
          defaultPageSize: PAGE_SIZE, 
          showQuickJumper:true,
          onChange: (pageNum) => {
            getProduct(pageNum);
            curPage = pageNum;
          }
        }}
      />
    </Card>
  )
}
