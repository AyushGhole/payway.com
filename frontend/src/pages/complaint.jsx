import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import axios from "axios";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintForm = ({ currUser }) => {
  const [username, setUsername] = useState("");
  const [complaint, setComplaint] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://payway-com-backend.onrender.com/api/v1/${currUser}/complaint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, complaint }),
        }
      );

      // FIX: Must read JSON from response
      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Complaint Submitted Successfully!", {
          variant: "success",
        });

        // Reset form
        setUsername("");
        setComplaint("");

        // Redirect with complaint data
        navigate("/complaint-success", {
          state: { complaint: data.complaint }, // FIXED
        });
      } else {
        enqueueSnackbar(data.message || "Something went wrong!", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      enqueueSnackbar("Network error!", { variant: "error" });
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar currUser={currUser} />

      {/* Main Content */}
      <div className="flex justify-center items-start py-12 px-4 min-h-screen lg:ml-[370px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl backdrop-blur-xl bg-white/70 shadow-2xl border border-white/40 rounded-3xl p-10">
          <motion.h3
            className="text-3xl font-bold text-gray-800 tracking-tight mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            Raise Your Complaint
          </motion.h3>

          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Username */}
            <FloatingInput
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Complaint */}
            <FloatingTextarea
              label="Complaint"
              name="complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition cursor-pointer">
              Submit
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintForm;

// Reuse the same FloatingInput and FloatingTextarea components from your OrderForm
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

const FloatingInput = ({ label, ...props }) => {
  return (
    <div className="relative">
      <input
        {...props}
        className="
          peer w-full px-4 py-3 
          bg-white/50 backdrop-blur-sm
          border border-gray-300 rounded-xl
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-300
          outline-none transition
        "
      />
      <label
        className="
          absolute left-4 top-3 text-gray-500 pointer-events-none 
          transition-all duration-200 
          peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm 
          peer-focus:text-blue-600 
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm
        ">
        {label}
      </label>
    </div>
  );
};

const FloatingSelect = ({ label, children, ...props }) => {
  return (
    <div className="relative">
      <select
        {...props}
        className="
          peer w-full px-4 py-3 bg-white/50 backdrop-blur-sm
          border border-gray-300 rounded-xl
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-300
          outline-none transition
        ">
        {children}
      </select>

      <label
        className="
          absolute left-4 top-3 text-gray-500 pointer-events-none
          transition-all duration-200
          peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-blue-600
          peer-valid:-top-2 peer-valid:text-sm
        ">
        {label}
      </label>
    </div>
  );
};

const FloatingTextarea = ({ label, ...props }) => {
  return (
    <div className="relative">
      <textarea
        {...props}
        rows={3}
        className="
          peer w-full px-4 py-3 
          bg-white/50 backdrop-blur-sm
          border border-gray-300 rounded-xl
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-300
          outline-none transition resize-none
        "></textarea>

      <label
        className="
          absolute left-4 top-3 text-gray-500 pointer-events-none 
          transition-all duration-200
          peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm 
          peer-focus:text-blue-600
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm
        ">
        {label}
      </label>
    </div>
  );
};
