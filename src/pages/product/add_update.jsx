import React, { createRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Form, Space, Cascader, InputNumber, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqAddOrUpdateProduct, reqCategory } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';

/**
 * 产品的添加和修改子路由
 */
let isUpdate;
let product = null;
let getImgs; // 保存upload的图片
export default function ProductAddUpdate() {

  const [options, setOptions] = useState([]); // 需要显示的列表数据

  const navigate = useNavigate(-1);
  const location = useLocation();

  const editor = createRef();

  const [form] = Form.useForm()

  // 指定Item布局的配置对象
  const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 8},
  }

  // Card的title
  const title = (
    <Space>
      <Button type='link' onClick={() => navigate(-1)}>
      <ArrowLeftOutlined style={{color:'green', fontSize:20}}/>
    </Button>
    <span>{isUpdate ? '修改商品' : '添加商品'} </span>
    </Space>
  )
  
  // ============动态加载商品分类组件 <LazyOptions>=============
  product = location.state;
  isUpdate = !!product;
  product = product || {}

  const {pCategoryId, categoryId} = product;

  // 如果是修改商品, 记录商品的类和父类,
  let categoryIds = [] // 接收级联分类的数组, 作为Cascader的初始值
  if (isUpdate) {
    // 商品是个一级分类
    if (pCategoryId === '0'){
      categoryIds.push(categoryId);
    }else{
      // 商品是个二级分类
      categoryIds.push(pCategoryId);
      categoryIds.push(categoryId);
    }
  }

  // 异步获取一级/二级分类列表显示
  const getCategories  = async (parentId) => {
    const result = await reqCategory(parentId);
    if (result.status === 0) {
      // 取出分类数组(可能是一级/二级)
      const categories = result.data;
      if (parentId === '0') initOptions(categories);
      else return categories;
    } else {
      message.error('获取分类列表失败');
    }
  }

  // 初始化下拉列表
  const initOptions = async (categories) => {
    const optionList = categories.map( c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    const {pCategoryId} = product;

    // 如果是修改商品,且商品是二级分类
    if (isUpdate && pCategoryId !== '0'){
      // 获取二级分类列表
      const subCategories = await getCategories(pCategoryId);

      // 生成二级下拉列表options
      const childOptions = subCategories.map( c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      // 找到当前商品对应的一级options对象
      const targetOption = optionList.find(opt => opt.value === pCategoryId)
      // 关联对应的一级option上
      targetOption.children = childOptions;
    }
    setOptions(optionList);
  }

  // 选择某个列表项，加载下一级列表的回调
  const loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];

    targetOption.loading = true;

    // 根据选中的分类获取二级分类列表
    // load options lazily
    const categories = await getCategories(targetOption.value);
    targetOption.loading = false;
    
    if (categories && categories.length) {
      // 生成一个二级列表的options
      const childOptions = categories.map( c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      // 关联到当前的option上
      targetOption.children = childOptions;
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }
    setOptions([...options]);
  };

  // 商品分类改变的回调
  const onOptionChange = (value) => {
    categoryIds = value;
  }


  // 提交表单且数据验证成功后回调事件
  const onFinish = async (values) => {

    // 收集数据,并封装成product对象
    const {productName, price, desc } = values;
    const detail = editor.current.getDetail()
    const imgs = getImgs;
    let pCategoryId, categoryId; 
    if (categoryIds.length === 1) {
      categoryId = categoryIds[0];
      pCategoryId = '0';
    } else {
      [pCategoryId, categoryId] = categoryIds;
    }
    const newProcuct = {name:productName, price, desc, categoryId, pCategoryId, detail, imgs};
    if (isUpdate) newProcuct._id = product._id;

    // 调用接口请求函数去添加/更新
    const result = await reqAddOrUpdateProduct(newProcuct);

    // 根据结果提示
    if (result.status === 0) {
      message.success(`${isUpdate? '更新' : '添加'}商品成功!`);
      // navigate(-1);
    } else {
      message.error(`${isUpdate? '更新' : '添加'}商品失败!`);
    }
  };

  useEffect(() => {
    // 首次渲染后, 获取一级分类列表
    getCategories('0');
    
    // 为表单设置默认值
    if (!isUpdate) return;
    const {name, desc, price} = product;
    form.setFieldsValue({
      productName: name,
      desc,
      price,
      category: categoryIds,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const {Item} = Form;
  return (
    <Card title={title}>
      <Form form={form} {...formItemLayout} onFinish={onFinish}>
        <Item label='商品名称' name='productName'
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder='商品名称' />
        </Item>
        <Item label='商品描述' name='desc'
          rules={[{ required: true, message: '请输入商品描述' }]}
        >
          <Input.TextArea rows={3} placeholder="商品描述"/>
          
        </Item>
        <Item label='商品价格' name='price'
          rules={[
            { required: true, message: '请输入商品价格' },
            { validator: ( _ , value) => 
                value*1 <= 0 
                ? Promise.reject(new Error('价格必须大于0'))
                :Promise.resolve()
            },
          ]}
        >
          <InputNumber addonAfter="元"/>
        </Item>
        <Item label='商品分类' name='category'
          rules={[{ required: true, message: '请指定商品分类' }]}>
          <Cascader 
            placeholder='请指定商品分类'
            options={options} 
            loadData={loadData} 
            onChange={onOptionChange}
          />
        </Item>
        <Item label='商品图片' name='imgs'>
          <PicturesWall initImgs={product.imgs} setImgs={(imgs) => {getImgs=imgs}} />
        </Item>
        <Item label='商品详情' name='detail' labelCol={{span: 2}} wrapperCol={{span: 20}}
        >
         <RichTextEditor onRef={editor} initDetail={product.detail} />
        </Item>
        <Item>
          <Button type='primary' htmlType="submit" >提交</Button>
        </Item>
      </Form>
    </Card>    
  )
}
