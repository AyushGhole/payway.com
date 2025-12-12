import React from "react";
import { motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function ComplaintSuccess() {
  const { state } = useLocation();
  const complaint = state?.complaint;

  const navigate = useNavigate();

  if (!complaint) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No complaint data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-start py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-green-600 text-center mb-6">
          Complaint Submitted 🎉
        </motion.h1>

        <motion.p
          className="text-gray-700 text-center text-lg mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}>
          Your complaint has been successfully recorded.
        </motion.p>

        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}>
          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              <strong className="text-gray-900">Username:</strong>{" "}
              {complaint.username}
            </p>

            <p>
              <strong className="text-gray-900">Complaint:</strong>{" "}
              {complaint.complaint}
            </p>

            <p>
              <strong className="text-gray-900">Complaint ID:</strong>{" "}
              {complaint._id}
            </p>

            <p>
              <strong className="text-gray-900">Submitted On:</strong>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Button */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}>
          <Link
            to={`/${complaint.userId}/dashboard`}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Return to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
