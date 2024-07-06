import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import otpModel from "../models/otpModel.js";
import pushNotificationModel from "../models/pushNotificationModel.js";
import JWT from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import FCM from "fcm-node";
// import * as FCM from "fcm-node"

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { toast } from "react-hot-toast";
import notificationModel from "../models/notificationModel.js";
console.log();

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (password.length < 8) {
      return res.send({ message: "Password Must be 8 Digits Long" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// updateuser profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//role status
export const roleStatusController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const users = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing role",
      error,
    });
  }
};

//all users

export const getAllUsersController = async (req, res) => {
  console.log("getAllUsersController");
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While getting users",
      error,
    });
  }
};

//reset password
export const resetPasswordController = async (req, res) => {
  console.log("resetPasswordController");
  try {
    const { email, otp, confirmNewPassword } = req.body;
    let data = await otpModel.findOne({ code: otp });
    if (data) {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;
      if (diff < 0) {
        res.status(500).send({
          success: false,
          message: "OTP Expire ! Please Try Again",
        });
      } else {
        const hashed = await hashPassword(confirmNewPassword);

        await userModel.findOneAndUpdate(
          { email: email },
          { $set: { password: hashed } },
          { new: true }
        );

        res.status(200).send({
          success: true,
          message: "password changed successfully",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "invalid OTP",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Send Email",
      error,
    });
  }
};
// send otp
export const sendOtpController = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("sendOtpController");
  try {
    const { email } = req.body;
    console.log("emailsendOtpController:", email);
    let data = userModel.findOne({ email: email });
    if (data) {
      let otpCode = Math.floor(Math.random() * 10000 + 1);
      const otpData = await new otpModel({
        email: email,
        code: otpCode,
        expireIn: new Date().getTime() + 300 * 1000,
      }).save();
      console.log("otpData:", otpData);
      const otpText = `Your OTP code is: ${otpCode}. This OTP is valid for the next 5 minutes.`;
      const msg = {
        to: email,
        from: "malikravel@gmail.com", // Replace with your sender email address
        subject: "Your OTP Code TO Reset Pasword",
        text: otpText,
      };
      const data = await sgMail.send(msg);

      res.status(200).send({
        success: true,
        message: "Please Check Your Email ID for OTP",
        otpData,
      });
    } else {
      res.status(300).send({
        success: false,
        message: "Email Id Does't Exist!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Send Email",
      error,
    });
  }
};

// delete expires otps
export const deleteExpiredOtps = async () => {
  try {
    const currentTime = new Date().getTime();
    await otpModel.deleteMany({ expireIn: { $lte: currentTime } });
    console.log("Expired OTPs deleted.");
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};
// subscribe users for Newsletters
export const subscribeNewslettersController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email-subscribeNewslettersController:", email);
    const existingUser = await userModel.findOne({
      email: email,
      isSubscribed: true,
    });
    console.log("existingUser:", existingUser);
    if (existingUser) {
      res.status(200).send({
        success: true,
        message: "User Already Registered",
      });
    } else {
      let registerUser = await userModel.findOneAndUpdate(
        { email: email },
        { isSubscribed: true },
        { new: true } // Return the updated user document
      );
      console.log("registerUser:", registerUser);
      const subject = "Welcome to our Newsletter!";
      const message =
        "Dear,We are thrilled to welcome you to our family and express our gratitude for choosing to subscribe to our newsletter. As a subscriber, you're now a part of our vibrant community, and we can't wait to keep you updated with the latest news, updates, and exciting stories";
      const sendMailResponse = await sendMail([{ email }], subject, message);
      res.json(sendMailResponse);
    }
  } catch (error) {
    console.error("Error sending email :sendMailController:-", error);
    res.status(500).send({
      success: false,
      message: "Error while sending email : sendMailController",
      error: error.message,
    });
  }
};

// send promotions to users
export const sendMailController = async (req, res) => {
  console.log("req.body-sendMailController:", req.body);

  try {
    const { subject, message } = req.body;
    const subscribedUsers = await userModel.find({ isSubscribed: true });
    console.log("subscribedUsers:", subscribedUsers);
    if (subscribedUsers) {
      const sendMailResponse = await sendMail(
        subscribedUsers,
        subject,
        message
      );
      res.json(sendMailResponse);
    } else {
      res.send("Not found any Registred Users!");
    }
  } catch (error) {
    console.error("Error while send promotions to user :", error);
  }
};

//send email
export const sendMail = async (users, subject, message) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    for (const user of users) {
      const msg = {
        to: user.email,
        from: "malikravel@gmail.com",
        subject: subject,
        text: message,
      };
      console.log("SendGrid Request:", msg);
      await sgMail.send(msg);
    }
    return {
      success: true,
      message: "Emails sent successfully  ",
    };
  } catch (error) {
    console.error("Error while send email to user :", error);
    throw error;
  }
};
// search admin orders
export const searchOrderController = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Search for orders with the given order ID
    const order = await orderModel
      .findOne({ _id: orderId })
      .populate("products")
      .populate("buyer", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fcmTokenController = async (req, res) => {
  console.log("fcmTokenController");
  try {
    const { userId, token } = req.body;

    const tokendata = await new pushNotificationModel({
      userId: userId,
      token: token,
    }).save();
    console.log("token-fcmTokenController:", tokendata);
    if (tokendata) {
      res.status(200).send({
        success: true,
        message: "fcm token generated",
        tokendata,
      });
    } else {
      res.status(300).send({
        success: false,
        message: "token fcm not generated",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While fcm token",
      error,
    });
  }
};
export const getFcmTokenController = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await pushNotificationModel.findOne({ token });
    console.log("user:", user);
    if (!user) {
      return res.status(202).send({
        success: false,
        message: "user  not found",
      });
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get fcm token",
      error,
    });
  }
};

