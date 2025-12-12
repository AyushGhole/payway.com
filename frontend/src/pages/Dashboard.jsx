import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AddBankModal from "./modals/AddBankModal";
import PaymentModal from "./PaymentModal";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";

const Dashboard = ({ currUser, User }) => {
  const [bankData, setBankData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [hasTransactions, sethasTransactions] = useState(null);
  const navigate = useNavigate();
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        console.log("Sending the request ", currUser);
        const res = await fetch(
          `https://payway-com-backend.onrender.com/api/v2/${currUser}/get_bank_details`
        );
        const data = await res.json();
        console.log("Fetched bank details:", data);

        if (data) {
          // Show first bank details
          setBankData(data.bankDetails[0]);
          enqueueSnackbar("Details Found Successfully", { variant: "success" });
        }
      } catch (err) {
        console.error("Error fetching bank details:", err);
        // enqueueSnackbar("Failed to fetch bank details!", { variant: "error" });
      }
    };

    fetchBankDetails();
  }, [currUser, enqueueSnackbar, navigate]);

  console.log("Dashboard ", User);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currUser) return;

      console.log(currUser);
      const res = await fetch(
        `https://payway-com-backend.onrender.com/api/v4/${currUser}/getTransaction`
      );
      const data = await res.json();

      console.log("Received transactions :", data);

      if (res.ok) {
        // Convert backend → UI friendly format
        const formatted = data.latestTransactions.map((t) => ({
          AccountHolderName: t.AccountHolderName, // or user?.username (if you want)
          Amount: t.Amount,
          Status: t.Status,
        }));

        console.log(formatted);
        setTransactions(formatted);
      }
    };

    fetchTransactions();
  }, [currUser]);

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Add Bank modal form  */}
      <AddBankModal
        open={showBankModal}
        onClose={() => setShowBankModal(false)}
        currUser={currUser}
      />

      {/* payment modal */}
      {showPaymentModal && (
        <PaymentModal
          option={selectedPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar currUser={currUser} />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:ml-64">
        {/* GRID FIXED FOR RESPONSIVENESS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl p-6">
            {/* Balance */}
            {!bankData ? (
              <div className="text-center mb-6">
                <Link
                  onClick={() => setShowBankModal(true)}
                  className="px-4 mt-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow cursor-pointer hover:bg-blue-700 transition">
                  Add Bank
                </Link>
                <p className="mt-3 text-gray-600 font-medium">
                  Account Balance
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">
                  ₹{bankData?.amount?.toLocaleString("en-IN") || "0"}
                </h1>
                <p className="text-gray-600 font-medium">Account Balance</p>
              </div>
            )}

            <p className="text-md text-gray-700 text-center mb-4">
              UPI ID: <b>{User}@okhfdc</b>
            </p>

            <hr className="my-4" />

            {!transactions ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-lg">No Transactions Yet !!!</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-lg mb-3">Recent Transactions</p>
                {transactions.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-blue-50 p-4 rounded-xl shadow-sm mb-3 flex justify-between items-center">
                    <span className="font-medium">{t.Status}</span>
                    <span className="font-semibold">₹{t.Amount}</span>

                    {t.Status === "success" && (
                      <FaCheck className="text-green-600 text-lg" />
                    )}

                    {t.Status === "failed" && (
                      <FaExclamationCircle className="text-red-600 text-lg" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT CARD (PAYMENT ICONS) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl p-6">
            <IconSection
              currUser={currUser}
              route={bankData ? "payMoney" : "add_bank"}
              onSelectPayment={(option) => {
                setSelectedPayment(option);
                setShowPaymentModal(true);
              }}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

/* =============================================================== */
/*                           SIDEBAR                               */
/* =============================================================== */

/* =============================================================== */
/*                           SIDEBAR (UPDATED)                     */
/* =============================================================== */
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
        to={`/${user_id}/dashboard`}
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

/* =============================================================== */
/*                   PAYMENT ICON GRID (RESPONSIVE)                */
/* =============================================================== */

const IconSection = ({ currUser, onSelectPayment }) => {
  const menus = [
    { icon: "fa-regular fa-address-book", label: "Pay Contacts" },
    { icon: "fa-solid fa-mobile-screen", label: "Pay Phone" },
    { icon: "fa-solid fa-expand", label: "Pay" },
    { icon: "fa-solid fa-file-invoice-dollar", label: "Pay Bills" },
    { icon: "fa-solid fa-blog", label: "Pay UPI" },
    { icon: "fa-solid fa-signal", label: "Recharge" },
    { icon: "fa-solid fa-gas-pump", label: "Gas Recharge" },
    { icon: "fa-solid fa-tv", label: "DTH Recharge" },
    { icon: "fa-solid fa-building-columns", label: "Bank Transfer" },
    { icon: "fa-solid fa-bolt-lightning", label: "Bill" },
    { icon: "fa-solid fa-bolt-lightning", label: "Net Banking" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
      {menus.map((m, idx) => (
        <motion.div
          key={idx}
          onClick={() => onSelectPayment(m.label)} // 🔥 This triggers modal opening
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center p-4 bg-blue-50 text-center rounded-2xl hover:bg-blue-100 transition cursor-pointer">
          <p className="text-sm font-medium text-gray-700">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
