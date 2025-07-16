import { ProfileStatus } from "@/generated/graphql";
import { GetServerSidePropsResult } from "next";

export const redirectPathFromStatus = (
  status: ProfileStatus
): GetServerSidePropsResult<any> => {
  switch (status) {
    case ProfileStatus.Blocked:
      return {
        redirect: {
          destination: "/account/blockers/account-blocked",
          permanent: false,
        },
      };
    case ProfileStatus.OnboardingPending:
      return {
        redirect: {
          destination: "/onboarding/artist/about-us",
          permanent: false,
        },
      };
    case ProfileStatus.InternalVerificationPending:
      return {
        redirect: {
          destination: "/account/blockers/internalVerificationPending",
          permanent: false,
        },
      };
    case ProfileStatus.Active:
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    default:
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
  }
};
