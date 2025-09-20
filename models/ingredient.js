const mongoose=require('mongoose');

const IngredientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
},{
    timestamps:true
});

const Ingredient=mongoose.model('Ingredient',IngredientSchema);

module.exports=Ingredient;