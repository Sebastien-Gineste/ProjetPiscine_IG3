const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const etudiantCtrl = require('../controllers/etudiant');

router.get('/', auth.verifyToken, etudiantCtrl.selectAll);                      // Information de tous les étudiants
router.get('/Promo/:id', auth.verifyToken, etudiantCtrl.selectAllEtudiant)   // Information d'un étudiant appartenant à une promo
router.get('/Promo/SansGroupe/:id', auth.verifyToken, etudiantCtrl.selectAllEtudiantSansGroupe)   // Information d'un étudiant appartenant à une promo
router.get('/:id',auth.verifyToken, etudiantCtrl.select);                       // Information d'un étudiant identifiant avec son "id"
router.post('/', etudiantCtrl.signup);                                          // Création d'un compte étudiant
router.post('/Connexion', etudiantCtrl.login);                                  // Connexion d'un étudiant
router.post('/Deconnexion', auth.logout);                                       // Déconnexion d'un étudiant
router.post('/VerifMail', etudiantCtrl.envoieCodeMail)                          // Prend un email et renvoi un code pour modifier le mot de passe après 
router.post('/VerifCo',etudiantCtrl.checkAdmin);                                // Renvoie true s'il est admin 
router.put('/ModifMdp/:id', etudiantCtrl.changeMdp)                              // Modification du mots de passe du compte identifier avec son "id"
router.put('/:id',auth.verifyToken, etudiantCtrl.update)                        // Modification d'un compte étudiant identifier avec son "id"
router.delete('/:id',auth.verifyToken,etudiantCtrl.delete)                      // Supprimer un compte étudiant identifier avec son "id"


module.exports = router;