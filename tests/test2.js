var soap = require('soap');
var url = 'http://localhost:8080/wsTesteGateway/services/ProductsService?wsdl';
var args = {};
soap.createClient(url, function(err, client) {
    client.getProducts(args, function(err, result) {
        console.log(result);
    });
});

