import HttpRequest from "./HttpRequest";
import HttpConfig, {XHttpConst} from './HttpConfig';
import {dateFormat, isEmpty, isFullUrl, isFunc, objHasKey, selfOr} from '../utils/XUtils';

export function getParams(data) {// Generate the generic s parameter
    let {headerSetFunc, paramSetFunc, baseUrl, commonParam = {}, encodeComponent, contentType: configContentType} = HttpConfig[data.serverTag];
    let newUrl, paramArray = [], result = {...data};
    let {url, param = {}, method, contentType, header = {}, enableHeaderSetFunc, enableParamSetFunc} = data;

    result.params.method = method;
    result.params.headers = {'Content-Type': selfOr(contentType, configContentType)};
    enableHeaderSetFunc && headerSetFunc && headerSetFunc(result.params.headers, data);
    result.params.headers = {...result.params.headers, ...header};
    result.params.dateTime = new Date().valueOf();

    const finalContentType = result.params.headers['Content-Type'];
    const needEncoded = finalContentType.includes(XHttpConst.CONTENT_TYPE_URLENCODED);
    enableParamSetFunc && paramSetFunc && paramSetFunc(commonParam, data);
    let finalParam = encodeParams(commonParam, param, encodeComponent, needEncoded);
    XPackage(finalParam, paramArray);
    newUrl = isFullUrl(url) ? url : baseUrl + url;// Splice the necessary BaseUrl

    if (data.formData) {
        if (!finalContentType.includes(XHttpConst.CONTENT_TYPE_FORM_DATA)) {
            result.params.headers = {'Content-Type': XHttpConst.CONTENT_TYPE_FORM_DATA};
        }
        result.params.body = XPackage(finalParam, data.formData);
    } else {
        if (finalContentType.includes(XHttpConst.CONTENT_TYPE_JSON)) {
            result.params.body = JSON.stringify(finalParam);
        } else if (finalContentType.includes(XHttpConst.CONTENT_TYPE_FORM_DATA)) {
            result.params.body = XPackage(finalParam, new FormData());
        } else {
            result.params.body = paramArray.join('&');
        }
    }

    if (XHttpConst.Methods.has(method)) {// No body case is specially handled
        newUrl = newUrl + (newUrl.includes('?') ? '&' : '?') + paramArray.join('&');
        delete result.params.body; // 'GET', 'DELETE', 'OPTIONS'  => The request cannot contain the Body
    }
    result.url = newUrl;
    return result;
}

function encodeParams(commonParam, params, encodeComponent, needEncoded) {
    if (encodeComponent && needEncoded) {// need encode
        if (Array.isArray(params)) {
            params.map(item => encodeURLComponent(item))
        } else {
            params = {...commonParam, ...params};
            encodeURLComponent(params);
        }
    } else {
        if (Array.isArray(params)) return params;
        params = {...commonParam, ...params};
    }
    return params
}

function encodeURLComponent(params) { // encodeURIComponent for params
    if (Array.isArray(params)) return;
    for (let keyStr in params) {
        if (params.hasOwnProperty(keyStr)) {
            let value = params[keyStr];
            if (typeof value === 'string') {
                params[keyStr] = encodeURIComponent(value);
            }
        }
    }
}

export function parseData(data, result, callback) {
    let {parseDataFunc} = HttpConfig[data.serverTag], message = '';
    let {success, response, json, status, error} = result;
    message = getErrorMsg(error, status) + ' => ' + data.url;
    if (isFunc(parseDataFunc)) {// If custom parsing is specified, the specified parsing method is used
        let {rawData, pureText} = data;
        if (rawData || pureText) {// Explicit need to return raw data (including plain text)
            callback(success, json, message, status, response);
        } else {// Non-raw data && non-pure text data
            let result = {success, response, json, message, status};
            parseDataFunc(result, data, callback);
        }
    } else {
        callback(success, json, message, status, response);
    }
}

export function getErrorMsg(error, status) {
    let {statusDesc} = XHttpConst, message = '';
    if (error) {// Exception, request exception to resolve the exception
        message = selfOr(error.message, selfOr(statusDesc[status]));// Prioritize the use of identifiable error messages
        message = selfOr(message, error.message + ' code:' + status);// Use native error messages
    } else {
        message = ' code:' + status;
    }
    return message;
}

export function XPackage(origin, target) {
    if (isEmpty(origin) || !objHasKey(origin)) {
        return target;
    }
    if (Array.isArray(target)) {// object convert array
        Object.keys(origin).forEach(key => target.push(key + '=' + origin[key]));
    } else if (target instanceof FormData) {
        Object.keys(origin).forEach(key => target.append(key, origin[key]));
    }
    return target;
}

export function XRequestLog(url, apiName, params, response, tempResult) {// Http request log
    if (response && isEmpty(response._bodyText) && isEmpty(tempResult)) {
        let reader = new FileReader();
        reader.addEventListener('loadend', () => {
            if (isEmpty(reader.result)) {
                console.log('===Request read failed==>')
            } else {
                XRequestLog(url, apiName, params, response, reader.result)
            }
        });
        reader.readAsText(response._bodyBlob);
    } else {
        console.log('===Interface=======>', apiName);
        console.log('===Request Url=====>', url);
        console.log('===Request Method==>', params.method);
        console.log('===Request Header==>', JSON.stringify(params.headers));
        if (!isEmpty(params.body)) {
            if (params.body instanceof FormData) {
                console.log('===Request Body====>', JSON.stringify(params.body));
            } else {
                console.log('===Request Body====>', params.body);
            }
        }

        response && console.log('===Status Code===>', response.status);
        response && console.log('===Http Response=====>', isEmpty(tempResult) ? response._bodyText : tempResult);
        let startTime = params.dateTime;// Request start time
        if (!isEmpty(startTime)) {
            console.log('===Request Time====>', dateFormat(new Date(startTime), 'hh:mm:ss'));
            console.log('===Cost Time====>', (new Date().valueOf() - startTime), 'ms');
        } else {
            if (response) {
                startTime = response.headers.map.date;// Take the server time as the start time
                console.log('===Request Time=====>', dateFormat(new Date(startTime), 'hh:mm:ss'));
                console.log('===Cost Time=====>', (new Date().valueOf() - startTime), 'ms');
            }
        }
    }
    console.log('\n'.repeat(5));
}

export function XHttp(serverTag = XHttpConst.ServerTag) {
    return new HttpRequest(serverTag)
}

export function XHttpConfig(serverTag) {
    return new HttpConfig(serverTag)
}
