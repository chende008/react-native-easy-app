import React, {PureComponent} from 'react';

import {Clipboard, ScrollView, StyleSheet, View} from 'react-native';
import {Colors, CommonStyles} from '../../Common/storage/Const';
import {isEmpty, toStr} from '../../Common/utils/Utils';
import {dateFormat} from '../../Common/utils/DateUtils';
import {RNStorage} from '../../Common/storage/AppStorage';
import {RFText, RFView} from 'react-native-fast-app';
import {NavigationBar} from '../../Common/widgets/WidgetNavigation';
import {RNItem, RNLine} from '../../Common/widgets/WidgetDefault';
import DeviceInfo from 'react-native-device-info';
import {showToast} from '../../Common/widgets/Loading';

export default class StorageController extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            json: {
                age: 25,
                name: 'Tom',
                gender: 'male',
                time: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
            },
            dataChangedCount: 0,//数据变更统计
        };
    }

    render() {
        let {text, json, dataChangedCount} = this.state;
        return <View style={CommonStyles.container}>
            <NavigationBar title='数据存储'/>
            <RFView>
                <RFView style={{flexDirection: 'row'}}>
                    <RNItem text='设置字符串' style={{flex: 1}} onPress={() => RNStorage.str = 'this is a string '}/>
                    <RNItem text='获取字符串' style={{flex: 1}} onPress={() => this.setState({text: RNStorage.str + dateFormat(new Date(), 'yyyy-MM-dd hh:mm')})}/>
                </RFView>
                <RFView style={{flexDirection: 'row'}}>
                    <RNItem text='设置Json' style={{flex: 1}} onPress={() => RNStorage.json = json}/>
                    <RNItem text='获取Json' style={{flex: 1}} onPress={() => this.setState({text: JSON.stringify(RNStorage.json)})}/>
                </RFView>
                <RNItem text='随机字符串' onPress={() => {
                    RNStorage[DeviceInfo.getBundleId()] = '随机数据value：' + new Date().valueOf();
                    this.setState({dataChangedCount: dataChangedCount + 1});
                }}/>
            </RFView>
            <ScrollView>{
                Object.keys(RNStorage).map((key) => <RFView style={{backgroundColor: Colors.split_line, marginBottom: 1, padding: 10}}>
                    <RFText style={{fontSize: 15, color: Colors.text, fontWeight: 'bold'}} text={key + '-> '}/>
                    {RNStorage[key] && <RFText style={{fontSize: 13, color: Colors.text_light, marginTop: 10}} text={toStr(RNStorage[key])} onPress={() => {
                        Clipboard.setString(toStr(RNStorage[key]));
                        showToast('已复制【' + toStr(RNStorage[key]) + '】到粘贴板');
                    }}/>}
                </RFView>)}
            </ScrollView>
            <RNLine/>
            <RFText style={styles.text} text={'文本内容：' + text}/>
        </View>;
    }
}

const styles = StyleSheet.create({
    text: {
        padding: 10,
        fontSize: 14,
        color: Colors.red,
    },
});
