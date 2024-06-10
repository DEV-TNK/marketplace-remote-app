const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users")

const Amount = sequelize.define("Amount", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
        allowNull: false
    },
}, {
    tableName: "Amount",
}
)
Amount.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

module.exports = Amount;