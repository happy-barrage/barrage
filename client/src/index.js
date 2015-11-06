import React from 'react';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, Redirect} from 'react-router';

import thunk from 'redux-thunk';

import _ from 'lodash';

import createBrowserHistory from 'history/lib/createBrowserHistory'
let history = createBrowserHistory()

import reducers from './reducers';

import App from './containers/App';
import SignInPage from './containers/SignInPage';
import SignUpPage from './containers/SignUpPage';
import DashboardPage from './containers/DashboardPage';
import NoMatchPage from './containers/NoMatchPage';
import BindEditorPage from './containers/BindEditorPage';
import BindPageContainer from './containers/BindPageContainer';
import BindPage from './containers/BindPage';
import ChatPage from './containers/ChatPage';

import persistStateLocalStorage from 'redux-localstorage';
//import { devTools, persistState } from 'redux-devtools'
//import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';


//store.js
let store;

const finalCreateStore = compose(

  //devTools(),
  applyMiddleware(thunk), //apply thunk middleware
  persistStateLocalStorage([
    'user'
  ], {
    key : 'BARRAGE'
  })
)(createStore);

store = finalCreateStore(reducers);

//<DebugPanel top right bottom>
//  <DevTools store={store} monitor={LogMonitor} />
//</DebugPanel>
//index


React.render(
  <Provider store={store}>
    {() =>
      <Router history={history} createElement={createElement}>
        <Route component={App}>
          <Redirect from='/' to='/signin' />



          <Route path='signin' component={SignInPage} />
          <Route path='signup' component={SignUpPage} />
          <Route path='dashboard' component={DashboardPage}>
            <Route path='binds'>
              <Route path='create' component={BindEditorPage}/>
              <Route path=':id/edit' component={BindEditorPage}/>

              <Redirect from='/dashboard/binds/:id' to='/dashboard/binds/:id/index' />

              <Route path=':id' component={BindPageContainer}>

                <Route path='index' component={BindPage}/>
                <Route path='chat' component={ChatPage}/>
              </Route>
            </Route>
          </Route>

          <Route path="*" component={NoMatchPage}/>
        </Route>


      </Router>
    }
  </Provider>
  ,
  document.getElementById('app')
);


function createElement(Component, props) {

  _.extend(props, {dispatch: store.dispatch});

  return <Component {...props}/>
}
