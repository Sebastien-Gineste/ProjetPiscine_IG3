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
    new Creneaux().selectAll(idE).then((results) => {
        new Evenement().select([idE]).then((resultsEvent)=>{ 
            res.status(200).json({event : resultsEvent[0],creneaux : results})
          }).catch((error) => {
            switch(error) {
              case Error.NO_RESULTS:
                  console.log('Pas de données dans cette table.');
                  res.status(400).json({ error })
                  break;
              default : 
                  console.log('service indispo.');
                  res.status(400).json({ error })
                  break;
            }
          })
    }).catch((error) => {
        switch(error) {
          case Error.NO_RESULTS:
              console.log('Pas de données dans cette table.');
              res.status(400).send("Pas de créneau encore")
              break;
          default : 
              console.log('service indispo.');
              res.status(400).json({ error })
              break;
        }
    })
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



