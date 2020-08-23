const userModele = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../db.js');




//Code pour l'inscription d'un nouvel utilisateur
exports.inscription = (req,res,next)=>{
    const User=userModele(sequelize);
    //utilisation de bcrypt pour générer un hash du mot de passe saisi par l'utilisateur
    bcrypt.hash(req.body.password, 10)//On fait 10 cycles
    .then(hash=>{
      const user = new User({//On crée un nouveau User
        username : req.body.username,
        email:req.body.email,//On récupère l'email contenu dans la requète
        password:hash//On récupère le hash du mot de passe obtenu grâce à bcrypt
      });
      user.save()//On sauvegarde l'utilisateur dans la base de données
        .then(() => res.status(201).json({message : 'Utilisateur créé !'}))
        .catch(error=> res.status(400).json({ error }));
    })
    .catch(error=> res.status(500).send({ error}));
};

//Code pour la connexion d'un utilisateur existant
exports.authentification = (req,res,next)=>{
    const User=userModele(sequelize);
    User.findOne({where: {email:req.body.email} })
    .then(user=>{
      if(!user){
          return res.status(401).json({error : 'Utilisateur non trouvé'});//Erreur si l'adresse mail n'existe pas
      }
      bcrypt.compare(req.body.password,user.password)//On compare le hash du password saisi par l'utilisateur et celui stocké dans la base
      .then(valid=>{
          if(!valid){
            return res.status(401).json({error:'Mot de passe incorrect'});//erreur si les hash ne correspondent pas
          }
          res.status(200).json({//Si le password est ok on renvoie l'userId et le token d'authentification 
              userId:user.id,
              token: jwt.sign(
                { userId: user.id },
                process.env.JWT_Token,
                { expiresIn: '24h' }
              ),
              isAdmin:user.isAdmin
          });
      })
      .catch(error=> res.status(500).json({ error}));
    })
    .catch(error=> res.status(500).json({ error}));
};
