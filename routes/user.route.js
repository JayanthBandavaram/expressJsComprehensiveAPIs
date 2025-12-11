
import express from "express";
import { 
  fetch, create, update, deleteUser, fetchById, getAllUsers, login 
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router();

// 🔓 Public Route
route.post("/login", login);
route.post("/create", create);
route.get("/getAllUsers", fetch);

// 🔒 All routes below this require authentication
route.use(verifyToken);



route.get("/getUser/:id", fetchById);
route.get("/all-users", getAllUsers);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteUser);

export default route;
