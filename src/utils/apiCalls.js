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
  patch: async (reqUrl, body) => {
    const response = await fetch(reqUrl, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: setAuthHeader(),
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
  get: async (route, queryString) => {
    return await requestConstructor.get(
      `${baseUrl}/${route}/${queryString ? '?' : ''}${queryString}`
    );
  },
  getOne: async (route, id) => {
    if (!id) return;

    return await requestConstructor.get(`${baseUrl}/${route}/${id}`, 'first');
  },
  updateOne: async (route, id, body) => {
    return await requestConstructor.patch(`${baseUrl}/${route}/${id}`, body);
  },
};

export default api;
