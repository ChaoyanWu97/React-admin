import React, { useMemo, useState } from 'react';
import { message, Modal, Upload } from 'antd';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../config/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 用于图片上传的组件 
 */
export default function PicturesWall(props)  {
  const {setImgs} = props;
  const initURLs = props.initImgs;

  let initalImgs = []
  if (initURLs && initURLs[0]){
    initalImgs = initURLs.map((img, index) => ({
    uid: `-${index+1}`, // 每个file都有唯一的id, 建议使用负数, 避免和内部id产生冲突
    name: img, // 图片地址
    status: 'done', // 图片状态: done uploading removed success error
    url: BASE_IMG_URL + img,
    }))
  }

  const [fileList, setFileList] = useState(initalImgs);
  const [previewVisible, setPreviewVisible] = useState(false); // 是否显示大图预览modal
  const [previewImage, setPreviewImage] = useState(''); // 大图的url

  // 上传中、完成、失败都会调用这个函数。
  const onChange = async ({file,  fileList: newFileList }) => {
    // 一旦上传成功, 将当前上传的file的信息修正(name, url)
    if (file.status === 'done') {
      const result = file.response;
      if (result.status === 0){
        message.success('上传图片成功')
        file.name = result.data.name;
        file.url = result.data.url;
        console.log('file.url', file.url);
      }else{
        message.error('上传图片失败')
      }
    } else if ((file.status === 'removed')) {
      // 删除后台的图片
      const result = await reqDeleteImg(file.name);
      console.log(result);
      if (result.status === 0) {
        message.success('删除图片成功');
      } else {
        message.error('删除图片失败');
      }
    }
    setFileList(newFileList);
  };

  const onPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  }

  const imgs = useMemo(() => fileList.map(f => f.name), [fileList])
  // useMemo(() => console.log('fileList', fileList), [fileList])

  setImgs(imgs || []); // 将上传的图片传递给父组件


  return (
    <div> 
      <Upload
        accept='image/*' // 接收图片格式
        action="/manage/img/upload" // 上传图片的接口地址
        listType="picture-card" // 上传列表的内建样式
        name='image' // 发到后台的文件参数名
        fileList={fileList} // 所有已上传文件对象的数组
        onChange={onChange} // 上传中、完成、失败都会调用这个函数
        onPreview={onPreview}
      >
        {fileList.length < 2 && '+ Upload'}
    </Upload>
    <Modal 
      visible={previewVisible} 
      footer={null} 
      onCancel={()=>setPreviewVisible(false)}
    >
      <img src={previewImage} alt="exmple" style={{width:'100%'}}/>
    </Modal>
  </div>
  );
};
