var ROOT_URL = "/bemagw";
//var Promise = require('bluebird');
var express = require('express');
var router = express.Router();

var ResponseController = require("../processor/ResponseController");

var QueueProcessor = require("../processor/QueueProcessor");


var ServiceController = require("../server/ServiceController");
var serviceController = new ServiceController();


var responseController = new ResponseController();

var ServiceConsumer = require("../client/ServiceConsumer");

var serviceConsumer = new ServiceConsumer(responseController);
serviceConsumer.configure(ROOT_URL, router, serviceController);



/* GET home page. */
router.get(ROOT_URL, function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get(ROOT_URL + "/listQueue", function(resp, res) {

  res.send(responseController.getAll());

});



//Limpando a tabela de requests pendentes ao inicializar

var queueProcessor = new QueueProcessor();

queueProcessor.clearRequests(function(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    queueProcessor.clearResponses(function(err1, result1) {
        if (err1) {
            console.log(err1);
            return;
        }
        console.log("Response Queue Cleared!");
        console.log("Initializing Queue Services...");
        serviceController.loadQueueServices();
        console.log("Queue Services Initialized.");
    });
});


module.exports = router;
