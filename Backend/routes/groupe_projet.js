// A faire
const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');

const groupeCtrl = require('../controllers/groupe_projet');

router.get('/', auth.verifyToken, groupeCtrl.selectAll);                                     //récupère tous les groupes (admin?)
router.get('/etudiants',auth.verifyToken, groupeCtrl.selectAllEtudiant)                      //récupère tous les étudians (id, nom, premnom) n'ayant pas encore de groupe pour la promo (Autocompletion quand un étudiant ajoutera d'autre étudiant à son groupe)
router.get('/:id', auth.verifyToken, groupeCtrl.select);                                     //Renvoie les information d'un seul groupe identifier par son "id"
router.post('/', auth.verifyToken,groupeCtrl.save);                                          //Créer un groupe dans la BD
router.post('/:id/addEtudiant',auth.verifyToken,groupeCtrl.ajoutEtudiant)                    //Ajout un étudiant dans le groupe identifier avec son "id" (ajout une ligne dans la table composer)
router.put('/:id', auth.verifyToken, groupeCtrl.update);                                     //Modifier un groupe représenter par son id
router.delete('/:id', auth.verifyToken, groupeCtrl.delete);                                  //Supprimer un groupe représenter par son id
router.delete('/:id/removeEtudiant/',auth.verifyToken, groupeCtrl.removeEtudiant)             //Supprimer un étudiant dans le groupe identifier avec son "id" (supprime une ligne dans la table composer)


module.exports = router
