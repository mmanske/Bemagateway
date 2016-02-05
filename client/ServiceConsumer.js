/**
 * Created by Márcio S. Manske on 22/12/15.
 */

var MappingConfig = require("./mapping-config");
var cp = require('child_process');
//var Transform = require("../transformation/Transform");
var QueueConfig = require("../config/QueueConfig");
var RequestProcessor = require("../processor/RequestProcessor");
var QueueProcessor = require("../processor/QueueProcessor");


var fs = require('fs'),
    soap = require('soap');
    http = require('http'),
    lastReqAddress = null;

var AppConfig = require("../config/AppConfig");

var ServiceConsumer = function(responseController) {

    var scriptFile = __dirname + "/ResponseObserver.js";
    var proc = cp.fork(scriptFile, [], {execArgv: ['--debug=11111']});

    proc.send({command: "start"});

    proc.on("message", function(message) {
        //var historicalContent = {};
        var obj = responseController.popResponseForRequestId(parseInt(message.requestID));
        if (obj) {
            console.log(message.content);
            if (message.content.xml) {
                obj.response(message.content.xml);
            } else {
                obj.response(message.content);
            }


        } else {
            console.log("RequestID " + message.requestID + " not found!");
        }

        var queueProcessor = new QueueProcessor();
        queueProcessor.saveHistoricalMessages({requestContent: obj.requestContent, responseContent: message.content, status: message.status}, function(err, result) {
           if (err) {
               console.log(err);
           }
        });
    });


    return {
        configure: function(rootURL, router, serviceController) {

            serviceController.assignResponseSignal(function() {
                proc.send({command: "newResponse"});
            });

            var server = null;

            var queues = new QueueConfig().loadQueues();
            var appConfig = new AppConfig().getAppConfig();
            var webServiceListenPort = appConfig.webServiceListenPort;
            var rp = new RequestProcessor(queues);
            var mappingConfig = new MappingConfig();

            var configList = mappingConfig.loadConfig("../server/boot/mapping.json");
            configList.forEach(function (config) {
                if (config.endpointType === "REST") {
                    config.mappings.forEach(function (mapping) {
                        var url = rootURL + mapping.endpoint;
                        router[mapping.method.toLowerCase()](url, function (req, resp) {
                            var requestDescriptor = {};
                            requestDescriptor.queueName = mapping.queue;
                            requestDescriptor.requestContent = {};
                            requestDescriptor.requestContent.params = req.params;
                            requestDescriptor.requestContent.body = req.body;
                            requestDescriptor.mapping = mapping;
                            rp.enqueueRequest(requestDescriptor, function(error, result) {

                                if (error) {
                                    console.log(error);
                                    resp.send(error);
                                    return;
                                }
                                var response = function(content) {
                                    resp.send(content);
                                    resp.end();
                                };
                                //responseController.putResponse({requestID: result, response: resp, config: config, mapping: mapping,
                                responseController.putResponse({requestID: result, response: response, config: config, mapping: mapping,
                                        requestDescriptor: requestDescriptor});

                                serviceController.signalizeQueueForRequest(mapping.queue);
                            });


                        });
                    });
                } else { //endpointType = SOAP

                    if (!server) {
                        server = http.createServer(function(request,response) {
                            response.end("404: Not Found: "+request.url)
                        });


                        var listenPort = parseInt(webServiceListenPort);
                        server.listen(listenPort);

                        server.log = function(type, data) {
                            console.log(data);
                        };
                    }

                    config.mappings.forEach(function (mapping) {
                                                    
                        var webService = {};
                        webService.server = null;
                        webService.service = {};
                        var internalService = {};
                        webService.service[mapping.serviceName] = internalService;
                        var port = {};
                        internalService[mapping.portName] = port;
                        mapping.operations.forEach(function(op) {
                            port[op.operation] = function(args, cb, soapHeader, req) {
                                var requestDescriptor = {};
                                requestDescriptor.queueName = op.queue;
                                requestDescriptor.requestContent = {};
                                requestDescriptor.requestContent.params = args;
                                /*
                                if (op.soapServiceXmlParams) {
                                    //Convertendo os parametros que foram automaticamente transformados de XML para Object para XML de volta
                                    for (var index in op.soapServiceXmlParams) {
                                        var paramName = op.soapServiceXmlParams[index].paramName;
                                        var xmlParam = requestDescriptor.requestContent.params[paramName];
                                        var xmlText = JSON2XML.convert(xmlParam);
                                        requestDescriptor.requestContent.params[paramName] = xmlText;
                                    }
                                }
                                */
                                requestDescriptor.requestContent.body = null;
                                requestDescriptor.mapping = mapping;
                                requestDescriptor.remoteAddr = req.connection.remoteAddress;
                                requestDescriptor.operation = op.operation;


                                rp.enqueueRequest(requestDescriptor, function(error, result) {

                                    if (error) {
                                        console.log(error);
                                        cb(error);
                                        return;
                                    }
                                    var response = function(content) {
                                        cb(content);
                                    };
                                    responseController.putResponse({requestID: result, response: response, config: config, mapping: mapping,
                                        operation: op.operation, requestDescriptor: requestDescriptor});

                                    serviceController.signalizeQueueForRequest(op.queue);

                                });

                            }

                        });
                        var wsdlFile = __dirname + "/../server/wsdl/"+mapping.wsdl;
                        var xml = fs.readFileSync(wsdlFile, 'utf8');
                        var soapOptions = {path: mapping.endPoint, xml: xml, services: webService.service,
                            preserveParamFormat: true};
                        soap.listen(server, soapOptions);
                    });
                }
            });
        }
    }

};



module.exports = ServiceConsumer;