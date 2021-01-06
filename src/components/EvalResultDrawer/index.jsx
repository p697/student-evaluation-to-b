import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Drawer, Table, Empty, Tag, Button, message, Modal } from 'antd'
import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import EvalSingleResultDrawer from '../EvalSingleResultDrawer'

import './index.scss'

const { confirm } = Modal;

function ResultDrawer(props) {
  const { role, entrance, setState, force, current, pageSize, total, tableData, getResultDrawerTableData } = props
  const { visible, clazzName, clazzId } = props.state
  const [loading, setLoading] = useState(false)
  const [evalSingleResultDrawerState, setEvalSingleResultDrawer] = useState({
    visible: false,
    name: '',
    sid: '',
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
    props.updateResultDrawerState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force && visible) {
      getResultDrawerTableData({ clazzId, current, pageSize })
    }
  }, [force, visible, clazzId, current, pageSize, getResultDrawerTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
  }, [tableData])

  const columns = [
    {
      title: '完成情况',
      dataIndex: 'submit',
      render: (text, record) => record.submit ? <Tag color="green">已完成</Tag> : <Tag color="red">未完成</Tag>
    },
    {
      title: '学号',
      dataIndex: 'sno',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '德',
      children: [
        {
          title: '优',
          dataIndex: 'moralityCounter_excellentCount'
        },
        {
          title: '良',
          dataIndex: 'moralityCounter_goodCount'
        },
        {
          title: '中',
          dataIndex: 'moralityCounter_mediumCount'
        },
        {
          title: '差',
          dataIndex: 'moralityCounter_badCount'
        },
        {
          title: '得分',
          dataIndex: 'avgMorality'
        },
      ]
    },
    {
      title: '体',
      children: [
        {
          title: '优',
          dataIndex: 'physicalCounter_excellentCount'
        },
        {
          title: '良',
          dataIndex: 'physicalCounter_goodCount'
        },
        {
          title: '中',
          dataIndex: 'physicalCounter_mediumCount'
        },
        {
          title: '差',
          dataIndex: 'physicalCounter_badCount'
        },
        {
          title: '得分',
          dataIndex: 'avgPhysical'
        },
      ]
    },
    {
      title: '能',
      children: [
        {
          title: '优',
          dataIndex: 'abilityCounter_excellentCount'
        },
        {
          title: '良',
          dataIndex: 'abilityCounter_goodCount'
        },
        {
          title: '中',
          dataIndex: 'abilityCounter_mediumCount'
        },
        {
          title: '差',
          dataIndex: 'abilityCounter_badCount'
        },
        {
          title: '得分',
          dataIndex: 'avgAbility'
        },
      ]
    },
    {
      title: '操作',
      align: 'right',
      width: 'fit-content',
      dataIndex: 'operate',
      render: (text, record) => <button
        className="singleResultDrawer-content-operation-btn"
        onClick={() => setEvalSingleResultDrawer({ visible: true, name: record.name, sid: record.sid })}
      >查看详情</button>
    },
  ];

  const handleTableTabChange = (pagination) => {
    setLoading(true)
    props.updateResultDrawerState({ ...pagination })
  }

  const handleClearData = () => {
    confirm({
      title: `确定要清除 ${clazzName} 的所有互评数据吗？`,
      icon: <ExclamationCircleOutlined />,
      content: '清除之后，该班级的互评状态将转变为：未设置',
      okText: '清除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        const res = await props.clearClazzData({ clazzId })
        if (res.success) {
          message.success('清空成功！')
          setState({ visible: false, clazzId: clazzId })
          switch (entrance) {
            case 'evalAllSchedule':
              props.updateEvalAllScheduleState({ force: true })
              break;
            case 'evalAllResult':
              props.updateEvalAllResultState({ force: true })
              break;
            case 'evalPartFinished':
              props.updateEvalPartFinishedState({ force: true })
              break;
            default:
              break;
          }
        } else { message.error(res.message ? res.message : '清空失败！') }
      },
      onCancel() { },
    });
  }

  const handleExportData = async () => {
    message.success('文件开始下载', 1.5)
    const a = document.createElement('a')
    a.href = '/api/manage/evaluate/score/clazz/download?clazzId=' + clazzId
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const Header = () => {
    return (
      <div className="resultDrawer-header">
        <div className="resultDrawer-header-left" onClick={() => setState({ visible: false, clazzId: clazzId })}>
          <LeftOutlined style={{ marginRight: 12 }} />
          {clazzName}
        </div>
        <div className="resultDrawer-header-right">
          {
            role === 1 ? null : <Button type='primary' danger onClick={handleClearData}>清空数据</Button>
          }
          <Button type='primary' style={{ marginLeft: 18 }} onClick={handleExportData}>导出数据</Button>
        </div>
      </div>
    )
  }

  return (
    <Drawer
      title={<Header />}
      placement="right"
      closable={false}
      onClose={() => setState({ visible: false, clazzId: clazzId })}
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
          rowKey={record => record.sid}
          size={tableSize}
          locale={{ emptyText: <Empty description='暂无数据' /> }}
        />
      </div>
      <EvalSingleResultDrawer
        state={evalSingleResultDrawerState}
        setState={setEvalSingleResultDrawer}
      />
    </Drawer>
  )
}

function mapStateToProps(state) {
  return {
    ...state.resultDrawer,
    role: state.login.role,
  };
}

export default connect(mapStateToProps, actions)(ResultDrawer)
