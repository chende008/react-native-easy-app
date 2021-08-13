## react-native-easy-app （RN开发 一站式解决方案）

[English version doc here](README.en-US.md)

![开发交流QQ群](https://upload-images.jianshu.io/upload_images/22060892-fff0d333a861f9b5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 安装

```bash
npm install react-native-easy-app --save
``` 
或者

```bash
yarn add react-native-easy-app
```

### 功能点

  * 支持快捷[同步]访问AsyncStorage
  * 支持灵活、可配置的Http请求
  * 灵活的基础控件(无感知多屏适配)

### 快速开始 

   详细使用方法，请参考示例项目 [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux),  [Sample_Hook](https://github.com/chende008/Sample_Hook)
  
   您也可以参考文章对react-native-easy-app使用介绍： [简书](https://www.jianshu.com/p/88821b1607a7)

   * **用AsyncStorage快速实现一个可持久化的数据存、取管理器**
   
      ```jsx 
         export const RNStorage = {// RNStorage 自定义数据存储对象
             token: null, //  字符串类型
             isShow: null, // 布尔类型
             userInfo: null, // 对象类型
         };
      ```
      
      ```jsx
        import { XStorage } from 'react-native-easy-app';
        import { AsyncStorage } from 'react-native';
        
        const result = await XStorage.initStorageSync(RNStorage, AsyncStorage);
        if (result) {
            ... // RNStorage 【属性访问代码片段】
        }
        
        // ----------上下，同、异步两种初始化方法 2选1--------------------------
        
        XStorage.initStorage(RNStorage, AsyncStorage, () => {
            ... // RNStorage 【属性访问代码片段】
        });
      ```
      
      ```jsx 
       // RNStorage 【属性访问代码片段】 
       
       // 当自定义对象 RNStorage 被初始化完成之后，就可以对其任何属性进行取值、赋值操作；
       // 对RNStorage 属性的取、赋值操作会被自动映射成 AsyncStorage 的getItem与setItem方法；
                   
       console.log(RNStorage.isShow);
       // 相当于 [ console.log(await AsyncStorage.getItem('isShow')) ] 
       
       RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3==';
       // 相当于 [ await AsyncStorage.setItem('token',TOKEN1343DN23IDD3PJ2DBF3==') ] 
       
       RNStorage.userInfo = {name: 'rufeng', age: 30};
       // 相当于 [ await AsyncStorage.setItem('userInfo',JSON.stringify({ name:'rufeng', age:30})) ] 
      ```
      
       **XStorage 对象** 
            
       | 方法                  |                   参数                                            |      返回值类型                | 描述                                                                      |
       | ----------------------|:-----------------------------------------------------------------|:-----------------------------:| :-----------------------------------------------------------------------|
       | initStorage           | (targetObj, storageImp, initCallback, dataCallback?)             |  void                         | 将【targetObj】对象中的属性与【AsyncStorage】中的字段建立映射，形成绑定关系      |
       | initStorageSync       | (targetObj, storageImp, dataCallback?)                           |  Promise<boolean>             | 以Promise形式将【targetObj】与【AsyncStorage】建立绑定关系                   |                                                             |
       | multiGet              |           **keys** *:string[]*                                   |  Promise<[string, string][]>  | 等价于 AsyncStorage.multiGet()                                           |
       | saveItems             |           **keyValuePairs** *:string[][]*                        |  Promise<void>                | 等价于 AsyncStorage.multiSet()                                           |
       | removeItems           |           **keys** *:string[]*                                   |  Promise<void>                | 等价于 AsyncStorage.multiRemove()                                        |
       | clear                 |           none                                                   |  void                         | 等价于 AsyncStorage.clear()                                              |
   
       **XStorage.initStorage 方法参数描述**  
       
       | 参数名                                     | 是否必需 |                   形式                        | 描述                                  |
       | ------------------------------------------|:-------:|:---------------------------------------------:| :------------------------------------|
       | **storageObj** *:object*                  |    是   | { token:undefined, userName:undefined, ...}   | 需要持久化的数据列表对象                 |
       | **storageImp** *:AsyncStorage*            |    是   |           AsyncStorage                        | 数据持久化实现基础(AsyncStorage实例)     |
       | **initializedFunc** *:callback function*  |    是   |         ()=>{ ... }                           | 持久化映射成功成功后的回调                |   
       | **dataChangedFunc** *?:callback function* |    否   |         (dataSet)=>{ ... }                    | 持久化数据变更后的回调                   |
       
       <u>*注意：若项目的React Native 版本高于0.60，storageImp的参数，建议使用 '@react-native-community/async-storage'中的【AsyncStorage】实例*</u>
    
    
   * **支持可配置的Http请求**
   
     * 一切基于配置（配置可选，自由设定）
     
      ```jsx 
      import { XHttpConfig, XHttpConst } from 'react-native-easy-app';
      
      XHttpConfig().initLogOn(true)
                   .initBaseUrl('https://www.baidu.com')
                   .initTimeout(15000)
                   .initContentType(XHttpConst.CONTENT_TYPE_URLENCODED)
                   .initLoadingFunc((isLoading)=>{
                      ...
                   })
                   .initHeaderSetFunc((headers, request) => {
                      ...
                   })
                   .initParamSetFunc((params, request) => {
                      ...
                   })
                   .initParseDataFunc((result, request, callback) => {
                      let {success, json, response, message, status} = result;
                      ...
                    }
               );
      ```
      
      **XHttpConfig 对象 （所有方法都是可选的）** 
      
      | 方法                      |                   参数                                 |      返回类型           | 描述                                                                                     |
      | -------------------------|:------------------------------------------------------|:----------------------:| :---------------------------------------------------------------------------------------|
      | constructor              |           **serverTag** *?:string*                    |  XHttpConfig Builder   | 与XHttp(serverTag)保持一致(用于多服务器请求配置)，默认为空                                     |
      | initBaseUrl              |           **baseUrl** *:string*                       |  XHttpConfig Builder   | 设置Http请求公共的BaseUrl                                                                  |
      | initTimeout              |           **timeout** *:number*                       |  XHttpConfig Builder   | 设置公共的默认请求超时时间                                                                   |
      | initLogOn                |           **logOn** *:bool*                           |  XHttpConfig Builder   | 设置是否打印Http请求日志                                                                    |
      | initContentType          |           **contentType** *:string*                   |  XHttpConfig Builder   | 设置Http请求默认的ContentType                                                              |
      | initLoadingFunc          |           **(isLoading) => {...}**                    |  XHttpConfig Builder   | Http公共请求状态回调，isLoading为true表示请求进行中                                           |
      | initHeaderSetFunc        |           **(headers, request) => {...}**             |  XHttpConfig Builder   | 请求header设置拦截器；可在此处，为请求添加公共的headers参数                                     |
      | initParamSetFunc         |           **(params, request) => {...}**              |  HttpRequest Builder   | 请求body(params)设置拦截器；可在此处，为请求添加公共的params参数                                |
      | initParseDataFunc        |           **(result, request, callback) => {...}**    |  XHttpConfig Builder   | 请求回调拦截器；可在此处，为接口返回数据做公共解析处理                                           |
      | initEncodeURIComponent   |           **encodeComponent** *:boolean*              |  HttpRequest Builder   | 全局设置是否对参数进行encodeURLComponent编码，内容类型为：application/x-www-form-urlencoded 时 |
      | initNetworkExceptionFunc |           **(NetInfo,(message, code) => {...})**      |  HttpRequest Builder   | 给请求库提供检查当前网络状态的工具库(@react-native-community/netinfo的实例对象) [require => android.permission.CHANGE_NETWORK_STATE] |
     
   * **发送请求模板**
     
     ```jsx 
        import { XHttp } from 'react-native-easy-app';
     
        let url = 'v1/account/login/';
        let param = { phone: '18600000000', authCode: '123456'};
        let header = { Authorization: "Basic Y3Rlcm1pbmF......HcVp0WGtI"};
        let callback = () => (success, json, message, status, respoonse) => {
             if (success) {
                showToast(JSON.stringify(json))
             } else {
                showToast(message)
             }
        };
     
        * 可设置的参数以builder形式拼接
        XHttp().url(url)
            .header(header)
            .param(param)
            .internal(true)
            .rawData()
            .pureText()
            .timeout(10000)
            .extra({tag: 'xx'})
            .contentType('text/xml')
            .loadingFunc((loading)=> showLoading('请求中，请稍候...', loading))
            .rawData()
            .pureText()
            .configCommonFunc(true,true)
            .[formJson|formData|formEncoded]()
            .[get|post|put|patch|delete|options](callback);
       
     ```
     
     **HttpRequest 对象** 
     
     | 方法                  |                   参数                                            |      返回类型          | 描述                                                                                                |
     | ----------------------|:-----------------------------------------------------------------|:---------------------:|:---------------------------------------------------------------------------------------------------|
     | constructor           |           **serverTag** *:string*                                |  HttpRequest Builder  | 与XHttpConfig(serverTag)保持一致(用于多服务器请求配置)，默认为空                                          |
     | url                   |           **url** *:string*                                      |  HttpRequest Builder  | 设置请求的url；若XHttpConfig中配置了baseUrl，当前只需要配置接口url后缀即可                                 |
     | header                |  **{ Accept, Authorization ... }**  *:object*                    |  HttpRequest Builder  | 设置当前请求的header参数；若与XHttpConfig中配置的公共header参数同名，则以当前设置为准                        |
     | param                 |  **{ userName, password ...  }** 或 **FormData** *:object*       |  HttpRequest Builder  | 设置当前请求的params参数(可以传FormData对象)；若与XHttpConfig中配置的公共params参数同名，则以当前设置为准      |
     | paramRaw              |  **{ userName, password ...  }** 或 **FormData** *:object*       |  HttpRequest Builder  | 设置当前请求的paramsRaw参数, 当前传入的参数不会做任何处理，直接作为fetch请求的的body                          |
     | contentType           |           **contentType** *:string*                              |  HttpRequest Builder  | 设置当前请求的ContentType；若XHttpConfig中设置公共的ContentType，则以当前设置为准                          |
     | internal              |           **internal** *:bool*                                   |  HttpRequest Builder  | 用于请求区别标记，默认为true；通常在XHttp中传入，在XHttpConfig的回调拦截器中使用，拦截器的request中可取该值     |
     | extra                 |           **{customTag ...}**                                    |  HttpRequest Builder  | 用于请求区别标记，通常在XHttp中传入，在XHttpConfig的回调拦截器中使用，拦截器的request中可取该值                |
     | timeout               |           **timeout** *:number*                                  |  HttpRequest Builder  | 设置当前请求的超时时长，单位毫秒                                                                        |
     | loadingFunc           |           **(isLoading)=>{ ... }**                               |  HttpRequest Builder  | 当前接口请求状态回调；isLoading为true表示请求进行中                                                      |
     | configCommonFunc      |( **enableHeaderFunc** *:bool*, **enableParamFunc** *:bool* )     |  HttpRequest Builder  | 设置在XHttpConfig添加的**[initHeaderSetFunc] [initParamSetFunc]**是否生效，默认为true（生效）            |
     | rawData               |           none                                                   |  HttpRequest Builder  | 设置返回的接口数据是否为原始未处理过的数据；若调用，则会忽略XHttpConfig中设置**[initParseDataFunc]**函数作用    |
     | pureText              |           none                                                   |  HttpRequest Builder  | 设置返回的接口数据是否为纯文本数据（框架默认为接口为json数据，若后台返回的数据为非json结构时间使用：如 XML 格式     |
     | formJson              |           none                                                   |  HttpRequest Builder  | 等价于设置当前接口请求类型 ( headers['Content-Type'] = 'application/json' )                             |
     | formData              |           none                                                   |  HttpRequest Builder  | 等价于设置当前接口请求类型 ( headers['Content-Type'] = 'multipart/form-data' )                          |
     | formEncoded           |           none                                                   |  HttpRequest Builder  | 等价于设置当前接口请求类型 ( headers['Content-Type'] = 'application/x-www-form-urlencoded' )            |
     | get                   |**(success, json, message, status ,response) => void**            |    void               | get 请求及回调                                                                                        |
     | post                  |**(success, json, message, status ,response) => void**            |    void               | post 请求及回调                                                                                       |
     | options               |**(success, json, message, status ,response) => void**            |    void               | options 请求及回调                                                                                    |
     | put                   |**(success, json, message, status ,response) => void**            |    void               | put 请求及回调                                                                                        |
     | delete                |**(success, json, message, status ,response) => void**            |    void               | delete 请求及回调                                                                                     |
     | patch                 |**(success, json, message, status ,response) => void**            |    void               | patch 请求及回调                                                                                      |
     | request               |**(method, (success, json, message, status ,response) => void )** |    void               | 以指定的请求method，发送请求并回调                                                                       |
     | execute               |          **method** *:string*                                    |   Promise             | 以指定的请求method，发送请求并返回一个Promise对象                                                         |
     | fetch                 |          **method** *:string*                                    |   Promise             | 以指定的请求method，发送请求并返回一个Promise对象，返回的数据不做任何处理，以RN原生fetch的方式结果原样返回        |
     
     *new HttpRequest() ==> XHttp()* 
          
     **推荐通过 XHttp() 的形式来发送Http请求会更便捷**
     
   * **发送请求**
     
      * 同步请求
      ```jsx
         import { XHttp } from 'react-native-easy-app';
         
         const url = 'https://www.google.com';
        
         const result = await XHttp().url(url).execute('GET');
         const {success, json, message, status, response} = result;
         
         if(success){
            this.setState({content: JSON.stringify(json)})
         } else {
            showToast(message)
         }
      ```
      
      * 异步请求 方式1
      ```jsx
         XHttp().url(url).get((success, json, message, status, response)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
      ```
            
      * 异步请求 方式2           
      ```jsx
         XHttp().url(url).execute('GET').then(({success, json, message, status, response}) => {
             if (success) {
                  this.setState({content: JSON.stringify(json)});
             } else {
                  showToast(message);
             }
          })
      ```
     
     * 灵活的基础控件
     ```
        XImage
        XText
        XView
        
        XFlatList
        
        XWidget
        .initResource(AssetsBaseUrl)    // XImage组件的icon属性的uri前缀
        .initReferenceScreen(375, 677); // UI 整体尺寸缩放参考屏幕尺寸
     ```

     **XView，XImage，XText都包含raw属性，若raw值为true，则会忽略XWidget.initReferenceScreen( *referenceWidth*, *referenceHeight* )的设置：不自动处理多屏尺寸适配**

     **XView 组件** 
     
     | 属性        |    类型     |      描述                                                                                   |
     | ------------|:-----------:|:------------------------------------------------------------------------------------------|
     | raw         |    bool     | 默认为false，若为true 则不会自动处理多屏幕尺寸适配                                               |
     | ...         |    ...      | 若包含onPress或onLongPress属性，则等同于TouchableXXX系列组件,否则等同于View组件,并拥有其相应的属性  |
     
     **XImage Object** 
     
     | 属性        |    类型          |      描述                                                                                                                                                |
     | ------------|:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
     | raw         |    bool         | 默认为false，若为true 则不会自动处理多屏幕尺寸适配                                                                                                             |
     | icon        |     string      | 相当于Image的source属性，可以接受的参数格式如：[https://xxx.yy.com/image.jpg]，[data: image / png; base64, iVBORw0KGgoAAAAN ...]，[require ('./ image.jpg')]   |
     | iconSize    |     number      | 图标的尺寸，优先级高于style的width与height                                                                                                                   |
     | ...         |    ...          | 如果设置了onPress和onLongPress函数，XImage将被XView包裹，并且外部传入的属性将会自动被分配给正确的控件                                                                |

     **XText 组件** 
     
     | 属性           |    类型          |      描述                                                                                                                                                |
     | ---------------|:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
     | raw            |    bool         | 默认为false，若为true 则不会自动处理多屏幕尺寸适配                                                                                                             |
     | text           |     string      | 文本                                                                                                                                                     |
     | textExtend     |     bool        | 如果包含图标，则等效于将Text组件设置属性: {flex:1}                                                                                                            |
     | icon           |     string      | 相当于Image的source属性，可以接受的参数格式如：[https://xxx.yy.com/image.jpg]，[data: image / png; base64, iVBORw0KGgoAAAAN ...]，[require ('./ image.jpg')]   |
     | iconSize       |     number      | 图标尺寸                                                                                                                                                  |
     | iconStyle      |     number      | 图标Image的样式                                                                                                                                            |
     | resizeMode     |     string      | 图标Image的resizeMode                                                                                                                                     |
     | iconMargin     |     number      | 图标与文本之间的距离                                                                                                                                        |
     | iconPosition   |     string      | 图标在当前控件中的位置，可以设置的值有： 'top', 'right', 'bottom', 'left'                                                                                      |
     | ...            |    ...          | 如果设置了onPress和onLongPress函数，XImage将被XView包裹，并且外部传入的属性将会自动被分配给正确的控件                                                               |
     
     **XFlatList 组件** 
     
     | 属性                   |   类型                         |    描述                                           |
     | ----------------------|:------------------------------:| :------------------------------------------------|
     | data                  |    array                       | 相当于FlatList组件的data属性                        |
     | refreshStatus         |    object                      | XFlatList列表在不同刷新状态展示的UI样式及文本设置对象   |
     | indicatorProps        |   object                       | 设置下拉刷新控件RefreshControl的样式及属性            |
     | onRefresh             |   () => {...}                  | 相当于FlatList控件的onRefresh属性                   |
     | onLoadMore            |   () => {...}                  | 当列表滚动到底部，被执行的回调方法（需要加载更多数据时）   |
     | renderEmptyViewFunc   |   (status, isEmpty) => {...}   | 自定义各种状态下的EmptyView的实现                    |
     | renderFooterViewFunc  |   (status, isEmpty) => {...}   | 自定义各种状态下的FooterView的实现                   |
     | ...                   |   ...                          | FlatList组件的所有剩余属性                          |     

     **FlatList 组件刷新状对象示例**
     
     ```jsx 
      const RefreshStatus = {
        Idle: {}, //闲置状态
      
        RefreshingData: { text: '加载中，请稍候...'}, //下拉刷新中..
        NoData: { text: '加载完成，无数据'}, //下拉刷新（无数据）
        LoadFailure: { text: '加载失败'}, //下拉刷新（加载失败）
      
        LoadingMoreData: {moreText: '数据加载中…'}, //加载更多,进行中...
        NoMoreData: {moreText: '已加载全部数据'}, //加载更多（无数据）
        LoadMoreFailure: {moreText: '点击重新加载'}, //加载更多（加载失败）
        
        NetException: {text: '网络异常', moreText: '网络异常，点击重试'}, // 网络异常
      }
     ```
 
   详细使用方法，请参考示例项目 [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux),  [Sample_Hook](https://github.com/chende008/Sample_Hook)
  
   您也可以参考文章对react-native-easy-app使用介绍： [简书](https://www.jianshu.com/p/88821b1607a7)



### 版本日志

  * 1.7.0 XStorage的初始参数storageImp(AsyncStorage实例)设定为必需参数，并移除了版本号。
  * 1.7.4 设置XHttpConfig默认超时时间为15秒；更新readme文件，增加XStorage同步初始化代码片断。
  * 1.7.5 移除特定请求的参数urlEncoded处理，只支持全局编码或者不编码；修复非formEncoded类型下的编码处理。
  * 1.7.6 设置XHttpConfig默认contentType为application/x-www-form-urlencoded；设置XText默认的图标处于文本的顶部。
  * 1.7.7 XText增加iconStyle，resizeMode属性;XHttp普通参数增加支持传入FormData，原参数paramRaw支持不做处理直接发送请求。
  * 1.7.8 修复XImage在有点击事件的时候，不支持tintColor样式的bug。
  * 1.7.9 XFlatList增加ref属性：ref => this.flatList = ref，以便XFlatList能支持FlatList所拥有的相关方法，使用方式如：this.refreshList.flatList.scrollToOffset({...})
  * 1.7.12 当请求成功后，及时清除无意义的超时计时器，减少不必要的计时器资源的浪费。
  * 1.7.13 XFlatList增加属性renderFooter、indicatorProps以便更灵活的控制其样式及属性
  * 1.7.16 XFlatList增加属性indicatorProps、renderEmptyViewFunc、renderFooterViewFunc等属性，可以自定义indicator、各种状态下的emptyView以及FooterView的布局实现
  * 1.7.17 XFlatList增加属性renderPreEmptyViewFunc，用于列表未做任何数据加载时的EmptyView的布局自定义实现
  * 1.7.18 HttpConfig增加initNetworkExceptionFunc方法，通过用户指定的@react-native-community/netinfo实例对象，在请求时根据当前网络状态做相应的回调处理
  * 1.7.19 XFlatList合并renderPreEmptyViewFunc到renderEmptyViewFunc方法中，移除XText对allowFontScaling的默认支持
  * 1.7.20 修复屏幕适配方法validReferSize判断条件错误的bug
  * 1.7.23 移除了XStorage从持久化中读取数据到内存时的不必要的数据类型转换实现
  * 1.7.25 兼容XStorage数据存储不能有效处理undefined类型数据的bug（在IOS上会报异常）
  * 1.7.26 重命名XHttpConfig方法initHttpLogOn为initLogOn、重命名XFlatList方法renderRooterViewFunc为renderFooterViewFunc、修正readme文档描述
