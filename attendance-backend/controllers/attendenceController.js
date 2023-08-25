const Attendance = require('../models/attendanceModel')

exports.markController = async (req, res) => {
    if (!req.body) {
      res.status(404).end("Error")
      return
    }
    const currentDate = new Date();
    const time = currentDate.toISOString();
    try {
      console.log(req.user)
      let data = req.body
      data = data.map((item) => ({
        ...item,
        submitted_at: time,
        username: req.user.username
      }));
      const user = await Attendance.create(data);
      res.status(201).json({ message: 'Attendence Marked' })
    } catch (err) {
          console.log(err)
          res.status(400).json({ error: err })
    }
  
  }

  exports.getAttendanceController = async (req, res) => {
    const attendanceId = req.query.id;

    try {
        const attendance = await Attendance.find({event_id : attendanceId});
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        res.status(200).json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};