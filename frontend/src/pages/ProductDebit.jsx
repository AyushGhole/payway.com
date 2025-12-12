import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion";

import api from "../api/axios";
import { useSnackbar } from "notistack";
import Footer from "../components/Footer";
import RazorpayPay from "../components/RazorpayModal";

export default function ProductDebitCards({ user }) {
  const [current, setCurrent] = useState(0);
  // const { showLogin, setShowLogins, showSignup, setShowSignup } = useModal();
  const navigate = useNavigate();
  // Login/SignUp Request
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { setShowLogin } = useModal();
  // const [showModal, setShowModal] = useState(false);
  // const { isLogin, closeModal, setIsLogin } = useModal();
  const { showLogin, setShowLogins, showSignup, setShowSignup } = useModal();

  const { setShowLogin } = useModal();

  const { showModal, isLogin, closeModal, setIsLogin } = useModal();
  const { openLogin, openSignup } = useModal();
  // Razoropay state handling
  const [openRazorModal, setOpenRazorModal] = useState(false);

  // Snackbar message
  const { enqueueSnackbar } = useSnackbar();
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

      enqueueSnackbar(response.data.message || "Success!", {
        variant: "success",
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", username);
      }

      closeModal(); // close modal after success
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  // 2️⃣ Function to read userEmail from localStorage
  const getUserToken = () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        setShowModal(true); // update state
      } else {
        setShowModal(false);
        // Navigate if token exists
        user ? navigate(`/details/${user._id}`) : navigate("/details/checked");
      }
    } catch (err) {
      console.error("Error getting email from localStorage:", err);
    }
  };

  /* ---------------- FEATURE CARD COMPONENT ---------------- */
  function FeatureCard({ title, description, img, user, navigate }) {
    return (
      <div className="flex justify-center">
        <div className="bg-white w-[95%] md:w-[80%] lg:w-[65%] rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* IMAGE */}
            <img src={img} className="w-full h-full object-cover" alt="" />

            {/* TEXT + BTN */}
            <div className="md:col-span-2 p-6 flex flex-col justify-center space-y-3">
              <h3 className="text-2xl font-bold">{title}</h3>

              <p className="text-gray-700 text-lg">{description}</p>

              <button
                type="button"
                onClick={() => {
                  getUserToken();
                }}
                class
                className="px-6 py-2 cursor-pointer mt-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition flex items-center gap-2 w-fit">
                Apply
                <i className="fa-solid fa-hand-point-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // useEffects for handling the Razorpay Modal opening
  useEffect(() => {
    const openModal = () => setOpenRazorModal(true);
    window.addEventListener("open-razor-modal", openModal);
    return () => window.removeEventListener("open-razor-modal", openModal);
  }, []);

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50">
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
                  onClick={() => setShowModal(false)}
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

        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B0F24] text-white px-8 py-16">
          {/* Text */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Shop The World With Pay Way
            </h1>

            <p className="text-lg md:text-xl">
              To shop from millions of online stores around the world, activate
              your card for International Transactions.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 cursor-pointer py-2 border border-white hover:bg-white hover:text-black transition rounded-lg">
              Get Started
            </button>

            <p className="text-sm opacity-80">
              Link your International Card now 🔗
            </p>
          </div>

          {/* Video */}
          <div className="mt-8 md:mt-0">
            <iframe
              className="rounded-xl shadow-lg"
              width="480"
              height="280"
              src="https://www.youtube.com/embed/hxI0kZp_T-g?si=NXdrcenTfPmUQENe"
              title="Debit Card Features Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </div>
        </div>

        {/* FEATURES TITLE */}
        <h2 className="text-3xl font-bold text-center mt-16 mb-10">Features</h2>

        {/* FEATURE CARDS */}
        <div className="space-y-12 pb-16">
          {/* 1. Premium Debit Cards */}
          <FeatureCard
            title="Premium Debit Cards"
            description="Contactless Premium Debit Cards — tap and pay with safety and privacy."
            img="https://plus.unsplash.com/premium_photo-1681533650863-6a3cd8a77977?q=80&w=1429&auto=format&fit=crop"
            user={user}
            navigate={navigate}
          />

          {/* 2. Classic Debit Cards */}
          <FeatureCard
            title="Classic Debit Cards"
            description="Contactless Classic Debit Cards — tap and pay securely with daily limits up to ₹5,000."
            img="https://images.unsplash.com/photo-1537724326059-2ea20251b9c8?q=80&w=1476&auto=format&fit=crop"
            user={user}
            navigate={navigate}
          />

          {/* 3. International Debit Cards */}
          <FeatureCard
            title="International Debit Cards"
            description="Tap and pay anywhere in the world — fast, secure, and globally accepted."
            img="https://media.istockphoto.com/id/1497591487/photo/credit-cards-stacked-on-white-background.jpg?s=612x612&w=0&k=20&c=2i5DMpRT_-HqV4rS8mvLA1pkP059GkWar8HEqyXcDv4="
            user={user}
            navigate={navigate}
          />
        </div>
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
