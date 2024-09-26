const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./Users");


const OrderSummary = sequelize.define(
    "OrderSummary",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stateRegion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: true,
        },
    });

const ServiceRequest = sequelize.define(

    "ServiceRequest",
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
        orderSummaryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'OrderSummary',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            enum: ["pending", "completed", "ongoing"],
            defaultValue: "pending",
        },
        requestedPackage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.STRING,
            enum: ["pending", "paid", "unpaid"],
            default: "pending",
        },
        currency: {
            type: DataTypes.STRING,
        },
        extraFastDelivery: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        additionalRevision: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        copyrights: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        gigQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

    },
    {
        tableName: "ServiceRequests",
    },

);

ServiceRequest.belongsTo(User, { foreignKey: "userId", targetKey: "id" });
ServiceRequest.hasOne(OrderSummary, { foreignKey: "serviceRequestsId", targetKey: "id" })

// Move the sync call outside of the model definition
// OrderSummary.sync({ alter: true })
//   .then(() => {
//     console.log("OrderSummary table has been synchronized");
//     return ServiceRequest.sync({ alter: true });
//   })
//   .then(() => {
//     console.log("ServiceRequest table has been synchronized");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing tables:", error);
//   });


module.exports = { ServiceRequest, OrderSummary };
