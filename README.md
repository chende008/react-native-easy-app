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

### 版本

  * 1.7.0 XStorage的初始参数storageImp(AsyncStorage实例)设定为必需参数，并移除了版本号。
  * 1.7.4 设置XHttpConfig默认超时时间为15秒；更新readme文件，增加XStorage同步初始化代码片断。
  * 1.7.5 移除特定请求的参数urlEncoded处理，只支持全局编码或者不编码；修复非formEncoded类型下的编码处理。


### 快速开始 

   详细使用方法，请参考示例项目 [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux)
  
   您也可以参考文章对react-native-easy-app使用介绍： [简书](https://www.jianshu.com/p/88821b1607a7)

   * **用AsyncStorage快速实现一个可持久化的数据存、取管理器**
   
      ```jsx 
         export const RNStorage = {// RNStorage 自定义数据存储对象
             token: undefined, //  字符串类型
             isShow: undefined, // 布尔类型
             userInfo: undefihttps://github.com/chende008/react-native-easy-app.git#masterned, // 对象类型
         };
      ```
      
      ```jsx 
        import { XStorage } from 'react-native-easy-app';
        import { AsyncStorage } from 'react-native';
        
        XStorage.initStorage(RNStorage, AsyncStorage, () => {
            ... // RNStorage 【属性访问代码片段】
        });
        
        // <<或者>> ---------------------------------------------------------------
        
        const result = await XStorage.initStorageSync(RNStorage, AsyncStorage);
        if (result) {
            ... // RNStorage 【属性访问代码片段】
        }
           
      ```
      
      ```jsx 
       // RNStorage 【属性访问代码片段】 
       
       // 当自定义对象【RNStorage】被初始化完成之后，就可以任意的【同步访问】RNStorage对象中的所有属性了
                   
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
      
      XHttpConfig().initHttpLogOn(true)
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
      
      | 方法                  |                   参数                                 |      返回类型           | 描述                                                                                     |
      | ----------------------|:------------------------------------------------------|:----------------------:| :---------------------------------------------------------------------------------------|
      | constructor           |           **serverTag** *?:string*                    |  XHttpConfig Builder   | 与XHttp(serverTag)保持一致(用于多服务器请求配置)，默认为空                                     |
      | initBaseUrl           |           **baseUrl** *:string*                       |  XHttpConfig Builder   | 设置Http请求公共的BaseUrl                                                                  |
      | initTimeout           |           **timeout** *:number*                       |  XHttpConfig Builder   | 设置公共的默认请求超时时间                                                                   |
      | initHttpLogOn         |           **logOn** *:bool*                           |  XHttpConfig Builder   | 设置是否打印Http请求日志                                                                    |
      | initContentType       |           **contentType** *:string*                   |  XHttpConfig Builder   | 设置Http请求默认的ContentType                                                              |
      | initLoadingFunc       |           **(isLoading) => {...}**                    |  XHttpConfig Builder   | Http公共请求状态回调，isLoading为true表示请求进行中                                           |
      | initHeaderSetFunc     |           **(headers, request) => {...}**             |  XHttpConfig Builder   | 请求header设置拦截器；可在此处，为请求添加公共的headers参数                                     |
      | initParamSetFunc      |           **(params, request) => {...}**              |  HttpRequest Builder   | 请求body(params)设置拦截器；可在此处，为请求添加公共的params参数                                |
      | initParseDataFunc     |           **(result, request, callback) => {...}**    |  XHttpConfig Builder   | 请求回调拦截器；可在此处，为接口返回数据做公共解析处理                                           |
      | initEncodeURIComponent|           **encodeComponent** *:boolean*              |  HttpRequest Builder   | 全局设置是否对参数进行encodeURLComponent编码，内容类型为：application/x-www-form-urlencoded 时 |
     
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
                showToast(msg)
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
            .[get|post|put|patch|delete|options]((success, json, message, status, respoonse)=>{
              ...
            });
       
     ```
     
     **HttpRequest 对象** 
     
     | 方法                  |                   参数                                            |      返回类型          | 描述                                                                                                |
     | ----------------------|:-----------------------------------------------------------------|:---------------------:|:---------------------------------------------------------------------------------------------------|
     | constructor           |           **serverTag** *:string*                                |  HttpRequest Builder  | 与XHttpConfig(serverTag)保持一致(用于多服务器请求配置)，默认为空                                          |
     | url                   |           **url** *:string*                                      |  HttpRequest Builder  | 设置请求的url；若XHttpConfig中配置了baseUrl，当前只需要配置接口url后缀即可                                 |
     | header                |  **{ Accept, Authorization ... }**  *:object*                    |  HttpRequest Builder  | 设置当前请求的header参数；若与XHttpConfig中配置的公共header参数同名，则以当前设置为准                        |
     | param                 |  **{ userName, password, customerId ...  }** *:object*           |  HttpRequest Builder  | 设置当前请求的params参数；若与XHttpConfig中配置的公共params参数同名，则以当前设置为准                        |
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
     | raw         |    bool     | 默认为false，若为true则不会自动处理多屏幕尺寸适配                                                |
     | ...         |    ...      | 若包含onPress或onLongPress属性，则等同于TouchableXXX系列组件,否则等同于View组件,并拥有其相应的属性  |
     
     **XImage Object** 
     
     | 属性        |    类型          |      描述                                                                                                                                                |
     | ------------|:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
     | raw         |    bool         | 默认为false，若为true则不会自动处理多屏幕尺寸适配                                                                                                              |
     | icon        |     string      | 相当于Image的source属性，可以接受的参数格式如：[https://xxx.yy.com/image.jpg]，[data: image / png; base64, iVBORw0KGgoAAAAN ...]，[require ('./ image.jpg')]   |
     | iconSize    |     number      | 图标的尺寸，优先级高于style的width与height                                                                                                                   |
     | ...         |    ...          | 如果设置了onPress和onLongPress函数，XImage将被XView包裹，并且外部传入的属性将会自动被分配给正确的控件                                                               |

     **XText 组件** 
     
     | 属性           |    类型          |      描述                                                                                                                                                |
     | ---------------|:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
     | raw            |    bool         | 默认为false，若为true则不会自动处理多屏幕尺寸适配                                                                                                              |
     | text           |     string      | 文本                                                                                                                                                     |
     | textExtend     |     bool        | 如果包含图标，则等效于将Text组件设置属性: {flex:1}                                                                                                            |
     | icon           |     string  | 相当于Image的source属性，可以接受的参数格式如：[https://xxx.yy.com/image.jpg]，[data: image / png; base64, iVBORw0KGgoAAAAN ...]，[require ('./ image.jpg')]       |
     | iconSize       |     number      | 图标尺寸                                                                                                                                                  |
     | iconMargin     |     number      | 图标与文本之间的距离                                                                                                                                        |
     | iconPosition   |     string      | 图标在当前控件中的位置，可以设置的值有： 'top', 'right', 'bottom', 'left'                                                                                      |
     | ...            |    ...          | 如果设置了onPress和onLongPress函数，XImage将被XView包裹，并且外部传入的属性将会自动被分配给正确的控件                                                               |
     
     **XFlatList 组件** 
     
     | 属性                   |   类型            |    描述                                           |
     | ----------------------|:-----------------:| :------------------------------------------------|
     | data                  |    array          | 相当于FlatList组件的data属性                        |
     | noDataText            |    string         | 若数据为空时展示的文本                               |
     | noDataImage           |     uri           | 若数据为空时展示在文本下的图片                        |
     | indicatorOffset       |    number         | 下拉刷新loading指示器距顶部的距离                     |
     | refreshStatus         |    object         | XFlatList列表在不同刷新状态展示的UI样式及文本设置对象   |
     | onRefresh             |   () => {...}     | 相当于FlatList控件的onRefresh属性                   |
     | onLoadMore            |   () => {...}     | 当列表滚动到底部，被执行的回调方法（需要加载更多数据时）   |
     | emptyViewHeight       |   number          | 无数据时，空View的高度                               |
     | ...                   |   ...             | FlatList组件的所有剩余属性                           |     

     **FlatList 组件刷新状对象示例**
     
     ```jsx 
      const RefreshStatus = {
        Idle: {}, //闲置状态
      
        RefreshingData: {image: ImageRes.loading, text: '加载中，请稍候...'}, //下拉刷新中..
        NoData: {image: ImageRes.noData, text: '加载完成，无数据'}, //下拉刷新（无数据）
        LoadFailure: {image: ImageRes.loadFail, text: '加载失败'}, //下拉刷新（加载失败）
      
        LoadingMoreData: {moreText: '数据加载中…'}, //加载更多,进行中...
        NoMoreData: {moreText: '已加载全部数据'}, //加载更多（无数据）
        LoadMoreFailure: {moreText: '点击重新加载'}, //加载更多（加载失败）
        
        NetException: {text: '网络异常', moreText: '网络异常，点击重试'}, // 网络异常
      }
     ```
 
   详细使用方法，请参考示例项目 [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux)
    
   您也可以参考文章对react-native-easy-app使用介绍： [简书](https://www.jianshu.com/nb/44288056)


