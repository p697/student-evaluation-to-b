import React from 'react';
import { Menu, Layout } from "antd";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../../../actions/layout'
import { ROUTES } from '../../../config/routes.config'
// import schoolLogo from '../../../assets/images/school_logo.png'
import './index.scss'

const { Sider } = Layout;

function SiderMenu (props) {
  const { updateActive, role, selectedPage } = props

  const handleClick = (e) => {
    props.setLayoutSiderMenuKey({ selectedPage: e.key })
    updateActive(e.key)
  }
  return (
    <Sider width={208} className="sider">
      <div className="sider-header">
        {/* <img className="sider-header-img" src={schoolLogo} alt='logo' /> */}
        <div className="sider-header-title">学生互评管理系统</div>
      </div>
      <Menu
        theme="dark"
        // defaultSelectedKeys={[selectedPage ? selectedPage : 'student-info']}
        // selectedKeys={[selectedPage ? selectedPage : 'student-info']}
        defaultSelectedKeys={[selectedPage]}
        selectedKeys={[selectedPage]}
        mode="inline"
        onClick={(e) => handleClick(e)}
      >
        {
          ROUTES.map((moduleRoutes) => {
            if (moduleRoutes.role.indexOf(role) === -1) {
              return null
            }
            return (
              <Menu.ItemGroup key={moduleRoutes.key}>
                <div className="sider-content-title">{moduleRoutes.text}</div>
                {
                  moduleRoutes.childs.map((route) => {
                    if (route.role.indexOf(role) === -1) {
                      return null
                    }
                    return (
                      <Menu.Item key={route.key} >
                        <Link to={route.path}>
                          {route.text}
                        </Link>
                      </Menu.Item>
                    )
                  })
                }
              </Menu.ItemGroup>
            )
          })
        }
      </Menu>
    </Sider>
  )
}

function mapStateToProps(state) {
	return {
    role: state.login.role,
    selectedPage: state.layout.selectedPage
  };
}

export default connect(mapStateToProps, actions)(SiderMenu)
