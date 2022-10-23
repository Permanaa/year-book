import React, { createContext, useContext, useState } from "react";
import Toast, { ToastProps } from "@components/Toast";

type ToastContextProps = {
  children: React.ReactNode
}

type ToastContextType = {
  toast: ToastProps;
  setToast: React.Dispatch<React.SetStateAction<ToastProps>>;
}

const toastDefault: ToastProps = {
  open: false,
  message: "",
  variant: "info",
  duration: 5000
};

const ToastContext = createContext<ToastContextType>({
  toast: toastDefault,
  setToast: () => undefined,
});

const useToast = () => useContext(ToastContext);

const ToastProvider: React.FC<ToastContextProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps>(toastDefault);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      <Toast {...toast} />
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider, useToast };

export default ToastProvider;
