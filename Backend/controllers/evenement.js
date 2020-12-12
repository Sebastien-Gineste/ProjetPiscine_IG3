const Evenement = require('../models/evenement');
const Creneaux = require('../models/creneau');
const errorModel = require("../models/model");
const Promo = require('../models/promo');

//A faire
exports.selectAll = (req, res, next) => {
  res.status(500).send('Pas encore fait bla')
};

//A faire
exports.save = (req, res, next) => {
  verifDateEvent(req.body).then((result) => {
    const event = result
    if(event === false){
      res.status(404).send('Problème lors de la création de l\'évenement')
    }
    else{
      new Evenement().save(event)
      .then((results) => {
        console.log(results);
        generateCreneaux(event.dateDebut, event.dureeCreneau,results.numEvenement);
        res.status(201).json({ message: 'Evenement créé !' })
      })
      .catch(error => {
        console.log(error)
        res.status(400).json({ error })
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ error });
  });
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)

  new Evenement().select([req.params.id]).then((results)=>{ // vérifie l'existance de la promo
    res.status(200).json(results[0])
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
}

//A faire
exports.update = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};

//A faire
exports.delete = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};


/* fonction additionnel */

function generateCreneaux(dateDebut,dureeEvent,numEvent){
  // à faire 
  console.log("generate");
  return true;

}

function verifDateEvent(EvtFront){
    return new Promise((resolve, reject) => {
      var dataEvent = {}

      if(EvtFront.nomE.length > 0){
        dataEvent.nomEvenement = EvtFront.nomE
      }

      const today = new Date()
      const dateD = new Date(EvtFront.DateDeb);
      const dateL = new Date(EvtFront.DateLim);
      if(dateD >= today && dateD >= dateL){
        dataEvent.dateDebut = EvtFront.DateDeb
      }
      if(dateL >= today){
        dataEvent.dateLimiteResa = EvtFront.DateLim
      }

      if(EvtFront.DureeE >= 1){
        dataEvent.duree = EvtFront.DureeE
      }

      if(EvtFront.DureeS == "1_heure" || EvtFront.DureeS == "1_heure_30" ){
        dataEvent.dureeCreneau = EvtFront.DureeS
      }

      if(EvtFront.nbJury >= 1){
        dataEvent.nombreMembreJury = EvtFront.nbJury
      }

      new Promo().select([EvtFront.Promo]).then(()=>{ // vérifie l'existance de la promo
        dataEvent.anneePromo = EvtFront.Promo
        if(Object.keys(dataEvent).length == 7 ){ // tout c'est bien passé
          resolve(dataEvent)
        }
        reject(false);
      })
      .catch((error) => {console.log("error");reject(false);});

    });

}