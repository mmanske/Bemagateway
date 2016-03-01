/**
 * Created by Márcio S. Manske on 27/01/16.
 */


var Transform = require("../transformation/Transform");
var fs = require('fs');

var baseDir = __dirname + "/../transformation/config/jade";

var transform = new Transform(null, baseDir);

var jsonText = fs.readFileSync("./seller.json", "utf8");

var jsonObj = JSON.parse(jsonText);

var xml = transform.fromJSON2XML("seller.jade", jsonObj);

console.log(xml);