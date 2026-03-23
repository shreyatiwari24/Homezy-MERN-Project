
import Logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-orange-50 text-blue-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-5 gap-10">

          {/* Brand Info */}
          <div className="md:col-span-2 py-2">
            <div className="flex py-2 items-center gap-3 mb-4">
              <div className=" text-white w-auto h-15 flex items-center justify-center ">
                <img src={Logo} alt="logo" />
              </div> 
            </div>

            <p className="text-orange-500 mb-5 py-2">
              Your one-stop platform to book reliable home services anytime, anywhere.
            </p>

            <div className="space-y-2 text-sm">
              <p>📍 Delhi, India</p>
              <p>📞 +91 9999222777</p>
              <p>✉ support@homeezy.com</p>
            </div>
          </div>

          {/* Company */}
          <div >
            <h4 className="text-orange-500 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">About Us</li>
              {/* <li className="hover:text-orange-400 cursor-pointer">Careers</li> */}
              <li className="hover:text-orange-400 cursor-pointer">Blog</li>
              {/* <li className="hover:text-orange-400 cursor-pointer">Press</li> */}
              <li className="hover:text-orange-400 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h4 className="text-orange-500 font-semibold mb-4">Partnership</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">
                Become a Partner
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Partner Login
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Partner Support
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Success Stories
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-orange-500 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Safety Center
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                FAQs
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Service Status
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-blue-700 mt-12 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HomeEzy. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
