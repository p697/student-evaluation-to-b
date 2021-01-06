import { get } from '../utils/request'
import { checkResStatus } from './login'

export const getAllAcademy = (type) => async (dispatch) => {
  const path = (type === 'studentInfo' || type === 'studentImport') ? 'byUpload' : 'bySchedule'
  const res = await get('/api/academy/' + path)
  dispatch(checkResStatus(res))
  const siderData = res.data
  dispatch({
    type: 'set_siderList_state',
    payload: { siderData }
  })
};

export const getAllMajor = (academyId) => async (dispatch) => {
  const res = await get('/api/major/byAcademy', { academyId })
  dispatch(checkResStatus(res))
  const siderData = res.data
  dispatch({
    type: 'set_siderList_state',
    payload: { siderData }
  })
};
