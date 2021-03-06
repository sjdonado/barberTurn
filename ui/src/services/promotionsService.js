import Requests from './requests';

const PATH = '/promotions';

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

export function getAllPromotions(id) {
  return Requests.get(`${PATH}/all?company=${id}`);
}