import useGlobalStore from "@/store/global";
import { FC, useEffect } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
}

export const Toast: FC<ToastProps> = ({ message, type }) => {
  const { setToastData } = useGlobalStore(); // Access the setToastData function from the global store

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          container: "text-black bg-primary",
          icon: "bg-white text-greenNeon",
          iconPath: (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          ),
        };
      case "error":
        return {
          container: "text-white bg-red-500",
          icon: "bg-white text-red-500",
          iconPath: (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
          ),
        };
      case "warning":
        return {
          container: "text-white bg-blue-500",
          icon: "bg-white text-blue-500",
          iconPath: (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
          ),
        };
      default:
        return { container: "", icon: "", iconPath: null };
    }
  };

  const { container, icon, iconPath } = getTypeStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastData(null); // Clear the toast after 3000 milliseconds (3 seconds)
    }, 3000);

    return () => clearTimeout(timer);
  }, [setToastData]);

  return createPortal(
    <div
      className={`fixed bottom-4 right-4 flex items-center w-full max-w-xs p-4 mb-4 rounded-xl shadow ${container}`}
      role="alert"
      style={{ zIndex: 1000 }}
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl ${icon}`}
      >
        {iconPath}
        <span className="sr-only">
          {type === "success"
            ? "Check"
            : type === "error"
            ? "Error"
            : "Warning"}{" "}
          icon
        </span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 rounded-xl p-1.5 inline-flex items-center justify-center h-8 w-8 text-white"
        aria-label="Close"
        onClick={() => setToastData(null)}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default Toast;
