import Requests from './requests';

const PATH = '/feedbacks';

export function create(body) {
  return Requests.post(`${PATH}`, body);
}

export function getAll() {
  return Requests.get(`${PATH}/all`);
}