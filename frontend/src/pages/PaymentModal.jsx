import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PaymentModal = ({ option, onClose }) => {
  // Modal  State for OTP handling
  const [step, setStep] = useState("form"); // 'form' or 'otp'
  const [formData, setFormData] = useState(null); // store the payment form data
  const [generatedOTP, setGeneratedOTP] = useState(null); // store the OTP sent
  const [enteredOTP, setEnteredOTP] = useState(""); // what user types
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill("")); // 6-digit OTP
  const [loadings, setLoadings] = useState(false);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  // UPI sample modal form for confirmation
  const UPIForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
    const [vpa, setVpa] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, vpa, amount });
        }}>
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="UPI ID (e.g. username@bank)"
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="
          w-full py-3 rounded-xl
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white font-semibold
          shadow-lg shadow-blue-500/30
          hover:shadow-blue-500/40
          transition cursor-pointer
        ">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // Pay Contact
  const PayContactsForm = ({ onSubmit }) => {
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, contactName, amount });
        }}>
        <GlassInput
          label="Contact Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />

        {/* <GlassInput
          label="Phone Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}

        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition cursor-pointer">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // Pay Phone
  const PhonePayForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
    const [amount, setAmount] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ mobileNumber, amount, email });
        }}>
        <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition cursor-pointer">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // general pay form
  const GeneralPayForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, recipient, amount });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          type="tel"
          maxLength="10"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Recipient Name / ID"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // pay bills form
  const BillPaymentForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [billType, setBillType] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, billType, accountNumber, amount });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          type="tel"
          maxLength="10"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Bill Type (Electricity / Water / Gas)"
          value={billType}
          onChange={(e) => setBillType(e.target.value)}
        />

        <GlassInput
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // general modal form UI
  const GlassInput = ({ label, value, onChange, type = "text" }) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="
          w-full px-4 py-3 
          bg-white/20 backdrop-blur-xl 
          border border-white/40 
          rounded-xl
          outline-none
          text-gray-900
          placeholder-transparent
          peer
          focus:border-blue-500
          transition-all duration-200
        "
          placeholder={label}
          required
        />

        <label
          className="
          absolute left-4 top-3 
          text-gray-700 
          transition-all duration-200
          pointer-events-none
          bg-white/50 backdrop-blur-xl px-1
          rounded-md
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-gray-500
          peer-placeholder-shown:text-md
          peer-focus:-top-2 
          peer-focus:text-xs 
          peer-focus:text-blue-600
        ">
          {label}
        </label>
      </div>
    );
  };

  //Recharge form
  const RechargeForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [operator, setOperator] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, operator, amount });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Operator"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // Gas Recharge
  const GasRechargeForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [consumerNumber, setConsumerNumber] = useState("");
    const [gasProvider, setGasProvider] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, consumerNumber, gasProvider, amount });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Consumer Number"
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
        />

        <GlassInput
          label="Gas Provider"
          value={gasProvider}
          onChange={(e) => setGasProvider(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // DTH Recharge form
  const DTHRechargeForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [subscriberId, setSubscriberId] = useState("");
    const [operator, setOperator] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email, subscriberId, operator, amount });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Subscriber ID"
          value={subscriberId}
          onChange={(e) => setSubscriberId(e.target.value)}
        />

        <GlassInput
          label="Operator"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  //Bank Transfer form
  const BankTransferForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            email,
            accountHolderName,
            accountNumber,
            ifscCode,
            amount,
          });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Account Holder Name"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
        />

        <GlassInput
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <GlassInput
          label="IFSC Code"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };
  //Net Banking form
  const NetBankingForm = ({ onSubmit }) => {
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState("");

    return (
      <motion.form
        className="space-y-5 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            email,
            bankName,
            accountNumber,
            ifscCode,
            username,
            amount,
          });
        }}>
        {/* <GlassInput
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        /> */}
        <GlassInput
          label="Email (OTP will be sent here)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <GlassInput
          label="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />

        <GlassInput
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <GlassInput
          label="IFSC Code"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value)}
        />

        <GlassInput
          label="NetBanking Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <GlassInput
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition">
          Proceed
        </motion.button>
      </motion.form>
    );
  };

  // OTP Form
  const OTPForm = ({ onVerify, onResend, length = 6 }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputsRef = useRef([]);

    // Handle change in each input box
    const handleChange = (e, index) => {
      const val = e.target.value.replace(/\D/, ""); // only digits
      if (!val) return;

      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Move focus to next box
      if (index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    };

    // Handle backspace
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

    // On Verify click
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
          Enter the OTP sent to your registered mobile/email.
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
              className="w-12 h-12  text-center text-lg font-semibold border border-gray-700 rounded-lg focus:outline-none focus:border-blue-800 focus:shadow-md transition"
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="w-full py-3 cursor-pointer rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold">
          Verify OTP
        </motion.button>

        <button
          onClick={onResend}
          className="w-full py-2 cursor-pointer text-blue-600 font-medium hover:underline">
          Resend OTP
        </button>
      </motion.div>
    );
  };

  // Function to send OTP
  // const sendOTP = async (data) => {
  //   try {
  //     if (!data.email) {
  //       enqueueSnackbar("Please enter your email.");
  //       return;
  //     }

  //     setLoading(true);

  //     const otp = Math.floor(100000 + Math.random() * 900000);
  //     setGeneratedOTP(otp);

  //     console.log("Sending OTP", otp, "email", data.email, data.amount);

  //     await fetch("http://localhost:8080/api/v3/send-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         otp,
  //         email: data.email,
  //         amount: data.amount,
  //       }),
  //     });

  //     setFormData(data);
  //     setStep("otp");
  //     setLoading(false);
  //     enqueueSnackbar("OTP sent successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //     enqueueSnackbar("Failed to send OTP. Try again.");
  //   }
  // };
  const sendOTP = async (data) => {
    try {
      if (!data.email) {
        enqueueSnackbar("Please enter your email.");
        return;
      }

      setLoading(true); // <-- start spinner

      const otp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOTP(otp);

      console.log("Sending OTP", otp, "email", data.email, data.amount);

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
        console.error("OTP send failed:", result);
        enqueueSnackbar(result.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to send OTP. Try again.");
    } finally {
      setLoading(false); // <-- stop spinner
    }
  };

  // const verifyOTP = async (enteredOTPValue) => {
  //   if (!enteredOTPValue || enteredOTPValue.length !== 6) {
  //     enqueueSnackbar("Please enter the OTP.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch("http://localhost:8080/api/v3/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phone: formData.mobileNumber,
  //         otp: enteredOTPValue,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       const transactionRes = await fetch("/api/process-transaction", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData),
  //       });

  //       if (transactionRes.ok) enqueueSnackbar("Transaction successful!");
  //       else enqueueSnackbar("Transaction failed. Try again.");

  //       setStep("form");
  //       setFormData({});
  //       onClose();
  //     } else {
  //       enqueueSnackbar(data.message || "OTP verification failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     enqueueSnackbar("Error verifying OTP. Try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // General form for rendering

  const verifyOTP = async (enteredOTPValue) => {
    if (!enteredOTPValue || enteredOTPValue.length !== 6) {
      enqueueSnackbar("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Make sure formData.email exists
      if (!formData.email) {
        enqueueSnackbar("Email is missing. Cannot verify OTP.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/v3/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // important
        body: JSON.stringify({
          email: formData.email, // must send email
          otp: enteredOTPValue, // send OTP
        }),
      });

      const data = await res.json();

      if (res.ok) {
        enqueueSnackbar("OTP verified successfully!", { variant: "success" });
        onClose();
        setLoadings(true);
        // ✅ OTP verified → now trigger transaction
        handleTransaction(formData.amount); // pass the amount here // call the transaction function here
      } else {
        enqueueSnackbar(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("[Frontend verifyOTP] Error:", err);
      enqueueSnackbar("Error verifying OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (amount) => {
    if (!userId || !amount) {
      enqueueSnackbar("User or amount is missing.", { variant: "error" });
      return;
    }

    try {
      setLoadings(true);

      const res = await fetch(
        `http://localhost:8080/api/v4/${userId}/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, amount }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        enqueueSnackbar("Transaction successful!", { variant: "success" });
        console.log("Latest 3 transactions:", data.latestTransactions);

        setTimeout(() => {
          navigate(`/${userId}/dashboard`);
        }, 2000);
      } else {
        enqueueSnackbar(data.message || "Transaction failed", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("[Frontend Transaction] Error:", err);
      enqueueSnackbar("Error performing transaction.", { variant: "error" });
    } finally {
      setLoadings(false);
    }
  };

  const PaymentFormBasedOnOption = ({ option, onSubmit }) => {
    switch (option) {
      case "Pay UPI":
        return <UPIForm onSubmit={onSubmit} />;
      case "Pay Phone":
        return <PhonePayForm onSubmit={onSubmit} />;
      case "Bank Transfer":
        return <BankTransferForm onSubmit={onSubmit} />;
      case "Recharge":
        return <RechargeForm onSubmit={onSubmit} />;
      case "Gas Recharge":
        return <GasRechargeForm onSubmit={onSubmit} />;
      case "DTH Recharge":
        return <DTHRechargeForm onSubmit={onSubmit} />;
      case "Pay Bills":
      case "Bill":
        return <BillPaymentForm onSubmit={onSubmit} />;
      case "Net Banking":
        return <NetBankingForm onSubmit={onSubmit} />;
      case "Pay Contacts":
        return <PayContactsForm onSubmit={onSubmit} />;
      case "Pay":
        return <GeneralPayForm onSubmit={onSubmit} />;

      default:
        return <p className="text-center text-gray-600">Coming soon...</p>;
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div
            className="
            relative w-[90%] max-w-lg rounded-3xl p-7
            bg-white/80 backdrop-blur-md border border-gray-200
            shadow-xl shadow-gray-400/20
          "
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 bg-white shadow-lg 
                       rounded-full cursor-pointer p-2 hover:bg-gray-200 
                       transition  text-gray-700">
              <FaTimes size={16} />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-wide">
                {option}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Please enter the required details to continue.
              </p>
            </div>

            {/* Dynamic Form Will Render Here */}
            <div className="mt-4">
              {step === "form" ? (
                <PaymentFormBasedOnOption option={option} onSubmit={sendOTP} />
              ) : (
                <OTPForm
                  onVerify={verifyOTP} // ← argument pass ho raha hai OTPForm se
                  onResend={() => sendOTP(formData)}
                  length={6}
                />
              )}
            </div>

            {loading && (
              <div className="flex justify-center items-center mt-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                </svg>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PaymentModal;
