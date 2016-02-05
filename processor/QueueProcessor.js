/**
 * Created by Márcio S. Manske on 07/01/16.
 */

var Connection = require("../connection/Connection");

var QueueProcessor = function() {

    var conn = new Connection();

    return {

        saveRequest: function(queueName, param, cb) {
            var sql = "insert into request_queue (content, queue_name) values ($1,$2) returning request_id";
            conn.executeQuery(sql, [param, queueName], function(error, result) {
                if (!error) {
                    var requestID = result.rows[0].request_id;
                    cb(error, parseInt(requestID));
                } else {
                    cb(error);
                }
            });
        },
        removeRequest: function(requestID, cb) {
            var sql = "delete from request_queue where request_id = $1";
            conn.executeQuery(sql, [requestID], function(error, result) {
                cb(error, result);
            });
        },
        saveResponse: function(queueName, param, cb) {

            var sql = "insert into response_queue (content, queue_name, request_id, status) values ($1,$2, $3, $4) returning response_id";
            conn.executeQuery(sql, [param.content, queueName, param.requestID, param.status], function(error, result) {
                if (!error) {
                    var responseID = result.rows[0].response_id;
                    cb(error, parseInt(responseID));
                } else {
                    cb(error);
                }
            });

        },
        incrementRequestAttempt: function(requestID, cb) {

            var sql = "update request_queue set attempt = attempt + 1 where request_id = $1";
            conn.executeQuery(sql, [requestID], function(error, result) {
                cb(error, result);
            });
        },

        getRequests: function(queueName, cb) {

            var sql = "select request_id, content, attempt from request_queue where queue_name = $1 order by request_id";
            conn.executeQuery(sql, [queueName], function(error, result) {
                cb(error, result);
            });

        },

        clearRequests: function(cb) {
            var sql = "truncate request_queue";
            conn.executeQuery(sql, [], function(error, result) {
                cb(error, result);
            });
        },

        getResponses: function(cb) {

            var sql = "select response_id, request_id, content, status from  response_queue order by request_id";
            conn.executeQuery(sql, [], function(error, result) {
                cb(error, result);
            });
        },
        removeResponse: function(responseID, cb) {

            var sql = "delete from response_queue where response_id = $1";
            conn.executeQuery(sql, [responseID], function(error, result) {
                cb(error, result);
            });
        },
        clearResponses: function(cb) {
            var sql = "truncate response_queue";
            conn.executeQuery(sql, [], function(error, result) {
                cb(error, result);
            });
        },
        saveHistoricalMessages: function(content, cb) {
            var sql = "insert into historical_queue (content) values ($1)"
            conn.executeQuery(sql, [content], function(error, result) {
                cb(error, result);
            });
        }

    }


};

module.exports = QueueProcessor;