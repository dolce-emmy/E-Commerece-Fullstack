import {Schema, model} from "mongoose";

// reference documents
// https://mongoosejs.com/docs/schematypes.html
//embedded documents
const orderSchema = new Schema({
    // ref here is the name of the user collection in the database
    //here we are trying to get the id of the user that is making the order by using the ref and the id of the user that is making the order by using type: Schema.Types.ObjectId
    //the type of the id is an object id that is why we are using Schema.Types.ObjectId in the type property of the userId property in the orderSchema object .
    // using the ref and the type objectId we are able to build the connection between the user and the order

    userId: {type: Schema.Types.ObjectId, ref: "users", required: true},
    total: {type: Number, required: true},
    products: [{type: Schema.Types.ObjectId, ref: "products"}],
    
    
},

{timestamps: true}

)
    
    const OrderCollection = model("orders", orderSchema);
    
    export default OrderCollection;
    
    

//this is called embedded documents or nested objects
// {
//     userId: "123456789",
//     total: 100,
//     products: [
//         {
//             productId: "123456789",
//             quantity: 2,
//             price: 50
//         },
//         {   
//             productId: "987654321",
//         }
//     ]
// }