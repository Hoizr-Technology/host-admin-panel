import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  title: string;
  description: string;
}

const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
}: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleResend = () => {
    // Resend OTP logic would go here
    setTimer(30);
    setShowResend(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-surface rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-primary mb-6">{description}</p>

            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value.substring(0, 6));
                }}
                className="input input-primary w-full text-center text-lg"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              {showResend ? (
                <button
                  onClick={handleResend}
                  className="text-primary hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-primary">Resend in {timer} seconds</span>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => onVerify(otp)}
                disabled={otp.length !== 6}
                className="btn btn-primary flex-1"
              >
                Verify
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OtpModal;
