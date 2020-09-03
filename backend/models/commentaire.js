const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
 class Commentaire extends Model {
  };

    Commentaire.init({
        text: DataTypes.STRING,
        username:DataTypes.STRING,
        userId: DataTypes.INTEGER,
        messageId:DataTypes.INTEGER


      }, {
        sequelize,
        modelName: 'Commentaire',
      });
      return Commentaire;
    };