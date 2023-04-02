import express from "express";
import { getAllOrders, getSingleOrder, addNewOrder, updateOrder, deleteOrder, openStripeCheckoutPage, getAllUserOrders} from "../controllers/ordersController.js";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";



const router = express.Router();

// ("/orders");

// get request "/orders/" get all orders
router.get("/", auth, isAdmin, getAllOrders);


// router.post("/", auth, addNewOrder);

// post request "/orders/ redirect to stripe checkout page"
router.post("/", auth, openStripeCheckoutPage)


// post request "/orders/confirm" add new order
router.post("/confirm", auth, addNewOrder)


// get request "/orders/userorders/:id" get all orders of a user
// the reason why we are using isAdmin to allow both the admin and the same user to get his own orders not other orders that belongs to other users

router.get("/userorders/:id",auth, isAdmin, getAllUserOrders)

// here we are using the id of the order to get a single order 
router.get("/:id", auth, isAdmin, getSingleOrder);


// patch req "/orders/:id"
router.patch("/:id", auth, isAdmin, updateOrder);

// delete req "/orders/:id"

router.delete("/:id", auth, isAdmin, deleteOrder);


export default router;
