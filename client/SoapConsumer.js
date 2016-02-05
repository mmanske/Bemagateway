/**
 * Created by Márcio S. Manske on 15/12/15.
 */


var SoapConsumer = function() {


    var soapExecute = function(configWS, callback) {
        var soap = require('soap');
        soap.createClient(configWS.url, function(err, client) {
            if (err) {
                callback(err);
                return;
            }
            var func = client[configWS.methodName];
            func(configWS.args, function(err1, result) {
                //console.log(result);
                if (callback) {
                    if (err1) {
                        callback(err1);
                    } else {
                        var obj = result;
                        if (configWS.returnMethod) {
                            obj = result[configWS.returnMethod];
                        }
                        callback(err1, obj);
                    }

                }

            });
        });
    };

  return {
      execute: function(mapping,parameters,body, callback) {

          //Se o body vier preenchido com valor != null, significa que o método é POST ou PUT
          //sendo assim, o último parâmetro deverá ser o body e o mapping.parameters sempre terá
          //um parâmetro a mais do que parameters

          //var url = mapping.wsdl;
          var args = {};
          if (mapping.parameters && parameters) {

              for (var parameter in mapping.parameters) {
                  var paramName = mapping.parameters[parameter];
                  if (parameters[paramName] && paramName !== "POST_BODY") {
                      args[parameter] = parameters[paramName];
                  } else {
                      if (body && body != null && paramName === "POST_BODY") {
                          args[parameter] = body;
                      }
                  }

              }
          }

          soapExecute({url:mapping.wsdlRedirect, methodName: mapping.soapMethod,
            args: args, returnMethod:mapping.returnMethod}, function(err, result) {
              callback(err, result);
          } );
      }
  }
};


module.exports = SoapConsumer;