const userModele = require('../models/User');
const messageModele = require('../models/message');
const commentaireModele = require('../models/commentaire');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../db.js');
const fs = require('fs');
const jwtUtils = require('../utils/jwtUtils');
const { Op } = require('sequelize');


//************************************************
//Code pour l'inscription d'un nouvel utilisateur*
//************************************************
exports.inscription = (req,res,next)=>{
    const User=userModele(sequelize);
    User.findOne({where: {[Op.or]: [{email:req.body.email},{username:req.body.username}]}})
    .then(user=>{
      if(!user){  //utilisation de bcrypt pour générer un hash du mot de passe saisi par l'utilisateur
        bcrypt.hash(req.body.password, 10)//On fait 10 cycles
        .then(hash=>{
          const user = new User({//On crée un nouveau User
            username : req.body.username,
            email:req.body.email,//On récupère l'email contenu dans la requète
            password:hash//On récupère le hash du mot de passe obtenu grâce à bcrypt
          });
          user.save()//On sauvegarde l'utilisateur dans la base de données
            .then(() => res.status(201).json({message : 'Utilisateur créé !'}))
            .catch(error=> res.status(500).json({ error }));
        })
        .catch(error=> res.status(500).send({ error}));
      }else{
        
        return res.status(401).json({error : 'Cet utilisateur existe déjà !'});
        
      }
    
    })
    .catch(error=> res.status(500).send({ error}));
  
 
};

//*************************************************
//Code pour la connexion d'un utilisateur existant*
//*************************************************

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

//***************************************************
//Code pour l'accès à la page perso de l'utilisateur*
//***************************************************
exports.perso = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log('Test userId');
  console.log(Id);
      if(Id<=0){
        res.status(400).json(({error:'wrong token'}))
      }
      User.findOne({
        attributes:['id','username','email','isAdmin'],
        where:{id:Id}
      }).then(user=>res.status(200).json(user))
      .catch(error=> res.status(400).json({message:'Utilisateur non trouvé'}))
}; 


//****************************************************************************
//Code pour la vérification des infos utilisateur avant suppression du compte*
//****************************************************************************
exports.verif = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log(req.params);
  console.log(Id);
  console.log(req.body);

  if(Id<0){

    res.status(400).json(({error:'Mauvais token'}))
    }
    User.findOne({where:{id:Id,email:req.body.emailCompte}})
    .then(userfound=>{

      if(userfound){
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
      }   else{//Si on ne trouve pas d'utilisateur correspondant dans la base !
      res.status(400).json({error : 'Votre email n\'est pas correct!'});
      console.log('Problème utilisateur')
    }
      
        })
    .catch(error=>res.status(500).json({error}));
};


//***********************************
//Code pour la suppression du compte*
//***********************************
exports.suppression=(req,res,next)=>{
  const User = userModele(sequelize);
  const Message = messageModele(sequelize);
  const Commentaire = commentaireModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  if(Id<0){
    res.status(400).json(({error:'Mauvais token !'}))
    }
    User.findOne({where:{id:Id}})
    .then(userfound=>{

      if(userfound){
                  
                  Message.findAll({where: {userId:Id}})
                    .then(messagesfound=>{

                      console.log("Test recupe messages :");
                      console.log(messagesfound);
                      for(let message in messagesfound){
                        const mes =messagesfound[message];
                        const filename=mes.dataValues.file.split('/images/')[1];
                        const mesId=mes.dataValues.id;
                        console.log('Test messageId :',mesId);
                        //Commentaire.destroy({where:{messageId:mesId}})
                        Commentaire.destroy({where: {[Op.or]: [{messageId:mesId},{userId:Id}]}})
                        console.log('Testfilename :',filename);
                        fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
                              console.log('Test suppression image');
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
        }else{//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Problème de saisie dans les infos'});
      }
      })
    .catch(error=>res.status(500).json({error}));
};


//******************************************************
//Code pour la modification de l'email de l'utilisateur*
//******************************************************
exports.modifmail = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log(req.params);
  console.log(Id);
  console.log(req.body);

  if(Id<0){

    res.status(400).json(({error:'Mauvais token'}))
    }
    User.findOne({where:{id:Id,email:req.body.emailActuel}})
    .then(userfound=>{
      if(userfound){//l'email saisi correspond à celui stocké dans la base de données
      User.findOne({where:{email:req.body.emailNouveau}})//On regarde si on trouve un utilisateur avec l'email désiré
      .then(userverif=>{
        if(!userverif){// l'email désiré n'existe pas dans la base de données
          User.update ({email : req.body.emailNouveau},{where:{id:Id}})
          .then(() => res.status(200).json({message: 'Votre demande a bien été prise en compte!'}))
          .catch(error => res.status(404).json({ error }));
        }else{//l'email désiré est déjà utilisé dans la base de données 
          res.status(404).json({ error : 'L\'email désiré n\'est pas disponnible'});
        }
        
      })
      .catch(error=>res.status(500).json({error}));

      }else{//Si on l'email ne correspond pas à celui de la base de données !
        res.status(400).json({error : 'Votre email n\'est pas le bon !'});
        console.log('cas ou email actu ne correspond pas à la saisie utilisateur');
      }

      
        })
    .catch(error=>res.status(500).json({error}));
};


//*******************************************************
//Code pour la modification du password de l'utilisateur*
//*******************************************************
exports.modifpassword = (req,res,next)=>{
  const User = userModele(sequelize);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  console.log('test', req.body);
  if(Id<0){

    res.status(400).json(({error:'Mauvais token'}))
    }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }

        console.log(userfound);
        bcrypt.compare(req.body.passwordActuel,userfound.password)//On compare le hash du password saisi par l'utilisateur et celui stocké dans la base
        .then(valid=>{
            if(!valid){
              return res.status(401).json({error:'Mot de passe incorrect'});//erreur si les hash ne correspondent pas
            }else{
              bcrypt.hash(req.body.passwordNouveau, 10)//On fait 10 cycles
              .then(hash=>{
                const newPassword=hash;
             
                console.log('Test hash',newPassword);
                User.update({password : newPassword },{where:{id:Id}})//On met à jour le mot de passe dans la base de données
                  .then(() => res.status(201).json({message : 'Mot de passe actualisé !'}))
                  .catch(error=> res.status(400).json({ error }));
                })
              .catch(error=> res.status(500).send({ error}));
            }
        })
        .catch(error=>res.status(500).json({error}));
      
      
        })
    .catch(error=>res.status(500).json({error}));
};




