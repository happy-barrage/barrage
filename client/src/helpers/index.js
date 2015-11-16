import {SERVER_URL} from '../constants';
import {Promise} from 'es6-promise';
import _ from 'lodash';

//https://gist.github.com/LeverOne/1308368 crazy short uuid
export function uuid(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b};


export function fetchCheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response.json();
    throw error;
  }
}

export function fetchParseJSON(response) {
  return response.json();
}

export function fetchAPI({url, method, body, callback}, dispatch = null) {
  return new Promise((resolved, reject) => {

    let config = {
      method: method,
      credentials : 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if(body) {
      config = _.extend(config, {body: JSON.stringify(body)});
    }

    fetch(`${SERVER_URL}${url}`, config)
      .then(fetchCheckStatus)
      .then(fetchParseJSON)
      .then((data) => {
        if(dispatch) {
          dispatch(callback(data));
        } else {
          callback(data);
        }

        resolved(data);
      }).catch((error) => {
        error.response.then(data => reject(data))
      });
  });
}


export function fetchAPIWithDispatch({url, method, body, callback}) {

  return (dispatch) => {
    return fetchAPI({url, method, body, callback}, dispatch);
  }
}



export function setSelectRange(field, start, end) {
  if (field.setSelectionRange) {
    field.focus();
    field.setSelectionRange(start, end);
  } else if (field.createTextRange) {
    let range = field.createTextRange();
    range.collapse(true);
    range.moveStart('character', start);
    range.moveEnd('character', end);
    range.select();
    field.focus();
  } else if( typeof field.selectionStart != 'undefined' ) {
    field.selectionStart = start;
    field.selectionEnd = end;
    field.focus();
  }
}

export function getInputSelection(el) {
  //http://stackoverflow.com/questions/3964710/replacing-selected-text-in-the-textarea
  var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;

  if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, '\n');

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart('character', -len);
        start += normalizedValue.slice(0, start).split('\n').length - 1;

        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd('character', -len);
          end += normalizedValue.slice(0, end).split('\n').length - 1;
        }
      }
    }
  }

  return {
    start: start,
    end: end
  };
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export function dateFormat(date, fmt) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}