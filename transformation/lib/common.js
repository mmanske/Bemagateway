'use strict';

var Common = {
    explicitArray: false,
    normalize: false,
    normalizeTags: false,
    charkey: "content",
    mergeAttrs: true
};

var ExpressCommon = {
    explicitArray: false,
    normalize: false,
    normalizeTags: false,
    charkey: "content",
    attrkey: "attributes"
}

module.exports = {
    Common: Common,
    ExpressCommon: ExpressCommon
};