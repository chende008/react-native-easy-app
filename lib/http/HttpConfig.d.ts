// Type definitions for HttpConfig.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// execute.!0

/**
 * HttpConfig builder
 */
export default class HttpConfig {

    constructor(serverTag?: string)

    /**
     *
     * @param baseUrl  request common base url
     * @return return HttpConfig Builder
     */
    initBaseUrl(baseUrl: string): HttpConfig;

    /**
     *
     * @param timeout request common timeout
     * @return return HttpConfig Builder
     */
    initTimeout(timeout: number): HttpConfig;

    /**
     *
     * @param logOn http log tag
     * @return return HttpConfig Builder
     */
    initLogOn(logOn: boolean): HttpConfig;

    /**
     *
     * @param headerSetFunc common request header setting interceptor
     * @return return HttpConfig Builder
     */
    initHeaderSetFunc(headerSetFunc: (headers: object, request: object) => void): HttpConfig;

    /**
     *
     * @param paramSetFunc common request parameters setting interceptor
     * @return return HttpConfig Builder
     */
    initParamSetFunc(paramSetFunc: (params: object, request: object) => void): HttpConfig;

    /**
     *
     * @param parseDataFunc http response result parsing interceptor
     * @return return HttpConfig Builder
     */
    initParseDataFunc(parseDataFunc: (result: object, request: object, callback: () => void) => void): HttpConfig;

    /**
     *
     * @param contentType http common  Content-Type
     * @return return HttpConfig Builder
     */
    initContentType(contentType: string): HttpConfig;

    /**
     *
     * @param loadingFunc http loading status
     * @return return HttpConfig Builder
     */
    initLoadingFunc(loadingFunc: (loading: boolean) => void): HttpConfig;

    /**
     *
     * @param encodeComponent encodeURLComponent params or not
     * @return return HttpConfig Builder
     */
    initEncodeURIComponent(encodeComponent: boolean): HttpConfig;

    /**
     *
     * @param netInfo instance of @react-native-community/netinfo
     * @param networkExceptin callback
     */
    initNetworkExceptionFunc(netInfo, networkExceptionFunc: (message: string, code: number) => void): HttpConfig;

}

interface XHttpConst {
    TIMEOUT: number,
    CONTENT_TYPE_JSON: string,
    CONTENT_TYPE_FORM_DATA: string,
    CONTENT_TYPE_URLENCODED: string,
    NETWORK_INVALID: string,
    ServerTag: string,
    Methods: object,
    errorDesc: object
    statusDesc: object,
}

// XHttpConst
export var XHttpConst: XHttpConst;
