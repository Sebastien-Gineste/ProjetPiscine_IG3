const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const Pool = require("./config/conf")

const path = require('path');

const etudiantRoutes = require('./routes/etudiant');
const groupeRoutes = require('./routes/groupe_projet');
const evenementRoutes = require('./routes/evenement');
const creneauRoutes = require('./routes/creneau');
const profRoutes = require('./routes/prof');
const promoRoutes = require('./routes/promo');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // *
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  

app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api/Etudiant', etudiantRoutes);
app.use('/api/Groupe', groupeRoutes);
app.use('/api/Prof', profRoutes);
app.use('/api/Promo', promoRoutes);
app.use('/api/Evenement', evenementRoutes);
app.use('/api/Evenement/:id/Creneau',creneauRoutes);

module.exports = app;
