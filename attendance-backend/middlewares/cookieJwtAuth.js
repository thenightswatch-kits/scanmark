const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const user = jwt.verify(token, "SECRET_KEY");
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(403).json({"message":"Not Authenticated"});
  }
};