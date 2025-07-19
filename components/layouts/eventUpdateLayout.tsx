import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import logo1 from "../../assets/logo/text.png";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/functions/common";
import dynamicOnboardingAnimation from "../../assets/gif/dynamicOnboarding.json";
import Lottie from "lottie-react";
import {
  FiCalendar,
  FiMapPin,
  FiMusic,
  FiDollarSign,
  FiInfo,
} from "react-icons/fi";

type Props = {
  children: ReactNode;
};

const steps = [
  {
    title: "Event Basics",
    description: "Set the foundation for your event",
    step: "1/4",
    link: "basic-info",
    icon: FiInfo,
  },
  {
    title: "Location",
    description: "Where will your event take place?",
    step: "2/4",
    link: "location",
    icon: FiMapPin,
  },
  {
    title: "Music Genres",
    description: "What genres are you looking for?",
    step: "3/4",
    link: "genres",
    icon: FiMusic,
  },
  {
    title: "Final Details",
    description: "Set audience, budget, and upload pictures",
    step: "4/4",
    link: "additional-info",
    icon: FiDollarSign,
  },
];

const EventUpdateLayout = ({ children }: Props) => {
  const router = useRouter();
  const { query } = router;
  const { eventRoute } = query;
  const { setToastData } = useGlobalStore();

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

  const currentStep = steps.find((step) => step.link === eventRoute);

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex lg:w-2/5 flex-col bg-background">
        <div className="flex justify-between items-center p-6">
          <div className="flex-shrink-0">
            <Image src={logo1} alt="Logo" width={140} height={35} />
          </div>

          {/* Logout Button - Top Right */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:underline hover:text-red-600 transition-colors duration-200"
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

              {/* Step Icon */}
              <div className="mt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                  <currentStep.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-6">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.link}
                className={`flex items-center p-3 rounded-lg ${
                  step.link === eventRoute
                    ? "bg-primary/10 border border-primary"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.link === eventRoute
                      ? "bg-primary text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-primary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
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
              <h2 className="text-lg font-semibold text-white">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 text-sm">{currentStep.description}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-3 lg:p-5 max-h-screen">
          <div className="w-full h-full max-w-2xl mx-auto">
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

export default EventUpdateLayout;
