import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

// 读取local保存的user，保存到memory中
const user = storageUtils.getUser();
memoryUtils.user = user;

const root = createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode> */}
);

