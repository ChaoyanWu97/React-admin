import React from 'react';
import { Form, Input } from 'antd';

// 添加角色的form组件
export default function AddForm(props) {

  const {setForm} = props;
  const [form] = Form.useForm();
  setForm(form)

  const {Item} = Form;

  return (
    <Form form={form}>
        <Item name='roleName' 
          label='角色名称：'
          rules={[{required: true, message: '请输入角色名称'}]}
        >
          <Input placeholder='请输入角色名称'></Input>
        </Item>
    </Form>
  )
}


