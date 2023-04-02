import express from "express";
import { addNewProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();



("/products");
router.get("/", getAllProducts);

router.post("/", auth, isAdmin, addNewProduct);

// get request "products/:id"
router.get("/:id", getSingleProduct);


// patch req "/products/:id"
router.patch("/:id", auth, isAdmin, updateProduct);

// delete req "/products/:id"

router.delete("/:id", auth, isAdmin, deleteProduct);


export default router;
