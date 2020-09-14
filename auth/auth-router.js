const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets.js");

const Users = require("./auth-model.js");

router.post("/register", validateUserContent, (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({
        saved
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", validateUserContent, (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "10d"
  };
  return jwt.sign(payload, jwtSecret, options);
}

function validateUserContent(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ message: "Username & password fields are required." });
  } else {
    next();
  }
}

module.exports = router;
