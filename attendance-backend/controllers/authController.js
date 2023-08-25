const jwt = require("jsonwebtoken");
const User = require('../models/userModels')
const bcrypt = require('bcryptjs')
const JWT_SECRET = "SECRET_KEY"

exports.loginController = async (req, res) => {
  try{
    if (!req.body) {
      res.status(404).end("Error")
      return
    }
    const { username, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ username }).lean()
    if (!user) {
      res.json({ status: 'error', error: 'invalid username/password' })
      return
    }
    console.log(password)
    if (await bcrypt.compare(password, user.password)) {
      console.log("asdasd")
      const token = await jwt.sign({
        id: user._id,
        username: user.username
      }, JWT_SECRET,  { expiresIn: "10h" })
      res.cookie("token", token);
      res.status(200).json({message:"logging successfull"})
    }else{
      res.status(401).json({ status: 'error', error: 'invalid username/password' })
    }
  }catch(err){
    res.status(400).json({err:err})
  }

};


exports.logoutController = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ "message": "Logged Out" });
}

exports.registerController = async (req, res) => {
  if (!req.body) {
    res.status(404).end("Error")
    return
  }
  const { username, name, password: plaintextpass } = req.body
  const password = await bcrypt.hash(plaintextpass, 10)
  try {
    const user = await User.create({
      name,
      username,
      password
    });
    return res.status(201).json({ message: 'User Created' })
  } catch (err) {
    console.log(err)
    if (err.code === 11000) {
      return res.status(406).json({ error: 'Username already taken' })
    }
    return res.status(400).json({ error: err })
  }

}

exports.getUsernamesController = async (req, res) => {
  try {
    const users = await User.find({ username: { $ne: 'admin' } }, {_id: 0, password: 0});
    const usernames = users;
    res.status(200).json(usernames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUserController = async (req, res) => {
  const { username } = req.body;

  try {
    if (req.user && req.user.username === 'admin') {
      const deletedUser = await User.findOneAndDelete({ username });

      if (deletedUser) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(403).json({ error: 'Unauthorized: Only admin can delete users' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

