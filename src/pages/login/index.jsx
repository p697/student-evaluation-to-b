import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions'
import { Layout, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import schoolLogo from '../../assets/images/school_logo.png'
import './index.scss'

const { Content, Footer } = Layout;

function loginPage (props) {
  const { isWaiting } = props

  const onFinish = values => {
    props.loginRequest(values)
  };

  return (
    <Layout className="login">
      <Content className="login-content">

        <Form
          name="normal_login"
          className="login-content-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="login-content-header">
            {/* <img className="login-content-header-img" src={schoolLogo} alt='logo' /> */}
            <div className="login-content-header-title">学生互评管理系统</div>
          </div>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              className="login-content-form-input"
              prefix={<UserOutlined
              className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              className="login-content-form-input"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="login-content-form-btn"
              type="primary" htmlType="submit"
              loading={isWaiting}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer className="login-footer">HFUTonline ©2020 Created by 明理苑</Footer>
    </Layout>
  );
}

function mapStateToProps(state) {
	return {
    isWaiting: state.login.isWaiting
  };
}

export default connect(mapStateToProps, actions)(loginPage);
