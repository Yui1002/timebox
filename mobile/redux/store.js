import {createStore, combineReducers} from 'redux';
import workShiftsReducer from './reducers/workShiftsReducer';
import signInReducer from './reducers/signInReducer';

const rootReducer = combineReducers({
    workShifts: workShiftsReducer,
    userInfo: signInReducer
});

const store = createStore(rootReducer)

export default store;