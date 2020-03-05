export const RFApiConst = {

    TIMEOUT: 100000,//默认超时时间
    CONTENT_TYPE_JSON: 'application/json;charset=utf-8',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data;charset=utf-8',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded;charset=utf-8',
    Methods: new Set(['GET', 'DELETE', 'OPTIONS']),//无body的请求方式
    errorDesc: { 'Network request failed': '网络连接失败' },
    statusDesc: {
        '403': '用户权限不足403',
        '404': '请求接口不存在404',
        '405': '请求方法不允许405',
        '406': '数据内容问题406',
    },//错误码提示对照表
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

    initContentType(contentType) {
        RFHttpConfig.default.contentType = contentType;
        return RFHttpConfig;
    }

}
