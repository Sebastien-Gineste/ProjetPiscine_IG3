const jwt = require('jsonwebtoken');
const SecretToken = require('../config/tokenKey');

exports.verifyToken = (req, res, next) => {
  try {
    if(typeof req.headers["authorization"] !== 'undefined') {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SecretToken);
        console.log(decodedToken);
        const userId = decodedToken.idEtudiant;
        if (req.body.userId && req.body.userId !== userId) {
          res.sendStatus(403);
        } else {
          next(); // Utilisateur Valider
        }
    } else {
        // Forbidden
        res.sendStatus(403);
    }
  }
  catch(error){
    console.log(error)
    res.status(400).json({ error })
  }
}


exports.createToken = function(idEtudiant) {
  return jwt.sign( {idEtudiant: idEtudiant}, SecretToken, {expiresIn: '24h'});
}