// fun for push notification

export const sendPushNotificationController = async (req, res) => {
  console.log("sendPushNotificationController ");
  try {
    // const { userId, massege } = req.body;
    const massege = "Hy ! Test masg";
    const serverKey = process.env.FCM_SERVER_KEY;
    console.log("serverKey:", serverKey);

    let fcm = new FCM(serverKey);
    console.log("fcm:", fcm);

    const users = await pushNotificationModel.find({});
    console.log("users:", users);

    let reg_tokens = [];
    users.forEach((user) => {
      reg_tokens.push(user.token);
    });
    console.log("reg_tokens:", reg_tokens);
    if (reg_tokens.length > 0) {
      console.log("if check:qwe");
      let pushMessage = {
        registration_ids: reg_tokens,
        content_available: true,
        mutable_content: true,
        notification: {
          body: massege,
          icon: "myicon",
          sound: "mysound",
        },
      };
      fcm.send(pushMessage, (err, response) => {
        if (err) {
          console.log("fcm.send(pushMessage,(res,err) fun err:", err);
          res.status(500).send({
            success: false,
            message: "Error while sending notification",
            error: err.message,
          });
        } else {
          console.log("Notification send");
          res.status(200).send({
            success: true,
            message: "Notification sent successfully",
          });
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: "No registration tokens available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While sendPushNotificationController",
      error,
    });
  }
};

// send Notification to users

export const getNotificationController = async (req, res) => {
  console.log("req.body-sendMailController:", req.body);

  try {
    const allNotifications = await notificationModel.find({});
    // console.log("allNotifications:", allNotifications);
    if (allNotifications) {
      res.json(allNotifications);
    } else {
      res.send("Not found any Notification!");
    }
  } catch (error) {
    console.error("Error while get notification to user :", error);
  }
};
export const sendNotificationController = async (req, res) => {
  console.log("req.body-sendMailController:", req.body);

  try {
    const { message, link, userId, sentAt } = req.body;
    const data = await new notificationModel({
      message: message,
      link: link,
      readBy: userId,
      sentAt: sentAt,
    }).save();

    if (data) {
      res.status(200).send(data);
    } else {
      res.send(" Notification not save !");
    }
  } catch (error) {
    console.error("Error while save  notification  :", error);
  }
};

//read notification
export const readNotificationController = async (req, res) => {
  const { notificationId, userId } = req.params;
  console.log("notificationId-readNotificationController:", notificationId);
  console.log("userId-readNotificationController:", userId);

  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      { _id: notificationId },
      { $addToSet: { readBy: userId } }, // Add user ID to the readBy array
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: "Error updating read status" });
  }
};
