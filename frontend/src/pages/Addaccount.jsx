import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, Link } from "react-router-dom";

const AddAccount = ({ currUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Bank data received from Step 1
  const bankData = location.state?.bankData;

  // Card states
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mergedData = {
      ...bankData,
      cardHolder,
      cardNumber,
      expiry,
      cvv,
      amount,
      currUser, // <-- include amount
    };

    console.log("Sending", mergedData);
    console.log("currId", currUser);

    try {
      const res = await fetch(
        `http://localhost:8080/api/v2/${currUser}/add_bank_and_card`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mergedData),
        }
      );

      console.log(res);

      if (res.ok) {
        enqueueSnackbar("Bank + Card Added Successfully!", {
          variant: "success",
        });

        navigate(`/${currUser}/dashboard`);
      } else {
        enqueueSnackbar("Failed to Add Details!", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Network Error!", { variant: "error" });
    }
  };

  return (
    <div className="flex justify-center items-start py-12 px-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar currUser={currUser} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">
          Add Debit Card Details
        </h3>

        <form className="space-y-7" onSubmit={handleSubmit}>
          <FloatingInput
            label="Card Holder Name"
            onChange={(e) => setCardHolder(e.target.value)}
          />

          <FloatingInput
            label="Card Number"
            onChange={(e) => setCardNumber(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-5">
            <FloatingInput
              label="Expiry (MM/YY)"
              onChange={(e) => setExpiry(e.target.value)}
            />

            <FloatingInput
              label="CVV"
              type="password"
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>

          <FloatingInput
            label="Amount"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 cursor-pointer rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
            Finish
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAccount;

const FloatingInput = ({ label, ...props }) => {
  return (
    <div className="relative">
      <input
        {...props}
        className="peer w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
      />
      <label className="absolute left-4 top-3 text-gray-500 transition-all duration-200 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm">
        {label}
      </label>
    </div>
  );
};
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
