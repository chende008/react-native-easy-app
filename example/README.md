# react-native-fast-app Demo

### 功能点

 * Http公共配置与请求
 * AsyncStorage的访问与使用
 * 基础控件的封装，提高各种应用场景的快速布局

### 用法

 * 发送请求
     
   ```jsx
     const url = 'https://www.baidu.com';
    
     * 同步请求
     const response = await RFHttp().url(url).execute('GET');
     const {success, jData, message, status} = response;
     
     if(success){
        this.setState({content: JSON.stringify(jData)})
     } else {
        showToast(message)
     }
     
     * 异步请求
     RFHttp().url(url).get((success, jData, message, status)=>{
         if (success){
            this.setState({content: JSON.stringify(jData)});
         } else {
            showToast(msg);
         }
     });
             
     * 异步请求
     RFHttp().url(url).execute('GET')
     .then(({success, jData, message, status}) => {
         if (success) {
              this.setState({content: JSON.stringify(jData)});
         } else {
              showToast(message);
         }
      })
      .catch(({message}) => {
          showToast(message);
      })
     ```

 * App持久化数据存储（AsyncStorage封装）
    
   * 支持通过重写属性访问器，实现 = (赋值)与 . (点操作)对变量进行读写操作
   * 支持读写的数据类型包括字符串、json对象(数组)、bool类型
   
   ```jsx 
   
   * 自定义AsyncStorage实例对象
   const RNStorage= {
     customerId: undefined,
     hasLogin: undefined,
     userInfo: {}
   }
   
   * 将实例对象 RNStorage 与AsyncStorage 存储数据关联起来
   RFStorage.initStorage(RNStorage, () => {}, '1.0')
   
   * 假设登录后可以返回userInfo={}信息
   RFHttp().url(Api.authCodeLogin).param(params).post((success, jData, msg) => {
       if (success) {
           RNStorage.hasLogin = true; // bool类型存储
           RNStorage.customerId = String(jData.id); // 字符串类型存储
           RNStorage.userInfo = jData.userInfo; // 对象类型存储
           Actions.reset('main');
       } else {
           showToast(msg);
       }
   });
       
   * 在其它需要的地方可以直接使用RNStorage访问存储过的数据
   if (RNStorage.hasLogin) {
       let {name, age, idCard} = RNStorage.userInfo;
       console.log(name, age, idCard, RNStorage.customerId); // 打印用户信息    
   }
   ```

 * 基础控件的封装，提高各种应用场景的快速开发
    
   * RFTouch 系列防快速点击基础组件（所有点击事件的基础）
   * RFText 支持RNTouch点击事件、支持图标设置(相对于文本图标可设置居left、top、right、bottom)
   
   ![image](https://github.com/chende008/react-native-fast-app/blob/master/example/images/RNText.png)
   
   ```jsx
     * RFText 带图标的Text形式代码如下
        <RFText style={styles.grayText} text='文本显示'/>
        <RFText style={styles.text} onPress={() => showToast('点击事件')} text='文本显示（有触摸效果）'/>
        <RFView style={styles.iconTextParent}>
            <RFText style={styles.iconText} text='文本' icon='mine_focus_shop' iconSize={20} position='left'/>
            <RFText style={styles.iconText} text='文本' icon='mine_focus_shop' iconSize={20} position='right'/>
            <RFText style={styles.iconText} text='文本' icon='mine_focus_shop' iconSize={20} position='top'/>
            <RFText style={styles.iconText} text='可点击' icon='mine_focus_shop' iconSize={20} position='bottom' onPress={() => showToast('点击事件')}/>
            <RFText style={styles.iconText} text='无图标'/>
        </RFView>
        <RFText style={styles.rnTextItem} text='订单' icon='item_arrow_right' iconSize={16} position='right' textExtend={true}/>
        <RFView style={{backgroundColor: Colors.white, marginBottom: 30}}>
             <RFText style={styles.rnSearch} text='请输入客户姓名...' icon='home_search_icon' iconSize={16} position='left' iconMargin={6} onPress={() => showToast('点击跳转去搜索')}/>
        </RFView>
   ```
   * RFImage 支持点击事件（相应的提供图标尺寸可独立设置）
   
   ![image](https://github.com/chende008/react-native-fast-app/blob/master/example/images/RNImage.png)
   
   ```jsx
     *  RFImage 图片属性设置源码如下
        <RFView style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30}}>
              <RFImage style={{width: 65, height: 65}} icon='login_logo'/>
              <RFImage style={{width: 65, height: 65}} icon={imgUrl}/>
              <RFImage style={styles.rnImage} icon={imgUrl} onPress={() => showToast('柯南')}/>
              <RFImage style={{width: 65, height: 65}} icon='mine_setting' onPress={() => showToast('点击事件')}/>
              <RFImage style={{width: 65, height: 65}} icon='mine_setting' onPress={() => showToast('点击事件')} iconSize={30}/>
        </RFView>
   ```
  
  
 * 分页组件RFlatList，实现一整套包括无网络、加载中、无数据、加载错误、加载更多等一系列状态的可以分布列表展示功能。
 
   ```jsx 
        <RFlatList data={dataList}
             onRefresh={() => this.queryDataList(true)}
             onLoadMore={() => this.queryDataList(false)}
             ListHeaderComponent={() => <RNText style={styles.header} text={headerText}/>}
             ref={refreshList => this.refreshList = refreshList}
             renderItem={({item, index}) => <CarItem onItemSelected={(model) => showToast(model.title)}/>}/>
   ```
   组件提供了两个方法实现控制列表的各种状态显示 请求前预处理：`this.refreshList.refreshPreLoad(isPullDown)`</br>
   请求后状态设置：`this.refreshList.refreshLoaded(success, isPullDown, reachedEnd, code)`，具体用法可参考example项目
   
 * 多屏幕适配，在基础组件中实现多屏适配，使用得开发无感知适配
   
   原理：选定一个参考屏幕尺寸，将目标控件的尺寸值乘以【目标屏幕相对于参考屏幕的尺寸比例】（文本size增加一个FontScale比例）
   
   * 在所有基础组件构建的时候主动将【尺寸白名单】中列出的所有属性数据重置为按参考比例计算出来的数值
   
   ```jsx 
     * 源码实现
     export function resetStyle(style) {//重设属性(忽略外层尺寸)
         let styles = {...flattenStyle(selfOr(style, {}))};
         Object.keys(styles).forEach((keyStr) => {
             if (Props.sizeProps.has(keyStr)) {// 需要修改尺寸的属性
                 if (keyStr === 'fontSize') {//字体属性
                     styles[keyStr] = RTSize(styles[keyStr]);
                 } else {
                     let value = styles[keyStr];//样式属性值,若为整型数据且不为onePixel则重置数值
                     if (typeof value === 'number' && value !== Const.onePixel) {
                         styles[keyStr] = RNSize(value);
                     }
                 }
             }
         });
         return styles;
     }
   ``` 
