const Prof = require('../models/prof');
const errorModel = require("../models/model");

//A faire
exports.selectAll = (req, res, next) => {
  new Prof().selectAll().then((results) => {
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
  if (req.body.nom != "" && req.body.prenom!="" && typeof(req.body.prenom)=="string" && typeof (req.body.nom) == "string") {
    const prof = {
      nomProf: req.body.nom,
      prenomProf: req.body.prenom,
    };
    console.log(prof)
    new Prof().save(prof)
      .then(() => res.status(201).json({ message: 'Professeur créé !' }))
      .catch(error => res.status(400).json({ error }));
  }
  else{
    res.status(400).send("le nom ou le prenom ne doivent pas etre vide")
  }
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};


exports.update =(req,res,next) => {

  const Prof = { }
  if(req.body.id){
    Prof.idProf = req.body.id
  }

  if(req.body.nom){
    Prof.nomProf = req.body.nom
  }
  if(req.body.prenom){
    Prof.prenomProf = req.body.prenom
  }

  if(Object.keys(Prof).length == 0){ // aucune modification 
    res.status(400).json({ message : "Pas de valeur à modifier" })
  }
  else{
    console.log(Prof)
    new Etudiant().update(id,Prof)
    .then(() => res.status(200).json({ message: 'Professeur modifié !' }))
    .catch(error => res.status(400).json({ error }));
  }
};



exports.delete = (req,res,next) => {
  new Prof().delete([req.params.id])
  .then((results) => {
    console.log(results)
    res.status(200).json({ message : results})
}).catch((error) => {
    console.log(error);
    res.status(400).json({ error })
})
};
