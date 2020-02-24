import React, {PureComponent} from 'react';
import {BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {NavigationBar} from '../Common/widgets/WidgetNavigation';
import {RNItem} from '../Common/widgets/WidgetDefault';
import HttpConfig from './http/HttpConfig';
import {showToast} from '../Common/widgets/Loading';

let lastClickTime = (new Date()).valueOf();

export default class MainController extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        HttpConfig.initDemo();
    }

    render() {
        return <>
            <NavigationBar title='RNDemo' hideBack/>
            <RNItem text='Http请求' onPress={() => Actions.http()}/>
            <RNItem text='数据存储' onPress={() => Actions.storage()}/>
            <RNItem text='基础控件' onPress={() => Actions.widget()}/>
            <RNItem text='刷新列表' onPress={() => Actions.refreshList()}/>
        </>;
    }

    componentDidMount(): void {
        this.listener = BackHandler.addEventListener('hardwareBackPress', () => {
            if (Actions.currentScene === 'main') {
                let nowTime = (new Date()).valueOf();
                if (nowTime - lastClickTime < 1000) {//间隔时间小于1秒才能退出
                    BackHandler.exitApp();
                } else {
                    showToast('再按一次，退出example');
                    lastClickTime = nowTime;
                }
                return true;
            }
            return false;
        });
    }

    componentWillUnmount(): void {
        this.listener && this.listener.remove();
    }
}
