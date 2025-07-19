import { motion } from "framer-motion";
import { useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { FiMapPin, FiLock } from "react-icons/fi";
import { useEventUpdateStore } from "@/store/eventUpdate.store";

const LocationStep = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const { location } = useEventUpdateStore();

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      await sdk.updateEvent({
        eventId: eventId as string,
        isFinalStep: false,
        input: {},
      });
      router.push(`/event-update/genres?eventId=${eventId}`);
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
      <h1 className="text-3xl font-medium text-white">Event Location</h1>
      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          <div className="bg-secondaryBg rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FiLock size={18} />
              <span className="font-medium">Location Locked</span>
            </div>
            <p className="text-sm text-gray-500">
              The event location is set to your venue's address and cannot be
              changed here. Please contact support at hoizr.tech@gmail.com to
              modify.
            </p>
          </div>

          {/* Display location details */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Address Line 1
              </label>
              <input
                type="text"
                value={location.addressLine1}
                readOnly
                disabled
                className="input input-primary disabled:opacity-75"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Address Line 2
              </label>
              <input
                type="text"
                value={location.addressLine2}
                readOnly
                disabled
                className="input input-primary disabled:opacity-75"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  value={location.city}
                  readOnly
                  disabled
                  className="input input-primary disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                  State
                </label>
                <input
                  type="text"
                  value={location.state?.value || ""}
                  readOnly
                  disabled
                  className="input input-primary disabled:opacity-75"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Zipcode
              </label>
              <input
                type="text"
                value={location.zipcode}
                readOnly
                disabled
                className="input input-primary disabled:opacity-75"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          variant={ButtonType.Secondary}
          onClick={() =>
            router.push(`/event-update/basic-info?eventId=${eventId}`)
          }
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
          Continue
        </CButton>
      </div>
    </motion.div>
  );
};

export default LocationStep;
