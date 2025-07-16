import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import logo1 from "../../assets/logo/text.png";
import { extractErrorMessage } from "@/utils/functions/common";
import { ButtonType } from "../common/buttons/interface";
import CButton from "../common/buttons/button";

type Props = {
  children: ReactNode;
};

const BlockerLayouout = ({ children }: Props) => {
  const router = useRouter();
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

  return (
    <div className="bg-gradient-to-b bg-background text-white min-h-[90vh] flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 py-2 border-b h-10">
        <div></div>

        <div>
          <CButton
            variant={ButtonType.Text}
            onClick={handleLogout}
            type="button"
          >
            <div className="flex flex-row justify-between items-center space-x-2 text-red-500 transition-all hover:scale-[1.05]">
              <LogOutIcon size={15} />
              <span>Log Out</span>
            </div>
          </CButton>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-10 max-h-[calc(100vh-88px)]">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
      <div className="fixed w-full bottom-0 flex items-center justify-between px-10 py-2 h-12 border-t ">
        <Image src={logo1} alt="Logo" width={120} height={120} />
        <div className=" flex flex-col justify-start items-end space-y-1 text-xs">
          <Link
            className="text-primary hover:underline"
            href="mailto:support@choosepos.com"
            target="_blank"
          >
            Need Help? <span className="text-white">support@hoizr.com</span>
          </Link>
          <div className="flex space-x-2">
            <Link
              className="text-primary hover:underline"
              href="https://www.choosepos.com/terms-conditions"
              target="_blank"
            >
              {" "}
              Terms and Conditions{" "}
            </Link>
            <Link
              className="text-primary hover:underline"
              href="https://www.choosepos.com/privacy-policy"
              target="_blank"
            >
              {" "}
              Privacy Policy{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockerLayouout;
