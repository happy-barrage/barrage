import _ from 'lodash';


import {fetchAPIWithDispatch} from '../helpers';

const CREATE = 'app/binds/CREATE';
const UPDATE = 'app/binds/UPDATE';
const REMOVE = 'app/binds/REMOVE';
const REMOVE_ALL = 'app/binds/REMOVE_ALL';
const FETCH = 'app/binds/FETCH';


/**
 * [{name, token, objectId}]
 * @param state
 * @param action
 * @returns {*}
 */
export default function reducers(state = [], action = {}) {


  let stateTemp = _.clone(state);


  switch (action.type) {

    case REMOVE_ALL:
    case FETCH:
      return action.data.binds;

    case UPDATE:
      let index = _.findIndex(stateTemp, bind => bind.objectId === action.data.bind.objectId);
      stateTemp[index] = action.data.bind;
      return stateTemp;


    case CREATE:
      stateTemp.push(action.data.bind);
      return stateTemp;

    case REMOVE:
      _.remove(stateTemp, (bind) => bind.objectId === action.data.bind.objectId);
      return stateTemp;

    default:
      return state;

  }
}


export function createBind(bind) {
  return {type: CREATE, data: {bind}};
}

export function updateBind(bind) {
  return {type: UPDATE, data: {bind}};
}

export function removeBind(bind) {
  return {type: REMOVE, data: {bind}};
}

export function fetchBinds(binds) {
  return {type: FETCH, data: {binds}};
}

export function removeBinds() {
  return {type: REMOVE_ALL, data: {binds: []}};
}

export function fetchAPIBindStore(body) {
  return fetchAPIWithDispatch({
    url : '/binds',
    method: 'post',
    body : body,
    callback : createBind
  });
}

export function fetchAPIBindUpdate(objectId, body) {
  return fetchAPIWithDispatch({
    url : `/binds/${objectId}`,
    method: 'put',
    body : body,
    callback : updateBind
  });
}

export function fetchAPIBindDelete(objectId) {
  return fetchAPIWithDispatch({
    url : `/binds/${objectId}`,
    method: 'delete',
    callback : removeBind
  });
}

export function fetchAPIBinds() {
  return fetchAPIWithDispatch({
    url : '/binds',
    method: 'get',
    callback : fetchBinds
  });
}