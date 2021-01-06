import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Input, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import * as actions from '../../actions/account'
import SiderList from '../../components/SiderList'
import ChangePasswordModal from '../../components/ChangePasswordModal'
import './index.scss'

const { confirm } = Modal;

function Account(props) {
  const { force, current, pageSize, total, tableData, academyId, academyName, level, getAccountTableData } = props
  const [loading, setLoading] = useState(false)
  const [changePwState, setChangePwState] = useState({
    visible: false,
    type: '',
    level: ''
  })
  const [addUsername, setAddUsername] = useState('')
  const [addPassword1, setAddPassword1] = useState('')
  const [addPassword2, setAddPassword2] = useState('')


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
    props.updateAccountState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      getAccountTableData({ academyId, level, current, pageSize })
    }
  }, [force, academyId, level, current, pageSize, getAccountTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
  }, [tableData])

  const columns = [
    {
      title: '学院',
      dataIndex: 'academy',
    },
    {
      title: '年级',
      dataIndex: 'level',
    },
    {
      title: '账号',
      dataIndex: 'username',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'right',
      render: (text, record) => <div className="account-table-operation">
        <button
          className="account-table-operation-btn account-table-operation-btn_blue"
          onClick={() => setChangePwState({ visible: true, type: 'others', username: record.username, userId: record.id, academyId: record.academyId, level: record.level })}
        >
          修改密码</button>
        <div className="account-table-operation-line"></div>
        <button
          className="account-table-operation-btn account-table-operation-btn_red"
          onClick={() => handleDeleteAccount(record.id, record.username)}
        >
          删除账户</button>
      </div>
    },
  ];

  const handleTableTabChange = (pagination) => {
    setLoading(true)
    props.updateAccountState({ ...pagination })
  }

  const handleTableChange = (e) => {
    const { unitId, unitName, level } = e
    props.changeAccountTable({ academyId: unitId, academyName: unitName, level: level })
  }

  const handleAddAccount = async () => {
    if (!addUsername) { return }
    if (addPassword1 !== addPassword2) {
      return message.error('两次输入的密码不同')
    }
    const res = await props.addAccount({ academyId, level, username: addUsername, password: addPassword1 ? addPassword1 : 'hfutonline' })
    if (res.success) {
      console.log('密码：' + addPassword1)
      message.success('添加成功！' + (addPassword1 ? '使用自定义密码' : '使用默认密码：hfutonline'))
      setAddUsername('')
      setAddPassword1('')
      setAddPassword2('')
    } else { message.error(res.message ? res.message : '添加失败！') }
  }

  const handleDeleteAccount = (id, username) => {
    confirm({
      title: `确定要删除账户：${username} ？`,
      icon: <ExclamationCircleOutlined />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        const res = await props.deleteAccount({ id })
        if (res.success) {
          message.success('删除成功！')
        } else { message.error(res.message ? res.message : '删除失败！') }
      },
      onCancel() { },
    });
  }

  return (
    <Layout className="account">
      <SiderList
        type='account'
        academyId={academyId}
        level={level}
        academyName={academyName}
        onClick={handleTableChange}
      />
      <div className="account-container">
        <div className='account-header'>
          <Input className='account-header-input' placeholder='请输入用户名' value={addUsername} onChange={e => setAddUsername(e.target.value)}></Input>
          <Input className='account-header-input' placeholder='请输入密码' value={addPassword1} onChange={e => setAddPassword1(e.target.value)}></Input>
          <Input className='account-header-input' placeholder='请再次输入密码' value={addPassword2} onChange={e => setAddPassword2(e.target.value)}></Input>
          <Button type='primary' onClick={handleAddAccount}>添加账号</Button>
        </div>
        <Table
          columns={columns}
          loading={loading}
          dataSource={tableData}
          pagination={{ current, pageSize, total }}
          onChange={handleTableTabChange}
          rowKey={record => record.id}
          size={tableSize}
        />
      </div>

      <ChangePasswordModal
        state={changePwState}
        setState={setChangePwState}
      />
    </Layout>
  );
}

export default connect(state => state.account, actions)(Account)
