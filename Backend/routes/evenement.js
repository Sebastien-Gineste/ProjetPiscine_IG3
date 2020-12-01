const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const evenementCtrl = require('../controllers/evenement');

router.get('/', auth.verifyToken, evenementCtrl.selectAll)                   // Information de tous les événements
router.get('/:id',auth.verifyToken, evenementCtrl.select)                    // Information d'un événement identifiant avec son "id"
router.post('/',auth.verifyToken, evenementCtrl.save);                       // Création d'un évenemnt
router.put('/:id',auth.verifyToken, evenementCtrl.update)                    // Modification d'un événement identifier avec son "id"
router.delete('/:id',auth.verifyToken,evenementCtrl.delete)                  // Supprimer un événement identifier avec son "id"

module.exports = router;