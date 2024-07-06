import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="footer border-light-grey ">
        <h3 className="text-center ">
          All Right Reserved &copy; Farooq Arshad
        </h3>
        <p className="text-center mt-3">
          <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
          <Link to="/policy">Privacy Policy</Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
