import RFHttpConfig, {RFApiConst} from './RFHttpConfig';
import {getParams, parseData, RFRequestLog} from './HttpUtils';
import {emptyTip, isEmpty, isFullUrl, selfOr} from '../utils/RFUtils';

const GET_METHOD = 'GET';

export default class HttpRequest {

    constructor() {
        this.data = {
            url: '',              // Url
            params: {},           // Specify parameters
            header: {},           // Header parameters
            extra: {},            // User extension field
            method: GET_METHOD,   // Http Method
            rawData: false,       // Need to return the raw data
            internal: true,       // Internal request (virtual tag)
            pureText: false,      // Return the original Text or not
            loadingFunc: null,    // Http load status callback
            resendRequest: null,  // Save the request method to retrieve the new Token and then request again
            timeout: getTimeout(),
            contentType: getContentType(),
        };
    }

    url(url): HttpRequest {
        this.data.url = url;
        return this;
    }

    param(param): HttpRequest {
        this.data.param = selfOr(param, {});
        return this;
    }

    contentType(contentType): HttpRequest {
        this.data.contentType = contentType;
        return this;
    }

    internal(internal = true): HttpRequest {
        this.data.internal = internal;
        return this;
    }

    header(header): HttpRequest {
        this.data.header = header;
        return this;
    }

    extra(extra): HttpRequest {
        this.data.extra = extra;
        return this;
    }

    timeout(timeout): HttpRequest {
        this.data.timeout = timeout;
        return this;
    }

    loadingFunc(func): HttpRequest {
        this.data.loadingFunc = func;
        return this;
    }

    formJson(): HttpRequest {
        this.data.contentType = RFApiConst.CONTENT_TYPE_JSON;
        return this;
    }

    formData(): HttpRequest {
        this.data.contentType = RFApiConst.CONTENT_TYPE_FORM_DATA;
        return this;
    }

    formEncoded(): HttpRequest {
        this.data.contentType = RFApiConst.CONTENT_TYPE_URLENCODED;
        return this;
    }

    rawData() {
        this.data.rawData = true;
        return this;
    }

    pureText() {
        this.data.pureText = true;
        return this;
    }

    get(callback) {
        this.data.method = GET_METHOD;
        exec(this.data, callback);
    }

    post(callback) {
        this.data.method = 'POST';
        exec(this.data, callback);
    }

    options(callback) {
        this.data.method = 'OPTIONS';
        exec(this.data, callback);
    }

    put(callback) {
        this.data.method = 'PUT';
        exec(this.data, callback);
    }

    delete(callback) {
        this.data.method = 'DELETE';
        exec(this.data, callback);
    }

    patch(callback) {
        this.data.method = 'PATCH';
        exec(this.data, callback);
    }

    request(method, callback) {
        this.data.method = selfOr(method, GET_METHOD).toUpperCase();
        exec(this.data, callback);
    }

    execute(method): Promise {
        this.data.method = selfOr(method, GET_METHOD).toUpperCase();
        return new Promise(((resolve, reject) => {
            exec(this.data, (success, json, message, status) => {
                success ? resolve({success, json, message, status}) : reject({success, json, message, status})
            });
        }))
    }

    fetch(method): Promise {
        this.data.method = selfOr(method, GET_METHOD).toUpperCase();
        let {baseUrl} = RFHttpConfig.default;
        if (emptyTip(this.data.url, 'Please set the request url')) {
            return;
        }
        if (!isFullUrl(this.data.url) && emptyTip(baseUrl, 'Please set a full url or set up a baseUrl before this')) {
            return;
        }
        let {url, params} = getParams(this.data);
        return fetch(url, params);
    }

}

function exec(data, callback): void {
    let {baseUrl, response = null} = RFHttpConfig.default;
    if (emptyTip(data.url, 'Please set the request url')) {
        return;
    }
    if (!isFullUrl(data.url) && emptyTip(baseUrl, 'Please set a full url or set up a baseUrl before this')) {
        return;
    }

    let {url, loadingFunc, params} = getParams(data);
    data.resendRequest = exec; // Pass the current method to data for a re-request after the accessToken refresh
    data.apiName = getApiName(url); // Gets the interface name of the Url

    loadingFunc && loadingFunc(true);
    let success = false, json = null, error = null, status = -1;

    newFetch(fetch(url, params), data.timeout).then((resp) => {
        response = resp;
        status = resp.status;
        success = status >= 200 && status < 400;
        return data.pureText ? resp.text() : resp.json();
    }).then((origin) => {
        json = origin;
    }).catch(err => {
        success = false;
        error = err;
    }).finally(() => {
        RFRequestLog(url, data.apiName, params, response);//打印Http请求日志
        loadingFunc && loadingFunc(false);
        if (isEmpty(callback)) {
            return;
        }
        json = selfOr(json, {});
        let result = {success, response, json, status, error};
        parseData(data, result, callback);
    });
}

function newFetch(fetch, timeout) {// setTimeout
    return Promise.race([fetch, new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('Network connection timeout')), timeout);
    })]);
}

function getContentType() {// Get the current configuration of contentType
    return selfOr(RFHttpConfig.default.contentType, RFApiConst.CONTENT_TYPE_JSON);
}

function getTimeout() {
    let {timeout} = RFHttpConfig.default;
    if (timeout > 30000) {// Global timeout is only enabled if the global timeout is longer than 3 seconds
        return timeout;
    }
    return RFApiConst.TIMEOUT;

}

function getApiName(url) {// Gets the interface name in the url
    if (url.indexOf('?') > 0) {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\?.*$/, '$2');
    } else {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\\?.*$/, '$2');
    }
}
