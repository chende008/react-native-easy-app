## react-native-fast-app （Efficient pure js library）


查看中文文档 [请点击 README-CHN.md](README.zh-CN.md)

 [Instruction Manual](https://www.jianshu.com/p/2cc661b1f3ab)


### Installation

npm install react-native-fast-app --save 

or yarn add react-native-fast-app


### Features

  * Support for fast synchronous access to AsyncStorage
  * Support for flexible Http requests through optional configuration
  * Support for Flexible base widget (no sensory multi-screen adaptation)


### Usage 

   * Data Storage : RFStorage
   
     * Implement a persistent data store manager
     
     ```jsx 
        export const RNStorage = {// RNStorage : Custom data store object
            token: undefined, // Custom string value
            isShow: undefined, // Custom bool value
            userInfo: undefined, // Custom object
        };
     ```
     
     ```jsx 
        import {RFStorage} from 'react-native-fast-app';
        
        RFStorage.initStorage(RNStorage, () => { // Initialize the completion callback
           // From now on, you can access the variables in RNStorage synchronously
           RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3==';
           RNStorage.isShow = true;
           RNStorage.userInfo = { name:'rufeng', age:30};
        },
        (data)=>{// Persist data change callbacks
            console.log(JSON.stringify(data));
        });
     ```
    
   * Configurable Http request framework
   
     * All based on configuration (configuration optional, free to set)
     
      ```jsx 
      import {RFHttpConfig} from 'react-native-fast-app';
      
      RFHttpConfig.initHttpLogOn(true) // Print the Http request log or not
                  .initBaseUrl(ApiCredit.baseUrl) // BaseUrl
                  .initContentType(RFApiConst.CONTENT_TYPE_URLENCODED)
                  .initHeaderSetFunc((headers, request) => {
                     // Set the public header parameter here
                  })
                  .initParamSetFunc((params, request) => {
                     // Set the public params parameter here
                  })
                  .initParseDataFunc((result, request, callback) => {
                     // Specifies the specific data parsing method for the current app
              });
      ```
     
     * Send request template
     
     ```jsx 
        import {RFHttp} from 'react-native-fast-app';
     
        let url = 'v1/account/login/';
        let param = {phone: '18600000000', authCode: '123456'};
        let header = {Authorization: "Basic Y3Rlcm1pbmF......HcVp0WGtI"};
        let callback = () => (success, json, message, status) => { // Request a result callback
             if (success) {
                showToast(JSON.stringify(json))
             } else {
                showToast(msg)
             }
        };
     
        * Settable parameters are spliced in builder form
        RFHttp().url(url)
            .param(param)
            .header(header)
            .internal()
            .rawData()
            .pureText()
            .encodeURI()
            .timeout(10000)
            .extra({tag: 'xx'})
            .contentType('text/xml')
            .resendRequest(data, callback) // Rerequest (used to refresh accessToken to resend a request that has failed)
            .loadingFunc((loading)=> showLoading('Please wait for a moment ...', loading))
            .[formJson|formData|formEncoded]()
            .[get|post|put|patch|delete|options](callback);
       
     ```
     
     * request-send
     
      ```jsx
         import {RFHttp} from 'react-native-fast-app';
         
         const url = 'https://www.google.com';
        
         * Synchronous request
         const response = await RFHttp().url(url).execute('GET');
         const {success, json, message, status} = response;
         
         if(success){
            this.setState({content: JSON.stringify(json)})
         } else {
            showToast(message)
         }
         
         * Asynchronous requests
         RFHttp().url(url).get((success, json, message, status)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
                 
         * Asynchronous requests
         RFHttp().url(url).execute('GET')
         .then(({success, json, message, status}) => {
             if (success) {
                  this.setState({content: JSON.stringify(json)});
             } else {
                  showToast(message);
             }
          })
          .catch(({message}) => {
              showToast(message);
          })
        ```
     
     * Flexible base widget
     ```
        RFImage
        RFText
        RFView
        RFlatList
        
        RFImage Partial path online images depend on the Settings of image resource BaseUrl
        
        Can be configured as follows before use：
        
        RFWidget
        .initResource(Assets)
        .initReferenceScreen(375, 677); // The component scales the reference screen size
     ```
    
 
  Please refer to the detailed usage method [example](https://github.com/chende008/react-native-fast-app-sample)
