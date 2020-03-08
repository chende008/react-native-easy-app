import RFHttpConfig, {RFApiConst} from './RFHttpConfig';
import {dateFormat, isEmpty, isFullUrl, isFunc, objHasKey, selfOr} from '../utils/RFUtils';
import HttpRequest from "./HttpRequest";

export function getParams(data) {// Generate the generic s parameter
    let {headerSetFunc, paramSetFunc, baseUrl} = RFHttpConfig.default;
    let newUrl, paramArray = [], result = {...data};
    let {url, param = {}, method, contentType, header = {}} = data;

    result.params.method = method;
    result.params.headers = {'Content-Type': contentType, ...header};
    result.params.dateTime = new Date().valueOf();
    headerSetFunc && headerSetFunc(result.params.headers, data);

    paramSetFunc && !Array.isArray(param) && paramSetFunc(param, data);
    RFPackage(param, paramArray);
    newUrl = isFullUrl(url) ? url : baseUrl + url;// Splice the necessary BaseUrl

    switch (contentType) {
        case RFApiConst.CONTENT_TYPE_JSON:
            result.params.body = JSON.stringify(param);
            break;
        case RFApiConst.CONTENT_TYPE_FORM_DATA:
            result.params.body = RFPackage(param, new FormData());
            break;
        case RFApiConst.CONTENT_TYPE_URLENCODED:
            result.params.body = paramArray.join('&');
            break;
    }
    if (RFApiConst.Methods.has(method)) {// No body case is specially handled
        newUrl = newUrl + (newUrl.includes('?') ? '&' : '?') + paramArray.join('&');
        delete result.params.body; // 'GET', 'DELETE', 'OPTIONS'  => The request cannot contain the Body
    }
    result.url = newUrl;
    return result;
}

export function parseData(data, result, callback) {
    let {parseDataFunc} = RFHttpConfig.default, message = '';
    let {success, response, json, status, error} = result;
    message = getErrorMsg(error, status) + '\n' + data.url;
    if (isFunc(parseDataFunc)) {// If custom parsing is specified, the specified parsing method is used
        let {rawData, pureText} = data;
        if (rawData || pureText) {// Explicit need to return raw data (including plain text)
            callback(success, json, message, status);
        } else {// Non-raw data && non-pure text data
            let result = {success, response, json, message, status};
            parseDataFunc(result, data, callback);
        }
    } else {
        callback(success, json, message, status);
    }
}

export function getErrorMsg(error, status) {
    let {statusDesc} = RFApiConst, message = '';
    if (error) {// Exception, request exception to resolve the exception
        message = selfOr(error.message, selfOr(statusDesc[status]));// Prioritize the use of identifiable error messages
        message = selfOr(message, error.message + ' Error Code ：' + status);// Use native error messages
    } else {
        message = ' Error Code ：' + status;
    }
    return message;
}

export function RFPackage(origin, target) {
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

export function RFRequestLog(url, apiName, params, response, tempResult) {// Http request log
    if (!RFHttpConfig.default.httpLogOn) {
        return;
    }
    if (response && isEmpty(response._bodyText) && isEmpty(tempResult)) {
        let reader = new FileReader();
        reader.addEventListener('loadend', () => RFRequestLog(url, apiName, params, response, reader.result));
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

export function RFHttp() {
    return new HttpRequest()
}
