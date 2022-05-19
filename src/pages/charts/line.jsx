import React, { useState } from 'react'
import { Button, Card } from 'antd';
import ReactECharts from 'echarts-for-react'; 
/**
 * 图形图表-折线图图
 */
export default function Line() {

  const [sales, setSales] = useState([5, 20, 36, 10, 10, 20]);
  const [stores, setStores] = useState([6, 10, 25, 20, 15, 10]);

  const update = () => {
    setSales(sales.map(sale => sale+1));
    setStores(stores.map(store => store-1))
  }

  // 返回柱形图的配置对象
  const getOption = (sales, stores) => {
    return {
      xAxis: {
        type: 'category',
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      tooltip: {},
      yAxis: {
        type: 'value'
      },
      legend: {
        data:['销量', '库存']
      },
      series: [
        {
          name: '销量',
          data: sales,
          type: 'line',
        },
        {
          name: '库存',
          data: stores,
          type: 'line',
        },
      ]
    };
  }

  return (
    <div>
      <Card>
        <Button type='primary' onClick={update}>更新</Button>
      </Card>
      <Card title='柱形图'>
        <ReactECharts
          option={getOption(sales, stores)}
        />
      </Card>
    </div>
  )
}
