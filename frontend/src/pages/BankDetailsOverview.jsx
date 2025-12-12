import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const BankOverview = ({ currUser }) => {
  const [bankData, setBankData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        console.log("Sending the request ", currUser);
        const res = await fetch(
          `http://localhost:8080/api/v2/${currUser}/get_bank_details`
        );
        const data = await res.json();
        console.log("Fetched bank details:", data);

        if (!data || data.bankDetails.length === 0) {
          enqueueSnackbar("No bank details found, please add one.", {
            variant: "info",
          });
          navigate(`/${currUser}/add_bank`);
          return 0;
        } else {
          // Show first bank details
          setBankData(data.bankDetails[0]);
          enqueueSnackbar("Details Found Successfully", { variant: "success" });
        }
      } catch (err) {
        console.error("Error fetching bank details:", err);
        enqueueSnackbar("Failed to fetch bank details!", { variant: "error" });
      }
    };

    fetchBankDetails();
  }, [currUser, enqueueSnackbar, navigate]);

  // const amount = localStorage.getItem("bankAmount");

  if (!bankData) return null; // or a loader

  return (
    <div className="flex justify-center items-start py-12 px-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar currUser={currUser} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
        animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
        transition={{ duration: 0.6, ease: "easeOut" }} // Smooth timing
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
        }} // Hover effect
        className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">
          Bank & Card Overview
        </h3>

        <div className="space-y-4">
          <p>
            <strong>Bank Name:</strong> {bankData.BankName}
          </p>
          <p>
            <strong>IFSC:</strong> {bankData.IFSC}
          </p>
          <p>
            <strong>Branch:</strong> {bankData.Branch}
          </p>
          <p>
            <strong>Card Holder:</strong> {bankData.cardHolder}
          </p>
          <p>
            <strong>Card Number:</strong> **** **** ****{" "}
            {bankData.cardNumber.slice(-4)}
          </p>
          <p>
            <strong>Expiry:</strong> {bankData.expiry}
          </p>
          <p>
            <strong>Amount:</strong> ₹{bankData.amount}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BankOverview;

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
