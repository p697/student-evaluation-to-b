import { get, post } from '../../utils/request'
import { checkResStatus } from '../login'
import _ from 'lodash'

export const changeResultDrawerTable = ({ clazzId }) => {
  return { type: 'set_resultDrawer_state', payload: { clazzId, current: 1 } }
}

export const updateResultDrawerState = (payload) => {
  return { type: 'set_resultDrawer_state', payload: payload }
}

export const getResultDrawerTableData = ({ force, clazzId, current, pageSize }) => async (dispatch) => {
  const param = { clazzId, status: 3, start: current, count: pageSize }
  const res = await get('/api/manage/evaluate/score/clazz', param)
  dispatch(checkResStatus(res))
  const tableData = res.data.list
  tableData.map((item, index) => {
    const { moralityCounter, physicalCounter, abilityCounter } = item
    const counters = { moralityCounter, physicalCounter, abilityCounter }
    _.forIn(counters, (counterValue, counterKey) => {
      _.forIn(counterValue, (evalValue, evalKey) => {
        tableData[index][`${counterKey}_${evalKey}`] = evalValue
      })
    })
    tableData[index]['avgMorality'] = Math.round(item.avgMorality * 100) / 100
    tableData[index]['avgPhysical'] = Math.round(item.avgPhysical * 100) / 100
    tableData[index]['avgAbility'] = Math.round(item.avgAbility * 100) / 100
    return null
  })
  const total = res.data.total
  dispatch({
    type: 'set_resultDrawer_state',
    payload: { force: false, tableData, current, pageSize, total, clazzId }
  })
};

export const clearClazzData = ({ clazzId }) => async (dispatch) => {
  const res = await post('/api/manage/evaluate-schedule/reSetByClazzId', { clazzId })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  dispatch({ type: 'set_resultDrawer_state', payload: { force: true } })
  return res
}
