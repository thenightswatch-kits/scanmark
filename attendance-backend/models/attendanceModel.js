const Mongoose = require('mongoose');

const deviceSchema = new Mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
  });

const locationSchema = new Mongoose.Schema({
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    require: true
  }
})
  
const attendanceSchema = new Mongoose.Schema(
  {
    submitted_at: {
      type: Date,
      required: true,
    },
    recorded_at:{
      type: Date,
      required: true,
    },
    rollnumber: {
      type: String,
      required: true,
    },
    device: {
      type: deviceSchema,
      required: true,
    },
    location:{
      type: locationSchema,
      required : true
    },
    username: {
      type: String,
      required: true,
    },
    event_id: {
        type: String,
        required: true,
      },
  }
);

module.exports = Mongoose.model('Attendance', attendanceSchema);