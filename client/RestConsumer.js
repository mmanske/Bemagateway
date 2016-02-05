/**
 * Created by Márcio S. Manske on 15/01/16.
 */

var Client = require('node-rest-client').Client;

var RestConsumer = function() {

    var client = new Client();

    var restExecute = function(configRestWS, callback) {



        var args = {};
        args.headers = {"Content-Type": " application/json; charset=utf-8"};
        if (configRestWS.postData) {
            //args.data = JSON.parse(configRestWS.postData);
            args.data = configRestWS.postData;
        }
        if (configRestWS.pathParam) {
            args.path = configRestWS.pathParam;
        }
        if (configRestWS.requestTimeout) {
            args.requestTimeout = configRestWS.requestTimeout;
        }
        if (configRestWS.responseTimeout) {
            args.responseTimeout = configRestWS.responseTimeout;
        }

        var fcn = client[configRestWS.method.toLowerCase()];

        var req = fcn(configRestWS.urlRedirect, args, function(data, response) {
            if (response.statusMessage === "OK") {
                callback(null, data.toString("utf8"));
            }
        });


        req.on('requestTimeout',function(req){
            console.log('request has expired');
            req.abort();
            callback({message: "Request timeout to " + configRestWS.urlRedirect});
        });

        req.on('responseTimeout',function(res){
            console.log('response has expired');
            callback({message: "Response timeout to " + configRestWS.urlRedirect});
        });

        req.on('error', function(err){
            console.log('request error',err);
            callback(err);
        });

    };



    return {

        execute: function(mapping,operationName, parameters,convertToJSON, callback) {
            var operation = null;
            for (var op in mapping.operations) {
                if (mapping.operations[op].operation === operationName) {
                    operation = mapping.operations[op];
                    break;
                }
            }
            if (operation) {
                var configRestWS = {};
                configRestWS.pathParam = {};
                configRestWS.postData = null;;
                configRestWS.urlRedirect = operation.urlRedirect;
                configRestWS.method = operation.method;
                configRestWS.requestTimeout = operation.requestTimeout;
                configRestWS.responseTimeout = operation.responseTimeout;
                for (var parameter in operation.parameters) {
                    var paramName = operation.parameters[parameter];
                    if (parameter === "POST_BODY") {
                        configRestWS.postData =  parameters[paramName];
                    } else {
                        if (parameters[paramName]) {
                            configRestWS.pathParam[parameter] = parameters[paramName];
                        }
                    }

                }
                if (configRestWS.postData && convertToJSON) {
                    convertToJSON(configRestWS.postData, function(errorJSON, jsonData) {
                       if (errorJSON) {
                           callback(errorJSON, null);
                       } else {
                           configRestWS.postData = jsonData;
                           restExecute(configRestWS, function(error, data) {
                               callback(error, data);
                           })
                       }
                    });
                } else {
                    restExecute(configRestWS, function(error, data) {
                        callback(error, data);
                    })
                }

            } else {
                callback("Operation "+operationName+" not found !" );
            }

        }

    }

};


module.exports = RestConsumer;