/**
 * Created by Márcio S. Manske on 15/01/16.
 */

var soap = require('soap');
soap.createClient("http://localhost:8099/bemagw/api/ProductsService?wsdl", function(err, client) {
    if (err) {
        console.log(err);
        return;
    }

    client.saveProduct({xml:"teste de xml"}, function(err1, result) {
        //console.log(result);
            if (err1) {
                console.log(err1);
            } else {
                var obj = result;
                console.log(obj);
            }

    });
});