import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    image: { type: Array, required: false } /*[{type:String}]*/,
});

const ProductCollection = model("products", productSchema); 
// the products in the first parameter is the name of the collection in the database and this is how we connect the model to the database.

export default ProductCollection;
