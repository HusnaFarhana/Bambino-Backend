const express = require("express");
const router = express.Router();
const staffController = require("../controller/staffController");

router.post("/stafflogin", staffController.staffLogin);
// router.post("/user-login", userController.userLogin);
router.get("/myprofile/:data", staffController.myProfile);
router.get("/mypupils/:id", staffController.getPupils);
router.get("/singlekid/:id", staffController.singleKid);
// router.get("/viewUserProfile", userController.userProfile);
// router.post("/upload-photo", userController.uploadPhoto);

module.exports = router;
