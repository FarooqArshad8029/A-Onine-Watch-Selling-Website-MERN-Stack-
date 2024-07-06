import React from "react";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import axios from "axios";

export const fcmTOKEN = async (userId) => {
  const permisiion = await Notification.requestPermission();

  try {
    if (permisiion === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BDlllRWnH19vbI5xah3Nr48UBctyOzU4WrNYy7z1kp1r7B8okpD31Z_RVWNlVSx_dIkoMoLuU9B4ptvK86rD3Pg",
      });
      console.log("Token generated  :", token);

      const response = await axios.post("/get-fcm-token", {
        token,
      });
      console.log("response:", response);
      if (!response) {
        const { data } = await axios.post("/fcm-token", {
          userId,
          token,
        });
        console.log("fcmTOKEN fun data:", data);
      }
    } else {
      alert("Permission nOT gRANted");
    }
  } catch (error) {
    console.log(error);
  }
};
