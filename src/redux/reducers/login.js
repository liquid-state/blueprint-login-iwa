import { LOGIN_FAILED, LOGIN_SUBMITTED } from '../const';

const initialState = {
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUBMITTED:
      return { ...state, error: null };
    case LOGIN_FAILED:
      return { ...state, error: action.payload.error };
    default:
      return state;
  }
};
