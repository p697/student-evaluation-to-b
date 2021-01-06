const INITIAL_STATE = {
  academyId: 1,
  academy: '',
  level: 2018,
};

export default function (state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {

    case 'set_studentImport_state':
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
