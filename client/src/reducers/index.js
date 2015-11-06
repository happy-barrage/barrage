import {combineReducers} from 'redux';
import user from './user';
import binds from './binds';
import messages from './messages';


export default combineReducers({
  user, binds, messages
});