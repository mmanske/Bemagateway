/**
 * Created by Márcio S. Manske on 11/01/16.
 */

var cp = require('child_process');

var scriptFile = __dirname + "/../client/ResponseObserver.js";
var proc = cp.fork(scriptFile, [], {execArgv: ['--debug=9879']});


proc.send({command: "start"});

proc.on("message", function(message) {
    console.log(message);
});
