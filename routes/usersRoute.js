import express from "express";
import { getAllUsers, getSingleUser, addNewUser, updateUser, deleteUser,loginUser } from "../controllers/usersController.js";
import { auth} from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import rules  from "../middleware/validators.js";

const router = express.Router();

("/products");

router.get("/", auth, isAdmin, getAllUsers);

//login post request "/users" add new user // register

router.post("/", rules, addNewUser);

//login post request "/users/login"
router.post("/login", rules, loginUser);

// verify token on page refresh

router.get("/refreshpage", auth, (req, res) => {
    res.json({success: true, data:req.user})
})

// get request "users/:id"
router.get("/:id", auth, isAdmin, getSingleUser);


// patch req "/products/:id"
router.patch("/:id",auth, isAdmin, updateUser);

// delete req "/products/:id"

router.delete("/:id", auth, isAdmin, deleteUser);


export default router;
