import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";

import useUserStore from "@/store/user";
import { sdk } from "@/utils/graphqlClient";
import { ArrowRightIcon, Loader, StoreIcon } from "lucide-react";
import {
  Figtree,
  Karla,
  Libre_Caslon_Display,
  Tenor_Sans,
} from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { SidebarProvider } from "../ui/sidebar";
import useAuthStore from "@/store/authStore";
import { extractErrorMessage, sanitizeText } from "@/utils/functions/common";
import AppSidebar from "../navigation/sidebar";
import Navbar from "../navbar/navBar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configs
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Add");
  const [loading, setLoading] = useState(true);
  const [existingTaxRateId, setExistingTaxRateId] = useState<string | null>(
    null
  );

  // Global and Local States
  const { control, handleSubmit, getValues, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      salesTax: "",
      default: false,
    },
  });

  const { meUser } = useUserStore();

  const { setMasterStates, setMasterTimezones } = useMasterStore();
  const {
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
    setprofileId,
  } = useAuthStore();
  const { setToastData } = useGlobalStore();

  const [multiAccountLoading, setMultiAccountLoading] = useState(false);
  const [multiAccounts, setMultiAccounts] = useState<
    { _id: string; businessName: string }[]
  >([]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await sdk.MeUser();
      if (response?.meUser) {
        const {
          _id,
          firstName,
          lastName,
          status,
          email,
          authType,
          isVerified,
          phoneNumber,
          profileId,
          userType,
        } = response.meUser;

        useUserStore.getState().setMeUser({
          _id,
          firstName,
          lastName,
          status,
          email,
          phone: phoneNumber ?? "",
          profileId,
          isVerified,
          userType,
        });
        setUserId(_id);
        setFirstName(firstName);
        setLastName(lastName);
        setStatus(status);
        setEmail(email);
        setPhone(phoneNumber ?? "");
        setprofileId(profileId);
      }
    } catch (error) {
      setToastData({ message: extractErrorMessage(error), type: "error" });
    }
  }, [
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setToastData,
    setUserId,
  ]);

  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchUserDetails();
      setLoading(false);
    };

    fetchData();
  }, [fetchUserDetails]);

  useEffect(() => {
    const fetchMasterData = async () => {
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
        // const resTimeZones = await sdk.getActiveTimezones();
        // if (resTimeZones && resTimeZones.getActiveTimezones) {
        //   const formattedTimeZones = resTimeZones.getActiveTimezones.map(
        //     (timeZone: { gmtOffset: number; value: string; _id: string }) => {
        //       const gmtOffsetHours = timeZone.gmtOffset / 3600;
        //       const sign = gmtOffsetHours >= 0 ? "+" : "-";
        //       const formattedLabel = `${timeZone.value} (GMT ${sign} ${Math.abs(
        //         gmtOffsetHours
        //       )})`;
        //       return {
        //         value: timeZone._id,
        //         label: formattedLabel,
        //       };
        //     }
        //   );
        //   setMasterTimezones(formattedTimeZones);
        // }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetchMasterData();
  }, [setMasterStates, setMasterTimezones, setToastData]);

  useEffect(() => {
    if (!loading) {
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <div
        className={`flex flex-col w-full bg-surface !overflow-x-hidden h-screen`}
      >
        <Navbar />
        <div className="w-full flex-1 px-4 lg:px-6 my-2 lg:my-4">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
