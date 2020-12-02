const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const promoCtrl = require('../controllers/promo');

router.get('/', promoCtrl.selectAll)                                     // Information de toutes les promos
router.get('/:id',auth.verifyToken, promoCtrl.select)                    // Information d'une promo identifiant avec son "id"
router.post('/',auth.verifyToken, promoCtrl.save);                       // Création d'une promo
router.delete('/:id',auth.verifyToken,promoCtrl.delete)                  // Supprimer une promo identifier avec son "id"

module.exports = router;