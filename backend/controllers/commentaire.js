const UserModele = require('../models/User');
const CommentaireModele = require('../models/Commentaire');
const sequelize = require('../db.js');


const jwtUtils = require('../utils/jwtUtils');



exports.creation = (req, res, next) => {

    const User = UserModele(sequelize);
    const Commentaire = CommentaireModele(sequelize);
    var headerAuth  = req.headers['authorization'];
    console.log('test', headerAuth);
    var Id      = jwtUtils.getUserId(headerAuth);
    console.log('Id :',Id);
    var messageId = req.params.id;
    console.log('Message Id :', messageId);
    if(Id<=0){
        res.status(400).json(({error:'Mauvais token'}))
    }else{
      User.findOne({where:{id:Id}})
      .then(userfound=>{
        if(!userfound){
            res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
        }else{
            console.log("Utilisateur :", userfound);
          console.log("Texte du commentaire :", req.body.text);
          const commentaire = new Commentaire({ // on crée une instance de notre classe Commentaire
            userId : userfound.id,
            username:userfound.username,
            messageId : messageId,
            text : req.body.text
          });
      
          commentaire.save()
     
            .then(() => res.status(201).json({ message: 'Commentaire enregistré' }))
            .catch(error => res.status(404).json({ error : "Erreur lors de la création de votre commentaire" }));
        }
      })
     .catch(error => res.status(403).json({ error }));
    }
   

  };

 exports.getAllCommentaires = (req, res, next) => {
    const Commentaire = CommentaireModele(sequelize);

    const User = UserModele(sequelize); // JOIN

    var headerAuth  = req.headers['authorization'];
    var Id      = jwtUtils.getUserId(headerAuth);
    if(Id<=0){
      res.status(400).json(({error:'Mauvais token'}))
    }else{
      User.findOne({where:{id:Id}})
      .then(userfound=>{
        if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
          res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
        }console.log(Id);
      Commentaire.findAll({where:{messageId:req.params.id},order: sequelize.literal('(createdAt) ASC')}) 
        .then(commentaires => res.status(200).json(commentaires))
        .catch(error => res.status(400).json({ error : "getallCommentaire" }));
      })

      }

  };

