import React from 'react';
import { useDispatch } from 'react-redux'
import { Modal, Form, DatePicker, message } from 'antd'
import _ from 'lodash'
import { updateEvalAllScheduleStart, updateEvalAllScheduleState } from '../../../../../actions/evalAllSchedule'
import { getAllAcademy } from '../../../../../actions/siderList'


function SelectTimeModal(props) {
  const { setState } = props
  const { visible, clazzName, clazzId, level, start, mult = [] } = props.state
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const handleSubmit = (value) => {
    if (mult.length === 0) {
      dispatch(updateEvalAllScheduleStart({ clazzId, level, start: value['date-time-picker'] }))
        .then(res => {
          if (!res.success) {
            return message.error(res.message)
          }
          message.success('设置成功', 1.5)
          dispatch(updateEvalAllScheduleState({ force: true }))
          setTimeout(() => {
            setState({ visible: false })
          }, 200);
          setTimeout(() => {
            dispatch(getAllAcademy('evalSchedule'))
          }, 500);
        })
    }
    else {
      const seters = mult.map(clazzId => dispatch(updateEvalAllScheduleStart({ clazzId, level, start: value['date-time-picker'] })))
      Promise.all(seters)
        .then(res => {
          message.success(`设置成功${res.filter(e => e.success).length}个`, 4)
          if (_.findLastIndex(res, { success: false }) !== -1) {
            message.error(`设置失败${res.filter(e => !e.success).length}个`, 4)
          }
          dispatch(updateEvalAllScheduleState({ force: true, selectedRowKeys: [] }))
          setTimeout(() => {
            setState({ visible: false })
          }, 200);
          setTimeout(() => {
            dispatch(getAllAcademy('evalSchedule'))
          }, 500);
        })
    }
  }

  return (
    <Modal
      title='设置开启时间'
      visible={visible}
      onOk={form.submit}
      onCancel={() => setState({ visible: false })}
      okText="确认"
      cancelText="取消"
      width={420}
    >
      <Form form={form} onFinish={handleSubmit} style={{ paddingTop: 10, marginBottom: -10 }}>
        <Form.Item name="date-time-picker" rules={[{ type: 'object', required: true, message: '请选择日期时间' }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" initialValues={start} placeholder={`当前：${start ? start : '未设置'}`} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <div style={{ paddingTop: 10 }}>
        {clazzName ? `设置 ${clazzName} 的互评开启时间` : `设置 ${mult.length} 个选中班级的互评开启时间`}
      </div>
    </Modal>
  )
}

export default SelectTimeModal
