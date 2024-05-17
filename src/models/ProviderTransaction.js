const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users");

const ProviderTransaction = sequelize.define("ProviderTransaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.ENUM("NGN", "GBP", "USD", "EUR"), // Assuming currency codes are always three characters long
    defaultValue: "NGN",
  },
  type: {
    type: DataTypes.STRING(30), // Assuming currency codes are always three characters long
    defaultValue: "JOB",
  },
});

ProviderTransaction.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

module.exports = ProviderTransaction;
