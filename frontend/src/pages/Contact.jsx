import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const Contact = ({ currUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    enqueueSnackbar("We will get in touch with you within 15 days!", {
      variant: "success",
    });

    setForm({ name: "", email: "", message: "" });

    // setTimeout(() => {
    //   navigate(`/${currUser}/dashboard`);
    // }, 1200);
  };

  return (
    <div className="flex justify-center items-start py-12 px-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar currUser={currUser} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
        }}
        className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="font-semibold">Your Name</label>
            <input
              type="text"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Your Email</label>
            <input
              type="email"
              required
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="font-semibold">Message</label>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full mt-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"></textarea>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;

function tryUseAuth() {
  // Try to require/use your context if present. This is optional and safe fallback.
  try {
    // eslint-disable-next-line global-require
    const auth = require("../context/authContext");
    if (auth && typeof auth.useAuth === "function") {
      return auth.useAuth();
    }
  } catch (e) {
    // ignore - fallback to localStorage
  }
  return null;
}

const Sidebar = ({ currUser }) => {
  const id = currUser?._id;
  const { enqueueSnackbar } = useSnackbar();
  const auth = tryUseAuth();
  const ctxUser = auth ? auth.user : null;
  const ctxLogout = auth ? auth.logout : null;
  const user_id = localStorage.getItem("user_id");
  // If auth context changes later, keep in sync
  useEffect(() => {
    if (ctxUser && ctxUser !== user) setUser(ctxUser);
  }, [ctxUser]);

  const logout = () => {
    if (ctxLogout) {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("user_id");
      ctxLogout();
    } else {
      // default fallback: clear localStorage keys and reload
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      enqueueSnackbar("User LogOut Successful", {
        variant: "success",
      });
    }

    setTimeout(() => {
      window.location.href = "/"; // or do a programmatic redirect
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="
        fixed 
        top-0 
        left-0 
        bg-white 
        shadow-xl 
        p-6 
        flex 
        flex-col
        h-full
        w-64
        hidden
        lg:flex
      ">
      {/* Username */}
      <Link
        to={`/main/${id}/dashboard`}
        className="text-xl font-bold text-blue-600 mb-6">
        @{currUser?.username}
      </Link>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-3">
        <Link
          to={`/${user_id}/dashboard`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Overview
        </Link>

        <Link
          to={`/${user_id}/order`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Order
        </Link>

        <Link
          to={`/${user_id}/complaint`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Raise Complaints
        </Link>

        <Link
          to={`/${user_id}/payment_method`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Payment Method
        </Link>

        <Link
          to={`/${user_id}/add_bank`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Add Bank
        </Link>

        <Link
          to={`/${user_id}/contact`}
          className="block p-2 rounded-lg hover:bg-gray-100">
          Contact Us
        </Link>
      </nav>

      {/* LOGOUT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={logout}
        className="mt-auto cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Logout
      </motion.button>
    </motion.div>
  );
};
