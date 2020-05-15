## react-native-easy-app （React Native One-stop solution）


[查看中文文档](README.zh-CN.md)

[Instruction Manual](https://www.jianshu.com/nb/44288056)


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


### Usage 

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
         
        const initCallback = () => {
        
             // From now on, you can write or read the variables in RNStorage synchronously
             
             // be similar to [console.log(await AsyncStorage.getItem('isShow'))]
             console.log(RNStorage.isShow); 
             
             // be similar to [ await AsyncStorage.setItem('token',TOKEN1343DN23IDD3PJ2DBF3==') ]
             RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3=='; 
             
             // be similar to [ await AsyncStorage.setItem('userInfo',JSON.stringify({ name:'rufeng', age:30})) ]
             RNStorage.userInfo = {name: 'rufeng', age: 30}; 
        };
        
        XStorage.initStorage(RNStorage, initCallback);   
                
      ```
      
       **XStorage Object**
            
       | Method                |                   param                                         |      ReturnType               | Description                                                             |
       | ----------------------|:----------------------------------------------------------------|:-----------------------------:| :-----------------------------------------------------------------------|
       | initStorage           | (storageObj, initCallback, dataCallback?, version?, storageImp?)|  void                         | Establish the mapping relationship between storageObj and AsyncStorage  |
       | initStorageSync       | (storageObj, dataCallback?, version?, storageImp?)              |  Promise<boolean>             | Establish the mapping relationship between storageObj and AsyncStorage  |                                                             |
       | multiGet              |           **keys** *:string[]*                                  |  Promise<[string, string][]>  | equal to AsyncStorage.multiGet()                                        |
       | saveItems             |           **keyValuePairs** *:string[][]*                       |  Promise<void>                | equal to AsyncStorage.multiSet()                                        |
       | removeItems           |           **keys** *:string[]*                                  |  Promise<void>                | equal to AsyncStorage.multiRemove()                                     |
       | clear                 |           none                                                  |  void                         | equal to AsyncStorage.clear()                                           |
       
       **XStorage.initStorage parameters** 
                  
       | Parameter Name                            |                   mode                        | Description                                                                      |
       | ------------------------------------------|:---------------------------------------------:| :--------------------------------------------------------------------------------|
       | **storageObj** *:object*                  | { token:undefined, userName:undefined, ...}   | list of data that needs to be persisted                                          |
       | **initializedFunc** *:callback function*  |              ()=>{ ... }                      | callback after persistent mapping success                                        |   
       | **dataChangedFunc** *?:callback function* |              (dataSet)=>{ ... }               | persistent data change callback                                                  |
       | **version** *?:string*                    |           '1.0'                               | data storage version control(default:1.0)                                        |
       | **storageImp** *?:AsyncStorage*           |           AsyncStorage                        | data Persistence Implementation Carrier(default:AsyncStorage from 'react-native')|
    
    
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
      
      | Method                |                   param                               |      ReturnType        | Description                                       |
      | ----------------------|:------------------------------------------------------|:----------------------:| :------------------------------------------------ |
      | constructor           |           **serverTag** *?:string*                    |  XHttpConfig Builder   | Corresponding to the server serverTag of XHttp    |
      | initBaseUrl           |           **baseUrl** *:string*                       |  XHttpConfig Builder   | set baseUrl                                       |
      | initTimeout           |           **timeout** *:number*                       |  XHttpConfig Builder   | set common timeout                                |
      | initHttpLogOn         |           **logOn** *:bool*                           |  XHttpConfig Builder   | set print request log or not                      |
      | initContentType       |           **contentType** *:string*                   |  XHttpConfig Builder   | set common contentType                            |
      | initLoadingFunc       |           **(isLoading) => {...}**                    |  XHttpConfig Builder   | callback http request loading status              |
      | initHeaderSetFunc     |           **(headers, request) => {...}**             |  XHttpConfig Builder   | Intercept header settings                         |
      | initParamSetFunc      |           **(params, request) => {...}**              |  HttpRequest Builder   | Intercept params settings                         |
      | initParseDataFunc     |           **(result, request, callback) => {...}**    |  XHttpConfig Builder   | Intercept interface returns data parsing          |
     
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
            .encodeURI()
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
     | param                 |  **{ userName, password, customerId ...  }** *:object*           |  HttpRequest Builder  | Set the body parameters                                                               |
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
         
      ```jsx
         XHttp().url(url).get((success, json, message, status, response)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
      ```
                 
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
        XImage
        XText
        XView
        XFlatList
        
        XImage Partial path online images depend on the Settings of image resource BaseUrl
        
        Can be configured as follows before use：
        
        XWidget
        .initResource(Assets)
        .initReferenceScreen(375, 677); // The component scales the reference screen size
     ```
    
 
  Please refer to the detailed usage method [example](https://github.com/chende008/react-native-easy-app-sample)

