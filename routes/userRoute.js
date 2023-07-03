const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");


router.get("/home", userController.getHome);
router.get("/nav/:id", userController.getNav);
router.post("/register", userController.userRegister);
router.post("/userLogin", userController.userLogin);
router.get("/userProfile/:data", userController.userProfile);
router.get("/mykids/:data", userController.myKids);
router.post("/registerKid", userController.registerKid);
router.post("/updateuser", userController.updateUser);
router.get("/mykids/babyprofile/:data", userController.babyprofile);
router.post("/verify", userController.verifyotp);
router.post("/logout", userController.logout);
router.post("/mykids/editbaby", userController.editBaby);
router.post("/mykids/deletebaby", userController.deleteBaby);

module.exports = router;
