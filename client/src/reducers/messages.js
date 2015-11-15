import _ from 'lodash';

import {fetchAPIWithDispatch} from '../helpers';


const CREATE = 'app/messages/CREATE';
const FETCH = 'app/messages/FETCH';
const REMOVE = 'app/messages/REMOVE';


/**
 * [{name, token, objectId}]
 * @param state
 * @param action
 * @returns {*}
 */
export default function reducers(state = [], action = {}) {


  let stateTemp = _.clone(state);


  switch (action.type) {

    case REMOVE:
    case FETCH:
      return action.data.messages;

    case CREATE:
      stateTemp.push(action.data.message);
      return stateTemp;


    default:
      return state;

  }
}


export function createMessage(message) {
  return {type: CREATE, data: {message}};
}


export function fetchMessages(messages) {
  return {type: FETCH, data: {messages}};
}

export function removeMessages() {
  return {type: REMOVE, data: {messages : []}}
}


export function fetchAPIMessages(objectId) {
  return fetchAPIWithDispatch({
    url : `/binds/${objectId}/messages`,
    method: 'get',
    callback : fetchMessages
  });
}
