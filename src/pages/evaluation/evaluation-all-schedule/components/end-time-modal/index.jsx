import React from 'react';
import { useDispatch } from 'react-redux'
import { Modal, Form, DatePicker, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { updateEvalEndTime } from '../../../../../actions/evalAllSchedule'

const { confirm } = Modal

function EndTimeModal(props) {
  const { setState } = props
  const { visible, end } = props.state
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const handleSubmit = (value) => {
    confirm({
      title: '重要确认',
      icon: <ExclamationCircleOutlined />,
      content: `您确认要设置全校互评的截止时间为${value['date-time-picker'].format('YYYY-MM-DD HH:mm:ss')}吗？一经设置，尽量不要修改！`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch(updateEvalEndTime({ end: value['date-time-picker'] }))
          .then(res => {
            if (!res.success) {
              return message.error(res.message)
            }
            message.success('设置成功', 1)
            setState({ visible: false })
          })
      },
      onCancel() { },
    });
  }

  return (
    <Modal
      title={`设置全校截止时间`}
      visible={visible}
      onOk={form.submit}
      onCancel={() => setState({ visible: false })}
      okText="确认"
      cancelText="取消"
      width={420}
    >
      <Form form={form} onFinish={handleSubmit} style={{ paddingTop: 10, marginBottom: -10 }}>
        <Form.Item name="date-time-picker" rules={[{ type: 'object', required: true, message: '请选择日期时间' }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" initialValues={end} placeholder={`当前：${end}`} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <div style={{ paddingTop: 10 }}>
        注：此时间为全校互评截止时间，在此之前所有未完成互评的学生均可进入系统。但各学院、各年级应根据互评开启时间通知较近的截止时间，并督促学生尽快完成。
      </div>
    </Modal>
  )
}

export default EndTimeModal
