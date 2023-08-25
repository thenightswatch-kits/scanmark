const cors = require('cors')
const express = require('express');
const mongoose = require('mongoose')
const authRouter = require('./routes/authRoutes')
const attendanceRouter = require('./routes/attendanceRoutes')
const eventRouter = require('./routes/eventRoutes')
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true,
}));

const DB = "mongodb://127.0.0.1:27017/kattend"
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(async (con) => {
    console.log('DB Connection Successfull!!!');
  })
  .catch((e) => {
    console.log(e)
  });



app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/attend', attendanceRouter)
app.use('/api/event', eventRouter)



app.listen(8000,'0.0.0.0', () => {
  console.log('Server running on port 8000....');
});