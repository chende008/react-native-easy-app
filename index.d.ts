// Storage
export type RFStorage = RFStorageType;
export var RFStorage: RFStorageType;

interface RFStorageType {

    initStorage(targetObj: object, initializedCallback: () => void, dataChangedCallback: (dataSet) => void, version: string): void

    init(targetObj: object, initializedCallback: () => void, dataChangedCallback: (dataSet) => void, version: string): void

    multiGet(keys: any): Promise<any>;

    saveItems(keyValuePairs: any): Promise<any>;

    removeItems(keys: any): Promise<any>;

    clear(): Promise<any>;
}

// HttpConfig
export type RFHttpConfig = RFHttpConfigType;
export var RFHttpConfig: RFHttpConfigType;

interface RFHttpConfigType {

    initBaseUrl(baseUrl: String): RFHttpConfig;

    initTimeout(timeout: number): RFHttpConfig;

    initHttpLogOn(httpLogOn: boolean): RFHttpConfig;

    initNetConnect(isConnected: Promise<boolean>): RFHttpConfig;

    initHeaderSetFunc(headerSetFunc: (params: object, request: object) => void): RFHttpConfig;

    initParamSetFunc(paramSetFunc: (params: object, request: object) => void): RFHttpConfig;

    initParseDataFunc(parseDataFunc: ({success, jData, msg, status}, request: any, callback: any) => void): RFHttpConfig;

    initContentType(contentType: string): RFHttpConfig;
}

// Http reqeust
export type HttpRequest = HttpRequestType;
export var HttpRequest: HttpRequestType;

interface HttpRequestType {

    new(): HttpRequest;

    url(url: string): HttpRequest;

    param(param: object): HttpRequest;

    contentType(contentType: string): HttpRequest;

    internal(internal: boolean): HttpRequest;

    header(header: object): HttpRequest;

    extra(extra: any): HttpRequest;

    timeout(timeout: number): HttpRequest;

    loadingFunc(func: (loading: boolean) => void): HttpRequest;

    rawData(): HttpRequest;

    pureText(): HttpRequest;

    formJson(): HttpRequest;

    formData(): HttpRequest;

    formEncoded(): HttpRequest;

    get(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    post(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    options(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    put(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    delete(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    patch(callback: (success: boolean, json: object, message: string, status: number) => void): void;

    request(method: string, callback: (success: boolean, json: object, message: string, status: number) => void): void;

    execute(method: string): Promise<any>

}

export function RFHttp(): HttpRequest

// Widget Resource
export type RFWidget = RFWidgetType;
export var RFWidget: RFWidgetType;

interface RFWidgetType {

    initResource(imageBaseUrl: string): RFWidget;

    initReferenceScreen(targetWidth: number, targetHeight: number): RFWidget;
}


