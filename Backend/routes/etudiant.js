const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/etudiant');

router.post('/signup', userCtrl.signup);
router.get('/etudiants', userCtrl.selectAll)
router.post('/login', userCtrl.login);

module.exports = router;