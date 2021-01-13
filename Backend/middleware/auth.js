const jwt = require('jsonwebtoken');
const SecretToken = require('../config/tokenKey');
const Etudiant = require('../models/etudiant');

exports.verifyToken = (req, res, next) => {
  try {
    if(req.headers.cookie) {
        var cookie = req.headers.cookie.split("=");
        if(cookie[0] == "jwtAuth"){ // bon cookie
            const token = cookie[1] // token
            const decodedToken = jwt.verify(token, SecretToken);
            next(); // token good
        }
        else{
          res.sendStatus(403);
        }  
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
  }
  catch(error){
    console.log(error)
    res.status(400).json({ error })
  }
}

exports.verifyTokenAdmin = (req, res, next) => {
  try {
    if(req.headers.cookie) {
        var cookie = req.headers.cookie.split("=");
        if(cookie[0] == "jwtAuth"){ // bon cookie
            const token = cookie[1] // token
            const decodedToken = jwt.verify(token, SecretToken);
            new Etudiant().select([decodedToken.idEtudiant])
            .then(user => {
                if(user[0].estAdmin){
                  next(); // token good && admin
                }
                else{ // pas admin
                  res.sendStatus(403);
                }
            })
            .catch(error => {
              console.log(error)
              res.status(500).send(error);
            });
        }
        else{
          res.sendStatus(403);
        }  
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
  }
  catch(error){
    console.log(error)
    res.status(400).json({ error })
  }
}

exports.exportsId = (cookie) => {
  if(cookie) {
    var Splitcookie = cookie.split("=");
    if(Splitcookie[0] == "jwtAuth"){ // bon cookie
        const token = Splitcookie[1] // token
        const decodedToken = jwt.verify(token, SecretToken);
        return decodedToken.idEtudiant;
    }
  }
  return false 
}

exports.decodeToken = (token) =>{
  try{
    return jwt.verify(token, SecretToken)
  }
  catch(error){
    return error;
  }
}

exports.logout = (req, res) => {
  res.clearCookie("jwtAuth", {httpOnly: true}).status(200).send("Cookie deleted");
}

exports.createToken = function(idEtudiant) {
  return jwt.sign( {idEtudiant: idEtudiant}, SecretToken, {expiresIn: '24h'});
}
