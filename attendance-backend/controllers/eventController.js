const Event = require('../models/eventModel')

exports.createController = async (req, res) => {

  function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }
  const id = generateRandomId(6);
  if (!req.body) {
    res.status(404).end("Error")
    return
  }
  const currentDate = new Date();
  const created_at = currentDate.toISOString();
  try {
    let { name, active, description } = req.body
    const user = await Event.create({
      name, id, active, description, created_at
    });
    res.status(201).json({ message: 'Created Event : ' + id })
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err })
  }

}

exports.getAllEventsController = async (req, res) => {
  try {
    if (req.query.id) {
      const eventId = req.query.id;
      const event = await Event.find({ id: eventId });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json(event);
    }

    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.toggleActiveController = async (req, res) => {
  const username = req.user.username; // Assuming the username is provided in the request body

  if (username !== 'admin') {
    res.status(403).json({ error: 'Permission denied. Only admin can toggle active status.' });
    return;
  }

  if (!req.body.id) {
    res.status(400).json({ error: 'Event ID is required.' });
    return;
  }

  try {
    const event = await Event.findOne({ id: req.body.id });

    if (!event) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    console.log()
    await Event.findOneAndUpdate(
      { id: req.body.id },
      { $set: {active: !event.active}  }
    ); res.status(200).json({ message: 'Event active status toggled to false.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};