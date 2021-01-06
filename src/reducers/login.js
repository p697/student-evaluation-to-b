const INITIAL_STATE = {
  role: '',
  username: '',
  academyId: 1,
  level: 0,
  isWaiting: false,
};

export default function (state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {

    case 'set_login_wait':
      return { ...state, isWaiting: true };

    case 'set_login_fail':
      return { ...state, isWaiting: false };

    case 'save_login_success':
      return {
        role: payload.role,
        academyId: payload.academyId,
        level: payload.level,
        username: payload.username,
        isWaiting: false,
      };

    case 'set_logout':
      console.log('登出')
      return INITIAL_STATE

    default:
      return state;
  }
}
