import express from 'express';
import userController from '../controllers/user-controller';

const router = express.Router();
const auth = require("../middleware/auth.ts");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.delete("/deleteUser", auth, userController.deleteUser);
router.delete("/clearCookie", userController.clearCookie);
router.put("/updateUserPassword", auth, userController.updateUserPassword);
router.put("/updateUserInfo", auth, userController.updateUserInfo);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUserInfo", auth, userController.getUserInfo);
router.get("/getUserByEmail", userController.getUserByEmail);

export default router;