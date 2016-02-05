'use strict';
var _processLayout = require('../middleware/processLayout');
var common = require('./common');
var Convert = require('../middleware/convert');
var chai = require('chai'), expect = chai.expect, should = chai.should();


describe("Process Tovs API", function(){

  it("should be a xml with layout", function(done){
    var path = 'views/xml/jade/layout.jade';
    var processLayout = new _processLayout();
    var xml = processLayout.createXml(path);

    var convert = new Convert();
    convert.xmlToObj(xml, function(err, result){
      should.not.exist(err);

      expect(result).to.have.property('TOTVSMessage');
      expect(result.TOTVSMessage.BusinessMessage).to.have.property('BusinessEvent');

      done();
    });

    console.log(xml);

  });

  it("should be a xml Commissioned Seller with object", function(done){
    var path = 'views/xml/jade/commissionedSeller.jade';
    var processLayout = new _processLayout();
    var convert = new Convert();
    var xml = processLayout.createXml(path, common.jadeSellerObj);

    convert.xmlToObj(xml, function(err, result){
      should.not.exist(err);

      expect(result.TOTVSMessage.MessageInformation.UUID).to.equal("BD3144611AB14D74A19D81D74E615683");
      expect(result.TOTVSMessage.BusinessMessage.BusinessContent.SellerAddress).to.equal("ALAMEDA SANTOS");
      expect(result.TOTVSMessage.BusinessMessage.BusinessContent.SalesChargeInformation.VendorInternalId).to.equal("1BAA170931504B7FB901A50203FB6ED3");
      done();
    });

    console.log(xml);

  });

  it("should be a json with layout", function(done){
    var path = 'views/json/handlebars/example.hbs';
    var processLayout = new _processLayout();

    var information = {
      id: 12345,
      firstName: "william",
      lastName: "gueiros",
      email: "william@fddf.com",
      company: "totvs",
      age: 31,
      optedin: 7384987213679843187,
      images:   'my.jpeg',
      revision: '1',
      author: {
        id: 22121,
        name: "alex"
      },
      tolerance: 999
    }
    var jsonString = processLayout.createJson(path, information);

    var json = JSON.parse(jsonString);

    expect(json.people.id).to.equal('12345');
    expect(json.people.firstName).to.equal("william");
    expect(json.people.lastName).to.equal("gueiros");
    expect(json.people.email).to.equal("william@fddf.com");
    expect(json.author.id).to.equal("22121");
    expect(json.author.name).to.equal("alex");
    expect(json.tolerance).to.equal("999");

    console.log(json);
    done();
  });

});
