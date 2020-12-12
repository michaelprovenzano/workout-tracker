import api from '../../utils/apiCalls';
import types from './programLogs.types';

export const getActiveProgramLog = () => async dispatch => {
  const data = await api.get('program-logs', `status=active`);

  dispatch({
    type: 'GET_ACTIVE_PROGRAM_LOG',
    payload: data[0],
  });
};

export const setCurrentProgramLog = logOrId => async dispatch => {
  let log;
  if (typeof logOrId === 'number' || typeof logOrId === 'string') {
    log = await api.getOne('program-logs', logOrId);
  } else {
    log = logOrId;
  }

  dispatch({
    type: types.SET_CURRENT_PROGRAM_LOG,
    payload: log,
  });
};

export const setProgramLogs = () => async dispatch => {
  console.log('getting logs');
  const logs = await api.get('program-logs', 'orderBy=[desc]start_date');

  dispatch({
    type: types.SET_PROGRAM_LOGS,
    payload: logs,
  });
};
