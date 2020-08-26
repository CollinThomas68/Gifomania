const userModele = require('../models/User');
const messageModele = require('../models/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../db.js');
const fs = require('fs');




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


exports.perso = (req,res,next)=>{

  const User = userModele(sequelize);
  User.findOne({
    attributes:['id','username','email','isAdmin'],//On ne met pas le password dans les attributs pour éviter la faille de sécurité!!!
    where:{ id: req.params.id}})
      .then(user=>res.status(200).json(user))
      .catch(error=> res.status(400).json({error}))
};


exports.delete=(req,res,next)=>{
  const User = userModele(sequelize);
  const Message = messageModele(sequelize);
    User.findOne({where:{id:req.body.id, email:req.body.email}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }
        console.log(userfound);
        bcrypt.compare(req.body.password,userfound.password)//On compare le hash du password saisi par l'utilisateur et celui stocké dans la base
        .then(valid=>{
            if(!valid){
              return res.status(401).json({error:'Mot de passe incorrect'});//erreur si les hash ne correspondent pas
            }else{
                  Message.findAll({where: {userId:req.body.id}})
                    .then(messagesfound=>{
                      console.log("Test recupe messages :");
                      console.log("messagesfound");
                      for(let messages in messagesfound){
                        const mes =messagesfound[messages];
                        const filename=mes.dataValues.file.split('/images/')[1];
                        console.log('Test');
                        console.log(filename);
                        fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
                              console.log('Test suppression image');
                              //On supprime le message
                              Message.destroy({where:{ userId: req.body.id }})
                         
                              .then(() => console.log("message supprimé"))
                                      
                              .catch(error => res.status(400).json({ error }));
                            });
                      };

                  
                    })
                    .catch(error=>res.status(500).json({error}));

                User.destroy({where : {id:req.body.id}})
                  .then(()=>res.status(200).json({message :"Utilisateur supprimé"}))
                .catch(error=> res.status(400).json({error}));
              }
          })
          .catch(error=>res.status(500).json({error}));
      
      
        })
    .catch(error=>res.status(500).json({error}));
};