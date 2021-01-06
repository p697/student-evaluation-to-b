import { get } from '../../utils/request'
import { checkResStatus } from '../login'

export const changeSingleResultDrawerTable = ({ sid }) => {
  return { type: 'set_singleResultDrawer_state', payload: { sid, current: 1 } }
}

export const updateSingleResultDrawerState = (payload) => {
  return { type: 'set_singleResultDrawer_state', payload: payload }
}

export const getSingleResultDrawerTableData = ({ force, tab, sid, current, pageSize }) => async (dispatch) => {
  // const param = { sid, start: current, count: pageSize }
  let res, param
  if (tab.toString() === '1') {
    param = { bysid: sid, start: current, count: pageSize }
    res = await get('/api/manage/evaluate/list/by', param)
  } else {
    param = { sid: sid, start: current, count: pageSize }
    res = await get('/api/manage/evaluate/list', param)
  }
  
  dispatch(checkResStatus(res))
  const tableData = res.data.list
  tableData.map((item, index) => {
    const { morality, physical, ability } = item
    tableData[index][`morality${morality}`] = true
    tableData[index][`physical${physical}`] = true
    tableData[index][`ability${ability}`] = true
    return null
  })

  const total = res.data.total
  dispatch({
    type: 'set_singleResultDrawer_state',
    payload: { force: false, tableData, current, pageSize, total, sid }
  })
};
