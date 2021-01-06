import { get, post, DELETE } from '../utils/request'
import { store } from '../store'
import { checkResStatus } from './login'
import _ from 'lodash'

export const getStudentInfoTableData = ({ force, academyId, clazzId, level, current, pageSize, sno, name }) => async (dispatch) => {
  const param = { academyId, clazzId, level, start: current, count: pageSize, sno, name }
  Object.keys(param).map(key => {
    if (!param[key]) {
      delete param[key]
    }
    return null
  })
  const res = await get('/api/manage/student/query', param)
  dispatch(checkResStatus(res))
  const tableData = res.data.list
  const total = res.data.total
  dispatch({
    type: 'set_studentInfo_state',
    payload: { force: false, tableData, current, pageSize, total, academyId, clazzId, level }
  })
};

export const changeStudentInfoTable = ({ academyId, academyName, clazzId, clazzName, level }) => {
  return { type: 'set_studentInfo_state', payload: { academyId, academyName, clazzId, clazzName, level, current: 1 } }
}

export const updateStudentInfoState = (payload) => {
  return { type: 'set_studentInfo_state', payload: payload }
}

export const addStudentInfoTable = ({ newData }) => async (dispatch) => {
  const res = await post('/api/manage/student/add', newData)
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  dispatch({
    type: 'set_studentInfo_state',
    payload: { force: true, current: 1 }
  })
  return res
}

export const updateStudentInfoTable = ({ newData }) => async (dispatch) => {
  const { id } = newData
  const res = await post('/api/manage/student/update', newData)
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  const { studentInfo } = store.getState()
  const { tableData } = studentInfo
  const index = _.findIndex(tableData, { id: id })
  const newtableData = tableData.slice()
  newtableData[index] = newData
  dispatch({
    type: 'set_studentInfo_state',
    payload: { tableData: newtableData }
  })
  return res
}

export const deleteStudentInfoTable = ({ id }) => async (dispatch) => {
  const res = await DELETE('/api/manage/student/delete', { id })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  return res
}

export const deleteStudentInfoTableAll = ({ academyId, level }) => async (dispatch) => {
  const res = await DELETE('/api/manage/student/init', { academyId, level })
  dispatch(checkResStatus(res))
  if (!res.success) {
    return res
  }
  dispatch({
    type: 'set_studentInfo_state', payload: {
      academyId,
      level,
      total: 0,
      sno: '',
      name: '',
      tableData: [],
    }
  })
  return res
}

export const getAllClazzStudents = (param) => async (dispatch) => {
  Object.keys(param).map(key => {
    if (!param[key]) {
      delete param[key]
    }
    return null
  })
  const res = await get('/api/manage/student/query', param)
  dispatch(checkResStatus(res))
  return res
}
