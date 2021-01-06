import moment from 'moment'
import { get } from '../utils/request'
import { checkResStatus } from './login'

export const changeEvalAllResultTable = ({ academyId, level, academyName }) => {
  return { type: 'set_evalAllResult_state', payload: { academyId, level, academyName, current: 1 } }
}

export const updateEvalAllResultState = (payload) => {
  return { type: 'set_evalAllResult_state', payload: payload }
}

export const getEvalAllResultTableData = ({ force, academyId, level, current, pageSize }) => async (dispatch) => {
  const param = { academyId, level, start: current, count: pageSize, status: 3 }
  Object.keys(param).map(key => {
    if (!param[key] && key !== 'status') {
      delete param[key]
    }
    return null
  })
  const res = await get('/api/manage/evaluate-schedule/academy', param)
  dispatch(checkResStatus(res))
  const tableData = res.data.list
  tableData.map((item, index) => {
    const { end } = item
    if (end) {
      const endMoment = moment(`${end[0]}-${end[1]}-${end[2]} ${end[3]}:${end[4]}:${end[5]}`, 'YYYY-MM-DD HH:mm:ss')
      tableData[index].end = endMoment.format('YYYY-MM-DD HH:mm:ss')
    }
    return null
  })
  const total = res.data.total
  dispatch({
    type: 'set_evalAllResult_state',
    payload: { force: false, tableData, current, pageSize, total, academyId, level }
  })
};
