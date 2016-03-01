/**
 * Created by Márcio S. Manske on 29/01/16.
 */

var ProcessLayout = require('./lib/processLayout');
var Convert = require('./lib/convert');
var common = require('./lib/common');
var convert = new Convert();

var Transform = function(baseDirConfigXML2JSON, baseDirConfigJSON2XML) {
    var _baseDirConfigJSON2XML = baseDirConfigJSON2XML;

    /*
    var TransformXML2JSON = require("../transformation/TransformXML2JSON");
    var TransformJSON2XML = require("../transformation/TransformJSON2XML");

    var transform2JSON = new TransformXML2JSON(baseDirConfigXML2JSON);
    var transform2XML = new TransformJSON2XML(baseDirConfigJSON2XML);

    return {

        fromXML2JSON: function(configFileName, xml) {
            return transform2JSON.fromXML2JSON(configFileName, xml);
        },
        fromJSON2XML: function(configFileName, json) {
            return transform2XML.fromJSON2XML(configFileName, json);
        }

    }
    */

    return {

        fromXML2JSON: function(configFileName, xml, cb) {

                convert.xmlToObj(xml,common.ExpressCommon, function(err, data){
                    cb(err, data);
                });

        },
        fromJSON2XML: function(configFileName, json) {

            var processLayout = new ProcessLayout();
            var jadeObj = processLayout.createGenericObject(json);
            return processLayout.createXml(_baseDirConfigJSON2XML + "/" + configFileName, jadeObj);
        }

    }

};

module.exports = Transform;