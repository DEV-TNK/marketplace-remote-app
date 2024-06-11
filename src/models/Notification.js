const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: Number,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: false,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
    }
},
    {
        timestamps: true,
    }

)

module.exports = mongoose.model("Notification", notificationSchema)