import MainLayout from "@/components/layouts/mainBodyLayout";
import { ProfileStatus } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import useUserStore from "@/store/user";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { sdk } from "@/utils/graphqlClient";
import { Loader } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  hasAccess: boolean;
};

const Dashboard: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setToastData } = useGlobalStore();

  const router = useRouter();

  useEffect(() => {
    const date = new Date();
    const iso = date.toISOString();
  }, []);

  const { meUser } = useUserStore();

  if (!repo) {
    return <Loader />;
  }

  if (!repo.hasAccess) {
    return "You do not have access to this page";
  }

  return <div>Hi</div>;
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Dashboard;

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

    const { status } = response.meHost;
    const redirectUrl = redirectPathFromStatus(status ?? ProfileStatus.Blocked);
    if (status === ProfileStatus.Active) {
      return {
        props: {},
      };
    }
    return redirectUrl;
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
