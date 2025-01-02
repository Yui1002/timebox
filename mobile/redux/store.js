import {createStore, combineReducers} from 'redux';
import workShiftsReducer from './reducers/workShiftsReducer';
import signInReducer from './reducers/signInReducer';
import editServiceProviderReducer from './reducers/editServiceProviderReducer';

const rootReducer = combineReducers({
    workShifts: workShiftsReducer,
    userInfo: signInReducer,
    serviceProviderData: editServiceProviderReducer
});

const store = createStore(rootReducer)

export default store;