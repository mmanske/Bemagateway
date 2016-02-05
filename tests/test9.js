/**
 * Created by Márcio S. Manske on 14/01/16.
 */
/**
 * Created by Márcio S. Manske on 18/12/15.
 */


var fs = require('fs'),
    soap = require('soap');
http = require('http'),
    lastReqAddress = null;

var webService = {};
webService.server = null;

/*
webService.service = {
    ProductsServiceService: {
        ProductsService: {
            getProducts: function(args, cb, soapHeader, req) {
                var retorno = [];
                for (var i = 1; i <= 10; i++) {
                    retorno.push({id: i, nome: "produto " + i});
                }

                cb(null, JSON.stringify(retorno));
            },
            getProduct: function(args, cb) {
                var id = args.productID + 5;
                var retorno = {nome: "produto " + (id + 3)};
                cb(null, retorno);
            },
            saveProduct: function(args, cb) {

                var retorno = args;
                cb(null, retorno);
            }


        }
    }
};
*/


var serviceName = "ProductsServiceService";
var portName = "ProductsService";

webService.service = {};
var internalService = {};
webService.service[serviceName] = internalService;

var port = {};
internalService[portName] = port;

var ops = ["getProducts", "getProduct", "saveProduct"];


ops.forEach(function(op) {
    port[op] = function(args, cb, soapHeader, req) {
        var retorno = {nome: "produto 2"};
        return  retorno;
    }
});


var wsdlFile = __dirname + "/../server/wsdl/ProductsService.wsdl";

var xml = fs.readFileSync(wsdlFile, 'utf8');

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: "+request.url)
});

server.listen(8099);

server.log = function(type, data) {
    console.log(data);
};

soap.listen(server, '/wsTesteGateway/services/ProductsService', webService.service, xml);

console.log("Ouvindo porta 8099");
