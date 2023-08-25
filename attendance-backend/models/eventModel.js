const Mongoose = require('mongoose');

const eventSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
            unique: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        description: {
            type: String,
        },
        created_at: {
            type: Date,
            required: true,
        },
    }
);

module.exports = Mongoose.model('Event', eventSchema);