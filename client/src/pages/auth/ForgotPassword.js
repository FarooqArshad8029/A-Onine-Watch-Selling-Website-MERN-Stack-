import React, { useState } from "react";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [otpForm, setNewForm] = useState(true);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // form function
  const otpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/sendOtp", {
        email,
      });
      setLoading(false);

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setNewForm(false);
        // setTimeout(() => {
        //     navigate("/login");
        //    }, 2000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong! plz try Again latter.");
    }
  };
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      if (newPassword === confirmNewPassword) {
        if (confirmNewPassword.length < 8) {
          toast.error("Password Must be 8 Digits Long");
        } else {
          setLoading(true); // Set loading to false after data is fetched

          const res = await axios.post("/resetPassword", {
            email,
            otp,
            newPassword,
            confirmNewPassword,
          });
          setLoading(false); // Set loading to false after data is fetched

          if (res && res.data.success) {
            toast.success(res.data && res.data.message);
            setNewForm(false);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            toast.error(res.data && res.data.message);
          }
        }
      } else {
        toast.error("Password Must be Same And 8 Digits Long");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Layout title={"Forgot Password - Ecommerce APP"}>
        <div className="form-container ">
          {otpForm ? (
            <form onSubmit={otpHandler}>
              <h4 className="title">RESET PASSWORD</h4>
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Email "
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPasswordHandler}>
              <h4 className="title">RESET PASSWORD</h4>
              <div className="mb-3">
                <input
                  type="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control"
                  id="exampleInputOtp1"
                  placeholder="Enter Your OTP "
                  required
                />
                <input
                  type="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  id="exampleInputnewPassword1"
                  placeholder="Enter New Passowrd "
                  required
                />
                <input
                  type="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="form-control"
                  id="exampleInputconfirmNewPassword1"
                  placeholder="Confirm Your Password "
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Password"}
              </button>
            </form>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ForgotPasssword;
