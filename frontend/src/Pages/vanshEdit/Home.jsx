import React, { useContext } from "react";
import Hero from "../../components/Hero";
import Biography from "../../components/Biography";
import MessageForm from "../../components/MessageForm";
import Departments from "../../components/Departments";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import Chatbot from '../../components/vansh/Chatbot';  // Import the Chatbot component

const Home = () => {
  return (
    <>
      <Navbar /> 
      <Chatbot/>
      <Hero
        title={
          "Welcome to Med-Chain | Your Trusted Healthcare Provider"
        }
        imageUrl={"/hero.png"}
      />
      <Biography imageUrl={"/about.png"} />
      <Departments />
      <MessageForm />
      <Footer />
    </>
  );
};

export default Home;
