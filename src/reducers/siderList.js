const INITIAL_STATE = {
  siderData: [],
};

export default function (state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {
    
    case 'set_siderList_state':
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
