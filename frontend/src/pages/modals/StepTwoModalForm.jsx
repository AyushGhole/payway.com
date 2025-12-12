import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const StepTwoModalForm = ({ currUser, bankData, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  console.log("userId secoond step 2 ", currUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mergedData = {
      ...bankData,
      cardHolder,
      cardNumber,
      expiry,
      cvv,
      amount,
      currUser,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/v2/${currUser}/add_bank_and_card`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mergedData),
        }
      );

      if (res.ok) {
        enqueueSnackbar("Bank + Card Added Successfully!", {
          variant: "success",
        });

        onClose();
        navigate(`/${currUser}/dashboard`);
      } else {
        enqueueSnackbar("Failed to Add Details!", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Network Error!", { variant: "error" });
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Card Information
      </h2>

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
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold cursor-pointer">
        Finish
      </motion.button>
    </form>
  );
};

export default StepTwoModalForm;

const FloatingInput = ({ label, ...props }) => {
  return (
    <div className="relative">
      <input
        {...props}
        className="peer w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
      />
      <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm">
        {label}
      </label>
    </div>
  );
};
