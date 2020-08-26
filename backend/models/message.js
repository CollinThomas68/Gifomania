const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize ) => {
    class Message extends Model {
  
      static associate(models) {
        models.Message.belongsTo(models.User,{
          foreignKey: 'userId' 
        })
      }
    };

    Message.init({
        title: DataTypes.STRING,
        text: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        file: DataTypes.STRING,
        highlights: DataTypes.TINYINT,

      }, {
        sequelize,
        modelName: 'Message',
      });
      return Message;
    };