const userModele = require('../models/User');
const messageModele = require('../models/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../db.js');
const fs = require('fs');
const jwtUtils = require('../utils/jwtUtils');



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
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log('Test userId');
  console.log(Id);
      if(Id<0){
        res.status(400).json(({'error':'wrong token'}))
      }
      User.findOne({
        attributes:['id','username','email','isAdmin'],
        where:{id:Id}
      }).then(user=>res.status(200).json(user))
      .catch(error=> res.status(400).json({'message':'Utilisateur non trouvé'}))
}; 

exports.verif = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log(req.params);
  console.log(Id);
  console.log(req.body);

  if(Id<0){

    res.status(400).json(({'error':'Mauvais token'}))
    }
    User.findOne({where:{id:Id,email:req.body.emailCompte}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }

        console.log(userfound);
        bcrypt.compare(req.body.passwordCompte,userfound.password)//On compare le hash du password saisi par l'utilisateur et celui stocké dans la base
        .then(valid=>{
            if(!valid){
              return res.status(401).json({error:'Mot de passe incorrect'});//erreur si les hash ne correspondent pas
            }else{
                  res.status(200).json(userfound);
            }
        })
        .catch(error=>res.status(500).json({error}));
      
      
        })
    .catch(error=>res.status(500).json({error}));
};

exports.suppression=(req,res,next)=>{
  const User = userModele(sequelize);
  const Message = messageModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  if(Id<0){
    res.status(400).json(({'error':'wrong token'}))
    }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }
      else{
                  Message.findAll({where: {userId:Id}})
                    .then(messagesfound=>{
                      console.log("Test recupe messages :");
                      console.log(messagesfound);
                      for(let message in messagesfound){
                        const mes =messagesfound[message];
                        const filename=mes.dataValues.file.split('/images/')[1];
                        //messageId=mes.dataValues.id;
                        console.log('Test');
                        console.log(filename);
                        fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
                              console.log('Test suppression image');
                              console.log('Test de fin de journée !!')
                            });
                      };
                    })
                    .catch(error=>res.status(500).json({error}));
                    User.findOne({where:{id:Id}})
                    .then(userfound=>{
                      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
                        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
                     }
                      User.destroy({where : {id:Id}})
                      .then(()=>res.status(200).json({message :"Utilisateur supprimé"}))
                       .catch(error=> res.status(400).json({error}));                   
                    })  
                  
                    .catch(error=>res.status(500).json({error}));
        }
      })
    .catch(error=>res.status(500).json({error}));
};

exports.modifmail = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log(req.params);
  console.log(Id);
  console.log(req.body);

  if(Id<0){

    res.status(400).json(({'error':'Mauvais token'}))
    }
    User.findOne({where:{id:Id,email:req.body.emailActuel}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }
      User.update ({email : req.body.emailNouveau},{where:{id:Id}})
      .then(() => res.status(200).json({message: 'Votre demande a bien été prise en compte!'}))
      .catch(error => res.status(404).json({ error }));
      
        })
    .catch(error=>res.status(500).json({error}));
};
/*
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
                      console.log(messagesfound);
                      for(let message in messagesfound){
                        const mes =messagesfound[message];
                        const filename=mes.dataValues.file.split('/images/')[1];
                        //messageId=mes.dataValues.id;
                        console.log('Test');
                        console.log(filename);
                        fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
                              console.log('Test suppression image');
                              console.log('Test de fin de journée !!')
                              //On supprime le message
                             // Message.destroy({where:{ userId: req.body.id }})

                             //.then(() => res.status(200).json({message : 'Message supprimé'}) )
                                      
                              //.catch(() => console.log('test erreur lors suppression !' ))
                            });

                      };

                  
                    })
                    .catch(error=>res.status(500).json({error}));
                    User.findOne({where:{id:req.body.id, email:req.body.email}})
                    .then(userfound=>{
                      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
                        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
                     }
   
                      User.destroy({where : {email:req.body.email}})
                      .then(()=>res.status(200).json({message :"Utilisateur supprimé"}))
                       .catch(error=> res.status(400).json({error}));
                    
                    })
     
              }
          })
          .catch(error=>res.status(500).json({error}));
      
      
        })
    .catch(error=>res.status(500).json({error}));
};
*/