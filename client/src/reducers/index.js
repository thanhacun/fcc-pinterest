/*Combine reducers*/
import { combineReducers } from 'redux';

import originalReducer from './reducer.js';
import testReducer from './test.js';

const reducers = combineReducers({
    originalState: originalReducer,
    testState: testReducer
});

export default reducers;