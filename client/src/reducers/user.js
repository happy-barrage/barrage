import _ from 'lodash';


import {fetchAPIWithDispatch} from '../helpers';

const CREATE = 'app/user/CREATE';
const UPDATE = 'app/user/UPDATE';
const REMOVE = 'app/user/REMOVE';


/**
 * {username, email, objectId...} no password
 * @param state
 * @param action
 * @returns {*}
 */
export default function reducers(state = {}, action = {}) {


  switch (action.type) {

    case UPDATE:
    case CREATE:
      return _.assign({}, action.data.user);

    case REMOVE:
      return {};

    default:
      return state;

  }
}


export function createUser(user) {
  return {type: CREATE, data: {user}};
}

export function updateUser(user) {
  return {type: UPDATE, data: {user}};
}

export function removeUser() {
  return {type: REMOVE};
}

export function signIn(user) {
  return fetchAPIWithDispatch({
    url : '/auth/signin',
    method: 'post',
    body : user,
    callback : createUser
  });
}


export function signUp(user) {
  return fetchAPIWithDispatch({
    url : '/auth/signup',
    method: 'post',
    body : user,
    callback : createUser
  });
}

export function signOut() {

  return fetchAPIWithDispatch({
    url : '/auth/signout',
    method: 'get',
    callback : removeUser
  });

}


