import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Layout, Modal } from 'antd';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as actions from '../actions'
import _ from "lodash";
import { KeyOutlined, LoginOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SiderMenu from './components/SiderMenu'
import ChangePasswordModal from '../components/ChangePasswordModal'
import { ROUTES } from '../config/routes.config'
import './index.scss'

const { Header, Footer } = Layout;
const { confirm } = Modal;
let routes = []
ROUTES.forEach((item) => {
  routes = routes.concat(item.childs);
});

function LayoutCom (props) {
  const { username, pageSize1, pageSize2, pageSize3 } = props
  const [current, setCurrent] = useState('')
  const [changePwState, setChangePwState] = useState({
    visible: false,
    type: '',
    username: '',
  })
  const pageSize = Math.max(pageSize1, pageSize2, pageSize3)

  const updateActive = (key) => {
    let index = _.findIndex(routes, { key: key })
    setCurrent(routes[index].text)
  }

  const logoutHandleClick = () => {
    confirm({
      title: '您确定要退出登录吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // dispatch(actions.logout())
        props.logout()
      },
      onCancel() {},
    });
  }

  return (
    <Router>

      <Layout className='layout'>
        <SiderMenu
          updateActive={updateActive}
        />

        <Layout className='layout-right'>
          <Header className='layout-header'>
            <div className='layout-header-left'>
              {current}
            </div>

            <div className='layout-header-right'>
              <div className='layout-header-right-box' onClick={() => setChangePwState({ visible: true, type: 'self', username: username })}>
                <KeyOutlined className='layout-header-right-icon' />
                更改密码
              </div>
              <div className='layout-header-right-box' onClick={logoutHandleClick}>
                <LoginOutlined className='layout-header-right-icon' />
                注销登录
              </div>
              <div className='layout-header-right-role'>{username}</div>
            </div>
          </Header>

            {
              routes.map((route) => {
                return <Route exact key={route.key} path={route.path} component={route.component} />
              })
            }

          {
            pageSize > 10 ? null : <Footer className='layout-footer'>HFUTonline ©2020 by 明理苑</Footer>
          }
        </Layout>
      </Layout>

      <ChangePasswordModal 
        state={changePwState}
        setState={setChangePwState}
      />

    </Router>
  );
}

function mapStateToProps(state) {
	return {
    username: state.login.username,
    pageSize1: state.studentInfo.pageSize,
    pageSize2: state.evalAllSchedule.pageSize,
    pageSize3: state.evalAllResult.pageSize,
  };
}

export default connect(mapStateToProps, actions)(LayoutCom);
