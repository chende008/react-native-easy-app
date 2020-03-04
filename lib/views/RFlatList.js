import React, { PureComponent } from 'react'

import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'

import PropTypes from 'prop-types'
import { Const } from '../const/Const'
import { isEmpty, selfOr } from '../utils/RFUtils'
import { ImageRes } from '../const/ImageRes'
import { RFTouch } from '../widget/WidgetTouchable'
import { RFText, RFView } from '../widget/WidgetBase'

const imageStyle = { width: Const.screenWidth * 0.6, height: Const.screenWidth * 0.6 * 0.72727 }

export default class RFlatList extends PureComponent {

    constructor(props) {
        super(props);
        if (!isEmpty(props.refreshStatus)) {
            RFlatList.RefreshStatus = { ...RFlatList.RefreshStatus, ...props.refreshStatus }
        }
        this.state = { status: RFlatList.RefreshStatus.RefreshingData }
    }

    render() {
        let {status} = this.state;
        let {onRefresh, onLoadMore, data, indicatorOffset, emptySizeRate, ...props} = this.props;
        let canLoadMore = status === RFlatList.RefreshStatus.Idle;
        let refreshControl = <RefreshControl onRefresh={() => onRefresh()} refreshing={status === RFlatList.RefreshStatus.RefreshingData} progressViewOffset={selfOr(indicatorOffset, 50)}/>
        return <FlatList data={data}
                         refreshing={status === RFlatList.RefreshStatus.RefreshingData}
                         onEndReached={() => {//处理FlatList控件在IOS上的bug
                             if (this.loadMoreTag) {
                                 canLoadMore && onLoadMore && onLoadMore();
                                 this.loadMoreTag = false
                             }
                         }}
                         refreshControl={refreshControl}
                         keyExtractor={(item, index) => index.toString()}
                         ListEmptyComponent={() => this.renderEmptyView(status, isEmpty(data), emptySizeRate)}
                         ListFooterComponent={() => this.renderFooter(status, isEmpty(data))}
                         onContentSizeChange={() => this.loadMoreTag = true}
                         onEndReachedThreshold={0.5}{...props} />
    }

    renderEmptyView = (status, empty, emptySizeRate) => {//数据加载emptyView
        let {noDataText, noDataImage = false} = this.props;
        let emptyView = null;
        let text = status === RFlatList.RefreshStatus.NoData ? noDataText || status.text : status.text;
        let image = status === RFlatList.RefreshStatus.NoData ? noDataImage || status.image : status.image;

        if (RFlatList.RefreshStatus.RefreshingData !== status || empty) {//【非下拉刷新】或者【下拉刷新但列表为空】时展示EmptyView
            emptyView = <RFView style={[styles.emptyContainer, {height: Const.screenHeight * emptySizeRate}]}>
                {image && <Image style={imageStyle} resizeMode='contain' source={{uri: image}}/>}
                <RFText style={{color: '#919BA5', fontSize: 14}} text={text}/>
            </RFView>
        }
        return emptyView
    };

    renderFooter = (status, isEmpty) => {//加载更多View
        let footerView = null;
        switch (status) {
            case RFlatList.RefreshStatus.LoadingMoreData://加载更多,进行中...
                footerView = <RFView style={styles.footerContainer}>
                    <ActivityIndicator style={{marginRight: 8}} size="small" color="#888888"/>
                    <Text style={styles.footerText}>{status.moreText}</Text>
                </RFView>;
                break;
            case RFlatList.RefreshStatus.NoMoreData://加载更多（无数据）
                footerView = <RFView style={styles.footerContainer}><Text style={styles.footerText}>{status.moreText}</Text></RFView>
                break;
            case RFlatList.RefreshStatus.LoadMoreFailure://加载更多（加载失败）
            case RFlatList.RefreshStatus.NetException://网络异常
                footerView = !isEmpty && <View style={styles.footerContainer}>
                    <RFTouch onPress={() => this.props.onLoadMore && this.props.onLoadMore()}>
                        <Text style={styles.footerText}>{status.moreText}</Text>
                    </RFTouch>
                </View>;
                break
        }
        return footerView
    };

    refreshPreLoad = (isPullDown) => {//预加载状态设置
        this.setState({status: isPullDown ? RFlatList.RefreshStatus.RefreshingData : RFlatList.RefreshStatus.LoadingMoreData})
    };

    refreshLoaded = (success, isPullDown, reachedEnd, code) => {//加载完成状态设置
        if (success) {
            if (reachedEnd) {//没有更多数据
                this.setState({status: isPullDown ? RFlatList.RefreshStatus.NoData : RFlatList.RefreshStatus.NoMoreData})
            } else {//返回有效的数据
                this.setState({status: RFlatList.RefreshStatus.Idle})
            }
        } else {
            this.setState({status: isPullDown ? RFlatList.RefreshStatus.LoadFailure : RFlatList.RefreshStatus.LoadMoreFailure})
        }
        if (code === -1) {//网络异常
            this.setState({status: RFlatList.RefreshStatus.NetException})
        }
    };

    static propTypes = {
        onLoadMore: PropTypes.func,
        data: PropTypes.array,
        noDataText: PropTypes.string,
        noDataImage: PropTypes.bool,
        indicatorOffset: PropTypes.number,
        refreshStatus: PropTypes.object,
        emptySizeRate: PropTypes.number,
    };

    static RefreshStatus = {
        Idle: {},//闲置状态

        RefreshingData: { image: ImageRes.loading, text: '加载中，请稍候...' },//下拉刷新中..
        NoData: { image: ImageRes.noData, text: '加载完成，无数据' },//下拉刷新（无数据）
        LoadFailure: { image: ImageRes.loadFail, text: '加载失败' },//下拉刷新（加载失败）

        LoadingMoreData: { moreText: '数据加载中…' },//加载更多,进行中...
        NoMoreData: { moreText: '已加载全部数据' },//加载更多（无数据）
        LoadMoreFailure: { moreText: '点击重新加载' },//加载更多（加载失败）

        NetException: { image: ImageRes.netException, text: '网络异常', moreText: '网络异常,点击重新加载' }, //网络异常
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        height: 44,
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#919BA5',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
