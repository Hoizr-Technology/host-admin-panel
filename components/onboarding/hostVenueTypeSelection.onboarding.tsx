import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiCoffee,
  FiMusic,
  FiStar,
  FiHome,
  FiGlobe,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { LuArmchair } from "react-icons/lu";
import { MdHotel } from "react-icons/md";
import { VenueType } from "@/generated/graphql"; // Import VenueType enum
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { useOnboardingStore } from "@/store/onboarding";

// Updated venue types array
const venueTypes = [
  {
    type: VenueType.Bar,
    label: "Bar",
    icon: <FiCoffee className="h-10 w-10" />,
    description: "Bar or pub hosting live music",
  },
  {
    type: VenueType.Club,
    label: "Club",
    icon: <FiMusic className="h-10 w-10" />,
    description: "Nightclub or music venue",
  },
  {
    type: VenueType.ConcertHall,
    label: "Concert Hall",
    icon: <FiStar className="h-10 w-10" />,
    description: "Dedicated concert venue",
  },
  {
    type: VenueType.Festival,
    label: "Festival",
    icon: <FiGlobe className="h-10 w-10" />,
    description: "Music festival or outdoor event",
  },
  {
    type: VenueType.Outdoor,
    label: "Outdoor",
    icon: <FiGlobe className="h-10 w-10" />,
    description: "Outdoor event space",
  },
  {
    type: VenueType.PrivateEvent,
    label: "Private Event",
    icon: <FiUser className="h-10 w-10" />,
    description: "Private parties or corporate events",
  },
  {
    type: VenueType.Restaurant,
    label: "Restaurant",
    icon: <FiHome className="h-10 w-10" />,
    description: "Restaurant with live music",
  },
  {
    type: VenueType.Lounge,
    label: "Lounge",
    icon: <LuArmchair className="h-10 w-10" />,
    description: "Chic, cozy venues with music and ambiance",
  },
  {
    type: VenueType.Hotel,
    label: "Hotel",
    icon: <MdHotel className="h-10 w-10" />,
    description: "Hotel venues, rooftops, ballrooms, or poolside events",
  },
];

const HostVenueTypeSelection = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);

  // Get venueType from store and its setter
  const { venueType, setVenueType } = useOnboardingStore();

  // Initialize local state with value from store
  const [selectedType, setSelectedType] = useState<VenueType | null>(
    venueType as VenueType
  );

  // Update store whenever selectedType changes
  useEffect(() => {
    if (selectedType) {
      setVenueType(selectedType);
    }
  }, [selectedType, setVenueType]);

  const handleSubmit = async () => {
    if (!selectedType) {
      setToastData({
        message: "Please select a venue type",
        type: "error",
      });
      return;
    }

    try {
      setBtnLoading(true);
      // Update mutation to host onboarding
      await sdk.hostOnboarding({
        input: {
          venueType: selectedType,
        },
      });

      router.push("/onboarding/host/host-basic-info");
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
        What Type of Venue Do You Represent?
      </h1>
      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {venueTypes.map((typeInfo) => (
              <div
                key={typeInfo.type}
                className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedType === typeInfo.type
                    ? "border-primary ring-2 ring-primary ring-opacity-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setSelectedType(typeInfo.type)}
              >
                <div className="flex flex-col items-center">
                  <div className="text-primary mb-2">{typeInfo.icon}</div>
                  <h3 className="text-lg font-medium">{typeInfo.label}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {typeInfo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          loading={btnLoading}
          variant={ButtonType.Secondary}
          onClick={router.back}
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

export default HostVenueTypeSelection;
