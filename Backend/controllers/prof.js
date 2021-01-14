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
  if (req.body.nomProf != "" && req.body.prenomProf!="" && typeof(req.body.prenomProf)=="string" && typeof (req.body.nomProf) == "string") {
    const prof = {
      nomProf: req.body.nomProf,
      prenomProf: req.body.prenomProf,
    };
    console.log(prof)
    new Prof().save(prof)
      .then((response) => res.status(201).json(response))
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

  const prof = { }
  console.log(req.params.id)

  if(req.body.nomProf){
    prof.nomProf = req.body.nomProf
  }
  if(req.body.prenomProf){
    prof.prenomProf = req.body.prenomProf
  }

  if(Object.keys(prof).length == 0){ // aucune modification 
    console.log(prof)
    res.status(400).json({ message : "Pas de valeur à modifier" })
  }
  else{
    console.log(prof)
    new Prof().update(req.params.id,prof)
    .then(() => res.status(200).json({ message: 'Professeur modifié !' }))
    .catch(error =>{console.log(error); res.status(400).json({ error })});
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
