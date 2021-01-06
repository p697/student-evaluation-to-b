import moment from 'moment'
import { get, post } from '../utils/request'
import { checkResStatus } from './login'

export const getEvalAllScheduleTableData = ({ force, academyId, level, status, current, pageSize }) => async (dispatch) => {
  const param = { academyId, level, status, start: current, count: pageSize }
  if (status === '') {
    delete param['status']
  }
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
    type: 'set_evalAllSchedule_state',
    payload: { force: false, tableData, current, pageSize, total, academyId, level }
  })
};

export const changeEvalAllScheduleTable = ({ academyId, level, academyName }) => {
  return { type: 'set_evalAllSchedule_state', payload: { academyId, level, academyName, current: 1 } }
}

export const updateEvalAllScheduleState = (payload) => {
  return { type: 'set_evalAllSchedule_state', payload: payload }
}

export const updateEvalAllScheduleStart = ({ clazzId, level, start }) => async (dispatch) => {
  const res = await post('/api/manage/evaluate-schedule/set', { clazzId, level, start: start.format('YYYY-MM-DD HH:mm:ss') })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  // dispatch({ type: 'set_evalAllSchedule_state', payload: { force: true } })
  return res
};

export const getEvalEndTime = () => async (dispatch) => {
  const res = await post('/api/manage/evaluate-schedule/getGolBalEndTime')
  dispatch(checkResStatus(res))
  const { data: end } = res
  if (end === '截止时间尚未设置') {
    return dispatch({ type: 'set_evalAllSchedule_state', payload: { end: end } })
  }
  const endMoment = moment(`${end[0]}-${end[1]}-${end[2]} ${end[3]}:${end[4]}:${end[5]}`, 'YYYY-MM-DD HH:mm:ss')
  dispatch({ type: 'set_evalAllSchedule_state', payload: { end: endMoment.format('YYYY-MM-DD HH:mm:ss') } })
}

export const updateEvalEndTime = ({ end }) => async (dispatch) => {
  const res = await post('/api/manage/evaluate-schedule/setGolBalEndTime', { end: end.format('YYYY-MM-DD HH:mm:ss') })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  dispatch({ type: 'set_evalAllSchedule_state', payload: { force: true, end: end.format('YYYY-MM-DD HH:mm:ss') } })
  return res
}

export const closeSchedule = ({ clazzId, level }) => async (dispatch) => {
  const res = await post('/api/manage/evaluate-schedule/close', { clazzId, level })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  setTimeout(() => {
    dispatch({ type: 'set_evalAllSchedule_state', payload: { force: true } })
  }, 100);
  return res
}
