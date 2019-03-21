import { combineReducers } from 'redux';
import user from './user';
import product from './product';


export default combineReducers({
  user,
  product,
});
