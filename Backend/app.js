const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const Pool = require("./config/conf")

const path = require('path');

const etudiantRoutes = require('./routes/etudiant');
const groupeRoutes = require('./routes/groupe_projet');
const evenementRoutes = require('./routes/evenement');


const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/api/Etudiant', etudiantRoutes);
app.use('/api/Groupe', groupeRoutes);
app.use('/api/Evenement', evenementRoutes);

module.exports = app;