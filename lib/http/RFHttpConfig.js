export const RFHttpConst = {

    TIMEOUT: 100000,// Global default timeout
    CONTENT_TYPE_JSON: 'application/json',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded',
    Methods: new Set(['GET', 'DELETE', 'OPTIONS']),// Request mode without body
    statusDesc: {
        '403': 'The server is not allowed to reject the request # 403',
        '404': 'The server could not find the requested page # 404',
        '405': 'Disable the method specified in the request # 405',
        '406': 'A web page that cannot respond to a request using the content feature of the request # 406',
    },
};

export default class RFHttpConfig {

    static initBaseUrl(baseUrl) {
        RFHttpConfig.baseUrl = baseUrl;
        return RFHttpConfig;
    }

    static initTimeout(timeout) {
        RFHttpConfig.timeout = timeout;
        return RFHttpConfig;
    }

    static initHttpLogOn(httpLogOn) {
        RFHttpConfig.httpLogOn = httpLogOn;
        return RFHttpConfig;
    }

    static initHeaderSetFunc(headerSetFunc) {
        RFHttpConfig.headerSetFunc = headerSetFunc;
        return RFHttpConfig;
    }

    static initParamSetFunc(paramSetFunc) {
        RFHttpConfig.paramSetFunc = paramSetFunc;
        return RFHttpConfig;
    }

    static initParseDataFunc(parseDataFunc) {
        RFHttpConfig.parseDataFunc = parseDataFunc;
        return RFHttpConfig;
    }

    static initContentType(contentType) {
        RFHttpConfig.contentType = contentType;
        return RFHttpConfig;
    }

    static initLoadingFunc(loadingFunc) {
        RFHttpConfig.globalLoadingFunc = loadingFunc;
        return RFHttpConfig;
    }

}
