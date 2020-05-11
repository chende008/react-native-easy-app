// @ts-ignore
import React from 'react'
// @ts-ignore
import {Image, TextProps, TouchableOpacityProps, FlatListProps, SectionListProps, ViewStyle} from 'react-native'

interface RFStorage {

    initStorage(targetObj: object, initializedCallback: () => void, dataChangedCallback?: (dataSet) => void, version?: string): string

    syncInitStorage(targetObj: object, dataChangedCallback?: (dataSet) => void, version?: string): Promise<boolean>;

    multiGet(keys: any): Promise<any>;

    saveItems(keyValuePairs: any): Promise<any>;

    removeItems(keys: any): Promise<any>;

    clear(): Promise<any>;
}

// Storage
export var RFStorage: RFStorage;

interface HttpRequest {

    new(): HttpRequest;

    url(url: string): HttpRequest;

    param(param: object): HttpRequest;

    contentType(contentType: string): HttpRequest;

    internal(internal: boolean): HttpRequest;

    header(header: object): HttpRequest;

    encodeURI(): HttpRequest;

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

    new(serverTag?: string): HttpConfig;

    initBaseUrl(baseUrl: string): HttpConfig;

    initTimeout(timeout: number): HttpConfig;

    initHttpLogOn(httpLogOn: boolean): HttpConfig;

    initHeaderSetFunc(headerSetFunc: (headers: object, request: object) => void): HttpConfig;

    initParamSetFunc(paramSetFunc: (params: object, request: object) => void): HttpConfig;

    initParseDataFunc(result: object, request: object, callback: (success: boolean, data: object, message: string, status: number, response: object) => void): HttpConfig;

    initContentType(contentType: string): HttpConfig;

    initLoadingFunc(loadingFunc: (loading: boolean) => void): HttpConfig;

}

interface RFHttpConst {
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
export var RFHttpConst: RFHttpConst;

// Http HttpRequest
export var HttpRequest: HttpRequest;

// Http HttpConfig
export var HttpConfig: HttpConfig;

export function RFHttp(): HttpRequest

export function RFHttpConfig(serverTag?: string): HttpConfig

export function RFSize(size: number): number

export function RTSize(size: number): number

export function RFResetStyle(style: ViewStyle): ViewStyle

export function RFSplitStyle(style: ViewStyle): object

export function RFlattenStyle(style: ViewStyle): ViewStyle

interface RFWidget {
    initResource(imageBaseUrl: string): RFWidget;

    initReferenceScreen(targetWidth: number, targetHeight: number): RFWidget;
}

// Widget Resource
export var RFWidget: RFWidget;

export interface RFImageProps {
    raw?: boolean
    icon: string,
    iconSize?: number,
}

// XImage
export class RFImage extends React.Component<RFImageProps & TouchableOpacityProps> {
}

declare type IconPosition = 'left' | 'top' | 'right' | 'bottom';

export interface RFTextProps {
    raw?: boolean,
    text: string,
    icon?: string,
    iconSize?: number,
    iconMargin?: number,
    textExtend?: boolean,
    iconPosition?: IconPosition,
}

// XText
export class RFText extends React.Component<RFTextProps & TextProps & TouchableOpacityProps> {
}

// XView
export class RFView extends React.Component<TouchableOpacityProps> {
}

export interface RFlatListProps {
    onLoadMore?: Function,
    noDataText?: string,
    noDataImage?: boolean,
    indicatorOffset?: number,
    refreshStatus?: object,
    emptyViewHeight?: number,
}

// XFlatList
export class RFlatList extends React.Component<RFlatListProps & FlatListProps<any> & SectionListProps<any>> {
}

