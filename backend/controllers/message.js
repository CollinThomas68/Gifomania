const messageModele = require('../models/Message');
const UserModele = require('../models/User');
const sequelize = require('../db.js');
const { models } = require('../db.js');
const fs = require('fs');


exports.creation = (req, res, next) => {
    const Message = messageModele(sequelize);
    const messageObject = JSON.parse(req.body.message); // on extrait l'objet JSON de notre req.body.article
    const message = new Message({ // on crée une instance de notre classe Message
      userId : messageObject.userId,
      title : messageObject.title,
      text : messageObject.text,
      file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    message.save()
      .then(() => res.status(201).json({ message: 'Message enregistrée' }))
      .catch(error => res.status(400).json({ error : "Erreur lors de la création de votre message" }));
  };

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

  exports.choixModeration = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Message.associate(models); // JOIN
    Message.findAll({
      order: sequelize.literal('(createdAt) DESC'), 
      include: {model : models.User, 
      attributes: ['username']},
      where:{highlights:1} }) 
      .then(messages => res.status(200).json(messages))
      .catch(error => res.status(400).json({ error : "getallMessage" }));
  
  };

  exports.affichageMessage = (req, res, next) => {
    const Message = messageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Message.associate(models); // JOIN
    Message.findOne({
      include: {model : models.User, 
      attributes: ['username']},
      where:{ id: req.params.id}})
      .then(messages => res.status(200).json(messages))
      .catch(error => res.status(400).json({ error : "getoneMessage" }));
  
  };
  
//Code pour supprimer un message
exports.suppressionMessage = (req,res,next)=>{
  const Message = messageModele(sequelize);
  console.log(req.params.id);
  Message.findOne({where:{ id: req.params.id}})
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