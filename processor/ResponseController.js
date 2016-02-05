/**
 * Created by Márcio S. Manske on 06/01/16.
 */




var ResponseController = function() {


    var responseList = [];

    return {
        putResponse: function (obj) {
            responseList.push(obj);
        },
        popResponseForRequestId: function(id) {

            for (var index in responseList) {
                var obj = responseList[index];
                if (obj.requestID === id) {
                    responseList.splice(index, index+1);
                    return obj;
                }
            }
            return null;
        },
        getAll: function() {
            return responseList;
        }
    }

};

module.exports = ResponseController;
