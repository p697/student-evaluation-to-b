import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../../actions/evalPartFinished'
import { Layout, Table, Empty } from 'antd';
import EvalResultDrawer from '../../../components/EvalResultDrawer'

import './index.scss'

function EvalPartFinished(props) {
  const { force, academyId, level, current, pageSize, total, tableData, getEvalPartFinishedTableData } = props
  const [loading, setLoading] = useState(false)
  const [evalResultDrawerState, setEvalResultDrawer] = useState({
    visible: false,
    className: '',
    clazzId: '',
  })

  // force是一个旗子。当force=true时说明需要在当前Table需要在非自动触发数据更新的条件下触发一次数据更新。
  if (force) {
    props.updateEvalPartFinishedState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      setLoading(true)
      getEvalPartFinishedTableData({ academyId, level, current, pageSize })
    }
  }, [force, academyId, level, current, pageSize, getEvalPartFinishedTableData])

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
      title: '录入人数',
      dataIndex: 'totalCount',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'right',
      render: (text, record) => <button
        className="evalPartFinished-table-btn"
        onClick={() => setEvalResultDrawer({ ...record, visible: true })}
      >查看详情</button>
    },
  ];

  const handleTableTabChange = (pagination) => {
    props.updateEvalPartFinishedState({ ...pagination })
  }

  return (
    <Layout className="evalPartFinished">
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
      
      <EvalResultDrawer
        entrance='evalPartFinished'
        state={evalResultDrawerState}
        setState={setEvalResultDrawer}
      />

    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.evalPartFinished,
    academyId: state.login.academyId,
    level: state.login.level,
  };
}

export default connect(mapStateToProps, actions)(EvalPartFinished)
