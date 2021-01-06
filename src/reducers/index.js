import { combineReducers } from 'redux';

import login from './login';
import layout from './layout'
import siderList from './siderList'
import studentInfo from './studentInfo'
import evalAllSchedule from './evalAllSchedule'
import studentImport from './studentImport'
import account from './account'
import evalAllResult from './evalAllResult'
import resultDrawer from './resultDrawer/resultDrawer'
import singleResultDrawer from './resultDrawer/singleResultDrawer'
import evalPartWaiting from './evalPartWaiting'
import evalPartOngoing from './evalPartOngoing'
import evalPartFinished from './evalPartFinished'

export default combineReducers({
  login,
  layout,
  siderList,
  studentInfo,
  evalAllSchedule,
  studentImport,
  account,
  evalAllResult,
  resultDrawer,
  singleResultDrawer,
  evalPartWaiting,
  evalPartOngoing,
  evalPartFinished,
});
