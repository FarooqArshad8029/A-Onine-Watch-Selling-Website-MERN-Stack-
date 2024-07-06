import React, { useState, useEffect } from "react";
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
  MDBTypography,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPaperclip,
  faSmile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

import io from "socket.io-client"; // Import io from socket.io-client

import ReactScrollToBottom from "react-scroll-to-bottom";
import "./AdminMesseges.css";

export default function AdminMesseges() {
  const [showShow, setShowShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useAuth();

  const [currentUserId, setCurrentUserId] = useState(""); // Track the current user's ID
  const [messageInput, setMessageInput] = useState("");
  // const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]); // Track users and their messages
  const ENDPOINT = "http://localhost:8080/";

  const socket = io(ENDPOINT, {
    transports: ["websocket"],
    auth: {
      token: auth?.token, // Pass the JWT token here
    },
  });
  useEffect(() => {
    // setSocket(newSocket);
    // Emit an event to the server to join as an admin
    let adminName = auth?.user?.name;
    socket.emit("adminJoin", { adminName });

    // Listen for messages from the server
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      // Disconnect the socket when component unmounts
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    socket.on("userJoined", ({ user }) => {
      setUsers((prevUsers) => [...prevUsers, { name: user, messages: [] }]);
    });

    socket.on("userLeft", ({ user }) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.name !== user));
    });
  }, []);

  useEffect(() => {
    // Fetch the list of users from the server
    socket.emit("getUsers");

    // ... (other code)

    // Listen for the list of users from the server
    socket.on("usersList", (usersList) => {
      console.log("usersList in parametrt:", usersList);
      setUsers(usersList);
    });

    // ... (other code)
  }, [auth?.token]);

  const sendMessage = () => {
    // Emit a message to the server with the user ID
    if (messageInput.trim() !== "") {
      console.log("messageInput-sendMessage:", messageInput);
      const userId = auth?.user?._id;
      socket.emit("adminMessage", {
        userId,
        message: messageInput,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: messageInput, isAdmin: true },
      ]);
      // Update the user's last message in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId
            ? { ...user, messages: [...user.messages, messageInput] }
            : user
        )
      );
      setMessageInput("");
    }
  };

  const toggleShow = () => setShowShow(!showShow);

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#CDC4F9" }}>
      <MDBRow>
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
            <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
              <MDBCardBody className="">
                <MDBRow>
                  <MDBCol
                    md="6"
                    lg="5"
                    xl="4"
                    className="mb-4 mb-md-0 chat-card-body"
                  >
                    <div className="p-3">
                      {/* search user  */}
                      <MDBInputGroup className="rounded mb-3">
                        <input
                          className="form-control rounded border"
                          placeholder="Search"
                          type="search"
                        />
                        <span
                          className="input-group-text border-0"
                          id="search-addon"
                        >
                          <NavLink className=" ms-3 link-info  ">
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </NavLink>{" "}
                        </span>
                      </MDBInputGroup>

                      {/* <MDBTypography listUnStyled className="mb-0">
                        <li className="p-2 border-bottom">
                          <a
                            href="#!"
                            className="d-flex justify-content-between  "
                          >
                            <div className="d-flex flex-row">
                              <div>
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar"
                                  className="d-flex align-self-center me-3"
                                  width="60"
                                />
                                <span className="badge bg-success badge-dot"></span>
                              </div>
                              <div className="pt-1">
                                <p className="fw-bold mb-0">Marie Horwitz</p>
                                <p className="small text-muted">
                                  Hello, Are you there?
                                </p>
                              </div>
                            </div>
                            <div className="pt-1">
                              <p className="small text-muted mb-1">Just now</p>
                              <span className="badge bg-danger rounded-pill float-end">
                                3
                              </span>
                            </div>
                          </a>
                        </li>
                      </MDBTypography> */}
                      {/* List of user */}
                      <MDBTypography listUnStyled className="mb-0 border  ">
                        {users.map((user) => (
                          <li key={user.userId} className="p-2 border-bottom">
                            <a
                              href="#!"
                              className="d-flex justify-content-between"
                            >
                              <div className="d-flex flex-row">
                                <div>
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                    alt="avatar"
                                    className="d-flex align-self-center me-3"
                                    width="60"
                                  />
                                  {/* {user.unreadMessages > 0 && (
                                    <span className="badge bg-success badge-dot"></span>
                                  )} */}
                                </div>
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">{user.name}</p>
                                  {user.lastMessage.length > 0 ? (
                                    <p className="small text-muted">
                                      {user.lastMessage.slice(-1)[0]}
                                    </p>
                                  ) : (
                                    <p className="small text-muted">
                                      No messages yet
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-muted mb-1">
                                  {user.lastMessageTime}
                                </p>
                                {/* {user.unreadMessages > 0 && (
                                  <span className="badge bg-danger rounded-pill float-end">
                                    {user.unreadMessages}
                                  </span>
                                )} */}
                              </div>
                            </a>
                          </li>
                        ))}
                      </MDBTypography>
                    </div>
                  </MDBCol>
                  {/* show users messeges here */}
                  <MDBCol md="6" lg="7" xl="8" className="chat-card-body  ">
                    <div className="d-flex flex-row justify-content-end">
                      <div>
                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                          Ut enim ad minima veniam, quis nostrum exercitationem
                          ullam corporis suscipit laboriosam, nisi ut aliquid ex
                          ea commodi consequatur?
                        </p>
                        <p className="small me-3 mb-3 rounded-3 text-muted">
                          12:00 PM | Aug 13
                        </p>
                      </div>
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                        alt="avatar 1"
                        style={{ width: "45px", height: "100%" }}
                      />
                    </div>

                    {messages.map((msg, index) => (
                      <div
                        className={`d-flex flex-row justify-content-${
                          msg.isAdmin ? "end" : "start"
                        }`}
                      >
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                          alt="avatar 1"
                          style={{ width: "45px", height: "100%" }}
                        />
                        <div>
                          <p
                            // className="small p-2 ms-3 mb-1 rounded-3"
                            className={`small p-2 ${
                              msg.isAdmin
                                ? "ms-3 rounded-3  text-white"
                                : "me-3 rounded-3"
                            } ${msg.isAdmin ? "bg-info" : "bg-light"}`}
                            style={{ backgroundColor: "#f5f6f7" }}
                          >
                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing */}
                            . {msg.message}
                          </p>
                          <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                            12:00 PM | Aug 13
                          </p>
                        </div>
                      </div>
                    ))}
                    {/* <div className="text-muted d-flex  justify-content-start align-items-center pe-3 pt-3 mt-2"> */}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
              <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 3"
                  style={{ width: "40px", height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg border"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <NavLink className=" ms-3 link-info  " onClick={sendMessage}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </NavLink>
                {/* </div> */}
              </MDBCardFooter>
            </MDBCard>
          </MDBCollapse>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
