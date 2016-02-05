/**
 * Created by Márcio S. Manske on 07/01/16.
 */

var fs = require("fs");
var QueueConfig = function() {

    var queueConfigFile = __dirname + "/queue.json";

    return {
        loadQueues: function() {
            var content = fs.readFileSync(queueConfigFile, "utf8");
            var obj = JSON.parse(content);
            return obj;
        }
    }
};

module.exports = QueueConfig;