import Requests from './requests';

const PATH = '/user-promotions';

export function create(body) {
  return Requests.post(`${PATH}`, body);
}

export function get(id) {
  return Requests.get(`${PATH}/read/${id}`);
}

export function getAll() {
  return Requests.get(`${PATH}/all`);
}

export function getCustomers() {
  return Requests.get(`${PATH}/customers`);
}

export function setStatus(id, body) {
  return Requests.post(`${PATH}/status/${id}`, body);
}

export function setQualify(id, body) {
  return Requests.post(`${PATH}/qualify/${id}`, body);
}
