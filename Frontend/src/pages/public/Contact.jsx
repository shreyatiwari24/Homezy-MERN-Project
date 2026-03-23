import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

const Contact = () => {

  return (
    <main className="pt-[100px] bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="text-center py-16 px-6">

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-gray-900"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600"
        >
          We're here to help you with bookings,
          support and service inquiries.
        </motion.p>

      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-12">

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-2xl shadow-lg"
        >

          <h2 className="text-2xl font-bold mb-6">
            Send us a Message
          </h2>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              Send Message
            </motion.button>

          </form>

        </motion.div>

        {/* CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >

          {/* Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow flex gap-4"
          >
            <Phone className="text-orange-500" size={30} />

            <div>
              <h3 className="font-semibold">
                Phone
              </h3>
              <p className="text-gray-600">
                +91 9876543210
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow flex gap-4"
          >
            <Mail className="text-orange-500" size={30} />

            <div>
              <h3 className="font-semibold">
                Email
              </h3>
              <p className="text-gray-600">
                support@yourservice.com
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow flex gap-4"
          >
            <MapPin className="text-orange-500" size={30} />

            <div>
              <h3 className="font-semibold">
                Office
              </h3>
              <p className="text-gray-600">
                New Delhi, India
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow flex gap-4"
          >
            <Clock className="text-orange-500" size={30} />

            <div>
              <h3 className="font-semibold">
                Working Hours
              </h3>
              <p className="text-gray-600">
                Mon - Sat : 9 AM - 8 PM
              </p>
            </div>
          </motion.div>

        </motion.div>

      </section>

      {/* MAP SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-6 pb-20"
      >

        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg">

          <iframe
            title="map"
            src="https://www.google.com/maps?q=Delhi&output=embed"
            className="w-full h-[400px] border-0"
          ></iframe>

        </div>

      </motion.section>

    </main>
  );
};

export default Contact;
