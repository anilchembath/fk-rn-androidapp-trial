import {AsyncStorage} from 'react-native';
import Actions from './Actions.js';
import {UIConstants, APIConstants} from '../constants/';
import ApiHelper, {getJSON} from 'react-native-shared/utils/api/MAPIHelper.js';
import {NetworkError} from 'react-native-shared/utils/errors/Errors.js';
var ServiceResponseMock =  require('../components/android/ServiceResponse.js');

export function getProducts(startIndex=0, count=20, sortOptions="") {

    return async function (dispatch) {

        // dispatch({
        //     type: Actions.GET_PRODUCTS_REQUEST
        // });

        try {
            let url = "/3/discover/getSearch?store=search.flipkart.com&q=mobile&start="+ startIndex + "&count="+ count + "&disableMultipleImage=true&ads-offset=1&sqid=982d815a-dcff-49b6-92d4-56a1f16a9e17&ssid=875034af-63dd-4037-a67c-a22f7e7c148b" +  sortOptions;
            console.log("sortOptions", sortOptions, "   url", url)
            let response = await getJSON(ApiHelper.get(url, APIConstants)); // ServiceResponseMock.default;//
            dispatch({
                type: Actions.GET_PRODUCTS_SUCCESS,
                data: response.RESPONSE
            });
        }
        catch(e) {
            dispatch({
                type: Actions.GET_PRODUCTS_FAILURE,
                error: e
            });
        }

    }

}