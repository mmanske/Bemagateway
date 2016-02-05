'use strict';

var _data_xml_example = '<?xml version="1.0" encoding="utf-8"?>' +
    '<TOTVSMessage>' +
    '    <MessageInformation version="1.002">' +
    '    <UUID>BD3144611AB14D74A19D81D74E615683</UUID>' +
    '    <Type>BusinessMessage</Type>' +
    '    <Transaction>SELLER</Transaction>' +
    '    <StandardVersion>1.000</StandardVersion>' +
    '    <SourceApplication>NewHotel</SourceApplication>' +
    '    <CompanyId>99</CompanyId>' +
    '    <BranchId>01</BranchId>' +
    '    <GeneratedOn>2015-08-31T20:26:42</GeneratedOn>' +
    '<DeliveryType>Sync</DeliveryType>' +
    '<Product name="NEWHOTEL" version="1.0"/>' +
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
    '    <CompanyId>99</CompanyId>' +
    '    <BranchId>01</BranchId>' +
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
    '<VendorInternalId>E5FDC08D219A4FDFBAEAA5050453704F</VendorInternalId>' +
    '<SalesChargeInterface>S</SalesChargeInterface>' +
    '</SalesChargeInformation>' +
    '</BusinessContent>' +
    '</BusinessMessage>' +
    '</TOTVSMessage>';

var _data_json_example = '{' +
'  "TOTVSMessage": {' +
'     "MessageInformation": {' +
'       "version": "1.002",' +
'       "UUID": "BD3144611AB14D74A19D81D74E615683",' +
'       "Type": "BusinessMessage",' +
'       "Transaction": "SELLER",' +
'       "StandardVersion": "1.000",' +
'       "SourceApplication": "NewHotel",' +
'       "CompanyId": "99",' +
'       "BranchId": "01",' +
'       "GeneratedOn": "2015-08-31T20:26:42",' +
'       "DeliveryType": "Sync",' +
'       "Product": {' +
'         "name": "NEWHOTEL",' +
'         "version": "1.0"' +
'       }' +
'     },' +
'     "BusinessMessage": {' +
'       "BusinessEvent": {' +
'         "Entity": "Seller",' +
'         "Event": "upsert",' +
'         "Identification": {' +
'           "Key": {' +
'             "content": "E5FDC08D219A4FDFBAEAA5050453704F",' +
'             "name": "InternalId"' +
'           }' +
'         }' +
'       },' +
'       "BusinessContent": {' +
'         "CompanyId": "99",' +
'         "BranchId": "01",' +
'         "CompanyInternalId": "",' +
'         "InternalId": "E5FDC08D219A4FDFBAEAA5050453704F",' +
'         "Code": "E5FDC08D219A4FDFBAEAA5050453704F",' +
'         "Name": "Benfica Fc LDA",' +
'         "ShortName": "Benfica Fc",' +
'         "Login": "",' +
'         "SellerPassword": "",' +
'         "SellerPhoneDDD": "",' +
'         "SellerAddress": "Benfica Fc",' +
'         "SellerCity": "SÃO PAULO",' +
'         "SellerNeighborhood": "Bela Vista",' +
'         "SalesChargeInformation": {' +
'           "VendorInternalId": "E5FDC08D219A4FDFBAEAA5050453704F",' +
'           "SalesChargeInterface": "S"' +
'         }' +
'       }' +
'     }' +
'   }';

var jadeSellerExample = {
  messageInformationVersion: '1.002',
  uuid: 'BD3144611AB14D74A19D81D74E615683',
  type: 'BusinessMessage',
  transaction: 'SELLER',
  standardVersion: '1.000',
  sourceApplication: 'NEWHOTEL',
  companyId: '99',
  branchId: '01',
  generatedOn: '2015-08-31T20:26:42',
  deliveryType: 'Sync',
  productName: 'NEWHOTEL',
  productVersion: '1.0',
  entity: 'Seller',
  event: 'upsert',
  keyName: 'InternalId',
  key: 'E5FDC08D219A4FDFBAEAA5050453704F',

  businessContentCompanyId: 99,
  businessContentBranchId: '01',
  businessContentInternalId: 914,
  businessContentCode: '',
  businessContentName: 'BTI BRASIL',
  businessContentShortName: '',
  businessContentSellerAddress: 'ALAMEDA SANTOS',
  businessContentSellerCity: 'SAO PAULO',
  businessContentSellerNeighborhood: 'CERQUEIRA CESAR',
  businessContentVendorInternalId: '1BAA170931504B7FB901A50203FB6ED3',
  businessContentSalesChargeInterface: 'S'
};

function resolveUrl(path) {
  return '/process/v1/' + path;
}


var _data_xml_example_bad = '<?xml version="1.0" encoding="utf-8"?><Event>upsert</Event>';

var Common = {
    xmlMessage: _data_xml_example,
    xmlBadMessage: _data_xml_example_bad,
    jsonMessage: _data_json_example,
    jadeSellerObj: jadeSellerExample,
    pathRoute: resolveUrl
};

module.exports = Common;
