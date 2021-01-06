import React, { useState, useEffect } from 'react';
import { Layout, Table, Empty } from 'antd';
import { connect } from 'react-redux'
import * as actions from '../../../actions/evalAllResult'
import SiderList from '../../../components/SiderList'
import EvalResultDrawer from '../../../components/EvalResultDrawer'

import './index.scss'


function EvalAllResult(props) {
  const { force, current, pageSize, total, tableData, academyId, academyName, level, getEvalAllResultTableData } = props
  const [loading, setLoading] = useState(false)
  const [evalResultDrawerState, setEvalResultDrawer] = useState({
    visible: false,
    clazzName: '',
    clazzId: '',
  })

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
    props.updateEvalAllResultState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      setLoading(true)
      getEvalAllResultTableData({ academyId, level, current, pageSize })
    }
  }, [force, academyId, level, current, pageSize, getEvalAllResultTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
  }, [tableData])

  const columns = [
    {
      title: '学院',
      dataIndex: 'academyName',
    },
    {
      title: '班级',
      dataIndex: 'clazzName',
    },
    {
      title: '完成时间',
      dataIndex: 'end',
    },
    {
      title: '完成人数',
      dataIndex: 'submittedCount',
      render: (text, record) => {
        return record.submittedCount === record.totalCount ? `${text}/${record.totalCount}` : <div style={{ color: '#ff4d4f' }}>{`${text}/${record.totalCount}`}</div>
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => <button
        className="evalAllResult-table-operation-btn evalAllResult-table-operation-btn_blue"
        onClick={() => setEvalResultDrawer({ ...record, visible: true })}
      >查看详情</button>
    },
  ];

  const handleTableTabChange = (pagination) => {
    props.updateEvalAllResultState({ ...pagination })
  }

  const handleTableChange = (e) => {
    const { unitId, unitName, level } = e
    props.changeEvalAllResultTable({ academyId: unitId, academyName: unitName, level: level })
  }

  return (
    <Layout className="evalAllResult">
      <SiderList
        type='evalResult'
        academyId={academyId}
        level={level}
        academyName={academyName}
        onClick={handleTableChange}
      />
      <div className="evalAllResult-container">
        <Table
          columns={columns}
          loading={loading}
          dataSource={tableData}
          pagination={{ current, pageSize, total }}
          onChange={handleTableTabChange}
          rowKey={record => record.clazzId}
          size={tableSize}
          locale={{ emptyText: <Empty description='没有数据' /> }}
        />
      </div>

      <EvalResultDrawer
        entrance='evalAllResult'
        state={evalResultDrawerState}
        setState={setEvalResultDrawer}
      />

    </Layout>
  );
}

export default connect(state => state.evalAllResult, actions)(EvalAllResult)
