const express = require(`express`);
const router = express.Router();
const Joi = require(`joi`);
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require(`mongoose`);

//auth middleware
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//mongoose model
const Topic = require("../models/topics");

//validate topic
function validateTopic(valObj) {
  const valSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(500),
    category: Joi.objectId().required(),
  });
  return valSchema.validate(valObj);
}

//validate upvote
function validateUpvote(valObj) {
  const valSchema = Joi.object({
    username: Joi.string().min(1).max(50).required(),
  });
  return valSchema.validate(valObj);
}

//get all topics
router.get("/", async (req, res) => {
  const topics = await Topic.find().populate("category");
  res.status(200).send(topics);
});

//get topic by id
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("category");
    res.status(200).send(topic);
  } catch {
    res.status(404).send("Topic with given ID not found.");
  }
});

//post topic
router.post("/", auth, async (req, res) => {
  //validate
  const validation = validateTopic(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  //create topic obj
  let topic = new Topic({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
  });

  //save topic obj
  topic = await topic.save();
  res.status(201).send(topic);
});

//put topic by id
router.put("/:id", [auth, admin], async (req, res) => {
  //validate
  const validation = validateTopic(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  try {
    let topic = await Topic.findById(req.params.id);

    topic.set({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
    });

    try {
      topic = await topic.save();
      res.status(201).send(topic);
    } catch {
      next();
    }
  } catch {
    res.status(404).send("Topic with given ID not found.");
  }
});

//delete topic by id
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    await Topic.deleteOne({ _id: req.params.id });
    res.status(200).send("Topic deleted.");
  } catch {
    res.status(404).send("Topic with given ID not found.");
  }
});

//upvote topic
router.post("/upvote/:id", auth, async (req, res) => {
  //validate

  const validation = validateUpvote(req.body);
  if (validation.error) {
    res.status(400).send("Bad request.");
    return;
  }

  try {
    var topic = await Topic.findById(req.params.id).exec();

    const username = req.body.username;
    if (topic.upvotes.includes(username)) {
      res.status(409).send("Topic already upvoted.");
    }

    topic.upvotes.addToSet(username);

    try {
      topic = await topic.save();
      res.status(201).send(topic);
    } catch {
      res.status(500).send("Internal server error.");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send("Topic with given ID not found.");
  }
});

module.exports = router;
