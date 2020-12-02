const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const profCtrl = require('../controllers/prof');

router.get('/',auth.verifyToken, profCtrl.selectAll)                    // Information de tous les profs
router.get('/:id',auth.verifyToken, profCtrl.select)                    // Information d'un prof identifiant avec son "id"
router.post('/',auth.verifyToken, profCtrl.save);                       // Création d'un prof
router.put('/:id',auth.verifyToken, profCtrl.update)                    // Modification d'un prof identifier avec son "id"
router.delete('/:id',auth.verifyToken,profCtrl.delete)                  // Supprimer un prof identifier avec son "id"

module.exports = router;