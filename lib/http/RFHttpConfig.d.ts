// Type definitions for RFHttpConfig.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
export default class RFHttpConfig {

    /**
     *
     * @param baseUrl
     */
    initBaseUrl(baseUrl: String): RFHttpConfig;

    /**
     *
     * @param timeout
     */
    initTimeout(timeout: number): RFHttpConfig;

    /**
     *
     * @param httpLogOn
     */
    initHttpLogOn(httpLogOn: boolean): RFHttpConfig;

    /**
     *
     * @param isConnected
     */
    initNetConnect(isConnected: Promise<boolean>): RFHttpConfig;

    /**
     *
     * @param headerSetFunc
     */
    initHeaderSetFunc(headerSetFunc: (params: object, request: object) => void): RFHttpConfig;

    /**
     *
     * @param paramSetFunc
     */
    initParamSetFunc(paramSetFunc: (params: object, request: object) => void): RFHttpConfig;

    /**
     *
     * @param parseDataFunc
     */
    initParseDataFunc(parseDataFunc: ({success, jData, msg, status}, request, callback) => void): RFHttpConfig;

    /**
     *
     * @param contentType
     */
    initContentType(contentType: string): RFHttpConfig;

}


