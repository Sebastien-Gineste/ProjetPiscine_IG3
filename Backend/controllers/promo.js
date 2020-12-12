const Promo = require('../models/promo');
const errorModel = require("../models/model");

//A faire
exports.selectAll = (req, res, next) => {
  new Promo().selectAll().then((results) => {
      res.status(200).json(results)
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
};

//A faire
exports.save = (req, res, next) => {
  res.status(500).send('Pas encore fait')
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};

//A faire
exports.delete = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};