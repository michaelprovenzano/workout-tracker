import api from '../../utils/apiCalls';

export const setCurrentUser = (email, password) => async dispatch => {
  try {
    let data = await api.post('login', {
      email: email,
      password: password,
    });

    // Set the global user below
    if (data.status === 'success') {
      // Add the user to the state
      return dispatch({
        type: 'SET_CURRENT_USER',
        payload: data,
      });
    } else {
      console.log(data);
    }
  } catch (err) {
    console.log(err.data);
  }
};

export const registerUser = (email, password, passwordConfirm) => async dispatch => {
  try {
    let data = await api.post('register', {
      email,
      password,
      passwordConfirm,
    });
    return dispatch({
      type: 'REGISTER_USER',
      payload: data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeCurrentUser = () => dispatch =>
  dispatch({
    type: 'REMOVE_CURRENT_USER',
    payload: null,
  });
