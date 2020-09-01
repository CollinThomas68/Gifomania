const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {
  
      static associate(models) {
        models.User.hasMany(models.Message)
      }
    };
    User.init({
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'User',
    });
    return User;
  };