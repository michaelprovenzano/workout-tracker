import api from '../../utils/apiCalls';

export const setStats = programLogId => async dispatch => {
  const stats = await api.get(`util/program-log-stats/${programLogId}`);
  if (stats.status === 'success') stats.data.program_log_id = programLogId;

  dispatch({
    type: 'SET_STATS',
    payload: stats.data,
  });
};
