const User = require("../models/userModel");

const jwt = require(`jsonwebtoken`);
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } =
  process.env;

function generateAccessToken(user) {
    return jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
}

function generateRefreshToken(user) {
    return jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
}

function verifyRefreshToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
}

function verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
  
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      res.locals.user = user;
      req.user = user.id;
      next();
    });
}

function verifyAdmin(req, res, next) {

    const authHeader = req.headers["authorization"];
  
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(401);
  
      const searchedUser = await User.findById(user.id);
      if (!searchedUser) return res.sendStatus(404);
  
      if (searchedUser.isAdmin) next();
      else return res.sendStatus(401);
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyAdmin,
};