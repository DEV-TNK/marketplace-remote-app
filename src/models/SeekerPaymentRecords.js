const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users");
const Account = require("./Accounts");

const SeekerPaymentRecord = sequelize.define(
  "SeekerPaymentRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unpaid",
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentRequestId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "SeekerPaymentRecord",
    timestamps: false,
  }
);
SeekerPaymentRecord.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
SeekerPaymentRecord.belongsTo(User, { foreignKey: "adminId", targetKey: "id" });
SeekerPaymentRecord.belongsTo(Account, {
  foreignKey: "accountId",
  targetKey: "id",
});

const PaymentRequest = sequelize.define(
  "PaymentRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PaymentRequest",
    timestamps: false,
  }
);
PaymentRequest.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
PaymentRequest.belongsTo(Account, { foreignKey: "accountId", targetKey: "id" });

const SeekerEarning = sequelize.define(
  "SeekerEarning",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NGN: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Ensure a default value is set
    },
    USD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    EUR: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    GBP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "SeekerEarning",
    timestamps: false,
  }
);



SeekerEarning.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

const SeekerPendingAmount = sequelize.define(
  "SeekerPendingAmount",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobAmount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false
    },

    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),

    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "SeekerPendingAmount",
    timestamps: true,
  }
);
SeekerPendingAmount.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

module.exports = { SeekerPaymentRecord, PaymentRequest, SeekerEarning, SeekerPendingAmount };
