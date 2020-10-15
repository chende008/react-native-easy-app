// @ts-ignore
import React from 'react'
// @ts-ignore
import {Image, TextProps, TouchableOpacityProps, FlatListProps, SectionListProps, ViewStyle} from 'react-native'

interface XStorage {

    initStorage(targetObj: object, storageImp: object, initializedCallback: () => void, dataChangedCallback?: (dataSet) => void): string

    initStorageSync(targetObj: object, storageImp: object, dataChangedCallback?: (dataSet) => void): Promise<boolean>;

    multiGet(keys: string[]): Promise<any>;

    saveItems(keyValuePairs: string[][]): Promise<any>;

    removeItems(keys: string[]): Promise<any>;

    clear(): Promise<any>;
}

// Storage
export var XStorage: XStorage;

interface HttpRequest {

    constructor(serverTag?: string)

    url(url: string): HttpRequest;

    param(param: object): HttpRequest;

    paramRaw(paramRaw: object): HttpRequest;

    contentType(contentType: string): HttpRequest;

    internal(internal: boolean): HttpRequest;

    header(header: object): HttpRequest;

    extra(extra: any): HttpRequest;

    timeout(timeout: number): HttpRequest;

    loadingFunc(func: (loading: boolean) => void): HttpRequest;

    configCommonFunc(enableHeaderFunc: boolean, enableParamFunc: boolean): HttpRequest;

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

    fetch(method: string): Promise<any>

}

interface HttpConfig {

    constructor(serverTag?: string)

    initBaseUrl(baseUrl: string): HttpConfig;

    initTimeout(timeout: number): HttpConfig;

    initHttpLogOn(httpLogOn: boolean): HttpConfig;

    initHeaderSetFunc(headerSetFunc: (headers: object, request: object) => void): HttpConfig;

    initParamSetFunc(paramSetFunc: (params: object, request: object) => void): HttpConfig;

    initParseDataFunc(result: object, request: object, callback: (success: boolean, data: object, message: string, status: number, response: object) => void): HttpConfig;

    initContentType(contentType: string): HttpConfig;

    initLoadingFunc(loadingFunc: (loading: boolean) => void): HttpConfig;

    initEncodeURIComponent(encodeComponent: boolean): HttpConfig;

    initNetworkExceptionFunc(netInfo, networkExceptionFunc: (message: string, code: number) => void): HttpConfig;
}

interface XHttpConst {
    TIMEOUT: number,
    CONTENT_TYPE_JSON: string,
    CONTENT_TYPE_FORM_DATA: string,
    CONTENT_TYPE_URLENCODED: string,
    ServerTag: string,
    Methods: object,
    errorDesc: object
    statusDesc: object,
}

// XHttpConst
export var XHttpConst: XHttpConst;

// Http HttpRequest
export var HttpRequest: HttpRequest;

// Http HttpConfig
export var HttpConfig: HttpConfig;

export function XHttp(serverTag?: string): HttpRequest

export function XHttpConfig(serverTag?: string): HttpConfig

export function XSize(size: number): number

export function XTSize(size: number): number

export function XResetStyle(style: ViewStyle): ViewStyle

export function XSplitStyle(style: ViewStyle): object

export function XFattenStyle(style: ViewStyle): ViewStyle

interface XWidget {
    initResource(imageBaseUrl: string): XWidget;

    initReferenceScreen(targetWidth: number, targetHeight: number): XWidget;
}

// Widget Resource
export var XWidget: XWidget;

export interface XImageProps {
    raw?: boolean
    icon: string,
    iconSize?: number,
}

// XImage
export class XImage extends React.Component<XImageProps & TouchableOpacityProps> {
}

declare type IconPosition = 'left' | 'top' | 'right' | 'bottom';

export interface XTextProps {
    raw?: boolean,
    text: string,
    icon?: string,
    iconSize?: number,
    iconStyle?: object,
    resizeMode?: string,
    iconMargin?: number,
    textExtend?: boolean,
    iconPosition?: IconPosition,
}

// XText
export class XText extends React.Component<XTextProps & TextProps & TouchableOpacityProps> {
}

// XView
export class XView extends React.Component<TouchableOpacityProps> {
}

export interface XFatListProps {
    onLoadMore?: Function,
    noDataText?: string,
    noDataImage?: boolean,
    indicatorOffset?: number,
    refreshStatus?: object,
    emptyViewHeight?: number,
}

// XFlatList
export class XFlatList extends React.Component<XFatListProps & FlatListProps<any> & SectionListProps<any>> {
}

