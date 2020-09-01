## react-native-easy-app （React Native One-stop solution）


[查看中文文档](README.md)


### Installation

```bash 
npm install react-native-easy-app --save
``` 
or 

```bash
yarn add react-native-easy-app
```

### Features

  * Support for fast synchronous access to AsyncStorage
  * Support for flexible Http requests through optional configuration
  * Support for Flexible base widget (no sensory multi-screen adaptation)

### Versions

  * 1.7.0 XStorage initialization adds required parameter storageImp (AsyncStorage instance) 
  * 1.7.4 Set the default timeout of XHttpConfig to 15 seconds; update the readme file and add XStorage synchronization initialization code snippets.
  * 1.7.5 Remove the parameter urlEncoded processing of specific request, only support global encoding or no encoding; fix the encoding processing under non-formEncoded type.
  * 1.7.6 Set the default contentType of XHttpConfig to application/x-www-form-urlencoded; set the default icon of XText to be at the top of the text.
  * 1.7.7 XText adds iconStyle and resizeMode attributes; XHttp common parameters add support for incoming FormData, the original parameter paramRaw supports sending the request directly without processing.
  * 1.7.8 Fix the bug that XImage does not support tintColor style when there is a click event.
  * 1.7.9 XFlatList adds ref attribute: ref => this.flatList = ref, so that XFlatList can support the related methods owned by FlatList, the usage is as follows: this.refreshList.flatList.scrollToOffset({...}).
  * 1.7.11 When the request is successful, the meaningless timeout timer is cleared in time to reduce unnecessary waste of timer resources.

