import { combineReducers } from 'redux';
import user from './user';
import promotion from './promotion';


export default combineReducers({
  user,
  promotion,
});
