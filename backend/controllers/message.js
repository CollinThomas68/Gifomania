const messageModele = require('../models/Message');
const UserModele = require('../models/User');
const sequelize = require('../db.js');
const { models } = require('../db.js');
const fs = require('fs');
const jwtUtils = require('../utils/jwtUtils');
const { Op } = require('sequelize')


exports.creation = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize);
    var headerAuth  = req.headers['authorization'];
    var Id      = jwtUtils.getUserId(headerAuth);
    if(Id<0){
      res.status(400).json(({'error':'Mauvais token'}))
      }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }
    const messageObject = JSON.parse(req.body.message); // on extrait l'objet JSON de notre req.body.message
    const message = new Message({ // on crée une instance de notre classe Message
      userId : Id,
      title : messageObject.title,
      text : messageObject.text,
      file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    message.save()
      .then(() => res.status(201).json({ message: 'Message enregistrée' }))
      .catch(error => res.status(400).json({ error : "Erreur lors de la création de votre message" }));
    })
  };

  exports.getAllMessage = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Message.associate(models); // JOIN
    var headerAuth  = req.headers['authorization'];
    var Id      = jwtUtils.getUserId(headerAuth);
    if(Id<0){
      res.status(400).json(({'error':'Mauvais token'}))
      }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }console.log(Id);
    Message.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : models.User, attributes: ['username']} }) 
      .then(messages => res.status(200).json(messages))
      .catch(error => res.status(400).json({ error : "getallMessage" }));
    })
  };

  exports.choixModeration = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Message.associate(models); // JOIN
    var headerAuth  = req.headers['authorization'];
    var Id      = jwtUtils.getUserId(headerAuth);
    if(Id<0){
      res.status(400).json(({'error':'Mauvais token'}))
      }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }console.log(Id);
    Message.findAll({
      order: sequelize.literal('(createdAt) DESC'), 
      include: {model : models.User, 
      attributes: ['username']},
      where:{highlights:1} }) 
      .then(messages => res.status(200).json(messages))
      .catch(error => res.status(400).json({ error : "getallMessage" }));
      })
  };

  exports.messageDetail = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Message.associate(models); // JOIN
    var headerAuth  = req.headers['authorization'];
    var Id      = jwtUtils.getUserId(headerAuth);
    if(Id<0){
      res.status(400).json(({'error':'Mauvais token'}))
      }
    User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }console.log(Id);
    Message.findOne({
      include: {model : models.User, 
      attributes: ['username']},
      where:{ id: req.params.id}})
      .then(message => res.status(200).json(message))
      .catch(error => res.status(400).json({ error : "getoneMessage" }));
      })
  };
  
//Code pour supprimer un message
exports.suppressionMessage = (req,res,next)=>{
  const Message = messageModele(sequelize);
  const User = UserModele(sequelize); 
  console.log(req.params.id);
  var headerAuth  = req.headers['authorization'];
  var Id      = jwtUtils.getUserId(headerAuth);
  if(Id<0){
    res.status(400).json(({'error':'Mauvais token'}))
    }
  User.findOne({where:{id:Id}})
  .then(userfound=>{
    if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
      res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
    }else{
      console.log(Id);

      
      Message.findOne({where:{id: req.params.id}})
        .then(messagetrouve=>{
          if(userfound.isAdmin || messagetrouve.userId==Id){
          console.log(messagetrouve);
          const filename=messagetrouve.file.split('/images/')[1];
          console.log('Test');
          console.log(filename);
          fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
              Message.destroy({where:{ id: req.params.id }})
                //On supprime le message
                .then( res.status(200).json({message:'Message supprimé!'}))
                .catch(error => res.status(400).json({ error }));
            });
          }else{
            res.status(404).json({message:"Vous n'êtes pas autorisé à faire ceci"})
          }
        })

      .catch(error => res.status(500).json({ error }));

    }
  })
};


exports.Highlight = (req,res,next) =>{
  const Message = messageModele(sequelize);
  const User = UserModele(sequelize); 
  const highlights = req.body.highlights;
  var headerAuth  = req.headers['authorization'];
  var Id = jwtUtils.getUserId(headerAuth);

  console.log('Test id message :');
  console.log(req.params.id);
  console.log('test valeur highlights :')
  console.log(highlights);
  if(Id<0){
    res.status(400).json(({'error':'Mauvais token'}))
    }
  User.findOne({where:{id:Id}})
    .then(userfound=>{
      if(!userfound){//Si on ne trouve pas d'utilisateur correspondant dans la base !
        res.status(400).json({error : 'Cet utilisateur n\'existe pas !'});
      }else{
        console.log(Id);
      Message.findOne({where:{ id: req.params.id}})
        .then(messagetrouve => {
            if(userfound.isAdmin){
            console.log('Test message trouvé :');
            console.log(messagetrouve)
            console.log('Test highlights trouvé :');
            console.log(messagetrouve.highlights);
              Message.update({ highlights: req.body.highlights},{where:{ id: req.params.id}})//On actualise uniquement le champ Highlights de la table message !
                .then(() => res.status(200).json({message: 'Statut modifié !'}))
                .catch(error => res.status(404).json({ error }));
            }else{
              res.status(404).json({message:"Vous n'êtes pas autorisé à faire ceci"})
            }
          }).catch(error => res.status(400).json( { error } ))
      }      
    }).catch(error => res.status(500).json( { error } ))
};


/*
exports.getAllMessage = (req, res, next) => {
  const Message = messageModele(sequelize);
  const User = UserModele(sequelize); // JOIN
  const models = {Message, User}; // JOIN
  User.associate(models); // JOIN
  Message.associate(models); // JOIN
  Message.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : models.User, attributes: ['username']} }) 
    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(400).json({ error : "getallMessage" }));

};

//Code pour supprimer un message
exports.suppressionMessage = (req,res,next)=>{
  const Message = messageModele(sequelize);
  console.log(req.params.id);

  Message.findOne({where:{ id: req.params.id && userId : Id}})
    .then(messagetrouve=>{
      console.log(messagetrouve);
      const filename=messagetrouve.file.split('/images/')[1];
      console.log('Test');
      console.log(filename);
      fs.unlink(`images/${filename}`,()=>{//Code identique que pour l'actualisation avec nouvelle image :  ne pas laisser trainer de vieilles photos sur le serveur
          Message.destroy({where:{ id: req.params.id }})
            //On supprime le message
            .then( res.status(200).json({message:'Message supprimé!'}))
            .catch(error => res.status(400).json({ error }));
      });
    })

      .catch(error => res.status(500).json({ error }));
  
};

exports.Highlight = (req,res,next) =>{
  const Message = messageModele(sequelize);
  
  const highlights = req.body.highlights;


  console.log('Test id message :');
  console.log(req.params.id);
  console.log('test valeur highlights :')
  console.log(highlights);

  Message.findOne({where:{ id: req.params.id}})
  .then(messagetrouve => {
      console.log('Test message trouvé :');
      console.log(messagetrouve)
      console.log('Test highlights trouvé :');
      console.log(messagetrouve.highlights);
      Message.update({ highlights: req.body.highlights},{where:{ id: req.params.id}})//On actualise uniquement le champ Highlights de la table message !
      .then(() => res.status(200).json({message: 'Statut modifié !'}))
      .catch(error => res.status(404).json({ error }));
  }).catch(error => res.status(400).json( { error } ))
};


*/
