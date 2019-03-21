import Requests from './requests';

const PATH = '/products';

export function create(body) {
  return Requests.post(`${PATH}`, body);
}

export function update(body, id) {
  return Requests.put(`${PATH}/${id}`, body);
}

export function remove(id) {
  return Requests.delete(`${PATH}/${id}`);
}

export function getAllByBusiness() {
  return Requests.get(`${PATH}`);
}

export function getAllProducts(id) {
  return Requests.get(`${PATH}/all?company=${id}`);
}