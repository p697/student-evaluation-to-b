import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Layout, Table, Button, Popconfirm, message, Modal, Form, Input, Empty } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import _ from 'lodash'
import * as actions from '../../../actions'
import SiderList from '../../../components/SiderList'
import StudentInfoModal from '../../../components/StudentInfoModal'
import UploadExcelModal from './components/UploadExcelModal'
import './index.scss'

const { confirm } = Modal

function StudentInfo(props) {
  const { force, current, pageSize, total, tableData, academyId, academyName, level, sno, name, selectedRowKeys, getStudentInfoTableData } = props
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [infoModalState, setInfoModalState] = useState({
    visible: false,
    title: '',
    type: '',
    academyId: '',
    level: '',
    fields: [],
  })
  const [uploadModalState, setUploadModalState] = useState({
    visible: false,
    academyName: '',
    level: '',
    academyId: '',
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
    props.updateStudentInfoState({ force: false })
  }

  // state（props）发生改变，自动触发更新Table数据更新事件
  useEffect(() => {
    if (!force) {
      getStudentInfoTableData({ academyId, level, sno, name, current, pageSize })
    }
  }, [force, academyId, level, sno, name, current, pageSize, getStudentInfoTableData])

  // 数据更新事件触发完成，并拿到了新数据
  useEffect(() => {
    setLoading(false)
    // console.log('Table刷新')
  }, [tableData])

  const columns = [
    {
      title: '学号',
      dataIndex: 'sno',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '专业',
      dataIndex: 'major',
    },
    {
      title: '班级',
      dataIndex: 'clazz',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        <div className="studentInfo-table-operation">
          <button
            className="studentInfo-table-operation-btn studentInfo-table-operation-btn_blue"
            onClick={() => setInfoModalState({
              visible: true,
              title: '修改信息',
              type: 'change',
              academyId: academyId,
              level: level,
              fields: [
                { name: ['sno'], value: record.sno },
                { name: ['name'], value: record.name },
                { name: ['major'], value: [record.majorId, record.major] },
                { name: ['clazz'], value: [record.clazzId, record.clazz] },
              ],
              id: record.id,
            })}
          >修改</button>
          <div className="studentInfo-table-operation-line"></div>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <button className="studentInfo-table-operation-btn studentInfo-table-operation-btn_red">删除</button>
          </Popconfirm>
        </div>
    },
  ];

  const handleTableTabChange = (pagination) => {
    setLoading(true)
    props.updateStudentInfoState({ ...pagination })
  }

  const handleTableChange = (e) => {
    props.changeStudentInfoTable(e)
  }

  // 单个点击删除
  const handleDelete = (id) => {
    setLoading(true)
    props.deleteStudentInfoTable({ id })
      .then(res => {
        if (!res.success) {
          return message.error(res.message)
        }
        message.success('删除成功', 1)
        props.updateStudentInfoState({ force: true })
      })
  }

  // 清除selected的
  const handleDeleteSelected = () => {
    confirm({
      title: '您确定要进行如下操作吗？',
      icon: <ExclamationCircleOutlined />,
      content: `删除 ${selectedRowKeys.length} 条学生信息`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        setLoading(true)
        const deletePromises = selectedRowKeys.map(async (id) => {
          const res = await props.deleteStudentInfoTable({ id });
          if (!res.success) {
            return message.error(res.message);
          }
          return message.success('删除成功', 1);
        })
        // 不知道为什么速度变慢了
        await Promise.all(deletePromises)
        props.updateStudentInfoState({ force: true, selectedRowKeys: [] })
      },
      onCancel() { },
    });
  }

  // 清空全部
  const handleDeleteAll = () => {
    confirm({
      title: '您确定要进行如下操作吗？',
      icon: <ExclamationCircleOutlined />,
      content: `清空 ${academyName} ${level}级 全部学生信息`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setLoading(true)
        props.deleteStudentInfoTableAll({ academyId, level })
          .then(res => {
            if (!res.success) {
              return message.error(res.message)
            }
            message.success('清空成功', 1)
            setTimeout(() => {
              props.getAllAcademy('studentInfo')
            }, 100);
          })
      },
      onCancel() { },
    });
  }

  // 触发搜索
  const handleSearch = ({ searchInfo }) => {
    setLoading(true)
    const searchParam = {}
    if (/^[0-9]+.?[0-9]*$/.test(searchInfo)) {
      searchParam.sno = searchInfo
      searchParam.name = ''
    } else {
      searchParam.name = searchInfo
      searchParam.sno = ''
    }
    props.updateStudentInfoState({ current: 1, ...searchParam })
  }

  // 清空搜索结果并刷新页面
  const cleanSearchInput = () => {
    setLoading(true)
    form.setFieldsValue({ searchInfo: '' })
    props.updateStudentInfoState({ sno: '', name: '' })
  }

  // 表中每行发生select事件
  const updateSelectedKey = (keys, selected) => {
    if (selected) {
      props.updateStudentInfoState({ selectedRowKeys: _.uniq([...selectedRowKeys, ...keys]) })
    }
    else {
      props.updateStudentInfoState({ selectedRowKeys: selectedRowKeys.filter(selectedKey => keys.indexOf(selectedKey) === -1) })
    }
  }

  // 表中一整页发生select事件
  const updateSelectedKeys = (selected, selectedRows, changeRows) => {
    if (selected) {
      props.updateStudentInfoState({ selectedRowKeys: _.uniq([...selectedRowKeys, ...changeRows.map(row => row.id)]) })
    }
    else {
      props.updateStudentInfoState({ selectedRowKeys: selectedRowKeys.filter(selectedKey => changeRows.map(row => row.id).indexOf(selectedKey) === -1) })
    }
  }

  return (
    <Layout className='studentInfo'>
      <SiderList
        type='studentInfo'
        academyId={academyId}
        level={level}
        academyName={academyName}
        onClick={handleTableChange}
      />

      {
        tableData.length === 0
          // 没有数据
          ?
          <div className='studentInfo-container'>
            <div className='studentInfo-container-upload'>
              <Empty
                description='暂无数据，请导入学生信息'
              />
              <div className='studentInfo-container-upload-btnBox'>
                <Button type='primary' onClick={() => setUploadModalState({
                  visible: true,
                  academyName: academyName,
                  academyId: academyId,
                  level: level,
                })}>导入信息</Button>
                <Button>下载模板</Button>
              </div>
            </div>
          </div>
          // 有数据
          :
          <div className='studentInfo-container'>
            <div className='studentInfo-header'>
              <div className='studentInfo-header-left'>
                <Form form={form} name="studentInfo_search" layout="inline" onFinish={handleSearch}>
                  <Form.Item name="searchInfo">
                    <Input prefix={<SearchOutlined className='studentInfo-header-left-icon' />} placeholder="请输入学号或姓名" />
                  </Form.Item>
                  <Form.Item shouldUpdate={true}>
                    {() => (
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!form.getFieldValue('searchInfo')}
                      >
                        搜索
                      </Button>
                    )}
                  </Form.Item>
                  <Form.Item shouldUpdate={true}>
                    {() => (
                      <Button
                        onClick={cleanSearchInput}
                        disabled={!sno && !name}
                      >
                        <ReloadOutlined />
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </div>
              <div className='studentInfo-header-right'>
                <Button type='primary' onClick={() => setInfoModalState({
                  visible: true,
                  title: '单个录入学生信息',
                  type: 'add',
                  academyId: academyId,
                  level: level,
                  fields: [
                    { name: ['sno'], value: '' },
                    { name: ['name'], value: '' },
                    { name: ['major'], value: '' },
                    { name: ['clazz'], value: '' },
                  ],
                })}>单个录入</Button>
                <Button className='studentInfo-header-delete' danger type='primary' onClick={handleDeleteAll}>全部清空</Button>
                <Button className='studentInfo-header-delete' danger
                  disabled={selectedRowKeys.length === 0 ? true : false}
                  onClick={handleDeleteSelected}
                >删除选中</Button>
              </div>
            </div>

            <Table
              columns={columns}
              loading={loading}
              dataSource={tableData}
              pagination={{ current, pageSize, total }}
              onChange={handleTableTabChange}
              rowKey={record => record.id}
              size={tableSize}
              rowSelection={{
                selectedRowKeys,
                onSelect: (record, selected) => updateSelectedKey([record.id], selected),
                onSelectAll: (selected, selectedRows, changeRows) => updateSelectedKeys(selected, selectedRows, changeRows),
              }}
            />

          </div>
      }

      <StudentInfoModal
        state={infoModalState}
        setState={setInfoModalState}
      />

      <UploadExcelModal
        state={uploadModalState}
        setState={setUploadModalState}
      />

    </Layout>
  );
}

export default connect(state => state.studentInfo, actions)(StudentInfo)
