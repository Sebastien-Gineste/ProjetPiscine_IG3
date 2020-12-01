const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const Pool = require("./config/conf")

const path = require('path');
/*
const stuffRoutes = require("./routes/stuff");
*/
const userRoutes = require('./routes/etudiant');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

/*
app.use('/api/stuff', stuffRoutes);*/
app.use('/api/Etudiant', userRoutes);

module.exports = app;