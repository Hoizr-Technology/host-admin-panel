import { cn } from "@/lib/utils";
import { fadeIn } from "@/utils/animations/animation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: "xs" | "sm" | "md" | "ml" | "lg" | "xl" | "dxl";
  title: string;
  comments?: string;
  className?: string;
}

const ReusableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  width = "md",
  title,
  comments,
  className = "rounded-2xl",
}) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as Element).classList.contains("modal-overlay")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  const widthClasses = {
    xs: "w-11/12 lg:w-1/5",
    sm: "w-11/12 lg:w-1/4 ",
    md: "w-11/12 lg:w-1/3 ",
    ml: "w-11/12 lg:w-1/2 ",
    lg: "w-11/12 lg:w-3/4 ",
    xl: "w-11/12 lg:w-[95vw] ",
    dxl: "w-11/12 lg:w-11/12",
  };

  if (!isOpen) return;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay fixed inset-0 bg-black bg-opacity-45 flex items-center justify-center z-50"
        >
          <motion.div
            // variants={fadeIn("up", "tween", 0, 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={cn(
              `rounded shadow-lg bg-black ${widthClasses[width]} max-h-[95vh] overflow-y-auto z-10`,
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-5 px-6">
              <div className="flex items-start justify-between pb-2 rounded-t">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="text-black bg-transparent hover:bg-surface hover:text-gray-900 rounded-xl text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-primary dark:hover:text-white"
                  onClick={onClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {comments && (
                <p
                  className="text-sm text-white/80
           mb-4"
                >
                  {comments}
                </p>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ReusableModal;
