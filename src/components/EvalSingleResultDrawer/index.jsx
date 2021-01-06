import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Drawer, Table, Empty, Tabs } from 'antd'
import { LeftOutlined } from '@ant-design/icons';

import './index.scss'

const { TabPane } = Tabs;

function SingleResultDrawer(props) {
  const { setState, tab, force, current, pageSize, total, tableData, getSingleResultDrawerTableData } = props
  const { visible, name, sid } = props.state
  const [loading, setLoading] = useState(false)

  const windowSize = window.screen.height
  let tableSize = ''
  if (windowSize < 880) {
    tableSize = 'small'
  }
  else if (windowSize < 1000) {
    tableSize = 'middle'
  }

  // force是一个旗子。当force=true时说明需要在当前Table需要在非自动触发数据更新的条件下触发一次数据更新。
  if (force) {
    props.updateSingleResultDrawerState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force && visible) {
      getSingleResultDrawerTableData({ tab, sid, current, pageSize })
    }
  }, [tab, force, visible, sid, current, pageSize, getSingleResultDrawerTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
  }, [tableData])

  const columns = [
    {
      title: '学号',
      dataIndex: tab.toString() === '1' ? 'sno' : 'bySno',
    },
    {
      title: '姓名',
      dataIndex: tab.toString() === '1' ? 'name' : 'byName',
    },
    {
      title: '德',
      children: [
        {
          title: '优',
          dataIndex: 'morality95',
          render: (text) => text ? '√' : ''
        },
        {
          title: '良',
          dataIndex: 'morality85',
          render: (text) => text ? '√' : ''
        },
        {
          title: '中',
          dataIndex: 'morality70',
          render: (text) => text ? '√' : ''
        },
        {
          title: '差',
          dataIndex: 'morality60',
          render: (text) => text ? '√' : ''
        },
      ]
    },
    {
      title: '体',
      children: [
        {
          title: '优',
          dataIndex: 'physical95',
          render: (text) => text ? '√' : ''
        },
        {
          title: '良',
          dataIndex: 'physical85',
          render: (text) => text ? '√' : ''
        },
        {
          title: '中',
          dataIndex: 'physical70',
          render: (text) => text ? '√' : ''
        },
        {
          title: '差',
          dataIndex: 'physical60',
          render: (text) => text ? '√' : ''
        },
      ]
    },
    {
      title: '能',
      children: [
        {
          title: '优',
          dataIndex: 'ability95',
          render: (text) => text ? '√' : ''
        },
        {
          title: '良',
          dataIndex: 'ability85',
          render: (text) => text ? '√' : '',
        },
        {
          title: '中',
          dataIndex: 'ability70',
          render: (text) => text ? '√' : '',
        },
        {
          title: '差',
          dataIndex: 'ability60',
          render: (text) => text ? '√' : '',
        },
      ]
    },
  ];

  const handleTableTabChange = (pagination) => {
    setLoading(true)
    props.updateSingleResultDrawerState({ ...pagination })
  }

  function changeTab(key) {
    props.updateSingleResultDrawerState({ tab: key, tableData: [] })
  }

  const Header = () => {
    return (
      <div className="singleResultDrawer-header">
        <div className="singleResultDrawer-header-left" onClick={() => setState({ visible: false, sid: sid })}>
          <LeftOutlined style={{ marginRight: 12 }} />
          {name}
        </div>
        <div className="singleResultDrawer-header-right">
          <Tabs defaultActiveKey={tab} onChange={changeTab} className="singleResultDrawer-header-right-tab" size='large' >
            <TabPane tab="评价详情" key={1}></TabPane>
            <TabPane tab="被评价详情" key={2}></TabPane>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <Drawer
      title={<Header />}
      placement="right"
      closable={false}
      onClose={() => setState({ visible: false, sid: sid })}
      visible={visible}
      width={'100vw'}
    >
      <div className="resultDrawer">
        <Table
          columns={columns}
          loading={loading}
          dataSource={tableData}
          pagination={{ current, pageSize, total }}
          onChange={handleTableTabChange}
          rowKey={record => tab.toString() === '1' ? record.name : record.byName}
          size={tableSize}
          locale={{ emptyText: <Empty description='暂无数据' /> }}
        />
      </div>
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    ...state.singleResultDrawer,
  };
}

export default connect(mapStateToProps, actions)(SingleResultDrawer)
