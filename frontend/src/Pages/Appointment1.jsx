import React from "react";
import Hero from "../components/Hero";
import NewAppo1 from "../components/NewAppo1";

const Appointment1 = () => {
  return (
    <>
      <Hero
        title={"Schedule Your Appointment | ZeeCare Medical Institute"}
        imageUrl={"/signin.png"}
      />
      <NewAppo1/>
    </>
  );
};

export default Appointment1;
