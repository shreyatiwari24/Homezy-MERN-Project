import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LocationContext } from "../../context/LocationContext";

import Hero from "../HomePage/sections/Hero";
import AboutSection from "../HomePage/sections/AboutSection";
import ServicesSection from "../HomePage/sections/ServiceSection";
import FeaturesSection from "../HomePage/sections/FeaturesSection";

import CustomerLogin from "../public/CustomerLogin";
import LocationPopup from "../../components/location/LocationModal";

const Home = () => {

  const { user } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  const [showLogin, setShowLogin] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  useEffect(() => {

    if (!user) return;

    if (!location) {
      setShowLocationPopup(true);
    }

  }, [user, location]);

  return (
    <>
      <Hero openLogin={() => setShowLogin(true)} />

      <AboutSection />
      <ServicesSection />
      <FeaturesSection />

      {showLogin && (
        <CustomerLogin onClose={() => setShowLogin(false)} />
      )}

      {showLocationPopup && (
        <LocationPopup close={() => setShowLocationPopup(false)} />
      )}
    </>
  );
};

export default Home;
