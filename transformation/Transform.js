/**
 * Created by Márcio S. Manske on 29/01/16.
 */

var Transform = function(baseDirConfigXML2JSON, baseDirConfigJSON2XML) {

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


};

module.exports = Transform;