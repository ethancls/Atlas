import { user } from './user';

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function login(username: string, password: string) {
  if (typeof window !== 'undefined') {
    if (username === user.username && password === user.password) {
      setCookie('isLogged', 'true', 7);
      localStorage.removeItem('error');
    } else {
      setCookie('isLogged', 'false', 7);
      localStorage.setItem('error', 'Nom d\'utilisateur ou mot de passe incorrect');
    }
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    setCookie('isLogged', 'false', 7);
  }
}

export function getLogin() {
  if (typeof window !== 'undefined') {
    return getCookie('isLogged') === 'true';
  }
  return false;
}

export function getError() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('error') || '';
  }
  return '';
}