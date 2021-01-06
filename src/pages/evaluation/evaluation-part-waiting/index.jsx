import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import copy from 'copy-to-clipboard';
import * as actions from '../../../actions/evalPartWaiting'
import { Layout, Table, Empty, message } from 'antd';

import { evalPeriod } from '../../../config/index.config'
import './index.scss'

function EvalPartWaiting(props) {
  const { force, academyId, level, current, pageSize, total, tableData, getEvalPartWaitingTableData } = props
  const [loading, setLoading] = useState(false)

  // force是一个旗子。当force=true时说明需要在当前Table需要在非自动触发数据更新的条件下触发一次数据更新。
  if (force) {
    props.updateEvalPartWaitingState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      setLoading(true)
      getEvalPartWaitingTableData({ academyId, level, current, pageSize })
    }
  }, [force, academyId, level, current, pageSize, getEvalPartWaitingTableData])

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
        className="evalPartWaiting-table-btn"  // 用一下别人的样式，那个页面应该没意见吧？
        onClick={() => handleCopy(record)}
      >复制通知信息</button>
    },
  ];

  const handleCopy = ({ clazzName, start }) => {
    const aMoment = moment(start)
    const mouth = aMoment.month()
    const date = aMoment.date()
    const hour = aMoment.hour()
    const minute = aMoment.minute()
    const startTime = `${mouth}月${date}日${hour}:${minute}`
    aMoment.add(evalPeriod, 'hours')
    const mouth_ = aMoment.month()
    const date_ = aMoment.date()
    const hour_ = aMoment.hour()
    const minute_ = aMoment.minute()
    const endTime = `${mouth_}月${date_}日${hour_}:${minute_}`
    const text = `${clazzName}互评时间为${startTime}至${endTime}，请各位同学在规定时间段内进入系统，根据要求完成互评`
    if (copy(text)) {
      message.success('复制成功', 1)
    } else { message.error('复制失败') }
  }

  const handleTableTabChange = (pagination) => {
    props.updateEvalPartWaitingState({ ...pagination })
  }

  return (
    <Layout className="evalPartWaiting">
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
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.evalPartWaiting,
    academyId: state.login.academyId,
    level: state.login.level,
  };
}

export default connect(mapStateToProps, actions)(EvalPartWaiting)
