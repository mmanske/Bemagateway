/**
 * Created by Márcio S. Manske on 19/11/15.
 */

var fs = require("fs");

var MappingConfig = function() {

    var loadObject = function(fileName) {
        var content = fs.readFileSync(fileName, "utf8");
        var list = JSON.parse(content);
        return list;
    };

    return {
        loadConfig: function(mappingFileName) {

            var fileName = mappingFileName ? mappingFileName: "mapping.json";
            fileName = __dirname + "/" + fileName;
            var mappingList = loadObject(fileName);
            var objectList = [];
            for (var i = 0; i < mappingList.mappingFiles.length; i++) {
                var apiFileName = __dirname + "/.." + mappingList.mappingFiles[i];
                var list = loadObject(apiFileName);
                for (var index in list) {
                    var obj = list[index];
                    objectList.push(obj);
                }

            }
            return objectList;
        }
    }
};



module.exports = MappingConfig;

