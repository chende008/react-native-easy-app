export const RFHttpConst = {

    TIMEOUT: 100000,// Global default timeout
    CONTENT_TYPE_JSON: 'application/json',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded',
    Methods: new Set(['GET', 'DELETE', 'OPTIONS']),// Request mode without body
    ServerTag: 'Tag',// server protocol Tag
    statusDesc: {
        '403': 'The server is not allowed to reject the request # 403',
        '404': 'The server could not find the requested page # 404',
        '405': 'Disable the method specified in the request # 405',
        '406': 'A web page that cannot respond to a request using the content feature of the request # 406',
    },
};

export default class HttpConfig {

    constructor(serverTag = RFHttpConst.ServerTag) {
        this.timeout = RFHttpConst.TIMEOUT;
        this.contentType = RFHttpConst.CONTENT_TYPE_JSON;
        HttpConfig[serverTag] = this;
    }

    initBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }

    initTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }

    initHttpLogOn(httpLogOn) {
        this.httpLogOn = httpLogOn;
        return this;
    }

    initHeaderSetFunc(headerSetFunc) {
        this.headerSetFunc = headerSetFunc;
        return this;
    }

    initParamSetFunc(paramSetFunc) {
        this.paramSetFunc = paramSetFunc;
        return this;
    }

    initParseDataFunc(parseDataFunc) {
        this.parseDataFunc = parseDataFunc;
        return this;
    }

    initContentType(contentType) {
        this.contentType = contentType;
        return this;
    }

    initLoadingFunc(loadingFunc) {
        this.globalLoadingFunc = loadingFunc;
        return this;
    }
}
