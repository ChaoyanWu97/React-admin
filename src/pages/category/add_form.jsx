import React, {useEffect} from 'react';
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd';


// 添加分类的form组件
export default function AddForm(props) {
    const {categories, parentId, setForm} = props; 
    const {Option} = Select;
    const {Item} = Form;
    const [form] = Form.useForm();

    setForm(form);

    useEffect(() => {
      // console.log('useEffect', parentId);
      form.setFieldsValue({parentId});
    }, [form, parentId])
     
    return (
        <Form form={form}>
            <Item name='parentId'  >
                <Select>
                    <Option value='0'>一级分类</Option>
                    { categories.map( c => 
                              <Option value={c._id } key={c._id}>{c.name}</Option>) }
                </Select>
            </Item>
            <Item name='categoryName' 
              rules={[{required: true, message: '请输入分类名称'}]}
            >
                <Input placeholder='请输入分类名称'></Input>
            </Item>
        </Form>
    )
}

AddForm.propTypes = {
    categories: PropTypes.array.isRequired, // 一级分类数组
    parentId: PropTypes.string.isRequired, // 父分类Id
    setForm: PropTypes.func.isRequired, // 向父组件传递form对象
}
