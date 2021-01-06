const INITIAL_STATE = {
  force: false,
  current: 1,
  pageSize: 10,
  total: 10,
  tableData: [],
  academyId: '',
  academy: '',
  level: 2018,
};

export default function (state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {

    case 'set_evalAllResult_state':
      return {
        ...state,
        ...payload
      };

    case 'set_logout':
      return INITIAL_STATE

    default:
      return state;
  }
}
