import DeviceInfo from 'react-native-device-info';
import {RFApiConst} from 'react-native-fast-app';
import RFLog from '../../Common/utils/RFLog';
import {isEmpty} from '../../Common/utils/Utils';
import {RNStorage} from '../../Common/storage/AppStorage';
import {showToast} from '../../Common/widgets/Loading';
import {ApiCredit} from './Api';

let promise = null;
let headers = null;

export default class AuthToken {

    static parseTokenRes(response) {//解析tokens
        if (response == null || response.headers == null || response.headers.map == null) {
            return;
        }

        let access_token = AuthToken.parseToken(response.headers.map['access-token']);
        RNStorage.accessToken = access_token || RNStorage.accessToken;

        let refresh_token = AuthToken.parseToken(response.headers.map['refresh-token']);
        RNStorage.refreshToken = refresh_token || RNStorage.refreshToken;
    }

    static parseToken(tokens) {//读取token
        return tokens && Array.isArray(tokens) ? tokens[0] : tokens;
    }

    static getAccessToken() {
        if (promise === null) {
            promise = new Promise((resolve, reject) => {
                let headerParams = {//请求头参数
                    'Content-Type': RFApiConst.CONTENT_TYPE_URLENCODED,
                    'refresh-token': RNStorage.refreshToken,
                };
                showToast('token失效，重新生成token');
                let requestUrl = ApiCredit.baseUrl + ApiCredit.refreshToken + '?CUSTOMER_ID=' + RNStorage.customerId;
                fetch(requestUrl, {headers: headerParams}).then(response => response.json()).then(jData => {
                    let {successful, data: {access_token}, errorDescription} = jData;
                    if (successful === 1) {//成功获取到refreshToken
                        RNStorage.accessToken = access_token;
                        RFLog.log('重新获取到accessToken：' + access_token);
                        resolve();
                    } else {
                        toLogout(errorDescription);
                        reject();
                    }
                    promise = null;
                }).catch(error => {
                    toLogout();
                    reject();
                });
            });
        }
        return promise;
    }

    static baseHeaders(internal) {//header基础参数拼接
        if (internal && isEmpty(headers)) {//header只初始化一次
            headers = {};
            headers.channelCode = RNStorage.channelCode;
            headers.sourceMark = Const.sourceMark;
            headers.brand = DeviceInfo.getBrand();
            headers.model = DeviceInfo.getModel();
            headers.version = DeviceInfo.getVersion();
            headers.uniqueId = RNStorage.uniqueId;
        }
        return internal ? headers : {};
    }
}
