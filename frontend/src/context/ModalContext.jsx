import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false); // modal visibility
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup

  const openLogin = () => {
    setIsLogin(true);
    setShowModal(true);
  };

  const openSignup = () => {
    setIsLogin(false);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        isLogin,
        openLogin,
        openSignup,
        closeModal,
        setIsLogin,
      }}>
      {children}
    </ModalContext.Provider>
  );
}
