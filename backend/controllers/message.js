const messageModele = require('../models/Message');
const UserModele = require('../models/User');
const sequelize = require('../db.js');

exports.creation = (req, res, next) => {
    const Message = messageModele(sequelize);
    const messageObject = JSON.parse(req.body.message); // on extrait l'objet JSON de notre req.body.article
    const message = new Message({ // on crée une instance de notre classe Message
      userId : messageObject.userId,
      title : messageObject.title,
      content : messageObject.content,
      file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    message.save()
      .then(() => res.status(201).json({ message: 'Message enregistrée' }))
      .catch(error => res.status(400).json({ error : "Erreur lors de la création de votre message" }));
  };

  exports.getAllMessage = (req, res, next) => {
    const Message = MessageModele(sequelize);
    const User = UserModele(sequelize); // JOIN
    const models = {Message, User}; // JOIN
    User.associate(models); // JOIN
    Messsage.associate(models); // JOIN
    Message.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : models.User, attributes: ['username']} }) 
      .then(messages => res.status(200).json(articles))
      .catch(error => res.status(400).json({ error : "gettallMessage" }));
  
  };