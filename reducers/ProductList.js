import Immutable from 'immutable';
import {Actions} from '../actions';

let initialState = {
    productList: {},
    search:{
        "sortOptions" : [],
        "facetResponseList": []
    }
};

function productList(state = initialState, action = null){

    state = Immutable.fromJS(state);

    switch (action.type){
        case Actions.GET_PRODUCTS_SUCCESS:
            let data = action.data;
            state = state.set('productList', data.product);
            state = state.set('search', data.search);
            break;
        case Actions.GET_PRODUCTS_FAILURE:
            let error = action.error;
            state = state.set('productList', error);
            break;
    }
    return state.toJS();
}

export default productList;