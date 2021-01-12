const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const creneauCtrl = require('../controllers/creneau');

router.get('/' ,creneauCtrl.selectAll)                                     // Information de tous les créneaux d'un 'événement 
router.get('/Jury/:nom' ,creneauCtrl.selectAllWithProf)                    // Information de tous les créneaux d'un prof d'un événement 
router.get('/Salles',auth.verifyToken, creneauCtrl.selectAllSalle)         // Récupère toutes les salles des enregistrer dans les créneaux d'un événement 
router.get('/:id', creneauCtrl.select)                                     // Information d'un créneau identifiant avec son "id"
router.post('/',auth.verifyTokenAdmin, creneauCtrl.save);                  // Création d'un créneau
router.put('/:idC',auth.verifyTokenAdmin, creneauCtrl.update)              // Modification d'un créneau identifier avec son "id"
router.put('/:idC/Inscription',auth.verifyToken, creneauCtrl.updateCreneau)// Modification du groupe d'un créneau identifier avec son "id"
router.delete('/:idC',auth.verifyTokenAdmin,creneauCtrl.delete)            // Supprimer un créneau identifier avec son "id"

module.exports = router;