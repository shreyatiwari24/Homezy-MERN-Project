
import serviceImg from "../../../assets/service.png";

import { Wrench, Zap, Droplet, Paintbrush, Hammer, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Plumbing",
    description: "Professional plumbing repair and installation services.",
    icon: <Droplet size={28} />,
  },
  {
    title: "Electrical",
    description: "Safe and certified electrical solutions for your home.",
    icon: <Zap size={28} />,
  },
  {
    title: "Carpentry",
    description: "Custom furniture and woodwork services.",
    icon: <Hammer size={28} />,
  },
  {
    title: "Painting",
    description: "Interior & exterior painting with premium finish.",
    icon: <Paintbrush size={28} />,
  },
  {
    title: "Appliance Repair",
    description: "Quick repair services for all home appliances.",
    icon: <Wrench size={28} />,
  },
  {
    title: "Home Safety",
    description: "Security installations and safety inspections.",
    icon: <ShieldCheck size={28} />,
  },
];

const ServiceSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-orange-500">
            Our Home Services
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Trusted professionals delivering reliable home services with quality and care.
          </p>
        </div>

        {/* Main Layout: Left Cards + Right Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE - Service Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-400"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold text-blue-900 group-hover:text-orange-500 transition">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-gray-600 text-sm">
                  {service.description}
                </p>

                {/* Learn More */}
                <button className="mt-4 text-orange-500 font-medium hover:underline">
                  Learn More →
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="relative flex justify-center items-center">

            <img
              src={serviceImg} // replace with your image
              alt="Home Services"
              className="w-full max-w-md h-full object-contain"
            />

            {/* Soft Orange Glow Behind */}
            <div className="absolute w-72 h-72 bg-orange-400/30 rounded-full blur-3xl -z-10"></div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
