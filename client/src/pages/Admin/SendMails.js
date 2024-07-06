import React, { useState } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const SendMails = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const sendEmailHandler = async (e) => {
    console.log("sendEmailHandler:");
    e.preventDefault();
    try {
      if(!subject){
        toast.error("please Enter subject! ");
      }else if(!message){
        toast.error("Message can not be empty! ");
      }
      else{
        const requestData = {
          subject,
          message,
        };
           console.log("emailData:",requestData)
        const { data } = await axios.post("/send-mail", requestData);
        if (data?.success) {
          toast.success(data?.message);
          setSubject("");
          setMessage("");
        } else {
          toast.error("Failed to send emails");
        }
      } 
      }
      catch (error) {
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
              <h1 className="text-center">
                Compose and Send Promotional Email
              </h1>
              <div className="m-1 w-75">
                <div className="mb-3">
                  <input
                    type="text"
                    value={subject}
                    placeholder="Subject "
                    className="form-control"
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
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
                  <button
                    className="btn btn-primary"
                    onClick={sendEmailHandler}
                  >
                    Send Email
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

export default SendMails;
