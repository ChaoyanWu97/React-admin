import React, { useState } from 'react';
import {
  Card,
  Statistic,
  DatePicker,
  Timeline
} from 'antd';
import { QuestionCircleOutlined, ArrowDownOutlined, ArrowUpOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment'
import './home.less';
import SalesLine from './sales-line';
import Bar from './bar'

const dateFormat = 'YYYY/MM/DD'
const {RangePicker} = DatePicker


export default function Home() {

  const [isVisited, setIsVisited] = useState(true)

  const handleChange = (isVisited) => {
    return () => setIsVisited(isVisited)
  }

  return (
    <div className='home'>
      <Card
        className="home-card"
        title="商品总量"
        extra={< QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)'}} />}
        style={{width: 250}}
        headStyle={{color: 'rgba(0,0,0,.45)'}}
      >
        <Statistic
          value={1128163}
          suffix="个"
          style={{fontWeight: 'bolder'}}
        />
        <Statistic
          value={15}
          valueStyle={{fontSize: 15}}
          prefix={'周同比'}
          suffix={<div>%<ArrowDownOutlined style={{color: 'red', marginLeft: 10}}/></div>}
        />
        <Statistic
          value={10}
          valueStyle={{fontSize: 15}}
          prefix={'日同比'}
          suffix={<div>%<ArrowUpOutlined style={{color: '#3f8600', marginLeft: 10}} /></div>}
        />
      </Card>

      <SalesLine/>

      <Card
        className="home-content"
        title={<div className="home-menu">
          <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
            onClick={handleChange(true)}>访问量
          </span>
          <span className={isVisited ? "" : 'home-menu-active'} onClick={handleChange(false)}>销售量</span>
        </div>}
        extra={<RangePicker
          defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
          format={dateFormat}
        />}
      >
        <Card
          className="home-table-left"
          title={isVisited ? '访问趋势' : '销售趋势'}
          bodyStyle={{padding: 0, height: 275}}
          extra={<ReloadOutlined />}
        >
          <Bar/>
        </Card>

        <Card title='任务' extra={<ReloadOutlined/>} className="home-table-right">
          <Timeline>
            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
            <Timeline.Item color="red">
              <p>联调接口</p>
              <p>功能验收</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>登录功能设计</p>
              <p>权限验证</p>
              <p>页面排版</p>
            </Timeline.Item>
          </Timeline>
        </Card>
    </Card>
    </div>
  )
}
