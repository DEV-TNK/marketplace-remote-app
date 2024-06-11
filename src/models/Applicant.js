const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users")

const { SeekerResume, Employment } = require("./SeekerResume");

const Applicant = sequelize.define(
  "Applicant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: false
    },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', 
    },
  },
  {
    tableName: "Applicants",
  }
);

Applicant.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
// Define associations
// Applicant.belongsTo(SeekerResume, { foreignKey: "userId" }); // Corrected the foreign key to "userId"
// Applicant.hasOne(Employment, { foreignKey: "applicantId" }); 

module.exports = Applicant;

