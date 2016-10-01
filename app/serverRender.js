import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { createRoutes } from '../client/src/routes.jsx';
import reducers from '../client/src/reducers';
import Users from './models/users';

const renderHelper = (res, location, routes, store) => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps } />
        </Provider>
      );
      const finalState = store.getState();
      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clementine-React-Redux</title>
          <link rel="stylesheet" type="text/css" href="/static/style.css" media="all">
          <link rel="stylesheet" type="text/css" href="/static/bootstrap.min.css" media="all">
          <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
          <script src="/static/bootstrap.min.js"></script>
        </head>
        <body>
          <div id="appView">${html}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(finalState)}
          </script>
          <script src="/static/vendors.js"></script>
          <script src="/static/bundle.js"></script>
        </body>
      </html>
      `);
    } else {
      res.status(404).send('Not found');
    }
  });
};

export default (req, res) => {
  Users.find({}, (err, results) => {
    if (err) { throw err; }
    let initialState = {};
    const images = results.reduce((pre, cur) => {
      return (pre.concat(
          //NOTE:need to use toObject to convert mongoose objects into plain objects 
          cur.imgLinks.map(imgLink => Object.assign({}, {user:cur.twitter.username}, imgLink.toObject()))
        ));
    }, [])
    .sort((e1, e2) => (e1.uploaded > e2.uploaded));
    if (req.isAuthenticated()) {
      initialState = {originalState: {loggedIn: true, showAll: false, user: req.user.twitter, images }, testState: {name: 'THANH'}};
    } else {
      initialState = {originalState: {loggedIn: false, showAll: true, images}, testState: {name: 'THANH'}};
    }
    const store = createStore(reducers, initialState);
    const routes = createRoutes(store);
    return renderHelper(res, req.url, routes, store);
    
  });
  
  /*
  if (req.isAuthenticated()) {
    const user = req.user.twitter;
    
    // redirect to main if logged in
    if (req.url === '/login') return res.redirect(302, '/main');
    Users.findOne({ 'twitter.id': user.id }, (err, response) => {
      if (err) return res.status(500).send(err.message);
      const initialState = {originalState: {loggedIn: true, user, images: response.imgLinks}, testState: {name: 'Thanh'}};
      const store = createStore(reducers, initialState);
      const routes = createRoutes(store);
      return renderHelper(res, req.url, routes, store);
    });
  } else {
    // redirect to login if not logged in
    //if (req.url !=='/test' && req.url !== '/login') return res.redirect(302, '/login');
    Users.find({}, (err, results) => {
      if (err) { throw err; }
      const images = results.reduce(function(pre, cur){
        return pre.concat(cur.imgLinks);
      }, []);
      const initialState = {originalState: {loggedIn: false, images}};
      const store = createStore(reducers, initialState);
      const routes = createRoutes(store);
      return renderHelper(res, req.url, routes, store);
    });
    
  }
  */
  return null;
};
