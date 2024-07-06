import express from "express";
const router = express.Router();

import {
  registerController,
  loginController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  subscribeNewslettersController,
  sendMailController,
  sendNotificationController,
  sendOtpController,
  resetPasswordController,
  getAllUsersController,
  roleStatusController,
  searchOrderController,
  fcmTokenController,
  getFcmTokenController,
  sendPushNotificationController,
  getNotificationController,
  readNotificationController
} from "../controllers/authController.js";
import {getChatController} from "../controllers/socketController.js"
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

// user register route

router.post("/register", registerController);
// user login route

router.post("/login", loginController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//search order
router.post(
  "/search-Order/:orderId",
  requireSignIn,
  isAdmin,
  searchOrderController
);

//all users
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// role status update
router.put("/user-role/:userId", requireSignIn, isAdmin, roleStatusController);

//NewsLetter || POST
router.post("/subscribe-Newsletters", subscribeNewslettersController);

//send mails
router.post("/send-mail", requireSignIn, isAdmin, sendMailController);

//send Notification
router.post("/send-notification", requireSignIn, isAdmin, sendNotificationController);
//makred notification as read
router.put("/mark-notification-read/:notificationId/:userId", readNotificationController);


router.post("/get-notification", requireSignIn,getNotificationController);

//forgot paswsword functinality 2
//send mail for otp
router.post("/sendOtp", sendOtpController);

//change password
router.post("/resetPassword", resetPasswordController);

//fcm token 
router.post("/fcm-token", fcmTokenController);

router.post("/get-fcm-token", getFcmTokenController);

router.post("/send-fcm-msg", sendPushNotificationController);

// chat controller

router.get("/get-user-chat/:userId", requireSignIn, getChatController);




export default router;
