/**
 * Created by Márcio S. Manske on 20/01/16.
 */


var Client = require('node-rest-client').Client;

var restExecute = function(configRestWS, callback) {

    var client = new Client();

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
        if (response.statusMessage === "OK") {
            callback(null, data);
        }


    });

    req.on('requestTimeout',function(req){
        console.log('request has expired');
        req.abort();
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



var configRestWS = {};

configRestWS.postData = {productID: 20, productDescription: "Produto 20"};
configRestWS.method = "POST";
configRestWS.urlRedirect = "http://localhost:8080/restTesteGW/rest/product";

restExecute(configRestWS, function(err, data) {

    if (err) {
        console.log(err);
    } else {

        console.log(data.toString("utf8"));

    }

});
