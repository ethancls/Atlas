import { user } from './user';

export function login(username: string, password:string) {
  if (typeof window !== 'undefined') {
    if (username === user.username && password === user.password) {
      localStorage.setItem('isLogged', 'true');
      localStorage.removeItem('error');
    } else {
      localStorage.setItem('isLogged', 'false');
      localStorage.setItem('error', 'Nom d\'utilisateur ou mot de passe incorrect');
    }
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isLogged', 'false');
  }
}

export function getLogin() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isLogged') === 'true';
  }
  return false;
}

export function getError() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('error') || '';
  }
  return '';
}