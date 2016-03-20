# QiNiu Files Adapter for Parse Server

## Useage

```
npm install parse-server-qiniufileadapter
```

```
var ParseServer   = require('parse-server').ParseServer;
var QNFileAdapter = require('parse-server-qiniufileadapter');

var accessKey = 'YOUR_QINIU_ACCESS_KEY';
var secretKey = 'YOUR_QINIU_SECRET_KET';
var options = {
	bucket: 'YOUR_QINIU_BUCKET',
    bucketDomain: 'YOUR_QINIU_BUCKET_DOMAIN',
    directAccess: false // if true direct access to qiniu, need set bucket to open space
}

var api = new ParseServer({
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337'
  (...)
  filesAdapter: new AzureStorageAdapter(accessKey, secretKey, options);
});
```

## License

BSD
