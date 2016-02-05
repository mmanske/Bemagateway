/**
 * Created by Márcio S. Manske on 12/01/16.
 */


var DBConfig = require("../config/DBConfig");
var PG = require("pg");

var Connection = function() {
    var connString = new DBConfig().getConnectionString();
    //var client = null;
    /*
    PG.connect(connString, function(err, cli) {

        if (err) {
            console.log(err);
            cb(err);
            return;
        }
        client = cli;
        cb(null);

    });
    */

    return {
        executeQuery: function(sql, params, cb) {

            PG.connect(connString, function(err, client, done) {

                if (err) {
                    console.log(err);
                    cb(err);
                    return;
                }
                client.query(sql, params, function(error, result) {
                    done();
                    cb(error, result);
                });
            });





        }
    }

};

/*
Connection.executeQuery = function(sql, params, cb) {

    var connString = new DBConfig().getConnectionString();

    PG.connect(connString, function(err, client) {

        if (err) {
            cb(err);
            return;
        }

        client.query(sql, params, function(error, result) {
            cb(error, result);
        });


    });

};
*/
module.exports = Connection;