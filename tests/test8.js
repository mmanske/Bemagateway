/**
 * Created by Márcio S. Manske on 12/01/16.
 */


var Connection = require("../connection/Connection");

var counter = 20;

//var sql = "select response_id, request_id, content, status from  response_queue order by request_id";
var sql = "select * from  request_queue order by request_id";



function executar() {


    conn.executeQuery(sql, [], function(err, result) {

        console.log(counter);
        counter--;
        if (counter > 0) {
            executar();
            return;
        }
        console.log("Fim");


    });
    /*
    Connection.executeQuery(sql, [], function(err, result) {

        console.log(counter);
        counter--;
        if (counter > 0) {
            executar();
            return;
        }
        console.log("Fim");


    }); */
}

var conn = new Connection(function(error) {
    if (!error) {
        executar();
    }

});
