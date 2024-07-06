import React from "react";
import Layout from ".././components/Layouts/Layout";
const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <div className="container">
        <h2 className="text-center mt-4">Privacy Policy</h2>
        <p className="text-center mb-5">
          This Privacy Policy outlines how we collect, use, and protect your personal information when you use our e-commerce app.
        </p>

        <h4>Information We Collect</h4>
        <p>
          We collect various types of information when you use our app, including personal information you provide during registration and browsing data such as IP addresses and browser details. We use this information to improve your experience, process orders, and enhance our services.
        </p>

        <h4>How We Use Your Information</h4>
        <p>
          Your information is used to personalize your experience, process orders, provide customer support, and send you relevant updates and promotions. We may share certain information with trusted partners and service providers who assist in operating our app.
        </p>

        <h4>Security Measures</h4>
        <p>
          We prioritize the security of your personal information and employ industry-standard measures to protect it. However, please note that no method of transmission over the internet or electronic storage is completely secure.
        </p>

        <h4>Your Choices</h4>
        <p>
          You have the right to access, modify, or delete your personal information. You can also choose to opt out of marketing communications and cookies. Please review your account settings for these options.
        </p>

        <h4>Third-Party Links</h4>
        <p>
          Our app may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites. We recommend reviewing their privacy policies before providing any personal information.
        </p>

        <h4>Children's Privacy</h4>
        <p>
          Our app is not intended for use by children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us immediately.
        </p>

        <h4>Changes to This Policy</h4>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices. When we make updates, the revised policy will be posted on our app with the updated date.
        </p>

        <h4>Contact Us</h4>
        <p>
          If you have questions about this Privacy Policy, please contact us at <strong>privacy@example.com</strong>. Your privacy matters to us, and we're here to address any concerns you may have.
        </p>
      </div>
    </Layout>
  );
};


export default Policy;