import { motion } from "framer-motion";
import { useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { FiUsers, FiDollarSign, FiImage, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useEventUpdateStore } from "@/store/eventUpdate.store";
import OtpModal from "../common/modal/otpModal";

type AdditionalInfoStepProps = {
  isEdit: boolean;
};

const AdditionalInfoStep = ({ isEdit }: AdditionalInfoStepProps) => {
  const router = useRouter();
  const { eventId } = router.query;
  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpKey, setOtpKey] = useState("");

  const {
    expectedAudience,
    setExpectedAudience,
    budget,
    setBudget,
    currency,
    setCurrency,
    pictures,
    addPicture,
    removePicture,
    reset,
  } = useEventUpdateStore();

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "client_uploads");
    formData.append("folder", "events/pictures");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duhefgqh4/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        setToastData({
          message: "File size should be less than 5MB",
          type: "error",
        });
        return;
      }

      setImageUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        addPicture(url);
      } catch (error) {
        setToastData({
          message: "Failed to upload image",
          type: "error",
        });
      } finally {
        setImageUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    if (expectedAudience <= 0 || budget.min <= 0 || budget.max <= 0) {
      setToastData({
        message: "Please fill in all required fields with valid values",
        type: "error",
      });
      return;
    }

    try {
      setBtnLoading(true);
      const response = await sdk.updateEvent({
        eventId: eventId as string,
        isFinalStep: true,
        input: {
          expectedAudience,
          budget: {
            min: budget.min,
            max: budget.max,
          },
          currency,
          pictures,
        },
      });

      if (isEdit) {
        router.push("/events");
        setToastData({
          message: "Event updated successfully!",
          type: "success",
        });
      } else {
        setOtpKey(response.updateEvent.otpKey);
        setShowOtpModal(true);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
      reset();
    }
  };

  const handleOtpVerification = async (otp: string) => {
    try {
      setBtnLoading(true);
      await sdk.complcompleteEventCreationet({
        eventId: eventId as string,
        otpId: otpKey,
        otp,
      });

      setShowOtpModal(false);
      router.push("/events");
      setToastData({
        message: "Event created successfully!",
        type: "success",
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full mb-auto sm:px-12 max-w-3xl flex flex-col justify-between bg-transparent items-center space-y-6 text-center relative"
      // ... animation props ...
    >
      <h1 className="text-3xl font-medium text-white">Final Details</h1>
      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          {/* Expected Audience */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Expected Audience *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="text-gray-400" />
              </div>
              <input
                type="number"
                value={expectedAudience}
                onChange={(e) => setExpectedAudience(Number(e.target.value))}
                className="input input-primary w-full pl-10"
                placeholder="Estimated number of attendees"
                min="1"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Minimum Budget *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={budget.min}
                  onChange={(e) =>
                    setBudget(Number(e.target.value), budget.max)
                  }
                  className="input input-primary w-full pl-10"
                  placeholder="Min"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Maximum Budget *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={budget.max}
                  onChange={(e) =>
                    setBudget(budget.min, Number(e.target.value))
                  }
                  className="input input-primary w-full pl-10"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Currency *
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="select select-primary w-full"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="INR">Indian Rupee (INR)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
            </select>
          </div>

          {/* Event Pictures */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Event Pictures
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {pictures.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Event ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePicture(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <FiX className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag and drop an image, or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          variant={ButtonType.Secondary}
          onClick={() => router.push(`/event-update/genres?eventId=${eventId}`)}
          className="w-full"
        >
          Back
        </CButton>
        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          onClick={handleSubmit}
          className="w-full"
        >
          {isEdit ? "Update Event" : "Complete"}
        </CButton>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerification}
        title="Verify Event Creation"
        description="For security, please enter the verification code sent to your email."
      />
    </motion.div>
  );
};

export default AdditionalInfoStep;
