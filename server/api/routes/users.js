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

//validate user
function validateUser(valObj) {
  const valSchema = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });
  return valSchema.validate(valObj);
}

//validate setAdmin
function validateSetAdmin(valObj) {
  const valSchema = Joi.object({
    username: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(1).max(255).required().email(),
    isAdmin: Joi.boolean(),
  });
  return valSchema.validate(valObj);
}

//get all users
router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).send(users);
});

//get current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).send(user);
});

//post user
router.post("/", async (req, res) => {
  //validate
  const validation = validateUser(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  //check for user
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("Email already registered");
    return;
  }

  //create user obj
  const hashed = await bcrypt.hash(req.body.password, 10);
  user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    email: req.body.email,
    password: hashed,
    isAdmin: false,
  });

  //save user obj
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(201).send({
    username: user.username,
    email: user.email,
  });
});

//put user info for me
router.put("/me", auth, async (req, res) => {
  //validate
  const validation = validateUser(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  //find user obj
  let user = await User.findById(req.user._id);

  //modify obj
  const hashed = await bcrypt.hash(req.body.password, 10);
  user.set({
    username: req.body.username,
    email: req.body.email,
    password: hashed,
  });

  //save obj
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(201).send({
    username: user.username,
    email: user.email,
  });
});

//set admin
router.put("/:id", [auth, admin], async (req, res) => {
  //validate
  const validation = validateSetAdmin(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  try {
    let user = await User.findById(req.params.id);

    user.set({ isAdmin: req.body.isAdmin });

    try {
      await user.save();
      res.status(201).send({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch {
      res.status(500).send("Internal server error.");
    }
  } catch {
    res.status(404).send("User with given ID not found.");
  }
});

//delete user by id
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).send("User deleted.");
  } catch {
    res.status(404).send("User with given ID not found.");
  }
});

module.exports = router;
