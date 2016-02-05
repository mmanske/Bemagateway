/**
 * Created by Márcio S. Manske on 27/01/16.
 */



var TransformJSON2XML = function(baseDir) {

    var commonConfigFileName = "common_config.json";

    var js2xmlparser = require("js2xmlparser2");
    var fs = require('fs');
    var commonConfigText = fs.readFileSync(baseDir + "/" + commonConfigFileName, "utf8");


    var getJSONAttributeValue = function(jsonObj, jsonPath) {
        var obj = jsonObj;
        for (var index in jsonPath) {
            var prop = jsonPath[index];
            if (obj[prop]) {
                obj = obj[prop];
            } else {
                return null;
            }
        }
        return obj;
    };

    var getArrayPath = function(jsonObj, arrayPath) {

        if (arrayPath && arrayPath.length > 0) {
            return getJSONAttributeValue(jsonObj, arrayPath);
        }
        return jsonObj;
    };


    var canAddChildNode = function(mapping, childNodeName) {

        if  (childNode.name === "BusinessEvent" && !mapping.hasBusinessEvent) {
            return false;
        }
        if (childNode.name === "BusinessRequest" && !mapping.hasBusinessRequest) {
            return false;
        }
        return true;
    };

    var transformElement = function(configItem) {

        var item = configItem.transformedObj;

        if (configItem.elementObj.attributes && configItem.elementObj.attributes.length > 0) {
            item[configItem.objectMapping.valueForType.attribute] = {};
            for (var index in configItem.elementObj.attributes) {
                var attribute = configItem.elementObj.attributes[index];
                item[configItem.objectMapping.valueForType.attribute][attribute.xml] = getJSONAttributeValue(configItem.jsonObj, attribute.json);
            }
        }
        if (configItem.elementObj.nodeValue) {
            item[configItem.objectMapping.valueForType.tag] = getJSONAttributeValue(configItem.jsonObj, configItem.elementObj.nodeValue.json);
        }
        if (configItem.elementObj.childNodes && configItem.elementObj.childNodes.length > 0) {
            for (var indexChildNode in configItem.elementObj.childNodes) {
                var childNode = configItem.elementObj.childNodes[indexChildNode];
                if (canAddChildNode(configItem.objectMapping, childNode.name))  {
                    item[childNode.name] = [];
                    var localizedJsonValue = getArrayPath(configItem.jsonObj, childNode.arrayPath);
                    if (childNode.arrayItems) {
                        for (var indexJsonValue in localizedJsonValue) {
                            var childJsonValue = localizedJsonValue[indexJsonValue];
                            var childItem = {};
                            item[childNode.name].push(childItem);
                            transformElement({objectMapping: configItem.objectMapping,
                                elementObj: childNode, transformedObj: childItem, jsonObj: childJsonValue,
                                itemName: childNode.name});
                        }
                    } else {
                        var childItem = {};
                        item[childNode.name].push(childItem);
                        transformElement({objectMapping: configItem.objectMapping,
                            elementObj: childNode, transformedObj: childItem, jsonObj: localizedJsonValue,
                            itemName: childNode.name});

                    }

                }


            }

        }
    };

    var transformToXML = function(objectMapping, obj) {
        var transformedObj = {};
        transformElement({objectMapping: objectMapping, elementObj: objectMapping.rootElement,transformedObj: transformedObj,
            jsonObj: obj, itemName: objectMapping.rootElement.name, isArray: false});
        return js2xmlparser(objectMapping.rootElementName, transformedObj);
    };


    return {

        fromJSON2XML: function(configFile, obj) {

            var commonConfigObj = JSON.parse(commonConfigText);

            var configText = fs.readFileSync(baseDir + "/" + configFile, "utf8");
            var configObj = JSON.parse(configText);

            for (var index = 0 in commonConfigObj.rootElement.childNodes) {
                var childNode = commonConfigObj.rootElement.childNodes[index];
                if (childNode.name === "BusinessMessage") {
                    if (configObj.hasOwnProperty("hasBusinessEvent")) {
                        commonConfigObj.hasBusinessEvent = configObj.hasBusinessEvent;
                        delete configObj.hasBusinessEvent;
                    }
                    if (configObj.hasOwnProperty("hasBusinessRequest")) {
                        commonConfigObj.hasBusinessRequest = configObj.hasBusinessRequest;
                        delete configObj.hasBusinessRequest;
                    }
                    childNode.childNodes.push(configObj);
                    break;
                }
            }


            var jsonObj = obj;

            if (Object.prototype.toString.call(obj) === "[object String]") {
                jsonObj = JSON.parse(obj);
            }


            return transformToXML(commonConfigObj, jsonObj);

        }

    }


};

module.exports = TransformJSON2XML;