const auth = require('../middleware/auth')
const Etudiant = require("../models/etudiant");
const errorModel = require("../models/model");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

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
      .catch(error => {
        console.log(error)
        res.status(500).json({ error })});
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
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }));
        }
};

exports.login = (req, res, next) => {
  console.log(req.body);
  new Etudiant().checkConnexion(req.body.email, req.body.password)
    .then(user => {
          console.log(user[0])
          res.cookie('jwtAuth', auth.createToken(user[0].numEtudiant), {maxAge:'6000000', httpOnly:true}).status(200).json( 
            {admin: user[0].estAdmin,
            userId: user[0].numEtudiant,
            token: auth.createToken(user[0].numEtudiant),
            group: user[0].idGroupe,
            numEvent: user[0].numEvenement}
          );
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



exports.checkAdmin = (req,res,next) => {
  var id = auth.exportsId(req.headers.cookie)
  if(id){ // il y a un id dans le token du cookie
    new Etudiant().selectEtudiant(id)
    .then(user => {
        res.status(200).json( 
          {admin: user[0].estAdmin,
          userId: user[0].numEtudiant,
          token: auth.createToken(user[0].numEtudiant),
          group: user[0].idGroupe,
          numEvent: user[0].numEvenement}
        );
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error);
    });
  }
  else{
    res.status(401).send("Pas autorisé");
  }
}

/* A faire */
exports.select = (req,res,next) => {
  console.log(req.params.id)

  new Etudiant().select([req.params.id]).then((results)=>{ 
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

exports.envoieCodeMail = (req,res,next) =>{
  console.log(req.body.email);
  res.status(500).send('Pas encore fait')
  var code =  Math.random() * (99999 - 10000) + 10000;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projetiscine@gmail.com',
      pass: 'T8us,5hkM'
    }
  });
  
  var mailOptions = {
    from: 'projetiscine@gmail.com',
    to: req.body.email,
    subject: 'Récupération Mot de Passe',
    text: 'Voici votre code pour récupérer votre mot de passe : '+ code
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

/* A faire */
exports.changeMdp = (req,res,next) => {
  bcrypt.hash(req.body.newPassword, 10)
      .then(hash => {
        const user = { }
          user.mdpEtudiant = hash
          console.log(user)

          new Etudiant().update([req.params.id],user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error })); 
}

/* A faire */
exports.delete = (req,res,next) => {
  new Etudiant().delete([req.params.id])
  .then((results) => {
    console.log(results)
    res.status(200).json({ message : results})
}).catch((error) => {
    console.log(error);
    res.status(400).json({ error })
})
}
