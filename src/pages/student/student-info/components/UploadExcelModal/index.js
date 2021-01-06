import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Modal, Upload, message, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { getAllAcademy } from '../../../../../actions/siderList'
import { updateStudentInfoState } from '../../../../../actions/studentInfo'

const { Dragger } = Upload;

function StartTimeModal(props) {
  const { setState } = props
  const { visible, academyName, level, academyId } = props.state
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const uploadProps = {
    action: '/api/file/uploadByAcademyIdAndLevel',
    withCredentials: true,
    data: { academyId, level },
    // showUploadList: false,
    onChange: ({ file }) => {
      if (file.status === 'done') {
        const { success, message: msg } = file.response
        setLoading(false)
        if (success) {
          message.success('上传完成', 1)
          setTimeout(() => {
            dispatch(getAllAcademy('studentImport'))
            dispatch(updateStudentInfoState({ force: true }))
          }, 100);
        } else { message.error(msg, 3) }
      } else { setLoading(true) }
    }
  }

  return (
    <Modal
      title='上传学生数据'
      visible={visible}
      onCancel={() => setState({ visible: false })}
      maskClosable={!loading}
      destroyOnClose={true}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={() => setState({ visible: false })}>
          确定
        </Button>,
      ]}
    >

      <>
        <div style={{ marginBottom: 20 }}>{`注：只能上传 ${level}级${academyName} 的学生信息`}</div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon" style={{ marginTop: 40 }}>
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint" style={{ marginBottom: 40 }}>支持扩展名：.xls .xlsx</p>
        </Dragger>
      </>

    </Modal>
  )
}

export default StartTimeModal
