import OrderCollection from "../models/orderSchema.js";
import ProductCollection from "../models/productSchema.js";
import UserCollection from "../models/userSchema.js";
import {stripe} from "../server.js"


export const getAllOrders = async (req, res) => {
    //request handler // controller

    try {
        const orders = await OrderCollection.find()
            .populate("user")
            .populate("products");
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const addNewOrder = async (req, res) => {

    try {
        
        const order = new OrderCollection(req.body);
        await order.save();
        res.status(201).json({ success: true, data: order });
    
       
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};



export const getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderCollection.findById(id);

        if (!order) {
            res.status(404).json({ success: false, data: "User not found" });
        } else {
            res.status(200).json({ success: true, data: order });
        }
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await OrderCollection.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await OrderCollection.findByIdAndRemove(id);
        res.json({ success: true, data: deletedOrder });
    } catch (error) {
        res.status(500).json({ success: false, data: error.message });
    }
};

export const openStripeCheckoutPage = async (req, res) => {
   
    try {
        const data = [];
        for (const id of req.body.products) {
            // here we are finding the product by id and then we are pushing the product to the data array
            // in order to push the product to the data array we have to use await because we are using async function
            // the idea of the loop is to find each product by id and then push each product to the data array
            // the loop is going to run as many times as the number of products in the products array in the request body
            
          data.push(await ProductCollection.findById(id));
        }

        // after that we will create a map function that will map each product in the data array to a new object and then we will push the new object to the line_items array

        const line_items = data.map((product) => {

          return {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title,
                images: [product.thumbnail],
                description: product.description,
              },
              unit_amount: product.price * 100,
            },
            quantity: 1,
          };
        });

        // here when we are receiving the order from the frontend we are not receiving the user id and the product id we are receiving the user email and the product name so we have to find the user id and the product id from the database and then we have to create a new order with the user id and the product id and then we have to save the order in the database and then we have to add the order id to the user orders array and we have to add the order id to the product orders array and then we have to save the user and the product in the database
        // after we have saved the order in the database we have to send the order id to the frontend and then we have to redirect the user to the checkout page and then we have to create a session on the stripe server and then we have to send the session url to the frontend and then we have to display the session url to the user and then the user will be able to pay for the order

        const session = await stripe.checkout.sessions.create({

        // here we are creating a session on the stripe server and then we are sending the session url to the frontend and then we are displaying the session url to the user and then the user will be able to pay for the order
          line_items,
          mode: "payment",
          success_url: `http://localhost:5173/cart?success=true`,
          cancel_url: `http://localhost:5173/cart?success=false`,
        });
        
        // here we are sending a response to the frontend and on the frontend we are going to display the session.url page to the user
        res.json({ success: true, url: session.url });
        

    }catch(err){

        res.json({success:false, data:err.message})
        

    }
}

// export const  getAllUserOrders = async (req, res) => {
//     try {

//         const {id} = req.params
//         const userOrders = await OrderCollection.find({user:id}).populate(
//             "products"
//         );

//         res.status(200).json({ success: true, data: userOrders });


//     } catch (error) {
//         res.status(500).json({ success: false, data: error.message });
//     }
// };


export const getAllUserOrders = async (req, res, next) => {

    try {
  
      const { id } = req.params;
        
     // here we wanted to get all the orders of a specific user
     // so we need to find all the orders that have the same userId as the id we got from the params
     // and we need to populate the products field with the actual products data from the products collection in order to get the product title and price and not just the id
     // and we need to populate the user field with the actual user data from the users collection in order to get the user name and email    
      const userOrders = await OrderCollection.find({userId:id}).populate("products")
      res.json({ success: true, data: userOrders });
  
    }catch (err) {
  
      res.json({ success: false, message: err.message });
    }
  }
  