//React
import React from 'react-native';

//Redux and Utilities
import {applyMiddleware, createStore, combineReducers } from 'redux';
import {Provider} from 'react-redux/native';
import thunk from 'redux-thunk';

//React App index path
import App from './App';

//Reducers..
import ProductList from '../../reducers/ProductList.js';

//Combine reducers into single one
const rootReducer = combineReducers({
    data: ProductList
});

//Create a store with thunk middleware enabled (to handle async actions)
const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);

//Store to be exposed to components
const store = createStoreWithMiddleware(rootReducer);

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {()=> <App query={this.props}/>}
            </Provider>
        )
    }
};