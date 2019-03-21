import { API_VERSION, SERVER_URL } from '../config';
import axios from 'axios';

function request(path, method, data) {
  return axios({
    method: method,
    url: path,
    withCredentials: true,
    baseURL: `${SERVER_URL}${API_VERSION}/`,
    data,
  }).then(res => res.data);
}

const Requests = {
  get(path) {
    return request(path, 'GET');
  },
  post(path, data) {
    return request(path, 'POST', data);
  },
  put(path, data) {
    return request(path, 'PUT', data);
  },
  delete(path) {
    return request(path, 'DELETE');
  },
};

export default Requests;
