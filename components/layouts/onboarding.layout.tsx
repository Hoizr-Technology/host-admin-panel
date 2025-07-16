import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { BsFillBriefcaseFill } from "react-icons/bs";
import {
  FiMapPin,
  FiUser,
  FiMusic,
  FiStar,
  FiDollarSign,
} from "react-icons/fi";
import logo1 from "../../assets/logo/text.png";
import { extractErrorMessage } from "@/utils/functions/common";
import useMasterStore from "@/store/masters";
import dynamicOnboardingAnimation from "../../assets/gif/dynamicOnboarding.json";
import Lottie from "lottie-react";

type Props = {
  children: ReactNode;
};
const steps = [
  {
    title: "Your Stage Starts Here",
    description:
      "Build your profile, get discovered, and turn your talent into bookings.",
    step: "1/6",
    link: "about-us",
    icon: FiUser,
  },
  {
    title: "Show the World What You Do Best",
    description:
      "Select your artist type so we can match you with the right gigs and hosts.",
    step: "2/6",
    link: "artist-type",
    icon: FiMusic,
  },
  {
    title: "Profile Setup",
    description: "Set up your stage name, bio, and profile picture",
    step: "3/6",
    link: "profile-setup",
    icon: BsFillBriefcaseFill,
  },
  {
    title: "Genres",
    description: "What genres do you specialize in?",
    step: "4/6",
    link: "genres",
    icon: FiStar,
  },
  {
    title: "Location",
    description: "Where are you located?",
    step: "5/6",
    link: "location",
    icon: FiMapPin,
  },
  {
    title: "Experience & Rates",
    description: "Tell us about your experience and rates",
    step: "6/6",
    link: "experience-rates",
    icon: FiDollarSign,
  },
];

const OnboardingLayout = ({ children }: Props) => {
  const router = useRouter();
  const { query } = router;
  const { onboardingRoute } = query;
  const { setToastData } = useGlobalStore();
  const { setMasterStates, setMasterTimezones } = useMasterStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const resstates = await sdk.getActiveStates();
        if (resstates && resstates.getActiveStates) {
          const formattedStates = resstates.getActiveStates.map(
            (state: { value: string; _id: string }) => ({
              value: state._id,
              label: state.value,
            })
          );
          setMasterStates(formattedStates);
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetch();
  }, [setMasterStates, setMasterTimezones, setToastData]);

  const handleLogout = async () => {
    try {
      const response = await sdk.hostLogout();
      if (response && response.hostLogout) {
        router.replace("/login");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const currentStep = steps.find((step) => step.link === onboardingRoute);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Sidebar - Only visible on desktop */}
      <div className="hidden lg:flex lg:w-2/5 flex-col bg-background">
        {/* Top Section - Logo and Logout */}
        <div className="flex justify-between items-center p-6">
          {/* Logo - Top Left */}
          <div className="flex-shrink-0">
            <Image src={logo1} alt="Logo" width={140} height={35} />
          </div>

          {/* Logout Button - Top Right */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:underline  hover:text-red-600 transition-colors duration-200"
          >
            <LogOutIcon size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Middle Section - Current Step Info */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 relative">
          {/* Background GIF - Only visible on desktop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Lottie
              animationData={dynamicOnboardingAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 600, height: 600, opacity: 0.3 }}
            />
          </div>

          {currentStep && (
            <div className="text-center text-white relative z-10">
              <div className="mb-2">
                <span className="text-sm text-primary font-medium">
                  Step {currentStep.step}
                </span>
              </div>
              <h1 className="text-2xl xl:text-3xl font-bold mb-4">
                {currentStep.title}
              </h1>
              <p className="text-lg">{currentStep.description}</p>
            </div>
          )}
        </div>
        {/* Bottom Footer */}
        <div className="flex justify-between items-start gap-2 p-2 border-t border-gray-200">
          {/* Company Name */}
          <div className="text-xs text-gray-500">
            HOIZR TECHNOLOGIES PRIVATE LIMITED
          </div>

          {/* Support Button */}
          <button
            onClick={() => {
              // Add your support functionality here
              console.log("Support clicked");
            }}
            className="text-sm font-medium text-primary cursor-pointer hover:underline transition-colors duration-200"
          >
            Support
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 lg:w-3/5 flex flex-col min-h-screen">
        {/* Mobile Header - Only visible on mobile */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-background">
          <div className="flex-shrink-0">
            <Image src={logo1} alt="Logo" width={120} height={30} />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <LogOutIcon size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Step Info - Only visible on mobile */}
        <div className="lg:hidden px-4 py-4 border-b border-gray-200">
          {currentStep && (
            <div className="text-start text-white">
              <div className="mb-1">
                <span className="text-sm text-primary font-medium">
                  Step {currentStep.step}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{currentStep.description}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-3 lg:p-5 max-h-screen">
          <div className="w-full h-full max-w-2xl  mx-auto">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>
        </div>

        {/* Mobile Footer - Only visible on mobile */}
        <div className="lg:hidden flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 border-t border-white bg-background">
          <div className="text-xs text-gray-500 order-2 sm:order-1">
            Hoizr Technologies Private Limited
          </div>
          <button
            onClick={() => {
              console.log("Support clicked");
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 order-1 sm:order-2"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
