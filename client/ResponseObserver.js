/**
 * Created by Márcio S. Manske on 11/01/16.
 */

var Promise = require('bluebird');
var QueueProcessor = require("../processor/QueueProcessor");


var ResponseObserver = function() {
    var running = false;
    var processing = false;
    var lastSignalTime = null;
    var lastExecutionTime = null;


    var queueProcessor = new QueueProcessor();
    queueProcessor = Promise.promisifyAll(queueProcessor);

    var i = 1;

    var getResponses = function() {
        if (!running) {
            return;
        }
        processing = true;
        lastExecutionTime = new Date().getTime();
        queueProcessor.getResponses(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            for (var index in result.rows) {
                var row = result.rows[index];

                var returnObj = {requestID: row.request_id, content: row.content, status: row.status};
                process.send(returnObj);
                queueProcessor.removeResponseAsync(row.response_id)
                    .then(function(result) {
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
            processing = false;
            if (result.rows.length === 0) {
                if (lastExecutionTime < lastSignalTime) {
                    getResponses();
                }
            }
        });

    };


    return {
        start: function() {
            running = true;
        },

        stop: function() {
            running = false;
        },

        runOnce: function() {
            lastSignalTime = new Date().getTime();
            if (running && !processing) {

                getResponses();
            }
        }
    }

};


var ro = null;
process.on('message', function(m) {
    if (ro === null && m.command === "start") {
        ro = new ResponseObserver();
        ro.start();
    } else if (ro !== null && m.command === "stop") {
        ro.stop();
    } else if (ro !== null && m.command === "newResponse") {
        ro.runOnce();
    }
});

process.on('disconnect', function(m) {
    if (ro !== null) {
        ro.stop();
    }
});