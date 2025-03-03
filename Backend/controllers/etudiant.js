const auth = require('../middleware/auth')
const Etudiant = require("../models/etudiant");
const errorModel = require("../models/model");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
 //Sélectionne tous les étudiants enregistrés sur le site
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

//Selectionne tous les étudiants d'une même promo
exports.selectAllEtudiant = (req, res, next) => {
  new Etudiant().selectAllEtudiant(req.params.id).then((results) => {
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

//Créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    console.log("ok")
    bcrypt.hash(req.body.mdpEtudiant, 10)
      .then(hash => {
        var user = req.body
        user.mdpEtudiant= hash
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

//Met à jour le profil de l'étudiant avec les nouvelles infos envoyées par l'utilisateur
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
        if(req.body.mail){
          user.emailEtudiant = req.body.mail
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

//Vérifie les informations de connexion et connecte l'étudiant
exports.login = (req, res, next) => {
  console.log(req.body);
  new Etudiant().checkConnexion(req.body.email, req.body.password)
    .then(user => {
          console.log(user[0])
          res.cookie('jwtAuth', auth.createToken(user[0].numEtudiant), {maxAge:'6000000', httpOnly:true}).status(200).json( 
            {admin: user[0].estAdmin,
            userId: user[0].numEtudiant,
            token: auth.createToken(user[0].numEtudiant),
            group: (user[0].idGroupe ? user[0].idGroupe : -1),
            numEvent: user[0].numEvenement}
          );
        })
    .catch(error =>{
      switch(error) {
        case errorModel.Error.BAD_PASSWORD:
          res.status(403).send("Mauvais mot de passe")
          break;
        case errorModel.Error.NO_RESULTS:
          res.status(403).send("Email non trouvé")
          break;
        default:
          res.status(500).send('Problème de connexion')
          break;
      }      
    });
}


//verifie si la personne qui se connecte est administrateur
exports.checkAdmin = (req,res,next) => {
  var id = auth.exportsId(req.headers.cookie)
  if(id){ // il y a un id dans le token du cookie
    new Etudiant().selectEtudiant(id)
    .then(user => {
        res.status(200).json( 
          {admin: user[0].estAdmin,
          userId: user[0].numEtudiant,
          token: auth.createToken(user[0].numEtudiant),
          group: (user[0].idGroupe ? user[0].idGroupe : -1),
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

/* Sélectionne étudiant */
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
//Envoie un code par mail à valider pour changer son mot de passe
exports.envoieCodeMail = (req,res,next) =>{
  new Etudiant().selectByEmail([req.body.email]).then((results)=>{
    var code =  Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
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
      res.status(200).json([code,results[0].numEtudiant]);
    }
  });
  })
  .catch(error =>{console.log(error); res.status(400).json({ error })}); 
}
//selectionne tous les étudiants sans groupe
exports.selectAllEtudiantSansGroupe = (req,res,next) => {
  new Etudiant().selectAllSansGroupe(req.params.id).then((results) => {
    res.status(200).json(results)
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
}

/* Modifie le mot de passe pour un étudiant  */
exports.changeMdp = (req,res,next) => {
  bcrypt.hash(req.body.newPassword, 10)
      .then(hash => {
        const user = { }
          user.mdpEtudiant = hash
        console.log(req.params.id)
        new Etudiant().update([req.params.id],user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error =>{console.log(error); res.status(500).json({ error })}); 
}

/* Supprime un étudiant après avoir reçu son id */
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
