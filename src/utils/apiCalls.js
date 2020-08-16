import { setAuthHeader } from './cookieController';

const baseUrl = 'http://localhost:8000/api';

let requestConstructor = {
  get: async (reqUrl, returnValue) => {
    const response = await fetch(reqUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: setAuthHeader(),
      },
    });

    const data = await response.json();

    if (returnValue === 'first') return data[0];

    return data;
  },
  post: async (reqUrl, body) => {
    const response = await fetch(reqUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: setAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data[0];
  },
};

let api = {
  addOne: async (route, body) => {
    return await requestConstructor.post(`${baseUrl}/${route}`, body);
  },
  getActiveProgram: async () => {
    const response = await fetch(`${baseUrl}/program-logs?status=active`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: setAuthHeader(),
      },
    });
    const data = await response.json();
    return data[0];
  },
  get: async (route, queryString) => {
    return await requestConstructor.get(
      `${baseUrl}/${route}/${queryString ? '?' : ''}${queryString}`
    );
  },
  getOne: async (route, id) => {
    if (!id) return;

    return await requestConstructor.get(`${baseUrl}/${route}/${id}`, 'first');
  },
  getOneExercise: async id => {
    if (!id) return;

    return await requestConstructor.get(`${baseUrl}/exercise/${id}`);
  },
  getOneExerciseLog: async id => {
    if (!id) return;

    return await requestConstructor.get(`${baseUrl}/exercise-logs/${id}`);
  },
  getWorkout: async id => {
    if (!id) return;

    const response = await fetch(`${baseUrl}/workouts/${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: setAuthHeader(),
      },
    });

    const data = await response.json();
    return data[0];
  },
  getOneWorkoutLog: async id => {
    if (!id) return;

    return await requestConstructor.get(`${baseUrl}/workout-logs/${id}`);
  },
  getExerciseLogs: async queryString => {
    return await requestConstructor.get(
      `${baseUrl}/exercise-logs/${queryString ? '?' : ''}${queryString}`
    );
  },
};

export default api;
