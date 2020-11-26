const jwt = require('jsonwebtoken');
const Etudiant = require("../models/etudiant");
const bcrypt = require("bcrypt");

exports.selectAll = (req, res, next) => {
  new Etudiant().selectAll().then((results) => {
      console.log(results)
      res.status(201).json({ message: 'Utilisateur créé !' })
  }).catch((error) => {
      switch(error) {
        case Error.NO_RESULTS:
            console.log('Pas de demande.');
            res.status(400).json({ error })
            break;
        default : 
            console.log(error == Errors.NO_RESULTS)
            console.log('service indispo.');
            res.status(400).json({ error })
            break;
      }
  })
}
 // A modif
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new Etudiant({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    Etudiant.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
