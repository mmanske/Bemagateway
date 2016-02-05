/**
 * Created by Márcio S. Manske on 10/12/15.
 */

var MappingConfig = require("../server/boot/mapping-config");

var mappingConfig = new MappingConfig();


var configList = mappingConfig.loadConfig();


console.log(configList);