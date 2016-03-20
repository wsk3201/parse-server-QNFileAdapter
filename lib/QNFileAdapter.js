'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QNFileAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by mercury on 16/3/20.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _qiniu = require('qiniu');

var qiniu = _interopRequireWildcard(_qiniu);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QNFileAdapter = exports.QNFileAdapter = function () {

  /**
   *
   * @param accessKey
   * @param secretKey
   * @param bucket
   * @param bucketDomain
   * @param directAccess default false
   */

  function QNFileAdapter(accessKey, secretKey) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var bucket = _ref.bucket;
    var bucketDomain = _ref.bucketDomain;
    var _ref$directAccess = _ref.directAccess;
    var directAccess = _ref$directAccess === undefined ? false : _ref$directAccess;

    _classCallCheck(this, QNFileAdapter);

    this._bucket = bucket;
    this._bucketDomain = bucketDomain;
    this._directAccess = directAccess;

    qiniu.conf.ACCESS_KEY = accessKey;
    qiniu.conf.SECRET_KEY = secretKey;

    this._client = new qiniu.rs.Client();
  }

  /**
   * @param  {object} config
   * @param  {string} filename
   * @param  {string} data
   * @return {Promise} Promise
   */


  _createClass(QNFileAdapter, [{
    key: 'createFile',
    value: function createFile(config, filename, data, contentType) {
      var upToken = new qiniu.rs.PutPolicy(this._bucket + ":" + filename).token();

      return new Promise(function (resolve, reject) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.put(upToken, filename, data, extra, function (err, ret) {
          if (!err) {
            resolve(ret);
          } else {
            reject(err);
          }
        });
      });
    }

    /**
     * @param  {object} config
     * @param  {string} filename
     * @return {Promise} Promise
     */

  }, {
    key: 'deleteFile',
    value: function deleteFile(config, filename) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._client.remove(_this._bucket, filename, function (err, ret) {
          if (!err) {
            resolve(ret);
          } else {
            reject(err);
          }
        });
      });
    }

    /**
     * @param  {object} config
     * @param  {string} filename
     * @return {Promise} Promise
     */

  }, {
    key: 'getFileData',
    value: function getFileData(config, filename) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var baseUrl = qiniu.rs.makeBaseUrl(_this2._bucketDomain, filename);
        var policy = qiniu.rs.GetPolicy();
        var downloadUrl = policy.makeRequest(baseUrl);

        _http2.default.get(downloadUrl, function (res) {
          var buff = new Buffer();

          if (res.statusCode == 200) {

            res.on('data', function (data) {
              return buff.write(data);
            });
            res.on('end', function () {
              return resolve(buff);
            });
          } else {

            reject('status ' + res.statusCode);
          }
        }).on('error', function (err) {
          return reject(err);
        });
      });
    }

    /**
     * @param  {object} config
     * @param  {string} filename
     * @return {string} file's url
     */

  }, {
    key: 'getFileLocation',
    value: function getFileLocation(config, filename) {
      if (this._directAccess) {
        return this._bucketDomain + '/' + filename;
      }
      return config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename);
    }
  }]);

  return QNFileAdapter;
}();