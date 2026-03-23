import aboutImg from "../../../assets/aboutus.jpg";

const AboutSection = () => {
  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-10xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-14 grid md:grid-cols-2 gap-12 items-center">

          {/* Image Side */}
          <div className="relative">
            <img
              src={aboutImg} // replace with your image
              alt="Moving Company"
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Experience Badge */}
            <div className="absolute top-1 left-[-4] bg-orange-500 text-white w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg">
              <span className="text-xl font-bold leading-none">Trusted &</span>
              <span className="text-xl font-bold"> Verified</span>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <p className="text-orange-500 font-semibold tracking-wide mb-2">
              WHO WE ARE
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Your Trusted Platform for Home Services
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              We connect customers with verified professionals for a wide range of home services, ensuring safe, reliable, and hassle-free service experiences every time. Trusted by thousands of happy customers across
              the country.
            </p>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-8 mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                  🚚
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Services Across Your City
                  </h4>
                  <p className="text-sm text-gray-600">
                    Services available across multiple locations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                  ✔
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Verified & Trusted Experts
                  </h4>
                  <p className="text-sm text-gray-600">
                    Skilled professionals ensuring quality service.
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button 
             className="px-7 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition">
              More About Us
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
export default AboutSection;