### Usage 

  For detailed usage, please refer to the example project [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux),  [Sample_Hook](https://github.com/chende008/Sample_Hook)
  
  You can also refer to the introduction of react-native-easy-app article : [简书](https://www.jianshu.com/p/88821b1607a7)

   * **Implement a persistent data store manager ( based AsyncStorage )**
   
      ```jsx 
         export const RNStorage = {// RNStorage : custom data store object
             token: undefined, // string type
             isShow: undefined, // bool type
             userInfo: undefined, // object type
         };
      ```
      
      ```jsx 
        import { XStorage } from 'react-native-easy-app';
        import { AsyncStorage } from 'react-native';
         
        XStorage.initStorage(RNStorage, AsyncStorage, () => {
            ... // RNStorage 【Property access code snippet】
        });
        
        // OR ---------------------------------------------------------------
        
        const result = await XStorage.initStorageSync(RNStorage, AsyncStorage);
        if (result) {
            ... // RNStorage 【Property access code snippet】
        }
                
      ```
      
      ```jsx 
       // RNStorage 【Property access code snippet】
       
       // From now on, you can write or read the variables in RNStorage synchronously
       
       console.log(RNStorage.isShow);
       // equal to [console.log(await AsyncStorage.getItem('isShow'))] 
        
       RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3==';
       // equal to [ await AsyncStorage.setItem('token',TOKEN1343DN23IDD3PJ2DBF3==') ]  
       
       RNStorage.userInfo = {name: 'rufeng', age: 30};
       // equal to [ await AsyncStorage.setItem('userInfo',JSON.stringify({ name:'rufeng', age:30})) ]  
      ```
      
       **XStorage Object**
            
       | Method                |                   param                                         |      ReturnType               | Description                                                             |
       | ----------------------|:----------------------------------------------------------------|:-----------------------------:| :-----------------------------------------------------------------------|
       | initStorage           | (storageObj, storageImp, initCallback, dataCallback?)           |  void                         | Establish the mapping relationship between storageObj and AsyncStorage  |
       | initStorageSync       | (storageObj, storageImp, dataCallback?)                         |  Promise<boolean>             | Establish the mapping relationship between storageObj and AsyncStorage  |                                                             |
       | multiGet              |           **keys** *:string[]*                                  |  Promise<[string, string][]>  | equal to AsyncStorage.multiGet()                                        |
       | saveItems             |           **keyValuePairs** *:string[][]*                       |  Promise<void>                | equal to AsyncStorage.multiSet()                                        |
       | removeItems           |           **keys** *:string[]*                                  |  Promise<void>                | equal to AsyncStorage.multiRemove()                                     |
       | clear                 |           none                                                  |  void                         | equal to AsyncStorage.clear()                                           |
       
       **XStorage.initStorage parameters** 
                  
       | Parameter Name                            |  required   |                   mode                        | Description                                   |
       | ------------------------------------------|:-----------:|:---------------------------------------------:| :---------------------------------------------|
       | **storageObj** *:object*                  |    true     | { token:undefined, userName:undefined, ...}   | list of data that needs to be persisted       |
       | **storageImp** *:AsyncStorage*            |    true     |           AsyncStorage                        | data Persistence Implementation Carrier       |
       | **initializedFunc** *:callback function*  |    true     |             ()=>{ ... }                       | callback after persistent mapping success     |   
       | **dataChangedFunc** *?:callback function* |    false    |         (dataSet)=>{ ... }                    | persistent data change callback               |
    
       <u>*Note: If the React Native version of the project is higher than 0.60, the parameters of storageImp, it is recommended to use the [AsyncStorage] instance in '@react-native-community/async-storage'*</u>
    
   * **Configurable Http request framework**
   
     * All based on configuration (configuration optional, free to set)
     
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
      
      **XHttpConfig Object （All method are optional）** 
      
      | Method                |                   param                               |      ReturnType        | Description                                                                                           |
      | ----------------------|:------------------------------------------------------|:----------------------:| :-----------------------------------------------------------------------------------------------------|
      | constructor           |           **serverTag** *?:string*                    |  XHttpConfig Builder   | Corresponding to the server serverTag of XHttp                                                        |
      | initBaseUrl           |           **baseUrl** *:string*                       |  XHttpConfig Builder   | set baseUrl                                                                                           |
      | initTimeout           |           **timeout** *:number*                       |  XHttpConfig Builder   | set common timeout                                                                                    |
      | initHttpLogOn         |           **logOn** *:bool*                           |  XHttpConfig Builder   | set print request log or not                                                                          |
      | initContentType       |           **contentType** *:string*                   |  XHttpConfig Builder   | set common contentType                                                                                |
      | initLoadingFunc       |           **(isLoading) => {...}**                    |  XHttpConfig Builder   | callback http request loading status                                                                  |
      | initHeaderSetFunc     |           **(headers, request) => {...}**             |  XHttpConfig Builder   | Intercept header settings                                                                             |
      | initParamSetFunc      |           **(params, request) => {...}**              |  HttpRequest Builder   | Intercept params settings                                                                             |
      | initParseDataFunc     |           **(result, request, callback) => {...}**    |  XHttpConfig Builder   | Intercept interface returns data parsing                                                              |
      | initEncodeURIComponent|           **encodeComponent** *:boolean*              |  HttpRequest Builder   | Set common parameters(body) URL encoding，while contentType is [application/x-www-form-urlencoded]    |
     
   * **Send request template**
     
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
     
        * Settable parameters are spliced in builder form
        XHttp().url(url)
            .header(header)
            .param(param)
            .internal(true)
            .rawData()
            .pureText()
            .timeout(10000)
            .extra({tag: 'xx'})
            .contentType('text/xml')
            .loadingFunc((loading)=> showLoading('Please wait for a moment ...', loading))
            .rawData()
            .pureText()
            .configCommonFunc(true,true)
            .[formJson|formData|formEncoded]()
            .[get|post|put|patch|delete|options]((success, json, message, status, respoonse)=>{
              ...
            });
       
     ```
     
     **HttpRequest Object** 
     
     | Method                |                   params                                         | ReturnType            | Description                                                                           |
     | ----------------------|:-----------------------------------------------------------------|:---------------------:|:--------------------------------------------------------------------------------------|
     | constructor           |           **serverTag** *:string*                                |  HttpRequest Builder  | Corresponding to the server serverTag of XHttpConfig                                  |
     | url                   |           **url** *:string*                                      |  HttpRequest Builder  | set full url or url suffixes                                                          |
     | header                |  **{ Accept, Authorization ... }**  *:object*                    |  HttpRequest Builder  | Set the headers parameters                                                            |
     | param                 |  **{ userName,...  }** or **FormData** *:object*                 |  HttpRequest Builder  | Set the body parameters                                                               |
     | paramRaw              |  **{ userName,...  }** or **FormData** *:object*                 |  HttpRequest Builder  | Set the body parameters (paramRaw will be passed directly to the body of fetch)       |
     | contentType           |           **contentType** *:string*                              |  HttpRequest Builder  | set current request contentType (common contentType Settings will be replaced)        |
     | internal              |           **internal** *:bool*                                   |  HttpRequest Builder  | set request tag (default true), And then you can get it anywhere there's a request    |
     | extra                 |           **{customTag ...}**                                    |  HttpRequest Builder  | set request custom tag And then you can get it anywhere there's a request             |
     | timeout               |           **timeout** *:number*                                  |  HttpRequest Builder  | set current request timeout (common timeout Settings will be replaced)                |
     | loadingFunc           |           **(isLoading)=>{ ... }**                               |  HttpRequest Builder  | request status callback (Reflects the status is loading or not)                       |
     | configCommonFunc      |( **enableHeaderFunc** *:bool*, **enableParamFunc** *:bool* )     |  HttpRequest Builder  | set common config **[initHeaderSetFunc] [initParamSetFunc]** are valid or not         |
     | rawData               |           none                                                   |  HttpRequest Builder  | Sets the callback result to return raw json (**[initParseDataFunc]** will be ignored) |
     | pureText              |           none                                                   |  HttpRequest Builder  | Set the callback result to return plain text                                          |
     | formJson              |           none                                                   |  HttpRequest Builder  | equal to set ( headers['Content-Type'] = 'application/json' )                         |
     | formData              |           none                                                   |  HttpRequest Builder  | equal to set ( headers['Content-Type'] = 'multipart/form-data' )                      |
     | formEncoded           |           none                                                   |  HttpRequest Builder  | equal to set ( headers['Content-Type'] = 'application/x-www-form-urlencoded' )        |
     | get                   |**(success, json, message, status ,response) => void**            |    void               | [get] request callback                                                                |
     | post                  |**(success, json, message, status ,response) => void**            |    void               | [post] request callback                                                               |
     | options               |**(success, json, message, status ,response) => void**            |    void               | [options] request callback                                                            |
     | put                   |**(success, json, message, status ,response) => void**            |    void               | [put] request callback                                                                |
     | delete                |**(success, json, message, status ,response) => void**            |    void               | [delete] request callback                                                             |
     | patch                 |**(success, json, message, status ,response) => void**            |    void               | [patch] request callback                                                              |
     | request               |**(method, (success, json, message, status ,response) => void )** |    void               | request callback for specified method                                                 |
     | execute               |          **method** *:string*                                    |   Promise             | request for the specified method returned in the form of a promise                    |
     | fetch                 |          **method** *:string*                                    |   Promise             | returns a fetch result without any processing                                         |
          
     *new HttpRequest() ==> XHttp()* 
          
     **It is recommended that it be more convenient to send requests using XHttp()**
     
   * **request-send**
     
      * synchronous request
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
         
      * asynchronous request mode 1    
      ```jsx
         XHttp().url(url).get((success, json, message, status, response)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
      ```
                 
      * asynchronous request mode 2
      ```jsx
         XHttp().url(url).execute('GET').then(({success, json, message, status, response}) => {
             if (success) {
                  this.setState({content: JSON.stringify(json)});
             } else {
                  showToast(message);
             }
          })
      ```
     
   * **Flexible base widget**
     
     ```
        XView
        XImage
        XText
        
        XFlatList
        
        XWidget
        .initResource(AssetsBaseUrl)    // The uri prefix of the icon attribute of the XImage component
        .initReferenceScreen(375, 677); // The component scales the reference screen size
     ```

     **XView, XImage, and XText all contain the raw attribute. If the raw value is true, the setting of XWidget.initReferenceScreen (*referenceWidth*, *referenceHeight*) is ignored: multi-screen size adaptation is not automatically processed**

     **XView Object** 
     
     | Property    |    type     |      Description                                                                                                                           |
     | ------------|:-----------:|:-------------------------------------------------------------------------------------------------------------------------------------------|
     | raw         |    bool     | default:false, if true, the multi-screen adaptation function will be disabled.                                                             |
     | ...         |    ...      | If the onPress or onLongPress property is included, it has the same property as TouchableXXX, otherwise it has the same property as View   |
     
     **XImage Object** 
     
     | Property              |     type         |       Description                                                                                                                                                             |
     | ----------------------|:----------------:| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
     | raw                   |     bool         | default:false, If true, the multi-screen adaptation function will be disabled.                                                                                                |
     | icon                  |     string       | equivalent to Image's srouce attribute,Can accept such as [https://xxx.yy.com/../image.jpg], [data: image / png; base64, iVBORw0KGgoAAAAN ...] or [require ('./ image.jpg')]  |
     | iconSize              |     number       | the size of the image has priority over the width and height of the style                                                                                                     |
     | ...                   |    ...           | if the onPress and onLongPress functions are set, XImage will be wrapped by XView, and the externally passed properties will be automatically assigned to the correct control |

     **XText Object** 
     
     | Property              |     type         |       Description                                                                                                                                                           |
     | ----------------------|:----------------:| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
     | raw                   |     bool         | default:false, If true, the multi-screen adaptation function will be disabled.                                                                                              |
     | text                  |     string       | text                                                                                                                                                                        |
     | textExtend            |     bool         | if the icon is included, it is equivalent to setting the property of the Text component: {flex: 1}                                                                          |
     | icon                  |     string       | equivalent to Image's srouce attribute,Can accept such as [https://xxx.yy.com/../image.jpg], [data: image / png; base64, iVBORw0KGgoAAAAN ...] or [require ('./ image.jpg')]|
     | resizeMode            |     string       | icon resizeMode                                                                                                                                                             |
     | iconSize              |     number       | icon size                                                                                                                                                                   |
     | iconStyle             |     object       | icon style                                                                                                                                                                  |
     | iconMargin            |     number       | distance between icon and text                                                                                                                                              |
     | iconPosition          |     string       | the position of the icon in the View, only the following values can be set: 'top', 'right', 'bottom', 'left'                                                                |
     | ...                   |    ...           | if the onPress and onLongPress functions are set, XText will be wrapped by XView, and the externally passed properties will be automatically assigned to the correct control|
     
     **XFlatList Object** 
     
     | Property              |   type            |       Description                                                                                       |
     | ----------------------|:-----------------:| :-------------------------------------------------------------------------------------------------------|
     | data                  |    array          | equivalent to data of FlatList control                                                                  |
     | noDataText            |    string         | when there is no data, the text displayed by the control                                                |
     | noDataImage           |     uri           | when there is no data, the picture displayed below the text displayed by the control                    |
     | indicatorOffset       |    number         | the distance from the loading indicator to the top                                                      |
     | refreshStatus         |    object         | XFlatList list displays UI styles and text setting objects in different refresh states                  |
     | onRefresh             |   () => {...}     | equivalent to onRefresh of FlatList control                                                             |
     | onLoadMore            |   () => {...}     | When the list scrolls to the bottom, the callback method is executed (when more data needs to be loaded)|
     | emptyViewHeight       |   number          | when there is no data, refresh the size of the control                                                  |
     | ...                   |   ...             | all remaining properties of [FlatList] component                                                        |     

     **FlatList component refreshStatus attribute example**
     
     ```jsx 
      const RefreshStatus = {
        Idle: {}, //idle status
      
        RefreshingData: { image: ImageRes.loading, text: 'Loading...' }, // Pull-down refresh..
        NoData: { image: ImageRes.noData, text: 'No data' }, // To drop down to refresh (no data).
        LoadFailure: { image: ImageRes.loadFail, text: 'Failed to load' }, // Drop-down refresh (load failed)
      
        LoadingMoreData: { moreText: 'Loading more data…' }, // Load more, in progress...
        NoMoreData: { moreText: 'No more data') }, // Load more (no data)
        LoadMoreFailure: { moreText: 'Click to reload' } // Load more (load failed)
        
        NetException: {text: 'network exception', moreText: 'Network exception, click reload'}, // network exception
      }
     ```
 
  For detailed usage, please refer to the example project [Sample](https://github.com/chende008/react-native-easy-app-sample),  [Sample_MobX](https://github.com/chende008/Sample_MobX),  [Sample_Redux](https://github.com/chende008/Sample_Redux)
  
  You can also refer to the introduction of react-native-easy-app article : [简书](https://www.jianshu.com/nb/44288056)

