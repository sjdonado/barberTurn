import Requests from './requests';

const PATH = '/users';

export function getCurrentUser() {
  return Requests.get(`${PATH}`);
}

export function getCompanies() {
  return Requests.get(`${PATH}/companies`);
}

export function create(body) {
  return Requests.post(`${PATH}`, body);
}

export function update(body) {
  return Requests.put(`${PATH}`, body);
}

export function login(body) {
  return Requests.post(`${PATH}/login`, body);
}

export function createGoogleOauth(body) {
  return Requests.post(`${PATH}/google`, body);
}

export function loginGoogle(body) {
  return Requests.post(`${PATH}/login/google`, body);
}

export function logout() {
  return Requests.get(`${PATH}/logout`);
}
