const express = require(`express`);
const router = express.Router();
const Joi = require(`joi`);
const mongoose = require(`mongoose`);

//auth middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//mongoose model
const Category = require('../models/categories');

//validate category
function validateCategory(valObj){
    const valSchema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        description: Joi.string().min(1).max(500)
    });
    return valSchema.validate(valObj);
};

//HTTP get all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.status(200).send(categories);
});

//HTTP get category by id
router.get('/:id', async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        res.status(200).send(category);
    } catch{
        res.status(404).send('Category with given ID not found.');
    };
});

//HTTP post category
router.post('/', [auth, admin], async (req, res) => {
    //validate
    const validation = validateCategory(req.body);
    if(validation.error){
        res.status(400).send('Bad request');
        return;
    };

    //create category obj
    let category = new Category({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    //save category obj
    category = await category.save();
    res.status(201).send(category);
});

//HTTP put category by id
router.put('/:id', [auth, admin], async (req, res) => {
    //validate
    const validation = validateCategory(req.body);
    if(validation.error){
        res.status(400).send('Bad request');
        return;
    };

    try{
        let category = await Category.findById(req.params.id);

        category.set({name: req.body.name, description: req.body.description});

        try{
            category = await category.save();
            res.status(201).send(category);
        } catch{
            res.status(500).send('Internal server error.');
        };
    } catch{
        res.status(404).send('Category with given ID not found.');
    };
});

//HTTP delete category by id
router.delete('/:id', [auth, admin], async (req, res) => {
    try{
        await Category.deleteOne({ _id: req.params.id });
        res.status(200).send('Category deleted.');
    } catch{
        res.status(404).send('Category with given ID not found.');
    };
});

module.exports = router;
