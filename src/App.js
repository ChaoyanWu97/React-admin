import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'antd/dist/antd.less';
import Login from './pages/login/login'
import Admin from './pages/admin/admin'


function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='login' element={<Login/>}></Route>
        <Route path='/*' element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
