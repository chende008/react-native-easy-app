import React, {PureComponent} from 'react';
import {ScrollView} from 'react-native';
import {NavigationBar} from '../../Common/widgets/WidgetNavigation';
import {RFHttp, RFText, RFView} from 'react-native-fast-app';
import {RNItem} from '../../Common/widgets/WidgetDefault';
import {Colors, CommonStyles} from '../../Common/storage/Const';
import {Api} from '../http/Api';
import {showLoading, showToast} from '../../Common/widgets/Loading';

/**
 * 其它接口请求，接口返回的非json数据结构（纯文本&XML数据）
 */
export default class HttpController extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }

    render() {
        let {content} = this.state;
        return <RFView style={CommonStyles.container}>
            <NavigationBar title='请求示例'/>
            <RNItem text='获取图片列表：标准的json' onPress={() => this.animalImageList()}/>
            <RNItem text='同步请求成员列表：标准的json' onPress={() => this.queryMemberList()}/>
            <RNItem text='号码归属地：【非】标准json' onPress={() => this.getPhoneAddress()}/>
            <RNItem text='省份、城市记录数量：返回 XML' onPress={() => this.getCityAmount()}/>
            <ScrollView>
                <RFText style={{fontSize: 12, color: Colors.text_lighter, padding: 10}} text={content}/>
            </ScrollView>
        </RFView>;
    }

    animalImageList = () => {//返回标准的json的http请求
        RFHttp().url(Api.animalImageList).get((success, json, msg, code) => {
            if (success) {
                showToast('请求成功');
                this.setState({content: JSON.stringify(json)});
            } else {
                showToast(msg);
            }
        });
    };

    queryMemberList = async () => {//同步请求数据
        let {success, json, message, status} = await RFHttp().url(Api.queryMembers).execute('GET');

        success ? this.setState({content: JSON.stringify(json)}) : showToast(message);

        /***
         * 或者得使用标准的promise方式解析数据（异步promise）
         *
         * RFHttp().url(Api.queryMembers).execute('GET').then(({success, json, message, status}) => {
            if (success) {
                showToast('请求成功');
                this.setState({content: JSON.stringify(json)});
            } else {
                showToast(message);
            }
        }).catch(({message}) => {
            showToast(message);
        })
         */

    };

    getPhoneAddress = () => {//返回非标准的json的http请求
        RFHttp().url(Api.queryMobileAddress)
            .pureText().get((success, data, msg, code) => {
            if (success) {
                showToast('请求成功');
                this.setState({content: data});
            } else {
                showToast(msg);
            }
        });
    };

    getCityAmount = () => {//查询各城市Mobile服务数量
        RFHttp().url(Api.queryCitiesAmount)
            .contentType('text/xml; charset=utf-8')
            .loadingFunc((loading) => showLoading('请求中，请稍候...', loading))
            .pureText().get((success, data, msg, code) => {
            if (success) {
                showToast('请求成功');
                this.setState({content: data});
            } else {
                showToast(msg);
            }
        });
    };

}

