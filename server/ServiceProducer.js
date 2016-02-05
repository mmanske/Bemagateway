/**
 * Created by Márcio S. Manske on 07/01/16.
 */


var QueueProcessor = require("../processor/QueueProcessor");
var Transform = require("../transformation/Transform");
var SoapConsumer = require("../client/SoapConsumer");
var RestConsumer = require("../client/RestConsumer");

var STATUS_OK = 1;
var STATUS_ERROR = 2;
var MAX_ATTEMPTS = 3;

var ServiceProducer = function(queueName) {

    var restConsumer = new RestConsumer();

    var queueProcessor = new QueueProcessor();
    var internalQueueName = queueName;

    var baseDir2JSON = __dirname + "/../transformation/config/xml2json";
    var baseDir2XML = __dirname + "/../transformation/config/json2xml";

    var transform = new Transform(baseDir2JSON, baseDir2XML);
    var running = false;

    var processing = false;
    var lastSignalTime = null;
    var lastExecutionTime = null;

    var i = 0;
    var executeRequest = function(requests) {




        var sendResponse = function(resp) {
            requests.shift();
            queueProcessor.saveResponse(internalQueueName, {content: resp.data, requestID: resp.requestID, status: resp.status}, function(err1, result1) {
                if (err1)  {
                    console.log(err1);
                } else {
                    //console.log("Response saved");
                    process.send({message: "newResponse"});
                }

                queueProcessor.removeRequest(resp.requestID, function(err2, result2) {
                    if (err2) {
                        console.log(err2);
                    }
                });

                executeRequest(requests);

            });
        };


        if (!running) {
            return;
        }

        if (requests.length > 0) {

            processing = true;

            var request = requests[0];

            var mapping = request.content.mapping;
            var body = request.content.requestContent.body;
            var params = request.content.requestContent.params;
            var operationName = request.content.operation;
            var status = STATUS_OK;
            var xml = null;
            if (mapping.redirectType === "SOAP") {

                if (body) {
                    xml = transform.fromJSON2XML(mapping.transformationToXML, body);
                }
                var soapConsumer = new SoapConsumer();
                soapConsumer.execute(mapping, params, xml, function (err, result) {
                    var content = null;
                    if (err) {
                        //console.log(err);
                        status = STATUS_ERROR;
                        content = err.message;
                            
                        if (request.attempt <= MAX_ATTEMPTS) {
                            console.log("Attempt: " + request.attempt);
                            queueProcessor.incrementRequestAttempt(request.request_id, function(err, data) {
                                processing = false;
                                executeRequests();

                                return;
                            });
                        } else {
                            var obj =  {data: err, requestID: request.request_id, status: status};
                            console.log("Attempts ended");
                            console.log(JSON.stringify(obj));
                            sendResponse(obj);
                        }
                    } else {
                        var data = transform.fromJSON2XML(mapping.transformationToJSON, result);
                        var obj =  {data: data, requestID: request.request_id, status: status};
                        sendResponse(obj);
                    }
                });
             } else {
                //REST

                var operation = null;
                for (var op in mapping.operations) {
                    if (mapping.operations[op].operation === operationName) {
                        operation = mapping.operations[op];
                        break;
                    }
                }

                var convertToJSON = function(xmlData, callbackJSON) {
                    var json = transform.fromXML2JSON(operation.transformationToJSON, xmlData);
                    callbackJSON(null, json);
                };

                restConsumer.execute(mapping, operationName, params,convertToJSON, function(err, result) {
                    if (err) {
                        console.log(err);
                        status = STATUS_ERROR;

                        if (request.attempt <= MAX_ATTEMPTS) {
                            console.log("Attempt: " + request.attempt);
                            queueProcessor.incrementRequestAttempt(request.request_id, function(err, data) {
                                processing = false;
                                executeRequests();
                                //requests.splice(0, requests.length);

                                //objInterval = setInterval(executeRequests, INTERVAL_EXECUTION);
                                return;
                            });
                        } else {
                            var errorMessage = {message: err.message};
                            var obj =  {data: errorMessage, requestID: request.request_id, status: status};
                            console.log("Attempts ended");
                            sendResponse(obj);
                        }
                    } else {

                        var jsonObj = JSON.parse(result);
                        var transformObj = {};
                        if (operation.arrayRootElement) {
                            transformObj[operation.arrayRootElement] = jsonObj;
                        } else {
                            transformObj = jsonObj;
                        }
                        xml = transform.fromJSON2XML(operation.transformationToXML, transformObj);

                        if (xml.indexOf("errorMessage") === 1) {
                            var errorMessage = {message: xml};
                            var obj =  {data: errorMessage, requestID: request.request_id, status: status};
                            console.log("Error converting JSON to XML: " + xml);
                            sendResponse(obj);
                            return;
                        }
                        var contentMessage = {xml: xml};
                        var obj =  {data: contentMessage, requestID: request.request_id, status: status};
                        sendResponse(obj);
                    }
                });

            }
        } else {
            processing = false;
            if (lastExecutionTime < lastSignalTime) {
                executeRequests();
            }
        }
    };


    var executeRequests = function() {
        lastExecutionTime = new Date().getTime();
        queueProcessor.getRequests(internalQueueName, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                executeRequest(result.rows);
            }
        });
    };



    return {

        start: function() {
            running = true;
            processing = false;
        },

        stop: function() {
            running = false;
        },

        runOnce: function() {
            lastSignalTime = new Date().getTime();
            if (running && !processing) {
                processing = true;
                executeRequests();
            }
        }
    }


};

var sv = null;
process.on('message', function(m) {
    if (sv === null && m.command === "start") {
        sv = new ServiceProducer(m.queueName);
        sv.start();
    } else if (sv !== null && m.command === "stop") {
        sv.stop();
    } else if (sv !== null && m.command === "newRequest") {
        sv.runOnce();
    }
});

process.on('disconnect', function(m) {
    if (sv !== null) {
        sv.stop();
    }
});