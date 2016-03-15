import Immutable from 'immutable';
import {Actions} from '../actions';

let initialState = {
    productList: {},
    search:{
        "sortOptions" : [],
        "facetResponseList": []
    },
    appliedFilters:{}
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
            state = state.set('error', error);
            break;
        case Actions.UPDATE_APPLIED_FILTERS:
            let appliedFilters = action.data;
            state = state.set('appliedFilters', appliedFilters);
            break;
    }
    return state.toJS();
}

export default productList;