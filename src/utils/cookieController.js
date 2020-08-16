import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setAuthHeader = () => `Bearer ${cookies.get('jwt')}`;

export const setJwtCookie = token =>
  cookies.set('jwt', token, {
    httpOnly: true,
    path: '/',
  });
