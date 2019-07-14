import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Store } from 'redux';
import configureStore, { IAppState } from './store/Store';
import { getAllMarkers } from './store/Actions';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.scss';
import ReduxToastr from 'react-redux-toastr';
import App from './App';
import * as serviceWorker from './serviceWorker';


interface IProps {
  store: Store<IAppState>;
}

/* 
Create a root component that receives the store via props
and wraps the App component with Provider, giving props to containers
*/
const Root: React.SFC<IProps> = props => {
  return (
    <Provider store={props.store}>
      <App />
      <ReduxToastr
      timeOut={3000}
      newestOnTop={false}
      preventDuplicates
      position="bottom-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      closeOnToastrClick/>
    </Provider>
  );
};

// Generate the store
const store = configureStore();
store.dispatch(getAllMarkers());

ReactDOM.render(<Root store={store} />, document.getElementById('root') as HTMLElement );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
