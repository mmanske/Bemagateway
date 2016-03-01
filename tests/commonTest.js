'use strict';

var fs = require('fs');
var path = require('path');

var uuid = require('node-uuid');


var _data_xml_example = '<?xml version="1.0" encoding="utf-8"?>' +
    '<TOTVSMessage>' +
    '    <MessageInformation version="2.000">' +
    '    <UUID>'+ uuid.v4() +'</UUID>' +
    '    <Type>BusinessMessage</Type>' +
    '    <Transaction>SELLER</Transaction>' +
    '    <StandardVersion>1.000</StandardVersion>' +
    '    <SourceApplication>VHF</SourceApplication>' +
    '    <CompanyId>1</CompanyId>' +
    '    <BranchId>4</BranchId>' +
    '    <GeneratedOn>2015-08-31T20:26:42</GeneratedOn>' +
    '<DeliveryType>Sync</DeliveryType>' +
    '<Product name="BEMATECH" version="1.000"/>' +
    '    </MessageInformation>' +
    '    <BusinessMessage>' +
    '    <BusinessEvent>' +
    '    <Entity>Seller</Entity>' +
    '    <Event>upsert</Event>' +
    '    <Identification>' +
    '    <Key name="InternalId">E5FDC08D219A4FDFBAEAA5050453704F</Key>' +
    '    </Identification>' +
    '    </BusinessEvent>' +
    '    <BusinessContent>' +
    '    <CompanyId>1</CompanyId>' +
    '    <BranchId>4</BranchId>' +
    '    <CompanyInternalId/>' +
    '    <InternalId>E5FDC08D219A4FDFBAEAA5050453704F</InternalId>' +
    '    <Code>E5FDC08D219A4FDFBAEAA5050453704F</Code>' +
    '    <Name>Benfica Fc LDA</Name>' +
    '<ShortName>Benfica Fc</ShortName>' +
    '<Login/>' +
    '<SellerPassword/>' +
    '<SellerPhoneDDD/>' +
    '<SellerAddress>Benfica Fc</SellerAddress>' +
    '<SellerCity>SÃO PAULO</SellerCity>' +
    '<SellerNeighborhood>Bela Vista</SellerNeighborhood>' +
    '<SalesChargeInformation>' +
    '<CustomerVendorInternalId>E5FDC08D219A4FDFBAEAA5050453704F</CustomerVendorInternalId>' +
    '<SalesChargeInterface>S</SalesChargeInterface>' +
    '</SalesChargeInformation>' +
    '</BusinessContent>' +
    '</BusinessMessage>' +
    '</TOTVSMessage>';

var jadeSeller = function(deliveryType){

      return {
        TOTVSMessageMessageInformationversion: '2.000',
        TOTVSMessageMessageInformationUUID: uuid.v4(),
        TOTVSMessageMessageInformationType: 'BusinessMessage',
        TOTVSMessageMessageInformationTransaction: 'SELLER',
        TOTVSMessageMessageInformationStandardVersion: '1.000',
        TOTVSMessageMessageInformationSourceApplication: 'VHF',
        TOTVSMessageMessageInformationCompanyId: '1',
        TOTVSMessageMessageInformationBranchId: '4',
        TOTVSMessageMessageInformationGeneratedOn: '2015-08-31T20:26:42',
        TOTVSMessageMessageInformationDeliveryType: deliveryType,
        TOTVSMessageMessageInformationProductname: 'BEMATECH',
        TOTVSMessageMessageInformationProductversion: '1.000',


        TOTVSMessageBusinessMessageBusinessEventEntity: 'Seller',
        TOTVSMessageBusinessMessageBusinessEventEvent: 'upsert',
        TOTVSMessageBusinessMessageBusinessEventIdentificationKeyname: 'InternalId',
        TOTVSMessageBusinessMessageBusinessEventIdentificationKeycontent: 'E5FDC08D219A4FDFBAEAA5050453704F',

        TOTVSMessageBusinessMessageBusinessContentCompanyId: '1',
        TOTVSMessageBusinessMessageBusinessContentBranchId: '4',
        TOTVSMessageBusinessMessageBusinessContentInternalId: 'E5FDC08D219A4FDFBAEAA5050453704F',
        TOTVSMessageBusinessMessageBusinessContentCode: 'E5FDC08D219A4FDFBAEAA5050453704F',
        TOTVSMessageBusinessMessageBusinessContentName: 'BTI BRASIL',
        TOTVSMessageBusinessMessageBusinessContentShortName: '',
        TOTVSMessageBusinessMessageBusinessContentAddress: 'ALAMEDA SANTOS',
        TOTVSMessageBusinessMessageBusinessContentSellerNeighborhood: 'CERQUEIRA CESAR',
        TOTVSMessageBusinessMessageBusinessContentSalesChargeInformationCustomerVendorInternalId: 'E5FDC08D219A4FDFBAEAA5050453704F',
        TOTVSMessageBusinessMessageBusinessContentSalesChargeInformationSalesChargeInterface: 'S'
      };
}

function resolveUrl(pathHttp, resources) {
  var pathUrl = pathHttp || '/api/protheus/v1/';
  return pathUrl + resources;
}

function readJsonFileSync(file){
  var pathDir = path.dirname(__filename);
  var pathJson = pathDir+'/json/' + file + '.json';
  var jsonFile = fs.readFileSync(pathJson, {encoding: 'utf8'});
  return jsonFile;
}

function readXmlFileSync(file){
    var pathDir = path.dirname(__filename);
    var pathJson = pathDir+'/xml/' + file + '.xml';
    var jsonFile = fs.readFileSync(pathJson, {encoding: 'utf8'});
    return jsonFile;
}

var _data_xml_example_bad = '<?xml version="1.0" encoding="utf-8"?><Event>upsert</Event>';

var Common = {
    xmlMessage: _data_xml_example,
    xmlBadMessage: _data_xml_example_bad,
    jadeSellerSyncObj: jadeSeller('Sync'),
    jadeSellerObjAsync: jadeSeller('Async'),
    readJson: readJsonFileSync,
    pathRoute: resolveUrl,
    readXml: readXmlFileSync
};

module.exports = Common;
