import { user } from './user';

export function login(username: string, password: string) {
  if (username === user.username && password === user.password) {
    localStorage.setItem('isLogged', 'true');
    localStorage.removeItem('error');
  } else {
    localStorage.setItem('isLogged', 'false');
    localStorage.setItem('error', 'Nom d\'utilisateur ou mot de passe incorrect');
  }
}

export function logout() {
  localStorage.setItem('isLogged', 'false');
}

export function getLogin() {
  return localStorage.getItem('isLogged') === 'true';
}

export function getError() {
  return localStorage.getItem('error') || '';
}