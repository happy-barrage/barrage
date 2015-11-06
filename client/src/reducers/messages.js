import _ from 'lodash';


const CREATE = 'app/messages/CREATE';


/**
 * [{name, token, objectId}]
 * @param state
 * @param action
 * @returns {*}
 */
export default function reducers(state = [], action = {}) {


  let stateTemp = _.clone(state);


  switch (action.type) {

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
