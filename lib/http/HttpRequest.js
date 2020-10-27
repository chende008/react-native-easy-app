import {XGlobal} from '../utils/XGlobal';
import HttpConfig, {XHttpConst} from './HttpConfig';
import {getParams, parseData, XRequestLog} from './HttpUtils';
import {emptyTip, isEmpty, isFullUrl, selfOr} from '../utils/XUtils';

const GET_METHOD = 'GET';

export default class HttpRequest {

    constructor(serverTag = XHttpConst.ServerTag) {
        this.data = {
            url: '',              // Url
            params: {},           // Specify parameters
            formData: null,       // Specify parameter of FormData
            paramRaw: null,       // Specify parameter
            header: {},           // Header parameters
            extra: {},            // User extension field
            method: GET_METHOD,   // Http Method
            rawData: false,       // Need to return the raw data
            internal: true,       // Internal request (virtual tag)
            pureText: false,      // Return the original Text or not
            loadingFunc: null,    // Http load status callback
            resendRequest: null,  // Save the request method to retrieve the new Token and then request again
            enableParamSetFunc: true,  // common params setHeaderFunc
            enableHeaderSetFunc: true, // common headers setParamFunc
            serverTag: serverTag,      // request protocol config Tag
        };
        HttpConfig[serverTag] || new HttpConfig(serverTag); // make sure base config
    }

    url(url) {
        this.data.url = url;
        return this;
    }

    param(param) {
        if (param instanceof FormData) {
            this.data.formData = selfOr(param, {});
        } else {
            this.data.param = selfOr(param, {});
        }
        return this;
    }

    paramRaw(paramRaw) {
        this.data.paramRaw = selfOr(paramRaw, {});
        return this;
    }

    contentType(contentType) {
        this.data.contentType = contentType;
        return this;
    }

    internal(internal = true) {
        this.data.internal = internal;
        return this;
    }

    header(header) {
        this.data.header = header;
        return this;
    }

    extra(extra) {
        this.data.extra = extra;
        return this;
    }

    timeout(timeout) {
        this.data.timeout = timeout;
        return this;
    }

    loadingFunc(func) {
        this.data.loadingFunc = func;
        return this;
    }

    configCommonFunc(enableHeaderFunc, enableParamFunc) {
        this.data.enableHeaderSetFunc = enableHeaderFunc;
        this.data.enableParamSetFunc = enableParamFunc;
        return this;
    }

    formJson() {
        this.data.contentType = XHttpConst.CONTENT_TYPE_JSON;
        return this;
    }

    formData() {
        this.data.contentType = XHttpConst.CONTENT_TYPE_FORM_DATA;
        return this;
    }

    formEncoded() {
        this.data.contentType = XHttpConst.CONTENT_TYPE_URLENCODED;
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

    execute(method) {
        this.data.method = selfOr(method, GET_METHOD).toUpperCase();
        return new Promise(((resolve, reject) => {
            exec(this.data, (success, json, message, status, response) => {
                resolve({success, json, message, status, response});
            });
        }));
    }

    fetch(method) {
        this.data.method = selfOr(method, GET_METHOD).toUpperCase();
        let {baseUrl} = HttpConfig[this.data.serverTag];
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

function exec(data, callback) {
    let {baseUrl, response = null, globalLoadingFunc, networkExceptionFunc, timeout} = HttpConfig[data.serverTag];
    if (emptyTip(data.url, 'Please set the request url')) {
        return;
    }
    if (!isFullUrl(data.url) && emptyTip(baseUrl, 'Please set a full url or set up a baseUrl before this')) {
        return;
    }

    let {url, loadingFunc, params} = getParams(data);
    data.paramRaw && (params.body = data.paramRaw);
    data.resendRequest = exec; // Pass the current method to data for a re-request after the accessToken refresh
    data.apiName = getApiName(url); // Gets the interface name of the Url

    loadingFunc && loadingFunc(true);
    globalLoadingFunc && globalLoadingFunc(true);
    let success = false, json = null, error = null, status = -1;

    if (!XGlobal.networkAvailable) {
        loadingFunc && loadingFunc(false);
        globalLoadingFunc && globalLoadingFunc(false);
        networkExceptionFunc && networkExceptionFunc(XHttpConst.NETWORK_INVALID, -2);
        callback(false, {}, XHttpConst.NETWORK_INVALID, -2, {});
        return;
    }

    Promise.race([fetch(url, params), timerFunc(data, timeout)]).then((resp) => {
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
        data.timerId && clearTimeout(data.timerId);
        if (HttpConfig[data.serverTag].httpLogOn) {
            XRequestLog(url, data.apiName, params, response);//打印Http请求日志
        }
        loadingFunc && loadingFunc(false);
        globalLoadingFunc && globalLoadingFunc(false);
        if (isEmpty(callback)) {
            return;
        }
        json = selfOr(json, {});
        let result = {success, response, json, status, error};
        parseData(data, result, callback);
    });
}

function timerFunc(data, time) { // setTimeout
    return new Promise(function (resolve, reject) {
        data.timerId = setTimeout(() => {
            data.timerId = null;
            reject(new Error('Network connection timeout'));
        }, selfOr(data.timeout, time));
    });
}

function getApiName(url) {// Gets the interface name in the url
    if (url.indexOf('?') > 0) {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\?.*$/, '$2');
    } else {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\\?.*$/, '$2');
    }
}
