import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepOneModalForm from "./StepOneModalForm";
import StepTwoModalForm from "./StepTwoModalForm";

const AddBankModal = ({ open, onClose, currUser }) => {
  const [step, setStep] = useState(1);
  const [bankData, setBankData] = useState(null);
  console.log("userId Main ", currUser);

  if (!open) return null;

  // Modal background + smooth animation
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 w-9 h-9 flex items-center justify-center 
                 rounded-full bg-gray-200 hover:bg-gray-300 transition">
            ✕
          </button>

          {/* STEP CONTROL */}
          {step === 1 && (
            <StepOneModalForm
              currUser={currUser}
              onNext={(data) => {
                setBankData(data);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <StepTwoModalForm
              currUser={currUser}
              bankData={bankData}
              onClose={onClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddBankModal;
