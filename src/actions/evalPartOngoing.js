import moment from 'moment'
import { get } from '../utils/request'
import { checkResStatus } from './login'

export const changeEvalPartOngoingTable = ({ academyId, level, academyName }) => {
  return { type: 'set_evalPartOngoing_state', payload: { academyId, level, academyName, current: 1 } }
}

export const updateEvalPartOngoingState = (payload) => {
  return { type: 'set_evalPartOngoing_state', payload: payload }
}

export const getEvalPartOngoingTableData = ({ force, academyId, level, current, pageSize }) => async (dispatch) => {
  const param = { academyId, level, status: 2, start: current, count: pageSize }
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
    const { start } = item
    if (start) {
      const startMoment = moment(`${start[0]}-${start[1]}-${start[2]} ${start[3]}:${start[4]}:${start[5]}`, 'YYYY-MM-DD HH:mm:ss')
      tableData[index].start = startMoment.format('YYYY-MM-DD HH:mm:ss')
    }
    return null
  })
  const total = res.data.total
  dispatch({
    type: 'set_evalPartOngoing_state',
    payload: { force: false, tableData, current, pageSize, total, academyId, level }
  })
};

export const getUnFinishedStudents = ({ clazzId }) => async (dispatch) => {
  const res = await get('/api/manage/evaluate/notSubmitByClazzId', { clazzId })
  dispatch(checkResStatus(res))
  return res
}
