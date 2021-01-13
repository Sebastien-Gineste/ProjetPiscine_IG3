const Groupe = require('../models/groupe_projet');
const Composer = require('../models/composerGroupe_Etudiant');
const Etudiant = require('../models/etudiant');
const errorModel = require("../models/model");
const auth = require("../middleware/auth")

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
  console.log(req.body)
  const groupe = {
      nomTuteurEntreprise: req.body.nomTuteur,
      prenomTuteurEntreprise : req.body.prenomTuteur,
      nomEntreprise : req.body.entrepriseTuteur,
      idProf : req.body.idProf,
  };
  console.log(groupe)
  new Groupe().save(groupe)
  .then((groupe) => {
    console.log(groupe)
    console.log(auth.exportsId(req.headers.cookie))
    const composer = {
      idGroupe : groupe.idGroupe,
      numEtudiant : auth.exportsId(req.headers.cookie) 
    }
    new Composer().save(composer).then((compose)=>{
      console.log(compose)
      res.status(201).json(groupe.idGroupe)
    })
    .catch((error)=>{
      console.log(error)
      new Groupe().delete([groupe.idGroupe]) // on supprime le groupe solo
      res.status(400).send("composer non créér")
    })
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({ error });
  });
};

//A faire
exports.select = (req, res, next) => {
  console.log(req.params.id)

  new Groupe().select([req.params.id]).then((results)=>{ 
    new Composer().select([req.params.id]).then((listMembers)=>{
      var groupe = results[0]
      console.log(groupe)
      groupe.listMembers = listMembers
      res.status(200).json(groupe)
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
      }})
    
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
          g.nomTuteurEntreprise = req.body.nomTuteur
        }
        if(req.body.prenomTuteur){
          g.prenomTuteurEntreprise = req.body.prenomTuteur
        }
        if(req.body.entrepriseTuteur){
          g.nomEntreprise = req.body.entrepriseTuteur
        }
        if(req.body.idProf){
          g.idProf = req.body.idProf
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
  new Etudiant().selectEtudiant(req.body.idEtudiant).then((etu)=> {
    console.log(etu)
    if (etu.idGroupe){
      console.log("Dans un groupe");
      res.status(400).send("Déjà dans un groupe")
    }
    else{
      const composer = {
        idGroupe :req.params.id,
        numEtudiant : req.body.idEtudiant 
      }
      new Composer().save(composer).then((compose)=>{
        console.log(compose)
        res.status(201).send("ajouté !")
      })
      .catch((error)=>{
        console.log(error)
        res.status(400).send("élève non ajouté")
      })
    }
  })
};


//A faire
exports.removeEtudiant = (req, res, next) => {
  console.log(req.params.id)
  console.log(req.body)
  new Composer().delete(req.params.id,req.body.idEtudiant)
  .then((results) => {
    console.log(results)
    res.status(200).json({ message : results})
  }).catch((error) => {
      console.log(error);
      res.status(400).json({ error })
  })
};

