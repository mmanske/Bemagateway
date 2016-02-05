/**
 * Created by Márcio S. Manske on 14/01/16.
 */

var fs = require("fs");

var AppConfig = function() {

    var appConfigFile = __dirname + "/AppConfig.json";

    function getConfig() {
        var content = fs.readFileSync(appConfigFile, "utf8");
        var obj = JSON.parse(content);
        return obj;
    }


    return {
        getAppConfig: function() {
            var obj = getConfig();
            return obj;
        }

    }

};



module.exports = AppConfig;
