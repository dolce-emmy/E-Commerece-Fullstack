import jwt from 'jsonwebtoken';
import UserCollection from '../models/userSchema.js';


export const auth = async (req, res, next) => {
    try {

        const token = req.headers.token;
        //verify token

        const payload = jwt.verify(token, process.env.SIGNATURE) // returns the payload
       
            // here we are getting the user from the database with the saved token and populating the orders and products in the orders array  
            // we are populating the orders array in the user object
            // we are populating the products array in the orders array
            // populate is a mongoose method is used to nest the data in the database

            const user = await UserCollection.findById(payload.id).populate({path: "orders", populate:{path:"products", model: "products"}})
            req.user = user;
            next();
        

    }catch(error) {

        res.json({success: false, data: error.message})
    }
    

}

