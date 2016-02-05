/**
 * Created by Márcio S. Manske on 05/01/16.
 */


var QueueProcessor = require("../processor/QueueProcessor");

var RequestProcessor = function(queueNames) {


    var internalQueueNames = queueNames;
    var queueProcessor = new QueueProcessor();

    return {

        enqueueRequest: function(requestDescriptor, cb) {
            //queueName, requestContent, requestID, mapping

            if (internalQueueNames.indexOf(requestDescriptor.queueName) < 0) {
                throw "Queue '" + requestDescriptor.queueName + "' not mapped!";
            }

            if (!requestDescriptor.requestContent && requestDescriptor.requestContent === null) {
                throw "Request content is empty!";
            }


            var param = JSON.stringify(requestDescriptor);

            queueProcessor.saveRequest(requestDescriptor.queueName, param, function(error, result) {
                cb(error, result);
            });

        }


    }

};

module.exports = RequestProcessor;