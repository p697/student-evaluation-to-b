import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Layout, Table, Tag, Select, Button, message, Modal, Empty } from 'antd';
import { FieldTimeOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import * as actions from '../../../actions/evalAllSchedule'
import SiderList from '../../../components/SiderList'
import StartTimeModal from './components/start-time-modal'
import EndTimeModal from './components/end-time-modal'
import EvalResultDrawer from '../../../components/EvalResultDrawer'

import './index.scss'

const { confirm } = Modal

function EvalAllSchedule(props) {
  const { force, current, pageSize, total, tableData, academyId, academyName, level, status, end, selectedRowKeys, getEvalAllScheduleTableData, getEvalEndTime } = props
  const [loading, setLoading] = useState(false)
  const [startTimeModalState, setStartTimeModalState] = useState({
    visible: false,
    clazzId: '',
    className: '',
    level: '',
    start: '',
    mult: [],
  })
  const [endTimeModalState, setEndTimeModalState] = useState({
    visible: false,
    end: '',
  })
  const [evalResultDrawerState, setEvalResultDrawer] = useState({
    visible: false,
    className: '',
    clazzId: '',
  })

  const { Option } = Select;

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
    props.updateEvalAllScheduleState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      setLoading(true)
      getEvalAllScheduleTableData({ academyId, level, status, current, pageSize })
    }
  }, [force, academyId, level, status, current, pageSize, getEvalAllScheduleTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
    // console.log('Table刷新')
    // console.log(tableData)
  }, [tableData])

  // 首次渲染，获取截止时间
  useEffect(() => {
    getEvalEndTime()
  }, [getEvalEndTime])

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return <Tag color="red">未设置</Tag>
          case 1:
            return <Tag color="gold">未开始</Tag>
          case 2:
            return <Tag color="blue">进行中</Tag>
          case 3:
            return <Tag color="green">已完成</Tag>
          default:
            break;
        }
      }
    },
    {
      title: '学院',
      dataIndex: 'academyName',
    },
    {
      title: '班级',
      dataIndex: 'clazzName',
    },
    {
      title: '完成人数',
      dataIndex: 'submittedCount',
      render: (text, record) => {
        return text + '/' + record.totalCount
      }
    },
    {
      title: '开启时间',
      dataIndex: 'start',
      render: (text, record) => {
        return text ? record.start : '---'
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return <button className="evalAllSchedule-table-operation-btn evalAllSchedule-table-operation-btn_blue"
              onClick={() => setStartTimeModalState({ ...record, level: level, visible: true, mult: [] })}
            >设置时间</button>
          case 1:
            return <button className="evalAllSchedule-table-operation-btn evalAllSchedule-table-operation-btn_blue"
              onClick={() => setStartTimeModalState({ ...record, level: level, visible: true, mult: [] })}
            >修改时间</button>
          case 2:
            return <button className="evalAllSchedule-table-operation-btn evalAllSchedule-table-operation-btn_red"
              onClick={() => handleCloseSchedule(record)}
            >强制结束</button>
          case 3:
            return <button className="evalAllSchedule-table-operation-btn evalAllSchedule-table-operation-btn_blue"
              onClick={() => setEvalResultDrawer({ ...record, visible: true })}
            >查看详情</button>
          default:
            break;
        }
      }
    },
  ];

  const handleTableTabChange = (pagination) => {
    props.updateEvalAllScheduleState({ ...pagination })
  }

  const handleTableChange = (e) => {
    const { unitId, unitName, level } = e
    props.changeEvalAllScheduleTable({ academyId: unitId, academyName: unitName, level: level })
  }

  const handleSelectStatusChange = (value) => {
    props.updateEvalAllScheduleState({ status: value, current: 1 })
  }

  // 点击设置结束时间
  const handleClickEndTime = () => {
    setEndTimeModalState({
      visible: true,
      end: end,
    })
  }

  // 表中每行发生select事件
  const updateSelectedKey = (record, selected) => {
    const { clazzId, status } = record
    if (selected) {
      if (status !== 0 && status !== 1) {
        return message.warning('该状态的班级无法设置时间')
      }
      props.updateEvalAllScheduleState({ selectedRowKeys: _.uniq([...selectedRowKeys, clazzId]) })
    }
    else {
      props.updateEvalAllScheduleState({ selectedRowKeys: selectedRowKeys.filter(selectedKey => selectedKey !== clazzId) })
    }
  }

  // 表中一整页发生select事件
  const updateSelectedKeys = (selected, selectedRows, changeRows) => {
    if (selected) {
      for (let i = 0; i < changeRows.length; i++) {
        const { status, clazzName } = changeRows[i];
        if (status !== 0 && status !== 1) {
          message.warning(`${clazzName} 无法设置时间`)
        }
      }
      changeRows = changeRows.filter(row => row.status === 0 || row.status === 1)
      props.updateEvalAllScheduleState({ selectedRowKeys: _.uniq([...selectedRowKeys, ...changeRows.map(row => row.clazzId)]) })
    }
    else {
      props.updateEvalAllScheduleState({ selectedRowKeys: selectedRowKeys.filter(selectedKey => changeRows.map(row => row.clazzId).indexOf(selectedKey) === -1) })
    }
  }

  const handleCloseSchedule = (record) => {
    const { clazzId, clazzName } = record
    confirm({
      title: '您确定要强制结束该班级的互评吗？',
      icon: <ExclamationCircleOutlined />,
      content: `${clazzName} 的互评状态将会转变为“已完成”`,
      okText: '是的',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        props.closeSchedule({ clazzId, level })
          .then(res => {
            if (res.success) {
              return message.success('操作成功')
            }
            return message.error(res.message ? res.message : '强制结束失败！')
          })
      },
      onCancel() { },
    });
  }

  return (
    <Layout className="evalAllSchedule">
      <SiderList
        type='evalSchedule'
        onClick={handleTableChange}
        academyId={academyId}
        level={level}
        academyName={academyName}
      />

      <div className='evalAllSchedule-container'>
        <div className='evalAllSchedule-header'>
          <div className='evalAllSchedule-header-left'>
            <Select defaultValue={status} placeholder='请选择状态' style={{ width: 140 }} onChange={handleSelectStatusChange}>
              <Option value={''}>全部</Option>
              <Option value={0}>未设置</Option>
              <Option value={1}>未开始</Option>
              <Option value={2}>进行中</Option>
              <Option value={3}>已完成</Option>
            </Select>
            <Button onClick={handleClickEndTime} style={{ marginLeft: 20, marginRight: 16 }} ><FieldTimeOutlined />全校截止时间：{end}</Button>
            <Button onClick={handleClickEndTime} type='primary'>设置</Button>
          </div>
          <div className='evalAllSchedule-header-right'>
            <Button onClick={() => setStartTimeModalState({ visible: true, level: level, mult: selectedRowKeys })} disabled={selectedRowKeys.length === 0} >设置/修改时间</Button>
          </div>
        </div>

        {
          end === '截止时间尚未设置' ? <div className='evalAllSchedule-container-emptyBox'><Empty description='请先设置互评截止时间' /></div> :
            <Table
              columns={columns}
              loading={loading}
              dataSource={tableData}
              pagination={{ current, pageSize, total }}
              onChange={handleTableTabChange}
              rowKey={record => record.clazzId}
              size={tableSize}
              rowSelection={{
                selectedRowKeys,
                onSelect: (record, selected) => updateSelectedKey(record, selected),
                onSelectAll: (selected, selectedRows, changeRows) => updateSelectedKeys(selected, selectedRows, changeRows),
              }}
            />
        }

      </div>

      <StartTimeModal
        state={startTimeModalState}
        setState={setStartTimeModalState}
      />

      <EndTimeModal
        state={endTimeModalState}
        setState={setEndTimeModalState}
      />

      <EvalResultDrawer
        entrance='evalAllSchedule'
        state={evalResultDrawerState}
        setState={setEvalResultDrawer}
      />

    </Layout>
  );
}

export default connect(state => state.evalAllSchedule, actions)(EvalAllSchedule)
