import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";
import { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaAmazonPay,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { HiOutlineCreditCard } from "react-icons/hi";
import api from "../api/axios";
import { useSnackbar } from "notistack";
import Footer from "../components/Footer";
import RazorpayPay from "../components/RazorpayModal";

// Slider Images
const slides = [
  {
    img: "public/images/slide.avif",
    title: "Secure Payments & Smooth Banking",
    text: "Send money quickly and easily around the globe. More ways to pay, more places to shop.",
  },
  {
    img: "images/slide2.avif",
    title: "Grow Your Business Worldwide",
    text: "Accept payments instantly. Expand your reach with seamless global payment solutions.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const { showLogin, setShowLogins, showSignup, setShowSignup } = useModal();
  // const [showModal, setShowModal] = useState(false);

  // Razoropay state handling
  const [openRazorModal, setOpenRazorModal] = useState(false);

  const navigate = useNavigate();
  // Snackbar message
  const { enqueueSnackbar } = useSnackbar();

  // State to toggle between Login and SignUp
  // const [isLogin, setIsLogin] = useState(true);
  const { setShowLogin } = useModal();

  const { showModal, isLogin, closeModal, setIsLogin } = useModal();
  const { openLogin, openSignup } = useModal();
  // Auto Slide Every 4 Seconds
  // Auto Slide Every 5 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Login/SignUp Request
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // HandleSumit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match!", { variant: "error" });
      return;
    }

    try {
      const payload = isLogin
        ? { username, email, password }
        : { username, email, password };

      const url = isLogin ? "api/auth/login" : "api/auth/register";

      const response = await api.post(url, payload);

      console.log("response after login/singUp : ", response);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.status == 200) {
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userName", response.data.user.username);
        localStorage.setItem("user_id", response.data.user._id);
      }

      enqueueSnackbar(response.data.message || "Success!", {
        variant: "success",
      });

      setTimeout(() => {
        window.location.href = `/${response.data.user._id}/dashboard?reload=true`;
      }, 1000);

      // navigate(`/${response.data.user._id}/dashboard`);

      closeModal(); // close modal after success
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  // useEffects for handling the Razorpay Modal opening
  useEffect(() => {
    const openModal = () => setOpenRazorModal(true);
    window.addEventListener("open-razor-modal", openModal);
    return () => window.removeEventListener("open-razor-modal", openModal);
  }, []);

  return (
    <>
      <div className="w-full">
        {/* Login/SignUp Modal Form */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 overflow-y-auto backdrop-blur-sm flex justify-center items-start pb-5 pt-24 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}>
              <motion.div
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
                initial={{ y: -40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -40, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 transition text-xl">
                  ✕
                </button>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  {isLogin ? "Welcome Back" : "Create Your Account"}
                </h3>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium">
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-gray-600 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105">
                    {isLogin ? "Login" : "Sign Up"}
                  </button>
                </form>

                {/* Toggle Link */}
                <p className="mt-6 text-center text-gray-600 text-sm">
                  {isLogin
                    ? "Don’t have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    className="text-blue-600 cursor-pointer font-semibold hover:underline"
                    onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SLIDER */}
        <div className="relative w-full h-[80vh] overflow-hidden">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: current === index ? 1 : 0 }}
              transition={{ duration: 1 }}>
              <img src={slide.img} className="w-full h-full object-cover" />

              <div className="absolute inset-0  bg-opacity-50"></div>

              {current === index && (
                <motion.div
                  className="absolute inset-0 flex flex-col justify-center items-center text-center px-6"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}>
                  <h1 className="text-white text-4xl md:text-5xl font-bold">
                    {slide.title}
                  </h1>

                  <p className="text-gray-100 text-lg md:text-xl mt-4 max-w-2xl">
                    {slide.text}
                  </p>

                  <div className="mt-6 flex gap-4">
                    {!user ? (
                      <>
                        <button
                          onClick={openLogin}
                          className="px-6 py-3 cursor-pointer border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
                          Login
                        </button>

                        <button
                          onClick={openLogin}
                          className="px-6 py-3  cursor-pointer  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                          Get Started
                        </button>
                      </>
                    ) : (
                      <Link to="/dashboard">
                        <button
                          onClick={openLogin}
                          className="px-6 py-3  cursor-pointer  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                          Let's Begin
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-6 -translate-y-1/2 text-white text-4xl font-bold">
            ‹
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-6 -translate-y-1/2 text-white text-4xl font-bold">
            ›
          </button>
        </div>

        {/* Business Section */}
        <div className="bg-gray-50 py-12 text-center">
          <h3 className="text-2xl font-semibold">
            Looking for PayWay Business Solutions?
          </h3>
          <p className="text-gray-600 mt-2">
            Across regions and worldwide, we are here to support you.
          </p>

          {user && (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Let's Begin
            </button>
          )}

          <div className="mt-4">
            <button
              onClick={openSignup}
              className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
              PayWay for Business
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 py-16 px-6">
          <div className="shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
            <img
              src="/images/cardImg.jpg"
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold">
                The World is your shopping mall.
              </h3>
              <p className="text-gray-600 mt-2">
                Explore millions of stores globally with secure payments.
              </p>
              <Link
                to="/main/debitCard"
                className="mt-4 inline-block text-blue-600">
                Shop →
              </Link>
            </div>
          </div>

          <div className="shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
            <img
              src="/images/cardImg2.jpg"
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold">
                Pay with your preferred cards.
              </h3>
              <p className="text-gray-600 mt-2">
                Link your credit or debit card and effortlessly checkout.
              </p>
              <Link
                onClick={openLogin}
                className="mt-4 inline-block text-blue-600">
                Link Account →
              </Link>
            </div>
          </div>

          <div className="shadow-lg rounded-lg overflow-hidden hover:scale-105 transition">
            <img
              src="/images/cardImg3.jpg"
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold">
                Shop online with confidence.
              </h3>
              <p className="text-gray-600 mt-2">
                Experience secure and fast checkouts with PayWay.
              </p>
              <Link
                to="/main/creditCard"
                className="mt-4 inline-block text-blue-600">
                Learn More →
              </Link>
            </div>
          </div>
        </div>

        {/* Third Section */}
        <div className="w-full bg-[#16225c] py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 space-y-4">
            <h3 className="text-3xl text-white font-semibold text-gray-900 leading-snug">
              Make And Receive Payments With Your Comfort.
            </h3>

            <h3 className="text-3xl text-gray-400 font-semibold  leading-snug">
              Popular Payments, Happy Customers.
            </h3>

            <p className="text-gray-600 mt-2 text-lg">
              Help maximise conversion and reduce cart abandonment with a wide
              range of digital payment options — all customisable in one single
              account.
            </p>

            <h4 className="text-2xl font-semibold text-gray-400 mt-6">
              Invoice and get paid fast.
            </h4>

            <p className="text-gray-600 text-lg">
              Send unlimited invoices that customers can pay even if they don’t
              have an account – with Seller Protection from fraud and
              unauthorised transactions.
            </p>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 flex justify-center  mt-10 md:mt-0">
            <img
              src="/images/mobile.avif"
              alt="mobile"
              className="w-[320px] md:w-[450px] drop-shadow-xl rounded-xl"
            />
          </motion.div>
        </div>

        {/* Fourth Section */}
        <div className="bg-gray-50 py-16 px-6 md:px-20">
          <h2 className="text-4xl text-center font-bold text-gray-900 mb-12">
            PayWay by Numbers
          </h2>

          {/* Feature Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Row 1 */}
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-blue-900 text-5xl">
                <FaChalkboardTeacher />
              </motion.div>

              <h3 className="text-xl font-semibold leading-snug">
                500+M Active Accounts <sup>5</sup>
              </h3>
            </div>

            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-blue-900 text-5xl">
                <FaAmazonPay />
              </motion.div>

              <h3 className="text-xl font-semibold leading-snug">
                8B Total Payment Transactions <sup>8</sup>
              </h3>
            </div>

            {/* Row 2 */}
            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-blue-900 text-5xl">
                <FaMoneyCheckAlt />
              </motion.div>

              <h3 className="text-xl font-semibold leading-snug">
                80% Increase In User Confidence <sup>9</sup>
              </h3>
            </div>

            <div className="flex items-start gap-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-blue-900 text-5xl">
                <HiOutlineCreditCard />
              </motion.div>

              <h3 className="text-xl font-semibold leading-snug">
                $600+ Billion Total Volume of PayWay <sup>6</sup>
              </h3>
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <section className="py-12 px-4 text-center bg-white">
          <motion.h3
            className="text-2xl sm:text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            Shop From Top Brands
          </motion.h3>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 sm:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}>
            {[
              "/images/spotify-premium.png",
              "/images/asos.png",
              "/images/foodpanda.png",
              "/images/grab.png",
            ].map((brand, index) => (
              <motion.div
                key={index}
                className="flex justify-center items-center w-24 h-24 sm:w-32 sm:h-32 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}>
                <img
                  src={brand}
                  className="max-h-12 sm:max-h-16 object-contain"
                  alt="brand logo"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Join Section */}
        <section className="py-16 px-4  text-center bg-blue-50">
          <motion.h3
            className="text-2xl sm:text-3xl font-semibold max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            Join the global PayWay community sending and receiving money every
            day.
          </motion.h3>

          <motion.button
            className="px-8 py-3 mt-4 bg-blue-600 cursor-pointer text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            onClick={openSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}>
            Sign Up Now
          </motion.button>
        </section>
      </div>

      {/* Razorpay Modal  */}
      <RazorpayPay
        open={openRazorModal}
        onClose={() => setOpenRazorModal(false)}
      />

      <Footer />
    </>
  );
}
