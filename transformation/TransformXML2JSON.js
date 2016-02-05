/**
 * Created by Márcio S. Manske on 29/01/16.
 */

var TransformXML2JSON = function(baseDir) {
    var commonConfigFileName = "common_config.json";
    var X2JS = require("x2js");
    var fs = require('fs');


    var commonConfigText = fs.readFileSync(baseDir + "/" + commonConfigFileName, "utf8");


    var getAtributeValue = function(objConfig, xmlObj) {

        var localObj = xmlObj;
        for (var index in objConfig.xmlName) {
            var attribute = objConfig.xmlName[index];
            if (localObj[attribute]) {
                localObj = localObj[attribute];
            } else {
                return undefined;
            }
        }
        return localObj;
    };

    var fillArray = function(config, jsonObj, xmlObj) {
        var arrayAttr = getAtributeValue(config, xmlObj);
        if (arrayAttr) {
            for (var index in config.attributes) {
                var arrayItem = config.attributes[index];
                var jsonItemArray = {};
                jsonObj.push(jsonItemArray);
                for (var indexArray in arrayAttr) {
                    var xmlItem = arrayAttr[indexArray];
                    fillObject(config,jsonItemArray, xmlItem);
                }

            }
        }
    };

    var fillObject = function(objConfig, jsonObj, xmlObj) {

        if (objConfig.attributes) {
            for (var index in objConfig.attributes) {
                var config = objConfig.attributes[index];
                if (config.type === "object") {
                    jsonObj[config.name] = {};
                    fillObject(config, jsonObj[config.name], xmlObj);
                } if (config.type === "array") {
                    jsonObj[config.name] = [];
                    fillArray(config, jsonObj[config.name], xmlObj);
                } else {
                    var value = getAtributeValue(config, xmlObj);
                    if (value) {
                        jsonObj[config.name] = value;
                    }
                }
            }

        }



    };

    var transformToJSON = function(config, xmlObj) {
        var resultObj = {};
        fillObject(config, resultObj, xmlObj);
        return resultObj;
    } ;

    return {

        fromXML2JSON: function(configFile, obj) {
            var configText = fs.readFileSync(baseDir + "/" + configFile, "utf8");
            var configObj = JSON.parse(configText);

            var commonConfigObj = JSON.parse(commonConfigText);
            commonConfigObj.attributes[0].attributes.push(configObj);

            var xmlObj = obj;

            if (Object.prototype.toString.call(obj) === "[object String]") {
                var x2js = new X2JS();

                xmlObj = x2js.xml2js( obj );
            }


            return transformToJSON(commonConfigObj, xmlObj);
        }


    }

};

module.exports = TransformXML2JSON;