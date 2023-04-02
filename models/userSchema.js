import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // if I want to make a user an admin I can do that by changing the role to admin and if I want to make a user a user I can do that by changing the role to user
    //when we remove the amdin role from the enum array we are not removing the admin role from the database we are just not allowing the user to change the role to admin
    role: { type: String, default: "user", enum:["user"/*,"admin"*/] },
    //here we are creating orders array to store the orders of the user and we are using the ref to connect the user to the order and we are using the type to get the id of the user that is making the order
    orders: [{ type: Schema.Types.ObjectId, ref: "orders" }],
    profileImage: {
         type: String, 
        default: function () {
        return `https://robohash.org/${this.firstName}+${this.lastName}`
        
        

    } 

}
    
});

//set email as an index

userSchema.indexes({email: 1});

const UserCollection = model("users", userSchema);

export default UserCollection;
