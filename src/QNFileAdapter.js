/**
 * Created by mercury on 16/3/20.
 */
import * as qiniu from 'qiniu';
import http from 'http';

export class QNFileAdapter {

  /**
   *
   * @param accessKey
   * @param secretKey
   * @param bucket
   * @param bucketDomain
   * @param directAccess default false
   */
  constructor(accessKey,
              secretKey,
    {bucket,
      bucketDomain,
      directAccess = false} = {}) {
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
  createFile(config, filename, data, contentType) {
    let upToken = new qiniu.rs.PutPolicy(this._bucket + ":" + filename).token();

    return new Promise((resolve, reject) => {
      let extra = new qiniu.io.PutExtra();
      qiniu.io.put(upToken, filename, data, extra, (err, ret) => {
        if (!err) {
          resolve(ret);
        } else {
          reject(err);
        }
      })
    });
  }

  /**
   * @param  {object} config
   * @param  {string} filename
   * @return {Promise} Promise
   */
  deleteFile(config, filename) {
    return new Promise((resolve, reject) => {
      this._client.remove(this._bucket, filename, (err, ret) => {
        if (!err) {
          resolve(ret);
        } else {
          reject(err);
        }
      })
    });
  }

  /**
   * @param  {object} config
   * @param  {string} filename
   * @return {Promise} Promise
   */
  getFileData(config, filename) {
    return new Promise((resolve, reject) => {
      let baseUrl = qiniu.rs.makeBaseUrl(this._bucketDomain, filename);
      let policy = qiniu.rs.GetPolicy();
      let downloadUrl = policy.makeRequest(baseUrl);

      http.get(downloadUrl, (res) => {
        let buff = new Buffer;

        if (res.statusCode == 200) {

          res.on('data', (data)=> buff.write(data));
          res.on('end', () => resolve(buff));

        } else {

          reject(`status ${res.statusCode}`);

        }

      }).on('error', (err) => reject(err));
    });
  }


  /**
   * @param  {object} config
   * @param  {string} filename
   * @return {string} file's url
   */
  getFileLocation(config, filename) {
    if (this._directAccess) {
      return `${this._bucketDomain}/${filename}`;
    }
    return (`${config.mount}/files/${config.applicationId}/${encodeURIComponent(filename)}`);
  }
}
