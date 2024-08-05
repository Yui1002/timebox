import {createStore, combineReducers} from 'redux';
import workShiftsReducer from './reducers/workShiftsReducer';

const rootReducer = combineReducers({
    workShifts: workShiftsReducer
});

const store = createStore(rootReducer)

export default store;