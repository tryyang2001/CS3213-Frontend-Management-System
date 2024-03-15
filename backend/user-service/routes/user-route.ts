import express from 'express';
import userController from '../controllers/user-controller';

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.delete("/deleteUser", userController.deleteUser);
router.delete("/clearCookie", userController.clearCookie);
router.put("/updateUserPassword", userController.updateUserPassword);
router.put("/updateUserInfo", userController.updateUserInfo);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUserByUserId", userController.getUserByUserId);
router.get("/getUserByEmail", userController.getUserByEmail);

export default router;