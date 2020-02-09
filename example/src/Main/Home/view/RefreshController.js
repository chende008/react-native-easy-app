import React, {PureComponent} from 'react';

import {StyleSheet, View, Text} from 'react-native';

import {Colors, CommonStyles, Const} from '../../Common/storage/Const';
import {RFHttp, RFImage, RFlatList, RFText, RFView} from 'react-native-fast-app';
import {NavigationBar} from '../../Common/widgets/WidgetNavigation';
import {Api} from '../http/Api';
import {showToast} from '../../Common/widgets/Loading';

const headerText = '分页列表支持：无网络，加载中，无数据，加载错误，加载更多等一系列状态展示';

export default class RefreshController extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {dataList: []};
        this.pageIndex = 1;//页码
    }

    render() {
        let {dataList} = this.state;
        return <View style={CommonStyles.container}>
            <NavigationBar title='RefreshList组件'/>
            <RFlatList data={dataList}
                       onRefresh={() => this.queryDataList(true)}
                       onLoadMore={() => this.queryDataList(false)}
                       ListHeaderComponent={() => <RFText style={styles.header} text={headerText}/>}
                       ref={refreshList => this.refreshList = refreshList}
                       renderItem={({item, index}) => this.renderItem(item, index)}/>
        </View>;
    }

    componentDidMount() {
        this.queryDataList(true);
    }

    queryDataList = (isPullDown) => {
        let {dataList} = this.state;
        this.pageIndex = isPullDown ? 1 : this.pageIndex + 1;
        this.refreshList && this.refreshList.refreshPreLoad(isPullDown);
        let params = {page: isPullDown ? 1 : this.pageIndex};
        RFHttp().url(Api.queryAnimations).param(params).contentType(null).get((success, {results, last_page}, msg, code) => {
            this.refreshList && this.refreshList.refreshLoaded(success, isPullDown, params.page >= last_page, code);
            if (success) {
                this.setState({dataList: isPullDown ? results : [...dataList, ...results]});
            } else {
                showToast(msg);
            }
        });
    };

    renderItem = (item, index) => {
        let {title, image_url, type, score, synopsis, members} = item;
        return <RFView key={index} style={styles.itemParent}>
            <RFImage style={{width: 120, height: 120, margin: 5}} resizeMode='contain' icon={image_url}/>
            <RFView style={{flex: 1}}>
                <RFText style={{fontSize: 14, fontWeight: 'bold', color: Colors.text, paddingRight: 5}} text={'名称：' + title}/>
                <RFText style={styles.itemDesc} numberOfLines={4} text={synopsis}/>
                <RFText style={{fontSize: 12, color: Colors.text}} text={'评分：' + score + '    参与人数：' + members}/>
            </RFView>
        </RFView>;
    };
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        fontSize: 12,
        lineHeight: 16,
        color: Colors.red,
    },
    itemParent: {
        marginTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        borderBottomWidth: Const.onePixel,
        borderBottomColor: Colors.split_line,
    },
    itemDesc: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        paddingRight: 8,
        paddingVertical: 5,
        color: Colors.text_lighter,
    },
});
