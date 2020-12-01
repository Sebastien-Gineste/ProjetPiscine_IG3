const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const etudiantCtrl = require('../controllers/etudiant');

router.get('/', auth.verifyToken, etudiantCtrl.selectAll)                   // Information de tous les étudiants
router.get('/:id',auth.verifyToken, etudiantCtrl.select)                    // Information d'un étudiant identifiant avec son "id"
router.post('/', etudiantCtrl.signup);                                      // Création d'un compte étudiant
router.post('/Connexion', etudiantCtrl.login);                              // Connexion d'un étudiant
router.post('/:id/VerifMail', auth.verifyToken, etudiantCtrl.envoieCodeMail)// Prend un email et renvoi un code pour modifier le mot de passe après 
router.put('/:id',auth.verifyToken, etudiantCtrl.update)                    // Modification d'un compte étudiant identifier avec son "id"
router.put('/:id/ModifMdp',auth.verifyToken,etudiantCtrl.changeMdp)         // Modification du mots de passe du compte identifier avec son "id"
router.delete('/:id',auth.verifyToken,etudiantCtrl.delete)                  // Supprimer un compte étudiant identifier avec son "id"

module.exports = router;