const Evenement = require('../models/evenement');
const Creneaux = require('../models/creneau');
const errorModel = require("../models/model");

function getIdE(req){
    return req.baseUrl.split("/")[3];
}

//A faire
exports.selectAll = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait mais bon')
};

//A faire
exports.selectAllSalle = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire
exports.save = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire
exports.select = (req, res, next) => {
    console.log(req.params.id)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire
exports.update = (req, res, next) => {
    console.log(req.params.id)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire
exports.delete = (req, res, next) => {
    console.log(req.params.id)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};



