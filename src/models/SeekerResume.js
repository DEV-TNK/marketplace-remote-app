const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/dbConnect");
const User = require('./Users'); 

const Employment = sequelize.define('Employment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyCountry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyState: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfJoining: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfLeaving: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// SeekerResume model
const SeekerResume = sequelize.define('SeekerResume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  school: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  study: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studyType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startYear:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endYear:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  headline:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workType:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workLocation:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workAvailability:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'SeekerResume',
});

// Define associations
SeekerResume.belongsTo(User, { foreignKey: 'userId' });
SeekerResume.hasOne(Employment, { foreignKey: 'seekerResumeId' });

module.exports = { SeekerResume, Employment };

