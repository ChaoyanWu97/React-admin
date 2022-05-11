import React, { useEffect }  from 'react';
import { Form, Input, Select } from 'antd';

const {Item} = Form;
const {Option} = Select;

/**
 * 添加或修改用户的组件
 */
export default function AddOrUpdate(props) {

  const {setForm, roles,  user} = props;

  const [form] = Form.useForm();

  setForm(form);

  useEffect(()=>{
    if (user._id) form.setFieldsValue(user);
    else form.resetFields();
  }, [form, user]);

  return (
    <Form form={form} labelCol={{span:5, }} wrapperCol={{span:16}}>
      <Item name='username' 
        label='用户名：'
        rules={[{required: true, message: '请输入用户名'}]}
      >
        <Input placeholder='请输入用户名'></Input>
      </Item>
      <Item name='password' 
        label='密码：'
        rules={[{required: true, message: '请输入密码'}]}
      >
        <Input placeholder='请输入密码'></Input>
      </Item>
      <Item name='phone' 
        label='手机号：'
      >
        <Input placeholder='请输入手机号'></Input>
      </Item>
      <Item name='email' 
        label='邮箱：'
      >
        <Input placeholder='请输入邮箱'></Input>
      </Item>
      <Item name='role_id' 
        label='角色：'
      >
        <Select placeholder='请输选择角色'>
          {
            roles.map(role => 
              <Option key={role._id} value={role._id}>{role.name}</Option>
            )
          }
        </Select>
      </Item>
    </Form>
  )
}
