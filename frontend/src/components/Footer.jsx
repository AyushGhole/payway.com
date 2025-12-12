import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-14 px-6 border-t border-gray-200">
      {/* Main Text Section */}
      <motion.div
        className="max-w-7xl mx-auto text-gray-700 leading-relaxed text-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}>
        <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

        <p>
          At Pay Way, we prioritize the security, safety, and accuracy of every
          transaction. Our payment gateway utilizes industry-leading encryption
          protocols, including SSL encryption and compliance with PCI DSS
          standards, to protect your personal and financial information. We
          continuously monitor for fraud and unauthorized activities to
          safeguard your data. By using Pay Way, you agree to our security
          measures and acknowledge that, while we take extensive precautions to
          prevent security breaches, we cannot guarantee absolute security due
          to inherent risks in online transactions.
        </p>

        <p className="mt-3">
          We are committed to maintaining the accuracy of transaction details
          and ensuring that your payment process is seamless. However, it is
          your responsibility to ensure that all information provided, such as
          payment details and billing information, is accurate. Pay Way will not
          be liable for any issues arising from inaccurate data entered by you.
          In case of discrepancies or disputes, we encourage you to promptly
          contact our support team, and we will work with you to resolve the
          issue in a timely manner.
        </p>

        <p className="mt-3">
          In line with our privacy commitment, we collect and process your
          personal and payment information solely for the purpose of completing
          transactions and improving service efficiency. We use strict data
          protection measures to prevent unauthorized access to your
          information, and we do not share your personal details with third
          parties unless required by law or necessary for transaction
          completion. By using Pay Way, you consent to the practices outlined in
          our Privacy Policy and agree that we may retain your data as necessary
          for legal compliance and business operations.
        </p>
      </motion.div>

      {/* Footer Menu */}
      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-6 text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        viewport={{ once: true }}>
        {["Home", "Features", "Pricing", "FAQs", "About"].map((item, index) => (
          <motion.a
            key={index}
            whileHover={{ scale: 1.15, color: "#2563eb" }} // Tailwind: text-blue-600
            className="cursor-pointer select-none transition">
            {item}
          </motion.a>
        ))}
      </motion.div>

      {/* Copyright */}
      <motion.p
        className="text-center mt-6 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        viewport={{ once: true }}>
        © 2025 PayWay. All rights reserved.
      </motion.p>
    </footer>
  );
}
