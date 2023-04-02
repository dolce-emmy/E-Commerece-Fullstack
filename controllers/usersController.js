import UserCollection from "../models/userSchema.js";
import ImageCollection from "../models/imageSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
    //request handler // controller

    try {
        const users = await UserCollection.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};
// this is the register controller
export const addNewUser = async (req, res) => {
    try {
        //console.log(body.req)
        //console.log(req.files)

        const user = new UserCollection(req.body);

        if (req.files) {
            const image = new ImageCollection({
                filename: new Date().getTime() + "_" + req.files.image.name,
                // we are converting the image into a buffer and storing it in the database as a buffer data type in mongodb and then we are converting it back to an image in the frontend using the buffer data type in the frontend 
                data: req.files.image.data,
                // we are storing the mimetype of the image in the database so that we can convert it back to an image in the frontend
                //mimetype is the type of the file like image/jpeg, image/png, image/jpg etc 
                contentType: req.files.mimetype,
                userId: user._id,
            });

            await image.save();
            user.profileImage = `http://localhost:40004/images/${image.filename}`;
        }

        //hashing user password
        // abc $2smma technique to read the code and guess what the password is, this is a hacker technique called rainbow table attack
        // the salt is a random string that is added to the password before hashing it  and the salt is stored in the database as well
        const hashedPassword = bcrypt.hashSync(user.password, 10);

        //here we are overwriting the clean password with the hashed password
        user.password = hashedPassword;

        // storing user into database

        await user.save();

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserCollection.findById(id);

        if (!user) {
            res.status(404).json({ success: false, data: "User not found" });
        } else {
            res.status(200).json({ success: true, data: user });
        }
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await UserCollection.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserCollection.findByIdAndRemove(id);
        res.json({ success: true, data: deletedUser });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const loginUser = async (req, res) => {

    //authentication is a process of verifying the identity of a user
    // issue a token to the user after authentication is successful and the token is stored in the browser and is sent to the server with every request to the server and the server verifies the token and if the token is valid then the user is authenticated

    try {
        const {email,password } = req.body;

        //finding user by email // verifying email
        // we are populating the orders array in the user object and we are populating the products array in the orders array so when the user logs in we can still see all the orders and the products in the orders otherwise these orders and products will disappear from the user object once he logs out.
        const user = await UserCollection.findOne({email: email}).populate({path: "orders", populate:{path:"products", model: "products"}});
        if(user) {

            //verify the password // comparing the password with the hashed password in the database // bcrypt.compareSync(password, user.password) // this function returns true if the password matches the hashed password in the database
            // user.password is the hashed password in the database
            //password is the password that the user entered in the login form
            const verifyPassword = bcrypt.compareSync(password, user.password); // this function returns Boolean if the password matches the hashed password in the database
            if(verifyPassword) {
               const token = jwt.sign({id: user._id, email:user.email}, process.env.SIGNATURE, {expiresIn: "1h",issuer:"Eman", audience:"e-store-users"})
               // in this case the token is stored in the header response and is sent to the client

               res.header("token", token).json({success: true, data: user})

            }else {
                res.status(401).json({success: false, data: "Invalid password"})
            }



        }else {
            res.status(401).json({success: false, data: "User not found"})
        }
    }
    catch(err){
        res.status(500).json({success: false, data: err.message})
    }

}

