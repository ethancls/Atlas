let isLogged = false;
let error = '';

import { user } from './user';

export function login(username: string, password: string) {
  if (username === user.username && password === user.password) {
    isLogged = true;
    error = '';
  } else {
    isLogged = false;
    error = 'Nom d\'utilisateur ou mot de passe incorrect';
  }
}

export function logout() {
  isLogged = false;
}

export function getLogin() {
  return isLogged;
}

export function getError() {
  return error;
}