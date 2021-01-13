const Groupe = require('../models/groupe_projet');
const Composer = require('../models/composerGroupe_Etudiant');
const Etudiant = require('../models/etudiant');
const errorModel = require("../models/model");

//A tester
exports.selectAll = (req, res, next) => {
  new Groupe().selectAll().then((results) => {
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

//A revoir id et nombre membre groupe
exports.save = (req, res, next) => {
  var idGroupe = req.baseUrl.split("/")[3];
  console.log("id Groupe : "+idGroupe);
  console.log(req.body)
  const groupe = {
      nomTuteur: req.body.nomTuteur,
      prenomTuteur : req.body.prenomTuteur,
      entrepriseTuteur : req.body.entrepriseTuteur,
      etudiants: req.body.etudiants
  };
  console.log(groupe)
  new Groupe().save(groupe)
  .then((groupe) => res.status(201).json({ message: 'Groupe créé !', data : groupe }))
  .catch(error => res.status(400).json({ error }));
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)

  new Groupe().select([req.params.id]).then((results)=>{ 
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
};

//A tester
exports.update = (req, res, next) => {
  const g = { }

        if(req.body.nomTuteur){
          g.nomTuteur = req.body.nomTuteur
        }
        if(req.body.prenomTuteur){
          g.prenomTuteur = req.body.prenomTuteur
        }
        if(req.body.entrepriseTuteur){
          g.entrepriseTuteur = req.body.entrepriseTuteur
        }
        if(req.body.nomProjet){
          g.nomProjet = req.body.nomProjet
        }

        if(Object.keys(g).length == 0){ // pas de modif 
          res.status(400).json({ message : "Pas de valeur à modifier" })
        }
        else{
          console.log(g)
          new Groupe().update([req.params.id],g)
          .then(() => res.status(200).json({ message: 'Groupe modifié !' }))
          .catch(error => res.status(400).json({ error }));
        }
};

//A tester
exports.delete = (req, res, next) => {
  console.log(req.params.id)
  new Groupe().delete([req.params.id])
  .then((results) => {
    console.log(results)
    res.status(200).json({ message : results})
}).catch((error) => {
    console.log(error);
    res.status(400).json({ error })
})
};

//A tester
exports.selectAllEtudiant = (req, res, next) => {
  console.log(req.params.id)
  new Etudiant().selectAll().then((results) => {
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
exports.ajoutEtudiant = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};


//A faire
exports.removeEtudiant = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};

