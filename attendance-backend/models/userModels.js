const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
        },
        username:{
            type: String,
            require: true,
            unique: true
        },
        password:{
            type: String,
            require: true,
        }
    }
)

module.exports = Mongoose.model('User',userSchema)