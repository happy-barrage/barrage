import {uuid} from '../helpers';

import '../leancloud/AV.push';

export const SVG_URL = '/dist/icons/sprites.svg';//这个是根据gulp生成svg来做的静态的svg地址
export const COMMON_STYLE_CLASS = 'common'; //common style name

//export const

let SERVER_URL = '';
let NODE_ENV = '__ENV__' || 'development';

if (NODE_ENV === 'development') {
  // 当前环境为「开发环境」，是由命令行工具启动的
  SERVER_URL = 'http://localhost:3000/api';
} else if(NODE_ENV === 'production') {
  // 当前环境为「生产环境」，是线上正式运行的环境
  SERVER_URL = 'http://barrage.avosapps.com/api';
} else {
  // 当前环境为「测试环境」
  SERVER_URL = 'http://dev.barrage.avosapps.com/api';
}

export {SERVER_URL};

//这里之后可以调整，有些必须的变量，直接从服务器拿
export const APP_ID = window.APP_ID || 'QxddDjo7gVnzx0A7pMyV9Ekq';
export const APP_KEY = window.APP_KEY || 'iOhvvhJo95T4LEp2jiG8W1fK';

export const PUSH = AV.push({
  appId: APP_ID,
  appKey: APP_KEY
});