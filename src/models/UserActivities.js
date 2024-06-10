const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users");


const UserActivity = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserAction: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  UserId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserIp: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  DateCreated: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ActionType: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'UserActivity',
  timestamps: false, // If you don't have createdAt and updatedAt fields

});

module.exports = UserActivity;
