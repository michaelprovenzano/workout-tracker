import { setJwtCookie } from '../../utils/cookieController';
import api from '../../utils/apiCalls';

export const setCurrentUser = (email, password) => async dispatch => {
  try {
    let data = await api.post('login', {
      email: email,
      password: password,
    });

    // Set the global user below
    if (data.status === 'success') {
      // Put the token in a cookie
      setJwtCookie(data.token);

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

export const removeCurrentUser = () => ({
  type: 'REMOVE_CURRENT_USER',
  payload: null,
});
