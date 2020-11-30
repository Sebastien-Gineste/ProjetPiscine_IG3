const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")

const etudiantCtrl = require('../controllers/etudiant');

router.get('/', auth.verifyToken, etudiantCtrl.selectAll)
router.post('/Inscription', etudiantCtrl.signup);
router.put('/'/*,auth.verifyToken*/, etudiantCtrl.update)
router.get('/etudiants', etudiantCtrl.selectAll)
router.post('/login', etudiantCtrl.login);

module.exports = router;