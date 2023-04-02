import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productsRoute from "./routes/productsRoute.js";
import usersRoute from "./routes/usersRoute.js";
import ordersRoute from "./routes/ordersRoute.js";
import fileupload from "express-fileupload";
import ImageCollection from "./models/imageSchema.js";
import stream from "stream";
// import cors from "cors";

dotenv.config();

import Stripe from "stripe";
export const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// console.log(process.env);

const app = express();

const Port = process.env.PORT || 4004;

//mongoose connection
//mongoose connect is a promise

// app.use((req,res,next) => {

//     res.header("")
//     next()
// })

// app.use(cors({origin:"http://localhost:5173", exposedHeaders:["token"]}))


mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log("connection to mongodb successful");
    })
    .catch((err) => {
        console.log(err.message);
    });

//data
//products (crud operation)
//users (crud operation)
//orders (crud operation)

//MVC architecture
//model
//view
//controller

//external middleware
//parsing the body of the request
app.use(express.json());

//www-form-urlencoded data
app.use(express.urlencoded({ extended: true }));

// to handle and parse a form data we can use multer or express-fileupload
app.use(fileupload());

//APP USE here is a middleware that will handle any requests that comes from products by sending it to the product route.
app.use("/products", productsRoute);
app.use("/users", usersRoute);
app.use("/orders", ordersRoute);



//create static middleware to serve the static files of the production build of the react app
app.use(express.static("./views/dist"));

//create index route
app.get("/", (req,res) => {

    res.sendFile("./views/dist/index.html", {root:"."})
})

app.get("/images/:filename", async (req, res) => {
    const { filename } = req.params;
    const image = await ImageCollection.findOne({ filename });

    //filename, data (buffer data), userId

    // we are passing the buffer data through the stream
    const readStream = stream.Readable.from(image.data);
    // through the pipe method we are reading and writing the file to the response.
    readStream.pipe(res)
});

app.listen(Port, () => {
    console.log(`Server is running on port: ${Port}`);
});
