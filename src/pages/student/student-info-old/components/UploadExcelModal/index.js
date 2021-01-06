import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Modal, Upload, message, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { config } from '../../../../../utils/request'
import { getAllAcademy } from '../../../../../actions/siderList'
import { updateStudentInfoState } from '../../../../../actions/studentInfo'

const { Dragger } = Upload;

function StartTimeModal(props) {
  const { setState } = props
  const { visible, academyName, level, academyId } = props.state
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const uploadProps = {
    action: config.baseUrl + '/api/file/uploadByAcademyIdAndLevel',
    withCredentials: true,
    data: { academyId, level },
    showUploadList: false,
    onChange: ({ file }) => {
      console.log(file)
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
      footer={[
        <Button key="back" onClick={() => setState({ visible: false })}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => setState({ visible: false })}>
          确定
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 20 }}>{`注：只能上传 ${academyName} ${level}级的学生信息`}</div>
      <div style={{ height: 380 }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">支持扩展名：.xls .xlsx</p>
        </Dragger>
      </div>
    </Modal>
  )
}

export default StartTimeModal
