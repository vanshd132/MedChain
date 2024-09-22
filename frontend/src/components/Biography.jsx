import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p className="text-lg font-semibold text-gray-700 mb-2">Biography</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h3>
          <p className="text-gray-600 mb-4 text-justify">
          Med Chain is a cutting-edge healthcare platform that streamlines patient management and access to medical services. It enables users to securely upload and update their medical records, keeping their health information current. The platform features an intelligent chatbot that provides instant information on hospitals, doctors, and their specialties. Additionally, an integrated appointment scheduling tool allows patients to easily book appointments with healthcare providers.</p>
          <p className="text-gray-600 mb-4 text-justify ">
            Our mission is to empower patients with control over their health data while providing healthcare providers with efficient and secure access to comprehensive patient records. By leveraging blockchain technology, we ensure data security, reduce inefficiencies, and facilitate better research and development in the healthcare sector. Our solutions also benefit insurance companies and developers, creating a more integrated and innovative healthcare ecosystem.
          </p>

        </div>
      </div>
    </>
  );
};

export default Biography;
