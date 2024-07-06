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
import axios from "axios";

import io from "socket.io-client"; // Import io from socket.io-client

import ReactScrollToBottom from "react-scroll-to-bottom";
import "./AdminMesseges.css";

export default function AdminMesseges() {
  const [showShow, setShowShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [auth, setAuth] = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState({});

  const [currentChatedUserId, setcurrentChatedUserId] = useState(null); // Track the current user's ID
  const [messageInput, setMessageInput] = useState("");
  // const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]); // Track users and their messages
  const ENDPOINT = "http://localhost:8080/";

  const socket = io(ENDPOINT, {
    transports: ["websocket"],
    auth: {
      token: auth?.token, // Pass the JWT token here
    },
  });

  useEffect(() => {
    let adminName = auth?.user?.name;
    let adminId = auth?.user?._ID;
    socket.emit("adminJoin", { adminName, adminId });

    socket.on("recieveSendedUserMessage", ({ message, userId }) => {
      if (userId === currentChatedUserId) {
        setUserMessages((prevMessages) => ({
          ...prevMessages,
          [userId]: [
            ...(prevMessages[userId] || []),
            { message, isAdmin: false },
          ],
        }));
        setMessages((prevMessages) => [
          ...prevMessages,
          { userId, message, isAdmin: false },
        ]);
      } else {
        // Find the user with the matching userId in the userList
        const updatedUserList = userList.map((user) => {
          if (user.userId === userId) {
            return {
              ...user,
              allMessages: [
                ...(user.allMessages || []),
                { message, isAdmin: false },
              ],
            };
          } else {
            return user;
          }
        });
        setUserList(updatedUserList);
        socket.on("updateUserList", () => {
          socket.emit("getUsers");
        });
      }
    });

    socket.on("usersList", (updatedUserList) => {
      setUserList(updatedUserList);
    });

    socket.emit("getUsers");

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userMessages, messages]);

  useEffect(() => {
    socket.on("userJoined", ({ user }) => {
      setUserList((prevUsers) => [...prevUsers, { name: user, messages: [] }]);
    });

    socket.on("userLeft", ({ user }) => {
      setUserList((prevUsers) => prevUsers.filter((u) => u.name !== user));
    });
  }, []);

  useEffect(() => {
    socket.emit("getUsers");
    socket.on("usersList", (usersList) => {
      console.log("usersList in parametrt:", usersList);
      setUserList(usersList);
      socket.on("updateUserList", () => {
        socket.emit("getUsers");
      });
    });

    // ... (other code)
  }, [auth?.token,userMessages, messages]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      console.log("messageInput-sendMessage:", messageInput);
      console.log("userMessages useState in sendMessage fun:", userMessages);
      const userMessageId = userMessages[currentChatedUserId][0]?.id; // Get the user's message ID

      socket.emit("OnSendingAdminMessage", {
        userId: currentChatedUserId,
        message: messageInput,
        adminId: auth?.user?._id,
        userMessageId,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId: currentChatedUserId, message: messageInput, isAdmin: true },
      ]);
      console.log("messeges after set:", messages);
      setUserList((prevUsers) =>
        prevUsers.map((user) => {
          if (user.userId === currentChatedUserId) {
            return {
              ...user,
              allMessages: [
                ...user.allMessages,
                { message: messageInput, isAdmin: true },
              ],
            };
          } else {
            return user;
          }
        })
      );
      setMessageInput("");
    }
  };

  const toggleShow = () => setShowShow(!showShow);
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setcurrentChatedUserId(user.userId);
    setMessageInput("");
    setMessages([]);

    if (!userMessages[user.userId]) {
      fetchUserMessages(user.userId);
    }
  };

  const fetchUserMessages = async (userId) => {
    const response = await axios.get(`/get-user-chat/${userId}`);
    setUserMessages({
      ...userMessages,
      [userId]: response.data, // Assuming data is an array of messages for the user
    });
  };

  useEffect(() => {
    console.log("selectedUser:", selectedUser);
  }, [selectedUser]);

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

                      {/* List of user */}
                      <MDBTypography listUnStyled className="mb-0 border  ">
                        {userList.map((user) => (
                          <li
                            key={user.userId}
                            onClick={() => handleUserClick(user)}
                            className={` p-2 border-bottom  ${
                              selectedUser === user ? "bg-primary" : ""
                            }`}
                          >
                            <NavLink
                              to=""
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
                                  {user.lastMessage ? (
                                    <p className="small text-muted">
                                      {user.lastMessage}
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
                            </NavLink>
                          </li>
                        ))}
                      </MDBTypography>
                    </div>
                  </MDBCol>
                  {/* show users messeges here */}
                  <MDBCol md="6" lg="7" xl="8" className="chat-card-body  ">
                    <div className="">
                      {selectedUser ? (
                        <div>
                          {selectedUser.allMessages ? (
                            selectedUser.allMessages.map((msg, index) => (
                              // console.log(
                              //   "msg in  selectedUser.allMessages.map( :",
                              //   msg
                              // ),
                              <div
                                className={`d-flex flex-row justify-content-${
                                  msg.isAdmin ? "end" : "start"
                                }`}
                                key={index}
                              >
                                <img
                                  src={
                                    msg.isAdmin
                                      ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                      : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  }
                                  alt="avatar"
                                  style={{ width: "45px", height: "100%" }}
                                />
                                <div>
                                  <p
                                    className={`small p-2 ${
                                      msg.isAdmin
                                        ? "ms-3 rounded-3 text-white"
                                        : "me-3 rounded-3"
                                    } ${msg.isAdmin ? "bg-info" : "bg-light"}`}
                                    style={{
                                      backgroundColor: msg.isAdmin
                                        ? "#f5f6f7"
                                        : "#CDC4F9",
                                    }}
                                  >
                                    {msg.message}
                                  </p>
                                  <p
                                    className={`small ${
                                      msg.isAdmin ? "ms-3" : "me-3"
                                    } mb-3 rounded-3 text-muted float-${
                                      msg.isAdmin ? "end" : "start"
                                    }`}
                                  >
                                    12:00 PM | Aug 13
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center mt-5">
                              <p className="text-muted">
                                No messages from this user.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center mt-5">
                          <p className="text-muted">
                            Select a user to start chatting.
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedUser ? (
                      messages
                        .filter((msg) => msg.userId === selectedUser.userId)
                        .map((msg, index) => (
                          <div
                            className={`d-flex flex-row justify-content-${
                              msg.isAdmin ? "end" : "start"
                            }`}
                            key={index}
                          >
                            <img
                              src={
                                msg.isAdmin
                                  ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                  : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                              }
                              alt="avatar"
                              style={{ width: "45px", height: "100%" }}
                            />
                            <div>
                              <p
                                className={`small p-2 ${
                                  msg.isAdmin
                                    ? "ms-3 rounded-3 text-white"
                                    : "me-3 rounded-3"
                                } ${msg.isAdmin ? "bg-info" : "bg-light"}`}
                                style={{
                                  backgroundColor: msg.isAdmin
                                    ? "#f5f6f7"
                                    : "#CDC4F9",
                                }}
                              >
                                {msg.message}
                              </p>
                              <p
                                className={`small ${
                                  msg.isAdmin ? "ms-3" : "me-3"
                                } mb-3 rounded-3 text-muted float-${
                                  msg.isAdmin ? "end" : "start"
                                }`}
                              >
                                12:00 PM | Aug 13
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <></>
                    )}
                    {/* <div className="text-muted d-flex  justify-content-start align-items-center pe-3 pt-3 mt-2"> */}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
              {selectedUser ? (
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
                </MDBCardFooter>
              ) : (
                <></>
              )}
            </MDBCard>
          </MDBCollapse>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
