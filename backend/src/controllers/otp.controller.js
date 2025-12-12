import fetch from "node-fetch";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// In-memory OTP store
const otpStore = {};

/**
 * -----------------------------------------
 *  MOBILE OTP SENDER (FAST2SMS)
 * -----------------------------------------
 */
export const sendOTPController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in-memory with 5 min expiry
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // Send OTP via Fast2SMS
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "v3",
        sender_id: "FSTSMS",
        message: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        numbers: phone,
      }),
    });

    const data = await response.json();

    if (data.return) {
      console.log(`OTP sent to ${phone}: ${otp}`);
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      console.error("Fast2SMS error:", data);
      return res
        .status(500)
        .json({ message: "Failed to send OTP", details: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending OTP" });
  }
};

/**
 * -----------------------------------------
 *  EMAIL OTP SENDER (GMAIL APP PASSWORD)
 * -----------------------------------------
 */
export const sendOTPEmailController = async (req, res) => {
  try {
    const { email, otp, amount } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    // Store OTP in-memory with 5 min expiry
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // ⭐ Gmail App Password Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"YourApp Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Verification ✔",
      html: `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #ffffff;">
    <h2 style="color: #111827; text-align: center; margin-bottom: 20px;">OTP Verification Code</h2>
    
    <p style="font-size: 16px; color: #374151; line-height: 1.5;">
      Use the following One-Time Password (OTP) to complete your transaction of <strong>Rs. ${amount}</strong>:
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 12px 24px; color: #ffffff; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 8px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 16px;">
      This OTP is valid for 5 minutes only.
    </p>

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      If you didn’t request this, you can safely ignore this email.
    </p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="#" style="text-decoration: none; font-size: 14px; color: #2563eb;">Contact Support</a>
    </div>
  </div>
`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to send OTP", error: err.message });
  }
};

/**
 * -----------------------------------------
 *  OTP VERIFICATION
 * -----------------------------------------
 */
// export const verifyOTPController = (req, res) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({ message: "Phone and OTP are required" });
//     }

//     const record = otpStore[phone];

//     if (!record) {
//       return res
//         .status(400)
//         .json({ message: "OTP not found. Please request a new one." });
//     }

//     if (Date.now() > record.expiresAt) {
//       delete otpStore[phone];
//       return res
//         .status(400)
//         .json({ message: "OTP expired. Please request a new one." });
//     }

//     if (parseInt(otp) !== record.otp) {
//       return res
//         .status(400)
//         .json({ message: "Invalid OTP. Please try again." });
//     }

//     // OTP verified successfully
//     delete otpStore[phone];

//     return res.status(200).json({ message: "OTP verified successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error verifying OTP" });
//   }
// };

export const verifyOTPController = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    console.log(otpStore);
    const record = otpStore[email];

    if (!record) {
      console.warn(`OTP not found for email: ${email}`);
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    // Check if OTP expired
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      console.info(`OTP expired for email: ${email}`);
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    // Convert otp to number for comparison
    const enteredOtp = parseInt(otp, 10);

    if (enteredOtp !== record.otp) {
      console.warn(`Invalid OTP attempt for email: ${email}`);
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // OTP verified successfully
    delete otpStore[email];

    console.info(`OTP verified successfully for email: ${email}`);
    return res.status(200).json({
      message: "OTP verified successfully.",
      email,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in verifyOTPController:", err);
    return res.status(500).json({ message: "Server error verifying OTP." });
  }
};
