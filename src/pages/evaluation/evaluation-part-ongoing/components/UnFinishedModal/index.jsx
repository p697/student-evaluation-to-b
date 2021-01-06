import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import copy from 'copy-to-clipboard';
import { getUnFinishedStudents } from '../../../../../actions/evalPartOngoing'
import { Modal, Input, message } from 'antd'

const { TextArea } = Input;

function UnFinishedModal(props) {
  const { setState } = props
  const { visible, clazzName, clazzId } = props.state
  const dispatch = useDispatch()
  const [students, setStudents] = useState([])

  useEffect(() => {
    if (visible) {
      dispatch(getUnFinishedStudents({ clazzId }))
      .then(res => setStudents(res.data.map(studentInfo => studentInfo.name).join('、')))
    }
  }, [visible, clazzId, dispatch])

  const handleCopy = () => {
    if (copy(students)) {
      message.success('复制成功', 1)
    } else { message.error('复制失败') }
  }

  return (
    <Modal
      title={clazzName}
      visible={visible}
      onOk={handleCopy}
      onCancel={() => setState({ visible: false })}
      okText="复制名单"
      cancelText="取消"
    >
      <TextArea 
        value={students}
        autoSize={true}
      />
    </Modal>
  )
}

export default UnFinishedModal
