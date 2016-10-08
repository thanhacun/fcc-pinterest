
function setClicks(state, clicks) {
  return {
    ...state,
    clicks,
    loading: undefined,
  };
}

function setLoading(state, what) {
  return {
    ...state,
    loading: what,
  };
}

function setImages (state, images) {
  return {
    ...state,
    images,
    loading: undefined,
    serverRender:false
  };
}

function uploadImage (state) {
  return {
    ...state
  };
}

const initState = {  };

const originalReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_CLICKS':
      return setClicks(state, action.clicks);
    case 'LOADING':
      return setLoading(state, action.what);
    case 'UPLOAD':
      console.log('User upload an image link!');
      return uploadImage(state);
    case 'SET_IMAGES':
      console.log('Update images list');
      return setImages(state, action.images);
    case 'TOGGLE_ALL_IMAGE':
      console.log('Toggle showing all images');
      return {...state, showAll: !state.showAll};
    case 'DELETE_IMAGE':
      console.log('User delete an image link!');
      return {...state};
    case 'LIKE_TOGGLE':
      console.log('Like toggle an image');
      return {...state};
    default:
      return state;
  }
};

export default originalReducer;

export const getUser = state => state.user || { username: 'guest' };
export const getClicks = state => state.clicks || '0';
export const getLoggedIn = state => state.loggedIn;
export const getImages = state => state.images;
export const getShowAll = state => state.showAll;
