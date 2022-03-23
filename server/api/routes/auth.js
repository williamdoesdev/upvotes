const bcrypt = require("bcrypt");
const express = require(`express`);
const router = express.Router();
const Joi = require(`joi`);
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require(`mongoose`);

//auth middleware
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//mongoose model
const User = require("../models/users");

//validate login
function validateLogin(valObj) {
  const valSchema = Joi.object({
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });
  return valSchema.validate(valObj);
}

//login endpoint
router.post("/", async (req, res) => {
  //validate
  const validation = validateLogin(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    console.log(validation.error);
    return;
  }

  //check for user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password.");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid email or password.");
    return;
  }

  //create token
  const token = user.generateAuthToken();
  userToSend = {
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  res.status(200).send({ token: token, user: userToSend });
});

//check for vaid token endpoint
router.get("/", auth, async (req, res) => {
  res.status(200).send(req.user);
});

module.exports = router;
