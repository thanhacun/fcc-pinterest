
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
      //console.log('User upload an image link!', action);
      return uploadImage(state);
    case 'SET_IMAGES':
      console.log('Update images state');
      return setImages(state, action.images);
    case 'TOGGLE_ALL_IMAGE':
      //console.log('Toggle showing all images', state);
      return {...state, showAll: !state.showAll};
    default:
      return state;
  }
};

export default originalReducer;

export const getUser = state => state.user || { username: 'guest' };
export const getClicks = state => state.clicks || '0';
export const getLoggedIn = state => state.loggedIn;
export const getImages = state => state.images;
