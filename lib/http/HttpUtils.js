import React from 'react';
import RFApi, {RFApiConst} from './RFApi';
import {dateFormat, isEmpty, isFullUrl, isFunc, objHasKey, selfOr} from '../utils/RFUtils';

export function getParams(data) {//生成通用的requestParams参数
    let {headerSetFunc, paramSetFunc, baseUrl} = RFApi.default;
    let newUrl, paramArray = [], result = {...data};
    let {url, param = {}, method, contentType, header = {}} = data;

    result.params.method = method;
    result.params.headers = {'Content-Type': contentType, ...header};
    result.params.dateTime = new Date().valueOf();
    headerSetFunc && headerSetFunc(result.params.headers, data);

    paramSetFunc && !Array.isArray(param) && paramSetFunc(param, data);
    RFPackage(param, paramArray);
    newUrl = isFullUrl(url) ? url : baseUrl + url;//拼接必要的BaseUrl

    switch (contentType) {//请求内容类型
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
    if (RFApiConst.Methods.has(method)) {//无body情况特别处理
        newUrl = newUrl + (newUrl.includes('?') ? '&' : '?') + paramArray.join('&');
        delete result.params.body;//GET、DELETE 请求不能包含Body
    }
    result.url = newUrl;
    return result;
}

export function parseData(data, result, callback) {//解析数据
    let {parseDataFunc} = RFApi.default, message = '';
    let {success, response, json, status, error} = result;
    message = getErrorMsg(error, status) + '\n' + data.url;
    if (isFunc(parseDataFunc)) {//若已指定自定义解析，则使用指定的解析方式
        let {internal, rawData, pureText} = data;
        let needParse = (internal && !rawData && !pureText);// 站内请求&&非原始数据&&非纯文本数据
        if (needParse) {//需要自定义解析
            let result = {success, response, json, message, status};
            parseDataFunc(result, data, callback);
        } else {//明确需要返回原始数据（包括纯文本）
            callback(success, json, message, status);
        }
    } else {//回调函数
        callback(success, json, message, status);
    }
}

export function getErrorMsg(error, status) {
    let {statusDesc, errorDesc} = RFApiConst, message = '';
    if (error) {//异常，请求异常、解析异常
        message = selfOr(errorDesc[error.message], selfOr(statusDesc[status]));//优先使用【可识别】的错误信息
        message = selfOr(message, error.message + ' 错误码：' + status);//使用原生的错误信息
    } else {
        message = ' 错误码：' + status;
    }
    return message;
}

export function RFPackage(origin, target) {//组装数据
    if (isEmpty(origin) || !objHasKey(origin)) {
        return target;
    }//若为无效的obj，则返回
    if (Array.isArray(target)) {//Obj转数组
        Object.keys(origin).forEach(key => target.push(key + '=' + origin[key]));
    } else if (target instanceof FormData) {
        Object.keys(origin).forEach(key => target.append(key, origin[key]));
    }
    return target;
}

export function RFRequestLog(url, apiName, params, response, tempResult) {//Http请求日志
    if (!RFApi.default.httpLogOn) {
        return;
    }//不打印日志
    if (response && isEmpty(response._bodyText) && isEmpty(tempResult)) {
        let reader = new FileReader();
        reader.addEventListener('loadend', () => RFRequestLog(url, apiName, params, response, reader.result));
        reader.readAsText(response._bodyBlob);
    } else {
        console.log('===接口名=======>', apiName);
        console.log('===请求Url=====>', url);
        console.log('===请求Method==>', params.method);
        console.log('===请求Header==>', JSON.stringify(params.headers));
        if (!isEmpty(params.body)) {
            if (params.body instanceof FormData) {
                console.log('===请求Body====>', JSON.stringify(params.body));
            } else {
                console.log('===请求Body====>', params.body);
            }
        }

        response && console.log('===请求状态码===>', response.status);
        response && console.log('===请求结果=====>', isEmpty(tempResult) ? response._bodyText : tempResult);
        let startTime = params.dateTime;//请求开始时间
        if (!isEmpty(startTime)) {
            console.log('===请求时间====>', dateFormat(new Date(startTime), 'hh点mm分ss秒'));
            console.log('===请求耗时====>', (new Date().valueOf() - startTime), '毫秒');
        } else {
            if (response) {
                startTime = response.headers.map.date;//将服务器时间作为开始时间
                console.log('===请求时间=====>', dateFormat(new Date(startTime), 'hh点mm分ss秒'));
                console.log('===请求耗时=====>', (new Date().valueOf() - startTime), '毫秒');
            }
        }
    }
    console.log('\n'.repeat(5));
}
