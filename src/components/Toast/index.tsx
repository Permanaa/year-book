import { Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useCallback } from "react";
import cx from "@utils/classnames";
import { XMarkIcon, CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@context/toast";

export type ToastProps = {
  open: boolean;
  message?: string;
  variant?: "info" | "error" | "success";
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  open = false,
  message,
  variant = "info",
  duration = 5000
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { setToast } = useToast();

  const onClose = useCallback(() => {
    setIsOpen(false);
    setToast((prev) => ({ ...prev, open: false }));
  }, [setToast]);

  const variantClassname = {
    "info": "text-blue-500 bg-blue-100",
    "error": "text-red-500 bg-red-100",
    "success": "text-green-500 bg-green-100",
  }[variant];

  const variantIcon = {
    "info": <ExclamationCircleIcon className="h-5 w-5" />,
    "error": <XMarkIcon className="h-5 w-5" />,
    "success": <CheckIcon className="h-5 w-5" />,
  }[variant];

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timeId);
    };
  }, [duration, open, onClose]);

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition duration-75 ease-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <div
        id="toast-default"
        className="fixed bottom-6 right-6 flex items-center p-4 max-w-xs w-full rounded-lg shadow-md text-gray-500 bg-white"
        role="alert"
      >
        <div className={cx(
          "inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg",
          variantClassname
        )}>
          {variantIcon}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg inline-flex items-center justify-center h-8 w-8 bg-white text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100"
          data-dismiss-target="#toast-default"
          aria-label="Close"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </Transition>
  );
};

export default Toast;
