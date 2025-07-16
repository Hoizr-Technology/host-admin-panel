import BlockerLayout from "@/components/layouts/blockerLayout";
import { ProfileStatus, UserStatus } from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React from "react";
import blocked from "../../../../assets/svg/blocked.svg";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const PaymentPending: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-2 py-3 w-full max-w-xl mx-auto flex flex-col space-y-8">
        <div className="flex flex-col items-center text-center p-4 space-y-5">
          <Image src={blocked} alt="Blocked Icon" width={64} height={64} />

          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Account Access Restricted
            </h1>
            <p className="text-gray-600 whitespace-pre-line">
              {`We've temporarily suspended your account access for security
              reasons.`}
            </p>
            <p className="text-gray-600 mt-2">
              To protect our restaurant community, we take unusual activity or
              verification issues seriously.
            </p>
            <p className="text-gray-600 mt-2">
              Please contact{" "}
              <CButton
                variant={ButtonType.Text}
                type="button"
                onClick={() => {
                  window.location.href = "mailto:hoizr.tech@gmail.com";
                }}
              >
                hoizer.tech@gmail.com
              </CButton>
              to verify your credentials and restore access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentPending.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default PaymentPending;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";

  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.meCheckHost(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meHost) {
      const { status } = response.meHost;

      const redirectUrl = redirectPathFromStatus(
        status ?? ProfileStatus.Blocked
      );
      if (status === ProfileStatus.Blocked) {
        return {
          props: {},
        };
      }
      return redirectUrl;
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    // console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
