import HttpRequest from './HttpRequest';

export const RFApiConst = {

    TIMEOUT: 100000,//默认超时时间
    CONTENT_TYPE_JSON: 'application/json;charset=utf-8',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data;charset=utf-8',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded;charset=utf-8',
    Methods: new Set(['GET', 'DELETE', 'OPTIONS']),//无body的请求方式
    errorDesc: {'Network request failed': '网络连接失败'},
    statusDesc: {
        '403': '用户权限不足403',
        '404': '请求接口不存在404',
        '405': '请求方法不允许405',
        '406': '数据内容问题406',
    },//错误码提示对照表
};

export default class RFApi {

    static default = {
        baseUrl: '',//默认的BaseUrl
        timeout: null,//设置支持的超时时间
        httpLogOn: false,//是否打印Http请求日志
        isConnected: null,//返回网络状态结果为【true|false】的Promise对象
        headerSetFunc: null,// 设置header 基础参数 func = (params, request) => { request.headers['Authorization'] = 'token ' + RNStorage.token }
        paramSetFunc: null,//  设置params 基础参数 func = (params, request) => { params['channel'] = isAndroid ? 'adr' : 'ios' }
        parseDataFunc: null,// 解析返回结果 func = ({success, jData, msg, status},request, callback)=> { callback(success, jData, msg, status)}
        contentType: null,//默认的请求类型
    };

}

export function RFHttp() {
    return new HttpRequest();
}
