const auth = require('../middleware/auth')
const Etudiant = require("../models/etudiant");
const errorModel = require("../models/model");
const bcrypt = require("bcrypt");

exports.selectAll = (req, res, next) => {
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
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = {
          nomEtudiant : req.body.nom,
          prenomEtudiant : req.body.prenom,
          emailEtudiant: req.body.email,
          mdpEtudiant: hash,
          annePromo : req.body.promo
        };
        console.log(user)
        if(req.body.numEtudiant){ //Si l'étudiant à mit son num étudiant 
          user.numEtudiant = req.body.numEtudiant
        }
        new Etudiant().save(user)
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.update =(req,res,next) => {

        const user = { }

        if(req.body.nom){
          user.nomEtudiant = req.body.nom
        }
        if(req.body.prenom){
          user.prenomEtudiant = req.body.prenom
        }
        if(req.body.promo){
          user.annePromo = req.body.promo
        }
        if(req.body.email){
          user.emailEtudiant = req.body.email
        }

        if(Object.keys(user).length == 0){ // pas de modif 
          res.status(400).json({ message : "Pas de valeur à modifier" })
        }
        else{
          console.log(user)
          new Etudiant().update([req.params.id],user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifier !' }))
          .catch(error => res.status(400).json({ error }));
        }
};

exports.login = (req, res, next) => {
  console.log(req.body);
  new Etudiant().checkConnexion(req.body.email, req.body.password)
    .then(user => {
          res.status(200).json({
            admin: user[0].estAdmin,
            userId: user[0].numEtudiant,
            token: auth.createToken(user[0].numEtudiant)
          });
        })
    .catch(error =>{
      switch(error) {
        case errorModel.Error.BAD_PASSWORD:
          res.status(403).send("mauvais mots de passe")
          break;
        case errorModel.Error.NO_RESULTS:
          res.status(403).send("Email non trouvée")
          break;
        default:
          res.status(500).send('Problème de connection')
          break;
      }      
    });
}

/* A faire */
exports.select = (req,res,next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
}

/* A faire */
exports.changeMdp = (req,res,next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
}

/* A faire */
exports.delete = (req,res,next) => {
  console.log(req.params.id)
  res.status(500).send('PPas encore fait')
}
