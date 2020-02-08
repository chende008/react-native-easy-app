import React from 'react';
import RFApi, {RFApiConst} from './RFApi';
import {getParams, parseData, RFRequestLog} from './HttpUtils';
import {emptyTip, isEmpty, isFullUrl, selfOr} from '../utils/RFUtils';

export default class HttpRequest {

    constructor() { // 构造函数，Http请求初始化
        this.data = {
            url: '',              // 请求Url
            params: {},           // 请求普通参数
            header: {},           // 请求header参数
            extra: {},            // 请求扩展字段
            method: 'GET',        // 请求方式
            rawData: false,       // 是否返回原始数据
            internal: true,       // 是否为内部请求
            pureText: false,      // 是否返回原始Text
            loadingFunc: null,    // 加载状态回调，回调true或者false
            resendRequest: null,  // 保存请求方法，用于获取新的Token之后，重新请求
            timeout: getTimeout(),         // 默认超时时间
            contentType: getContentType(), // 默认内容类型
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

    get(callback) {
        this.data.method = 'GET';
        execute(this.data, callback);
    }

    post(callback) {
        this.data.method = 'POST';
        execute(this.data, callback);
    }

    options(callback) {
        this.data.method = 'OPTIONS';
        execute(this.data, callback);
    }

    put(callback) {
        this.data.method = 'PUT';
        execute(this.data, callback);
    }

    delete(callback) {
        this.data.method = 'DELETE';
        execute(this.data, callback);
    }

    patch(callback) {
        this.data.method = 'PATCH';
        execute(this.data, callback);
    }

    execute(method, callback) {
        this.data.method = method;
        execute(this.data, callback);
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

    contentType(contentType): HttpRequest {
        this.data.contentType = contentType;
        return this;
    }

    internal(internal = true): HttpRequest {//标记是否是站内请求
        this.data.internal = internal;
        return this;
    }

    rawData(): HttpRequest {//标记是否返回原始Json
        this.data.rawData = true;
        return this;
    }

    pureText(): HttpRequest {//标记是否返回原始Text
        this.data.pureText = true;
        return this;
    }

    header(header): HttpRequest {//设置指定的header参数
        this.data.header = header;
        return this;
    }

    extra(extra): HttpRequest {//设置指定的扩展字段
        this.data.extra = extra;
        return this;
    }

    timeout(timeout): HttpRequest {//设置超时时间
        this.data.timeout = timeout;
        return this;
    }

    loadingFunc(func): HttpRequest {//设置loading文本
        this.data.loadingFunc = func;
        return this;
    }
}

async function execute(data, callback): void {
    let {isConnected, baseUrl, response = null} = RFApi.default;
    if (emptyTip(data.url, '请设置请求url')) {
        return;
    }
    if (!isFullUrl(data.url) && emptyTip(baseUrl, '请先设置baseUrl')) {
        return;
    }

    let {url, loadingFunc, params} = getParams(data), netErrorMsg = '无网络连接';//获取请求数据
    data.resendRequest = execute;//将当前方法传给data用于accessToken刷新后的重新请求
    data.apiName = getApiName(url);//获取Url的接口名【域名之后与？之间的内容】

    if (isConnected && !await isConnected() && emptyTip(null, netErrorMsg)) {//无网络连接
        callback(false, {}, netErrorMsg, -1);
        return;
    }
    loadingFunc && loadingFunc(true);//请求进行中
    let success = false, json = null, error = null, status = -1;//请求结果信息

    newFetch(fetch(url, params), data.timeout).then((resp) => {
        response = resp;
        status = resp.status;
        success = status >= 200 && status < 400;//Http请求成功或失败标记
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

function newFetch(fetch, timeout) {//设置超时
    return Promise.race([fetch, new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('网络连接超时')), timeout);
    })]);
}

function getContentType() {//获取当前配置的contentType
    return selfOr(RFApi.default.contentType, RFApiConst.CONTENT_TYPE_JSON);
}

function getTimeout() {//获取当前配置的timeout
    let {timeout} = RFApi.default;
    if (timeout > 30000) {//只有当全局超时设置的时间大于3秒时，才会启用
        return timeout;
    }
    return RFApiConst.TIMEOUT;

}

function getApiName(url) {//获取url中的接口名
    if (url.indexOf('?') > 0) {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\?.*$/, '$2');
    } else {
        return url.replace(/^https?.*(com|net|org|cn)\/(.+)\\?.*$/, '$2');
    }
}
