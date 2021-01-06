import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Layout, Table, Button, Popconfirm, message, Modal, Form, Input, Empty } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import _ from 'lodash'
import * as actions from '../../../actions'
import SiderList from '../../../components/SiderList'
import StudentInfoModal from '../../../components/StudentInfoModal'
import UploadExcelModal from './components/UploadExcelModal'
import { exportExcel } from '../../../utils/excel'
import './index.scss'

const { confirm } = Modal

function StudentInfo(props) {
  const { role, userAcademyId, userLevel, username, force, current, pageSize, total, tableData, academyId, academyName, clazzId, clazzName, level, sno, name, selectedRowKeys, getStudentInfoTableData } = props
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [searchForm] = Form.useForm();
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
  console.log('窗口高度：' + windowSize)
  if (windowSize < 864) {
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
      setLoading(true)
      getStudentInfoTableData({ academyId, clazzId, level, sno, name, current, pageSize })
    }
  }, [force, academyId, clazzId, level, sno, name, current, pageSize, getStudentInfoTableData])

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
      align: 'right',
      width: 'fit-content',
      render: (text, record) =>
        <div className="studentInfo-table-operation">
          <button
            className="studentInfo-table-operation-btn studentInfo-table-operation-btn_blue"
            onClick={() => setInfoModalState({
              visible: true,
              title: '修改信息',
              type: 'change',
              academyId: role === 1 ? userAcademyId : record.academyId,
              level: record.level,
              fields: [
                { name: ['sno'], value: record.sno },
                { name: ['name'], value: record.name },
                { name: ['major'], value: [record.major, record.majorId] },
                { name: ['clazz'], value: [record.clazz, record.clazzId] },
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
    props.updateStudentInfoState({ ...pagination })
  }

  const handleTableChange = (e) => {
    const { unitId, unitName, level } = e
    if (role === 1) {
      props.changeStudentInfoTable({ clazzId: unitId, clazzName: unitName, level: level })
    }
    else {
      props.changeStudentInfoTable({ academyId: unitId, academyName: unitName, level: level })
    }

  }

  // 单个点击删除
  const handleDelete = (id) => {
    setLoading(true)
    props.deleteStudentInfoTable({ id })
      .then(res => {
        if (!res.success) {
          setLoading(false)
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
        const seters = selectedRowKeys.map((id) => props.deleteStudentInfoTable({ id }))
        Promise.all(seters)
          .then(res => {
            message.success(`删除成功${res.filter(e => e.success).length}个`, 4)
            if (_.findLastIndex(res, { success: false }) !== -1) {
              message.error(`删除失败${res.filter(e => !e.success).length}个。请确认选中的学生中没有已开启互评的`, 6)
            }
            props.updateStudentInfoState({ force: true, selectedRowKeys: [] })
            if (res.filter(e => e.success).length === 0) {
              setLoading(false)
            }
          })
      },
      onCancel() { },
    });
  }

  // 清空全部
  const handleDeleteAll = () => {
    confirm({
      title: '您确定要进行如下操作吗？',
      icon: <ExclamationCircleOutlined />,
      content: `清空 ${academyName} ${level}级 全部学生信息。提示：请先您确保手上有可导入的学生信息excel！`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setLoading(true)
        props.deleteStudentInfoTableAll({ academyId, level })
          .then(res => {
            if (!res.success) {
              setLoading(false)
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
    searchForm.setFieldsValue({ searchInfo: '' })
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

  // 点击 单个录入
  const handleClickAddStudent = () => {
    if (!academyId && !userAcademyId) {
      return message.info('请先选中学院和年级')
    }
    setInfoModalState({
      visible: true,
      title: '单个录入学生信息',
      type: 'add',
      academyId: role === 1 ? userAcademyId : academyId,
      level: level ? level : userLevel,
      fields: [
        { name: ['sno'], value: '' },
        { name: ['name'], value: '' },
        { name: ['major'], value: [] },
        { name: ['clazz'], value: [] },
      ],
    })
  }

  const EmptyPage = () => {
    if (role === 1) {
      return <div className='studentInfo-container'>
        <div className='studentInfo-container-upload'>
          <Empty
            description='没有数据'
          />
        </div>
      </div>
    }
    else {
      return <div className='studentInfo-container'>
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
            <Button onClick={handleDownloadTemplate}>下载模板</Button>
          </div>
        </div>
      </div>
    }
  }

  const handleDownloadTemplate = () => {
    const data = [{ sno: '学号', name: '姓名', academy: '学院', major: '专业', clazz: '班级' }]
    exportExcel(data, '信息导入模板.xlsx')
  }

  const handleExport = async () => {
    setExportLoading(true)
    const param = role === 1 ?
      { academyId: userAcademyId, clazzId, level: userLevel, current: 1, start: 1, count: 9999 }
      :
      { academyId, level, current: 1, start: 1, count: 9999 }
    const res = await props.getAllClazzStudents(param)
    let data = res.data.list.map(({ sno, name, level, academy, major, clazz }) => ({ sno, level, academy, name, major, clazz }))
    data = [{ sno: '学号', name: '姓名', level: '年级', academy: '学院', major: '专业', clazz: '班级' }, ...data]
    let fileName = ''
    if (role === 1) {
      fileName = clazzId === 0 ? username : clazzName
    } else {
      fileName = academyName + level
    }
    exportExcel(data, fileName + '-学生数据.xlsx')
    setExportLoading(false)
  }

  return (
    <Layout className='studentInfo'>
      <SiderList
        type={role === 1 ? 'partStudentInfo' : 'studentInfo'}
        academyId={academyId}
        clazzId={clazzId}
        level={level}
        academyName={academyName}
        clazzName={clazzName}
        onClick={handleTableChange}
      />

      {
        tableData.length === 0 && !name && !sno
          // 没有数据
          ?
          <EmptyPage />
          // 有数据
          :
          <div className='studentInfo-container'>
            <div className='studentInfo-header'>
              <div className='studentInfo-header-left'>
                <Form form={searchForm} name="studentInfo_search" layout="inline" onFinish={handleSearch}>
                  <Form.Item name="searchInfo" initialValue={name ? name : sno}>
                    <Input
                      prefix={<SearchOutlined className='studentInfo-header-left-icon' />}
                      placeholder="请输入学号或姓名"
                    />
                  </Form.Item>
                  <Form.Item shouldUpdate={true}>
                    {() => (
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!searchForm.getFieldValue('searchInfo')}
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
                <Button type='primary' onClick={handleClickAddStudent}>单个录入</Button>
                <Button className='studentInfo-header-delete' onClick={handleExport} loading={exportLoading} >导出数据</Button>
                {
                  role === 1 ? null :
                    <Button className='studentInfo-header-delete' danger type='primary' onClick={handleDeleteAll}>全部清空</Button>
                }
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
              rowKey={record => record ? record.id : 1}
              size={tableSize}
              rowSelection={{
                selectedRowKeys,
                onSelect: (record, selected) => updateSelectedKey([record.id], selected),
                onSelectAll: (selected, selectedRows, changeRows) => updateSelectedKeys(selected, selectedRows, changeRows),
              }}
              locale={{ emptyText: <Empty description='没有数据' /> }}
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

function mapStateToProps(state) {
  return {
    ...state.studentInfo,
    role: state.login.role,
    userAcademyId: state.login.academyId,
    userLevel: state.login.level,
    username: state.login.username
  };
}

export default connect(mapStateToProps, actions)(StudentInfo)
