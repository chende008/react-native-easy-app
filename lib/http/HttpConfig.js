import {XGlobal} from '../utils/XGlobal';
import {Platform} from 'react-native';

export const XHttpConst = {

    TIMEOUT: 15000,// Global default timeout
    CONTENT_TYPE_JSON: 'application/json',
    CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded',
    NETWORK_INVALID: 'Network is not available',
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

    constructor(serverTag = XHttpConst.ServerTag) {
        this.timeout = XHttpConst.TIMEOUT;
        this.contentType = XHttpConst.CONTENT_TYPE_URLENCODED;
        this.encodeComponent = false;
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

    initEncodeURIComponent(encodeComponent) {
        this.encodeComponent = encodeComponent;
        return this;
    }

    initNetworkExceptionFunc(NetInfo, networkExceptionFunc) {
        this.listenNetwork(NetInfo);
        this.networkExceptionFunc = networkExceptionFunc;
        return this;
    }

    listenNetwork(NetInfo) {
        NetInfo.addEventListener(state => {
            XGlobal.networkAvailable = Platform.OS === 'android' ? !!state.isInternetReachable : !!state.isConnected
            XGlobal.networkInfo = state
        })
    }
}
