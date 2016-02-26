'use strict';
import {AsyncStorage} from 'react-native';
import ApiHelper, {getJSON} from 'react-native-shared/utils/api/MAPIHelper.js';
import {NetworkError} from 'react-native-shared/utils/errors/Errors.js';

//import NativeBridge from 'react-native-shared/native_modules/NativeBridge';

export function getProducts(productID) {
	let constants = {
		headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1; XT1033 Build/LPB23.13-56; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.117 Mobile Safari/537.36 FKUA/Retail/620000/Android/Mobile (motorola/XT1033/99f4d9df1019b8246cf162a647d2038a)fk_android_app",
            "Device-Id": "6fded7641645fd9defcdd6dd6713716d",
            "SN": "2.VI63992F4E9C3747BCA1C84E723DB46498.SI7E08F36CDB9846B0AACC9D0B36FBBD3F.VS145629007248240414974.1456290072",
            "flipkart_secure": true
        }
	};
    return async function () {

        try {
            let url = `/3/discover/getSearch?store=search.flipkart.com&start=0&count=20&disableMultipleImage=true&ads-offset=1&q=mobile&sqid=982d815a-dcff-49b6-92d4-56a1f16a9e17&ssid=875034af-63dd-4037-a67c-a22f7e7c148b`;

            let response = await getJSON(ApiHelper.get(url,constants));
            return response;
        }
        catch(e) {
            console.error(e)
        }

    }

}
