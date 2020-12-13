import { store } from '../redux/store';

// Production URL
let baseUrl = 'https://dry-peak-42594.herokuapp.com/api';

if (process.env.NODE_ENV === 'development') {
  // Local URL
  baseUrl = 'http://localhost:8000/api';
}

let requestConstructor = () => {
  let state = store.getState();
  const authHeader = `Bearer ${state.user.token}`;

  return {
    get: async (reqUrl, returnValue) => {
      const response = await fetch(reqUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      });

      const data = await response.json();

      if (returnValue === 'first') return data[0];

      return data;
    },
    patch: async (reqUrl, body) => {
      const response = await fetch(reqUrl, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    },
    post: async (reqUrl, body) => {
      const response = await fetch(reqUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    },
  };
};

let api = {
  addOne: async (route, body) => {
    return await requestConstructor().post(`${baseUrl}/${route}`, body);
  },
  get: async (route, queryString) => {
    return await requestConstructor().get(
      `${baseUrl}/${route}/${queryString ? '?' : ''}${queryString ? queryString : ''}`
    );
  },
  getOne: async (route, id) => {
    if (!id) return;

    return await requestConstructor().get(`${baseUrl}/${route}/${id}`, 'first');
  },
  updateOne: async (route, id, body) => {
    return await requestConstructor().patch(`${baseUrl}/${route}/${id}`, body);
  },
  patchReq: async (url, body) => {
    return await requestConstructor().patch(`${baseUrl}/${url}`, body);
  },
  post: async (url, body) => {
    return await requestConstructor().post(`${baseUrl}/${url}`, body);
  },
};

export default api;
