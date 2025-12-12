import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import Login from "./components/Navbar";
import ModalProvider from "./context/ModalContext";
import ProductCredit from "./pages/Products.jsx";
import ProductDebitCards from "./pages/ProductDebit.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useEffect, useState } from "react";
import OrderForm from "./pages/OrderForm.jsx";
import ComplaintForm from "./pages/complaint.jsx";
import ComplaintSuccess from "./pages/ComplaintSuccess.jsx";
import AddBank from "./pages/bankDetails.jsx";
import AddAccount from "./pages/Addaccount.jsx";
import BankOverview from "./pages/BankDetailsOverview.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  const [currUser, setcurrUser] = useState("");
  const [User, setUser] = useState("");

  useEffect(() => {
    setcurrUser(localStorage.getItem("user_id"));
    setUser(localStorage.getItem("userName"));
    console.log(localStorage.getItem("userName"));
    console.log(User);
  });

  return (
    <BrowserRouter>
      <ModalProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main/creditCard" element={<ProductCredit />} />
          <Route path="/main/debitCard" element={<ProductDebitCards />} />
          <Route
            path="/:_id/dashboard"
            element={<Dashboard currUser={currUser} User={User} />}
          />
          <Route
            path="/:_id/order"
            element={<OrderForm currUser={currUser} />}
          />
          <Route
            path="/:_id/complaint"
            element={<ComplaintForm currUser={currUser} />}
          />
          <Route path="/complaint-success" element={<ComplaintSuccess />} />
          <Route
            path="/:id/add_bank"
            element={<AddBank currUser={currUser} />}
          />
          <Route
            path="/:id/add_account"
            element={<AddAccount currUser={currUser} />}
          />
          <Route
            path="/:id/payment_method"
            element={<BankOverview currUser={currUser} />}
          />
          <Route path="/:id/contact" element={<Contact />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
