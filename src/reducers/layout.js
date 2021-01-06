const INITIAL_STATE = {
  selectedPage: '',
  pageName: '',
};

export default function (state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {

    case 'set_layout_state':
      return { ...state, ...payload };

    case 'set_logout':
      return INITIAL_STATE

    default:
      return state;
  }
}
