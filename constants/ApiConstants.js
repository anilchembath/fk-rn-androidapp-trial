let config = {
    production : {
    },
    development : {
    	headers: {
            "Content-Type": "application/json",
            "X-User-Agent": "Mozilla/5.0 (Linux; Android 5.1; XT1033 Build/LPB23.13-56; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.117 Mobile Safari/537.36 FKUA/Retail/620000/Android/Mobile (motorola/XT1033/99f4d9df1019b8246cf162a647d2038a)fk_android_app",
            "Device-Id": "6fded7641645fd9defcdd6dd6713716d",
            "SN": "2.VIAC465EC63E70452F8A9C534BDEE0C68D.SID68A84A34CEF45F6A1E9E8CEBB2296E9.VS145639461201404246461.1456418470",
            "flipkart_secure": true
        }
    }
};

export default (process.env.NODE_ENV === 'development'?config.development: config.production);

 