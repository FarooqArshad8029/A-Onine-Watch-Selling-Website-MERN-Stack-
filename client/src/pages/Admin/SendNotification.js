import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import { useNotification } from "../../context/notification";
import { useAuth } from "../../context/auth";

import axios from "axios";
import toast from "react-hot-toast";
// import { notification } from "antd";

const SendNotification = () => {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [notification, setNotification] = useNotification();
  const [auth, setAuth] = useAuth();

  
  const sendNotificationHandler = async (e) => {
    e.preventDefault();
    try {
      if (!message) {
        toast.error("please Enter subject! ");
      } else {
        const { data } = await axios.post("/send-notification", {
          message,
          link,
          readBy: [auth?.user?._id],
          sentAt: new Date(), // Set the sentAt field to the current date and time

        });

        if (data) {
          toast.success(data?.message);
         
        } else {
          toast.error("Failed to send Notification");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <Layout title={"Dashboard - Send  Email's"}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center">Compose and Send Notification</h1>
              <div className="m-1 w-75">
                <div className="mb-3">
                  <textarea
                    type="text"
                    value={message}
                    placeholder="write a Message"
                    className="form-control"
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={link}
                    placeholder="link "
                    className="form-control"
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={sendNotificationHandler}
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SendNotification;
