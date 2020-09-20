import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setAuthHeader = () => `Bearer ${cookies.get('jwt')}`;

export const setJwtCookie = token => {
  let cookieSettings = {
    httpOnly: false,
    path: '/',
  };

  cookies.set('jwt', token, cookieSettings);
};

export const getJwtCookie = () => cookies.get('jwt');

export const removeJwtCookie = () => {
  cookies.remove('jwt');
};
