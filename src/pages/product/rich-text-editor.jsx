import React, { useState, useImperativeHandle } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default function RichTextEditor (props){

  const {onRef, initDetail:html} = props;

  let editorInitState
  if (html) {  // 编辑器里有初始值
    const contentBlock = htmlToDraft(html); 
    if (contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorInitState = EditorState.createWithContent(contentState);
    }
  } else { // 编辑器里没有初始值
    editorInitState=EditorState.createEmpty();
  }

  const [editorState, setEditorState] = useState(editorInitState)

  // 输入过程中实时的回调
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  };

  const uploadImageCallBack = (file) => {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/manage/img/upload');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        const url = response.data.url; // 得到图片地址
        resolve({data:{link:url}});
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

  useImperativeHandle(onRef, () => ({getDetail}))

  // 得到html格式的文本
  const getDetail = () => draftToHtml(convertToRaw(editorState.getCurrentContent()))

  return (
    <Editor
      editorState={editorState}
      editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft:10}}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true}}
      }}
    />
  );

}