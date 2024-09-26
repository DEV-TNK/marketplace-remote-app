const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users")

const Account = sequelize.define("Account", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'NGN'),
        allowNull: false,
        defaultValue: 'NGN',
    },
}, {
    tableName: "Account",
}
)
Account.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

module.exports = Account;