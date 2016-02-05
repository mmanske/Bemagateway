/**
 * Created by Márcio S. Manske on 08/01/16.
 */

var cp = require('child_process');
var QueueConfig = require("../config/QueueConfig");
//var ServiceProducer = require("./ServiceProducer");

var ServiceController = function() {

    var serviceQueues = [];

    var cbResponseSignal = null;

    return {
        assignResponseSignal: function(cb) {
            cbResponseSignal = cb;
        },
        loadQueueServices: function() {
            if (serviceQueues.length > 0) {
                throw "Service Queues is not empty !";
                return;
            }
            var queues = new QueueConfig().loadQueues();
            var debugPortNumber = 11112;
            var thatResponseSignal
            for (var index in queues) {
                var queueName = queues[index];
                var scriptFile = __dirname + "/ServiceProducer.js";
                var proc = cp.fork(scriptFile, [], {execArgv: ['--debug=' + debugPortNumber]});

                proc.on("message", function(m) {

                    if (m.message === "newResponse") {
                        if (cbResponseSignal) {
                            cbResponseSignal();
                        }
                    }

                });

                debugPortNumber++;
                var queueObj = {queueName: queueName, process: proc};
                serviceQueues.push(queueObj);
                //serviceQueues.push(proc);
                proc.send({queueName: queueName, command: "start"});
                console.log(" --- Queue " + queueName + " initialized...")
            }
        },
        stopQueueServices: function() {
            for (var index in serviceQueues) {
                var queueObj = serviceQueues[index];
                var proc = queueObj.process;
                proc.disconnect();
            }
            serviceQueues = [];
        },
        signalizeQueueForRequest: function(queueName) {
            for (var index in serviceQueues) {
                var queueObj = serviceQueues[index];
                if (queueObj.queueName === queueName) {
                    var proc = queueObj.process;
                    proc.send({command: "newRequest"});
                    break;
                }

            }
        }

    }

};


module.exports = ServiceController;