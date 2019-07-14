import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import {reducer as toastrReducer} from 'react-redux-toastr';

import {
  mapReducer,
  IMapState,
} from './Reducers';


// Create an interface for the application state
export interface IAppState {
  mapState: IMapState;
  toastr: any;
}

// Create the root reducer
const rootReducer = combineReducers<IAppState>({
  mapState: mapReducer,
  toastr: toastrReducer
});

// Create a configure store function of type `IAppState`
export default function configureStore(): Store<IAppState, any> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}