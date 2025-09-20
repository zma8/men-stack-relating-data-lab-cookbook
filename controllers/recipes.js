const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');


router.get('/', async (req, res) => {
   try {
    const recipes = await Recipe.find({ owner: req.session.user._id }) .populate('owner').populate('ingredients'); 
    res.render('recipes/index.ejs', { 
      recipes: recipes,
      user: req.session.user
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).sort({ name: 1 });
        res.render('recipes/new.ejs', { 
            ingredients: ingredients,
            user: req.session.user 
        });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});


router.post('/', async (req, res) => {
  try {
    const recipeData = {
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients, 
      owner: req.session.user._id
    };
    
    await Recipe.create(recipeData);
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/recipes/new');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id) .populate('owner') .populate('ingredients'); 
    if (!recipe) {
      return res.redirect('/recipes');
    }
    res.render('recipes/show.ejs', {
      recipe: recipe,
      user: req.session.user
    });
  } catch (err) {
    console.log(err);
    res.redirect('/recipes');
  }
});

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    const ingredients = await Ingredient.find({}).sort({ name: 1 });
    res.render('recipes/edit.ejs', {
      recipe: currentRecipe,
      ingredients: ingredients, 
      user: req.session.user
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId);
    if (currentRecipe.owner.equals(req.session.user._id)) {
      await currentRecipe.updateOne(req.body);
      res.redirect('/recipes');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId); // Fixed variable name from 'listing' to 'recipe'
    if (recipe.owner.equals(req.session.user._id)) {
      await recipe.deleteOne();
      res.redirect('/recipes');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;