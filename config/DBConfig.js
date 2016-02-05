/**
 * Created by Márcio S. Manske on 07/01/16.
 */
var fs = require("fs");

var DBConfig = function() {

    var dbConfigFile = __dirname + "/localDBConfig.json";

    var defaultConfig = {
        host: "localhost",
        name: "bemagateway",
        user: "bematech",
        password: "bematech",
        port: "5432"
    };

    function getConfig() {
        if (fs.existsSync(dbConfigFile)) {
            var content = fs.readFileSync(dbConfigFile, "utf8");
            var obj = JSON.parse(content);
            return obj;
        } else {
            return defaultConfig;
        }
    }


    return {
        getConnectionString: function() {

            var obj = getConfig();

            obj.host = obj.host?obj.host:defaultConfig.host;
            obj.user = obj.user?obj.user:defaultConfig.user;
            obj.name = obj.name?obj.name:defaultConfig.name;
            obj.password = obj.password?obj.password:defaultConfig.password;
            obj.port = obj.port?obj.port:defaultConfig.port;

            var url = "pg://" + obj.user + ":" + obj.password + "@" + obj.host + ":" + obj.port + "/" + obj.name;
            return url;

        }

    }

};



module.exports = DBConfig;