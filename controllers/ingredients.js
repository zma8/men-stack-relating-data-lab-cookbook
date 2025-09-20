const express = require('express');
const router = express.Router();

const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');


router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).sort({ name: 1 });
        res.render('ingredients/index.ejs', { 
            ingredients: ingredients,
            user: req.session.user
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    try {
        const existingIngredient = await Ingredient.findOne({ 
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
        });
        if (existingIngredient) {
            return res.redirect('/ingredients?error=exists');
        }
        await Ingredient.create({
            name: req.body.name.trim()
        });
        res.redirect('/ingredients');
    } catch (error) {
        console.log(error);
        res.redirect('/ingredients');
    }
});


module.exports = router;