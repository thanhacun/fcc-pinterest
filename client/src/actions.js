
import ajax from './utils/ajax';

function setClicks(nClicks) {
  return { type: 'SET_CLICKS', clicks: nClicks };
}

function flip_name(name) {
  return {type: 'FLIP_NAME', name: name};
}

function getImage(images) {
  return {type: 'SET_IMAGES', images};
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

export const submit = (url, des, showWhat) => (dispatch) => {
  dispatch({ type: 'LOADING', what: 'Uploading an image' });
  ajax('GET', '/api/user/images?action=upload&imgLink=' + url + '&imgDes=' +  des).then(() =>{
    ajax('GET', '/api/user/images?showMine=' + (showWhat === 'mine')).then(data => {
      dispatch(getImage(data));
    });
  });
};

export const delete_image = (image, showWhat) => (dispatch) => {
  dispatch({type: 'LOADING', what: 'Deleting an image' });
  ajax('GET', '/api/user/images?action=delete&username=' + image.user + '&imgId=' + image._id).then(() => {
    ajax('GET', '/api/user/images?showMine=' + (showWhat === 'mine')).then(data => {
      dispatch(getImage(data));
    });
  });
};

export const like_toggle = (image, showWhat) => (dispatch) => {
  dispatch({type: 'LOADING', what: 'Like/Dislike an image'});
  ajax('POST', '/api/user/images?action=like&image=' + JSON.stringify(image)).then(() =>{
    ajax('GET', '/api/user/images?showMine=' + (showWhat === 'mine')).then(data => {
      dispatch(getImage(data));
    });
  });
};

export const get_all_images = (showWhat) => (dispatch) => {
  const ajaxStr = (showWhat === 'mine') ? '/api/user/images?showMine=true' : '/api/user/images';
  if (showWhat) {dispatch({type: 'TOGGLE_ALL_IMAGE'});}
  dispatch({type: 'LOADING', what: 'Get all images'});
  ajax('GET', ajaxStr).then(data => {
    dispatch(getImage(data));
  });
};

export const reload_images = (images) => (dispatch) => {
  dispatch({type: 'LOADING', what: 'Reload images for local render'});
  dispatch({type: 'RELOAD_IMAGES', images});
};


