import React from "react";
import Layout from ".././components/Layouts/Layout";


const AboutUs = () => {
  return (
    <Layout title="About Us">
      <div className="container">
        <h2 className="text-center mt-4">About Our E-commerce App</h2>
        <p className="text-center mb-5">
          Welcome to our e-commerce app, your one-stop destination for all your shopping needs. At our app, we strive to provide you with the best shopping experience possible.
        </p>

        <h4>Our Story</h4>
        <p>
          Our journey began with a simple idea: to create a platform where people can easily find and purchase high-quality products from the comfort of their homes. What started as a small team's passion has grown into a full-fledged e-commerce app with a diverse range of products and satisfied customers around the world.
        </p>

        <h4>Our Mission</h4>
        <p>
          Our mission is to connect people with the products they love. We're committed to offering a wide selection of products, exceptional customer service, and a seamless shopping experience. Whether you're looking for the latest fashion trends, home essentials, or unique gifts, we've got you covered.
        </p>

        <h4>Why Choose Us</h4>
        <p>
          There are plenty of reasons to choose our e-commerce app. From our curated product collection to our user-friendly interface, we've designed every aspect of our app with you in mind. We focus on quality, reliability, and affordability, ensuring that you get the best value for your money. Plus, our secure payment methods and reliable delivery ensure that your shopping experience is smooth and worry-free.
        </p>

        <h4>Contact Us</h4>
        <p>
          Have questions or feedback? We're here to help. Feel free to reach out to our customer support team at <strong>malikravel@gmail.com</strong>. We value your input and are always looking for ways to improve your experience.
        </p>
      </div>
    </Layout>
  );
};

export default AboutUs;

