import { message } from 'antd'
import { post } from '../utils/request'
import _ from 'lodash'

export const loginRequest = ({ username, password }) => async (dispatch) => {
  // 先将按钮禁用
  dispatch({ type: 'set_login_wait' })
  // 再进行请求
  const res = await post('/api/login/admin', { username, password })
  const { success, message: msg } = res
  const roleNames = ['academy', 'school']
  // 判断返回数据
  if (success) {
    const role = _.findIndex(roleNames, (o) => o === res.data.role) + 1
    const academyId = res.data.academyId
    const level = res.data.level
    const username = res.data.username
    dispatch({
      type: 'save_login_success',
      payload: { role, academyId, level, username }
    })
    // window.location.href="/evaluation/all/schedule"
  } else if (res) {
    // 请求成功，但success为false
    message.warning(msg)
    dispatch({ type: 'set_login_fail' })
  } else {
    // 请求未成功
    dispatch({ type: 'set_login_fail' })
  }
};

export const logout = () => async (dispatch) => {
  await dispatch({ type: 'layout/set_logout' })
  await dispatch({ type: 'siderList/set_logout' })
  await dispatch({ type: 'studentInfo/set_logout' })
  await dispatch({ type: 'evalAllSchedule/set_logout' })
  await dispatch({ type: 'studentImport/set_logout' })
  await dispatch({ type: 'evalAllResult/set_logout' })
  await dispatch({ type: 'resultDrawer/set_logout' })
  await dispatch({ type: 'evalPartWaiting/set_logout' })
  await dispatch({ type: 'evalPartOngoing/set_logout' })
  await dispatch({ type: 'evalPartFinished/set_logout' })
  await dispatch({ type: 'set_logout' })
  setTimeout(() => {
    window.location.href='/'
  }, 200);
}

export const checkResStatus = (res) => async (dispatch) => {
  const { code } = res
  switch (code) {
    case 4100:
      message.error('登录过期')
      dispatch(logout())
      return false
  
    default:
      return true
  }
}
