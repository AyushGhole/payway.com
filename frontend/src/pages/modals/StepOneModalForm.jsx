import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";

const StepOneModalForm = ({ onNext, currUser }) => {
  const [BankName, setBankName] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [Branch, setBranch] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  console.log("step 1", currUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!BankName || !IFSC || !Branch) {
      enqueueSnackbar("Please fill all fields!", { variant: "warning" });
      return;
    }

    onNext({ BankName, IFSC, Branch, currUser });
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Bank Information
      </h2>

      <FloatingInput
        label="Bank Name"
        className="mt-6"
        onChange={(e) => setBankName(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FloatingInput
          label="IFSC Code"
          onChange={(e) => setIFSC(e.target.value)}
        />
        <FloatingInput label="Location" />
      </div>

      <FloatingInput
        label="Branch"
        onChange={(e) => setBranch(e.target.value)}
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg cursor-pointer">
        Continue
      </motion.button>
    </form>
  );
};

export default StepOneModalForm;

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
