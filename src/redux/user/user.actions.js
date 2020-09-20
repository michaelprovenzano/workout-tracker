export const setCurrentUser = user => ({
  type: 'SET_CURRENT_USER',
  payload: user,
});

export const removeCurrentUser = () => ({
  type: 'REMOVE_CURRENT_USER',
  payload: null,
});
