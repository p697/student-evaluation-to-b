import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../../actions/evalPartOngoing'
import { Layout, Table, Empty } from 'antd';
import UnFinishedModal from './components/UnFinishedModal'

import './index.scss'

function EvalPartOngoing(props) {
  const { force, academyId, level, current, pageSize, total, tableData, getEvalPartOngoingTableData } = props
  const [loading, setLoading] = useState(false)
  const [unFinishedState, setUnFinishedState] = useState({
    visible: false,
    className: '',
    clazzId: '',
  })

  // force是一个旗子。当force=true时说明需要在当前Table需要在非自动触发数据更新的条件下触发一次数据更新。
  if (force) {
    props.updateEvalPartOngoingState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      setLoading(true)
      getEvalPartOngoingTableData({ academyId, level, current, pageSize })
    }
  }, [force, academyId, level, current, pageSize, getEvalPartOngoingTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
  }, [tableData])

  const columns = [
    {
      title: '专业',
      dataIndex: 'majorName',
    },
    {
      title: '班级',
      dataIndex: 'clazzName',
    },
    {
      title: '开启时间',
      dataIndex: 'start',
    },
    {
      title: '完成人数',
      dataIndex: 'totalCount',
      render: (text, record) => record.submittedCount + '/' + record.totalCount
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'right',
      render: (text, record) => <button
        className="evalPartOngoing-table-btn"  // 用一下别人的样式，那个页面应该没意见吧？
        onClick={() => setUnFinishedState({ ...record, visible: true })}
      >查看未完成名单</button>
    },
  ];

  const handleTableTabChange = (pagination) => {
    props.updateEvalPartOngoingState({ ...pagination })
  }

  return (
    <Layout className="evalPartOngoing">
      <Table
        columns={columns}
        loading={loading}
        dataSource={tableData}
        pagination={{ current, pageSize, total }}
        onChange={handleTableTabChange}
        rowKey={record => record.clazzId}
        // size={tableSize}
        locale={{ emptyText: <Empty description='没有数据' /> }}
      />

      <UnFinishedModal 
        state={unFinishedState}
        setState={setUnFinishedState}
      />

    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.evalPartOngoing,
    academyId: state.login.academyId,
    level: state.login.level,
  };
}

export default connect(mapStateToProps, actions)(EvalPartOngoing)
