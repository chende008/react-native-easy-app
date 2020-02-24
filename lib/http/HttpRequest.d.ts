// Type definitions for HttpRequest.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// execute.!0

/**
 * HttpRequest builder
 */
export default class HttpRequest {

    new();

    /**
     *
     * @param url  request url or full url
     * @return return HttpRequest Builder
     */
    url(url: string): HttpRequest;

    /**
     *
     * @param param  params of fetch body
     * @return return HttpRequest Builder
     */
    param(param: object): HttpRequest;

    /**
     *
     * @param contentType  request contentType
     * @return return HttpRequest Builder
     */
    contentType(contentType: string): HttpRequest;

    /**
     *
     * @param internal  internal request tag
     * @return return HttpRequest Builder
     */
    internal(internal: boolean): HttpRequest;

    /**
     *
     * @param header  request header
     * @return return HttpRequest Builder
     */
    header(header: object): HttpRequest;

    /**
     *
     * contentType => [application/json;charset=utf-8]
     * @return return HttpRequest Builder
     */
    formJson(): HttpRequest;

    /**
     *
     * contentType => [multipart/form-data;charset=utf-8]
     * @return return HttpRequest Builder
     */
    formData(): HttpRequest;

    /**
     *
     *  contentType => [application/x-www-form-urlencoded;charset=utf-8]
     * @return return HttpRequest Builder
     */
    formEncoded(): HttpRequest;

    /**
     *
     * @param extra  extend data
     * @return return HttpRequest Builder
     */
    extra(extra: any): HttpRequest;

    /**
     *
     * @param timeout request timeout time [unit ms]
     * @return return HttpRequest Builder
     */
    timeout(timeout: number): HttpRequest;

    /**
     *
     * @param func request status callback [true => request loading | false => request finished]
     * @return return HttpRequest Builder
     */
    loadingFunc(func: (loading: boolean) => void): HttpRequest;

    /**
     * callback result(json) : root data for request [ignore custom request parser]
     * @return return HttpRequest Builder
     */
    rawData(): HttpRequest;

    /**
     * callback result(text) : root data for request by pure text
     * @return return HttpRequest Builder
     */
    pureText(): HttpRequest;

    /**
     *
     * @param callback
     */
    get(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    /**
     *
     * @param callback
     */
    post(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    /**
     *
     * @param callback
     */
    options(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    /**
     *
     * @param callback
     */
    put(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    /**
     *
     * @param callback
     */
    delete(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    /**
     *
     * @param callback
     */
    patch(callback: (success: boolean, json: object, message: string, status: number) => void): void;
}

