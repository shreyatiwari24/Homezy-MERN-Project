import heroImg from "../../../assets/hero.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { LocationContext } from "../../../context/LocationContext";
import { toast } from "react-hot-toast";

const Hero = ({ openLogin, openLocation }) => {

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  const handleBookNow = () => {

    if (!user) {
      openLogin();
      return;
    }

    if (!user.roles?.includes("customer")) {
      toast.error("Only customers can book services");
      return;
    }

    navigate("/categories");

  };

  return (

    <div className="relative w-full min-h-[90vh] flex items-center justify-center">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Service"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 px-10 md:px-20 text-white max-w-3xl text-center">

        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Book Trusted Home Services in Minutes
        </h2>

        <p className="mt-6 text-lg text-gray-200">
          Professional movers, cleaners, and repair experts at your doorstep.
        </p>

        {/* LOCATION STATUS */}
        {user && location && (
          <p className="mt-4 text-orange-400 text-sm">
            📍 Delivering to {location.area}, {location.city}
          </p>
        )}


        <button
          onClick={handleBookNow}
          className="mt-8 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold transition"
        >
          Book Service Now
        </button>

      </div>

      {/* FLOATING CARD */}
      <div className="absolute bottom-[-70px] left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] bg-white rounded-xl shadow-2xl p-6 z-20">

        <div className="grid md:grid-cols-4 gap-4 items-center">

          <h3 className="text-xl font-bold text-gray-800">
            Check Service Availability
          </h3>

          <input
            type="text"
            placeholder="Zip / Postal Code"
            className="border p-3 rounded-md"
          />

          <input
            type="text"
            placeholder="City or Location"
            value={user && location ? location.city : ""}
            readOnly
            onClick={openLocation}
            className="border p-3 rounded-md cursor-pointer"
          />

          <button
            onClick={() => {
              if (!user) {
                openLogin();
                return;
              }
              openLocation();

              navigate("/services");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-md font-semibold"
          >
            Find Services
          </button>

        </div>

      </div>

    </div>
  );

};

export default Hero;
