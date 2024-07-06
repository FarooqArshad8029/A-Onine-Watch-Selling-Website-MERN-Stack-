import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPaperclip,
  faSmile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBCardFooter,
  MDBCollapse,
} from "mdb-react-ui-kit";
import "../Styles/MessegingPage.css";
import { io } from "socket.io-client"; // Import io from socket.io-client

export default function MessegingPage() {
  const [showShow, setShowShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [recieveMsg, setRecieveMsg] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const [auth, setAuth] = useAuth();
  const [id, setId] = useState("");
  const toggleShow = () => setShowShow(!showShow);
  const ENDPOINT = "http://localhost:8080/";
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchChatMessages() {
      try {
        const response = await axios.get(`/messages/${auth?.user?._id}`);
        setChatMessages(response.data);
        console.log("user chat frm db response.data :", response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    }
    if (auth?.user) {
      fetchChatMessages();
    }
  }, [auth.user]);

  const send = () => {
    if (msg.trim() !== "") {
      console.log("Send:", msg);

      socket.emit("message", {
        message: msg,
        socketId: id,
        userId: auth?.user?._id,
        isAdmin: false,
      });
      setMsg("");
    }
  };
  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Add leading zeros to single-digit hours and minutes
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  console.log("msg:", msg);
  console.log("recieveMsg:", recieveMsg);

  useEffect(() => {
    // socket = io(ENDPOINT, { transports: ["websocket"] });
    if (auth.token) {
      const newSocket = io(ENDPOINT, {
        transports: ["websocket"],
        auth: {
          token: auth?.token, // Pass the JWT token here
        },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("socket connected:", newSocket.id);
        setId(newSocket.id);
      });

      let userName = auth?.user?.name;
      newSocket.emit("joined", { userName });

      newSocket.on("welcome", (data) => {
        setRecieveMsg((prevMessages) => [...prevMessages, data]);

        console.log("welcome:", data.user, data.message);
      });

      // newSocket.on("leave", (data) => {
      //   console.log(data.user, "left the chat");
      //   setRecieveMsg((prevMessages) => [...prevMessages, data]);

      //   console.log("leave:", data.user, data.message);
      // });
      newSocket.on("sendMessage", (data) => {
        console.log("sendMessage:", data);
        setRecieveMsg((prevMessages) => [...prevMessages, data]);
        console.log(
          "Received message from",
          data.user,
          ":",
          data.message,
          ":",
          data.socketId,
          ":",
          data.userId
        );
      });

      setSocket(newSocket);
      return () => {
        if (socket) {
          socket.emit("userDisconnect");
          socket.disconnect();

          socket.off();
        }
      };
    }
  }, []);

  return (
    <MDBContainer className="">
      <MDBRow className="d-flex justify-content-center ">
        <MDBCol md="8" lg="6" xl="4">
          <MDBBtn
            onClick={toggleShow}
            className="  bottom-0 end-0 m-1 mdbtn "
            color="info"
            size="lg"
            block
          >
            <div class="d-flex justify-content-between align-items-center">
              <span>Let's Chat </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                flip={!showShow ? "vertical" : ""}
              />
            </div>
          </MDBBtn>
          <MDBCollapse show={showShow} className="mt-3">
            <MDBCard id="chat4">
              <MDBCardBody className="chat-card-body">
                {chatMessages.concat(recieveMsg).map((message, index) => (
                  <div
                    key={index}
                    className={`d-flex flex-row justify-content-${
                      message.isAdmin ? "start" : "end"
                    }`}
                  >
                    {message.isAdmin ? (
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp" // Replace with admin avatar URL
                        alt="Admin Avatar"
                        style={{ width: "45px", height: "100%" }}
                      />
                    ) : (
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" // Replace with user avatar URL
                        alt="User Avatar"
                        style={{ width: "45px", height: "100%" }}
                      />
                    )}
                    <div>
                      {message.isAdmin ? (
                        <p
                          className={`small p-2 ms-3 mb-1 rounded-3 ${
                            message.isAdmin ? "bg-info" : "bg-light"
                          }`}
                        >
                          {message.message}
                        </p>
                      ) : (
                        <p
                          className={`small p-2 ms-3 mb-1 rounded-3 ${
                            message.isAdmin ? "bg-info" : "bg-light"
                          }`}
                        >
                          {message.message}
                        </p>
                      )}
                      <p className="small ms-3 mb-3 rounded-3 text-muted">
                        {formatTime(new Date())}
                      </p>
                    </div>
                  </div>
                ))}
              </MDBCardBody>

              {/* </MDBScrollbar> */}
              <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" // Replace with user avatar URL
                  alt="avatar 2"
                  style={{ width: "45px", height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput3"
                  placeholder="Type message"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <NavLink onClick={send} className=" ms-3 link-info  ">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </NavLink>
              </MDBCardFooter>
            </MDBCard>
          </MDBCollapse>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
