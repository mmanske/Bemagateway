'use strict';

var jade = require('jade');
var fs = require('fs');
var handlebars = require('handlebars');
var _ = require('lodash');

var ProcessLayout = function () {
};

ProcessLayout.prototype._processObjToJade = function(information, acc) {
    acc = acc || '';

    var jadeInformatio = {};

    var keys = Object.keys(information);
    for(var i=0; i<keys.length ; i++){
        var aux={};

        var valueChilden = information[keys[i]];
        var accKey = acc + keys[i];
        if (typeof valueChilden === 'object' && valueChilden !== null  && !Array.isArray(valueChilden)) {
            aux = this._processObjToJade(valueChilden, accKey);
        }
        else{
            aux[accKey] = valueChilden;
        }
        _.merge(jadeInformatio, aux);
    }

    return jadeInformatio;
};

ProcessLayout.prototype.createXml = function (path, information) {
    var xml = jade.renderFile(path, information);
    return xml;
};

ProcessLayout.prototype.createGenericObject = function (information) {
    return this._processObjToJade(information);
};

ProcessLayout.prototype.createJson = function (path, information) {

    var templateFile = fs.readFileSync(path, {encoding: 'utf8'});
    var template = handlebars.compile(templateFile);
    return template(information);
};

module.exports = ProcessLayout;
