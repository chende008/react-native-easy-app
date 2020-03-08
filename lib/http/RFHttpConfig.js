export const RFApiConst = {

    TIMEOUT: 100000,// Global default timeout
    CONTENT_TYPE_JSON: 'application/json;charset=utf-8',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data;charset=utf-8',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded;charset=utf-8',
    Methods: new Set(['GET', 'DELETE', 'OPTIONS']),// Request mode without body
    errorDesc: {'Network request failed': 'Network connection failed'},
    statusDesc: {
        '403': 'The server is not allowed to reject the request # 403',
        '404': 'The server could not find the requested page # 404',
        '405': 'Disable the method specified in the request # 405',
        '406': 'A web page that cannot respond to a request using the content feature of the request # 406',
    },
};

export default class RFHttpConfig {

    static default = {
        httpLogOn: false,
        timeout: RFApiConst.TIMEOUT
    };

    static initBaseUrl(baseUrl) {
        RFHttpConfig.default.baseUrl = baseUrl;
        return RFHttpConfig;
    }

    static initTimeout(timeout) {
        RFHttpConfig.default.timeout = timeout;
        return RFHttpConfig;
    }

    static initHttpLogOn(httpLogOn) {
        RFHttpConfig.default.httpLogOn = httpLogOn;
        return RFHttpConfig;
    }

    static initHeaderSetFunc(headerSetFunc) {
        RFHttpConfig.default.headerSetFunc = headerSetFunc;
        return RFHttpConfig;
    }

    static initParamSetFunc(paramSetFunc) {
        RFHttpConfig.default.paramSetFunc = paramSetFunc;
        return RFHttpConfig;
    }

    static initParseDataFunc(parseDataFunc) {
        RFHttpConfig.default.parseDataFunc = parseDataFunc;
        return RFHttpConfig;
    }

    static initContentType(contentType) {
        RFHttpConfig.default.contentType = contentType;
        return RFHttpConfig;
    }

}
