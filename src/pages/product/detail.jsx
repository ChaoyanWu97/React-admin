import React, { useEffect, useState } from 'react'
import { Button, Card, List, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_IMG_URL } from '../../config/constants';
import { reqOneCategory } from '../../api';
/**
 * 产品的详情路由
 */
export default function ProductDetail() {

  const [cName1, setCName1] = useState(''); // 一级分类名称
  const [cName2, setCName2] = useState(''); // 二级分类名称

  const navigate = useNavigate();
  const location = useLocation();

  const {name, desc, price, detail, imgs} = location.state;

  const title = (
    <Space>
      <Button type='link' onClick={() => navigate(-1)}>
        <ArrowLeftOutlined style={{color:'green'}}/>
      </Button>
      <span>商品详情</span>
    </Space>
  )



  useEffect(() => {
    // 当前商品的分类Id和父分类Id
    const {pCategoryId, categoryId} = location.state;

    const getCategory = async(pCategoryId, categoryId) => {
      if (pCategoryId === '0'){ // 一级分类下的商品
        const result = await reqOneCategory(categoryId)
        setCName1(result.data.name)
      } else { // 二级分类下的商品
        const [result1, result2] = await Promise.all([reqOneCategory(pCategoryId), reqOneCategory(categoryId)])
        setCName1(result1.data.name)
        setCName2(result2.data.name)
      }
    }

    getCategory(pCategoryId, categoryId)
  })

  return (
    <Card title={title} className='product-detail'>
      <List
        bordered
      >
        <List.Item>
          <span className='product-detail-left'>商品名称：</span>
          {name}
        </List.Item>
        <List.Item>
          <span className='product-detail-left'>商品描述：</span>
          {desc}
        </List.Item>
        <List.Item>
          <span className='product-detail-left'>商品价格：</span>
          {price}元
        </List.Item>
        <List.Item>
          <span className='product-detail-left'>所属分类：</span>
          {cName1}   {cName2 ? `--> ${cName2}` : ''}
        </List.Item>
        <List.Item>
          <div>
            <span className='product-detail-left'>商品图片：</span>
            {
              imgs.map(img => (
                <img key={img} src={BASE_IMG_URL+img} alt='img' className='product-img'/>
              ))
            }
          </div>
        </List.Item>
        <List.Item>
          <div>
            <span className='product-detail-left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: detail}}/>
          </div>
        </List.Item>
      </List>
    </Card>
  )
}
