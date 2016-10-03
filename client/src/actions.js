
import ajax from './utils/ajax';

function setClicks(nClicks) {
  return { type: 'SET_CLICKS', clicks: nClicks };
}

function flip_name(name) {
  return {type: 'FLIP_NAME', name: name};
}

function setImage(url, des) {
  return { type: 'UPLOAD', url, des };
}

export const reset = () => (dispatch) => {
  dispatch({ type: 'LOADING', what: 'clicks' });
  ajax(
    'DELETE',
   '/api/user/clicks'
 ).then(() => {
   ajax('GET', '/api/user/clicks')
   .then(data => {
     const nClicks = data.clicks;
     dispatch(setClicks(nClicks));
     /* eslint-disable no-console */
   }, error => { console.log(error); });
 }, error => { console.log(error); });
 /* eslint-enable no-console */
};

export const click = () => (dispatch) => {
  dispatch({ type: 'LOADING', what: 'clicks' });
  ajax('POST', '/api/user/clicks').then(() => {
    ajax('GET', '/api/user/clicks').then(data => {
      const nClicks = data.clicks;
      dispatch(setClicks(nClicks));
    /* eslint-disable no-console */
    }, error => { console.log(error); });
  }, error => { console.log(error); });
  /* eslint-enable no-console */
};

export const thanh_click = (name) => (dispatch) => {
  dispatch(flip_name(name));
};

export const submit = (url, des) => (dispatch) => {
  dispatch(setImage(url, des));
  ajax('GET', '/api/user/images?action=upload&imgLink=' + url + '&imgDes=' +  des).then(() =>{
    ajax('GET', '/api/user/images').then(data => {
      dispatch({type: 'SET_IMAGES', images: data});
    });
  });
};

export const toggle = () => (dispatch) => {
  dispatch({type: 'TOGGLE_ALL_IMAGE'});
  ajax('GET', '/api/user/images')
  .then(data => {
    dispatch({type: 'SET_IMAGES', images: data});
  })
  .catch(error => {
    console.log(error);
    throw error;
  });
};

export const delete_image = (image) => (dispatch) => {
  dispatch({type: 'DELETE_IMAGE'});
  ajax('GET', '/api/user/images?action=delete&username=' + image.user + '&imgId=' + image._id).then(() => {
    ajax('GET', '/api/user/images').then(data => {
      dispatch({type: 'SET_IMAGES', images: data});
    });
  });
}; 
