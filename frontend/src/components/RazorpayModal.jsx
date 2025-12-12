import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUniversity,
  FaMobileAlt,
  FaQrcode,
  FaEnvelope,
} from "react-icons/fa";
import { useSnackbar } from "notistack";

export default function TransferModal({ open, onClose, handleTransaction }) {
  const [transferMethod, setTransferMethod] = useState(""); // upi, phone, bank
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [step, setStep] = useState("details"); // details | otp
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({});
  const otpRef = useRef(null); // store OTP input value to prevent reset

  // =================== OTPForm Component ===================
  const OTPForm = ({ onVerify, onResend, length = 6 }) => {
    const [otp, setOtp] = useState(
      otpRef.current || new Array(length).fill("")
    );
    const inputsRef = useRef([]);

    useEffect(() => {
      otpRef.current = otp;
    }, [otp]);

    const handleChange = (e, index) => {
      const val = e.target.value.replace(/\D/, "");
      if (!val) return;
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (index < length - 1) inputsRef.current[index + 1].focus();
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace") {
        const newOtp = [...otp];
        if (otp[index]) {
          newOtp[index] = "";
          setOtp(newOtp);
        } else if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      }
    };

    const handleVerify = () => {
      const enteredOtp = otp.join("");
      onVerify(enteredOtp);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5">
        <p className="text-gray-700 text-center">
          Enter the OTP sent to your email
        </p>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-700 rounded-lg focus:outline-none focus:border-blue-800 focus:shadow-md transition"
            />
          ))}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="w-full py-3 cursor-pointer rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold">
          Verify OTP
        </motion.button>
        <button
          type="button"
          onClick={onResend}
          className="w-full py-2 cursor-pointer text-blue-600 font-medium hover:underline">
          Resend OTP
        </button>
      </motion.div>
    );
  };

  // =================== Send OTP ===================
  const sendOTP = async (data) => {
    if (!data.email) return enqueueSnackbar("Please enter your email.");
    if (!data.amount || data.amount <= 0)
      return enqueueSnackbar("Enter a valid amount.");

    setLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOTP(otp);

      console.log("Generated OTP:", otp);

      const response = await fetch("http://localhost:8080/api/v3/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          email: data.email,
          amount: data.amount,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        setFormData(data);
        setStep("otp");
        enqueueSnackbar("OTP sent successfully!");
      } else {
        enqueueSnackbar(result.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // =================== Verify OTP ===================
  const verifyOTP = async (enteredOTPValue) => {
    if (!enteredOTPValue || enteredOTPValue.length !== 6)
      return enqueueSnackbar("Please enter the OTP.");

    setLoading(true);
    try {
      if (!formData.email)
        return enqueueSnackbar("Email missing. Cannot verify OTP.");

      const res = await fetch("http://localhost:8080/api/v3/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: enteredOTPValue }),
      });
      const data = await res.json();

      if (res.ok) {
        enqueueSnackbar("OTP verified successfully!", { variant: "success" });
        enqueueSnackbar("Transaction successfull", { variant: "success" });
        onClose();
        handleTransaction(formData.amount);
        otpRef.current = null; // reset OTP after success
        setStep("details"); // reset step
      } else {
        enqueueSnackbar(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Error verifying OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // =================== Handle Details Submit ===================
  const handleSubmit = () => {
    if (!transferMethod) return enqueueSnackbar("Select a transfer method!");
    if (!email) return enqueueSnackbar("Enter your email");
    if (!amount || amount <= 0) return enqueueSnackbar("Enter a valid amount");

    if (transferMethod === "upi" && !upi)
      return enqueueSnackbar("Enter UPI ID");
    if (transferMethod === "phone" && !phone)
      return enqueueSnackbar("Enter phone number");
    if (transferMethod === "bank" && (!bankName || !accountNumber || !ifsc))
      return enqueueSnackbar("Enter complete bank details");

    sendOTP({
      transferMethod,
      email,
      amount,
      upi,
      phone,
      bankName,
      accountNumber,
      ifsc,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] p-6 md:p-8 overflow-y-auto"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Send Money
            </h2>

            {step === "details" && (
              <>
                {/* Email */}
                <div className="mb-5">
                  <label className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-400 transition-shadow bg-gray-50">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full outline-none text-gray-700 bg-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-5">
                  <label className="block mb-2 font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {/* Transfer Methods */}
                <div className="mb-6">
                  <label className="block mb-3 font-medium text-gray-700">
                    Select Transfer Method
                  </label>
                  <div className="flex gap-3">
                    {[
                      { key: "upi", label: "UPI", icon: <FaQrcode /> },
                      { key: "phone", label: "Phone", icon: <FaMobileAlt /> },
                      { key: "bank", label: "Bank", icon: <FaUniversity /> },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setTransferMethod(item.key)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-2xl cursor-pointer transition-all duration-200 shadow-sm ${
                          transferMethod === item.key
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : "bg-white text-gray-700 hover:border-blue-400 hover:shadow-md"
                        }`}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Inputs */}
                {transferMethod === "upi" && (
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="example@upi"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                      value={upi}
                      onChange={(e) => setUpi(e.target.value)}
                    />
                  </div>
                )}

                {transferMethod === "phone" && (
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="9999999999"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}

                {transferMethod === "bank" && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="Bank Name"
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        placeholder="IFSC0001234"
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition bg-gray-50"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-5 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-all shadow-lg">
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <OTPForm
                onVerify={verifyOTP}
                onResend={() => sendOTP(formData)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
