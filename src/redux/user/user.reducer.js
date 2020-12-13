const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
    case 'REGISTER_USER':
      return {
        ...action.payload,
      };
    case 'REMOVE_CURRENT_USER':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
