import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductAddUpdate from './add_update';
import ProductDetail from './detail';
import ProductHome from './home';
import './product.less';

/**
 * 商品路由
 */
export default function Product() {
  return (
    <Routes>
      <Route path='' element={<ProductHome/>}/>
      <Route path='addupdate' element={<ProductAddUpdate/>}/>
      <Route path='detail' element={<ProductDetail/>}/>
      <Route path='/*' element={<Navigate to='/product' />}/>
    </Routes>
  )
}
