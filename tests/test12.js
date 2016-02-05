/**
 * Created by Márcio S. Manske on 27/01/16.
 */


var TransformJSON2XML = require("../transformation/TransformJSON2XML");
var fs = require('fs');

var baseDir = __dirname + "/../transformation/config/json2xml";

var transform = new TransformJSON2XML(baseDir);

var jsonText = fs.readFileSync("./seller.json", "utf8");

var jsonObj = JSON.parse(jsonText);

var xml = transform.fromJSON2XML("seller_config.json", jsonObj);

console.log(xml);