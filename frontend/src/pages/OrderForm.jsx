import React, { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const OrderForm = ({ currUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [address, setAddress] = useState("");
  // Snackbar message
  const { enqueueSnackbar } = useSnackbar();

  const [order, setOrder] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", { name, email, product, address });

    try {
      const res = await axios.post(
        `https://payway-com-backend.onrender.com/api/${currUser}/details`,
        {
          name,
          email,
          product,
          address,
        }
      );

      setName("");
      setEmail("");
      setProduct("");
      setAddress("");

      console.log(res);

      setOrder(res.data.order); // <-- save order
      enqueueSnackbar("Order Placed Successfully!", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      variant("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex w-full min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <Sidebar currUser={currUser} />

        {/* MAIN CONTENT (FORM AREA) */}
        <div
          className="
    flex justify-center items-start py-12 px-4
    min-h-screen
    bg-gradient-to-br from-blue-50 via-white to-blue-100
    lg:ml-[370px]
  ">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="
      w-full max-w-xl 
      backdrop-blur-xl bg-white/70 
      shadow-2xl border border-white/40
      rounded-3xl p-10
    ">
            {!order ? (
              <>
                {/* Title */}
                <motion.h3
                  className="text-3xl font-bold text-gray-800 tracking-tight mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}>
                  Place Your Order
                </motion.h3>

                {/* FORM */}
                <form
                  className="space-y-7"
                  method="POST"
                  onSubmit={handleSubmit}>
                  {/* Name */}
                  <FloatingInput
                    label="Name"
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                  />

                  {/* Email + Product */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatingInput
                      label="Email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                    />

                    <FloatingSelect
                      label="Product"
                      onChange={(e) => setProduct(e.target.value)}
                      name="product">
                      <option value="0">Select</option>
                      <option value="Premium Credit Card">
                        Premium Credit Card
                      </option>
                      <option value="Classic Credit Card">
                        Classic Credit Card
                      </option>
                      <option value="International Credit Card">
                        International Credit Card
                      </option>
                      <option value="Premium Debit Card">
                        Premium Debit Card
                      </option>
                      <option value="Classic Debit Card">
                        Classic Debit Card
                      </option>
                      <option value="International Debit Card">
                        International Debit Card
                      </option>
                    </FloatingSelect>
                  </div>

                  {/* Address */}
                  <FloatingTextarea
                    label="Address"
                    onChange={(e) => setAddress(e.target.value)}
                    name="address"
                  />

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="
              w-full py-3.5 rounded-xl 
              bg-gradient-to-r from-green-500 to-green-600 
              text-white font-semibold shadow-lg
              hover:shadow-xl transition cursor-pointer
            ">
                    Place Order
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
                <p className="mb-6">Your order has been successfully placed.</p>

                <div className="text-left space-y-2 mb-6">
                  <p>
                    <strong>Applicant Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong>Order Number:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Product:</strong> {order.product}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong> Within 15 Days From
                    Order Date
                  </p>
                </div>

                <button
                  onClick={() => setOrder(null)}
                  className="px-6 cursor-pointer py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                  Return to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderForm;

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

const OrderConfirmation = ({ order, userId }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You!</h1>
        <p className="mb-6 text-gray-700">
          Your order has been successfully placed.
        </p>

        <div className="text-left space-y-2 mb-6">
          <p>
            <strong>Applicant Name:</strong> {order.name}
          </p>
          <p>
            <strong>Order Number:</strong> {order._id}
          </p>
          <p>
            <strong>Product:</strong> {order.product}
          </p>
          <p>
            <strong>Shipping Address:</strong> {order.address}
          </p>
          <p>
            <strong>Estimated Delivery:</strong> Within 15 Days
          </p>
        </div>

        <button
          onClick={() => navigate(`/${userId}/dashboard`)}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
