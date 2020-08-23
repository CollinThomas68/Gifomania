const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const cors = require("cors");
const path = require('path');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

var corsOptions = {
  origin: "http://localhost:8080"
};


// Mise en place d'application'
const app = express();

app.use(cors(corsOptions));
//Mise en place de Helmet pour la sécurité
app.use(helmet());
//Mise en place du CORS pour éviter les erreurs en cas de serveurs différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //code permettant de récupérer le contenu de la requète
app.use(bodyParser.json());

//Code pour indiquer l'emplacement de stockage des images
app.use('/images',express.static(path.join(__dirname,'images')));

//Lien vers les routes
app.use('/api/message', messageRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;
