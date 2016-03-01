'use strict';

var RestClientTest = require("../RestClientTest");


var routesTest = ["accountReceivableDocument",
    "accountReceivableDocumentDischarge",
    "bankTransaction",
    "creditRiskAnalysis",
    "customerVendor",
    "documentOnCoupon",
    "hotelInvoice",
    "hotelInvoiceCancellation",
    "item",
    "otherDocumentsF100",
    "reduction",
    "retailSales",
    "retailSalesCancellation",
    "salesCharge",
    "seller"];

/*
var routesTest = [
    "seller"];
*/

describe('SoapServer route Seller', function() {

    var restClient = new RestClientTest();

    routesTest.forEach(function(element, index, array){
        it("should be send "+ element, function (done) {
                restClient.execute("http://172.18.160.91:3000/bemagw/v1/" + element, __dirname + "/../json/" + element + ".json", function(err, data) {
                    if (err) {
                        done(err)
                    } else {
                            done();
                    }
                });
        });
    });
});