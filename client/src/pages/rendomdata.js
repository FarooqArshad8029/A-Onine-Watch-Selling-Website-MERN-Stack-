import React, { useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPaperclip,
  faSmile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const MessegingPage = () => {
  const [showShow, setShowShow] = useState(false);

  const toggleShow = () => setShowShow(!showShow);

  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="8" lg="6" xl="4">
          <div className=" mdbtn">
            <MDBBtn
              onClick={toggleShow}
              color="info"
              className="position-absolute bottom-0 end-0 m-4"
              size="lg"
              block
            >
              <div class="d-flex justify-content-between align-items-center">
                <span>Let's Chat </span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </MDBBtn>
          </div>

          <MDBCollapse show={showShow} className="mt-3">
            <MDBCard id="chat4">
              <div className=" border d-flex flex-row justify-content-right">
                <a className="ms-3 link-info" href="#!">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </a>
              </div>

              <MDBCardBody className="chat-card-body">
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                  <div>
                    <p
                      className="small p-2 ms-3 mb-1 rounded-3"
                      style={{ backgroundColor: "#f5f6f7" }}
                    >
                      Hi
                    </p>

                    <p className="small ms-3 mb-3 rounded-3 text-muted">
                      23:58
                    </p>
                  </div>
                </div>

                <div className="divider d-flex align-items-center mb-4">
                  <p
                    className="text-center mx-3 mb-0"
                    style={{ color: "#a2aab7" }}
                  >
                    Today
                  </p>
                </div>

                <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-info">
                      Hiii, I'm good.
                    </p>
                    <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                      00:06
                    </p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                </div>
              </MDBCardBody>

              <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                  alt="avatar 3"
                  style={{ width: "45px", height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput3"
                  placeholder="Type message"
                />
                {/* <a className="ms-1 text-muted" href="#!">
                  <FontAwesomeIcon icon={faPaperclip} />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <FontAwesomeIcon icon={faSmile} />
                </a> */}
                <a className="ms-3 link-info" href="#!">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </a>
              </MDBCardFooter>

            </MDBCard>
          </MDBCollapse>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
export default MessegingPage;

















/* #chat4 .form-control {
    border-color: transparent;
  } */
  
  /* #chat4 .form-control:focus {
    border-color: transparent;
    box-shadow: inset 0px 0px 0px 1px transparent;
  } */
/*   
  .divider:after,
  .divider:before {
    content: "";
    flex: 0;
    height: 1px;
    background: #eee;
  } */

/*  mdscroller */
  /* .chat-card-body {
    position: relative;
    height: 300px;
    overflow-y: auto;
  } */
  
/* to show masg window in bottom right */
/* 
*/
#chat4 {
  position: fixed;
  bottom: 150px; /* Adjust the distance from the bottom as needed */
  right: 5px; /* Adjust the distance from the right as needed */
  width: 300px; /* Adjust the width as needed */
  z-index: 9999; /* Ensure the messaging window appears above other content */
}
.mdbtn{
position: relative;

}
/* 
 */
 /* Styles for the messaging window */

