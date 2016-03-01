'use strict';

var xml2js = require('xml2js');
var xml2jsOptions = require('./common').Common;

var Convert = function(){};

Convert.prototype.objToJson = function(data){
    return JSON.stringify(data);
};

Convert.prototype.objToXml = function(data, options){
    var xmlOptions = options || {explicitRoot: false, cdata: true};

    var builder = new xml2js.Builder(xmlOptions);
    var xml = builder.buildObject(data);
    return xml.replace(/(?:\n *|\r|\r\n|\n)/g, '');
};

Convert.prototype.xmlToObj = function(data, options, cb){
    var xmlOptions = options || xml2jsOptions;

    var parser = new xml2js.Parser(xmlOptions);

    parser.parseString(data, function (err, result) {
       cb(err, result);
    });
};


module.exports = Convert;
