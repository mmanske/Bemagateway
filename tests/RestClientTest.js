/**
 * Created by Márcio S. Manske on 20/01/16.
 */

var fs = require("fs");
var Client = require('node-rest-client').Client;
var client = new Client();
var _ = require('lodash');

var restExecute = function(configRestWS, callback) {

    var args = {};
    if (configRestWS.postData) {
        //args.data = JSON.stringify(configRestWS.postData);
        args.data = configRestWS.postData;

        args.headers = {"Content-Type": " application/json; charset=utf-8"};
    }
    if (configRestWS.pathParam) {
        args.path = configRestWS.pathParam;
    }

    args.responseConfig = {timeout: 10000};
    args.requestConfig = {timeout: 10000};


    var fcn = client[configRestWS.method.toLowerCase()];

    var req = fcn(configRestWS.urlRedirect, args, function(data, response) {
        callback(null, data);


    });

    req.on('requestTimeout',function(req){
        console.log('request has expired');
        //req.abort();
        callback({message: "request has expired"});
    });

    req.on('responseTimeout',function(res){
        console.log('response has expired');
        callback({message: "response has expired"});
    });

    req.on('error', function(err){
        console.log('request error',err);
        callback(err);
    });

};

var RestClientTest = function() {

    return {
        execute: function(url, jsonFileName, cb) {
            var configRestWS = {};


            var sellerJson = fs.readFileSync(jsonFileName);
            var sellerObj = JSON.parse(sellerJson);


            configRestWS.postData = sellerObj;
            configRestWS.method = "POST";
            configRestWS.urlRedirect = url;

            restExecute(configRestWS, cb);
        }
    }

};


module.exports = RestClientTest;