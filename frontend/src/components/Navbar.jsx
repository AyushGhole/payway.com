import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPaypal } from "react-icons/fa";
import { useModal } from "../context/ModalContext";

import { useSnackbar } from "notistack";

/**
 * Navbar (Tailwind + Framer Motion)
 *
 * Behavior:
 * - If user is logged in -> show username + Logout button
 * - If user NOT logged in -> show nav options including Features & Products (dropdowns)
 * - Desktop: dropdowns open on hover (with small delay), auto-flip if overflow
 * - Mobile: toggler opens full dropdown panel; toggler becomes a cross to close
 *
 * Auth detection:
 * - Attempts to use a `useAuth` hook if available.
 * - Falls back to localStorage "user" JSON if not present.
 *
 * IMPORTANT: Replace the logout() and user retrieval with your actual app's auth logic.
 */

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

export default function Navbar() {
  // Attempt to read from context first, otherwise localStorage
  const auth = tryUseAuth();
  const ctxUser = auth ? auth.user : null;
  const ctxLogout = auth ? auth.logout : null;
  const { setShowLogin, setShowSignup } = useModal();
  const { openLogin, openSignup } = useModal();

  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(() => {
    if (ctxUser) return ctxUser;
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("currUser") ||
        localStorage.getItem("token");
      if (!raw) return null;
      // assume stored as JSON; if token string, user will be truthy but not object
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch {
      return null;
    }
  });

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

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdown refs & flip logic
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const [featuresRightAlign, setFeaturesRightAlign] = useState(false);
  const [productsRightAlign, setProductsRightAlign] = useState(false);

  // hover state to allow small enter/leave delays
  const [hoverFeature, setHoverFeature] = useState(false);
  const [hoverProduct, setHoverProduct] = useState(false);

  useEffect(() => {
    const checkOverflow = (ref, setRightAlign) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dropdownWidth = 220; // estimated dropdown width (you can adjust)
      // If the dropdown would extend beyond right edge of viewport, right-align it
      if (rect.left + dropdownWidth > window.innerWidth - 8) {
        setRightAlign(true);
      } else {
        setRightAlign(false);
      }
    };

    const doCheck = () => {
      checkOverflow(featuresRef, setFeaturesRightAlign);
      checkOverflow(productsRef, setProductsRightAlign);
    };

    doCheck();
    window.addEventListener("resize", doCheck);
    window.addEventListener("scroll", doCheck, true);
    return () => {
      window.removeEventListener("resize", doCheck);
      window.removeEventListener("scroll", doCheck, true);
    };
  }, []);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.98 },
  };

  const mobilePanelVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-gradient-to-r from-sky-50 to-white">
              <FaPaypal className="text-2xl text-sky-600" />
            </span>
            <div className="flex items-baseline">
              <span className="text-lg italic text-sky-500 font-semibold">
                Pay
              </span>
              <span className="text-lg text-blue-700 font-bold ml-1">Way</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-6">
            {/* If user is NOT logged in show nav items */}
            {!user ? (
              <>
                {/* Features dropdown */}
                <div
                  className="relative"
                  ref={featuresRef}
                  onMouseEnter={() => setHoverFeature(true)}
                  onMouseLeave={() => setHoverFeature(false)}>
                  <button
                    className="text-sm cursor-pointer hover:text-sky-600 transition"
                    aria-haspopup="true"
                    aria-expanded={hoverFeature}>
                    Features
                  </button>

                  <AnimatePresence>
                    {hoverFeature && (
                      <motion.ul
                        key="features"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        transition={{ duration: 0.14 }}
                        className={`absolute top-full mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-40 py-2 ${
                          featuresRightAlign ? "right-0" : "left-0"
                        }`}
                        role="menu">
                        <li>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-sky-50"
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("open-razor-modal")
                              )
                            }>
                            Pay
                          </button>
                        </li>
                        <li>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-sky-50"
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("open-razor-modal")
                              )
                            }>
                            Bank Transfer
                          </button>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Products dropdown */}
                <div
                  className="relative"
                  ref={productsRef}
                  onMouseEnter={() => setHoverProduct(true)}
                  onMouseLeave={() => setHoverProduct(false)}>
                  <button
                    className="text-sm cursor-pointer hover:text-sky-600 transition"
                    aria-haspopup="true"
                    aria-expanded={hoverProduct}>
                    Products
                  </button>

                  <AnimatePresence>
                    {hoverProduct && (
                      <motion.ul
                        key="products"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        transition={{ duration: 0.14 }}
                        className={`absolute top-full mt-2 w-46 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-30 py-2 ${
                          productsRightAlign ? "right-2" : "left-0"
                        }`}
                        role="menu">
                        <li>
                          <Link
                            className="block px-4 py-2 text-sm hover:bg-sky-50"
                            to="/main/creditCard">
                            Credit Cards
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="block px-4 py-2 text-sm hover:bg-sky-50"
                            to="/main/debitCard">
                            Debit Cards
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={openLogin}
                  className="text-sm  cursor-pointer hover:text-sky-600 transition">
                  Login
                </button>

                <button
                  onClick={openSignup}
                  className="text-sm px-3 cursor-pointer  py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition">
                  SignUp
                </button>
              </>
            ) : (
              // user logged in -> show username and logout
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  @
                  {user.username ||
                    (user.email ? user.email.split("@")[0] : "user")}
                </span>
                <button
                  onClick={logout}
                  className="text-sm px-3 cursor-pointer py-1 rounded-md border border-sky-600 text-sky-600 hover:bg-sky-50 transition">
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile toggler */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300">
              {mobileOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden">
              <div className="py-3 border-t border-teal-50">
                <div className="flex flex-col gap-2 px-2">
                  {!user ? (
                    <>
                      {/* Show nav options for NOT logged in users */}

                      {/* Mobile expandable Features */}
                      <DisclosureMenu
                        title="Features"
                        items={[
                          { to: "/main", label: "Pay" },
                          { to: "/main", label: "Bank Transfer" },
                        ]}
                      />

                      {/* Mobile expandable Products */}
                      <DisclosureMenu
                        title="Products"
                        items={[
                          { to: "/main/creditCard", label: "Credit Cards" },
                          { to: "/main/debitCard", label: "Debit Cards" },
                        ]}
                      />

                      <button
                        onClick={openLogin}
                        className="text-md py-2 ps-4 text-left cursor-pointer hover:text-sky-600 transition">
                        Login
                      </button>

                      <button
                        onClick={openSignup}
                        className="text-md ps-4  text-left  py-1 cursor-pointer  rounded-md   hover:text-sky-700 transition">
                        SignUp
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2">
                        @
                        {user.username ||
                          (user.email ? user.email.split("@")[0] : "user")}
                      </div>
                      <button
                        onClick={logout}
                        className="px-3 py-2 rounded border border-sky-600 text-sky-600">
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/**
 * DisclosureMenu: simple expandable list used on mobile. Uses framer animations.
 */
function DisclosureMenu({ title, items = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-1">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full text-left flex items-center justify-between px-3 py-2 rounded hover:bg-sky-50"
        aria-expanded={open}>
        <span>{title}</span>
        <span
          className={`transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pl-4">
            {items.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                className="block px-3 py-2 text-sm hover:bg-sky-50 rounded">
                {it.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
