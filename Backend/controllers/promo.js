const Promo = require('../models/promo');
const errorModel = require("../models/model");


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

exports.selectAllVerifEvent = (req, res, next) => {
  new Promo().selectAllVerifEvent().then((results) => {
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


exports.save = (req, res, next) => {
  console.log(req.body.promo)
  new Promo().select([req.body.promo]).then((results) => {
    res.status(400).send("Promo déjà présente")
  }).catch((error) => {
    console.log(error)
    switch(error) {
      case Error.NO_RESULTS:
          console.log('Pas de données dans cette table. On peut créer la promo');
          new Promo().save({annePromo : req.body.promo}).then((results) => {
            res.status(201).json(results)
          }).catch((error) => {
            console.log(error)
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
          break;
      default : 
          console.log('service indispo.');
          res.status(400).json({ error })
          break;
    }
  })



  
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};

//A faire
exports.delete = (req, res, next) => {
  console.log(req.params.id)
  new Promo().delete([req.params.id]).then((results) => {
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