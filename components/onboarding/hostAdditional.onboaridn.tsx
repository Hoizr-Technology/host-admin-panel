import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { useOnboardingStore } from "@/store/onboarding";

const HostAdditionalDetails = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);

  // Get additional details from store
  const {
    businessRegistrationNumber,
    setBusinessRegistrationNumber,
    averageEventSize,
    setAverageEventSize,
    gstNumber,
    setGstNumber,
    websiteUrl,
    setWebsiteUrl,
  } = useOnboardingStore();

  // Initialize local state with store values
  const [localFormData, setLocalFormData] = useState({
    businessRegistrationNumber: businessRegistrationNumber || "",
    averageEventSize: averageEventSize || 0,
    gstNumber: gstNumber || "",
    websiteUrl: websiteUrl || "",
  });

  // Update store when local state changes
  useEffect(() => {
    setBusinessRegistrationNumber(localFormData.businessRegistrationNumber);
    setAverageEventSize(localFormData.averageEventSize);
    setGstNumber(localFormData.gstNumber);
    setWebsiteUrl(localFormData.websiteUrl);
  }, [
    localFormData,
    setBusinessRegistrationNumber,
    setAverageEventSize,
    setGstNumber,
    setWebsiteUrl,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: name === "averageEventSize" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);

      // Save additional details (optional fields)
      await sdk.hostOnboarding({
        input: {
          businessRegistrationNumber:
            localFormData.businessRegistrationNumber || null,
          averageEventSize: localFormData.averageEventSize || null,
          gstNumber: localFormData.gstNumber || null,
          websiteUrl: localFormData.websiteUrl || null,
        },
      });

      // Complete onboarding
      await sdk.completeHostOnboarding({});

      router.push("/account/blockers/internalVerificationPending");
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
      className="w-full mb-auto min-h-full sm:px-12 max-w-3xl flex flex-col justify-between bg-transparent items-center space-y-6 text-center relative"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <h1 className="text-3xl text-primary sm:text-4xl font-bold leading-tight mb-6">
        Additional Business Details
      </h1>

      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          {/* Business Registration Number */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Business Registration Number
            </label>
            <input
              type="text"
              name="businessRegistrationNumber"
              value={localFormData.businessRegistrationNumber}
              onChange={handleChange}
              className="input input-primary w-full"
              placeholder="Enter registration number (optional)"
            />
          </div>

          {/* Average Event Size */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Average Event Size
            </label>
            <input
              type="number"
              name="averageEventSize"
              value={localFormData.averageEventSize || ""}
              onChange={handleChange}
              className="input input-primary w-full"
              placeholder="Estimated number of attendees (optional)"
              min="0"
            />
          </div>

          {/* GST Number */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={localFormData.gstNumber}
              onChange={handleChange}
              className="input input-primary w-full"
              placeholder="Enter GST number (optional)"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={localFormData.websiteUrl}
              onChange={handleChange}
              className="input input-primary w-full"
              placeholder="https://yourvenue.com (optional)"
            />
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 text-left">
            <h3 className="text-primary font-semibold mb-2">
              Note About Additional Information
            </h3>
            <p className="text-sm text-gray-400">
              These details are optional but may help us verify your business
              faster. You can skip this step and provide this information later.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          loading={btnLoading}
          variant={ButtonType.Secondary}
          onClick={() => router.push("/onboarding/host/location")}
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
          Complete Account
        </CButton>
      </div>
    </motion.div>
  );
};

export default HostAdditionalDetails;
