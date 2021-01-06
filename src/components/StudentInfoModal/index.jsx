import React, { useRef, useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { useDispatch } from 'react-redux'
import * as actions from '../../actions'
import { get } from '../../utils/request'
import './index.scss'

const { Option } = Select;

function StudentInfoModal(props) {
  const { state, setState } = props
  const { visible, title, type, academyId, level, fields, id } = state
  const submitBtn = useRef(null)
  const [majorList, setMajorList] = useState([])
  const [clazzList, setClazzList] = useState([])
  const dispatch = useDispatch()

  const selectedMajorId = !fields || fields.length === 0 ? 0 : fields[2].value[1]

  // 选中了转业后触发
  useEffect(() => {
    if (selectedMajorId) {
      getClazzList(selectedMajorId)
      // 选择一个转业后，清空班级选项，以免出现选择专业和班级对不上的脏数据
    }
    async function getClazzList(majorId) {
      const res = await get('/api/clazz/byAcademyAndLevel', { level, majorId: majorId })
      setClazzList(res.data)
    }
  }, [level, selectedMajorId])

  // 学院发生改变且打开表单时触发
  useEffect(() => {
    async function getClazzList() {
      const res = await get('/api/major', { academyId })
      setMajorList(res.data)
    }
    if (visible) {
      getClazzList()
    }
  }, [academyId, visible])

  const handleModalChange = (changedFields, allFields) => {
    if (changedFields.length === 0) {
      return
    }
    if (
      fields[0].value === allFields[0].value &&
      fields[1].value === allFields[1].value &&
      fields[2].value === allFields[2].value &&
      fields[3].value === allFields[3].value
    ) {
      return
    }
    setState({
      ...state,
      fields: allFields
    })
  }

  const checkFormData = () => {
    // 使用react ref，点击form中的button
    submitBtn.current.click();
  }

  const handleSubmit = () => {
    const newData = {
      academyId: academyId,
      level: level,
      id: id,
      sno: fields[0].value,
      name: fields[1].value,
      majorId: fields[2].value[1],
      major: fields[2].value[0],
      clazzId: fields[3].value[1],
      clazz: fields[3].value[0],
    }
    switch (type) {
      // 添加学生
      case 'add':
        dispatch(actions.addStudentInfoTable({ newData }))
          .then(res => {
            if (!res.success) {
              return message.error(res.message)
            }
            message.success('录入成功', 1)
            setState({ visible: false })
          })
        break;
      // 修改学生
      case 'change':
        dispatch(actions.updateStudentInfoTable({ newData }))
          .then(res => {
            if (!res.success) {
              return message.error(res.message)
            }
            message.success('修改成功', 1)
            setState({ visible: false })
          })
        break;

      default:
        break;
    }
  }

  const handelModalClose = () => {
    setState({ visible: false })
    setMajorList([])
    setClazzList([])
  }

  const handleSelectMajor = (e) => {
    if (fields[2].value.length === 0) {
      return
    }
    setState({
      ...state,
      fields: fields.map(field => {
        if (field.name[0] === 'clazz') {
          return {
            ...field,
            value: [],
          }
        }
        return field
      })
    })
  }

  return (
    <Modal
      title={title}
      visible={visible}
      okText='确认'
      cancelText='取消'
      onOk={checkFormData}
      onCancel={handelModalClose}
    >
      {/* 表达数据存储与上层组件。见antd文档 */}
      <Form
        name="studentInfoChange"
        onFieldsChange={handleModalChange}
        onFinish={handleSubmit}
        fields={fields}
      >
        <div className='studentInfoModal-form-title'>学号：</div>

        <Form.Item
          name="sno"
          rules={[{ required: true, message: '请输入学号' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>

        <div className='studentInfoModal-form-title'>姓名：</div>

        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>

        <div className='studentInfoModal-form-title'>专业：</div>

        <Form.Item
          name="major"
          rules={[{ required: true, message: '请选择专业' },]}
        >
          <Select placeholder="选择专业" onSelect={handleSelectMajor} >
            {
              majorList.map((major) => <Option value={[major.majorName, major.id]} key={major.id} >{major.majorName}</Option>)
            }
          </Select>
        </Form.Item>

        <div className='studentInfoModal-form-title'>班级：</div>

        <Form.Item
          name="clazz"
          rules={[{ required: true, message: '请选择班级' },]}
        >
          <Select placeholder="选择班级">
            {
              clazzList.map((clazz) => <Option value={[clazz.clazzName, clazz.id]} key={clazz.id} >{clazz.clazzName}</Option>)
            }
          </Select>
        </Form.Item>

        <Button className='studentInfoModal-form-submit' type="primary" htmlType="submit" ref={submitBtn}>
          看不见我~看不见我~
        </Button>

      </Form>
    </Modal>
  )
}

export default StudentInfoModal
