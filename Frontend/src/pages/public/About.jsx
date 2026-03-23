import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AboutImg from "../../assets/about.png";
import {
  ShieldCheck,
  Clock,
  Wallet,
} from "lucide-react";

const About = () => {

  const navigate = useNavigate();

  return (

    // ✅ navbar safe spacing
    <main className="bg-gray-50 min-h-screen pt-[100px]">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-2 gap-14 items-center">

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Making Home Services
            <span className="text-orange-500">
              {" "}Simple & Trusted
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            We connect customers with verified professionals
            for cleaning, repair, painting, and maintenance
            services right at your doorstep.
          </p>

          <p className="mt-4 text-gray-600">
            Our goal is to remove the stress of finding
            reliable service experts by providing a fast,
            secure and transparent booking experience.
          </p>

          <button
            onClick={() => navigate("/categories")}
            className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full font-semibold transition"
          >
            Explore Services
          </button>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={AboutImg}
            alt="About us"
            className="rounded-2xl shadow-2xl w-full object-cover"
          />
        </motion.div>

      </section>

      {/* STORY */}
      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold text-gray-900">
            Our Story
          </h2>

          <p className="mt-8 text-gray-600 leading-relaxed">
            Our platform started with a simple mission —
            helping people easily access trusted home
            services without wasting time searching or
            worrying about quality. Today, thousands of
            customers rely on our verified professionals
            every day.
          </p>

        </div>

      </section>

      {/* WHY CHOOSE */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <ShieldCheck
                size={40}
                className="text-orange-500 mb-4"
              />

              <h3 className="text-xl font-semibold mb-3">
                Verified Professionals
              </h3>

              <p className="text-gray-600">
                Background checked experts ensuring safe
                and reliable service every time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <Clock
                size={40}
                className="text-orange-500 mb-4"
              />

              <h3 className="text-xl font-semibold mb-3">
                Quick Booking
              </h3>

              <p className="text-gray-600">
                Book trusted services within minutes
                using our seamless platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">

              <Wallet
                size={40}
                className="text-orange-500 mb-4"
              />

              <h3 className="text-xl font-semibold mb-3">
                Transparent Pricing
              </h3>

              <p className="text-gray-600">
                No hidden costs — clear pricing before
                confirming your booking.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="bg-orange-500 text-white py-20">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>
            <h3 className="text-4xl font-bold">10K+</h3>
            <p className="mt-2">Customers Served</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="mt-2">Experts</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">25+</h3>
            <p className="mt-2">Cities</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">4.8★</h3>
            <p className="mt-2">Rating</p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-20 text-center">

        <h2 className="text-4xl font-bold">
          Ready to Book a Service?
        </h2>

        <p className="mt-4 text-gray-600">
          Trusted professionals are just one click away.
        </p>

        <button
          onClick={() => navigate("/categories")}
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-9 py-3 rounded-full font-semibold"
        >
          Book Now
        </button>

      </section>

    </main>
  );
};

export default About;