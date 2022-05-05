import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

// 更新分类的form组件
export default function UpdateForm(props) {
    const {categoryName, setForm} = props;

    const [form] = Form.useForm();
    setForm(form);

    // 提交表单且数据验证失败后回调事件
    // const onFinishFailed = (errorInfo) => {
    //     ('表单数据校验失败' + errorInfo);
    // };
    
    useEffect(()=> {
        // console.log('effect');
        form.setFieldsValue({categoryName});
    }, [categoryName, form])

    return (
        <Form form={form}  >
            <Form.Item name='categoryName' 
                rules={[{required: true, message: '分类名称必须输入！'}]} >
                <Input placeholder='请输入分类名称'></Input>
            </Form.Item>
        </Form>
    )
}

UpdateForm.propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
}
