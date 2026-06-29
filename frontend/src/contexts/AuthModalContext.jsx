import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ authModalOpen, setAuthModalOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
};