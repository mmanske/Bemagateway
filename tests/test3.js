/**
 * Created by Márcio S. Manske on 18/12/15.
 */


var fs = require('fs'),
    soap = require('soap');
    http = require('http'),
    lastReqAddress = null;

var test = {};
test.server = null;
test.service = {
    StockQuoteService: {
        StockQuotePort: {
            GetLastTradePrice: function(args, cb, soapHeader) {
                if (soapHeader)
                    return { price: soapHeader.SomeToken };
                if (args.tickerSymbol === 'trigger error') {
                    throw new Error('triggered server error');
                } else if (args.tickerSymbol === 'Async') {
                    return cb({ price: 19.56 });
                } else if (args.tickerSymbol === 'SOAP Fault v1.2') {
                    throw {
                        Fault: {
                            Code: {
                                Value: "soap:Sender",
                                Subcode: { value: "rpc:BadArguments" }
                            },
                            Reason: { Text: "Processing Error" }
                        }
                    };
                } else if (args.tickerSymbol === 'SOAP Fault v1.1') {
                    throw {
                        Fault: {
                            faultcode: "soap:Client.BadArguments",
                            faultstring: "Error while processing arguments"
                        }
                    };
                } else {
                    return { price: 19.56 };
                }
            },

            SetTradePrice: function(args, cb, soapHeader) {
            },

            IsValidPrice: function(args, cb, soapHeader, req) {
                lastReqAddress = req.connection.remoteAddress;

                var validationError = {
                    Fault: {
                        Code: {
                            Value: "soap:Sender",
                            Subcode: { value: "rpc:BadArguments" }
                        },
                        Reason: { Text: "Processing Error" },
                        statusCode: 500
                    }
                };

                var isValidPrice = function() {
                    var price = args.price;
                    if(isNaN(price) || (price === ' ')) {
                        return cb(validationError);
                    }

                    price = parseInt(price, 10);
                    var validPrice = (price > 0 && price < Math.pow(10, 5));
                    return cb(null, { valid: validPrice });
                };

                setTimeout(isValidPrice, 10);
            }
        }
    }
};




    var wsdlFile = __dirname + "/../server/wsdl/stockquote.wsdl";

    var xml = fs.readFileSync(wsdlFile, 'utf8');

    var server = http.createServer(function(request,response) {
        response.end("404: Not Found: "+request.url)
    });

    server.listen(8001);

    server.log = function(type, data) {
        console.log(data);
    };

    soap.listen(server, '/bemagw/api/stockquote', test.service, xml);

    console.log("Ouvindo porta 8000");
