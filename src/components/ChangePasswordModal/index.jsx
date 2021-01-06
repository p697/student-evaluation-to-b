import React from 'react';
import { useDispatch } from 'react-redux'
import { Modal, Form, Input, message } from 'antd';
import { updateSelfPassword, updateOthersPassword } from '../../actions/account'
import { logout } from '../../actions/login'
import './index.scss'


function ChangePasswordModal(props) {
  const { visible, username, type, userId, academyId, level } = props.state
  const { setState } = props
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const handleSubmit = (data) => {
    const { password1, password2 } = data
    if (password1 !== password2) {
      message.error('两次输入不相同', 1)
      return null
    }
    if (type === 'self') {
      // 更改自己的密码
      dispatch(updateSelfPassword({ password: password1 }))
        .then(res => {
          if (res.success) {
            dispatch(logout())
            message.success('修改成功，请重新登录', 3)
          } else ( message.error(res.message ? res.message : '修改失败！') )
        })
    }
    else if (type === 'others') {
      // 学工部更改别人的密码
      dispatch(updateOthersPassword({ academyId, level, userId, username, password: password1 }))
      .then(res => {
        if (res.success) {
          message.success('修改成功')
          setState({ visible: false })
        } else { message.error(res.message ? res.message : '修改失败！') }
      })
    }
  }

  return (
    <Modal
      title='更改密码'
      visible={visible}
      okText='确认'
      cancelText='取消'
      width={480}
      onOk={form.submit}
      onCancel={() => setState({ visible: false })}
    >
      {/* 表达数据存储与上层组件。见antd文档 */}
      <Form
        form={form}
        name="changePassword"
        onFinish={handleSubmit}
      >

        <div style={{ marginBottom: 6 }}>
          用户：
        </div>

        <Form.Item>
          <Input value={username} disabled />
        </Form.Item>

        <div style={{ marginBottom: 6 }}>
          新密码：
        </div>

        <Form.Item
          name="password1"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input placeholder='请输入' type='password' />
        </Form.Item>

        <div style={{ marginBottom: 6 }}>
          确认新密码：
        </div>

        <Form.Item
          name="password2"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input placeholder='请输入' type='password' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePasswordModal
