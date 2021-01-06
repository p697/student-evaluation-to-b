import { get, post, DELETE } from '../utils/request'
import { checkResStatus } from './login'

export const changeAccountTable = ({ academyId, level, academyName }) => {
  return { type: 'set_account_state', payload: { academyId, level, academyName, current: 1 } }
}

export const updateAccountState = (payload) => {
  return { type: 'set_account_state', payload: payload }
}

export const getAccountTableData = ({ force, academyId, level, current, pageSize }) => async (dispatch) => {
  const param = { academyId, level, start: current, count: pageSize }
  Object.keys(param).map(key => {
    if (!param[key]) {
      delete param[key]
    }
    return null
  })
  const res = await get('/api/manage/sys-admin', param)
  dispatch(checkResStatus(res))
  const tableData = res.data.list
  const total = res.data.total
  dispatch({
    type: 'set_account_state',
    payload: { force: false, tableData, current, pageSize, total, academyId, level }
  })
};

export const updateSelfPassword = ({ password }) => async (dispatch) => {
  return await post('/api/manage/sys-admin/updatePassword', { password })
  
}

export const updateOthersPassword = ({ academyId, level, userId, username, password }) => async (dispatch) => {
  return await post('/api/manage/sys-admin/update', { academyId, level, id: userId, username, password })
}

export const addAccount = ({ academyId, level, username, password }) => async (dispatch) => {
  const res = await post('/api/manage/sys-admin/add', { academyId, level, username, password })
  dispatch({ type: 'set_account_state', payload: { force: true } })
  return res
}

export const deleteAccount = ({ id }) => async (dispatch) => {
  const res = await DELETE('/api/manage/sys-admin/delete', { id })
  dispatch({ type: 'set_account_state', payload: { force: true } })
  return res
}
