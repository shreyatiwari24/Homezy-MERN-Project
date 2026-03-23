import { useNavigate } from "react-router-dom";
import { Briefcase, LogIn } from "lucide-react";

const FeaturesSection = () => {

  const navigate = useNavigate();

  return (

    <section className="py-20 bg-gradient-to-r from-orange-200 to-white">

      <div className="max-w-6xl mx-auto px-6">

        {/* Content Card */}

        <div className="bg-white rounded-3xl shadow-xl text-center px-8 py-14">

          {/* Tag */}

          <span className="inline-block mb-4 px-5 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-600">
            Partner With Us
          </span>

          {/* Heading */}

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Grow Your Service Business With Us
          </h2>

          {/* Description */}

          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Join our trusted network of professionals and get access to
            customers, secure bookings, and tools that help your business
            grow faster.
          </p>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row justify-center gap-6">

            <button
              onClick={() => navigate("/provider/signup")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition shadow-md"
            >
              <Briefcase size={18} />
              Join as a Service Provider
            </button>

            <button
              onClick={() => navigate("/provider/login")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              <LogIn size={18} />
              Login as Service Provider
            </button>

          </div>

          {/* Footer Note */}

          <p className="mt-10 text-gray-500">
            Expand your reach, connect with customers, and build a
            successful service business.
          </p>

        </div>

      </div>

    </section>

  );
};

export default FeaturesSection;
